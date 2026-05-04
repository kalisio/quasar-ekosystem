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

  // getLabel returns the translated label from the labels prop array at the given index
  it('returns label from labels array at given index', () => {
    const content = { info: [], settings: [] }
    const wrapper = mount(KTab, { props: { content, mode: 'info', labels: ['Information', 'Settings'] } })
    expect(wrapper.vm.getLabel(0)).toBe('Information')
  })

  // onTabChanged emits the tab-changed event with the new tab value
  it('emits tab-changed when onTabChanged is called', () => {
    const wrapper = mount(KTab, { props: { content: { info: [], settings: [] }, mode: 'info' } })
    wrapper.vm.onTabChanged('settings')
    expect(wrapper.emitted('tab-changed')[0]).toEqual(['settings'])
  })
})
