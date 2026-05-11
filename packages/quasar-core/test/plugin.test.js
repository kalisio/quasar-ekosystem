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
      expect(app.component(name), `${name} doit être enregistré`).toBeDefined()
    }
  })

  it('expose $tie comme propriété globale', () => {
    const app = createApp({})
    app.use(plugin)
    expect(typeof app.config.globalProperties.$tie).toBe('function')
  })

  it('$tie retourne la clé si aucune traduction', () => {
    const app = createApp({})
    app.use(plugin)
    expect(app.config.globalProperties.$tie('my.key')).toBe('my.key')
  })

  it('$tie utilise l\'instance i18n passée en option', () => {
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
