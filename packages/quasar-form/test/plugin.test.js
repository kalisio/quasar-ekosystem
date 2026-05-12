import { describe, it, expect } from 'vitest'
import { createApp } from 'vue'
import QuasarCore from '@kalisio/quasar-core'

describe('QuasarCore plugin (vu depuis quasar-form)', () => {
  it('est un plugin Vue valide', () => {
    expect(typeof QuasarCore.install).toBe('function')
  })

  it('enregistre les composants de quasar-core globalement', () => {
    const app = createApp({})
    app.use(QuasarCore)
    const expected = ['KAction', 'KChip', 'KContent', 'KDialog', 'KModal', 'KPanel', 'KTab', 'KTextArea']
    for (const name of expected) {
      expect(app.component(name), `${name} doit être enregistré`).toBeDefined()
    }
  })

  it('expose $tie comme propriété globale', () => {
    const app = createApp({})
    app.use(QuasarCore)
    expect(typeof app.config.globalProperties.$tie).toBe('function')
  })

  it('$tie retourne la clé si aucune traduction', () => {
    const app = createApp({})
    app.use(QuasarCore)
    expect(app.config.globalProperties.$tie('my.key')).toBe('my.key')
  })
})
