import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Screen, AppFullscreen } from 'quasar'

import { screen } from '../../src/utilities'

vi.mock('vue', () => ({
  toRef: vi.fn(() => ({ value: false }))
}))

// --- tests ---

describe('screen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Screen.width = 1024
    Screen.height = 768
    Screen.name = 'md'
  })

  describe('resolveWidth', () => {
    it('should return the value as-is when it is above 100', () => {
      expect(screen.resolveWidth(800)).toBe(800)
    })

    it('should resolve a percentage relative to Screen.width', () => {
      expect(screen.resolveWidth(50)).toBe(512)
    })

    it('should resolve a breakpoint object', () => {
      expect(screen.resolveWidth({ md: 800 })).toBe(800)
    })

    it('should resolve a breakpoint object with a percentage value', () => {
      expect(screen.resolveWidth({ md: 50 })).toBe(512)
    })

    it('should return undefined for invalid input', () => {
      expect(screen.resolveWidth('invalid')).toBeUndefined()
    })

    it('should return undefined when breakpoint is not found', () => {
      expect(screen.resolveWidth({ xl: 800 })).toBeUndefined()
    })

    it('should return undefined when breakpoint value is not a number', () => {
      expect(screen.resolveWidth({ md: 'wide' })).toBeUndefined()
    })
  })

  describe('resolveHeight', () => {
    it('should return the value as-is when it is above 100', () => {
      expect(screen.resolveHeight(400)).toBe(400)
    })

    it('should resolve a percentage relative to Screen.height', () => {
      expect(screen.resolveHeight(50)).toBe(384)
    })

    it('should resolve a breakpoint object', () => {
      expect(screen.resolveHeight({ md: 400 })).toBe(400)
    })
  })

  describe('resolveSize', () => {
    it('should return the array as-is when it has exactly 2 elements', () => {
      expect(screen.resolveSize([800, 400])).toEqual([800, 400])
    })

    it('should resolve a breakpoint object with [width, height] values', () => {
      expect(screen.resolveSize({ md: [800, 400] })).toEqual([800, 400])
    })

    it('should return undefined for invalid input', () => {
      expect(screen.resolveSize('invalid')).toBeUndefined()
    })
  })

  describe('orientation', () => {
    it('should return landscape when width > height', () => {
      Screen.width = 1024
      Screen.height = 768
      expect(screen.orientation()).toBe('landscape')
    })

    it('should return portrait when height > width', () => {
      Screen.width = 768
      Screen.height = 1024
      expect(screen.orientation()).toBe('portrait')
    })
  })

  describe('toggleFullscreen', () => {
    it('should return true when toggled successfully', async () => {
      vi.spyOn(AppFullscreen, 'toggle').mockResolvedValue()
      expect(await screen.toggleFullscreen()).toBe(true)
    })

    it('should return false when toggle fails', async () => {
      vi.spyOn(AppFullscreen, 'toggle').mockRejectedValue(new Error('not allowed'))
      expect(await screen.toggleFullscreen()).toBe(false)
    })
  })

  describe('lockOrientation', () => {
    it('should call window.screen.orientation.lock when available', async () => {
      const lock = vi.fn().mockResolvedValue()
      vi.stubGlobal('window', { screen: { orientation: { lock } } })
      await screen.lockOrientation('portrait')
      expect(lock).toHaveBeenCalledWith('portrait')
    })

    it('should do nothing when screen.orientation.lock is unavailable', async () => {
      vi.stubGlobal('window', { screen: { orientation: {} } })
      await expect(screen.lockOrientation('portrait')).resolves.not.toThrow()
    })
  })
})
