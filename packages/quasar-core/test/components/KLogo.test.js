import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KLogo from '../../src/components/KLogo.vue'

describe('KLogo', () => {
  it('resolves a logo path from config', () => {
    const wrapper = mount(KLogo)
    expect(wrapper.vm.logo).toBeTruthy()
  })

  it('renders a q-img when logo is set', () => {
    const wrapper = mount(KLogo)
    expect(wrapper.find('q-img').exists()).toBe(true)
  })

  it('passes width prop to q-img', () => {
    const wrapper = mount(KLogo, { props: { width: '200px' } })
    expect(wrapper.find('q-img').attributes('width')).toBe('200px')
  })

  it('passes height prop to q-img', () => {
    const wrapper = mount(KLogo, { props: { height: '50px' } })
    expect(wrapper.find('q-img').attributes('height')).toBe('50px')
  })

  it('uses default width of 300px', () => {
    const wrapper = mount(KLogo)
    expect(wrapper.find('q-img').attributes('width')).toBe('300px')
  })

  // Responsive tests
  it('updates width when prop changes', async () => {
    const wrapper = mount(KLogo, { props: { width: '100px' } })
    expect(wrapper.find('q-img').attributes('width')).toBe('100px')
    await wrapper.setProps({ width: '400px' })
    expect(wrapper.find('q-img').attributes('width')).toBe('400px')
  })

  it('updates height when prop changes', async () => {
    const wrapper = mount(KLogo, { props: { height: '50px' } })
    expect(wrapper.find('q-img').attributes('height')).toBe('50px')
    await wrapper.setProps({ height: '200px' })
    expect(wrapper.find('q-img').attributes('height')).toBe('200px')
  })
})
