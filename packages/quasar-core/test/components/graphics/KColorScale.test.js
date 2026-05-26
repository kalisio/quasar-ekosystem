import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import KColorScale from '../../../src/components/graphics/KColorScale.vue'

beforeAll(() => {
  /* global HTMLCanvasElement */
  HTMLCanvasElement.prototype.getContext = () => ({
    clearRect: () => {},
    fillText: () => {},
    fillRect: () => {},
    measureText: () => ({ width: 0 })
  })
})

function mountScale (props = {}) {
  return mount(KColorScale, { props, attachTo: document.body })
}

describe('KColorScale', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('renders a canvas element', () => {
    const wrapper = mountScale()
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('computes labelText from label alone', () => {
    const wrapper = mountScale({ label: 'Temperature' })
    expect(wrapper.vm.labelText).toBe('Temperature')
  })

  it('returns undefined labelText when no label', () => {
    const wrapper = mountScale()
    expect(wrapper.vm.labelText).toBeUndefined()
  })

  it('reads label size from layout', () => {
    const wrapper = mountScale({ layout: { label: { size: 16 } } })
    expect(wrapper.vm.labelSize).toBe(16)
  })

  it('defaults label size to 12', () => {
    const wrapper = mountScale()
    expect(wrapper.vm.labelSize).toBe(12)
  })

  it('defaults ticks format', () => {
    const wrapper = mountScale()
    expect(wrapper.vm.ticksFormat).toEqual({ notation: 'auto', precision: 3 })
  })

  it('detects reversed domain', () => {
    const wrapper = mountScale({ domain: [10, 0] })
    expect(wrapper.vm.reversed).toBe(true)
  })

  it('detects non-reversed domain', () => {
    const wrapper = mountScale({ domain: [0, 10] })
    expect(wrapper.vm.reversed).toBe(false)
  })

  it('bar height defaults to 16 in horizontal direction', () => {
    const wrapper = mountScale({ direction: 'horizontal' })
    expect(wrapper.vm.barHeight).toBe(16)
  })

  it('bar width defaults to 16 in vertical direction', () => {
    const wrapper = mountScale({ direction: 'vertical' })
    expect(wrapper.vm.barWidth).toBe(16)
  })
})
