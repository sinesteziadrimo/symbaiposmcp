import type { EngineInterface, Register } from 'claude-code'

// What scripts/sync.ps1 prints: one line of JSON.
type AccountReport = {
  account: string
  email: string | null
  isActive: boolean
  chats: number
  added: number
  updated: number
}

export type SyncReport = {
  ok: boolean
  busy?: boolean
  added?: number
  updated?: number
  withoutConversation?: number
  accounts?: AccountReport[]
  errors?: string[]
}

const LAST_RUN = 'lastRunAt'
// The store is shared by every session on this PC, so these gaps hold
// across all of them: many open chats do not each start a sync.
const GAP_AFTER_START_MS = 60_000
const GAP_AFTER_TURN_MS = 5 * 60_000
// The app reads an account's list only when it starts or the account logs in;
// closing its window leaves it running beside the clock.
const RESTART_HINT =
  'Lista se reîncarcă doar la pornirea aplicației: închide Claude de tot (clic dreapta pe iconița Claude de lângă ceas → Quit) și deschide-l din nou. Celelalte conturi văd chat-urile la următoarea logare.'

export const chats = (n: number): string => {
  if (n === 1) return '1 chat'
  const tail = n % 100
  return n > 0 && (tail === 0 || tail >= 20) ? `${n} de chat-uri` : `${n} chat-uri`
}

async function sync($: EngineInterface, gapMs: number): Promise<SyncReport | undefined> {
  // The app's Code tab keeps its lists under %APPDATA%: Windows only.
  if ((await $.env.get('APPDATA')) === undefined) return undefined
  const now = await $.clock.now()
  const lastRun = Number((await $.store.get(LAST_RUN)) ?? 0)
  if (now - lastRun < gapMs) return undefined
  await $.store.set(LAST_RUN, now)

  const run = await $.process.run(
    [
      'powershell.exe',
      '-NoProfile',
      '-NonInteractive',
      '-ExecutionPolicy',
      'Bypass',
      '-File',
      `${$.plugin.root}/scripts/sync.ps1`,
    ],
    { timeoutMs: 120_000 },
  )
  const line = run.stdout.trim().split(/\r?\n/).pop() ?? ''
  try {
    return JSON.parse(line) as SyncReport
  } catch {
    return { ok: false, errors: [run.stderr.trim() || `codul de ieșire ${run.exitCode}`] }
  }
}

export function describe(report: SyncReport | undefined): string {
  if (report === undefined) return 'Chat-uri comune: funcționează doar pe Windows, cu aplicația desktop Claude.'
  if (report.busy) return 'Chat-uri comune: o altă sincronizare rulează chiar acum. Încearcă din nou peste un minut.'

  const accounts = report.accounts ?? []
  const lines = [`Chat-uri comune: am sincronizat lista pentru ${accounts.length} conturi de pe acest PC.`]
  for (const account of accounts) {
    const who = account.email ?? `cont ${account.account.slice(0, 8)} (emailul apare după prima lui sesiune)`
    const changes = [
      account.added > 0 ? `${account.added} noi` : '',
      account.updated > 0 ? `${account.updated} actualizate` : '',
    ].filter(Boolean)
    lines.push(
      `- ${who}${account.isActive ? ' (contul tău)' : ''}: ${chats(account.chats)}` +
        (changes.length > 0 ? `, ${changes.join(', ')}` : ''),
    )
  }
  lines.push(RESTART_HINT)
  if ((report.withoutConversation ?? 0) > 0) {
    lines.push(
      `${chats(report.withoutConversation ?? 0)} nu mai au conversația salvată pe acest PC, așa că nu au fost copiate.`,
    )
  }
  for (const error of report.errors ?? []) lines.push(`Eroare: ${error}`)

  return lines.join('\n')
}

function syncSoon($: EngineInterface, gapMs: number): void {
  $.clock.after(2_000, () => {
    sync($, gapMs)
      .then(report => {
        const mine = report?.accounts?.find(account => account.isActive)
        if (mine !== undefined && mine.added > 0) {
          $.ui.toast(
            `Chat-uri comune: ${chats(mine.added)} din alte conturi au intrat în lista ta. ${RESTART_HINT}`,
          )
        }
      })
      .catch(() => undefined)
  })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'chaturi-comune',
      description: 'Copiază acum chat-urile tuturor conturilor Claude de pe acest PC în lista fiecărui cont.',
    })
    const started = await next(e)
    syncSoon($, GAP_AFTER_START_MS)

    return started
  })

  on('turn.complete', async ($, e, next) => {
    const completed = await next(e)
    syncSoon($, GAP_AFTER_TURN_MS)

    return completed
  })

  on('command.run', { command: 'chaturi-comune' }, async $ => ({ text: describe(await sync($, 0)) })).catch(
    () => ({ text: 'Chat-uri comune: sincronizarea nu a putut rula. Încearcă din nou.' }),
  )
}
