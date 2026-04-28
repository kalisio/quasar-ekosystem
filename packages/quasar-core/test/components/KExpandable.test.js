import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KExpandable from '../../src/components/KExpandable.vue'

describe('KExpandable', () => {
  it('applies collapsed class when isExpanded is false', () => {
    const wrapper = mount(KExpandable, { props: { isExpanded: false, minHeight: 50, maxHeight: 300 } })
    expect(wrapper.classes()).toContain('k-expandable-collapsed')
  })
})
