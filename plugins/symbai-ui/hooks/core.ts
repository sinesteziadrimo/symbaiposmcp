import { atom, read, update } from 'claude-code'
import type { EngineInterface as Api, McpToolResult } from 'claude-code'

import { errorOf, jsonOf, str, strings, textOf } from './util'
import type { Assistant, AssistantDetail, Editing, Machine, PosLine, Selected, Snapshot, WhatsAppLine } from '../types'

// Reading the conversations and the long-text editing both the pane and the editor use.
// The values are the pane's own: a ref names the value, so every module shares it.
const snapshot = atom({ plugin: 'symbai-ui', key: 'snapshot' } as const, null)
const isLoading = atom({ plugin: 'symbai-ui', key: 'isLoading' } as const, false)
const selected = atom({ plugin: 'symbai-ui', key: 'selected' } as const, null)
const detail = atom({ plugin: 'symbai-ui', key: 'detail' } as const, null)
const notice = atom({ plugin: 'symbai-ui', key: 'notice' } as const, null)
const editing = atom({ plugin: 'symbai-ui', key: 'editing' } as const, null)

// The first line of the prompt box while a prompt is being edited there. Enter saves the rest;
// a submission without it is a normal prompt again.
export const EDIT_MARK = '✎ PROMPT '

export type Servers = { whatsapp: string[]; pos: string[] }

export function splitMcpName(name: string): { server: string; tool: string } | null {
  if (!name.startsWith('mcp__')) return null
  const cut = name.lastIndexOf('__')
  if (cut <= 5) return null
  return { server: name.slice(5, cut), tool: name.slice(cut + 2) }
}

export async function findServers($: Api): Promise<Servers> {
  const servers: Servers = { whatsapp: [], pos: [] }
  for (const tool of await $.tool.list()) {
    if (!tool.mcp) continue
    const parts = splitMcpName(tool.name)
    if (!parts || !parts.server.startsWith('symbai')) continue
    if (parts.tool === 'list_watches') servers.whatsapp.push(parts.server)
    if (parts.tool === 'verifica_conexiune') servers.pos.push(parts.server)
  }
  return servers
}

export function toAssistant(server: string, raw: Record<string, any>): Assistant {
  const chat = raw.conversatie ?? {}
  const run = raw.ultimaRulare ?? null
  return {
    id: String(raw.id ?? ''),
    server,
    name: str(chat.nume) ?? str(chat.jid) ?? 'fără nume',
    kind: chat.tip === 'grup' ? 'grup' : 'contact',
    isActive: raw.activa === true,
    mode: str(raw.mod) ?? '',
    runner: str(raw.dispatch) ?? '',
    lastRunState: run ? str(run.stare) : null,
    lastRunAt: run ? str(run.la) : null,
    lastRunSummary: run ? str(run.rezumat) : null,
    lastMessageAt: str(raw.ultimulMesaj),
    stopReason: str(raw.motivOprire),
    tip: str(raw.sfat),
    runs: typeof raw.rulari === 'number' ? raw.rulari : 0,
  }
}

export function toMachine(body: Record<string, any> | null): Machine {
  const claude = body?.pregatire ?? null
  const codex = body?.pregatireCodex ?? null
  // Not ready: not installed (cliFound false) or not logged in.
  const ready = (one: any): boolean | null =>
    one && typeof one.loggedIn === 'boolean' ? one.loggedIn && one.cliFound !== false : null
  const problems = [...strings(claude?.problems)]
  // A company Codex cannot reach is said once, by name; the raw line repeats it.
  const blocked = Array.isArray(codex?.connections)
    ? codex.connections.filter((one: any) => one?.state === 'blocked').map((one: any) => String(one.name))
    : []
  for (const name of blocked) problems.push(`Codex nu poate intra în firma „${name}”. Asistenții Codex care lucrează acolo vor da eroare.`)
  if (codex && codex.loggedIn === false) problems.push('Codex nu este autentificat pe acest calculator.')
  return { claudeReady: ready(claude), codexReady: ready(codex), problems }
}

export type Problem = {
  title: string
  explain: string
  // reset: forget the lost conversation; rerun: try again now; resume: start it again.
  fix: 'reset' | 'rerun' | 'resume' | null
}

export function causeOf(text: string): Problem {
  const first = text.split('\n')[0].trim()
  if (/no rollout found/i.test(text)) {
    return {
      title: 'Și-a pierdut conversația salvată',
      explain: 'Codex nu mai găsește discuția lui de dinainte, așa că nu poate continua. „Repară” o ia de la zero; promptul și notițele rămân.',
      fix: 'reset',
    }
  }
  if (/limit/i.test(text)) {
    return {
      title: 'Contul a atins limita de folosire',
      explain: 'Încearcă din nou după ce se resetează limita sau schimbă cine lucrează (Codex / Claude Code).',
      fix: 'rerun',
    }
  }
  if (/not logged|login|autentific/i.test(text)) {
    return {
      title: 'Programul care îl rulează nu e autentificat',
      explain: 'Autentifică-l din Symbai Connect (secțiunea Monitorizări), apoi încearcă din nou.',
      fix: 'rerun',
    }
  }
  return { title: 'Ultima rulare a eșuat', explain: first || 'Fără detalii de la Connect.', fix: 'rerun' }
}

// What needs the person now, in plain words; null when nothing does.
export function problemOf(one: Assistant, machine: Machine | null): Problem | null {
  // Active, or stopped by its failures: it cannot work until the computer is ready, so no start is offered.
  const isWaiting = one.isActive || one.stopReason !== null
  if (isWaiting && one.runner === 'claude' && machine?.claudeReady === false) {
    return {
      title: 'Nu poate lucra: Claude Code nu e pregătit pe calculator',
      explain: 'Apasă „Autentifică Claude Code” în Symbai Connect (Monitorizări) sau mută-l pe Codex.',
      fix: null,
    }
  }
  if (isWaiting && one.runner === 'codex' && machine?.codexReady === false) {
    return {
      title: 'Nu poate lucra: Codex nu e pregătit pe calculator',
      explain: 'Autentifică Codex pe acest calculator sau mută-l pe Claude Code.',
      fix: null,
    }
  }
  if (!one.isActive) {
    if (!one.stopReason) return null
    const cause = causeOf(one.stopReason)
    return {
      title: 'S-a oprit singur după mai multe erori',
      explain: `${cause.title}. ${cause.fix === 'reset' ? '„Repară” îl ia de la zero și îl pornește; ' : '„Pornește” îl reia; '}preia și mesajele venite cât a stat oprit.`,
      fix: cause.fix === 'reset' ? 'reset' : 'resume',
    }
  }
  // „Sesiunea Claude” has no automatic runs: a failed one is from before it moved there.
  if (one.lastRunState === 'failed' && one.runner !== 'stream') return causeOf(one.lastRunSummary ?? '')
  return null
}

export function toDetail(server: string, raw: Record<string, any>): AssistantDetail {
  return {
    ...toAssistant(server, raw),
    objective: str(raw.obiectiv) ?? '',
    triggerWords: strings(raw.cuvinteDeclansare),
    callNames: strings(raw.numeDeApel),
    ownerStart: str(raw.pornireProprietar),
    includeOwnerMessages: raw.includeOwnerMessages === true,
    maxRunsPerHour: typeof raw.plafonOrar === 'number' ? raw.plafonOrar : null,
    notesLength:
      typeof raw.notite === 'string'
        ? raw.notite.length
        : typeof raw.notiteCaractere === 'number'
          ? raw.notiteCaractere
          : 0,
    trustedCount: strings(raw.persoaneDeIncredere).length,
    senders: strings(raw.doarDeLa),
  }
}

export async function loadWhatsApp($: Api, server: string): Promise<WhatsAppLine> {
  const line: WhatsAppLine = {
    server,
    number: null,
    name: null,
    isConnected: false,
    organization: null,
    licence: null,
    assistants: [],
    machine: { claudeReady: null, codexReady: null, problems: [] },
    error: null,
  }
  try {
    const status = jsonOf(await $.mcp.call(server, 'connection_status'))
    line.number = str(status?.whatsapp?.numar)
    line.name = str(status?.numarul?.nume) ?? str(status?.whatsapp?.nume)
    line.isConnected = status?.whatsapp?.conectat === true
    line.organization = str(status?.licenta?.organizatie)
    line.licence = str(status?.licenta?.stare)
    const watches = jsonOf(await $.mcp.call(server, 'list_watches'))
    const list = Array.isArray(watches?.monitorizari) ? watches.monitorizari : []
    line.assistants = list.map((raw: Record<string, any>) => toAssistant(server, raw))
    line.machine = toMachine(watches)
  } catch (cause) {
    line.error = errorOf(cause)
  }
  return line
}

export async function loadPos($: Api, server: string): Promise<PosLine> {
  try {
    const result = await $.mcp.call(server, 'verifica_conexiune')
    const body = jsonOf(result)
    return {
      server,
      employee: str(body?.data?.angajat?.nume),
      version: str(body?.data?.versiuneInstanta),
      isOk: !result.isError && body?.success === true,
      error: result.isError ? textOf(result).slice(0, 200) : null,
    }
  } catch (cause) {
    return { server, employee: null, version: null, isOk: false, error: errorOf(cause) }
  }
}

export function countOf(snap: Snapshot) {
  const all = snap.whatsapp.flatMap(line => line.assistants.map(one => ({ one, machine: line.machine })))
  const active = all.filter(({ one }) => one.isActive)
  const failed = all.filter(({ one, machine }) => problemOf(one, machine) !== null)
  return { all: all.length, active: active.length, stopped: all.length - active.length, failed: failed.length }
}

export function plural(count: number, one: string, many: string): string {
  return count === 1 ? `1 ${one}` : `${count} ${many}`
}

export function statusText(snap: Snapshot): string {
  const counts = countOf(snap)
  const failed = counts.failed > 0 ? `, ${counts.failed} de reparat` : ''
  return `Symbai: ${plural(counts.active, 'asistent activ', 'asistenți activi')}${failed}`
}

// A refresh asked while one runs runs once more after it, so a change is never shown stale.
let isRefreshAgain = false

export async function refresh($: Api): Promise<void> {
  if (await read($, isLoading)) {
    isRefreshAgain = true
    return
  }
  await update($, isLoading, () => true)
  try {
    const servers = await findServers($)
    const [whatsapp, pos] = await Promise.all([
      Promise.all(servers.whatsapp.map(server => loadWhatsApp($, server))),
      Promise.all(servers.pos.map(server => loadPos($, server))),
    ])
    const snap: Snapshot = { refreshedAt: await $.clock.now(), whatsapp, pos }
    await update($, snapshot, () => snap)
    if (whatsapp.length > 0 || pos.length > 0) $.ui.status(statusText(snap))
  } finally {
    await update($, isLoading, () => false)
  }
  if (isRefreshAgain) {
    isRefreshAgain = false
    await refresh($)
  }
}

export async function loadDetail($: Api, target: Selected): Promise<AssistantDetail | null> {
  const body = jsonOf(await $.mcp.call(target.server, 'list_watches', { watch: target.id }))
  const raw = Array.isArray(body?.monitorizari) ? body.monitorizari.find((one: any) => one?.id === target.id) : null
  const found = raw ? toDetail(target.server, raw) : null
  // A late answer for an assistant the person already left must not replace the one shown.
  const now = await read($, selected)
  if (now?.id === target.id && now.server === target.server) await update($, detail, () => found)
  return found
}

// Any long text of an assistant goes into the prompt box under the edit mark; Enter saves it there.
export async function startTextEdit($: Api, edit: Editing, text: string, title: string): Promise<void> {
  const draft = await $.prompt.read()
  if (draft.text.trim().length > 0 && !draft.text.startsWith(EDIT_MARK)) {
    await update($, notice, () => ({
      text: 'Ai un text început în caseta de scris. Trimite-l sau golește caseta, apoi apasă din nou butonul de editare.',
      isError: true,
    }))
    return
  }
  const name = edit.name || (await read($, detail))?.name || ''
  const filled = await $.prompt.fill({
    text: `${EDIT_MARK}„${name}” · ${title} — schimbă textul de mai jos și apasă Enter ca să-l salvezi. Ca să renunți, apasă „Renunță la editare” în panou.\n${text}`,
  })
  if (!filled.isFilled) {
    await update($, notice, () => ({
      text: 'Caseta de scris e ocupată acum. Închide fereastra deschisă și încearcă din nou.',
      isError: true,
    }))
    return
  }
  await update($, editing, () => ({ ...edit, name }))
  await update($, notice, () => null)
}
