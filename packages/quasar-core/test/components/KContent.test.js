import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KContent from '../../src/KContent.vue'

describe('KContent', () => {
  it('builds component list from content array', () => {
    const wrapper = mount(KContent, { props: { content: [{ component: 'q-btn', label: 'Save' }] } })
    expect(wrapper.vm.filteredComponents).toHaveLength(1)
  })
})
