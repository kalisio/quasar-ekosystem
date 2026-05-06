import { describe, it, expect } from 'vitest'
import { getLocale, getFallbackLocale } from '../../src/utils/utils.locale.js'

describe('getLocale', () => {
  it('returns only the language code by default', () => {
    const locale = getLocale()
    expect(locale).not.toContain('-')
    expect(locale.length).toBeGreaterThan(0)
  })
  it('returns the full locale string when languageOnly is false', () => {
    const locale = getLocale(false)
    expect(typeof locale).toBe('string')
    expect(locale.length).toBeGreaterThan(0)
  })
})

describe('getFallbackLocale', () => {
  it('returns only the language code by default', () => {
    const locale = getFallbackLocale()
    expect(locale).toBe('en')
    expect(locale).not.toContain('-')
  })
  it('returns the full fallback locale when languageOnly is false', () => {
    const locale = getFallbackLocale(false)
    expect(locale).toBe('en-GB')
  })
})
