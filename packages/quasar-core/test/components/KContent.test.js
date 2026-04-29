import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KContent from '../../src/components/KContent.vue'

describe('KContent', () => {
  // An array of one component descriptor produces one entry in filteredComponents
  it('builds component list from content array', () => {
    const wrapper = mount(KContent, { props: { content: [{ component: 'q-btn', label: 'Save' }] } })
    expect(wrapper.vm.filteredComponents).toHaveLength(1)
  })

  // An empty array yields an empty filteredComponents list
  it('returns empty list when content is empty', () => {
    const wrapper = mount(KContent, { props: { content: [] } })
    expect(wrapper.vm.filteredComponents).toHaveLength(0)
  })

  // When content is an object, only the section matching mode is used
  it('uses mode to pick components from object content', () => {
    const content = { edit: [{ component: 'q-btn', label: 'Save' }], view: [] }
    const wrapper = mount(KContent, { props: { content, mode: 'edit' } })
    expect(wrapper.vm.filteredComponents).toHaveLength(1)
  })

  // Reactive tests
  // Replacing the content prop with a longer array updates filteredComponents
  it('updates filteredComponents when content changes', async () => {
    const wrapper = mount(KContent, { props: { content: [] } })
    expect(wrapper.vm.filteredComponents).toHaveLength(0)
    await wrapper.setProps({ content: [{ component: 'q-btn' }, { component: 'q-btn' }] })
    expect(wrapper.vm.filteredComponents).toHaveLength(2)
  })
})
