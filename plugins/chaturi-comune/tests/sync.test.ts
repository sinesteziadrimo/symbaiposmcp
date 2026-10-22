import { expect, mock, test } from 'claude-code/testing'

import { chats } from '../hooks/register'

// The command as the person types it in the desktop app.
const RUN = {
  command: 'chaturi-comune',
  args: '',
  origin: { kind: 'composer' },
  presentation: { isFullscreen: false, columns: 80 },
} as const

const REPORT = {
  ok: true,
  added: 3,
  updated: 1,
  withoutConversation: 21,
  accounts: [
    {
      account: 'aaaaaaaa-1111-2222-3333-444444444444',
      email: 'ana@firma.ro',
      isActive: true,
      chats: 10,
      added: 3,
      updated: 0,
    },
    {
      account: 'bbbbbbbb-1111-2222-3333-444444444444',
      email: null,
      isActive: false,
      chats: 9,
      added: 0,
      updated: 1,
    },
  ],
  errors: [],
}

test('the command runs the sync script and reports every account', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  mock.store(on)
  mock.env(on, { APPDATA: 'C:\\Users\\Ana\\AppData\\Roaming' })
  const runs: string[][] = []
  on('process.run', ($, e) => {
    runs.push([...e.argv])
    return { value: { exitCode: 0, stdout: `${JSON.stringify(REPORT)}\r\n`, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
  })

  const { text } = await $.command.run(RUN)

  expect(runs.length).toBe(1)
  expect(runs[0]?.[0]).toBe('powershell.exe')
  expect(runs[0]?.at(-1)).toMatch(/scripts\/sync\.ps1$/)
  expect(text).toContain('am sincronizat lista pentru 2 conturi')
  expect(text).toContain('- ana@firma.ro (contul tău): 10 chat-uri, 3 noi')
  expect(text).toContain('- cont bbbbbbbb (emailul apare după prima lui sesiune): 9 chat-uri, 1 actualizate')
  expect(text).toContain('21 de chat-uri nu mai au conversația salvată')
  expect(text).toContain('clic dreapta pe iconița Claude de lângă ceas → Quit')
})

test('the command says when another sync holds the lock', async ($, on) => {
  mock.clock(on)
  mock.store(on)
  mock.env(on, { APPDATA: 'C:\\Users\\Ana\\AppData\\Roaming' })
  on('process.run', () => ({ value: { exitCode: 0, stdout: '{"ok":true,"busy":true}', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }))

  const { text } = await $.command.run(RUN)

  expect(text).toContain('o altă sincronizare rulează chiar acum')
})

test('counts read as Romanian', async () => {
  expect(chats(1)).toBe('1 chat')
  expect(chats(2)).toBe('2 chat-uri')
  expect(chats(19)).toBe('19 chat-uri')
  expect(chats(20)).toBe('20 de chat-uri')
  expect(chats(101)).toBe('101 chat-uri')
  expect(chats(120)).toBe('120 de chat-uri')
})
