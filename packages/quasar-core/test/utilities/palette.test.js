import { describe, it, expect } from 'vitest'
import { palette, QUASAR_PALETTE, HTML_PALETTE } from '../../src/utilities'

describe('palette.resolve', () => {
  describe('couleur vide', () => {
    it('retourne defaultColor si la couleur est null', () => {
      expect(palette.resolve(null, '#ffffff')).toBe('#ffffff')
    })

    it('retourne defaultColor si la couleur est une chaîne vide', () => {
      expect(palette.resolve('', '#ffffff')).toBe('#ffffff')
    })

    it('retourne undefined si defaultColor est absent', () => {
      expect(palette.resolve(null)).toBeUndefined()
    })
  })

  describe('formats directs (pass-through)', () => {
    it('retourne une couleur hex telle quelle', () => {
      expect(palette.resolve('#ff0000')).toBe('#ff0000')
    })

    it('retourne une couleur hsl telle quelle', () => {
      expect(palette.resolve('hsl(0, 100%, 50%)')).toBe('hsl(0, 100%, 50%)')
    })

    it('retourne une couleur rgb telle quelle', () => {
      expect(palette.resolve('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)')
    })

    it('retourne une couleur rgba telle quelle', () => {
      expect(palette.resolve('rgba(255, 0, 0, 0.5)')).toBe('rgba(255, 0, 0, 0.5)')
    })
  })

  describe('palette Quasar', () => {
    it('retourne la valeur hex de "red"', () => {
      expect(palette.resolve('red')).toBe('#f44336')
    })

    it('retourne la valeur hex de "blue-3"', () => {
      expect(palette.resolve('blue-3')).toBe('#90caf9')
    })

    it('retourne la valeur hex de "deep-purple-10"', () => {
      expect(palette.resolve('deep-purple-10')).toBe('#311b92')
    })

    it('la palette Quasar est prioritaire sur la palette HTML', () => {
      // "red" vaut #f44336 en Quasar, #FF0000 en HTML
      expect(palette.resolve('red')).toBe(QUASAR_PALETTE.red)
      expect(palette.resolve('red')).not.toBe(HTML_PALETTE.red)
    })
  })

  describe('palette HTML', () => {
    it('retourne la valeur hex de "navy"', () => {
      expect(palette.resolve('navy')).toBe('#000080')
    })

    it('retourne la valeur hex de "coral"', () => {
      expect(palette.resolve('coral')).toBe('#FF7F50')
    })
  })

  describe('couleur inconnue', () => {
    it('retourne defaultColor si la couleur est introuvable partout', () => {
      expect(palette.resolve('not-a-color', '#ffffff')).toBe('#ffffff')
    })
  })
})

describe('palette.findClosest', () => {
  it('lance une exception si la couleur est invalide', () => {
    expect(() => palette.findClosest('not-a-color')).toThrow()
  })

  it('retourne "red" pour #f44336 (couleur exacte)', () => {
    expect(palette.findClosest('#f44336')).toBe('red')
  })

  it('retourne "blue" pour #2196f3 (couleur exacte)', () => {
    expect(palette.findClosest('#2196f3')).toBe('blue')
  })

  it('retourne une clé proche pour une couleur approximative', () => {
    // #ff5555 est très proche du rouge
    const result = palette.findClosest('#ff5555')
    expect(result).toMatch(/^red/)
  })

  it('retourne toujours une clé présente dans QUASAR_PALETTE', () => {
    const result = palette.findClosest('#123456')
    expect(QUASAR_PALETTE).toHaveProperty(result)
  })
})
