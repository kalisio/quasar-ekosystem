import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KPanel from '../../src/components/KPanel.vue'

describe('KPanel', () => {
  // hasContent is true when the content array has at least one item
  it('reports hasContent when content is provided', () => {
    const wrapper = mount(KPanel, { props: { content: [{ component: 'q-btn' }] } })
    expect(wrapper.vm.hasContent).toBe(true)
  })

  // hasContent is false when content is an empty array
  it('hasContent is false when content is empty', () => {
    const wrapper = mount(KPanel, { props: { content: [] } })
    expect(wrapper.vm.hasContent).toBe(false)
  })

  // The direction prop defaults to horizontal when not specified
  it('direction defaults to horizontal', () => {
    const wrapper = mount(KPanel, { props: { content: [{ component: 'q-btn' }] } })
    expect(wrapper.vm.direction).toBe('horizontal')
  })

  // Reactive tests
  // Providing content after mount switches hasContent from false to true
  it('updates hasContent when content changes', async () => {
    const wrapper = mount(KPanel, { props: { content: [] } })
    expect(wrapper.vm.hasContent).toBe(false)
    await wrapper.setProps({ content: [{ component: 'q-btn' }] })
    expect(wrapper.vm.hasContent).toBe(true)
  })
})
