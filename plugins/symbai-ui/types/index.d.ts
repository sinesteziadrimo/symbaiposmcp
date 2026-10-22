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

export type Editing = { server: string; id: string; name: string; previous: string }

export type Undo = { server: string; id: string; objective: string; saved: string }

// A step the person confirms first: deleting, or starting one that will answer what piled up.
export type Confirm = Selected & { action: 'delete' | 'start' }

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
    }
  }
}
