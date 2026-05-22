import { describe, it, expect, vi, beforeEach } from 'vitest'
import { vHover } from '../../src/directives/v-hover.js'
import { Platform } from '../../src/utilities/platform.js'

vi.mock('../../src/utilities/platform.js', () => ({
  Platform: { touch: false }
}))

vi.mock('@logtape/logtape', () => ({ getLogger: () => ({ debug: vi.fn() }) }))
vi.mock('@thumbmarkjs/thumbmarkjs', () => ({
  getFingerprint: vi.fn(),
  getFingerprintData: vi.fn()
}))

beforeEach(() => {
  Platform.touch = false
})

describe('vHover — non-touch device', () => {
  it('attaches mouseenter listener on mount', () => {
    const el = document.createElement('div')
    const enter = vi.fn()
    vHover.mounted(el, { value: { enter } })
    el.dispatchEvent(new Event('mouseenter'))
    expect(enter).toHaveBeenCalled()
  })

  it('attaches mouseover listener on mount', () => {
    const el = document.createElement('div')
    const over = vi.fn()
    vHover.mounted(el, { value: { over } })
    el.dispatchEvent(new Event('mouseover'))
    expect(over).toHaveBeenCalled()
  })

  it('attaches mouseleave listener on mount', () => {
    const el = document.createElement('div')
    const leave = vi.fn()
    vHover.mounted(el, { value: { leave } })
    el.dispatchEvent(new Event('mouseleave'))
    expect(leave).toHaveBeenCalled()
  })

  it('defaults missing handlers to no-ops without throwing', () => {
    const el = document.createElement('div')
    vHover.mounted(el, { value: {} })
    expect(() => el.dispatchEvent(new Event('mouseenter'))).not.toThrow()
  })

  it('stores handler refs on the element', () => {
    const el = document.createElement('div')
    const enter = vi.fn()
    vHover.mounted(el, { value: { enter } })
    expect(el.__vHoverEnter__).toBe(enter)
  })

  it('removes all listeners and cleans up refs on beforeUnmount', () => {
    const el = document.createElement('div')
    const enter = vi.fn()
    vHover.mounted(el, { value: { enter } })
    vHover.beforeUnmount(el, {})
    el.dispatchEvent(new Event('mouseenter'))
    expect(enter).not.toHaveBeenCalled()
    expect(el.__vHoverEnter__).toBeUndefined()
    expect(el.__vHoverOver__).toBeUndefined()
    expect(el.__vHoverLeave__).toBeUndefined()
  })
})

describe('vHover — touch device', () => {
  it('does not attach any listeners when Platform.touch is true', () => {
    Platform.touch = true
    const el = document.createElement('div')
    const enter = vi.fn()
    vHover.mounted(el, { value: { enter } })
    el.dispatchEvent(new Event('mouseenter'))
    expect(enter).not.toHaveBeenCalled()
  })

  it('does not store handler refs when Platform.touch is true', () => {
    Platform.touch = true
    const el = document.createElement('div')
    vHover.mounted(el, { value: { enter: vi.fn() } })
    expect(el.__vHoverEnter__).toBeUndefined()
  })
})
