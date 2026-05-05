import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KTextArea from '../../src/components/KTextArea.vue'
import KExpandable from '../../src/components/KExpandable.vue'
import KScrollArea from '../../src/components/KScrollArea.vue'

describe('KTextArea', () => {
  // isExpanded starts as false so the text area is collapsed by default
  it('starts collapsed', () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello' } })
    expect(wrapper.vm.isExpanded).toBe(false)
  })

  // Passing isExpanded=true initializes the local state in expanded mode
  it('starts expanded when isExpanded prop is true', () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello', isExpanded: true } })
    expect(wrapper.vm.isExpanded).toBe(true)
  })

  // The font size in expanded mode defaults to 0.875rem (no zoom)
  it('cssExpandedFontSize is 0.875rem by default', () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello' } })
    expect(wrapper.vm.cssExpandedFontSize).toBe('0.875rem')
  })

  // Setting zoom=true increases the expanded font size to 1rem
  it('cssExpandedFontSize is 1rem when zoom is true', () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello', zoom: true } })
    expect(wrapper.vm.cssExpandedFontSize).toBe('1rem')
  })

  // minHeight and maxHeight are forwarded as props to the KExpandable child
  it('forwards minHeight and maxHeight to KExpandable', () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello', minHeight: 100, maxHeight: 500 } })
    const expandable = wrapper.findComponent(KExpandable)
    expect(expandable.props('minHeight')).toBe(100)
    expect(expandable.props('maxHeight')).toBe(500)
  })

  // KScrollArea visible prop is false when the text area is collapsed
  it('KScrollArea is hidden when not expanded', () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello' } })
    const scrollArea = wrapper.findComponent(KScrollArea)
    expect(scrollArea.props('visible')).toBe(false)
  })

  // Changing the text prop increments scrollAreaKey, forcing KScrollArea to remount
  it('increments scrollAreaKey when text prop changes', async () => {
    const wrapper = mount(KTextArea, { props: { text: 'First' } })
    const initialKey = wrapper.vm.scrollAreaKey
    await wrapper.setProps({ text: 'Second' })
    expect(wrapper.vm.scrollAreaKey).toBe(initialKey + 1)
  })

  // onScrolled sets isExpandable to true when verticalSize exceeds minHeight
  it('onScrolled sets isExpandable when verticalSize exceeds minHeight', () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello', minHeight: 64 } })
    expect(wrapper.vm.isExpandable).toBe(false)
    wrapper.vm.onScrolled({ verticalSize: 100 })
    expect(wrapper.vm.isExpandable).toBe(true)
  })

  // cssCursor is default when the text area is not expandable
  it('cssCursor is default when not expandable', () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello' } })
    expect(wrapper.vm.cssCursor).toBe('default')
  })

  // cssCursor becomes pointer once onScrolled marks the area as expandable
  it('cssCursor is pointer when expandable', () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello', minHeight: 64 } })
    wrapper.vm.onScrolled({ verticalSize: 100 })
    expect(wrapper.vm.cssCursor).toBe('pointer')
  })

  // onClick does not expand when the text area is not yet expandable
  it('onClick does nothing when not expandable', () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello' } })
    wrapper.vm.onClick()
    expect(wrapper.vm.isExpanded).toBe(false)
  })

  // Changing text prop resets isExpandable to false even if it was set to true
  it('resets isExpandable when text prop changes', async () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello', minHeight: 64 } })
    wrapper.vm.onScrolled({ verticalSize: 100 })
    expect(wrapper.vm.isExpandable).toBe(true)
    await wrapper.setProps({ text: 'Changed' })
    expect(wrapper.vm.isExpandable).toBe(false)
  })
})
