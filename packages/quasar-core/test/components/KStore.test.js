import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import moment from 'moment'
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

  // convertStore returns an empty object for function values which is then excluded from the tree
  it('function value in Store produces no tree node', () => {
    Store.fn = () => 'test'
    const wrapper = mount(KStore)
    expect(wrapper.vm.lazy).toHaveLength(0)
  })

  // convertStore converts a moment value to a leaf labelled with the ISO date string
  it('moment value in Store produces a node with ISO date label', () => {
    const date = moment('2024-01-15')
    Store.date = date
    const wrapper = mount(KStore)
    expect(wrapper.vm.lazy[0].label).toBe(date.toISOString())
  })

  // convertStore converts an array value to a lazy branch node
  it('array value in Store produces a lazy branch node', () => {
    Store.items = ['a', 'b']
    const wrapper = mount(KStore)
    const node = wrapper.vm.lazy.find(n => n.label === 'items')
    expect(node).toBeDefined()
    expect(node.lazy).toBe(true)
  })

  // onLazyLoad calls done with the converted subtree for the requested store key
  it('onLazyLoad calls done with converted subtree', () => {
    Store.config = { port: 3000 }
    const wrapper = mount(KStore)
    const done = vi.fn()
    wrapper.vm.onLazyLoad({ node: null, key: 'config', done, fail: vi.fn() })
    expect(done).toHaveBeenCalled()
  })
})
