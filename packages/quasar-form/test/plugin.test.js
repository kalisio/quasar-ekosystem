import { describe, it, expect, afterEach } from 'vitest'
import { createApp } from 'vue'
import QuasarCore, { load, register } from '@kalisio/quasar-core'

afterEach(() => {
  // le plugin stocke l'instance i18n dans un singleton — on repart propre entre chaque test
  QuasarCore.install(createApp({}))
})

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

  it('expose load et register comme exports nommés', () => {
    expect(typeof load).toBe('function')
    expect(typeof register).toBe('function')
  })

  it('register enregistre les composants de quasar-form dans le ComponentRegistry', () => {
    const modules = import.meta.glob('../src/components/**/*.vue')
    expect(() => register(modules)).not.toThrow()
  })

  it('load retrouve un composant enregistré par register', () => {
    const modules = import.meta.glob('../src/components/**/*.vue')
    register(modules)
    const loader = load('KForm')
    expect(loader).toBeDefined()
  })
})
