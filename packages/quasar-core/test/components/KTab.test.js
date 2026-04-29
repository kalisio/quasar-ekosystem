import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KTab from '../../src/components/KTab.vue'

describe('KTab', () => {
  // The tab list is derived from the keys of the content object
  it('derives tab list from content keys', () => {
    const content = { info: [], settings: [] }
    const wrapper = mount(KTab, { props: { content, mode: 'info' } })
    expect(wrapper.vm.tabs).toEqual(['info', 'settings'])
  })

  // hasTabs is false when the content object has no keys
  it('hasTabs is false when content is empty', () => {
    const wrapper = mount(KTab, { props: { content: {} } })
    expect(wrapper.vm.hasTabs).toBe(false)
  })

  // The panel computed returns the content section for the active mode
  it('panel reflects the current mode', () => {
    const content = { info: [{ component: 'q-btn' }], settings: [] }
    const wrapper = mount(KTab, { props: { content, mode: 'info' } })
    expect(wrapper.vm.panel).toEqual(content.info)
  })

  // Reactive tests
  // Replacing content with more keys updates the tabs array accordingly
  it('updates tabs when content changes', async () => {
    const wrapper = mount(KTab, { props: { content: { info: [] }, mode: 'info' } })
    expect(wrapper.vm.tabs).toEqual(['info'])
    await wrapper.setProps({ content: { info: [], settings: [], advanced: [] } })
    expect(wrapper.vm.tabs).toEqual(['info', 'settings', 'advanced'])
  })
})
