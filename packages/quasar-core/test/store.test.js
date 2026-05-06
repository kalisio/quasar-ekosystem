import { describe, it, expect, afterEach } from 'vitest'
import { Store } from '../src/store.js'

afterEach(() => {
  Object.keys(Store).forEach(k => {
    if (typeof Store[k] !== 'function') delete Store[k]
  })
})

describe('Store.patch', () => {
  it('merges new properties into an existing object without changing its reference', () => {
    Store.set('user', { name: 'Alice', role: 'admin' })
    const ref = Store.get('user')
    Store.patch('user', { role: 'editor' })
    expect(Store.get('user').role).toBe('editor')
    expect(Store.get('user').name).toBe('Alice')
    expect(Store.get('user')).toBe(ref)
  })
  it('is a no-op when the path does not exist', () => {
    Store.patch('nonexistent', { value: 1 })
    expect(Store.has('nonexistent')).toBe(false)
  })
  it('patches a nested path', () => {
    Store.set('config', { theme: { color: 'blue', mode: 'light' } })
    Store.patch('config.theme', { mode: 'dark' })
    expect(Store.get('config.theme.mode')).toBe('dark')
    expect(Store.get('config.theme.color')).toBe('blue')
  })
})

describe('Store.unset', () => {
  it('removes a key from the store', () => {
    Store.set('temp', 42)
    Store.unset('temp')
    expect(Store.has('temp')).toBe(false)
  })
  it('removes a nested key without affecting siblings', () => {
    Store.set('data', { a: 1, b: 2 })
    Store.unset('data.a')
    expect(Store.has('data.a')).toBe(false)
    expect(Store.get('data.b')).toBe(2)
  })
})

describe('Store.getRef', () => {
  it('returns a reactive ref to a top-level key', () => {
    Store.set('count', 0)
    const ref = Store.getRef('count')
    expect(ref.value).toBe(0)
    Store.set('count', 5)
    expect(ref.value).toBe(5)
  })
  it('returns a reactive ref to a nested key', () => {
    Store.set('settings', { lang: 'fr' })
    const ref = Store.getRef('settings.lang')
    expect(ref.value).toBe('fr')
  })
})
