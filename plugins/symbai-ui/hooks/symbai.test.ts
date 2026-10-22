import { expect, test } from 'claude-code/testing'

const WA = 'symbai-whatsapp-numarul-meu'
const POS = 'symbai'

const answers: Record<string, unknown> = {
  connection_status: {
    whatsapp: { numar: '40700000000', conectat: true, nume: 'Test' },
    numarul: { nume: 'Numărul meu' },
    licenta: { stare: 'active', organizatie: 'Firma Test' },
  },
  list_watches: {
    monitorizari: [
      {
        id: 'a',
        activa: true,
        mod: 'always',
        dispatch: 'codex',
        conversatie: { nume: 'Grup Comenzi', tip: 'grup' },
        ultimaRulare: { la: '2026-10-20 13:40:39', stare: 'failed', rezumat: 'Codex: exit status 1' },
        ultimulMesaj: '2026-10-20 13:34:09',
      },
      {
        id: 'b',
        activa: true,
        mod: 'mention',
        dispatch: 'stream',
        conversatie: { nume: 'Ana', tip: 'contact' },
        ultimulMesaj: '2026-10-19 10:00:00',
      },
      {
        id: 'c',
        activa: false,
        mod: 'always',
        dispatch: 'claude',
        conversatie: { nume: 'Vechi', tip: 'contact' },
      },
    ],
  },
  verifica_conexiune: {
    success: true,
    data: { angajat: { nume: 'MIHAI' }, versiuneInstanta: '19.3.842' },
  },
}

const PANE_PROPS = {
  title: 'Symbai · Asistenți',
  isFocused: false,
  bodyColumns: 60,
  placement: 'dock',
  scroll: { offset: 0, bodyRows: 40, contentRows: 0 },
} as any

const BAND_PROPS = {
  hasSurvey: false,
  isWorking: false,
  maxRows: 10,
  bodyColumns: 120,
  scroll: { offset: 0, bodyRows: 10, contentRows: 0 },
} as any

function host(on: any) {
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.status', () => ({ value: undefined }))
  on('clock.now', () => ({ value: 1_760_000_000_000 }))
  on('ui.render', () => ({ type: 'Box', props: {}, children: [] }))
}

test('panoul și banda arată asistenții și conexiunile', async ($, on) => {
  host(on)
  on('tool.list', () => ({
    value: [
      { name: `mcp__${WA}__list_watches`, description: '', mcp: true },
      { name: `mcp__${WA}__connection_status`, description: '', mcp: true },
      { name: `mcp__${POS}__verifica_conexiune`, description: '', mcp: true },
      { name: 'mcp__other__list_watches', description: '', mcp: true },
      { name: 'Bash', description: '', mcp: false },
    ],
  }))
  on('mcp.call', ($, e) => ({
    value: {
      content: [{ type: 'text', text: JSON.stringify(answers[e.tool] ?? {}) }],
      isError: false,
    },
  }))

  const ran = await $.command.run({ command: 'symbai', args: '', origin: { kind: 'composer' } } as any)
  expect(JSON.stringify(ran)).toContain('2 asistenți activi, 1 de reparat')

  for (const surface of ['terminal', 'desktop'] as const) {
    const pane = await $.ui.mount({
      plugin: 'symbai-ui',
      surface,
      component: 'Pane',
      requestId: 'symbai-asistenti',
      props: PANE_PROPS,
    })
    expect(await pane.find({ type: 'Button', text: /Grup Comenzi/ })).toBeDefined()
    expect(await pane.find({ type: 'Text', text: /Ultima rulare a eșuat/ })).toBeDefined()
    expect(await pane.find({ type: 'Button', text: /Ana/ })).toBeDefined()
    expect(await pane.find({ type: 'Button', text: /Vechi/ })).toBeUndefined()
    expect(await pane.find({ type: 'Text', text: /v19\.3\.842/ })).toBeDefined()

    await pane.press({ key: 'inactive' })
    expect(await pane.find({ type: 'Button', text: /Vechi/ })).toBeDefined()
    await pane.press({ key: 'inactive' })
    await pane.unmount()

    const band = await $.ui.mount({ plugin: 'symbai-ui', surface, component: 'AbovePrompt', props: BAND_PROPS })
    expect(await band.find({ type: 'Text', text: /40700000000/ })).toBeDefined()
    expect(await band.find({ type: 'Text', text: /1 de reparat/ })).toBeDefined()
    await band.press({ key: 'hide' })
    expect(await band.find({ type: 'Text', text: /40700000000/ })).toBeUndefined()
    // Hidden, the band keeps one small button that brings it back.
    expect(await band.find({ type: 'Button', key: 'show' } as any)).toBeDefined()
    await band.press({ key: 'show' })
    expect(await band.find({ type: 'Text', text: /40700000000/ })).toBeDefined()
    await band.unmount()
  }
})

test('panoul nu se deschide singur; banda ascunsă rămâne ascunsă în alt chat', async ($, on) => {
  const opened: unknown[] = []
  const store = new Map<string, unknown>([['isBandHidden', true]])
  on('ui.open', ($, e) => {
    opened.push(e)
    return { value: { isPlaced: true } }
  })
  on('ui.status', () => ({ value: undefined }))
  on('clock.now', () => ({ value: 1_760_000_000_000 }))
  on('ui.render', () => ({ type: 'Box', props: {}, children: [] }))
  on('store.get', ($, e) => ({ value: store.get(e.key) }))
  on('store.set', ($, e) => {
    store.set(e.key, e.value)
    return { value: undefined }
  })
  on('tool.list', () => ({
    value: [
      { name: `mcp__${WA}__list_watches`, description: '', mcp: true },
      { name: `mcp__${WA}__connection_status`, description: '', mcp: true },
    ],
  }))
  on('mcp.call', ($, e) => ({
    value: { content: [{ type: 'text', text: JSON.stringify(answers[e.tool] ?? {}) }], isError: false },
  }))

  on('command.register', () => ({ value: undefined }))
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  await $.session.start({ source: 'startup', cwd: 'D:/x' } as any)
  expect(opened.length).toBe(0)

  await $.command.run({ command: 'symbai', args: '', origin: { kind: 'composer' } } as any)
  expect(opened.length).toBe(1)
  const band = await $.ui.mount({ plugin: 'symbai-ui', surface: 'desktop', component: 'AbovePrompt', props: BAND_PROPS })
  expect(await band.find({ type: 'Text', text: /40700000000/ })).toBeUndefined()
  await band.press({ key: 'show' })
  expect(store.get('isBandHidden')).toBe(false)
  expect(await band.find({ type: 'Text', text: /40700000000/ })).toBeDefined()
  await band.unmount()
})

test('fără conexiuni Symbai banda nu apare', async ($, on) => {
  host(on)
  on('tool.list', () => ({ value: [{ name: 'Bash', description: '', mcp: false }] }))

  await $.command.run({ command: 'symbai', args: '', origin: { kind: 'composer' } } as any)
  const band = await $.ui.mount({ plugin: 'symbai-ui', surface: 'desktop', component: 'AbovePrompt', props: BAND_PROPS })
  expect(await band.find({ type: 'Text', text: /Symbai/ })).toBeUndefined()
  await band.unmount()
})

test('un asistent se deschide și se modifică din panou', async ($, on) => {
  host(on)
  const updates: Record<string, unknown>[] = []
  const prompts: string[] = []
  const state: Record<string, Record<string, unknown>> = {
    a: { id: 'a', activa: true, mod: 'always', dispatch: 'codex', conversatie: { nume: 'Grup Comenzi', tip: 'grup' }, cuvinteDeclansare: ['Sym'], obiectiv: 'Ești Sym. Preiei comenzile.', notite: 'x'.repeat(50) },
    c: { id: 'c', activa: false, mod: 'always', dispatch: 'claude', conversatie: { nume: 'Vechi', tip: 'contact' }, obiectiv: 'Vechi.' },
  }
  on('tool.list', () => ({
    value: [
      { name: `mcp__${WA}__list_watches`, description: '', mcp: true },
      { name: `mcp__${WA}__connection_status`, description: '', mcp: true },
    ],
  }))
  on('mcp.call', ($, e) => {
    let body: unknown = answers[e.tool] ?? {}
    if (e.tool === 'list_watches') {
      const id = e.args.watch as string | undefined
      body = { monitorizari: id ? [state[id]] : Object.values(state) }
    }
    if (e.tool === 'update_watch' && e.args.dispatch === 'stream') {
      return { value: { content: [{ type: 'text', text: 'nu se permite în timpul unei rulări' }], isError: true } }
    }
    if (e.tool === 'update_watch') {
      updates.push(e.args)
      const one = state[e.args.watch as string]
      if (typeof e.args.mode === 'string') one.mod = e.args.mode
      if (typeof e.args.active === 'boolean') one.activa = e.args.active
      if (Array.isArray(e.args.trigger_words)) one.cuvinteDeclansare = e.args.trigger_words
      body = { success: true }
    }
    return { value: { content: [{ type: 'text', text: JSON.stringify(body) }], isError: false } }
  })
  on('prompt.submit', ($, e) => {
    prompts.push(e.text)
    return { text: e.text }
  })

  await $.command.run({ command: 'symbai', args: '', origin: { kind: 'composer' } } as any)

  for (const surface of ['terminal', 'desktop'] as const) {
    updates.length = 0
    prompts.length = 0
    state.a.mod = 'always'
    const pane = await $.ui.mount({ plugin: 'symbai-ui', surface, component: 'Pane', requestId: 'symbai-asistenti', props: PANE_PROPS })

    await pane.press({ key: 'open-a' })
    expect(await pane.find({ type: 'Text', text: /Preiei comenzile/ })).toBeDefined()

    await pane.press({ key: 'mode-mention' })
    expect(updates).toEqual([{ watch: 'a', mode: 'mention' }])
    expect(await pane.find({ type: 'Text', text: /Doar când e chemat/ })).toBeDefined()
    expect((await pane.find({ key: 'mode-mention' }))?.props.variant).toBe('primary')

    await pane.press({ key: 'runner-stream' })
    expect(await pane.find({ type: 'Text', text: /Nu s-a schimbat: nu se permite/ })).toBeDefined()
    expect((await pane.find({ key: 'runner-codex' }))?.props.variant).toBe('primary')

    await pane.input({ key: 'words', text: 'Sym,  Asistent , ' })
    expect(updates[1]).toEqual({ watch: 'a', trigger_words: ['Sym', 'Asistent'] })

    await pane.input({ key: 'ask', text: 'să răspundă doar între 8 și 17' })
    expect(prompts.length).toBe(1)
    expect(prompts[0]).toContain('monitorizarea a')
    expect(prompts[0]).toContain('doar între 8 și 17')

    await pane.press({ key: 'back' })
    await pane.press({ key: 'inactive' })
    await pane.press({ key: 'open-c' })
    await pane.press({ key: 'mode-silent' })
    expect(updates[2]).toEqual({ watch: 'c', mode: 'silent' })
    state.c.mod = 'always'

    await pane.press({ key: 'pause' })
    expect(updates.length).toBe(3)
    expect(await pane.find({ type: 'Text', text: /Pornești „Vechi”/ })).toBeDefined()
    await pane.press({ key: 'start-confirm-c' })
    expect(updates[3]).toEqual({ watch: 'c', active: true })
    state.c.activa = false

    await pane.press({ key: 'back' })
    await pane.press({ key: 'refresh' })
    await pane.press({ key: 'inactive' })
    await pane.unmount()
  }
})

test('rolul pe scurt și promptul editat în caseta de scris', async ($, on) => {
  host(on)
  const updates: Record<string, unknown>[] = []
  const store = new Map<string, unknown>()
  let box = ''
  let modelCalls = 0
  const state: Record<string, Record<string, unknown>> = {
    a: { id: 'a', activa: true, mod: 'mention', dispatch: 'codex', conversatie: { nume: 'Grup Comenzi', tip: 'grup' }, obiectiv: 'Ești Sym. Preiei comenzile.', doarDeLa: ['x@lid'] },
  }
  on('tool.list', () => ({ value: [{ name: `mcp__${WA}__list_watches`, description: '', mcp: true }] }))
  on('mcp.call', ($, e) => {
    let body: unknown = {}
    if (e.tool === 'list_watches') body = { monitorizari: Object.values(state) }
    if (e.tool === 'update_watch') {
      updates.push(e.args)
      if (typeof e.args.objective === 'string') state.a.obiectiv = e.args.objective
      body = { monitorizare: state.a }
    }
    return { value: { content: [{ type: 'text', text: JSON.stringify(body) }], isError: false } }
  })
  on('model.complete', () => {
    modelCalls += 1
    return {
      value: {
        isAnswered: true,
        text: 'Ce face: preia comenzile clienților.\nUnde și pentru cine: grupul de comenzi.\nCe nu are voie: să emită facturi.\nCine îi dă instrucțiuni: Mihai.',
        usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
      },
    }
  })
  on('store.get', ($, e) => ({ value: store.get(e.key) }))
  on('store.set', ($, e) => {
    store.set(e.key, e.value)
    return { value: undefined }
  })
  on('prompt.fill', ($, e) => {
    box = e.text
    return { isFilled: true }
  })
  on('prompt.read', () => ({ value: { text: box, cursor: 0 } }))

  await $.command.run({ command: 'symbai', args: '', origin: { kind: 'composer' } } as any)
  const pane = await $.ui.mount({ plugin: 'symbai-ui', surface: 'desktop', component: 'Pane', requestId: 'symbai-asistenti', props: PANE_PROPS })

  await pane.press({ key: 'open-a' })
  expect(await pane.find({ type: 'Text', text: /preia comenzile clienților/ })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /Răspunde numai când e chemat/ })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: /o persoană anume/ })).toBeDefined()
  expect(modelCalls).toBe(1)

  // Same prompt again: the summary comes from the store, no new model call.
  await pane.press({ key: 'back' })
  await pane.press({ key: 'open-a' })
  expect(modelCalls).toBe(1)

  await pane.press({ key: 'edit-start' })
  expect(box.startsWith('✎ PROMPT „Grup Comenzi”')).toBe(true)
  expect(box).toContain('Ești Sym. Preiei comenzile.')
  expect(await pane.find({ type: 'Text', text: /Editezi promptul/ })).toBeDefined()

  const edited = box.replace('Preiei comenzile.', 'Preiei comenzile.\nNu răspunzi după ora 17.')
  const sent = await $.prompt.submit({ text: edited } as any)
  expect('drop' in sent && sent.drop).toContain('e salvat')
  expect(updates).toEqual([{ watch: 'a', objective: 'Ești Sym. Preiei comenzile.\nNu răspunzi după ora 17.' }])
  expect(await pane.find({ type: 'Text', text: /Editezi promptul/ })).toBeUndefined()
  expect(modelCalls).toBe(2)

  await pane.press({ key: 'edit-undo' })
  expect(updates[1]).toEqual({ watch: 'a', objective: 'Ești Sym. Preiei comenzile.' })
  expect(await pane.find({ key: 'edit-undo' })).toBeUndefined()

  // An empty prompt is refused and nothing is written.
  await pane.press({ key: 'edit-start' })
  const empty = await $.prompt.submit({ text: box.split('\n')[0] } as any)
  expect('drop' in empty && empty.drop).toContain('nu poate fi gol')
  expect(updates.length).toBe(2)
  await pane.press({ key: 'edit-cancel' })
  expect(box).toBe('')
  await pane.unmount()
})

test('o notificare în timpul editării nu pierde promptul; ciorna omului nu e suprascrisă', async ($, on) => {
  host(on)
  const updates: Record<string, unknown>[] = []
  let box = 'ciorna mea'
  const state = { id: 'a', activa: true, mod: 'always', dispatch: 'stream', conversatie: { nume: 'Ana', tip: 'contact' }, obiectiv: 'Ești Sym.' }
  on('tool.list', () => ({ value: [{ name: `mcp__${WA}__list_watches`, description: '', mcp: true }] }))
  on('mcp.call', ($, e) => {
    if (e.tool === 'update_watch') {
      updates.push(e.args)
      if (typeof e.args.objective === 'string') state.obiectiv = e.args.objective
    }
    const body = e.tool === 'list_watches' ? { monitorizari: [state] } : { monitorizare: state }
    return { value: { content: [{ type: 'text', text: JSON.stringify(body) }], isError: false } }
  })
  on('model.complete', () => ({ value: { isAnswered: false, reason: 'empty-reply', usage: { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } } }))
  on('store.get', () => ({ value: undefined }))
  on('store.set', () => ({ value: undefined }))
  on('prompt.fill', ($, e) => {
    box = e.text
    return { isFilled: true }
  })
  on('prompt.read', () => ({ value: { text: box, cursor: 0 } }))
  on('prompt.submit', ($, e) => ({ text: e.text }))

  await $.command.run({ command: 'symbai', args: '', origin: { kind: 'composer' } } as any)
  const pane = await $.ui.mount({ plugin: 'symbai-ui', surface: 'desktop', component: 'Pane', requestId: 'symbai-asistenti', props: PANE_PROPS })
  await pane.press({ key: 'open-a' })

  await pane.press({ key: 'edit-start' })
  expect(box).toBe('ciorna mea')
  expect(await pane.find({ type: 'Text', text: /text început/ })).toBeDefined()

  box = ''
  await pane.press({ key: 'edit-start' })
  expect(box.startsWith('✎ PROMPT')).toBe(true)

  const passed = await $.prompt.submit({ text: 'Task finished', origin: { kind: 'task-notification' } } as any)
  expect('text' in passed && passed.text).toBe('Task finished')
  expect(await pane.find({ type: 'Text', text: /Editezi promptul/ })).toBeDefined()

  const sent = await $.prompt.submit({ text: box.replace('Ești Sym.', 'Ești Sym. Scrii scurt.') } as any)
  expect('drop' in sent && sent.drop).toContain('e salvat')
  expect(updates).toEqual([{ watch: 'a', objective: 'Ești Sym. Scrii scurt.' }])

  // Changed again elsewhere after our save: undo must not overwrite that change.
  state.obiectiv = 'Ești Sym. Altă variantă.'
  await pane.press({ key: 'back' })
  await pane.press({ key: 'open-a' })
  await pane.press({ key: 'edit-undo' })
  expect(updates.length).toBe(1)
  expect(await pane.find({ type: 'Text', text: /s-a schimbat între timp/ })).toBeDefined()
  await pane.unmount()
})

test('din listă: oprești, repari și ștergi un asistent; erorile vechi nu se arată', async ($, on) => {
  host(on)
  const calls: { tool: string; args: Record<string, unknown> }[] = []
  const state: Record<string, Record<string, any>> = {}
  const reset = () => {
    for (const key of Object.keys(state)) delete state[key]
    Object.assign(state, {
      lost: {
        id: 'lost', activa: true, mod: 'always', dispatch: 'codex', conversatie: { nume: 'Alex', tip: 'contact' }, obiectiv: 'Ești Sym.',
        ultimaRulare: { la: '2026-10-20 02:06:15', stare: 'failed', rezumat: 'ChatGPT Codex: Error: thread/resume failed: no rollout found for thread id x' },
      },
      old: {
        id: 'old', activa: true, mod: 'always', dispatch: 'stream', conversatie: { nume: 'Simina', tip: 'contact' }, obiectiv: 'Ești Sym.',
        ultimaRulare: { la: '2026-10-08 11:24:23', stare: 'failed', rezumat: 'ChatGPT Codex: exit status 0xffffffff' },
      },
      tired: {
        id: 'tired', activa: false, mod: 'always', dispatch: 'codex', conversatie: { nume: 'Dejan', tip: 'contact' }, obiectiv: 'Ești Sym.',
        motivOprire: '3 rulări eșuate la rând; ultima: ChatGPT Codex: Error: thread/resume failed: no rollout found',
      },
      video: { id: 'video', activa: true, mod: 'always', dispatch: 'claude', conversatie: { nume: 'Video', tip: 'grup' }, obiectiv: 'Video.' },
      claudeTired: {
        id: 'claudeTired', activa: false, mod: 'always', dispatch: 'claude', conversatie: { nume: 'Restaurant', tip: 'grup' }, obiectiv: 'R.',
        motivOprire: '3 rulări eșuate la rând; ultima: Claude Code: not logged in',
      },
      paused: { id: 'paused', activa: false, mod: 'always', dispatch: 'codex', conversatie: { nume: 'Ovidiu', tip: 'contact' }, obiectiv: 'O.', ultimulMesaj: '2026-10-21 10:00:00' },
    })
  }
  on('tool.list', () => ({
    value: [
      { name: `mcp__${WA}__list_watches`, description: '', mcp: true },
      { name: `mcp__${WA}__connection_status`, description: '', mcp: true },
    ],
  }))
  on('mcp.call', ($, e) => {
    let body: unknown = answers[e.tool] ?? {}
    if (e.tool === 'list_watches') {
      const id = e.args.watch as string | undefined
      body = {
        monitorizari: id ? [state[id]].filter(Boolean) : Object.values(state),
        pregatire: { cliFound: true, loggedIn: false, problems: ['Claude Code nu este autentificat pe acest calculator'] },
        pregatireCodex: { cliFound: true, loggedIn: true, connections: [{ name: 'symbai-hello', state: 'blocked' }] },
      }
    }
    if (e.tool === 'update_watch' || e.tool === 'stop_watch') {
      calls.push({ tool: e.tool, args: e.args })
      const one = state[e.args.watch as string]
      if (e.tool === 'stop_watch' && e.args.delete === true) delete state[e.args.watch as string]
      else if (one && typeof e.args.active === 'boolean') {
        one.activa = e.args.active
        if (e.args.active) delete one.motivOprire
      }
      if (one && e.args.clear_session === true) delete one.ultimaRulare
      body = { success: true }
    }
    return { value: { content: [{ type: 'text', text: JSON.stringify(body) }], isError: false } }
  })

  for (const surface of ['terminal', 'desktop'] as const) {
    reset()
    calls.length = 0
    await $.command.run({ command: 'symbai', args: '', origin: { kind: 'composer' } } as any)
    const pane = await $.ui.mount({ plugin: 'symbai-ui', surface, component: 'Pane', requestId: 'symbai-asistenti', props: PANE_PROPS })

    // Calculator problems are said once, in words.
    expect(await pane.find({ type: 'Text', text: /Claude Code nu este autentificat/ })).toBeDefined()
    expect(await pane.find({ type: 'Text', text: /Codex nu poate intra în firma „symbai-hello”/ })).toBeDefined()
    // Lost conversation, stopped after failures and Claude not logged in need the person; the old stream failure does not.
    expect(await pane.find({ type: 'Text', text: /Și-a pierdut conversația salvată/ })).toBeDefined()
    expect(await pane.find({ type: 'Text', text: /S-a oprit singur/ })).toBeDefined()
    expect(await pane.find({ type: 'Text', text: /Claude Code nu e pregătit pe calculator/ })).toBeDefined()
    expect(await pane.find({ key: 'fix-old' })).toBeUndefined()
    expect(await pane.find({ type: 'Text', text: /4 de reparat/ })).toBeDefined()
    // Stopped by failures but its program is not ready on this computer: no start offered.
    expect(await pane.find({ key: 'fix-claudeTired' })).toBeUndefined()

    await pane.press({ key: 'fix-lost' })
    expect(calls[0]).toEqual({ tool: 'update_watch', args: { watch: 'lost', clear_session: true } })
    await pane.press({ key: 'fix-tired' })
    expect(calls[1]).toEqual({ tool: 'update_watch', args: { watch: 'tired', clear_session: true, active: true } })
    expect(await pane.find({ type: 'Text', text: /2 de reparat/ })).toBeDefined()

    // Starting from the list asks first: it answers what piled up.
    await pane.press({ key: 'inactive' })
    await pane.press({ key: 'toggle-paused' })
    expect(calls.length).toBe(2)
    expect(await pane.find({ type: 'Text', text: /Pornești „Ovidiu”/ })).toBeDefined()
    await pane.press({ key: 'start-cancel-paused' })
    expect(calls.length).toBe(2)
    await pane.press({ key: 'inactive' })

    // Stop straight from the list.
    await pane.press({ key: 'toggle-old' })
    expect(calls[2]).toEqual({ tool: 'update_watch', args: { watch: 'old', active: false } })
    expect(await pane.find({ type: 'Text', text: /„Simina” e oprit/ })).toBeDefined()

    // Delete asks first, then removes for good.
    await pane.press({ key: 'open-lost' })
    await pane.press({ key: 'delete-ask' })
    expect(await pane.find({ type: 'Text', text: /Ștergi definitiv „Alex”/ })).toBeDefined()
    expect(calls.length).toBe(3)
    await pane.press({ key: 'delete-confirm' })
    expect(calls[3]).toEqual({ tool: 'stop_watch', args: { watch: 'lost', delete: true } })
    expect(await pane.find({ type: 'Text', text: /„Alex” a fost șters/ })).toBeDefined()
    expect(await pane.find({ key: 'open-lost' })).toBeUndefined()
    await pane.unmount()
  }
})
