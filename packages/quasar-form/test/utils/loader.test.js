import { describe, it, expect } from 'vitest'
import { loadComponent } from '../../src/utils/loader.js'

describe('loadComponent', () => {
  it('returns a component when found by name', () => {
    expect(loadComponent('KForm')).toBeDefined()
  })

  it('returns a component when given a path-style name', () => {
    expect(loadComponent('components/KForm')).toBeDefined()
  })

  it('throws when component is not found', () => {
    expect(() => loadComponent('KNonExistent')).toThrow('KNonExistent not found')
  })
})
