import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import KStore from '../../src/components/KStore.vue'
import { Store } from '../../src/index.js'

afterEach(() => {
  Object.keys(Store).forEach(k => delete Store[k])
})

describe('KStore', () => {
  // The lazy ref is initialized as an array (tree nodes list)
  it('initializes a lazy tree array', () => {
    const wrapper = mount(KStore)
    expect(Array.isArray(wrapper.vm.lazy)).toBe(true)
  })

  // When the reactive Store object is empty, the tree starts with no nodes
  it('lazy is empty when Store is empty', () => {
    const wrapper = mount(KStore)
    expect(wrapper.vm.lazy).toHaveLength(0)
  })

  // A primitive value in Store produces a leaf node with the key as label
  it('creates a leaf node for a primitive Store value', () => {
    Store.version = '1.0.0'
    const wrapper = mount(KStore)
    expect(wrapper.vm.lazy).toHaveLength(1)
    expect(wrapper.vm.lazy[0].label).toBe('version')
  })

  // An object value in Store produces a branch node flagged as lazy
  it('creates a branch node with lazy:true for an object Store value', () => {
    Store.config = { port: 3000 }
    const wrapper = mount(KStore)
    expect(wrapper.vm.lazy[0].lazy).toBe(true)
  })

  // addPath assigns each root node a path string equal to its label
  it('each node has a path property', () => {
    Store.version = '1.0.0'
    const wrapper = mount(KStore)
    expect(wrapper.vm.lazy[0].path).toBe('version')
  })
})
