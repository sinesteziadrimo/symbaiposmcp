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

export type WhatsAppLine = {
  server: string
  number: string | null
  name: string | null
  isConnected: boolean
  organization: string | null
  licence: string | null
  assistants: Assistant[]
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
    }
  }
}
