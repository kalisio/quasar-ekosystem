import { assert, is } from '@kalisio/common-core/predicates'
import { getLogger } from '@kalisio/common-core/runtime'

const logger = getLogger(['quasar-core', 'web-storage'])

const validKey = (key) => {
  assert.that(key, is.nonEmptyString, 'Storage key must be a non-empty string')
  return key
}

const validValue = (value) => {
  assert.that(value, (v) => v !== undefined, 'Storage value cannot be undefined')
  return value
}

const createWebStorage = (name) => {
  let prefix
  let storage = null

  const getStorage = () => {
    assert.that(prefix, is.defined, `${name} must be initialized before use`)
    if (!storage) throw new Error(`${name} is not available`)
    return storage
  }
  const localKey = (key) => `${prefix}-${validKey(key)}`
  const read = (key, defaultValue) => {
    const value = getStorage().getItem(localKey(key))
    if (value === null) return defaultValue
    try {
      return JSON.parse(value)
    } catch (error) {
      logger.warn('Cannot parse storage value with key {key}: {error}', { key, error })
      return defaultValue
    }
  }
  const write = (key, value) => getStorage().setItem(localKey(key), JSON.stringify(validValue(value)))

  return {
    initialize (value) {
      assert.that(value, is.nonEmptyString, `${name} prefix must be a non-empty string`)
      prefix = value
      storage = null
      // Accessing web storage throws when site data is blocked by the browser,
      // so it is resolved here instead of at module load
      try {
        storage = globalThis[name] ?? null
      } catch (error) {
        logger.warn('{name} is blocked by the browser, all operations will throw: {error}', { name, error })
        return
      }
      if (!storage) {
        logger.warn('{name} is not available in this context, all operations will throw', { name })
        return
      }
      logger.debug('{name} initialized with prefix {prefix}', { name, prefix })
    },
    set (key, value) {
      write(key, value)
    },
    has (key) {
      return getStorage().getItem(localKey(key)) !== null
    },
    get (key, defaultValue) {
      return read(key, defaultValue)
    },
    // Read and write run synchronously: atomic within a tab, not across tabs
    update (key, updater) {
      write(key, updater(read(key)))
    },
    remove (key) {
      getStorage().removeItem(localKey(key))
    }
  }
}

export const LocalStorage = createWebStorage('localStorage')
export const SessionStorage = createWebStorage('sessionStorage')
