import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Platform } from '../src/platform.js'

// --- mocks ---

vi.mock('@logtape/logtape', () => ({
  getLogger: () => ({ debug: vi.fn() })
}))

vi.mock('@thumbmarkjs/thumbmarkjs', () => ({
  getFingerprint: vi.fn().mockResolvedValue('fp-abc123'),
  getFingerprintData: vi.fn().mockResolvedValue({
    permissions: { notifications: 'granted' },
    system: {
      browser: { name: 'Chrome', version: '124' },
      platform: 'Win32'
    },
    locales: 'en-US',
    hardware: { videocard: 'NVIDIA GeForce RTX 3080' }
  })
}))

vi.mock('quasar', () => ({
  Platform: {
    userAgent: 'Mozilla/5.0',
    is: { desktop: true, mobile: false, touch: false },
    within: { iframe: false },
    install: vi.fn(),
    __installed: true
  }
}))

// --- tests ---

describe('Platform', () => {
  describe('initialize', () => {
    it('should initialize in SPA build mode', async () => {
      await Platform.initialize('SPA')
      expect(Platform.buildMode).toBe('SPA')
      expect(Platform.is.pwa).toBe(false)
    })

    it('should initialize in PWA build mode', async () => {
      await Platform.initialize('PWA')
      expect(Platform.buildMode).toBe('PWA')
      expect(Platform.is.pwa).toBe(true)
    })

    it('should populate fingerprint after initialization', async () => {
      await Platform.initialize('SPA')
      expect(Platform.fingerprint).toBe('fp-abc123')
      expect(Platform.fingerprintData).toBeDefined()
    })

    it('should throw if build mode is invalid', async () => {
      await expect(Platform.initialize('ELECTRON')).rejects.toThrow('buildMode must be one of: PWA, SPA')
    })
  })

  describe('getData', () => {
    beforeEach(async () => {
      await Platform.initialize('PWA')
    })

    it('should return the full data object when scope is empty', () => {
      const data = Platform.getData('')
      expect(data).toMatchObject({
        userAgent: expect.any(String),
        application: expect.any(Object),
        browser: expect.any(Object),
        system: expect.any(Object)
      })
    })

    it('should return the full data object when scope is undefined', () => {
      const data = Platform.getData()
      expect(data).toMatchObject({
        userAgent: expect.any(String),
        application: expect.any(Object),
        browser: expect.any(Object),
        system: expect.any(Object)
      })
    })

    it('should return the correct application data', () => {
      const data = Platform.getData()
      expect(data.application).toEqual({
        mode: 'PWA',
        iframe: false,
        permissions: { notifications: 'granted' }
      })
    })

    it('should return the correct browser data', () => {
      const data = Platform.getData()
      expect(data.browser).toEqual({
        name: 'Chrome',
        version: '124',
        locale: 'en-US',
        webgl: 'NVIDIA GeForce RTX 3080'
      })
    })

    it('should return the correct system data', () => {
      const data = Platform.getData()
      expect(data.system).toEqual({
        os: 'Win32',
        desktop: true,
        mobile: false,
        touch: false
      })
    })

    it('should return a scoped value with dot-notation', () => {
      expect(Platform.getData('browser.locale')).toBe('en-US')
      expect(Platform.getData('system.os')).toBe('Win32')
      expect(Platform.getData('application.mode')).toBe('PWA')
    })

    it('should return undefined for an unknown scope', () => {
      expect(Platform.getData('unknown.key')).toBeUndefined()
    })
  })
})
