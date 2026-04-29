import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KChip from '../../src/components/KChip.vue'

describe('KChip', () => {
  // The label prop is passed through i18n.tie and returned as-is in tests
  it('computes label from prop', () => {
    const wrapper = mount(KChip, { props: { label: 'Hello' } })
    expect(wrapper.vm.computedLabel).toBe('Hello')
  })

  // hideLabel=true makes computedLabel return undefined so the text is not shown
  it('hides label when hideLabel is true', () => {
    const wrapper = mount(KChip, { props: { label: 'Hello', hideLabel: true } })
    expect(wrapper.vm.computedLabel).toBeUndefined()
  })

  // The icon prop is forwarded to computedIcon when hideIcon is false
  it('returns icon when icon is set', () => {
    const wrapper = mount(KChip, { props: { icon: 'las la-tag' } })
    expect(wrapper.vm.computedIcon).toBe('las la-tag')
  })

  // hideIcon=true makes computedIcon return undefined even when an icon is set
  it('hides icon when hideIcon is true', () => {
    const wrapper = mount(KChip, { props: { icon: 'las la-tag', hideIcon: true } })
    expect(wrapper.vm.computedIcon).toBeUndefined()
  })

  // Reactive tests
  // Updating the label prop recalculates computedLabel immediately
  it('updates label when prop changes', async () => {
    const wrapper = mount(KChip, { props: { label: 'Hello' } })
    expect(wrapper.vm.computedLabel).toBe('Hello')
    await wrapper.setProps({ label: 'World' })
    expect(wrapper.vm.computedLabel).toBe('World')
  })

  // Setting hideIcon to true after mount removes the icon from the computed value
  it('hides icon reactively when hideIcon changes', async () => {
    const wrapper = mount(KChip, { props: { icon: 'las la-tag', hideIcon: false } })
    expect(wrapper.vm.computedIcon).toBe('las la-tag')
    await wrapper.setProps({ hideIcon: true })
    expect(wrapper.vm.computedIcon).toBeUndefined()
  })
})
