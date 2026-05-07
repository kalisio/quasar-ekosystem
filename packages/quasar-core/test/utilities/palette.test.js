import { describe, it, expect } from 'vitest'
import { palette, QUASAR_PALETTE, HTML_PALETTE } from '../../src/utilities'

describe('palette.resolve', () => {
  describe('empty color', () => {
    it('returns defaultColor when color is null', () => {
      expect(palette.resolve(null, '#ffffff')).toBe('#ffffff')
    })

    it('returns defaultColor when color is an empty string', () => {
      expect(palette.resolve('', '#ffffff')).toBe('#ffffff')
    })

    it('returns undefined when defaultColor is not provided', () => {
      expect(palette.resolve(null)).toBeUndefined()
    })
  })

  describe('pass-through formats', () => {
    it('returns a hex color as-is', () => {
      expect(palette.resolve('#ff0000')).toBe('#ff0000')
    })

    it('returns an hsl color as-is', () => {
      expect(palette.resolve('hsl(0, 100%, 50%)')).toBe('hsl(0, 100%, 50%)')
    })

    it('returns an rgb color as-is', () => {
      expect(palette.resolve('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)')
    })

    it('returns an rgba color as-is', () => {
      expect(palette.resolve('rgba(255, 0, 0, 0.5)')).toBe('rgba(255, 0, 0, 0.5)')
    })
  })

  describe('Quasar palette', () => {
    it('resolves "red"', () => {
      expect(palette.resolve('red')).toBe('#f44336')
    })

    it('resolves "blue-3"', () => {
      expect(palette.resolve('blue-3')).toBe('#90caf9')
    })

    it('resolves "deep-purple-10"', () => {
      expect(palette.resolve('deep-purple-10')).toBe('#311b92')
    })

    it('takes priority over the HTML palette for shared names', () => {
      // "red" is #f44336 in Quasar, #FF0000 in HTML
      expect(palette.resolve('red')).toBe(QUASAR_PALETTE.red)
      expect(palette.resolve('red')).not.toBe(HTML_PALETTE.red)
    })
  })

  describe('HTML palette', () => {
    it('resolves "navy"', () => {
      expect(palette.resolve('navy')).toBe('#000080')
    })

    it('resolves "coral"', () => {
      expect(palette.resolve('coral')).toBe('#FF7F50')
    })
  })

  describe('unknown color', () => {
    it('returns defaultColor when color is not found anywhere', () => {
      expect(palette.resolve('not-a-color', '#ffffff')).toBe('#ffffff')
    })
  })
})

describe('palette.findClosest', () => {
  it('throws when color is invalid', () => {
    expect(() => palette.findClosest('not-a-color')).toThrow()
  })

  it('returns a key starting with "red" for #f44336', () => {
    expect(palette.findClosest('#f44336')).toMatch(/^red/)
  })

  it('returns a key starting with "blue" for #2196f3', () => {
    expect(palette.findClosest('#2196f3')).toMatch(/^blue/)
  })

  it('returns a nearby key for an approximate color', () => {
    // #ff5555 is very close to red
    const result = palette.findClosest('#ff5555')
    expect(result).toMatch(/^red/)
  })

  it('always returns a key that exists in QUASAR_PALETTE', () => {
    const result = palette.findClosest('#123456')
    expect(QUASAR_PALETTE).toHaveProperty(result)
  })
})
