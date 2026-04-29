import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KLogo from '../../src/components/KLogo.vue'

describe('KLogo', () => {
  // A q-img element is present in the DOM when a logo path is available
  it('renders a q-img when logo is set', () => {
    const wrapper = mount(KLogo)
    expect(wrapper.find('q-img').exists()).toBe(true)
  })

  // The width prop is forwarded as an attribute to the q-img element
  it('passes width prop to q-img', () => {
    const wrapper = mount(KLogo, { props: { width: '200px' } })
    expect(wrapper.find('q-img').attributes('width')).toBe('200px')
  })

  // The width attribute defaults to 300px when no width prop is given
  it('uses default width of 300px', () => {
    const wrapper = mount(KLogo)
    expect(wrapper.find('q-img').attributes('width')).toBe('300px')
  })

  // Reactive tests
  // Changing the width prop updates the attribute on the q-img element
  it('updates width when prop changes', async () => {
    const wrapper = mount(KLogo, { props: { width: '100px' } })
    expect(wrapper.find('q-img').attributes('width')).toBe('100px')
    await wrapper.setProps({ width: '400px' })
    expect(wrapper.find('q-img').attributes('width')).toBe('400px')
  })
})
