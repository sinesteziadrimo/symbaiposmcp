import { expect, test } from 'claude-code/testing'

const WA = 'symbai-whatsapp-numarul-meu'
const POS = 'symbai-firma'
const JID = '120363000000000001@g.us'

const PANE_PROPS = {
  title: 'Symbai · Asistenți',
  isFocused: false,
  bodyColumns: 80,
  placement: 'dock',
  scroll: { offset: 0, bodyRows: 60, contentRows: 0 },
} as any

const DEFINITION = {
  name: 'Sym Firma',
  handle: 'sym_firma',
  role: 'Ajută echipa.',
  personality: 'Scurt și clar.',
  instructions: 'Ești Sym Firma și ajuți echipa cu comenzile.',
  executor: 'codex',
  deviceId: 'wad_1',
  model: 'gpt-x',
  effort: 'medium',
  active: true,
  stockMode: 'report',
  learningMode: 'review',
  envelope: { brandIds: [40], locationIds: [2], capabilities: ['stock.read'] },
}

function world(on: any) {
  const calls: { server: string; tool: string; args: any }[] = []
  const state = {
    watch: {
      id: 'w1',
      activa: true,
      mod: 'always',
      dispatch: 'codex',
      conversatie: { nume: 'Comenzi Firma', tip: 'grup', jid: JID },
      obiectiv: 'Ești Sym. Preiei comenzile.',
      notite: '## Deschis\nComanda 12 așteaptă prețul.',
      asteptare: '8s liniște, maxim 45s',
      doarDeLa: [],
      persoaneDeIncredere: ['40700000001@s.whatsapp.net'],
      creata: '2026-10-08 15:17',
      evenimente: 12,
      rulari: 3,
      plafonOrar: 20,
    } as Record<string, any> | null,
    task: { id: 't1', revision: 2, name: 'Comenzi pe grup', kind: 'monitor', cadence: 'WhatsApp · Mereu', active: true, deliver: { whatsapp: { chatJid: JID } }, whatsapp: { mode: 'always' } },
    other: { id: 't2', revision: 1, name: 'Raport de dimineață', kind: 'schedule', cadence: 'Zilnic 08:00', active: true, deliver: { whatsapp: null } },
    revision: 3,
    ownEvents: false,
    deleteFails: false,
    notes: '## Deschis\nComanda 12 așteaptă prețul.',
  }
  const ok = (body: unknown) => ({ value: { content: [{ type: 'text', text: JSON.stringify(body) }], isError: false } })

  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.status', () => ({ value: undefined }))
  on('clock.now', () => ({ value: 1_760_000_000_000 }))
  on('ui.render', () => ({ type: 'Box', props: {}, children: [] }))
  on('store.get', () => ({ value: undefined }))
  on('store.set', () => ({ value: undefined }))
  on('model.complete', () => ({ value: { isAnswered: false, reason: 'empty-reply', usage: { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } } }))
  on('tool.list', () => ({
    value: [
      { name: `mcp__${WA}__list_watches`, description: '', mcp: true },
      { name: `mcp__${POS}__verifica_conexiune`, description: '', mcp: true },
    ],
  }))
  on('mcp.call', ($: any, e: any) => {
    calls.push({ server: e.server, tool: e.tool, args: e.args })
    if (e.server === WA) {
      if (e.tool === 'connection_status') return ok({ whatsapp: { numar: '40700000000', conectat: true } })
      if (e.tool === 'list_watches') return ok({ monitorizari: state.watch ? [state.watch] : [] })
      if (e.tool === 'watch_activity') return ok({ rulari: [{ la: '2026-10-21 14:34:31', stare: 'ok', declansata: 'mesaj nou', mesaje: 5, pasi: 38, durataSecunde: 177, rezumat: 'Am introdus 5 comenzi.' }] })
      if (e.tool === 'list_routines') {
        return ok([
          { id: 'r1', spec: { name: 'Raportul zilei', objective: `Trimite în ${JID} raportul.` }, active: true, nextAt: '2026-10-23T05:00:00Z', failures: 0 },
          { id: 'r2', spec: { name: 'Altceva', objective: 'Alt grup.' }, active: true },
        ])
      }
      if (e.tool === 'list_reminders') return ok({ reamintiri: [] })
      if (e.tool === 'read_watch_notes') return ok({ notite: state.notes, revizie: 4 })
      if (e.tool === 'update_watch') {
        if (typeof e.args.mode === 'string' && state.watch) state.watch.mod = e.args.mode
        if (typeof e.args.notes === 'string') state.notes = e.args.notes
        return ok({ success: true })
      }
      if (e.tool === 'assistant_reporting') return ok({ success: true })
      if (e.tool === 'stop_watch') {
        if (e.args.delete === true) state.watch = null
        return ok({ success: true })
      }
      return ok({})
    }
    if (e.server === POS) {
      if (e.tool === 'verifica_conexiune') return ok({ success: true, data: { versiuneInstanta: '19.3.1' } })
      if (e.tool === 'citeste_tool' && e.args.nume === 'asistenti_lista') {
        return ok({
          success: true,
          data: {
            connection: { company: 'Firma Test', devices: [{ online: true, models: { codex: [{ id: 'gpt-x', label: 'GPT X' }, { id: 'gpt-y', label: 'GPT Y' }] } }] },
            assistants: [{ id: 'a1', tasks: { total: 2 } }, { id: 'a2', tasks: { total: 0 } }],
            capabilities: [
              { id: 'stock.read', area: 'Stocuri', label: 'Investighează stocuri', effect: 'read' },
              { id: 'stock.operate', area: 'Stocuri', label: 'Operează stocuri', effect: 'write' },
              { id: 'cash.read', area: 'Casă', label: 'Verifică închiderile', effect: 'read' },
            ],
            ceiling: { capabilities: ['stock.read', 'stock.operate'] },
            brands: [{ id: 40, name: 'Brand Test' }],
            locations: [{ id: 2, name: 'Fabrica' }],
            taskTargets: { whatsappChannels: [{ legacyBusyChats: [JID] }] },
          },
        })
      }
      if (e.tool === 'citeste_tool' && e.args.nume === 'asistent_citeste') {
        // The POS reads at most 8000 characters of text a call.
        if (typeof e.args.argumente.textLimit === 'number' && e.args.argumente.textLimit > 8000) return ok({ success: false, message: 'textLimit peste 8000' })
        if (e.args.argumente.taskId === 't1') {
          return ok({
            success: true,
            data: {
              task: {
                id: 't1',
                revision: state.task.revision,
                config: {
                  kind: 'monitor',
                  name: 'Comenzi pe grup',
                  active: state.task.active,
                  instructions: 'Răspunzi la comenzi în grup.',
                  document: { kind: 'report', title: 'Raportul comenzilor', requirements: 'Toate comenzile zilei.', formats: ['pdf'] },
                  deliver: { whatsapp: { chatJid: JID, connectionId: 'c1' } },
                  monitor: { sources: [{ type: 'whatsapp', chatJid: JID, connectionId: 'c1' }] },
                  envelope: DEFINITION.envelope,
                  whatsapp: { mode: 'always', privacy: 'internal', ownMessages: true, ownEvents: state.ownEvents, triggerWords: ['Sym'], route: null, limits: '', clientRules: [], publicInformation: '', humanPauseMinutes: 10 },
                },
              },
            },
          })
        }
        return ok({
          success: true,
          data: {
            assistant: { id: 'a1', revision: state.revision, definition: { ...DEFINITION, createdBy: 'nu se trimite' } },
            tasks: { items: [state.task, state.other] },
          },
        })
      }
      if (e.tool === 'ruleaza_tool') {
        if (e.args.nume === 'asistent_comanda' && e.args.argumente.action === 'delete-task' && state.deleteFails) {
          return ok({ success: false, error: 'Sarcina are un dosar de implementare deschis.' })
        }
        if (e.args.nume === 'asistent_comanda' && e.args.argumente.action === 'pause-task') state.task = { ...state.task, active: false }
        return ok({ success: true, data: {} })
      }
    }
    return ok({})
  })
  return { calls, state }
}

const posWrites = (calls: { tool: string; args: any }[]) => calls.filter(one => one.tool === 'ruleaza_tool')

test('editorul complet: Connect și POS se schimbă din același loc', async ($, on) => {
  let box = ''
  on('prompt.fill', ($: any, e: any) => {
    box = e.text
    return { isFilled: true }
  })
  on('prompt.read', () => ({ value: { text: box, cursor: 0 } }))
  on('prompt.submit', ($: any, e: any) => ({ text: e.text }))
  const { calls } = world(on)

  await $.command.run({ command: 'symbai', args: '', origin: { kind: 'composer' } } as any)
  const pane = await $.ui.mount({ plugin: 'symbai-ui', surface: 'desktop', component: 'Pane', requestId: 'symbai-asistenti', props: PANE_PROPS })
  await pane.press({ key: 'open-w1' })
  await pane.press({ key: 'edit-all' })

  // General: the prompt, the notes and the counters.
  expect(await pane.find({ type: 'Text', text: /✎ Comenzi Firma/ })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /Comanda 12 așteaptă prețul/ })).toBeDefined()

  // The notes are edited in the prompt box and saved to Connect, never sent to Claude.
  await pane.press({ key: 'ed-notes' })
  expect(box.startsWith('✎ PROMPT „Comenzi Firma” · notițele')).toBe(true)
  const sent = await $.prompt.submit({ text: `${box.split('\n')[0]}\n## Deschis\nNimic.`, origin: { kind: 'composer' } } as any)
  expect(JSON.stringify(sent)).toContain('e salvat')
  expect(calls.find(one => one.tool === 'update_watch' && one.args.notes === '## Deschis\nNimic.')).toBeDefined()

  // Rules: the mode changes in Connect.
  await pane.press({ key: 'tab-reguli' })
  await pane.press({ key: 'ed-mode-mention' })
  expect(calls.find(one => one.tool === 'update_watch' && one.args.mode === 'mention')).toEqual({ server: WA, tool: 'update_watch', args: { watch: 'w1', mode: 'mention' } })

  // POS: only the identity whose task is on this chat, with its rights in areas.
  await pane.press({ key: 'tab-pos' })
  expect(await pane.find({ type: 'Text', text: /Sym Firma/ })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /ținută acum de monitorizarea din Connect/ })).toBeDefined()
  expect(await pane.find({ key: 'area-btn-a1:Casă' })).toBeUndefined()
  await pane.press({ key: 'area-btn-a1:Stocuri' })
  await pane.press({ key: 'cap-a1-stock.operate' })
  const grant = posWrites(calls).at(-1)
  expect(grant?.args.nume).toBe('asistent_actualizeaza')
  expect(grant?.args.argumente.expectedRevision).toBe(3)
  expect(grant?.args.argumente.definition.envelope.capabilities).toEqual(['stock.read', 'stock.operate'])
  expect(grant?.args.argumente.definition.createdBy).toBeUndefined()
  expect(grant?.args.argumente.definition.instructions).toBe(DEFINITION.instructions)

  // The participation's mode goes back whole, in the shape the POS takes.
  await pane.press({ key: 'pt-mode-t1-silent' })
  const mode = posWrites(calls).at(-1)
  expect(mode?.args.nume).toBe('asistent_whatsapp')
  // ownMessages stays as stored; ownEvents is another field and is never derived from it.
  expect(mode?.args.argumente.sarcina.whatsapp).toEqual({ privacy: 'internal', mode: 'silent', ownMessages: true, triggerWords: ['Sym'] })
  expect(mode?.args.argumente.sarcina.instructions).toBe('Răspunzi la comenzi în grup.')
  expect(mode?.args.argumente.sarcina.document?.title).toBe('Raportul comenzilor')

  // Run now carries a request id the POS keeps once.
  await pane.press({ key: 'tab-sarcini' })
  await pane.press({ key: 'st-run-a1:t2' })
  const run = posWrites(calls).at(-1)?.args.argumente
  expect(run.action).toBe('run-task')
  expect(run.requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  expect(run.expectedRevision).toBeUndefined()
  await pane.press({ key: 'tab-pos' })

  // Tasks: every task of the identity, the routines on this chat only.
  await pane.press({ key: 'tab-sarcini' })
  expect(await pane.find({ type: 'Text', text: /Raport de dimineață/ })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /Raportul zilei/ })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /Altceva/ })).toBeUndefined()
  await pane.press({ key: 'st-toggle-a1:t1' })
  expect(posWrites(calls).at(-1)?.args).toEqual({ nume: 'asistent_comanda', argumente: { action: 'pause-task', id: 'a1', taskId: 't1', expectedRevision: 2 } })

  // History.
  await pane.press({ key: 'tab-istoric' })
  expect(await pane.find({ type: 'Text', text: /Am introdus 5 comenzi/ })).toBeDefined()
  await pane.unmount()
})

test('ștergerea de tot cere confirmare și curăță Connect și participarea din POS', async ($, on) => {
  on('prompt.read', () => ({ value: { text: '', cursor: 0 } }))
  const { calls, state } = world(on)
  await $.command.run({ command: 'symbai', args: '', origin: { kind: 'composer' } } as any)

  // The deletion happens once: one surface, the terminal, named.
  const pane = await $.ui.mount({ plugin: 'symbai-ui', surface: 'terminal', component: 'Pane', requestId: 'symbai-asistenti', props: PANE_PROPS })
  await pane.press({ key: 'open-w1' })
  await pane.press({ key: 'edit-all' })
  await pane.press({ key: 'tab-pericol' })
  await pane.press({ key: 'dz-delete' })
  expect(await pane.find({ type: 'Text', text: /Ștergi definitiv „Comenzi Firma”/ })).toBeDefined()
  expect(calls.find(one => one.tool === 'stop_watch')).toBeUndefined()

  await pane.press({ key: 'dz-confirm' })
  const order = calls
    .filter(one => ['ruleaza_tool', 'assistant_reporting', 'stop_watch'].includes(one.tool))
    .map(one => (one.tool === 'ruleaza_tool' ? `${one.args.nume}:${one.args.argumente.action}` : one.tool))
  expect(order).toEqual(['asistent_comanda:delete-task', 'assistant_reporting', 'stop_watch'])
  expect(calls.find(one => one.tool === 'stop_watch')?.args).toEqual({ watch: 'w1', delete: true })
  expect(state.watch).toBeNull()
  expect(await pane.find({ type: 'Text', text: /Șters:/ })).toBeDefined()
  expect(await pane.find({ key: 'open-w1' })).toBeUndefined()
  await pane.unmount()
})

test('o participare cu setări pentru clienți nu se rescrie de aici; ștergerea se oprește dacă POS refuză', async ($, on) => {
  on('prompt.read', () => ({ value: { text: '', cursor: 0 } }))
  const { calls, state } = world(on)
  state.ownEvents = true
  state.deleteFails = true
  await $.command.run({ command: 'symbai', args: '', origin: { kind: 'composer' } } as any)
  const pane = await $.ui.mount({ plugin: 'symbai-ui', surface: 'desktop', component: 'Pane', requestId: 'symbai-asistenti', props: PANE_PROPS })
  await pane.press({ key: 'open-w1' })
  await pane.press({ key: 'edit-all' })

  await pane.press({ key: 'tab-pos' })
  await pane.press({ key: 'pt-mode-t1-mention' })
  expect(posWrites(calls).find(one => one.args.nume === 'asistent_whatsapp')).toBeUndefined()
  expect(await pane.find({ type: 'Text', text: /schimb-o din aplicația POS/ })).toBeDefined()

  await pane.press({ key: 'tab-pericol' })
  await pane.press({ key: 'dz-delete' })
  await pane.press({ key: 'dz-confirm' })
  expect(calls.find(one => one.tool === 'stop_watch')).toBeUndefined()
  expect(calls.find(one => one.tool === 'assistant_reporting')).toBeUndefined()
  expect(state.watch).not.toBeNull()
  expect(await pane.find({ type: 'Text', text: /Nu am șters monitorizarea din Connect/ })).toBeDefined()
  await pane.unmount()
})
