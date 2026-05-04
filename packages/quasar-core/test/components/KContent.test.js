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

  // a visible property that is a function is called with the context to determine visibility
  it('calls a function-type visible property with context', () => {
    const content = [{ component: 'q-btn', visible: () => true }]
    const wrapper = mount(KContent, { props: { content, context: {} } })
    expect(wrapper.vm.filteredComponents[0].isVisible).toBe(true)
  })

  // onTriggered forwards the event payload to the parent via the triggered emit
  it('emits triggered with params when onTriggered is called', () => {
    const wrapper = mount(KContent, { props: { content: [] } })
    wrapper.vm.onTriggered({ action: 'save' })
    expect(wrapper.emitted('triggered')[0]).toEqual([{ action: 'save' }])
  })
})
