import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Platform } from '../../src/utilities/platform.js'

vi.mock('@thumbmarkjs/thumbmarkjs', () => ({
  getFingerprint: vi.fn().mockResolvedValue('fp-abc123'),
  getFingerprintData: vi.fn().mockResolvedValue({
    system: { browser: { name: 'Chrome' }, platform: 'Win32' },
    locales: ['en-US'],
    hardware: { videocard: 'Intel HD' },
    permissions: { camera: 'denied' }
  })
}))

vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    Platform: {
      is: { desktop: true, mobile: false, touch: false },
      within: { iframe: false },
      userAgent: 'test-agent'
    }
  }
})

beforeEach(() => {
  Platform.is = {}
  Platform.within = {}
  delete Platform.fingerprint
  delete Platform.fingerprintData
  delete Platform.userAgent
})

describe('Platform.initialize', () => {
  it('sets is.pwa to false when buildMode is spa', async () => {
    await Platform.initialize('spa')
    expect(Platform.is.pwa).toBe(false)
  })

  it('sets is.pwa to true when buildMode is pwa', async () => {
    await Platform.initialize('pwa')
    expect(Platform.is.pwa).toBe(true)
  })

  it('sets is.pwa to false when no buildMode is provided', async () => {
    await Platform.initialize()
    expect(Platform.is.pwa).toBe(false)
  })

  it('stores the fingerprint after initialization', async () => {
    await Platform.initialize('spa')
    expect(Platform.fingerprint).toBe('fp-abc123')
  })

  it('stores fingerprintData after initialization', async () => {
    await Platform.initialize('spa')
    expect(Platform.fingerprintData).toBeDefined()
    expect(Platform.fingerprintData.system.browser.name).toBe('Chrome')
  })

  it('merges quasar platform data', async () => {
    await Platform.initialize('spa')
    expect(Platform.is.desktop).toBe(true)
    expect(Platform.is.mobile).toBe(false)
  })
})

describe('Platform.getData', () => {
  beforeEach(async () => {
    await Platform.initialize('spa')
  })

  it('returns the full data object when no scope is given', () => {
    const data = Platform.getData()
    expect(data).toHaveProperty('application')
    expect(data).toHaveProperty('browser')
    expect(data).toHaveProperty('system')
  })

  it('application.mode is spa after spa initialization', () => {
    expect(Platform.getData('application.mode')).toBe('SPA')
  })

  it('application.mode is pwa after pwa initialization', async () => {
    await Platform.initialize('pwa')
    expect(Platform.getData('application.mode')).toBe('PWA')
  })

  it('system.desktop reflects quasar platform data', () => {
    expect(Platform.getData('system.desktop')).toBe(true)
  })

  it('system.mobile reflects quasar platform data', () => {
    expect(Platform.getData('system.mobile')).toBe(false)
  })

  it('returns nested value when scope is provided', () => {
    const browser = Platform.getData('browser')
    expect(browser).toHaveProperty('locale')
  })
})
