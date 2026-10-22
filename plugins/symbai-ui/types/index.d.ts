export type Assistant = {
  id: string
  server: string
  name: string
  kind: string
  isActive: boolean
  mode: string
  runner: string
  lastRunState: string | null
  lastRunAt: string | null
  lastRunSummary: string | null
  lastMessageAt: string | null
  stopReason: string | null
  tip: string | null
  runs: number
}

export type AssistantDetail = Assistant & {
  objective: string
  triggerWords: string[]
  callNames: string[]
  ownerStart: string | null
  includeOwnerMessages: boolean
  maxRunsPerHour: number | null
  notesLength: number
  trustedCount: number
  senders: string[]
}

// What this computer can run: null when Connect did not say.
export type Machine = {
  claudeReady: boolean | null
  codexReady: boolean | null
  problems: string[]
}

export type WhatsAppLine = {
  server: string
  number: string | null
  name: string | null
  isConnected: boolean
  organization: string | null
  licence: string | null
  assistants: Assistant[]
  machine: Machine
  error: string | null
}

export type PosLine = {
  server: string
  employee: string | null
  version: string | null
  isOk: boolean
  error: string | null
}

export type Snapshot = {
  refreshedAt: number
  whatsapp: WhatsAppLine[]
  pos: PosLine[]
}

export type Selected = { server: string; id: string }

export type Notice = { text: string; isError: boolean }

// A long text edited in the prompt box: a watch's prompt or notes, or a text of its assistant in the POS.
export type TextField = 'objective' | 'notes' | 'pos-instructions' | 'pos-personality' | 'pos-task-instructions'

export type Editing = {
  server: string
  id: string
  name: string
  previous: string
  field?: TextField
  pos?: { server: string; assistantId: string; taskId?: string }
}

export type Undo = { server: string; id: string; objective: string; saved: string }

// A step the person confirms first: deleting, or starting one that will answer what piled up.
export type Confirm = Selected & { action: 'delete' | 'start' }

// ── The full editor of one assistant ───────────────────────────────

// Everything Connect keeps for a watch, read whole.
export type WatchFull = {
  jid: string
  notify: string | null
  quietSeconds: number | null
  maxWaitSeconds: number | null
  model: string | null
  senders: string[]
  trusted: string[]
  createdAt: string | null
  events: number
  runs: number
  listeners: number
  sessionMemory: boolean
  notes: string
  objective: string
}

export type RunItem = {
  at: string | null
  status: string
  trigger: string | null
  messages: number | null
  steps: number | null
  seconds: number | null
  summary: string | null
}

// A scheduled task of this computer that works on this conversation.
export type Routine = {
  id: string
  name: string
  active: boolean
  nextAt: string | null
  lastSummary: string | null
  failures: number
}

export type Reminder = { id: number; kind: string; due: string | null; status: string }

export type PosTask = {
  id: string
  revision: number
  name: string
  kind: string
  cadence: string
  active: boolean
  lastRunAt: string | null
  lastError: string | null
  runStatus: string | null
  chatJid: string | null
  isThisChat: boolean
  // A WhatsApp participation (the assistant answers in the chat), not a task that only delivers there.
  isParticipation: boolean
}

// A named assistant of the company whose tasks include this conversation.
export type PosIdentity = {
  id: string
  revision: number
  name: string
  handle: string
  role: string
  personality: string
  instructions: string
  active: boolean
  model: string | null
  effort: string | null
  executor: string
  stockMode: string | null
  learningMode: string | null
  capabilities: string[]
  brandIds: number[]
  locationIds: number[]
  // The whole saved definition, sent back on every change with only the edited field replaced.
  definition: Record<string, unknown>
  tasks: PosTask[]
}

export type CapabilityInfo = { id: string; area: string; label: string; effect: string }

export type PosCompany = {
  server: string
  company: string | null
  error: string | null
  identities: PosIdentity[]
  catalog: CapabilityInfo[]
  ceiling: string[]
  brands: { id: number; name: string }[]
  locations: { id: number; name: string }[]
  models: { executor: string; id: string; label: string }[]
  // Connect still holds this chat with the old watch: the POS participation waits.
  isLegacyHeld: boolean
}

export type EditorTab = 'general' | 'reguli' | 'rulare' | 'pos' | 'sarcini' | 'istoric' | 'pericol'

export type Editor = {
  server: string
  id: string
  tab: EditorTab
  watch: WatchFull | null
  runs: RunItem[] | null
  routines: Routine[] | null
  reminders: Reminder[] | null
  pos: PosCompany[] | null
  isPosLoading: boolean
  error: string | null
}

// What the danger zone will do, chosen before the last press.
export type Danger = {
  server: string
  id: string
  action: 'delete-all' | 'stop-all'
  withPos: boolean
  withRoutines: boolean
}

// A step on a single POS task or Connect routine that is confirmed first.
export type ItemConfirm = { kind: 'pos-task-delete' | 'routine-delete'; key: string }

// The assistant a command chat in the sidebar belongs to.
export type Bound = { server: string; id: string; name: string }

export type Role = { id: string; text: string | null; error: string | null }

declare module 'claude-code' {
  interface PluginState {
    'symbai-ui': {
      snapshot: Snapshot | null
      isLoading: boolean
      isBandHidden: boolean
      showInactive: boolean
      selected: Selected | null
      detail: AssistantDetail | null
      isBusy: boolean
      notice: Notice | null
      showFullObjective: boolean
      editing: Editing | null
      undo: Undo | null
      role: Role | null
      isRoleLoading: boolean
      busyId: string | null
      confirming: Confirm | null
      boundChat: Bound | null
      isChatBandHidden: boolean
      editor: Editor | null
      danger: Danger | null
      openArea: string | null
      itemConfirm: ItemConfirm | null
    }
  }
}
