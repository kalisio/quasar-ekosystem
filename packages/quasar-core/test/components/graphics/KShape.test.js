import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KShape from '../../../src/components/graphics/KShape.vue'

describe('KShape', () => {
  it('renders an SVG element for a known shape', () => {
    const wrapper = mount(KShape, {
      props: { options: { shape: 'circle', radius: 12, stroke: { width: 1 } } }
    })
    expect(wrapper.html()).toContain('<svg')
  })

  it('shows a tooltip when the tooltip prop is set', () => {
    const wrapper = mount(KShape, {
      props: { options: { shape: 'circle', radius: 12, stroke: { width: 1 } }, tooltip: 'My tooltip' }
    })
    expect(wrapper.findComponent({ name: 'QTooltip' }).exists()).toBe(true)
  })

  it('shows no tooltip when tooltip prop is not set', () => {
    const wrapper = mount(KShape, {
      props: { options: { shape: 'circle', radius: 12, stroke: { width: 1 } } }
    })
    expect(wrapper.findComponent({ name: 'QTooltip' }).exists()).toBe(false)
  })

  it('recomputes SVG when options change', async () => {
    const wrapper = mount(KShape, {
      props: { options: { shape: 'circle', radius: 12, stroke: { width: 1 } } }
    })
    const before = wrapper.html()
    await wrapper.setProps({ options: { shape: 'rect', size: [24, 24], stroke: { width: 1 } } })
    expect(wrapper.html()).not.toBe(before)
  })
})
