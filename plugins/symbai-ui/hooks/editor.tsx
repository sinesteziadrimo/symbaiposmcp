import { atom, read, update } from 'claude-code'
import type { EngineInterface as Api, McpToolResult } from 'claude-code'

import { findServers, loadDetail, refresh, startTextEdit } from './core'
import { errorOf, jsonOf, num, shortTime, splitWords, str, strings, textOf } from './util'
import type {
  AssistantDetail,
  CapabilityInfo,
  Danger,
  Editing,
  Editor,
  EditorTab,
  PosCompany,
  PosIdentity,
  PosTask,
  Reminder,
  Routine,
  RunItem,
  Selected,
  TextField,
  WatchFull,
} from '../types'

// The same values the pane reads: a ref names the value, so both modules share it.
const editor = atom({ plugin: 'symbai-ui', key: 'editor' } as const, null)
const danger = atom({ plugin: 'symbai-ui', key: 'danger' } as const, null)
const openArea = atom({ plugin: 'symbai-ui', key: 'openArea' } as const, null)
const itemConfirm = atom({ plugin: 'symbai-ui', key: 'itemConfirm' } as const, null)
const notice = atom({ plugin: 'symbai-ui', key: 'notice' } as const, null)
const isBusy = atom({ plugin: 'symbai-ui', key: 'isBusy' } as const, false)
const selected = atom({ plugin: 'symbai-ui', key: 'selected' } as const, null)
const detail = atom({ plugin: 'symbai-ui', key: 'detail' } as const, null)

const BRAND = '#7C3AED'
const PREVIEW = 600

export const TABS: { value: EditorTab; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'reguli', label: 'Când și cui răspunde' },
  { value: 'rulare', label: 'Cum rulează' },
  { value: 'pos', label: 'În POS' },
  { value: 'sarcini', label: 'Sarcini și monitorizări' },
  { value: 'istoric', label: 'Istoric' },
  { value: 'pericol', label: 'Oprește sau șterge' },
]

const EFFORTS = ['minimal', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra']

// The assistant's page closes with the editor when the assistant is deleted.
async function closeDetail($: Api): Promise<void> {
  await update($, selected, () => null)
  await update($, detail, () => null)
}

// ── Reading ─────────────────────────────────────────────────────────

function toWatchFull(raw: Record<string, any>): WatchFull {
  const wait = /(\d+)s liniște, maxim (\d+)s/.exec(str(raw.asteptare) ?? '')
  return {
    jid: str(raw.conversatie?.jid) ?? '',
    notify: str(raw.anuntaPe),
    quietSeconds: wait ? Number(wait[1]) : null,
    maxWaitSeconds: wait ? Number(wait[2]) : null,
    model: str(raw.model),
    senders: strings(raw.doarDeLa),
    trusted: strings(raw.persoaneDeIncredere),
    createdAt: str(raw.creata),
    events: num(raw.evenimente) ?? 0,
    runs: num(raw.rulari) ?? 0,
    listeners: num(raw.ascultatori) ?? 0,
    sessionMemory: raw.memorieSesiune === true,
    notes: typeof raw.notite === 'string' ? raw.notite : '',
    objective: str(raw.obiectiv) ?? '',
  }
}

function toRun(raw: Record<string, any>): RunItem {
  return {
    at: str(raw.la),
    status: str(raw.stare) ?? '',
    trigger: str(raw.declansata),
    messages: num(raw.mesaje),
    steps: num(raw.pasi),
    seconds: num(raw.durataSecunde),
    summary: str(raw.rezumat) ?? str(raw.eroare),
  }
}

// A routine works on this chat when its own text names the chat.
function toRoutines(body: unknown, jid: string): Routine[] {
  if (!Array.isArray(body) || jid.length === 0) return []
  return body
    .filter((one: any) => typeof one?.spec?.objective === 'string' && one.spec.objective.includes(jid))
    .map((one: any) => ({
      id: String(one.id),
      name: str(one.spec?.name) ?? 'fără nume',
      active: one.active === true,
      nextAt: str(one.nextAt),
      lastSummary: str(one.lastSummary),
      failures: num(one.failures) ?? 0,
    }))
}

function toReminders(body: Record<string, any> | null, jid: string): Reminder[] {
  const list = Array.isArray(body?.reamintiri) ? body.reamintiri : []
  return list
    .filter((one: any) => JSON.stringify(one).includes(jid))
    .map((one: any) => ({
      id: Number(one.id),
      kind: str(one.fel) ?? str(one.kind) ?? '',
      due: str(one.termen) ?? str(one.due),
      status: str(one.stare) ?? str(one.status) ?? '',
    }))
}

// A POS tool's answer: { success, data } or a refusal.
function posData(result: McpToolResult): Record<string, any> {
  const body = jsonOf(result)
  if (result.isError || body?.success === false) {
    throw new Error(str(body?.error) ?? str(body?.message) ?? (textOf(result).slice(0, 300) || 'POS a refuzat.'))
  }
  return (body?.data ?? body ?? {}) as Record<string, any>
}

async function posRead($: Api, server: string, tool: string, args: Record<string, unknown>): Promise<Record<string, any>> {
  return posData(await $.mcp.call(server, 'citeste_tool', { nume: tool, argumente: args }))
}

// A long text read in parts says where the next part starts; a definition is always read whole.
function hasMoreText(value: unknown): boolean {
  return /"nextTextOffset":\d/.test(JSON.stringify(value ?? null))
}

// A random identity for a request the POS keeps once (run-task).
function requestId(): string {
  const hex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16))
  hex[12] = '4'
  hex[16] = ((Number.parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)
  const all = hex.join('')
  return `${all.slice(0, 8)}-${all.slice(8, 12)}-${all.slice(12, 16)}-${all.slice(16, 20)}-${all.slice(20)}`
}

function toTask(raw: Record<string, any>, jid: string): PosTask {
  const chatJid =
    str(raw.deliver?.whatsapp?.chatJid) ??
    (Array.isArray(raw.monitor?.sources) ? str(raw.monitor.sources.find((one: any) => one?.chatJid)?.chatJid) : null)
  return {
    id: String(raw.id),
    revision: num(raw.revision) ?? 1,
    name: str(raw.name) ?? 'fără nume',
    kind: str(raw.kind) ?? '',
    cadence: str(raw.cadence) ?? '',
    active: raw.active === true,
    lastRunAt: str(raw.lastRunAt),
    lastError: str(raw.lastError),
    runStatus: str(raw.runStatus),
    chatJid,
    isThisChat: chatJid !== null && chatJid === jid,
    isParticipation: raw.whatsapp != null && typeof raw.whatsapp === 'object',
  }
}

function toIdentity(profile: Record<string, any>, taskItems: Record<string, any>[], jid: string): PosIdentity | null {
  const one = profile.assistant
  if (!one || typeof one !== 'object') return null
  const def = (one.definition ?? {}) as Record<string, any>
  const envelope = def.envelope ?? {}
  const tasks = taskItems.map(task => toTask(task, jid))
  return {
    id: String(one.id),
    revision: num(one.revision) ?? 1,
    name: str(def.name) ?? 'fără nume',
    handle: str(def.handle) ?? '',
    role: typeof def.role === 'string' ? def.role : '',
    personality: typeof def.personality === 'string' ? def.personality : '',
    instructions: typeof def.instructions === 'string' ? def.instructions : '',
    active: def.active === true,
    model: str(def.model),
    effort: str(def.effort),
    executor: str(def.executor) ?? 'codex',
    stockMode: str(def.stockMode),
    learningMode: str(def.learningMode),
    capabilities: strings(envelope.capabilities),
    brandIds: Array.isArray(envelope.brandIds) ? envelope.brandIds.filter((id: unknown) => typeof id === 'number') : [],
    locationIds: Array.isArray(envelope.locationIds) ? envelope.locationIds.filter((id: unknown) => typeof id === 'number') : [],
    definition: def,
    tasks,
  }
}

async function loadCompany($: Api, server: string, jid: string): Promise<PosCompany> {
  const company: PosCompany = {
    server,
    company: null,
    error: null,
    identities: [],
    catalog: [],
    ceiling: [],
    brands: [],
    locations: [],
    models: [],
    isLegacyHeld: false,
  }
  try {
    const list = await posRead($, server, 'asistenti_lista', {})
    company.company = str(list.connection?.company)
    company.catalog = Array.isArray(list.capabilities)
      ? list.capabilities.map(
          (one: any): CapabilityInfo => ({
            id: String(one.id),
            area: str(one.area) ?? 'Altele',
            label: str(one.label) ?? String(one.id),
            effect: str(one.effect) ?? 'read',
          }),
        )
      : []
    company.ceiling = strings(list.ceiling?.capabilities)
    company.brands = Array.isArray(list.brands) ? list.brands.map((one: any) => ({ id: Number(one.id), name: String(one.name) })) : []
    company.locations = Array.isArray(list.locations)
      ? list.locations.map((one: any) => ({ id: Number(one.id), name: String(one.name) }))
      : []
    const device = Array.isArray(list.connection?.devices) ? list.connection.devices.find((one: any) => one?.online) : null
    for (const executor of ['codex', 'claude']) {
      for (const model of Array.isArray(device?.models?.[executor]) ? device.models[executor] : []) {
        company.models.push({ executor, id: String(model.id), label: str(model.label) ?? String(model.id) })
      }
    }
    const channels = Array.isArray(list.taskTargets?.whatsappChannels) ? list.taskTargets.whatsappChannels : []
    company.isLegacyHeld = channels.some((one: any) => strings(one?.legacyBusyChats).includes(jid))
    const assistants = Array.isArray(list.assistants) ? list.assistants : []
    for (const one of assistants) {
      if (!one?.id || (num(one.tasks?.total) ?? 0) === 0) continue
      const profile = await posRead($, server, 'asistent_citeste', { id: one.id, sectiune: 'profil', limit: 20 })
      // Every task, past the first page: the participation on this chat may be any of them.
      const items: Record<string, any>[] = Array.isArray(profile.tasks?.items) ? [...profile.tasks.items] : []
      let offset = num(profile.tasks?.nextOffset)
      for (let page = 0; offset !== null && page < 10; page++) {
        const more = await posRead($, server, 'asistent_citeste', { id: one.id, sectiune: 'sarcini', offset, limit: 20 }).catch(() => null)
        const list = more?.tasks ?? more
        if (!Array.isArray(list?.items)) break
        items.push(...list.items)
        offset = num(list.nextOffset)
      }
      const identity = toIdentity(profile, items, jid)
      if (identity && identity.tasks.some(task => task.isThisChat)) company.identities.push(identity)
    }
  } catch (cause) {
    company.error = errorOf(cause)
  }
  return company
}

async function patchEditor($: Api, id: string, change: (now: Editor) => Editor): Promise<void> {
  await update($, editor, now => (now && now.id === id ? change(now) : now))
}

async function loadConnect($: Api, target: Selected): Promise<void> {
  const [watches, activity, routines, reminders] = await Promise.all([
    $.mcp.call(target.server, 'list_watches', { watch: target.id }).catch(() => null),
    $.mcp.call(target.server, 'watch_activity', { watch: target.id, limit: 15 }).catch(() => null),
    $.mcp.call(target.server, 'list_routines', {}).catch(() => null),
    $.mcp.call(target.server, 'list_reminders', {}).catch(() => null),
  ])
  const raw = watches ? jsonOf(watches)?.monitorizari?.find((one: any) => one?.id === target.id) : null
  const watch = raw ? toWatchFull(raw) : null
  const jid = watch?.jid ?? ''
  const runs = activity ? jsonOf(activity)?.rulari : null
  await patchEditor($, target.id, now => ({
    ...now,
    watch,
    runs: Array.isArray(runs) ? runs.map(toRun) : [],
    routines: routines ? toRoutines(jsonOf(routines), jid) : [],
    reminders: reminders ? toReminders(jsonOf(reminders), jid) : [],
    error: watch ? null : 'Nu găsesc monitorizarea în Connect.',
  }))
}

export async function loadPos($: Api, target: Selected): Promise<void> {
  const now = await read($, editor)
  const jid = now?.watch?.jid ?? ''
  if (jid.length === 0) return
  await patchEditor($, target.id, one => ({ ...one, isPosLoading: true }))
  try {
    const servers = (await findServers($)).pos
    const pos = await Promise.all(servers.map(server => loadCompany($, server, jid)))
    await patchEditor($, target.id, one => ({ ...one, pos }))
  } finally {
    await patchEditor($, target.id, one => ({ ...one, isPosLoading: false }))
  }
}

export async function openEditor($: Api, target: Selected, tab: EditorTab = 'general'): Promise<void> {
  await update($, danger, () => null)
  await update($, itemConfirm, () => null)
  await update($, editor, () => ({
    server: target.server,
    id: target.id,
    tab,
    watch: null,
    runs: null,
    routines: null,
    reminders: null,
    pos: null,
    isPosLoading: false,
    error: null,
  }))
  await loadConnect($, target)
  void loadPos($, target).catch(() => undefined)
}

export async function closeEditor($: Api): Promise<void> {
  await update($, editor, () => null)
  await update($, danger, () => null)
  await update($, itemConfirm, () => null)
}

// ── Writing ─────────────────────────────────────────────────────────

async function say($: Api, text: string, isError: boolean): Promise<void> {
  await update($, notice, () => ({ text, isError }))
}

function refusalOf(result: McpToolResult): string | null {
  const body = jsonOf(result)
  if (!result.isError && body?.success !== false && typeof body?.error !== 'string') return null
  return str(body?.error) ?? str(body?.message) ?? (textOf(result).slice(0, 400) || 'Refuzat.')
}

async function busy<T>($: Api, work: () => Promise<T>): Promise<T | null> {
  if (await read($, isBusy)) return null
  await update($, isBusy, () => true)
  try {
    return await work()
  } catch (cause) {
    await say($, `Nu s-a schimbat: ${errorOf(cause)}`, true)
    return null
  } finally {
    await update($, isBusy, () => false)
  }
}

async function afterConnectChange($: Api, target: Selected): Promise<void> {
  await loadConnect($, target).catch(() => undefined)
  await loadDetail($, target).catch(() => null)
  void refresh($).catch(() => undefined)
}

// One Connect change on this watch; only the fields given change.
export async function changeWatch($: Api, args: Record<string, unknown>, done: string): Promise<void> {
  const now = await read($, editor)
  if (!now) return
  const target = { server: now.server, id: now.id }
  await busy($, async () => {
    const failure = refusalOf(await $.mcp.call(target.server, 'update_watch', { watch: target.id, ...args }))
    await say($, failure ? `Nu s-a schimbat: ${failure}` : done, failure !== null)
  })
  await afterConnectChange($, target)
}

async function connectCall($: Api, server: string, tool: string, args: Record<string, unknown>): Promise<string | null> {
  return refusalOf(await $.mcp.call(server, tool, args))
}

// A POS write, read back by the caller. The person's press on the panel is the owner's request.
async function posWrite($: Api, server: string, tool: string, args: Record<string, unknown>, done: string): Promise<boolean> {
  const result = await $.mcp.call(server, 'ruleaza_tool', { nume: tool, argumente: args })
  const failure = refusalOf(result)
  if (failure) {
    await say($, `POS nu a schimbat: ${failure}`, true)
    return false
  }
  await say($, done, false)
  return true
}

async function reloadPosAfter($: Api): Promise<void> {
  const now = await read($, editor)
  if (now) await loadPos($, { server: now.server, id: now.id }).catch(() => undefined)
}

// The definition keys asistent_actualizeaza takes; any other key read back is left out.
const DEFINITION_KEYS = [
  'session',
  'reporting',
  'local',
  'memory',
  'stockMode',
  'name',
  'handle',
  'role',
  'personality',
  'instructions',
  'avatar',
  'color',
  'executor',
  'deviceId',
  'model',
  'modelAutoUpgrade',
  'effort',
  'envelope',
  'learningMode',
  'active',
]

function definitionOf(identity: PosIdentity, change: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const key of DEFINITION_KEYS) {
    if (identity.definition[key] !== undefined) out[key] = identity.definition[key]
  }
  return { ...out, ...change }
}

export async function changeIdentity(
  $: Api,
  server: string,
  identity: PosIdentity,
  change: Record<string, unknown>,
  done: string,
): Promise<boolean> {
  const ok = await busy($, () =>
    posWrite(
      $,
      server,
      'asistent_actualizeaza',
      {
        id: identity.id,
        expectedRevision: identity.revision,
        definition: definitionOf(identity, change),
        reason: 'Schimbat de proprietar din panoul Symbai din Claude Code.',
      },
      done,
    ),
  )
  await reloadPosAfter($)
  return ok === true
}

type TaskAction = 'pause-task' | 'resume-task' | 'run-task' | 'delete-task'

export async function taskAction($: Api, server: string, identity: PosIdentity, task: PosTask, action: TaskAction): Promise<boolean> {
  const done = {
    'pause-task': `Sarcina „${task.name}” e oprită în POS.`,
    'resume-task': `Sarcina „${task.name}” e pornită în POS.`,
    'run-task': `Am pornit acum sarcina „${task.name}”.`,
    'delete-task': `Sarcina „${task.name}” a fost ștearsă din POS.`,
  }[action]
  const args =
    action === 'run-task'
      ? { action, id: identity.id, taskId: task.id, requestId: requestId() }
      : { action, id: identity.id, taskId: task.id, expectedRevision: task.revision }
  const ok = await busy($, () => posWrite($, server, 'asistent_comanda', args, done))
  await reloadPosAfter($)
  return ok === true
}

// The participation fields asistent_whatsapp takes back; a task with anything else set is changed in the POS app.
const SARCINA_KEYS = [
  'stockMode',
  'name',
  'kind',
  'instructions',
  'timezone',
  'schedule',
  'interval',
  'monitor',
  'deliver',
  'envelope',
  'maxRunsPerHour',
  'maxRunsPerDay',
  'active',
  'recoverMissed',
  'templateId',
  'document',
]
const WHATSAPP_KEYS = [
  'privacy',
  'mode',
  'ownMessages',
  'ownerEmail',
  'triggerWords',
  'debounceSeconds',
  'maxWaitSeconds',
  'intervalMinutes',
  'stopWhenResolved',
]

function sarcinaOf(config: Record<string, any>, change: Record<string, unknown>): Record<string, unknown> | string {
  const wa = config.whatsapp
  if (!wa || typeof wa !== 'object') return 'Sarcina nu e o participare WhatsApp; schimb-o din aplicația POS.'
  const extra =
    (Array.isArray(wa.clientRules) && wa.clientRules.length > 0) ||
    (typeof wa.limits === 'string' && wa.limits.trim().length > 0) ||
    (typeof wa.publicInformation === 'string' && wa.publicInformation.trim().length > 0) ||
    wa.route != null ||
    wa.ownReservations === true ||
    wa.ownEvents === true ||
    (typeof wa.humanPauseMinutes === 'number' && wa.humanPauseMinutes !== 10)
  // The tool saves the participation whole: what it cannot carry would go back to its default.
  if (extra) return 'Participarea are setări pentru clienți pe care nu le pot trimite de aici fără să le pierd; schimb-o din aplicația POS.'
  const out: Record<string, unknown> = {}
  for (const key of SARCINA_KEYS) if (config[key] !== undefined) out[key] = config[key]
  const whatsapp: Record<string, unknown> = {}
  for (const key of WHATSAPP_KEYS) if (wa[key] !== undefined) whatsapp[key] = wa[key]
  const { whatsapp: waChange, ...rest } = change as { whatsapp?: Record<string, unknown> }
  return { ...out, ...rest, whatsapp: { ...whatsapp, ...(waChange ?? {}) } }
}

export async function changeParticipation(
  $: Api,
  server: string,
  identity: PosIdentity,
  task: PosTask,
  change: Record<string, unknown>,
  done: string,
): Promise<boolean> {
  const ok = await busy($, async () => {
    const read = await posRead($, server, 'asistent_citeste', { id: identity.id, taskId: task.id })
    const config = read.task?.config
    if (!config || hasMoreText(read)) throw new Error('Nu am putut citi sarcina întreagă; schimb-o din aplicația POS.')
    const sarcina = sarcinaOf(config, change)
    if (typeof sarcina === 'string') throw new Error(sarcina)
    return posWrite(
      $,
      server,
      'asistent_whatsapp',
      { id: identity.id, taskId: task.id, expectedRevision: num(read.task?.revision) ?? task.revision, sarcina },
      done,
    )
  })
  await reloadPosAfter($)
  return ok === true
}

// ── Long texts: the prompt box is the editor ────────────────────────

export async function editText($: Api, field: TextField, extra?: { server: string; identity: PosIdentity; task?: PosTask }): Promise<void> {
  const now = await read($, editor)
  if (!now?.watch) return
  const base = { server: now.server, id: now.id, name: '' }
  if (field === 'notes') {
    const body = jsonOf(await $.mcp.call(now.server, 'read_watch_notes', { watch: now.id }))
    const text = typeof body?.notite === 'string' ? body.notite : typeof body?.notes === 'string' ? body.notes : now.watch.notes
    await startTextEdit($, { ...base, previous: text, field }, text, 'notițele')
    return
  }
  if (!extra) return
  const pos = { server: extra.server, assistantId: extra.identity.id, taskId: extra.task?.id }
  if (field === 'pos-task-instructions' && extra.task) {
    const got = await posRead($, extra.server, 'asistent_citeste', { id: extra.identity.id, taskId: extra.task.id })
    const text = typeof got.task?.config?.instructions === 'string' ? got.task.config.instructions : ''
    await startTextEdit($, { ...base, previous: text, field, pos }, text, `instrucțiunile sarcinii „${extra.task.name}” din POS`)
    return
  }
  const text = field === 'pos-personality' ? extra.identity.personality : extra.identity.instructions
  const what = field === 'pos-personality' ? 'personalitatea' : 'instrucțiunile'
  await startTextEdit($, { ...base, previous: text, field, pos }, text, `${what} lui „${extra.identity.name}” din POS`)
}

// Enter in the prompt box on one of the editor's texts. Returns the failure, or null once saved and read back.
export async function saveText($: Api, edit: Editing, text: string): Promise<string | null> {
  if (edit.field === 'notes') {
    const failure = await connectCall($, edit.server, 'update_watch', { watch: edit.id, notes: text })
    if (failure) return failure
    await afterConnectChange($, { server: edit.server, id: edit.id })
    return null
  }
  const pos = edit.pos
  const now = await read($, editor)
  const company = now?.pos?.find(one => one.server === pos?.server)
  const identity = company?.identities.find(one => one.id === pos?.assistantId)
  if (!pos || !identity) return 'Nu mai găsesc asistentul din POS; redeschide editorul.'
  let ok = false
  if (edit.field === 'pos-task-instructions') {
    const task = identity.tasks.find(one => one.id === pos.taskId)
    if (!task) return 'Nu mai găsesc sarcina din POS.'
    ok = await changeParticipation($, pos.server, identity, task, { instructions: text }, 'Instrucțiunile sarcinii sunt salvate în POS.')
  } else {
    const key = edit.field === 'pos-personality' ? 'personality' : 'instructions'
    ok = await changeIdentity($, pos.server, identity, { [key]: text }, 'Textul e salvat în POS.')
  }
  if (ok) return null
  const info = await read($, notice)
  return info?.isError ? info.text : 'Altă schimbare era în lucru; încearcă din nou.'
}

// ── Stop or delete, everywhere ──────────────────────────────────────

function linkedTasks(now: Editor): { server: string; identity: PosIdentity; task: PosTask }[] {
  const out: { server: string; identity: PosIdentity; task: PosTask }[] = []
  for (const company of now.pos ?? []) {
    for (const identity of company.identities) {
      for (const task of identity.tasks) if (task.isThisChat && task.isParticipation) out.push({ server: company.server, identity, task })
    }
  }
  return out
}

export async function runDanger($: Api): Promise<void> {
  const ask = await read($, danger)
  const now = await read($, editor)
  if (!ask || !now || ask.id !== now.id) return
  await update($, danger, () => null)
  const target = { server: now.server, id: now.id }
  const done: string[] = []
  const failed: string[] = []
  const posFailed: string[] = []
  await busy($, async () => {
    if (ask.withPos) {
      for (const { server, identity, task } of linkedTasks(now)) {
        const action = ask.action === 'delete-all' ? 'delete-task' : task.active ? 'pause-task' : null
        if (!action) continue
        const ok = await posWrite(
          $,
          server,
          'asistent_comanda',
          { action, id: identity.id, taskId: task.id, expectedRevision: task.revision },
          '',
        )
        ;(ok ? done : posFailed).push(`POS: ${task.name}`)
      }
    }
    failed.push(...posFailed)
    // Deleting the watch with the POS participation still on would leave it answering, unreachable from here.
    if (ask.action === 'delete-all' && failed.length > 0) return
    if (ask.withRoutines) {
      for (const routine of now.routines ?? []) {
        const failure =
          ask.action === 'delete-all'
            ? await connectCall($, target.server, 'delete_routine', { id: routine.id })
            : routine.active
              ? await connectCall($, target.server, 'set_routine_active', { id: routine.id, active: false })
              : null
        ;(failure ? failed : done).push(`sarcina programată „${routine.name}”`)
      }
    }
    if (ask.action === 'delete-all' && failed.length > 0) return
    if (ask.action === 'delete-all') {
      // The per-watch reporting route is not removed with the watch: drop it first.
      await connectCall($, target.server, 'assistant_reporting', { action: 'inherit', watch: target.id }).catch(() => null)
      const failure = await connectCall($, target.server, 'stop_watch', { watch: target.id, delete: true })
      ;(failure ? failed : done).push(failure ? `monitorizarea din Connect (${failure})` : 'monitorizarea din Connect, cu notițele și istoricul')
    } else {
      const failure = await connectCall($, target.server, 'update_watch', { watch: target.id, active: false })
      ;(failure ? failed : done).push(failure ? `monitorizarea din Connect (${failure})` : 'monitorizarea din Connect')
    }
  })
  const verb = ask.action === 'delete-all' ? 'Șters' : 'Oprit'
  const isHalted = ask.action === 'delete-all' && failed.length > 0
  const text = isHalted
    ? `Nu am șters monitorizarea din Connect: nu s-a putut ${failed.join(', ')}. Rezolvă întâi asta, apoi încearcă din nou.` +
      (done.length > 0 ? ` Deja făcut: ${done.join(', ')}.` : '')
    : `${verb}: ${done.length > 0 ? done.join(', ') : 'nimic'}.` + (failed.length > 0 ? ` Nu s-a putut: ${failed.join(', ')}.` : '')
  if (ask.action === 'delete-all' && failed.length === 0) {
    await closeEditor($)
    await closeDetail($)
    await say($, text, false)
    void refresh($).catch(() => undefined)
    return
  }
  await say($, text, failed.length > 0)
  await afterConnectChange($, target)
  await reloadPosAfter($)
}

// ── Drawing ─────────────────────────────────────────────────────────

type Els = { Box: any; Button: any; Input: any; Text: any; Select: any; Link: any }

// The POS page where the owner deletes an assistant, from the connection's name (symbai-<firmă>).
function myAssistantsUrl(server: string): string | null {
  const found = /^symbai-([a-z0-9]+(?:-[a-z][a-z0-9]*)*?)(?:-\d+)?$/.exec(server)
  return found ? `https://${found[1]}.symbai.app/my-assistants` : null
}

function grouped(catalog: CapabilityInfo[], ceiling: string[]): [string, CapabilityInfo[]][] {
  const areas = new Map<string, CapabilityInfo[]>()
  for (const one of catalog) {
    if (!ceiling.includes(one.id)) continue
    const list = areas.get(one.area) ?? []
    list.push(one)
    areas.set(one.area, list)
  }
  return [...areas.entries()]
}

function toggled(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter(one => one !== id) : [...list, id]
}

function toggledNum(list: number[], id: number): number[] {
  return list.includes(id) ? list.filter(one => one !== id) : [...list, id]
}

function intOf(value: string): number | null {
  const n = Number.parseInt(value.trim(), 10)
  return Number.isFinite(n) ? n : null
}

export async function drawEditor($: Api, els: Els, one: AssistantDetail): Promise<unknown> {
  const { Box, Button, Input, Text, Select, Link } = els
  const now = await read($, editor)
  if (!now) return null
  const isWorking = await read($, isBusy)
  const info = await read($, notice)
  const ask = await read($, danger)
  const itemAsk = await read($, itemConfirm)
  const area = await read($, openArea)
  const watch = now.watch

  const section = (title: string, children: unknown, hint?: string) => (
    <Box flexDirection="column" borderStyle="round" borderColor="subtle" paddingX={1}>
      <Text bold color={BRAND}>
        {title}
      </Text>
      {hint && <Text dimColor>{hint}</Text>}
      {children}
    </Box>
  )
  const row = (label: string, value: unknown) => (
    <Text>
      <Text dimColor>{label}: </Text>
      {value}
    </Text>
  )
  const preview = (text: string) => (text.length > PREVIEW ? `${text.slice(0, PREVIEW)}…` : text || '—')

  const header = (
    <Box flexDirection="column">
      <Button key="editor-back" label="← Înapoi la fișă" dimColor onPress={() => closeEditor($)} />
      <Text size="title" color={BRAND} bold>
        ✎ {one.name}
      </Text>
      <Text dimColor>
        {one.kind === 'grup' ? 'grup WhatsApp' : 'conversație directă'} · {one.isActive ? 'activ' : 'oprit'} ·{' '}
        {watch?.jid ?? ''}
      </Text>
      <Box flexDirection="row" gap={1} flexWrap="wrap" marginTop={1}>
        {TABS.map(tab => (
          <Button
            key={`tab-${tab.value}`}
            label={tab.label}
            variant={now.tab === tab.value ? 'primary' : undefined}
            dimColor={now.tab !== tab.value}
            onPress={() => update($, editor, ed => (ed ? { ...ed, tab: tab.value } : ed))}
          />
        ))}
      </Box>
    </Box>
  )

  const noticeLine = info && (
    <Box borderStyle="round" borderColor={info.isError ? 'error' : 'success'} paddingX={1}>
      <Text color={info.isError ? 'error' : 'success'}>
        {info.isError ? '✗ ' : '✓ '}
        {info.text}
      </Text>
    </Box>
  )

  if (!watch) {
    return (
      <Box flexDirection="column" gap={1}>
        {header}
        {noticeLine}
        <Text dimColor>{now.error ?? 'Citesc tot ce știe Connect despre asistent…'}</Text>
      </Box>
    )
  }

  let body: unknown = null

  if (now.tab === 'general') {
    body = (
      <Box flexDirection="column" gap={1}>
        {section(
          'Promptul (instrucțiunile lui din Connect)',
          <Box flexDirection="column">
            <Text>{preview(watch.objective)}</Text>
            <Text dimColor>{watch.objective.length} caractere</Text>
            <Box flexDirection="row" gap={1}>
              <Button key="ed-objective" label="Editează promptul" variant="primary" onPress={() => startTextEdit($, { server: now.server, id: now.id, name: one.name, previous: watch.objective, field: 'objective' }, watch.objective, 'promptul')} />
            </Box>
          </Box>,
          'Se editează în caseta de scris de jos; Enter salvează, nu se trimite lui Claude.',
        )}
        {section(
          'Notițele de lucru',
          <Box flexDirection="column">
            <Text>{preview(watch.notes)}</Text>
            <Text dimColor>{watch.notes.length} caractere (peste 12.000 primește avertisment, peste 20.000 e refuzat)</Text>
            <Box flexDirection="row" gap={1}>
              <Button key="ed-notes" label="Editează notițele" dimColor onPress={() => editText($, 'notes')} />
            </Box>
          </Box>,
          'Memoria asistentului: decizii, convenții, ce a rămas deschis.',
        )}
        {section(
          'Pe scurt',
          <Box flexDirection="column">
            {row('Creat', watch.createdAt ?? '—')}
            {row('Mesaje primite', String(watch.events))}
            {row('Rulări', String(watch.runs))}
            {row('Sesiuni care ascultă', String(watch.listeners))}
            {row('Ține minte conversația între rulări', watch.sessionMemory ? 'da' : 'nu')}
          </Box>,
        )}
      </Box>
    )
  }

  if (now.tab === 'reguli') {
    body = (
      <Box flexDirection="column" gap={1}>
        {section(
          'Când răspunde',
          <Box flexDirection="row" gap={1} flexWrap="wrap">
            {[
              { value: 'always', label: 'Mereu' },
              { value: 'mention', label: 'Doar când e chemat' },
              { value: 'silent', label: 'Silențios' },
            ].map(mode => (
              <Button
                key={`ed-mode-${mode.value}`}
                label={mode.label}
                variant={one.mode === mode.value ? 'primary' : undefined}
                dimColor={one.mode !== mode.value}
                onPress={() => (one.mode === mode.value ? undefined : changeWatch($, { mode: mode.value }, `Modul e acum: ${mode.label}.`))}
              />
            ))}
          </Box>,
        )}
        {section(
          'Cuvinte care îl cheamă',
          <Input
            key="ed-words"
            placeholder="ex.: Sym, Asistent (separate prin virgulă)"
            value={one.triggerWords.join(', ')}
            submitLabel="salvează"
            onSubmit={(value: string) => changeWatch($, { trigger_words: splitWords(value) }, 'Cuvintele sunt salvate.')}
          />,
          one.callNames.length > 0 ? `Din prompt îl mai cheamă: ${one.callNames.join(', ')}.` : undefined,
        )}
        {section(
          'Cine îl poate porni',
          <Input
            key="ed-senders"
            placeholder="gol = oricine; altfel numere sau JID-uri separate prin virgulă"
            value={watch.senders.join(', ')}
            submitLabel="salvează"
            onSubmit={(value: string) => changeWatch($, { senders: splitWords(value) }, 'Lista celor care îl pot porni e salvată.')}
          />,
          watch.senders.length === 0 ? 'Acum: oricine scrie în conversație.' : `Acum: ${watch.senders.length} identități.`,
        )}
        {section(
          'Pe cine ascultă ca pe tine',
          <Input
            key="ed-trusted"
            placeholder="numere sau JID-uri separate prin virgulă"
            value={watch.trusted.join(', ')}
            submitLabel="salvează"
            onSubmit={(value: string) => changeWatch($, { trusted: splitWords(value) }, 'Persoanele de încredere sunt salvate.')}
          />,
          'Instrucțiunile lor contează ca ale proprietarului.',
        )}
        {section(
          'Mesajele tale',
          <Box flexDirection="column">
            <Text>{one.ownerStart ?? '—'}</Text>
            <Box flexDirection="row" gap={1}>
              <Button
                key="ed-owner"
                label={one.includeOwnerMessages ? 'Nu-l mai porni la mesajele mele' : 'Pornește-l și la mesajele mele'}
                dimColor
                onPress={() =>
                  changeWatch(
                    $,
                    { include_owner_messages: !one.includeOwnerMessages },
                    one.includeOwnerMessages ? 'Mesajele tale nu-l mai pornesc.' : 'Mesajele tale îl pornesc acum.',
                  )
                }
              />
            </Box>
          </Box>,
        )}
        {section(
          'Cui îi cere decizii',
          <Input
            key="ed-notify"
            placeholder="număr sau JID; gol = proprietarul"
            value={watch.notify ?? ''}
            submitLabel="salvează"
            onSubmit={(value: string) => changeWatch($, { notify: value.trim() }, 'Destinația deciziilor e salvată.')}
          />,
        )}
      </Box>
    )
  }

  if (now.tab === 'rulare') {
    const number = (key: string, label: string, value: number | null, field: string, hint: string) => (
      <Box flexDirection="column">
        <Text>
          {label} <Text dimColor>· acum {value ?? 'implicit'}</Text>
        </Text>
        <Input
          key={key}
          placeholder={hint}
          submitLabel="salvează"
          onSubmit={async (value: string) => {
            const n = intOf(value)
            if (n === null) return say($, 'Scrie un număr întreg.', true)
            return changeWatch($, { [field]: n }, `${label}: ${n}.`)
          }}
        />
      </Box>
    )
    body = (
      <Box flexDirection="column" gap={1}>
        {section(
          'Cine lucrează',
          <Box flexDirection="column">
            <Box flexDirection="row" gap={1} flexWrap="wrap">
              {[
                { value: 'codex', label: 'Codex' },
                { value: 'claude', label: 'Claude Code' },
                { value: 'stream', label: 'Sesiunea Claude' },
              ].map(runner => (
                <Button
                  key={`ed-runner-${runner.value}`}
                  label={runner.label}
                  variant={one.runner === runner.value ? 'primary' : undefined}
                  dimColor={one.runner !== runner.value}
                  onPress={() =>
                    one.runner === runner.value ? undefined : changeWatch($, { dispatch: runner.value }, `Lucrează acum: ${runner.label}.`)
                  }
                />
              ))}
            </Box>
            <Text dimColor>Schimbarea o ia de la zero cu conversația și modelul; nu merge în timpul unei rulări.</Text>
          </Box>,
        )}
        {section(
          'Modelul',
          <Input
            key="ed-model"
            placeholder="gol = modelul implicit al executorului"
            value={watch.model ?? ''}
            submitLabel="salvează"
            onSubmit={(value: string) => changeWatch($, { model: value.trim() }, value.trim() ? `Modelul e acum ${value.trim()}.` : 'Folosește modelul implicit.')}
          />,
        )}
        {section(
          'Ritm și limite',
          <Box flexDirection="column" gap={1}>
            {number('ed-quiet', 'Așteaptă liniște (secunde)', watch.quietSeconds, 'quiet_seconds', '0–120')}
            {number('ed-wait', 'Așteaptă cel mult (secunde)', watch.maxWaitSeconds, 'max_wait_seconds', 'până la 600')}
            {number('ed-hour', 'Rulări pe oră, cel mult', one.maxRunsPerHour, 'max_runs_per_hour', '1–120; peste, se oprește singur')}
            {number('ed-turns', 'Pași într-o rulare, cel mult', null, 'max_turns', '5–200')}
          </Box>,
        )}
        {section(
          'Acțiuni',
          <Box flexDirection="row" gap={1} flexWrap="wrap">
            {one.isActive && one.runner !== 'stream' && (
              <Button key="ed-run" label="Rulează acum" dimColor onPress={() => changeWatch($, { check_now: true }, 'Am pornit o rulare.')} />
            )}
            <Button
              key="ed-clear"
              label="O ia de la zero (uită conversația)"
              dimColor
              onPress={() => changeWatch($, { clear_session: true }, 'Conversația lui e uitată; promptul și notițele au rămas.')}
            />
          </Box>,
        )}
      </Box>
    )
  }

  if (now.tab === 'pos') {
    const companies = now.pos ?? []
    const linked = companies.filter(company => company.identities.length > 0 || company.error)
    body = (
      <Box flexDirection="column" gap={1}>
        <Text dimColor>
          Asistenții numiți din POS care lucrează în această conversație. Schimbările se scriu direct în POS și se recitesc.
        </Text>
        {now.isPosLoading && <Text dimColor>Citesc firmele conectate…</Text>}
        {!now.isPosLoading && now.pos !== null && linked.length === 0 && (
          <Text>Niciun asistent din POS nu are această conversație. Asistentul lucrează doar prin Connect.</Text>
        )}
        {linked.map(company => (
          <Box key={`co-${company.server}`} flexDirection="column" gap={1}>
            <Text bold>
              {company.company ?? company.server} <Text dimColor>· {company.server}</Text>
            </Text>
            {company.error && <Text color="error">Nu pot citi: {company.error}</Text>}
            {company.isLegacyHeld && (
              <Text color="warning">Conversația e ținută acum de monitorizarea din Connect; participarea din POS așteaptă.</Text>
            )}
            {company.identities.map(identity => {
              const models = company.models.filter(model => model.executor === identity.executor)
              const areas = grouped(company.catalog, company.ceiling)
              return (
                <Box key={`id-${identity.id}`} flexDirection="column" gap={1} borderStyle="round" borderColor={BRAND} paddingX={1}>
                  <Text bold color={BRAND}>
                    🤖 {identity.name} <Text dimColor>@{identity.handle}</Text>
                  </Text>
                  <Text color={identity.active ? 'success' : 'inactive'}>{identity.active ? '● activ în POS' : '○ oprit în POS'}</Text>
                  <Box flexDirection="row" gap={1} flexWrap="wrap">
                    <Button
                      key={`pi-active-${identity.id}`}
                      label={identity.active ? 'Oprește identitatea în POS' : 'Pornește identitatea în POS'}
                      dimColor
                      onPress={() =>
                        changeIdentity($, company.server, identity, { active: !identity.active }, identity.active ? `„${identity.name}” e oprit în POS.` : `„${identity.name}” e pornit în POS.`)
                      }
                    />
                    <Button key={`pi-instr-${identity.id}`} label="Editează instrucțiunile" variant="primary" onPress={() => editText($, 'pos-instructions', { server: company.server, identity })} />
                    <Button key={`pi-pers-${identity.id}`} label="Editează personalitatea" dimColor onPress={() => editText($, 'pos-personality', { server: company.server, identity })} />
                  </Box>
                  {row('Rolul', identity.role || '—')}
                  <Input
                    key={`pi-role-${identity.id}`}
                    placeholder="rolul pe scurt (cel mult 240 de caractere)"
                    value={identity.role}
                    submitLabel="salvează rolul"
                    onSubmit={(value: string) => changeIdentity($, company.server, identity, { role: value.trim().slice(0, 240) }, 'Rolul e salvat în POS.')}
                  />
                  {row('Instrucțiuni', preview(identity.instructions))}
                  <Box flexDirection="row" gap={1} flexWrap="wrap">
                    <Select
                      key={`pi-exec-${identity.id}`}
                      label="Executor"
                      value={identity.executor}
                      options={[
                        { value: 'codex', label: 'Codex' },
                        { value: 'claude', label: 'Claude Code' },
                      ]}
                      onSelect={(value: string) => (value === identity.executor ? undefined : changeIdentity($, company.server, identity, { executor: value, model: null }, `Executorul e acum ${value}.`))}
                    />
                    {models.length > 0 && (
                      <Select
                        key={`pi-model-${identity.id}`}
                        label="Model"
                        value={identity.model ?? ''}
                        options={[{ value: '', label: 'implicit' }, ...models.map(model => ({ value: model.id, label: model.label }))]}
                        onSelect={(value: string) => changeIdentity($, company.server, identity, { model: value || null }, `Modelul e acum ${value || 'implicit'}.`)}
                      />
                    )}
                    <Select
                      key={`pi-effort-${identity.id}`}
                      label="Efort"
                      value={identity.effort ?? ''}
                      options={[{ value: '', label: 'implicit' }, ...EFFORTS.map(effort => ({ value: effort, label: effort }))]}
                      onSelect={(value: string) => changeIdentity($, company.server, identity, { effort: value || null }, `Efortul e acum ${value || 'implicit'}.`)}
                    />
                    <Select
                      key={`pi-stock-${identity.id}`}
                      label="Stocuri"
                      value={identity.stockMode ?? ''}
                      options={[
                        { value: '', label: 'nesetat' },
                        { value: 'report', label: 'doar raportează' },
                        { value: 'operate', label: 'operează' },
                      ]}
                      onSelect={(value: string) => changeIdentity($, company.server, identity, { stockMode: value || null }, 'Modul stocurilor e salvat.')}
                    />
                    <Select
                      key={`pi-learn-${identity.id}`}
                      label="Învățare"
                      value={identity.learningMode ?? 'review'}
                      options={[
                        { value: 'review', label: 'cere aprobarea lecțiilor' },
                        { value: 'group-notes', label: 'învață singur în grupul sursă' },
                      ]}
                      onSelect={(value: string) => changeIdentity($, company.server, identity, { learningMode: value }, 'Modul de învățare e salvat.')}
                    />
                  </Box>
                  <Text bold>Unde are voie</Text>
                  <Box flexDirection="row" gap={1} flexWrap="wrap">
                    {company.brands.map(brand => (
                      <Button
                        key={`pi-brand-${identity.id}-${brand.id}`}
                        label={`${identity.brandIds.includes(brand.id) ? '☑' : '☐'} ${brand.name}`}
                        dimColor={!identity.brandIds.includes(brand.id)}
                        onPress={() =>
                          changeIdentity($, company.server, identity, { envelope: { ...(identity.definition.envelope as object), brandIds: toggledNum(identity.brandIds, brand.id) } }, 'Brandurile sunt salvate.')
                        }
                      />
                    ))}
                    {company.locations.map(location => (
                      <Button
                        key={`pi-loc-${identity.id}-${location.id}`}
                        label={`${identity.locationIds.includes(location.id) ? '☑' : '☐'} ${location.name}`}
                        dimColor={!identity.locationIds.includes(location.id)}
                        onPress={() =>
                          changeIdentity($, company.server, identity, { envelope: { ...(identity.definition.envelope as object), locationIds: toggledNum(identity.locationIds, location.id) } }, 'Unitățile sunt salvate.')
                        }
                      />
                    ))}
                  </Box>
                  <Text bold>
                    Drepturi <Text dimColor>· {identity.capabilities.length} din {company.ceiling.length} permise firmei</Text>
                  </Text>
                  {areas.map(([name, items]) => {
                    const key = `${identity.id}:${name}`
                    const isOpen = area === key
                    const on = items.filter(item => identity.capabilities.includes(item.id)).length
                    return (
                      <Box key={`area-${key}`} flexDirection="column">
                        <Button key={`area-btn-${key}`} plain dimColor={on === 0} onPress={() => update($, openArea, value => (value === key ? null : key))}>
                          <Text>
                            {isOpen ? '▾' : '▸'} {name} <Text dimColor>· {on}/{items.length}</Text>
                          </Text>
                        </Button>
                        {isOpen &&
                          items.map(item => {
                            const has = identity.capabilities.includes(item.id)
                            return (
                              <Button
                                key={`cap-${identity.id}-${item.id}`}
                                plain
                                dimColor={!has}
                                onPress={() =>
                                  changeIdentity(
                                    $,
                                    company.server,
                                    identity,
                                    { envelope: { ...(identity.definition.envelope as object), capabilities: toggled(identity.capabilities, item.id) } },
                                    has ? `Am scos dreptul: ${item.label}.` : `Am dat dreptul: ${item.label}.`,
                                  )
                                }
                              >
                                <Text>
                                  {'   '}
                                  {has ? '☑' : '☐'} {item.label} <Text dimColor>{item.effect === 'write' ? '· modifică' : '· citește'}</Text>
                                </Text>
                              </Button>
                            )
                          })}
                      </Box>
                    )
                  })}
                  <Box flexDirection="column">
                    <Text bold>Șterge identitatea de tot</Text>
                    <Text dimColor>
                      POS-ul o șterge doar din pagina „Asistenții mei”, unde scrii numele „{identity.name}” ca să confirmi; se pierd toate sarcinile și istoricul ei.
                    </Text>
                    {myAssistantsUrl(company.server) ? (
                      <Link href={myAssistantsUrl(company.server)} label="Deschide „Asistenții mei” în POS" />
                    ) : (
                      <Text dimColor>În POS: meniul Personal → Asistenții mei.</Text>
                    )}
                  </Box>
                  <Text bold>Participarea în această conversație</Text>
                  {identity.tasks
                    .filter(task => task.isThisChat && task.isParticipation)
                    .map(task => (
                      <Box key={`pt-${task.id}`} flexDirection="column">
                        <Text>
                          <Text color={task.active ? 'success' : 'inactive'}>{task.active ? '●' : '○'}</Text> {task.name}{' '}
                          <Text dimColor>· {task.cadence}</Text>
                        </Text>
                        <Box flexDirection="row" gap={1} flexWrap="wrap">
                          <Button key={`pt-instr-${task.id}`} label="Editează instrucțiunile participării" dimColor onPress={() => editText($, 'pos-task-instructions', { server: company.server, identity, task })} />
                          {['mention', 'always', 'silent'].map(mode => (
                            <Button
                              key={`pt-mode-${task.id}-${mode}`}
                              label={mode === 'mention' ? 'Doar când e chemat' : mode === 'always' ? 'Mereu' : 'Silențios'}
                              dimColor
                              onPress={() => changeParticipation($, company.server, identity, task, { whatsapp: { mode } }, 'Modul participării e salvat în POS.')}
                            />
                          ))}
                        </Box>
                      </Box>
                    ))}
                </Box>
              )
            })}
          </Box>
        ))}
        <Box flexDirection="row" gap={1}>
          <Button key="pos-reload" label={now.isPosLoading ? 'Se citește…' : 'Recitește din POS'} dimColor onPress={() => loadPos($, { server: now.server, id: now.id })} />
        </Box>
      </Box>
    )
  }

  if (now.tab === 'sarcini') {
    const companies = (now.pos ?? []).filter(company => company.identities.length > 0)
    const taskRow = (server: string, identity: PosIdentity, task: PosTask) => {
      const key = `${identity.id}:${task.id}`
      const isAsking = itemAsk?.kind === 'pos-task-delete' && itemAsk.key === key
      return (
        <Box key={`st-${key}`} flexDirection="column">
          <Text>
            <Text color={task.active ? 'success' : 'inactive'}>{task.active ? '●' : '○'}</Text> {task.name}{' '}
            <Text dimColor>
              · {task.cadence || task.kind} · ultima {shortTime(task.lastRunAt)}
              {task.isThisChat ? ' · această conversație' : ''}
            </Text>
          </Text>
          {task.lastError && <Text color="warning">  {task.lastError}</Text>}
          <Box flexDirection="row" gap={1} flexWrap="wrap">
            <Button
              key={`st-toggle-${key}`}
              label={task.active ? 'Oprește' : 'Pornește'}
              dimColor
              onPress={() => taskAction($, server, identity, task, task.active ? 'pause-task' : 'resume-task')}
            />
            <Button key={`st-run-${key}`} label="Rulează acum" dimColor onPress={() => taskAction($, server, identity, task, 'run-task')} />
            {isAsking && (
              <Button
                key={`st-del-yes-${key}`}
                label="Da, șterge sarcina și istoricul ei"
                variant="primary"
                onPress={async () => {
                  await update($, itemConfirm, () => null)
                  await taskAction($, server, identity, task, 'delete-task')
                }}
              />
            )}
            {isAsking && <Button key={`st-del-no-${key}`} label="Renunță" dimColor onPress={() => update($, itemConfirm, () => null)} />}
            {!isAsking && (
              <Button key={`st-del-${key}`} label="Șterge…" dimColor onPress={() => update($, itemConfirm, () => ({ kind: 'pos-task-delete', key }))} />
            )}
          </Box>
        </Box>
      )
    }
    body = (
      <Box flexDirection="column" gap={1}>
        {section(
          'Monitorizări pe această conversație',
          <Box flexDirection="column">
            <Text>
              <Text color={one.isActive ? 'success' : 'inactive'}>{one.isActive ? '●' : '○'}</Text> Connect · {one.name}{' '}
              <Text dimColor>
                · {watch.listeners > 0 ? `${watch.listeners} sesiuni ascultă` : 'fără sesiuni care ascultă'}
              </Text>
            </Text>
            {companies.flatMap(company =>
              company.identities.flatMap(identity =>
                identity.tasks
                  .filter(task => task.isThisChat)
                  .map(task => (
                    <Text key={`mon-${task.id}`}>
                      <Text color={task.active ? 'success' : 'inactive'}>{task.active ? '●' : '○'}</Text> POS {company.company ?? company.server} ·{' '}
                      {identity.name} · {task.name}
                    </Text>
                  )),
              ),
            )}
            {now.isPosLoading && <Text dimColor>Citesc POS-ul…</Text>}
          </Box>,
          'Toate locurile care urmăresc conversația. Două active pe aceeași conversație pot răspunde de două ori.',
        )}
        {companies.map(company =>
          company.identities.map(identity =>
            section(
              `Sarcinile lui ${identity.name} în POS (${company.company ?? company.server})`,
              identity.tasks.length > 0 ? identity.tasks.map(task => taskRow(company.server, identity, task)) : <Text dimColor>Nicio sarcină.</Text>,
            ),
          ),
        )}
        {section(
          'Sarcini programate pe acest calculator',
          (now.routines ?? []).length > 0 ? (
            (now.routines ?? []).map(routine => {
              const isAsking = itemAsk?.kind === 'routine-delete' && itemAsk.key === routine.id
              return (
                <Box key={`rt-${routine.id}`} flexDirection="column">
                  <Text>
                    <Text color={routine.active ? 'success' : 'inactive'}>{routine.active ? '●' : '○'}</Text> {routine.name}{' '}
                    <Text dimColor>
                      · {routine.active ? `următoarea ${shortTime(routine.nextAt)}` : 'pe pauză'}
                      {routine.failures > 0 ? ` · ${routine.failures} eșecuri` : ''}
                    </Text>
                  </Text>
                  {routine.lastSummary && <Text dimColor>  {routine.lastSummary}</Text>}
                  <Box flexDirection="row" gap={1}>
                    <Button
                      key={`rt-toggle-${routine.id}`}
                      label={routine.active ? 'Pune pe pauză' : 'Reia'}
                      dimColor
                      onPress={async () => {
                        const failure = await busy($, () => connectCall($, now.server, 'set_routine_active', { id: routine.id, active: !routine.active }))
                        await say($, failure ? `Nu s-a schimbat: ${failure}` : routine.active ? 'Sarcina e pe pauză.' : 'Sarcina pornește la următorul termen.', Boolean(failure))
                        await loadConnect($, { server: now.server, id: now.id })
                      }}
                    />
                    {isAsking && (
                      <Button
                        key={`rt-del-yes-${routine.id}`}
                        label="Da, șterge sarcina"
                        variant="primary"
                        onPress={async () => {
                          await update($, itemConfirm, () => null)
                          const failure = await busy($, () => connectCall($, now.server, 'delete_routine', { id: routine.id }))
                          await say($, failure ? `Nu s-a șters: ${failure}` : `„${routine.name}” a fost ștearsă.`, Boolean(failure))
                          await loadConnect($, { server: now.server, id: now.id })
                        }}
                      />
                    )}
                    {isAsking && <Button key={`rt-del-no-${routine.id}`} label="Renunță" dimColor onPress={() => update($, itemConfirm, () => null)} />}
                    {!isAsking && (
                      <Button key={`rt-del-${routine.id}`} label="Șterge…" dimColor onPress={() => update($, itemConfirm, () => ({ kind: 'routine-delete', key: routine.id }))} />
                    )}
                  </Box>
                </Box>
              )
            })
          ) : (
            <Text dimColor>Nicio sarcină programată nu lucrează pe această conversație.</Text>
          ),
          'Cele care trimit în această conversație sau o citesc.',
        )}
        {section(
          'Reamintiri',
          (now.reminders ?? []).length > 0 ? (
            (now.reminders ?? []).map(reminder => (
              <Text key={`rm-${reminder.id}`}>
                {reminder.kind} · {shortTime(reminder.due)} · <Text dimColor>{reminder.status}</Text>
              </Text>
            ))
          ) : (
            <Text dimColor>Nicio reamintire pentru această conversație.</Text>
          ),
        )}
      </Box>
    )
  }

  if (now.tab === 'istoric') {
    const runs = now.runs ?? []
    body = section(
      'Ultimele rulări',
      runs.length > 0 ? (
        runs.map((run, index) => (
          <Box key={`run-${index}`} flexDirection="column" marginTop={index === 0 ? 0 : 1}>
            <Text>
              <Text color={run.status === 'ok' ? 'success' : 'warning'}>{run.status === 'ok' ? '✓' : '!'}</Text> {shortTime(run.at)}{' '}
              <Text dimColor>
                · {run.trigger ?? '—'}
                {run.messages !== null ? ` · ${run.messages} mesaje` : ''}
                {run.steps !== null ? ` · ${run.steps} pași` : ''}
                {run.seconds !== null ? ` · ${run.seconds}s` : ''}
              </Text>
            </Text>
            {run.summary && <Text dimColor>{run.summary}</Text>}
          </Box>
        ))
      ) : (
        <Text dimColor>Nicio rulare încă.</Text>
      ),
    )
  }

  if (now.tab === 'pericol') {
    const tasks = linkedTasks(now)
    const pick = (action: Danger['action']) =>
      update($, danger, () => ({ server: now.server, id: now.id, action, withPos: tasks.length > 0, withRoutines: false }))
    const isAsking = ask !== null && ask.id === now.id
    body = (
      <Box flexDirection="column" gap={1}>
        {section(
          'Oprește peste tot',
          <Box flexDirection="column">
            <Text>Nu mai răspunde nicăieri, dar păstrează tot: promptul, notițele, istoricul, sarcinile.</Text>
            <Box flexDirection="row">
              <Button key="dz-stop" label="Oprește…" onPress={() => pick('stop-all')} />
            </Box>
          </Box>,
        )}
        {section(
          'Șterge de tot',
          <Box flexDirection="column">
            <Text>Șterge monitorizarea din Connect cu notițele și istoricul ei și, dacă alegi, participarea din POS. Nu se poate anula.</Text>
            <Box flexDirection="row">
              <Button key="dz-delete" label="Șterge…" onPress={() => pick('delete-all')} />
            </Box>
          </Box>,
        )}
        {isAsking && ask && (
          <Box flexDirection="column" borderStyle="round" borderColor="error" paddingX={1}>
            <Text color="error" bold>
              {ask.action === 'delete-all' ? `Ștergi definitiv „${one.name}”?` : `Oprești „${one.name}” peste tot?`}
            </Text>
            <Text>• Connect: monitorizarea{ask.action === 'delete-all' ? ', notițele, istoricul și ruta de raportare' : ''}</Text>
            {tasks.length > 0 && (
              <Button key="dz-pos" plain onPress={() => update($, danger, value => (value ? { ...value, withPos: !value.withPos } : value))}>
                <Text>
                  {ask.withPos ? '☑' : '☐'} POS: {tasks.map(item => `${item.identity.name} · ${item.task.name}`).join('; ')}
                </Text>
              </Button>
            )}
            {(now.routines ?? []).length > 0 && (
              <Button key="dz-routines" plain onPress={() => update($, danger, value => (value ? { ...value, withRoutines: !value.withRoutines } : value))}>
                <Text>
                  {ask.withRoutines ? '☑' : '☐'} Sarcini programate: {(now.routines ?? []).map(routine => routine.name).join('; ')}
                </Text>
              </Button>
            )}
            {now.isPosLoading && <Text dimColor>Încă citesc POS-ul; așteaptă să apară participările înainte să confirmi.</Text>}
            {ask.action === 'delete-all' && tasks.length > 0 && (
              <Text dimColor>Identitatea din POS ({tasks[0]?.identity.name}) rămâne, cu celelalte sarcini ale ei; o oprești din fila „În POS”.</Text>
            )}
            <Box flexDirection="row" gap={1}>
              <Button
                key="dz-confirm"
                label={isWorking ? 'Se lucrează…' : ask.action === 'delete-all' ? 'Da, șterge definitiv' : 'Da, oprește'}
                variant="primary"
                onPress={() => (isWorking || now.isPosLoading ? undefined : runDanger($))}
              />
              <Button key="dz-cancel" label="Renunță" dimColor onPress={() => update($, danger, () => null)} />
            </Box>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box flexDirection="column" gap={1}>
      {header}
      {noticeLine}
      {isWorking && <Text dimColor>Se salvează…</Text>}
      {body}
    </Box>
  )
}
