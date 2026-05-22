import { describe, it, expect } from 'vitest'
import { createApp } from 'vue'
import { plugin } from '../src/plugin.js'

describe('QuasarCore plugin', () => {
  it('installs without error', () => {
    const app = createApp({})
    expect(() => app.use(plugin)).not.toThrow()
  })

  it('registers all components globally', () => {
    const app = createApp({})
    app.use(plugin)
    const expected = [
      'KAction', 'KChip', 'KContent', 'KDialog',
      'KModal', 'KPanel', 'KTab', 'KTextArea'
    ]
    for (const name of expected) {
      expect(app.component(name), `${name} should be registered`).toBeDefined()
    }
  })

  it('exposes $tie as a global property', () => {
    const app = createApp({})
    app.use(plugin)
    expect(typeof app.config.globalProperties.$tie).toBe('function')
  })

  it('$tie returns the key when no translation is found', () => {
    const app = createApp({})
    app.use(plugin)
    expect(app.config.globalProperties.$tie('my.key')).toBe('my.key')
  })

  it('registers hover directive', () => {
    const app = createApp({})
    app.use(plugin)
    expect(app.directive('hover')).toBeDefined()
  })

  it('registers safe-html directive', () => {
    const app = createApp({})
    app.use(plugin)
    expect(app.directive('safe-html')).toBeDefined()
  })

  it('$tie uses the i18n instance passed as an option', () => {
    const mockI18n = {
      te: (key) => key === 'known.key',
      t: (key) => `[${key}]`
    }
    const app = createApp({})
    app.use(plugin, { i18n: mockI18n })
    expect(app.config.globalProperties.$tie('known.key')).toBe('[known.key]')
    expect(app.config.globalProperties.$tie('unknown.key')).toBe('unknown.key')
  })
})
