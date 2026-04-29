import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KExpandable from '../../src/components/KExpandable.vue'

describe('KExpandable', () => {
  // The collapsed CSS class is applied to the root element when isExpanded is false
  it('applies collapsed class when isExpanded is false', () => {
    const wrapper = mount(KExpandable, { props: { isExpanded: false, minHeight: 50, maxHeight: 300 } })
    expect(wrapper.classes()).toContain('k-expandable-collapsed')
  })

  // The expanded CSS class is applied to the root element when isExpanded is true
  it('applies expanded class when isExpanded is true', () => {
    const wrapper = mount(KExpandable, { props: { isExpanded: true, minHeight: 50, maxHeight: 300 } })
    expect(wrapper.classes()).toContain('k-expandable-expanded')
  })

  // Reactive tests
  // Toggling isExpanded swaps the collapsed class for the expanded class
  it('switches class when isExpanded changes', async () => {
    const wrapper = mount(KExpandable, { props: { isExpanded: false, minHeight: 50, maxHeight: 300 } })
    expect(wrapper.classes()).toContain('k-expandable-collapsed')
    await wrapper.setProps({ isExpanded: true })
    expect(wrapper.classes()).toContain('k-expandable-expanded')
    expect(wrapper.classes()).not.toContain('k-expandable-collapsed')
  })
})
