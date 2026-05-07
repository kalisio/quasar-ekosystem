import { describe, it, expect } from 'vitest'
import { ComponentRegistry } from '../src/index.js'

describe('registry', () => {
  it('loads a core component', () => {
    expect(ComponentRegistry.load('KContent')).toBeDefined()
  })

  it('throws for an unknown component', () => {
    expect(() => ComponentRegistry.load('KUnknown')).toThrow('not found in registry')
  })

  it('registers and loads an external component', () => {
    ComponentRegistry.register({ './components/KExternal.vue': () => Promise.resolve({ default: {} }) })
    expect(ComponentRegistry.load('KExternal')).toBeDefined()
  })

  it('load accepts a path-style name and extracts the component name', () => {
    expect(ComponentRegistry.load('../components/KContent.vue')).toBeDefined()
  })

  it('load returns the same reference for a non-lazy component', () => {
    const KStatic = { name: 'KStatic' }
    ComponentRegistry.register({ KStatic })
    expect(ComponentRegistry.load('KStatic')).toBe(KStatic)
  })

  it('register overwrites an existing component', () => {
    const v1 = { name: 'KVersioned', version: 1 }
    const v2 = { name: 'KVersioned', version: 2 }
    ComponentRegistry.register({ KVersioned: v1 })
    ComponentRegistry.register({ KVersioned: v2 })
    expect(ComponentRegistry.load('KVersioned')).toBe(v2)
  })

  it('error message includes the component name', () => {
    expect(() => ComponentRegistry.load('KMissing')).toThrow('"KMissing"')
  })
})
