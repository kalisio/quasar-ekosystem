import 'fake-indexeddb/auto'
import { IDBFactory } from 'fake-indexeddb'

const logger = vi.hoisted(() => ({ debug: vi.fn(), warn: vi.fn() }))
vi.mock('@kalisio/common-core/runtime', () => ({ getLogger: () => logger }))

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

let storage

// The storage is a module singleton: reload the module and use a fresh IndexedDB for each test
beforeEach(async () => {
  vi.clearAllMocks()
  vi.resetModules()
  globalThis.indexedDB = new IDBFactory()
  ;({ IndexedDBStorage: storage } = await import('../../src/utilities/indexeddb-storage.js'))
})

describe('IndexedDBStorage', () => {
  describe('before initialization', () => {
    it.each(Object.keys(OPERATIONS))('%s rejects', async (operation) => {
      await expect(storage[operation](...OPERATIONS[operation])).rejects.toThrow(/initialized/)
    })
  })

  describe('initialization', () => {
    it.each([[''], [42], [undefined], [null]])('throws on the invalid prefix %j', (prefix) => {
      expect(() => storage.initialize(prefix)).toThrow(/prefix/)
    })

    it('logs its initialization', () => {
      storage.initialize('app')
      expect(logger.debug).toHaveBeenCalledOnce()
    })
  })

  describe('once initialized', () => {
    beforeEach(() => {
      storage.initialize('app')
    })

    it.each(VALUES)('round-trips a %s', async (_, value) => {
      await storage.set('key', value)
      expect(await storage.get('key')).toEqual(value)
    })

    it('returns the default value for a missing key', async () => {
      expect(await storage.get('missing', 'default')).toBe('default')
      expect(await storage.get('missing')).toBeUndefined()
    })

    it('keeps an explicit null instead of the default value', async () => {
      await storage.set('key', null)
      expect(await storage.get('key', 'default')).toBeNull()
    })

    it('tells whether a key exists, including for a null value', async () => {
      expect(await storage.has('key')).toBe(false)
      await storage.set('key', null)
      expect(await storage.has('key')).toBe(true)
    })

    it('removes a key', async () => {
      await storage.set('key', 'value')
      await storage.remove('key')
      expect(await storage.has('key')).toBe(false)
      expect(await storage.get('key', 'default')).toBe('default')
    })

    it('updates a missing value', async () => {
      const updater = vi.fn((value) => (value ?? 0) + 1)
      await storage.update('counter', updater)
      expect(updater).toHaveBeenCalledWith(undefined)
      expect(await storage.get('counter')).toBe(1)
    })

    it('updates an existing value', async () => {
      await storage.set('list', ['a'])
      await storage.update('list', (list) => [...list, 'b'])
      expect(await storage.get('list')).toEqual(['a', 'b'])
    })

    it('does not lose concurrent updates', async () => {
      const increment = () => storage.update('counter', (value) => (value ?? 0) + 1)
      await Promise.all(Array.from({ length: 10 }, increment))
      expect(await storage.get('counter')).toBe(10)
    })

    it('rejects an undefined value', async () => {
      await expect(storage.set('key', undefined)).rejects.toThrow(/undefined/)
      expect(await storage.has('key')).toBe(false)
    })

    it('rejects an update returning undefined and keeps the previous value', async () => {
      await storage.set('key', 1)
      await expect(storage.update('key', () => undefined)).rejects.toThrow(/undefined/)
      expect(await storage.get('key')).toBe(1)
    })

    it.each([[1], [''], [null], [['key']]])('rejects the invalid key %j', async (key) => {
      for (const [operation, [, ...args]] of Object.entries(OPERATIONS)) {
        await expect(storage[operation](key, ...args)).rejects.toThrow(/key/)
      }
    })

    it('isolates databases by prefix', async () => {
      await storage.set('key', 'app')
      storage.initialize('other')
      expect(await storage.has('key')).toBe(false)
      storage.initialize('app')
      expect(await storage.get('key')).toBe('app')
    })
  })
})
