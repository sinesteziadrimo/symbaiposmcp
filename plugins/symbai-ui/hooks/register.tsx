import { atom, read, update } from 'claude-code'
import type { EngineInterface as Api, McpToolResult, Register } from 'claude-code'

import type { Assistant, AssistantDetail, Confirm, Editing, Machine, PosLine, Selected, Snapshot, WhatsAppLine } from '../types'

const PANE = 'symbai-asistenti'
const PANE_TITLE = 'Symbai · Asistenți'
const BRAND = '#7C3AED'
const OBJECTIVE_PREVIEW = 700

// Watch changes made through these tools refresh the list right after.
const WATCH_TOOLS = new Set([
  'watch_chat',
  'update_watch',
  'stop_watch',
  'owner_watch_control',
  'connect_repair',
])

const MODES = [
  { value: 'always', label: 'Mereu', explain: 'Răspunde la orice mesaj nou din conversație.' },
  {
    value: 'mention',
    label: 'Doar când e chemat',
    explain: 'Răspunde numai când e chemat pe nume, cu un cuvânt de mai jos sau la un răspuns dat lui.',
  },
  {
    value: 'silent',
    label: 'Silențios',
    explain: 'Citește tot și lucrează în Symbai, dar nu scrie în conversație; te anunță pe tine când e nevoie.',
  },
]

const RUNNERS = [
  { value: 'codex', label: 'Codex', explain: 'Rulează singur pe acest calculator, cu Codex.' },
  { value: 'claude', label: 'Claude Code', explain: 'Rulează singur pe acest calculator, cu Claude Code.' },
  {
    value: 'stream',
    label: 'Sesiunea Claude',
    explain: 'Mesajele ajung într-o sesiune Claude Code deschisă; lucrează doar cât e deschisă.',
  },
]

// The first line of the prompt box while a prompt is being edited there. Enter saves the rest;
// a submission without it is a normal prompt again.
const EDIT_MARK = '✎ PROMPT '

const snapshot = atom({ plugin: 'symbai-ui', key: 'snapshot' } as const, null)
const isLoading = atom({ plugin: 'symbai-ui', key: 'isLoading' } as const, false)
const isBandHidden = atom({ plugin: 'symbai-ui', key: 'isBandHidden' } as const, false)
const showInactive = atom({ plugin: 'symbai-ui', key: 'showInactive' } as const, false)
const selected = atom({ plugin: 'symbai-ui', key: 'selected' } as const, null)
const detail = atom({ plugin: 'symbai-ui', key: 'detail' } as const, null)
const isBusy = atom({ plugin: 'symbai-ui', key: 'isBusy' } as const, false)
const notice = atom({ plugin: 'symbai-ui', key: 'notice' } as const, null)
const showFullObjective = atom({ plugin: 'symbai-ui', key: 'showFullObjective' } as const, false)
const editing = atom({ plugin: 'symbai-ui', key: 'editing' } as const, null)
const undo = atom({ plugin: 'symbai-ui', key: 'undo' } as const, null)
const role = atom({ plugin: 'symbai-ui', key: 'role' } as const, null)
const isRoleLoading = atom({ plugin: 'symbai-ui', key: 'isRoleLoading' } as const, false)
const busyId = atom({ plugin: 'symbai-ui', key: 'busyId' } as const, null)
const confirming = atom({ plugin: 'symbai-ui', key: 'confirming' } as const, null)

type Servers = { whatsapp: string[]; pos: string[] }

function splitMcpName(name: string): { server: string; tool: string } | null {
  if (!name.startsWith('mcp__')) return null
  const cut = name.lastIndexOf('__')
  if (cut <= 5) return null
  return { server: name.slice(5, cut), tool: name.slice(cut + 2) }
}

function textOf(result: McpToolResult): string {
  return result.content
    .map(block => (block.type === 'text' && typeof block.text === 'string' ? block.text : ''))
    .join('')
}

function jsonOf(result: McpToolResult): Record<string, any> | null {
  if (result.structuredContent && typeof result.structuredContent === 'object') {
    return result.structuredContent as Record<string, any>
  }
  try {
    return JSON.parse(textOf(result))
  } catch {
    return null
  }
}

function errorOf(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause)
}

const str = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((one): one is string => typeof one === 'string') : []

async function findServers($: Api): Promise<Servers> {
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

function toAssistant(server: string, raw: Record<string, any>): Assistant {
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

function toMachine(body: Record<string, any> | null): Machine {
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

function causeOf(text: string): Problem {
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

function toDetail(server: string, raw: Record<string, any>): AssistantDetail {
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

async function loadWhatsApp($: Api, server: string): Promise<WhatsAppLine> {
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

async function loadPos($: Api, server: string): Promise<PosLine> {
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

function countOf(snap: Snapshot) {
  const all = snap.whatsapp.flatMap(line => line.assistants.map(one => ({ one, machine: line.machine })))
  const active = all.filter(({ one }) => one.isActive)
  const failed = all.filter(({ one, machine }) => problemOf(one, machine) !== null)
  return { all: all.length, active: active.length, stopped: all.length - active.length, failed: failed.length }
}

function plural(count: number, one: string, many: string): string {
  return count === 1 ? `1 ${one}` : `${count} ${many}`
}

function statusText(snap: Snapshot): string {
  const counts = countOf(snap)
  const failed = counts.failed > 0 ? `, ${counts.failed} de reparat` : ''
  return `Symbai: ${plural(counts.active, 'asistent activ', 'asistenți activi')}${failed}`
}

// A refresh asked while one runs runs once more after it, so a change is never shown stale.
let isRefreshAgain = false

async function refresh($: Api): Promise<void> {
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

async function loadDetail($: Api, target: Selected): Promise<AssistantDetail | null> {
  const body = jsonOf(await $.mcp.call(target.server, 'list_watches', { watch: target.id }))
  const raw = Array.isArray(body?.monitorizari) ? body.monitorizari.find((one: any) => one?.id === target.id) : null
  const found = raw ? toDetail(target.server, raw) : null
  // A late answer for an assistant the person already left must not replace the one shown.
  const now = await read($, selected)
  if (now?.id === target.id && now.server === target.server) await update($, detail, () => found)
  return found
}

async function openDetail($: Api, target: Selected): Promise<void> {
  await update($, confirming, () => null)
  await update($, selected, () => target)
  await update($, detail, () => null)
  await update($, notice, () => null)
  await update($, showFullObjective, () => false)
  await update($, role, () => null)
  try {
    const found = await loadDetail($, target)
    if (!found) await update($, notice, () => ({ text: 'Nu mai găsesc acest asistent.', isError: true }))
    else void loadRole($, found, false).catch(() => undefined)
  } catch (cause) {
    await update($, notice, () => ({ text: `Nu pot citi asistentul: ${errorOf(cause)}`, isError: true }))
  }
}

async function closeDetail($: Api): Promise<void> {
  await update($, confirming, () => null)
  await update($, selected, () => null)
  await update($, detail, () => null)
  await update($, notice, () => null)
}

function refusalOf(result: McpToolResult): string | null {
  const body = jsonOf(result)
  const refused = result.isError || body?.success === false || typeof body?.error === 'string'
  if (!refused) return null
  return str(body?.error) ?? str(body?.message) ?? (textOf(result).slice(0, 300) || 'Connect a refuzat.')
}

// One change on one assistant, from the list or from its page; then the real state is read back.
async function act($: Api, target: Selected, tool: 'update_watch' | 'stop_watch', args: Record<string, unknown>, done: string): Promise<boolean> {
  if (await read($, isBusy)) return false
  await update($, isBusy, () => true)
  await update($, busyId, () => `${target.server}:${target.id}`)
  await update($, notice, () => null)
  let isDone = false
  try {
    const failure = refusalOf(await $.mcp.call(target.server, tool, { watch: target.id, ...args }))
    if (failure) await update($, notice, () => ({ text: `Nu s-a schimbat: ${failure}`, isError: true }))
    else {
      isDone = true
      await update($, notice, () => ({ text: done, isError: false }))
    }
  } catch (cause) {
    await update($, notice, () => ({ text: `Nu s-a schimbat: ${errorOf(cause)}`, isError: true }))
  } finally {
    await update($, isBusy, () => false)
    await update($, busyId, () => null)
  }
  const shown = await read($, selected)
  if (shown && shown.id === target.id && shown.server === target.server) await loadDetail($, target).catch(() => null)
  await refresh($).catch(() => undefined)
  return isDone
}

// The page's own changes: only while the assistant read is the one shown.
async function change($: Api, args: Record<string, unknown>, done: string): Promise<void> {
  const target = await read($, selected)
  const current = await read($, detail)
  if (!target || !current || current.id !== target.id || current.server !== target.server) return
  // Only the fields given: Connect keeps a pause, and its reason, when `active` is left out.
  // Sending active:false again would clear that reason (e.g. the resume after login).
  await act($, target, 'update_watch', args, done)
}

function pauseOf(one: Assistant): { args: Record<string, unknown>; done: string } {
  return one.isActive
    ? { args: { active: false }, done: `„${one.name}” e oprit. Nu mai răspunde până îl pornești.` }
    : { args: { active: true }, done: `„${one.name}” e pornit și preia mesajele venite cât a stat oprit.` }
}

// Stopping is immediate; starting asks first, since it answers what came in meanwhile.
async function toggle($: Api, one: Assistant): Promise<void> {
  if (!one.isActive) {
    await update($, confirming, () => ({ server: one.server, id: one.id, action: 'start' }))
    return
  }
  const { args, done } = pauseOf(one)
  await act($, { server: one.server, id: one.id }, 'update_watch', args, done)
}

async function start($: Api, one: Assistant): Promise<void> {
  await update($, confirming, () => null)
  const { args, done } = pauseOf(one)
  await act($, { server: one.server, id: one.id }, 'update_watch', args, done)
}

function isConfirming(asked: Confirm | null, one: Assistant, action: Confirm['action']): boolean {
  return asked !== null && asked.action === action && asked.id === one.id && asked.server === one.server
}

async function fix($: Api, one: Assistant, problem: Problem): Promise<void> {
  const target = { server: one.server, id: one.id }
  if (problem.fix === 'reset') {
    const args: Record<string, unknown> = { clear_session: true }
    if (!one.isActive) args.active = true
    await act($, target, 'update_watch', args, `„${one.name}” o ia de la zero${one.isActive ? '' : ' și e pornit'}. Promptul și notițele au rămas.`)
  } else if (problem.fix === 'resume') {
    await act($, target, 'update_watch', { active: true }, `„${one.name}” e pornit din nou.`)
  } else if (problem.fix === 'rerun') {
    await act($, target, 'update_watch', { check_now: true }, `Am pornit o rulare nouă pentru „${one.name}”.`)
  }
}

async function remove($: Api, target: Selected, name: string): Promise<void> {
  await update($, confirming, () => null)
  const isDone = await act($, target, 'stop_watch', { delete: true }, `„${name}” a fost șters.`)
  if (!isDone) return
  const edit = await read($, editing)
  if (edit && edit.id === target.id && edit.server === target.server) await cancelEdit($)
  const shown = await read($, selected)
  if (shown && shown.id === target.id && shown.server === target.server) {
    const kept = await read($, notice)
    await closeDetail($)
    await update($, notice, () => kept)
  }
}

async function askClaude($: Api, request: string): Promise<void> {
  const current = await read($, detail)
  const text = request.trim()
  if (!current || text.length === 0) return
  await $.prompt.submit({
    text:
      `Modifică asistentul WhatsApp „${current.name}” (monitorizarea ${current.id}, serverul ${current.server}): ${text}\n` +
      'Citește întâi obiectivul și notițele complete cu list_watches, schimbă prin update_watch doar ce cer, ' +
      'păstrează restul obiectivului și al regulilor, apoi recitește monitorizarea și spune-mi pe scurt ce s-a schimbat.',
  })
  await update($, notice, () => ({ text: 'Am trimis cererea către Claude, în conversație.', isError: false }))
}

function hashOf(text: string): string {
  let hash = 5381
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0
  return (hash >>> 0).toString(36)
}

function modeExplain(mode: string): string {
  return MODES.find(one => one.value === mode)?.explain ?? ''
}

function runnerExplain(runner: string): string {
  return RUNNERS.find(one => one.value === runner)?.explain ?? ''
}

// A plain summary of what the assistant is for, written once per prompt version and kept.
async function loadRole($: Api, one: AssistantDetail, force: boolean): Promise<void> {
  const key = `rol:${one.server}:${one.id}:${hashOf(one.objective)}`
  const isStillShown = async () => (await read($, selected))?.id === one.id
  if (!force) {
    const cached = await $.store.get(key)
    if (typeof cached === 'string' && cached.length > 0) {
      if (await isStillShown()) await update($, role, () => ({ id: one.id, text: cached, error: null }))
      return
    }
  }
  if (one.objective.trim().length === 0) {
    await update($, role, () => ({ id: one.id, text: null, error: 'Asistentul nu are încă un prompt.' }))
    return
  }
  await update($, isRoleLoading, () => true)
  try {
    const answer = await $.model.complete({
      model: 'haiku',
      maxTokens: 400,
      system:
        'Explici unui proprietar de firmă, fără termeni tehnici, ce rol are un asistent automat de WhatsApp. ' +
        'Scrii în română, direct, fără introducere.',
      prompt:
        'Din instrucțiunile de mai jos, scrie exact patru rânduri, fiecare de cel mult 25 de cuvinte:\n' +
        'Ce face: …\nUnde și pentru cine: …\nCe nu are voie: …\nCine îi dă instrucțiuni: …\n' +
        'Dacă instrucțiunile nu spun ceva, scrie „nu e precizat”.\n\n' +
        `Conversația: ${one.kind} „${one.name}”. ${modeExplain(one.mode)}\n\n` +
        `Instrucțiunile asistentului:\n${one.objective}`,
    })
    if (!(await isStillShown())) return
    if (answer.isAnswered && answer.text.trim().length > 0) {
      const text = answer.text.trim()
      await $.store.set(key, text)
      await update($, role, () => ({ id: one.id, text, error: null }))
    } else {
      await update($, role, () => ({ id: one.id, text: null, error: 'Nu am putut face rezumatul acum.' }))
    }
  } finally {
    await update($, isRoleLoading, () => false)
  }
}

async function startEdit($: Api): Promise<void> {
  const one = await read($, detail)
  if (!one) return
  const draft = await $.prompt.read()
  if (draft.text.trim().length > 0 && !draft.text.startsWith(EDIT_MARK)) {
    await update($, notice, () => ({
      text: 'Ai un text început în caseta de scris. Trimite-l sau golește caseta, apoi apasă din nou „Editează promptul”.',
      isError: true,
    }))
    return
  }
  const filled = await $.prompt.fill({
    text: `${EDIT_MARK}„${one.name}” — schimbă textul de mai jos și apasă Enter ca să-l salvezi. Ca să renunți, apasă „Renunță la editare” în panou.\n${one.objective}`,
  })
  if (!filled.isFilled) {
    await update($, notice, () => ({
      text: 'Caseta de scris e ocupată acum. Închide fereastra deschisă și încearcă din nou.',
      isError: true,
    }))
    return
  }
  const next: Editing = { server: one.server, id: one.id, name: one.name, previous: one.objective }
  await update($, editing, () => next)
  await update($, notice, () => null)
}

async function cancelEdit($: Api): Promise<void> {
  await update($, editing, () => null)
  const box = await $.prompt.read()
  if (box.text.startsWith(EDIT_MARK)) await $.prompt.fill({ text: '' })
}

async function writeObjective($: Api, target: Editing, objective: string): Promise<string | null> {
  const result = await $.mcp.call(target.server, 'update_watch', { watch: target.id, objective })
  if (result.isError) return textOf(result).slice(0, 300) || 'Connect a refuzat schimbarea.'
  // Read back: the saved text is what counts, not the answer to the write.
  const saved = await loadDetail($, { server: target.server, id: target.id })
  if (!saved) return 'Nu mai găsesc asistentul după salvare.'
  if (saved.objective.trim() !== objective.trim()) return 'Textul salvat diferă de cel trimis; verifică promptul.'
  return null
}

// Enter in the prompt box while a prompt is being edited: save it, never send it to the model.
async function saveEdit($: Api, text: string): Promise<string> {
  const target = await read($, editing)
  if (!target) {
    await $.prompt.fill({ text })
    return 'Nu mai știu ce asistent editezi. Textul e înapoi în casetă: deschide asistentul și apasă din nou „Editează promptul”.'
  }
  const cut = text.indexOf('\n')
  const objective = cut < 0 ? '' : text.slice(cut + 1).trim()
  if (objective.length === 0) {
    await $.prompt.fill({ text })
    return 'Promptul nu poate fi gol. Nu am salvat nimic.'
  }
  if (objective === target.previous.trim()) {
    await update($, editing, () => null)
    return `Promptul lui „${target.name}” e neschimbat.`
  }
  const failure = await writeObjective($, target, objective).catch(cause => errorOf(cause))
  if (failure) {
    await $.prompt.fill({ text })
    await update($, notice, () => ({ text: `Promptul nu s-a salvat: ${failure}`, isError: true }))
    return `Promptul nu s-a salvat: ${failure}`
  }
  await update($, editing, () => null)
  await update($, undo, () => ({ server: target.server, id: target.id, objective: target.previous, saved: objective }))
  await update($, notice, () => ({ text: 'Promptul e salvat.', isError: false }))
  const saved = await read($, detail)
  if (saved && saved.id === target.id) void loadRole($, saved, false).catch(() => undefined)
  void refresh($).catch(() => undefined)
  return `Promptul lui „${target.name}” e salvat. Nu s-a trimis lui Claude.`
}

async function undoEdit($: Api): Promise<void> {
  const last = await read($, undo)
  const one = await read($, detail)
  if (!last || !one || one.id !== last.id || one.server !== last.server || (await read($, isBusy))) return
  if (one.objective.trim() !== last.saved.trim()) {
    await update($, undo, () => null)
    await update($, notice, () => ({
      text: 'Promptul s-a schimbat între timp, așa că nu mai anulez automat. Editează-l direct dacă vrei altă variantă.',
      isError: true,
    }))
    return
  }
  await update($, isBusy, () => true)
  try {
    const failure = await writeObjective(
      $,
      { server: last.server, id: last.id, name: one.name, previous: one.objective },
      last.objective,
    )
    if (failure) {
      await update($, notice, () => ({ text: `Nu am putut reveni: ${failure}`, isError: true }))
      return
    }
    await update($, undo, () => null)
    await update($, notice, () => ({ text: 'Am pus la loc promptul de dinainte.', isError: false }))
    const restored = await read($, detail)
    if (restored) void loadRole($, restored, false).catch(() => undefined)
  } catch (cause) {
    await update($, notice, () => ({ text: `Nu am putut reveni: ${errorOf(cause)}`, isError: true }))
  } finally {
    await update($, isBusy, () => false)
  }
}

function shortTime(value: string | null): string {
  if (!value) return '—'
  // "2026-10-20 13:40:39" → "20.10 13:40"
  const match = /^\d{4}-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(value)
  return match ? `${match[2]}.${match[1]} ${match[3]}:${match[4]}` : value
}

function runnerLabel(runner: string): string {
  return RUNNERS.find(one => one.value === runner)?.label ?? (runner || '—')
}

function modeLabel(mode: string): string {
  return MODES.find(one => one.value === mode)?.label ?? (mode || '—')
}

// Connect's advice, without the tool call meant for agents.
function tipText(tip: string): string {
  return tip
    .replace(/\s*\([^)]*update_watch[^)]*\)/g, '')
    .replace(/modul mention/g, 'modul „Doar când e chemat”')
}

// The band's hidden/shown choice is kept across chats: hidden in one, it stays small in every other.
const BAND_HIDDEN_KEY = 'isBandHidden'

async function setBandHidden($: Api, value: boolean): Promise<void> {
  await $.store.set(BAND_HIDDEN_KEY, value).catch(() => undefined)
  await update($, isBandHidden, () => value)
}

// A chat already open picks up the choice made in another one.
async function syncBandHidden($: Api): Promise<void> {
  const hidden = (await $.store.get(BAND_HIDDEN_KEY).catch(() => undefined)) === true
  if ((await read($, isBandHidden)) !== hidden) await update($, isBandHidden, () => hidden)
}

function splitWords(value: string): string[] {
  return value
    .split(',')
    .map(one => one.trim())
    .filter(one => one.length > 0)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'symbai',
      description: 'Deschide panoul Symbai cu asistenții și conexiunile',
    })
    await syncBandHidden($)
    void refresh($).catch(() => undefined)
    // The pane opens only when asked (/symbai or „Asistenți”), never by itself in a new chat.

    return next(e)
  })

  on('command.run', { command: 'symbai' }, async $ => {
    await $.ui.open({ id: PANE, title: PANE_TITLE, focus: true })
    await refresh($)
    const snap = await read($, snapshot)

    return { text: snap ? statusText(snap) : 'Symbai: nicio conexiune găsită în această sesiune.' }
  })

  // MCP servers may still be connecting at session start: try again on the next prompt.
  on('prompt.submit', async ($, e, next) => {
    const fromPerson = !e.origin || e.origin.kind === 'composer' || e.origin.kind === 'bridge'
    if (fromPerson && e.text.startsWith(EDIT_MARK) && !e.command) {
      return { drop: await saveEdit($, e.text) }
    }
    // A notification arriving mid-edit is not the person giving up on the edit.
    if (fromPerson && (await read($, editing))) await update($, editing, () => null)
    void syncBandHidden($).catch(() => undefined)
    const snap = await read($, snapshot)
    if (!snap || (snap.whatsapp.length === 0 && snap.pos.length === 0)) {
      void refresh($).catch(() => undefined)
    }

    return next(e)
  }).catch(async ($, e, next) => {
    // An edited prompt is never handed to the model, even when saving it failed; the text goes back.
    if (!e.text.startsWith(EDIT_MARK)) return next(e)
    await $.prompt.fill({ text: e.text }).catch(() => undefined)
    return { drop: 'Promptul nu s-a salvat. Textul e înapoi în casetă.' }
  })

  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    const parts = splitMcpName(e.tool)
    if (parts && parts.server.startsWith('symbai') && WATCH_TOOLS.has(parts.tool)) {
      void refresh($).catch(() => undefined)
      const target = await read($, selected)
      if (target && target.server === parts.server) void loadDetail($, target).catch(() => null)
    }

    return ran
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const snap = await read($, snapshot)
    if (snap === null || (snap.whatsapp.length === 0 && snap.pos.length === 0)) return next(e)
    if (e.props.hasSurvey) return next(e)

    const { Box, Button, Text } = $.ui.resolve(e)
    const openPane = () => $.ui.open({ id: PANE, title: PANE_TITLE, focus: true })
    const counts = countOf(snap)
    if (await read($, isBandHidden)) {
      return (
        <Box flexDirection="row">
          <Button key="show" plain dimColor onPress={() => setBandHidden($, false)}>
            <Text color={BRAND} bold>
              Symbai ▸
            </Text>
            {counts.failed > 0 ? <Text color="warning"> ▲{counts.failed}</Text> : ''}
          </Button>
        </Box>
      )
    }
    const phone = snap.whatsapp[0]
    const posDown = snap.pos.filter(line => !line.isOk)

    return (
      <Box flexDirection="row" gap={1} flexWrap="wrap">
        <Text color={BRAND} bold>
          ◆ Symbai
        </Text>
        {phone && (
          <Text color={phone.isConnected ? 'success' : 'error'}>
            {phone.isConnected ? '●' : '○'} WhatsApp {phone.number ?? phone.server}
          </Text>
        )}
        {phone && <Text dimColor>· {plural(counts.active, 'asistent activ', 'asistenți activi')}</Text>}
        {counts.failed > 0 && (
          <Button key="problems" plain onPress={openPane}>
            <Text color="warning" bold>
              ▲ {counts.failed} de reparat
            </Text>
          </Button>
        )}
        {snap.pos.length > 0 && (
          <Text color={posDown.length > 0 ? 'error' : undefined} dimColor={posDown.length === 0}>
            ·{' '}
            {posDown.length > 0
              ? `${posDown.map(line => line.server).join(', ')} nu răspunde`
              : `${plural(snap.pos.length, 'firmă conectată', 'firme conectate')} ✓`}
          </Text>
        )}
        <Button key="open" label="Asistenți" dimColor onPress={openPane} />
        <Button key="hide" label="Ascunde" dimColor onPress={() => setBandHidden($, true)} />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Input, Text } = $.ui.resolve(e)
    const snap = await read($, snapshot)
    const loading = await read($, isLoading)
    const withInactive = await read($, showInactive)
    const target = await read($, selected)
    const info = await read($, notice)
    const busy = await read($, isBusy)
    const working = await read($, busyId)

    const noticeLine = info && (
      <Box key="notice" borderStyle="round" borderColor={info.isError ? 'error' : 'success'} paddingX={1}>
        <Text color={info.isError ? 'error' : 'success'}>
          {info.isError ? '✗ ' : '✓ '}
          {info.text}
        </Text>
      </Box>
    )
    const machineOf = (server: string) => snap?.whatsapp.find(line => line.server === server)?.machine ?? null
    const statusOf = (one: Assistant, problem: Problem | null) =>
      problem
        ? { mark: '▲', color: 'warning', label: 'de reparat' }
        : one.isActive
          ? { mark: '●', color: 'success', label: 'activ' }
          : { mark: '○', color: 'inactive', label: 'oprit' }
    const fixLabel = (problem: Problem): string | null =>
      problem.fix === 'reset'
        ? 'Repară'
        : problem.fix === 'resume'
          ? 'Pornește din nou'
          : problem.fix === 'rerun'
            ? 'Încearcă din nou'
            : null
    const kindOf = (one: Assistant) => (one.kind === 'grup' ? 'grup' : 'direct')
    const asked = await read($, confirming)
    const isWorkingOn = (one: Assistant) => working === `${one.server}:${one.id}`
    const startAsk = (one: Assistant) =>
      isConfirming(asked, one, 'start') && (
        <Box key={`start-ask-${one.id}`} flexDirection="column" borderStyle="round" borderColor="warning" paddingX={1}>
          <Text color="warning" bold>
            Pornești „{one.name}”?
          </Text>
          <Text>Răspunde și la mesajele venite cât a stat oprit (ultimul: {shortTime(one.lastMessageAt)}).</Text>
          <Box flexDirection="row" gap={1}>
            <Button
              key={`start-confirm-${one.id}`}
              label="Da, pornește"
              variant="primary"
              onPress={() => (busy ? undefined : start($, one))}
            />
            <Button key={`start-cancel-${one.id}`} label="Renunță" dimColor onPress={() => update($, confirming, () => null)} />
          </Box>
        </Box>
      )

    // ── One assistant: see and change it ────────────────────────────────
    if (target) {
      const one = await read($, detail)
      const full = await read($, showFullObjective)
      const edit = await read($, editing)
      const last = await read($, undo)
      const summary = await read($, role)
      const summaryLoading = await read($, isRoleLoading)

      if (!one) {
        return (
          <Box flexDirection="column" gap={1}>
            <Button key="back" label="← Toți asistenții" dimColor onPress={() => closeDetail($)} />
            {noticeLine ?? <Text dimColor>Citesc asistentul…</Text>}
          </Box>
        )
      }

      const problem = problemOf(one, machineOf(one.server))
      const status = statusOf(one, problem)
      const pause = pauseOf(one)
      const repair = problem ? fixLabel(problem) : null
      const isAskingDelete = isConfirming(asked, one, 'delete')
      const isEditingThis = edit !== null && edit.id === one.id && edit.server === one.server
      const canUndo = last !== null && last.id === one.id && last.server === one.server
      const roleText = summary && summary.id === one.id ? summary : null
      const objective =
        full || one.objective.length <= OBJECTIVE_PREVIEW ? one.objective : `${one.objective.slice(0, OBJECTIVE_PREVIEW)}…`
      const listensTo =
        one.senders.length > 0
          ? `Doar ${one.senders.length === 1 ? 'o persoană anume' : `${one.senders.length} identități anume`} îl pot porni.`
          : 'Oricine scrie în conversație îl poate porni.'
      const isOldFailure = one.lastRunState === 'failed' && one.runner === 'stream'

      return (
        <Box flexDirection="column" gap={1}>
          <Button key="back" label="← Toți asistenții" dimColor onPress={() => closeDetail($)} />

          <Box flexDirection="column">
            <Text size="title" color={BRAND} bold>
              {one.name}
            </Text>
            <Box flexDirection="row" gap={1} flexWrap="wrap">
              <Text color={status.color} bold>
                {status.mark} {status.label}
              </Text>
              <Text dimColor>
                · {one.kind === 'grup' ? 'grup WhatsApp' : 'conversație directă'} · {modeLabel(one.mode)} ·{' '}
                {runnerLabel(one.runner)}
              </Text>
            </Box>
            {one.callNames.length > 0 && <Text dimColor>Îl chemi cu: {one.callNames.join(', ')}</Text>}
          </Box>

          <Box flexDirection="row" gap={1} flexWrap="wrap">
            <Button
              key="pause"
              label={busy ? 'Se salvează…' : one.isActive ? 'Oprește' : 'Pornește'}
              variant={one.isActive ? undefined : 'primary'}
              onPress={() => (busy ? undefined : one.isActive ? change($, pause.args, pause.done) : toggle($, one))}
            />
            {one.isActive && (
              <Button
                key="run"
                label="Rulează acum"
                dimColor
                onPress={() => (busy ? undefined : change($, { check_now: true }, 'Am pornit o rulare acum.'))}
              />
            )}
            <Button
              key="delete-ask"
              label="Șterge"
              dimColor
              onPress={() => update($, confirming, () => ({ server: one.server, id: one.id, action: 'delete' }))}
            />
          </Box>

          {startAsk(one)}

          {isAskingDelete && (
            <Box flexDirection="column" borderStyle="round" borderColor="error" paddingX={1}>
              <Text color="error" bold>
                Ștergi definitiv „{one.name}”?
              </Text>
              <Text>Se pierd promptul, notițele și istoricul lui. Dacă vrei doar să nu mai răspundă, apasă „Oprește”.</Text>
              <Box flexDirection="row" gap={1}>
                <Button
                  key="delete-confirm"
                  label="Da, șterge"
                  variant="primary"
                  onPress={() => (busy ? undefined : remove($, { server: one.server, id: one.id }, one.name))}
                />
                <Button key="delete-cancel" label="Renunță" dimColor onPress={() => update($, confirming, () => null)} />
              </Box>
            </Box>
          )}

          {noticeLine}

          {problem && (
            <Box flexDirection="column" borderStyle="round" borderColor="warning" paddingX={1}>
              <Text color="warning" bold>
                ▲ {problem.title}
              </Text>
              <Text>{problem.explain}</Text>
              {repair && (
                <Box flexDirection="row">
                  <Button
                    key="fix"
                    label={busy ? 'Se repară…' : repair}
                    variant="primary"
                    onPress={() => (busy ? undefined : fix($, one, problem))}
                  />
                </Box>
              )}
            </Box>
          )}

          {!problem && one.tip && (
            <Box flexDirection="column" borderStyle="round" borderColor="suggestion" paddingX={1}>
              <Text color="suggestion" bold>
                Sfat
              </Text>
              <Text>{tipText(one.tip)}</Text>
              {one.mode !== 'mention' && /mention/.test(one.tip) && (
                <Box flexDirection="row">
                  <Button
                    key="tip-mention"
                    label="Treci pe „Doar când e chemat”"
                    dimColor
                    onPress={() => change($, { mode: 'mention' }, 'Modul e acum: Doar când e chemat.')}
                  />
                </Box>
              )}
            </Box>
          )}

          {isEditingThis && (
            <Box flexDirection="column" borderStyle="round" borderColor="warning" paddingX={1}>
              <Text color="warning" bold>
                Editezi promptul în caseta de scris de jos
              </Text>
              <Text>Schimbă textul acolo și apasă Enter. Se salvează la asistent și nu se trimite lui Claude.</Text>
              <Button key="edit-cancel" label="Renunță la editare" dimColor onPress={() => cancelEdit($)} />
            </Box>
          )}

          <Box flexDirection="column" borderStyle="round" borderColor={BRAND} paddingX={1}>
            <Text color={BRAND} bold>
              Rolul pe scurt
            </Text>
            {roleText?.text ? (
              <Text>{roleText.text}</Text>
            ) : (
              <Text dimColor>
                {summaryLoading ? 'Scriu rezumatul din prompt…' : (roleText?.error ?? 'Încă nu am rezumatul.')}
              </Text>
            )}
            <Box flexDirection="row" gap={1} flexWrap="wrap">
              <Text dimColor>Scris automat din prompt, poate scăpa nuanțe.</Text>
              <Button
                key="role-refresh"
                label={summaryLoading ? 'Se scrie…' : 'Refă rezumatul'}
                dimColor
                onPress={() => (summaryLoading ? undefined : loadRole($, one, true))}
              />
            </Box>
          </Box>

          <Box flexDirection="column">
            <Text bold>Cum lucrează</Text>
            <Text>
              <Text dimColor>Unde: </Text>
              {one.kind === 'grup' ? `în grupul „${one.name}”` : `în conversația cu ${one.name}`}
            </Text>
            <Text>
              <Text dimColor>Când răspunde: </Text>
              {modeExplain(one.mode) || one.mode}
            </Text>
            <Text>
              <Text dimColor>Cine lucrează: </Text>
              {runnerExplain(one.runner) || runnerLabel(one.runner)}
            </Text>
            <Text>
              <Text dimColor>Pe cine ascultă: </Text>
              {listensTo}
              {one.trustedCount > 0 ? ` ${one.trustedCount} persoane au încredere ca tine.` : ''}
            </Text>
            {one.ownerStart && (
              <Text>
                <Text dimColor>Mesajele tale: </Text>
                {one.ownerStart}
              </Text>
            )}
          </Box>

          <Box flexDirection="column">
            <Text bold>Promptul (instrucțiunile lui)</Text>
            <Text>{objective || '—'}</Text>
            <Box flexDirection="row" gap={1} flexWrap="wrap">
              <Button
                key="edit-start"
                label="Editează promptul"
                variant="primary"
                onPress={() => (isEditingThis ? undefined : startEdit($))}
              />
              {one.objective.length > OBJECTIVE_PREVIEW && (
                <Button
                  key="objective-toggle"
                  label={full ? 'Restrânge' : 'Arată tot promptul'}
                  dimColor
                  onPress={() => update($, showFullObjective, value => !value)}
                />
              )}
              {canUndo && (
                <Button key="edit-undo" label="Anulează ultima modificare" dimColor onPress={() => undoEdit($)} />
              )}
            </Box>
            <Text dimColor>
              {one.notesLength > 0 ? `Mai are notițe de lucru: ${one.notesLength} caractere` : 'Fără notițe de lucru'}
              {one.maxRunsPerHour !== null ? ` · maxim ${one.maxRunsPerHour} rulări pe oră` : ''}
            </Text>
          </Box>

          <Box flexDirection="column">
            <Text bold>Sau cere lui Claude o schimbare</Text>
            <Input
              key="ask"
              placeholder="ex.: să răspundă doar între 8 și 17"
              submitLabel="trimite lui Claude"
              onSubmit={value => askClaude($, value)}
            />
            <Text dimColor>Claude schimbă doar ce ceri și păstrează restul promptului.</Text>
          </Box>

          <Box flexDirection="column">
            <Text bold>Când răspunde</Text>
            <Box flexDirection="row" gap={1} flexWrap="wrap">
              {MODES.map(mode => (
                <Button
                  key={`mode-${mode.value}`}
                  label={mode.label}
                  variant={one.mode === mode.value ? 'primary' : undefined}
                  dimColor={one.mode !== mode.value}
                  onPress={() =>
                    one.mode === mode.value ? undefined : change($, { mode: mode.value }, `Modul e acum: ${mode.label}.`)
                  }
                />
              ))}
            </Box>
          </Box>

          <Box flexDirection="column">
            <Text bold>Cine lucrează</Text>
            <Box flexDirection="row" gap={1} flexWrap="wrap">
              {RUNNERS.map(runner => (
                <Button
                  key={`runner-${runner.value}`}
                  label={runner.label}
                  variant={one.runner === runner.value ? 'primary' : undefined}
                  dimColor={one.runner !== runner.value}
                  onPress={() =>
                    one.runner === runner.value
                      ? undefined
                      : change($, { dispatch: runner.value }, `Lucrează acum: ${runner.label}.`)
                  }
                />
              ))}
            </Box>
            <Text dimColor>Schimbarea o ia de la zero cu conversația asistentului.</Text>
          </Box>

          <Box flexDirection="column">
            <Text bold>Cuvinte care îl cheamă</Text>
            <Input
              key="words"
              placeholder="ex.: Sym, Asistent (separate prin virgulă)"
              value={one.triggerWords.join(', ')}
              submitLabel="salvează"
              onSubmit={value => change($, { trigger_words: splitWords(value) }, 'Cuvintele sunt salvate.')}
            />
          </Box>

          <Box flexDirection="column">
            <Text bold>Ultima rulare</Text>
            <Text color={problem && !isOldFailure ? 'warning' : undefined} dimColor={!problem || isOldFailure}>
              {one.lastRunAt
                ? `${shortTime(one.lastRunAt)} · ${one.lastRunState === 'failed' ? 'eșuată' : 'reușită'}`
                : 'fără rulări'}
              {' · ultimul mesaj '}
              {shortTime(one.lastMessageAt)}
            </Text>
            {isOldFailure && (
              <Text dimColor>E veche: în „Sesiunea Claude” nu are rulări automate, deci nu e o problemă acum.</Text>
            )}
            {one.lastRunSummary && <Text dimColor>{one.lastRunSummary}</Text>}
          </Box>
        </Box>
      )
    }

    // ── The list ────────────────────────────────────────────────────────
    const toolbar = (
      <Box flexDirection="row" gap={1}>
        <Button key="refresh" label={loading ? 'Se încarcă…' : 'Reîmprospătează'} dimColor onPress={() => refresh($)} />
      </Box>
    )
    const title = (
      <Text size="title" color={BRAND} bold>
        ◆ Symbai · Asistenți
      </Text>
    )

    if (!snap) {
      return (
        <Box flexDirection="column" gap={1}>
          {title}
          <Text dimColor>{loading ? 'Citesc conexiunile Symbai…' : 'Încă nu am citit conexiunile.'}</Text>
          {toolbar}
        </Box>
      )
    }

    if (snap.whatsapp.length === 0 && snap.pos.length === 0) {
      return (
        <Box flexDirection="column" gap={1}>
          {title}
          <Text dimColor>Nu găsesc nicio conexiune Symbai în această sesiune.</Text>
          <Text dimColor>Conectează firma din portalul Symbai, apoi apasă Reîmprospătează.</Text>
          {toolbar}
        </Box>
      )
    }

    type Row = { one: Assistant; problem: Problem | null }
    const rows: Row[] = snap.whatsapp.flatMap(phone =>
      phone.assistants.map(one => ({ one, problem: problemOf(one, phone.machine) })),
    )
    const byLastMessage = (a: Row, b: Row) => (b.one.lastMessageAt ?? '').localeCompare(a.one.lastMessageAt ?? '')
    const needs = rows.filter(row => row.problem).sort(byLastMessage)
    const active = rows.filter(row => !row.problem && row.one.isActive).sort(byLastMessage)
    const stopped = rows.filter(row => !row.problem && !row.one.isActive).sort(byLastMessage)
    const counts = countOf(snap)
    const machineProblems = [...new Set(snap.whatsapp.flatMap(phone => phone.machine.problems))]
    const show = (one: Assistant) => openDetail($, { server: one.server, id: one.id })

    const rowOf = ({ one, problem }: Row) => {
      const status = statusOf(one, problem)
      return (
        <Box key={`item-${one.id}`} flexDirection="column">
        <Box key={`row-${one.id}`} flexDirection="row" justifyContent="space-between" gap={1}>
          <Box flexDirection="column" flexShrink={1}>
            <Button key={`open-${one.id}`} plain dimColor={!one.isActive} onPress={() => show(one)}>
              <Text color={status.color}>{status.mark}</Text> <Text bold={one.isActive}>{one.name}</Text>
            </Button>
            <Text dimColor wrap="truncate-end">
              {'  '}
              {kindOf(one)} · {modeLabel(one.mode)} · {runnerLabel(one.runner)} · ultimul mesaj{' '}
              {shortTime(one.lastMessageAt)}
            </Text>
          </Box>
          <Button
            key={`toggle-${one.id}`}
            label={isWorkingOn(one) ? '…' : one.isActive ? 'Oprește' : 'Pornește'}
            dimColor
            onPress={() => (busy ? undefined : toggle($, one))}
          />
        </Box>
        {startAsk(one)}
        </Box>
      )
    }

    const cardOf = ({ one, problem }: Row) => {
      if (!problem) return null
      const repair = fixLabel(problem)
      return (
        <Box key={`card-${one.id}`} flexDirection="column" borderStyle="round" borderColor="warning" paddingX={1}>
          <Button key={`open-${one.id}`} plain onPress={() => show(one)}>
            <Text color="warning">▲</Text> <Text bold>{one.name}</Text>{' '}
            <Text dimColor>
              · {kindOf(one)} · {runnerLabel(one.runner)}
              {one.isActive ? '' : ' · oprit'}
            </Text>
          </Button>
          <Text color="warning">{problem.title}</Text>
          <Text dimColor>{problem.explain}</Text>
          <Box flexDirection="row" gap={1} flexWrap="wrap">
            {repair && (
              <Button
                key={`fix-${one.id}`}
                label={isWorkingOn(one) ? 'Se repară…' : repair}
                variant="primary"
                onPress={() => (busy ? undefined : fix($, one, problem))}
              />
            )}
            {one.isActive && (
              <Button
                key={`toggle-${one.id}`}
                label={isWorkingOn(one) ? '…' : 'Oprește'}
                dimColor
                onPress={() => (busy ? undefined : toggle($, one))}
              />
            )}
            <Button key={`details-${one.id}`} label="Detalii" dimColor onPress={() => show(one)} />
          </Box>
        </Box>
      )
    }

    return (
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="column">
          {title}
          {snap.whatsapp.map(phone => (
            <Text dimColor>
              <Text color={phone.isConnected ? 'success' : 'error'}>{phone.isConnected ? '●' : '○'}</Text> WhatsApp{' '}
              {phone.number ?? phone.server}
              {phone.organization ? ` · ${phone.organization}` : ''}
              {phone.isConnected ? '' : ' · neconectat'}
            </Text>
          ))}
        </Box>

        <Box flexDirection="row" gap={2} flexWrap="wrap">
          <Text color="success" bold>
            ● {counts.active} active
          </Text>
          {counts.failed > 0 && (
            <Text color="warning" bold>
              ▲ {counts.failed} de reparat
            </Text>
          )}
          <Text dimColor>○ {counts.stopped} oprite</Text>
        </Box>

        {noticeLine}

        {snap.whatsapp.map(phone => phone.error && <Text color="error">Nu pot citi asistenții: {phone.error}</Text>)}

        {machineProblems.length > 0 && (
          <Box flexDirection="column" borderStyle="round" borderColor="error" paddingX={1}>
            <Text color="error" bold>
              Pe acest calculator
            </Text>
            {machineProblems.map(text => (
              <Text>• {text}</Text>
            ))}
          </Box>
        )}

        {needs.length > 0 && (
          <Box flexDirection="column" gap={1}>
            <Text bold>Necesită atenție · {needs.length}</Text>
            {needs.map(cardOf)}
          </Box>
        )}

        <Box flexDirection="column">
          <Text bold>Active · {active.length}</Text>
          {active.length > 0 ? active.map(rowOf) : <Text dimColor>Niciun asistent activ fără probleme.</Text>}
        </Box>

        {stopped.length > 0 && (
          <Box flexDirection="column">
            <Button key="inactive" plain dimColor onPress={() => update($, showInactive, value => !value)}>
              <Text bold>
                {withInactive ? '▾' : '▸'} Oprite · {stopped.length}
              </Text>
            </Button>
            {withInactive && stopped.map(rowOf)}
          </Box>
        )}

        {snap.pos.length > 0 && (
          <Box flexDirection="column">
            <Text bold>Firme conectate</Text>
            {snap.pos.map(line => (
              <Text color={line.isOk ? undefined : 'error'}>
                <Text color={line.isOk ? 'success' : 'error'}>{line.isOk ? '●' : '○'}</Text> {line.server}
                <Text dimColor>
                  {line.version ? ` · v${line.version}` : ''}
                  {line.employee ? ` · ${line.employee}` : ''}
                </Text>
                {line.error ? ` · ${line.error}` : ''}
              </Text>
            ))}
          </Box>
        )}

        <Text dimColor>Apasă pe un asistent ca să-l vezi, să-l schimbi sau să-l ștergi.</Text>
        {toolbar}
      </Box>
    )
  })
}
