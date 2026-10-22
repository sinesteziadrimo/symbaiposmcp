import { atom, read, update } from 'claude-code'
import type { EngineInterface as Api, McpToolResult, Register } from 'claude-code'

import { EDIT_MARK, causeOf, countOf, findServers, loadDetail, loadPos, loadWhatsApp, plural, problemOf, refresh, splitMcpName, startTextEdit, statusText, toAssistant, toDetail, toMachine } from './core'
import type { Problem, Servers } from './core'
import { closeEditor, drawEditor, openEditor, saveText } from './editor'
import { errorOf, jsonOf, shortTime, splitWords, str, strings, textOf } from './util'
import type { Assistant, AssistantDetail, Bound, Confirm, Editing, Machine, PosLine, Selected, Snapshot, WhatsAppLine } from '../types'

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
const boundChat = atom({ plugin: 'symbai-ui', key: 'boundChat' } as const, null)
const isChatBandHidden = atom({ plugin: 'symbai-ui', key: 'isChatBandHidden' } as const, false)
const editorOpen = atom({ plugin: 'symbai-ui', key: 'editor' } as const, null)

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
  await closeEditor($)
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
  await startTextEdit($, { server: one.server, id: one.id, name: one.name, previous: one.objective, field: 'objective' }, one.objective, 'promptul')
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
  if (target.field && target.field !== 'objective') {
    const body = cut < 0 ? '' : text.slice(cut + 1).trim()
    if (body === target.previous.trim()) {
      await update($, editing, () => null)
      return `Textul lui „${target.name}” e neschimbat.`
    }
    if (target.field !== 'notes' && body.length < 10) {
      await $.prompt.fill({ text })
      return 'Textul e prea scurt (cel puțin 10 caractere). Nu am salvat nimic.'
    }
    const failure = await saveText($, target, body).catch(cause => errorOf(cause))
    if (failure) {
      await $.prompt.fill({ text })
      await update($, notice, () => ({ text: `Nu s-a salvat: ${failure}`, isError: true }))
      return `Nu s-a salvat: ${failure}`
    }
    await update($, editing, () => null)
    await update($, notice, () => ({ text: 'Textul e salvat și recitit.', isError: false }))
    return `Textul lui „${target.name}” e salvat. Nu s-a trimis lui Claude.`
  }
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

// A command chat in the sidebar starts with this mark: ⟦asistent-symbai <server> <id> <name>⟧.
// The chat then shows that assistant's own band; the mark is kept per session id.
const CHAT_MARK = /^⟦asistent-symbai ([\w-]+) ([0-9a-f-]{8,64}) ([^⟧]{1,120})⟧/
// Text that reaches a chat from elsewhere (a report, another session, a channel) never binds it,
// even when it quotes a mark.
const NOT_BINDING = new Set([
  'task-notification',
  'peer',
  'peer-send-message',
  'channel',
  'scheduled-trigger',
  'auto-continuation',
  'coordinator',
  'observer',
  'observer-activity',
  'slack-ping',
  'projects-relay',
])

async function mayBind($: Api, text: string, kind: string | undefined): Promise<boolean> {
  if (kind && NOT_BINDING.has(kind)) return false
  if (text.startsWith(EDIT_MARK) || !CHAT_MARK.test(text.trimStart())) return false
  return (await read($, boundChat)) === null
}

async function saveBound($: Api, bound: Bound): Promise<void> {
  await update($, boundChat, () => bound)
  await $.store.set(`chat:${await $.session.id()}`, bound).catch(() => undefined)
}

async function bindChat($: Api, text: string): Promise<void> {
  const found = CHAT_MARK.exec(text.trimStart())
  if (!found) return
  await saveBound($, { server: found[1], id: found[2], name: found[3].trim() })
}

// The desktop app hands a new chat its first message without prompt.submit: the chat's own
// first message is read instead, once per process. Only that first message binds.
let isChatLookedUp = false

async function discoverChat($: Api): Promise<void> {
  if (isChatLookedUp || (await read($, boundChat))) return
  const messages = await $.session.messages()
  if (!Array.isArray(messages)) return
  const first = messages.find(one => one.role === 'user' && typeof one.text === 'string' && one.text.trim().length > 0)
  // Not there yet (a new chat at its start): the end of its first turn looks again.
  if (!first || typeof first.text !== 'string') return
  isChatLookedUp = true
  await bindChat($, first.text)
}

// A chat's Claude can also bind it by calling this tool once.
const BIND_TOOL = 'leaga_chat_asistent'
const BIND_TOOL_FULL = `mcp__symbai-ui__${BIND_TOOL}`

async function serveBind($: Api, input: Record<string, unknown>): Promise<{ result: unknown } | { deny: string }> {
  const server = typeof input.server === 'string' ? input.server.trim() : ''
  const id = typeof input.watch === 'string' ? input.watch.trim() : ''
  const name = typeof input.name === 'string' ? input.name.trim().slice(0, 120) : ''
  if (!/^[\w-]{1,64}$/.test(server) || !/^[0-9a-f-]{8,64}$/.test(id) || name.length === 0) {
    return { deny: 'Trimite server, watch (id-ul monitorizării) și name, exact ca în primul mesaj al chatului.' }
  }
  const current = await read($, boundChat)
  if (current && (current.id !== id || current.server !== server)) {
    return { deny: `Chatul e deja legat de „${current.name}”. Un chat de comandă rămâne la asistentul lui.` }
  }
  await saveBound($, { server, id, name })
  void refresh($).catch(() => undefined)
  return { result: { legat: true, asistent: name, watch: id, server } }
}

async function restoreChat($: Api): Promise<void> {
  const saved = (await $.store.get(`chat:${await $.session.id()}`).catch(() => undefined)) as Bound | undefined
  if (saved && typeof saved.server === 'string' && typeof saved.id === 'string') {
    await update($, boundChat, () => ({ server: saved.server, id: saved.id, name: String(saved.name ?? '') }))
  }
  const hidden = (await $.store.get(`chatHidden:${await $.session.id()}`).catch(() => undefined)) === true
  await update($, isChatBandHidden, () => hidden)
}

async function setChatBandHidden($: Api, value: boolean): Promise<void> {
  await $.store.set(`chatHidden:${await $.session.id()}`, value).catch(() => undefined)
  await update($, isChatBandHidden, () => value)
}

// The assistant's page in the pane, from its chat's band.
async function showAssistant($: Api, target: Selected): Promise<void> {
  await $.ui.open({ id: PANE, title: PANE_TITLE, focus: true })
  await openDetail($, target)
}

// A chat already open picks up the choice made in another one.
async function syncBandHidden($: Api): Promise<void> {
  const hidden = (await $.store.get(BAND_HIDDEN_KEY).catch(() => undefined)) === true
  if ((await read($, isBandHidden)) !== hidden) await update($, isBandHidden, () => hidden)
}


export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'symbai',
      description: 'Deschide panoul Symbai cu asistenții și conexiunile',
    })
    await syncBandHidden($)
    await restoreChat($).catch(() => undefined)
    isChatLookedUp = false
    await $.tool
      .register({
        name: BIND_TOOL,
        description:
          'Leagă acest chat de comandă de asistentul WhatsApp al lui, ca deasupra casetei să apară banda asistentului. ' +
          'Se apelează o singură dată, la începutul unui chat de comandă, cu datele din marcajul ⟦asistent-symbai <server> <watch> <name>⟧ din primul mesaj.',
        inputSchema: {
          type: 'object',
          properties: {
            server: { type: 'string', description: 'Serverul MCP al numărului WhatsApp, ex. symbai-whatsapp-numarul-meu.' },
            watch: { type: 'string', description: 'Id-ul monitorizării (asistentului).' },
            name: { type: 'string', description: 'Numele asistentului.' },
          },
          required: ['server', 'watch', 'name'],
        },
      })
      .catch(() => undefined)
    await discoverChat($).catch(() => undefined)
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
    if (await mayBind($, e.text, e.origin?.kind).catch(() => false)) await bindChat($, e.text).catch(() => undefined)
    if (fromPerson && e.text.startsWith(EDIT_MARK) && !e.command) {
      return { drop: await saveEdit($, e.text) }
    }
    // A notification arriving mid-edit is not the person giving up on the edit.
    if (fromPerson && (await read($, editing))) await update($, editing, () => null)
    void syncBandHidden($).catch(() => undefined)
    const snap = await read($, snapshot)
    const bound = await read($, boundChat)
    const boundLine = bound ? snap?.whatsapp.find(line => line.server === bound.server) : undefined
    if (!snap || (snap.whatsapp.length === 0 && snap.pos.length === 0) || (bound && (!boundLine || boundLine.error))) {
      void refresh($).catch(() => undefined)
    }

    return next(e)
  }).catch(async ($, e, next) => {
    // An edited prompt is never handed to the model, even when saving it failed; the text goes back.
    if (!e.text.startsWith(EDIT_MARK)) return next(e)
    await $.prompt.fill({ text: e.text }).catch(() => undefined)
    return { drop: 'Promptul nu s-a salvat. Textul e înapoi în casetă.' }
  })

  // A brand-new chat: its first message is in place once its first turn ends.
  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    if (!isChatLookedUp) await discoverChat($).catch(() => undefined)
    return done
  }).catch(($, e, next) => next(e))

  on('tool.call', async ($, e, next) => {
    if (e.tool === BIND_TOOL_FULL) return serveBind($, (e.input ?? {}) as Record<string, unknown>)
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

    // ── A command chat: this assistant's own band ───────────────────────
    const bound = await read($, boundChat)
    if (bound) {
      const phone = snap.whatsapp.find(line => line.server === bound.server)
      const one = phone?.assistants.find(item => item.id === bound.id) ?? null
      const target = { server: bound.server, id: bound.id }
      if (await read($, isChatBandHidden)) {
        return (
          <Box flexDirection="row">
            <Button key="chat-show" plain dimColor onPress={() => setChatBandHidden($, false)}>
              <Text color={BRAND} bold>
                🤖 {one?.name ?? bound.name} ▸
              </Text>
            </Button>
          </Box>
        )
      }
      if (!one) {
        // Not read yet, Connect not answering, or really gone: three different things to say.
        const why = !phone
          ? 'Se conectează la WhatsApp…'
          : phone.error
            ? `Connect nu răspunde: ${phone.error}`
            : 'nu mai apare în Connect (șters sau pe alt număr)'
        return (
          <Box flexDirection="row" gap={1} flexWrap="wrap">
            <Text color={BRAND} bold>
              🤖 {bound.name}
            </Text>
            <Text color={phone && !phone.error ? 'warning' : undefined} dimColor={!phone}>
              {why}
            </Text>
            <Button key="chat-refresh" label="Reîmprospătează" dimColor onPress={() => refresh($)} />
          </Box>
        )
      }
      const problem = problemOf(one, phone?.machine ?? null)
      const busy = await read($, isBusy)
      const info = await read($, notice)
      const state = problem
        ? { mark: '▲', color: 'warning', label: problem.title }
        : one.isActive
          ? { mark: '●', color: 'success', label: 'activ' }
          : { mark: '○', color: 'inactive', label: 'oprit' }
      const repair =
        problem?.fix === 'reset'
          ? 'Repară'
          : problem?.fix === 'resume'
            ? 'Pornește din nou'
            : problem?.fix === 'rerun'
              ? 'Încearcă din nou'
              : null
      return (
        <Box flexDirection="column">
          <Box flexDirection="row" gap={1} flexWrap="wrap">
            <Text color={BRAND} bold>
              🤖 {one.name}
            </Text>
            <Text color={state.color} bold>
              {state.mark} {state.label}
            </Text>
            <Text dimColor>
              · {one.kind === 'grup' ? 'grup' : 'direct'} · {modeLabel(one.mode)} · {runnerLabel(one.runner)} · ultimul
              mesaj {shortTime(one.lastMessageAt)}
            </Text>
          </Box>
          <Box flexDirection="row" gap={1} flexWrap="wrap">
            {problem && repair && (
              <Button
                key="chat-fix"
                label={busy ? 'Se repară…' : repair}
                variant="primary"
                onPress={() => (busy ? undefined : fix($, one, problem))}
              />
            )}
            {one.isActive ? (
              <Button key="chat-pause" label="Oprește" dimColor onPress={() => (busy ? undefined : toggle($, one))} />
            ) : (
              <Button
                key="chat-start"
                label="Pornește…"
                dimColor
                onPress={async () => {
                  await showAssistant($, target)
                  await toggle($, one)
                }}
              />
            )}
            {one.isActive && one.runner !== 'stream' && (
              <Button
                key="chat-run"
                label="Rulează acum"
                dimColor
                onPress={() =>
                  busy
                    ? undefined
                    : act($, target, 'update_watch', { check_now: true }, `Am pornit o rulare pentru „${one.name}”.`)
                }
              />
            )}
            <Button
              key="chat-today"
              label="Ce a făcut azi?"
              dimColor
              onPress={() =>
                $.prompt.submit({
                  text: `Ce a făcut azi asistentul „${one.name}” (monitorizarea ${one.id}, ${one.server})? Citește watch_activity și mesajele noi din conversația lui, apoi spune-mi pe scurt: ce a primit, ce a răspuns, ce a rămas deschis.`,
                })
              }
            />
            <Button
              key="chat-edit"
              label="✎ Modifică"
              variant="primary"
              onPress={async () => {
                await showAssistant($, target)
                await openEditor($, target)
              }}
            />
            <Button key="chat-card" label="Fișa" dimColor onPress={() => showAssistant($, target)} />
            <Button key="chat-all" label="Toți asistenții" dimColor onPress={openPane} />
            <Button key="chat-hide" label="Ascunde" dimColor onPress={() => setChatBandHidden($, true)} />
          </Box>
          {info && (
            <Text color={info.isError ? 'error' : 'success'}>
              {info.isError ? '✗ ' : '✓ '}
              {info.text}
            </Text>
          )}
        </Box>
      )
    }
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
    const { Box, Button, Input, Link, Select, Text } = $.ui.resolve(e)
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

      // The full editor of this assistant, opened with „Modifică”.
      const ed = await read($, editorOpen)
      if (ed && ed.id === one.id && ed.server === one.server) {
        const isEditingHere = edit !== null && edit.id === one.id && edit.server === one.server
        return (
          <Box flexDirection="column" gap={1}>
            {isEditingHere && (
              <Box flexDirection="column" borderStyle="round" borderColor="warning" paddingX={1}>
                <Text color="warning" bold>
                  Editezi un text în caseta de scris de jos
                </Text>
                <Text>Schimbă-l acolo și apasă Enter. Se salvează la asistent și nu se trimite lui Claude.</Text>
                <Button key="edit-cancel" label="Renunță la editare" dimColor onPress={() => cancelEdit($)} />
              </Box>
            )}
            {(await drawEditor($, { Box, Button, Input, Text, Select, Link }, one)) as any}
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
              key="edit-all"
              label="✎ Modifică tot"
              variant="primary"
              onPress={() => openEditor($, { server: one.server, id: one.id })}
            />
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
