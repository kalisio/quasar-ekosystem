import { describe, it, expect } from 'vitest'
import { getIconName } from '../../src/utils/icons.js'

describe('getIconName', () => {
  it('returns empty string when icon.name resolves to an object', () => {
    expect(getIconName({ icon: { name: { nested: true } } })).toBe('')
  })

  it('prefixes fa- icons with fas', () => {
    expect(getIconName('fa-star')).toBe('fas fa-star')
  })
})
