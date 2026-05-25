import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KRibbon from '../../../src/components/graphics/KRibbon.vue'

describe('KRibbon', () => {
  it('renders the text', () => {
    const wrapper = mount(KRibbon, { props: { text: 'Beta' } })
    expect(wrapper.text()).toBe('Beta')
  })

  it('computes height from size prop', () => {
    const wrapper = mount(KRibbon, { props: { text: 'Beta', size: 40 } })
    expect(wrapper.vm.computedHeight).toBe('40px')
  })

  it('computes font size as size minus 8', () => {
    const wrapper = mount(KRibbon, { props: { text: 'Beta', size: 40 } })
    expect(wrapper.vm.computedFontSize).toBe('32px')
  })

  it('computes letter spacing from prop', () => {
    const wrapper = mount(KRibbon, { props: { text: 'Beta', letterSpacing: 4 } })
    expect(wrapper.vm.computedLetterSpacing).toBe('4px')
  })

  it('resolves hex color directly', () => {
    const wrapper = mount(KRibbon, { props: { text: 'Beta', color: '#ff0000' } })
    expect(wrapper.vm.computedColor).toBe('#ff0000')
  })

  it('applies -45deg rotation for top-left position', () => {
    const wrapper = mount(KRibbon, { props: { text: 'Beta', position: 'top-left' } })
    expect(wrapper.vm.rotation).toBe('-45deg')
  })

  it('applies 45deg rotation for top-right position', () => {
    const wrapper = mount(KRibbon, { props: { text: 'Beta', position: 'top-right' } })
    expect(wrapper.vm.rotation).toBe('45deg')
  })

  it('applies -45deg rotation for bottom-right position', () => {
    const wrapper = mount(KRibbon, { props: { text: 'Beta', position: 'bottom-right' } })
    expect(wrapper.vm.rotation).toBe('-45deg')
  })

  it('applies 45deg rotation for bottom-left position', () => {
    const wrapper = mount(KRibbon, { props: { text: 'Beta', position: 'bottom-left' } })
    expect(wrapper.vm.rotation).toBe('45deg')
  })
})
