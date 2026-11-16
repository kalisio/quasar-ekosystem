import { createStore, get, set, update, del } from 'idb-keyval'
import { assert, is } from '@kalisio/common-core/predicates'
import { getLogger } from '@kalisio/common-core/runtime'

const logger = getLogger(['quasar-core', 'idb-storage'])

const validKey = (key) => {
  assert.that(key, is.nonEmptyString, 'Storage key must be a non-empty string')
  return key
}

const validValue = (value) => {
  assert.that(value, (v) => v !== undefined, 'Storage value cannot be undefined')
  return value
}

const createIndexedDBStorage = () => {
  let store

  const getStore = () => {
    assert.that(store, is.defined, 'IndexedDBStorage must be initialized before use')
    return store
  }

  return {
    // The prefix names a dedicated database, so keys need no prefix
    initialize (prefix) {
      assert.that(prefix, is.nonEmptyString, 'IndexedDB prefix must be a non-empty string')
      store = createStore(prefix, 'storage')
      logger.debug('IndexedDB initialized with database {prefix}', { prefix })
    },
    async set (key, value) {
      return set(validKey(key), validValue(value), getStore())
    },
    async has (key) {
      return (await get(validKey(key), getStore())) !== undefined
    },
    async get (key, defaultValue) {
      const value = await get(validKey(key), getStore())
      return value === undefined ? defaultValue : value
    },
    // Read and write run in a single transaction, atomic across tabs
    async update (key, updater) {
      return update(validKey(key), (value) => validValue(updater(value)), getStore())
    },
    async remove (key) {
      return del(validKey(key), getStore())
    }
  }
}

export const IndexedDBStorage = createIndexedDBStorage()
