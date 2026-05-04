import { describe, it, expect } from 'vitest'
import { makeDiacriticPattern } from '../../src/utils/diacritics.js'

describe('makeDiacriticPattern', () => {
  it('expands base characters to diacritic families', () => {
    expect(makeDiacriticPattern('cafe')).toContain('[')
  })

  it('reverse mode matches any diacritic character', () => {
    expect(makeDiacriticPattern('é', { reverse: true })).toContain('[')
  })
})
