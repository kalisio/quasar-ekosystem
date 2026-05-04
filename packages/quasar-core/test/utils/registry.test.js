import { describe, it, expect } from 'vitest'
import { load, register } from '../../src/utils/registry.js'
import '@kalisio/quasar-moment'
import '@kalisio/quasar-form'

describe('registry', () => {
  it('loads a core component', () => {
    expect(load('KAvatar')).toBeDefined()
  })

  it('throws for an unknown component', () => {
    expect(() => load('KUnknown')).toThrow('not found in registry')
  })

  it('registers and loads an external component', () => {
    register({ './components/KExternal.vue': () => Promise.resolve({ default: {} }) })
    expect(load('KExternal')).toBeDefined()
  })

  it('loads a component registered by quasar-moment', () => {
    expect(load('KDate')).toBeDefined()
  })

  it('loads a component registered by quasar-form', () => {
    expect(load('KChipsField')).toBeDefined()
  })
})
