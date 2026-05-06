import { describe, it, expect } from 'vitest'
import { useStore } from '../../src/composables/store.js'

describe('useStore', () => {
  it('reuses the same reactive store on subsequent calls with the same name', () => {
    const { store: a } = useStore('reuse-test')
    const { store: b } = useStore('reuse-test')
    expect(a).toBe(b)
  })
  it('get without a path returns the whole store object', () => {
    const { set, get } = useStore('whole-test')
    set('z', 7)
    const whole = get()
    expect(whole.z).toBe(7)
  })
  it('clear removes all keys from the store', () => {
    const { set, clear, get } = useStore('clear-test')
    set('a', 1)
    set('b', 2)
    clear()
    expect(get('a')).toBeUndefined()
    expect(get('b')).toBeUndefined()
  })
  it('unset removes a specific key', () => {
    const { set, unset, has } = useStore('unset-test')
    set('x', 99)
    unset('x')
    expect(has('x')).toBe(false)
  })
  it('forOwn iterates over all keys in the store', () => {
    const { set, forOwn } = useStore('forown-test')
    set('p', 1)
    set('q', 2)
    const keys = []
    forOwn((v, k) => keys.push(k))
    expect(keys).toContain('p')
    expect(keys).toContain('q')
  })
})
