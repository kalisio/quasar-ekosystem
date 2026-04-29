import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KStamp from '../../src/components/KStamp.vue'

describe('KStamp', () => {
  it('shows icon when icon prop is provided', () => {
    const wrapper = mount(KStamp, { props: { text: 'Hello', icon: 'las la-star' } })
    expect(wrapper.vm.canShowIcon).toBe(true)
  })

  it('hides icon when icon prop is absent', () => {
    const wrapper = mount(KStamp, { props: { text: 'Hello' } })
    expect(wrapper.vm.canShowIcon).toBe(false)
  })

  it('renders the text', () => {
    const wrapper = mount(KStamp, { props: { text: 'My label' } })
    expect(wrapper.find('.ellipsis').text()).toBe('My label')
  })

  it('applies vertical layout by default', () => {
    const wrapper = mount(KStamp, { props: { text: 'Test' } })
    expect(wrapper.find('.column').exists()).toBe(true)
    expect(wrapper.find('.row').exists()).toBe(false)
  })

  it('applies horizontal layout when direction is horizontal', () => {
    const wrapper = mount(KStamp, { props: { text: 'Test', direction: 'horizontal' } })
    expect(wrapper.find('.row').exists()).toBe(true)
    expect(wrapper.find('.column').exists()).toBe(false)
  })

  it('passes iconSize to q-icon', () => {
    const wrapper = mount(KStamp, { props: { text: 'Test', icon: 'home', iconSize: '3rem' } })
    expect(wrapper.find('q-icon').attributes('size')).toBe('3rem')
  })

  it('applies textSize as inline style', () => {
    const wrapper = mount(KStamp, { props: { text: 'Test', textSize: '1.5rem' } })
    expect(wrapper.find('.ellipsis').attributes('style')).toContain('1.5rem')
  })

  // Responsive tests
  it('shows icon when icon prop is added', async () => {
    const wrapper = mount(KStamp, { props: { text: 'Hello' } })
    expect(wrapper.vm.canShowIcon).toBe(false)
    await wrapper.setProps({ icon: 'las la-star' })
    expect(wrapper.vm.canShowIcon).toBe(true)
  })

  it('switches layout when direction prop changes', async () => {
    const wrapper = mount(KStamp, { props: { text: 'Test', direction: 'vertical' } })
    expect(wrapper.find('.column').exists()).toBe(true)
    await wrapper.setProps({ direction: 'horizontal' })
    expect(wrapper.find('.row').exists()).toBe(true)
    expect(wrapper.find('.column').exists()).toBe(false)
  })

  it('updates text when text prop changes', async () => {
    const wrapper = mount(KStamp, { props: { text: 'Before' } })
    expect(wrapper.find('.ellipsis').text()).toBe('Before')
    await wrapper.setProps({ text: 'After' })
    expect(wrapper.find('.ellipsis').text()).toBe('After')
  })
})
