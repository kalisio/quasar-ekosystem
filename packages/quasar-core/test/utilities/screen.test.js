import { isReadonly, nextTick } from 'vue'

const logger = vi.hoisted(() => ({ debug: vi.fn(), warn: vi.fn() }))
vi.mock('@kalisio/common-core/runtime', () => ({ getLogger: () => logger }))

// Reactive Quasar Screen and AppFullscreen, reset before each test
vi.mock('quasar', async () => {
  const { reactive } = await import('vue')
  return {
    Screen: reactive({}),
    AppFullscreen: reactive({ isActive: false, toggle: vi.fn() })
  }
})

function resetQuasar () {
  Object.assign(quasar.Screen, {
    width: 1024,
    height: 768,
    lt: { sm: false, md: false, lg: true, xl: true },
    gt: { xs: true, sm: true, md: false, lg: false }
  })
  quasar.AppFullscreen.isActive = false
  quasar.AppFullscreen.toggle.mockReset()
}

let quasar
let Screen

// Screen is a module singleton: reload it for each test
beforeEach(async () => {
  vi.clearAllMocks()
  vi.resetModules()
  quasar = await import('quasar')
  resetQuasar()
  ;({ Screen } = await import('../../src/utilities/index.js'))
})

describe('Screen', () => {
  it('is read-only', () => {
    expect(isReadonly(Screen)).toBe(true)
  })

  it('does not expose the Quasar screen', () => {
    expect(Screen.quasar).toBeUndefined()
  })

  describe('breakpoints', () => {
    it('use sm by default, without initialization', () => {
      expect(Screen.dense).toBe(false)
      expect(Screen.wide).toBe(true)
      quasar.Screen.lt.sm = true
      quasar.Screen.gt.sm = false
      expect(Screen.dense).toBe(true)
      expect(Screen.wide).toBe(false)
    })

    it('follow the breakpoints given at initialization', () => {
      Screen.initialize({ dense: 'lg', wide: 'xs' })
      expect(Screen.dense).toBe(true)
      expect(Screen.wide).toBe(true)
      expect(logger.debug).toHaveBeenCalledOnce()
    })

    it('reset a breakpoint that is not given to its default', () => {
      Screen.initialize({ dense: 'lg', wide: 'xs' })
      Screen.initialize({ dense: 'lg' })
      quasar.Screen.gt.xs = false
      expect(Screen.wide).toBe(true)
    })

    it.each([
      [{ dense: 'xs' }, /dense/],
      [{ dense: 'huge' }, /dense/],
      [{ wide: 'xl' }, /wide/]
    ])('throw on the invalid breakpoints %j', (options, error) => {
      expect(() => Screen.initialize(options)).toThrow(error)
    })
  })

  describe('orientation', () => {
    it.each([
      [1024, 768, 'landscape'],
      [768, 1024, 'portrait'],
      [800, 800, 'portrait']
    ])('is computed from a %ix%i viewport as %s', (width, height, orientation) => {
      Object.assign(quasar.Screen, { width, height })
      expect(Screen.orientation).toBe(orientation)
    })
  })

  describe('fullscreen', () => {
    it('follows the Quasar fullscreen state', async () => {
      expect(Screen.fullscreen).toBe(false)
      quasar.AppFullscreen.isActive = true
      await nextTick()
      expect(Screen.fullscreen).toBe(true)
    })

    it('resolves true when toggled', async () => {
      quasar.AppFullscreen.toggle.mockResolvedValue()
      expect(await Screen.toggleFullscreen()).toBe(true)
    })

    it('resolves false and warns when it cannot be toggled', async () => {
      quasar.AppFullscreen.toggle.mockRejectedValue(new Error('denied'))
      expect(await Screen.toggleFullscreen()).toBe(false)
      expect(logger.warn).toHaveBeenCalledOnce()
    })
  })

  describe('lockOrientation', () => {
    afterEach(() => {
      delete window.screen.orientation
    })

    function mockOrientation (orientation) {
      Object.defineProperty(window.screen, 'orientation', { value: orientation, configurable: true })
    }

    it('resolves false without warning when the API is missing', async () => {
      mockOrientation(undefined)
      expect(await Screen.lockOrientation('portrait')).toBe(false)
      expect(logger.warn).not.toHaveBeenCalled()
    })

    it('resolves true when the orientation is locked', async () => {
      const lock = vi.fn().mockResolvedValue()
      mockOrientation({ lock })
      expect(await Screen.lockOrientation('portrait')).toBe(true)
      expect(lock).toHaveBeenCalledWith('portrait')
    })

    it('resolves false and warns when the browser refuses to lock', async () => {
      mockOrientation({ lock: vi.fn().mockRejectedValue(new DOMException('Not supported', 'NotSupportedError')) })
      expect(await Screen.lockOrientation('portrait')).toBe(false)
      expect(logger.warn).toHaveBeenCalledOnce()
    })
  })
})
