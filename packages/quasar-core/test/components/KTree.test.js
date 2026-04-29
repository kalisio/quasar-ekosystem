import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KTree from '../../src/components/KTree.vue'

describe('KTree', () => {
  // A non-empty nodes array is accepted and stored as the nodes prop
  it('accepts a nodes prop', () => {
    const wrapper = mount(KTree, { props: { nodes: [{ id: '1', label: 'Root' }], onLazyLoad: () => {} } })
    expect(wrapper.vm.nodes).toHaveLength(1)
  })

  // The labelKey prop defaults to label for reading the display label from each node
  it('labelKey defaults to label', () => {
    const wrapper = mount(KTree, { props: { nodes: [] } })
    expect(wrapper.vm.labelKey).toBe('label')
  })

  // The nodeKey prop defaults to id for uniquely identifying each tree node
  it('nodeKey defaults to id', () => {
    const wrapper = mount(KTree, { props: { nodes: [] } })
    expect(wrapper.vm.nodeKey).toBe('id')
  })

  // Reactive tests
  // Replacing the nodes array with a longer one updates the tree data
  it('updates nodes when prop changes', async () => {
    const wrapper = mount(KTree, { props: { nodes: [] } })
    expect(wrapper.vm.nodes).toHaveLength(0)
    await wrapper.setProps({ nodes: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] })
    expect(wrapper.vm.nodes).toHaveLength(2)
  })
})
