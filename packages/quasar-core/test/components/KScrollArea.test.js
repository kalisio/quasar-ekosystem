import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KScrollArea from '../../src/components/KScrollArea.vue'

describe('KScrollArea', () => {
  it('initializes height at zero before any scroll', () => {
    const wrapper = mount(KScrollArea, { props: { maxHeight: 300 } })
    expect(wrapper.vm.cssHeight).toBe('0px')
  })

  it('uses 8px thumb width by default (visible, not dense)', () => {
    const wrapper = mount(KScrollArea, { props: { maxHeight: 300 } })
    expect(wrapper.vm.cssThumbStyle.width).toBe('8px')
  })

  it('uses 4px thumb width when dense', () => {
    const wrapper = mount(KScrollArea, { props: { maxHeight: 300, dense: true } })
    expect(wrapper.vm.cssThumbStyle.width).toBe('4px')
  })

  it('uses 0px thumb width when not visible', () => {
    const wrapper = mount(KScrollArea, { props: { maxHeight: 300, visible: false } })
    expect(wrapper.vm.cssThumbStyle.width).toBe('0px')
  })

  it('renders slot content', () => {
    const wrapper = mount(KScrollArea, { props: { maxHeight: 300 }, slots: { default: '<p class="inner">Hello</p>' } })
    expect(wrapper.find('.inner').exists()).toBe(true)
    expect(wrapper.find('.inner').text()).toBe('Hello')
  })

  // Responsive tests
  it('updates thumb width when dense prop changes', async () => {
    const wrapper = mount(KScrollArea, { props: { maxHeight: 300, dense: false } })
    expect(wrapper.vm.cssThumbStyle.width).toBe('8px')
    await wrapper.setProps({ dense: true })
    expect(wrapper.vm.cssThumbStyle.width).toBe('4px')
  })

  it('updates thumb width when visible prop changes', async () => {
    const wrapper = mount(KScrollArea, { props: { maxHeight: 300, visible: true } })
    expect(wrapper.vm.cssThumbStyle.width).toBe('8px')
    await wrapper.setProps({ visible: false })
    expect(wrapper.vm.cssThumbStyle.width).toBe('0px')
  })
})
