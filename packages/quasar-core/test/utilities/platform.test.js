const logger = vi.hoisted(() => ({ debug: vi.fn(), warn: vi.fn() }))
vi.mock('@kalisio/common-core/runtime', () => ({ getLogger: () => logger }))

// Quasar platform with a lazy getter, like has.webStorage, and plugin internals
const quasar = vi.hoisted(() => {
  const state = { webStorageReads: 0 }
  const Platform = {
    userAgent: 'test-agent',
    is: { desktop: true, name: 'chrome' },
    has: { touch: false, get webStorage () { state.webStorageReads++; return true } },
    within: { iframe: false },
    install () {},
    __installed: true
  }
  return { state, Platform }
})
vi.mock('quasar', () => ({ Platform: quasar.Platform }))

// Fake WebGL context with configurable extensions
function createGL ({ debugInfo = true, loseContext = vi.fn() } = {}) {
  const extensions = {
    WEBGL_debug_renderer_info: debugInfo ? { UNMASKED_VENDOR_WEBGL: 10, UNMASKED_RENDERER_WEBGL: 11 } : null,
    WEBGL_lose_context: loseContext ? { loseContext } : null
  }
  const parameters = { 1: 'WebGL 2.0', 2: 'Masked vendor', 3: 'Masked renderer', 10: 'Vendor', 11: 'Renderer' }
  return {
    VERSION: 1,
    VENDOR: 2,
    RENDERER: 3,
    getParameter: (parameter) => parameters[parameter],
    getExtension: (name) => extensions[name]
  }
}

let Platform

// Platform is a module singleton: reload the module for each test
beforeEach(async () => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
  vi.resetModules()
  quasar.state.webStorageReads = 0
  vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  ;({ Platform } = await import('../../src/utilities/platform.js'))
})

describe('Platform', () => {
  describe('initialization', () => {
    it.each([['SSR'], ['pwa'], [undefined]])('throws on the invalid build mode %j', (buildMode) => {
      expect(() => Platform.initialize(buildMode)).toThrow(/buildMode/)
    })

    it('does not detect WebGL for an invalid build mode', () => {
      const getContext = vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext')
      expect(() => Platform.initialize('SSR')).toThrow()
      expect(getContext).not.toHaveBeenCalled()
    })

    it.each([['PWA', true], ['SPA', false]])('sets is.pwa for the %s build mode', (buildMode, pwa) => {
      Platform.initialize(buildMode)
      expect(Platform.is.pwa).toBe(pwa)
    })

    it('copies is without altering the Quasar platform', () => {
      Platform.initialize('PWA')
      expect(Platform.is).not.toBe(quasar.Platform.is)
      expect(Platform.is).toMatchObject({ desktop: true, name: 'chrome' })
      expect(quasar.Platform.is.pwa).toBeUndefined()
    })

    it('references has and within, keeping Quasar lazy getters', () => {
      Platform.initialize('PWA')
      expect(Platform.has).toBe(quasar.Platform.has)
      expect(Platform.within).toBe(quasar.Platform.within)
      expect(quasar.state.webStorageReads).toBe(0)
      expect(Platform.has.webStorage).toBe(true)
      expect(quasar.state.webStorageReads).toBe(1)
    })

    it('exposes the user agent but not the Quasar plugin internals', () => {
      Platform.initialize('PWA')
      expect(Platform.userAgent).toBe('test-agent')
      expect(Platform.install).toBeUndefined()
      expect(Platform.__installed).toBeUndefined()
    })

    it('logs its initialization', () => {
      Platform.initialize('PWA')
      expect(logger.debug).toHaveBeenCalledOnce()
    })

    it('allows reinitialization with another build mode', () => {
      Platform.initialize('PWA')
      expect(Platform.is.pwa).toBe(true)
      Platform.initialize('SPA')
      expect(Platform.is.pwa).toBe(false)
    })
  })

  describe('WebGL', () => {
    it('does not detect WebGL before initialization', () => {
      const getContext = vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext')
      expect(Platform.webgl).toBeUndefined()
      expect(getContext).not.toHaveBeenCalled()
    })

    it('reports WebGL as unsupported without a context', () => {
      Platform.initialize('PWA')
      expect(Platform.webgl).toEqual({ supported: false })
    })

    it('prefers WebGL 2 when available', () => {
      const getContext = vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext')
        .mockReturnValue(createGL())
      Platform.initialize('PWA')
      expect(Platform.webgl.supported).toBe(true)
      expect(getContext.mock.calls.map(([type]) => type)).toEqual(['webgl2'])
    })

    it('falls back to WebGL 1', () => {
      const getContext = vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext')
        .mockImplementation((type) => type === 'webgl' ? createGL() : null)
      Platform.initialize('PWA')
      expect(Platform.webgl.supported).toBe(true)
      expect(getContext.mock.calls.map(([type]) => type)).toEqual(['webgl2', 'webgl'])
    })

    it('reports the unmasked vendor and renderer when available', () => {
      vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createGL())
      Platform.initialize('PWA')
      expect(Platform.webgl).toEqual({
        supported: true,
        version: 'WebGL 2.0',
        vendor: 'Vendor',
        renderer: 'Renderer'
      })
    })

    it('falls back to the masked vendor and renderer without the debug extension', () => {
      vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext')
        .mockReturnValue(createGL({ debugInfo: false }))
      Platform.initialize('PWA')
      expect(Platform.webgl).toMatchObject({
        vendor: 'Masked vendor',
        renderer: 'Masked renderer'
      })
    })

    it('releases the context when possible', () => {
      const loseContext = vi.fn()
      vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext')
        .mockReturnValue(createGL({ loseContext }))
      Platform.initialize('PWA')
      expect(loseContext).toHaveBeenCalledOnce()
    })

    it('works without the lose context extension', () => {
      vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext')
        .mockReturnValue(createGL({ loseContext: null }))
      Platform.initialize('PWA')
      expect(Platform.webgl.supported).toBe(true)
    })

    it('computes WebGL information only once across initializations', () => {
      const getContext = vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext')
        .mockReturnValue(createGL())
      Platform.initialize('PWA')
      const info = Platform.webgl
      Platform.initialize('SPA')
      expect(Platform.webgl).toBe(info)
      expect(getContext).toHaveBeenCalledOnce()
    })

    it('caches an unsupported WebGL result', () => {
      const getContext = vi.spyOn(globalThis.HTMLCanvasElement.prototype, 'getContext')
      Platform.initialize('PWA')
      Platform.initialize('SPA')
      expect(Platform.webgl).toEqual({ supported: false })
      expect(getContext).toHaveBeenCalledTimes(2)
    })
  })
})
