const logger = vi.hoisted(() => ({ debug: vi.fn(), warn: vi.fn() }))
vi.mock('@kalisio/common-core/runtime', () => ({ getLogger: () => logger }))

const BACKENDS = [['LocalStorage', 'localStorage'], ['SessionStorage', 'sessionStorage']]
const OPERATIONS = {
  set: ['key', 1],
  get: ['key'],
  has: ['key'],
  update: ['key', () => 1],
  remove: ['key']
}
const VALUES = [
  ['string', 'value'],
  ['number', 42],
  ['boolean', false],
  ['null', null],
  ['array', [1, 'two', { three: 3 }]],
  ['plain object', { a: 1, b: { c: [true, null] } }]
]

let storages

// Storages are module singletons: reload the module and reset browser storage for each test
beforeEach(async () => {
  vi.clearAllMocks()
  vi.resetModules()
  globalThis.localStorage.clear()
  globalThis.sessionStorage.clear()
  storages = await import('../../src/utilities/index.js')
})

describe.each(BACKENDS)('%s', (backend, name) => {
  let storage
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name)

  beforeEach(() => {
    storage = storages[backend]
  })

  afterEach(() => {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor)
    else delete globalThis[name]
  })

  describe('before initialization', () => {
    it.each(Object.keys(OPERATIONS))('%s throws', (operation) => {
      expect(() => storage[operation](...OPERATIONS[operation])).toThrow(/initialized/)
    })
  })

  describe('initialization', () => {
    it.each([[''], [42], [undefined], [null]])('throws on the invalid prefix %j', (prefix) => {
      expect(() => storage.initialize(prefix)).toThrow(/prefix/)
    })

    it('logs its initialization', () => {
      storage.initialize('app')
      expect(logger.debug).toHaveBeenCalledOnce()
      expect(logger.warn).not.toHaveBeenCalled()
    })

    it('warns and throws on every operation when the browser blocks the storage', () => {
      Object.defineProperty(globalThis, name, {
        configurable: true,
        get () { throw new DOMException('Blocked', 'SecurityError') }
      })
      storage.initialize('app')
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('blocked'), expect.anything())
      expect(logger.debug).not.toHaveBeenCalled()
      for (const [operation, args] of Object.entries(OPERATIONS)) {
        expect(() => storage[operation](...args)).toThrow(/not available/)
      }
    })

    it('warns and throws on every operation when the storage does not exist', () => {
      Object.defineProperty(globalThis, name, { configurable: true, value: undefined })
      storage.initialize('app')
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('not available'), expect.anything())
      expect(logger.debug).not.toHaveBeenCalled()
      for (const [operation, args] of Object.entries(OPERATIONS)) {
        expect(() => storage[operation](...args)).toThrow(/not available/)
      }
    })
  })

  describe('once initialized', () => {
    beforeEach(() => {
      storage.initialize('app')
    })

    it.each(VALUES)('round-trips a %s', (_, value) => {
      storage.set('key', value)
      expect(storage.get('key')).toEqual(value)
    })

    it('returns the default value for a missing key', () => {
      expect(storage.get('missing', 'default')).toBe('default')
      expect(storage.get('missing')).toBeUndefined()
    })

    it('keeps an explicit null instead of the default value', () => {
      storage.set('key', null)
      expect(storage.get('key', 'default')).toBeNull()
    })

    it('tells whether a key exists, including for a null value', () => {
      expect(storage.has('key')).toBe(false)
      storage.set('key', null)
      expect(storage.has('key')).toBe(true)
    })

    it('removes a key', () => {
      storage.set('key', 'value')
      storage.remove('key')
      expect(storage.has('key')).toBe(false)
      expect(storage.get('key', 'default')).toBe('default')
    })

    it('updates a missing value', () => {
      const updater = vi.fn((value) => (value ?? 0) + 1)
      storage.update('counter', updater)
      expect(updater).toHaveBeenCalledWith(undefined)
      expect(storage.get('counter')).toBe(1)
    })

    it('updates an existing value', () => {
      storage.set('list', ['a'])
      storage.update('list', (list) => [...list, 'b'])
      expect(storage.get('list')).toEqual(['a', 'b'])
    })

    it('throws on an undefined value', () => {
      expect(() => storage.set('key', undefined)).toThrow(/undefined/)
      expect(storage.has('key')).toBe(false)
    })

    it('throws on an update returning undefined and keeps the previous value', () => {
      storage.set('key', 1)
      expect(() => storage.update('key', () => undefined)).toThrow(/undefined/)
      expect(storage.get('key')).toBe(1)
    })

    it.each([[1], [''], [null], [['key']]])('throws on the invalid key %j', (key) => {
      for (const [operation, [, ...args]] of Object.entries(OPERATIONS)) {
        expect(() => storage[operation](key, ...args)).toThrow(/key/)
      }
    })

    it('prefixes keys and stores JSON in the underlying storage', () => {
      storage.set('settings', { a: 1 })
      expect(globalThis[name].getItem('app-settings')).toBe('{"a":1}')
    })

    it('does not alias keys that already look prefixed', () => {
      storage.set('settings', 1)
      storage.set('app-settings', 2)
      expect(storage.get('settings')).toBe(1)
      expect(storage.get('app-settings')).toBe(2)
    })

    it('returns the default value and warns on a corrupted value', () => {
      globalThis[name].setItem('app-broken', '{not json')
      expect(storage.get('broken', 'default')).toBe('default')
      expect(logger.warn).toHaveBeenCalledOnce()
    })
  })
})

describe('Web storages isolation', () => {
  it('keeps localStorage and sessionStorage apart', () => {
    const { LocalStorage, SessionStorage } = storages
    LocalStorage.initialize('app')
    SessionStorage.initialize('app')
    LocalStorage.set('key', 'local')
    expect(SessionStorage.has('key')).toBe(false)
  })
})
