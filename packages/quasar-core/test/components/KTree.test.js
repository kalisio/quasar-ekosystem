import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KTree from '../../src/KTree.vue'

describe('KTree', () => {
  it('accepts a nodes prop', () => {
    const wrapper = mount(KTree, { props: { nodes: [{ id: '1', label: 'Root' }] } })
    expect(wrapper.vm.nodes).toHaveLength(1)
  })
})
