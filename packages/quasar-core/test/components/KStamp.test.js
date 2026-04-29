import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KStamp from '../../src/components/KStamp.vue'

describe('KStamp', () => {
  // canShowIcon is true when an icon prop is provided
  it('shows icon when icon prop is provided', () => {
    const wrapper = mount(KStamp, { props: { text: 'Hello', icon: 'las la-star' } })
    expect(wrapper.vm.canShowIcon).toBe(true)
  })

  // canShowIcon is false when no icon prop is given
  it('hides icon when icon prop is absent', () => {
    const wrapper = mount(KStamp, { props: { text: 'Hello' } })
    expect(wrapper.vm.canShowIcon).toBe(false)
  })

  // The text prop is rendered inside the .ellipsis element
  it('renders the text', () => {
    const wrapper = mount(KStamp, { props: { text: 'My label' } })
    expect(wrapper.find('.ellipsis').text()).toBe('My label')
  })

  // The default layout direction is vertical, using the .column class
  it('applies vertical layout by default', () => {
    const wrapper = mount(KStamp, { props: { text: 'Test' } })
    expect(wrapper.find('.column').exists()).toBe(true)
    expect(wrapper.find('.row').exists()).toBe(false)
  })

  // Setting direction=horizontal switches the layout class to .row
  it('applies horizontal layout when direction is horizontal', () => {
    const wrapper = mount(KStamp, { props: { text: 'Test', direction: 'horizontal' } })
    expect(wrapper.find('.row').exists()).toBe(true)
    expect(wrapper.find('.column').exists()).toBe(false)
  })

  // Reactive tests
  // Adding an icon prop after mount sets canShowIcon to true
  it('shows icon when icon prop is added', async () => {
    const wrapper = mount(KStamp, { props: { text: 'Hello' } })
    expect(wrapper.vm.canShowIcon).toBe(false)
    await wrapper.setProps({ icon: 'las la-star' })
    expect(wrapper.vm.canShowIcon).toBe(true)
  })

  // Switching direction from vertical to horizontal updates the layout class
  it('switches layout when direction prop changes', async () => {
    const wrapper = mount(KStamp, { props: { text: 'Test', direction: 'vertical' } })
    expect(wrapper.find('.column').exists()).toBe(true)
    await wrapper.setProps({ direction: 'horizontal' })
    expect(wrapper.find('.row').exists()).toBe(true)
    expect(wrapper.find('.column').exists()).toBe(false)
  })

  // Updating the text prop replaces the displayed content
  it('updates text when text prop changes', async () => {
    const wrapper = mount(KStamp, { props: { text: 'Before' } })
    expect(wrapper.find('.ellipsis').text()).toBe('Before')
    await wrapper.setProps({ text: 'After' })
    expect(wrapper.find('.ellipsis').text()).toBe('After')
  })
})
