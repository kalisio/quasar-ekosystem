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

  it('load accepts a path-style name and extracts the component name', () => {
    expect(load('../components/KAvatar.vue')).toBeDefined()
  })

  it('load returns the same reference for a non-lazy component', () => {
    const KStatic = { name: 'KStatic' }
    register({ KStatic })
    expect(load('KStatic')).toBe(KStatic)
  })

  it('register overwrites an existing component', () => {
    const v1 = { name: 'KVersioned', version: 1 }
    const v2 = { name: 'KVersioned', version: 2 }
    register({ KVersioned: v1 })
    register({ KVersioned: v2 })
    expect(load('KVersioned')).toBe(v2)
  })

  it('error message includes the component name', () => {
    expect(() => load('KMissing')).toThrow('"KMissing"')
  })
})
