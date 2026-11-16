import { describe, it, expect, vi, beforeEach } from 'vitest'
import { plugin } from '../src/plugin.js'
import { I18n } from '../src/i18n.js'
import { Platform } from '../src/utilities/platform.js'

// --- mocks ---

vi.mock('../src/i18n.js', () => ({
  I18n: {
    setInstance: vi.fn(),
    tie: vi.fn()
  }
}))

// --- helpers ---

function makeApp () {
  return {
    component: vi.fn(),
    directive: vi.fn(),
    provide: vi.fn(),
    config: {
      globalProperties: {}
    }
  }
}

// --- tests ---

describe('plugin', () => {
  let app

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    app = makeApp()
  })

  it('should register components', async () => {
    await plugin.install(app, { buildMode: 'SPA' })
    expect(app.component).toHaveBeenCalled()
  })

  it('should register directives', async () => {
    await plugin.install(app, { buildMode: 'SPA' })
    expect(app.directive).toHaveBeenCalled()
  })

  it.each([
    ['PWA', true],
    ['SPA', false]
  ])('should initialize Platform in %s mode', async (buildMode, pwa) => {
    await plugin.install(app, { buildMode })
    expect(Platform.is.pwa).toBe(pwa)
  })

  it('should provide platform', async () => {
    await plugin.install(app, { buildMode: 'SPA' })
    expect(app.provide).toHaveBeenCalledWith('platform', Platform)
  })

  it('should expose $platform as a global property', async () => {
    await plugin.install(app, { buildMode: 'SPA' })
    expect(app.config.globalProperties.$platform).toBe(Platform)
  })

  it('should set the i18n instance when provided', async () => {
    const i18nInstance = { global: {} }
    await plugin.install(app, { buildMode: 'SPA', i18n: i18nInstance })
    expect(I18n.setInstance).toHaveBeenCalledWith(i18nInstance)
  })

  it('should not set the i18n instance when not provided', async () => {
    await plugin.install(app, { buildMode: 'SPA' })
    expect(I18n.setInstance).not.toHaveBeenCalled()
  })

  it('should provide i18n', async () => {
    await plugin.install(app, { buildMode: 'SPA' })
    expect(app.provide).toHaveBeenCalledWith('i18n', I18n)
  })

  it('should expose $tie as a global property', async () => {
    await plugin.install(app, { buildMode: 'SPA' })
    expect(app.config.globalProperties.$tie).toBeTypeOf('function')
  })

  it('should call I18n.tie when $tie is invoked', async () => {
    I18n.tie.mockReturnValue('hello')
    await plugin.install(app, { buildMode: 'SPA' })
    const result = app.config.globalProperties.$tie('app.welcome', { name: 'Alice' })
    expect(I18n.tie).toHaveBeenCalledWith('app.welcome', { name: 'Alice' })
    expect(result).toBe('hello')
  })
})
