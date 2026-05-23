import { describe, it, expect } from 'vitest'
// import { createApp } from 'vue'
import QuasarCore from '@kalisio/quasar-core'

describe('QuasarCore plugin (from quasar-form)', () => {
  it('is a valid Vue plugin', () => {
    expect(typeof QuasarCore.install).toBe('function')
  })

/*  it('registers quasar-core components globally', () => {
    const app = createApp({})
    app.use(QuasarCore)
    const expected = ['KAction', 'KChip', 'KContent', 'KDialog', 'KModal', 'KPanel', 'KTab', 'KTextArea']
    for (const name of expected) {
      expect(app.component(name), `${name} should be registered`).toBeDefined()
    }
  })

  it('exposes $tie as a global property', () => {
    const app = createApp({})
    app.use(QuasarCore)
    expect(typeof app.config.globalProperties.$tie).toBe('function')
  })

  it('$tie returns the key when no translation is found', () => {
    const app = createApp({})
    app.use(QuasarCore)
    expect(app.config.globalProperties.$tie('my.key')).toBe('my.key')
  }) */
})
