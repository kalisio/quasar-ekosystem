import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import moment from 'moment'
import KStore from '../../src/components/KStore.vue'
import { Store } from '../../src/index.js'

// Single-slot handler: each KStore mount overwrites the previous slot.
// This prevents handler accumulation across tests, which would cause
// findNode to traverse stale reactive Refs with live dep.subs chains (stack overflow).
let _storeChangedHandler = null
vi.mock('../../src/events.js', () => ({
  Events: {
    on: (event, fn) => { if (event === 'store-changed') _storeChangedHandler = fn },
    off: () => {},
    emit: (event, ...args) => { if (event === 'store-changed' && _storeChangedHandler) _storeChangedHandler(...args) }
  }
}))

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

  // addPath recurses into children, stamping each with a dotted path derived from ancestor labels
  it('addPath assigns dotted path to nested children', () => {
    const wrapper = mount(KStore)
    wrapper.vm.lazy = [{ label: 'config', path: 'config', children: [{ label: 'port', children: [] }] }]
    wrapper.vm.onLazyLoad({ node: null, key: 'config', done: vi.fn(), fail: vi.fn() })
    expect(wrapper.vm.lazy[0].children[0].path).toBe('config.port')
  })

  // updateValue maps over the tree recursively, replacing the label where path matches
  it('updateValue replaces label at the matched path recursively', () => {
    const wrapper = mount(KStore)
    const tree = [
      {
        label: 'config',
        path: 'config',
        children: [
          {
            label: 'port',
            path: 'config.port',
            children: [
              { label: 3000, path: 'config.port.3000', children: [] }
            ]
          }
        ]
      }
    ]
    const result = wrapper.vm.updateValue(tree, 'config.port.3000', 3001)
    expect(result[0].children[0].children[0].label).toBe(3001)
  })

  // findNode does a depth-first search; use a plain ref-like object to avoid Vue's dep cycle
  it('findNode finds a nested node by key/value in a deep tree', () => {
    const wrapper = mount(KStore)
    const mockRef = {
      value: [{
        label: 'config',
        path: 'config',
        children: [{ label: 'port', path: 'config.port', children: [] }]
      }]
    }
    const found = wrapper.vm.findNode(mockRef, 'path', 'config.port')
    expect(found?.label).toBe('port')
  })

  // updateLazy locates the matching leaf via findNode, replaces its label via updateValue,
  // and re-stamps paths via addPath. Unmounting the wrapper stops the render effect so
  // lazy.dep.subs is cleared and findNode can traverse the Ref without the circular
  // dep → subs → dep cycle. The single-slot Events mock ensures only this handler fires.
  it('updateLazy updates the tree when store-changed fires with a matching key', () => {
    const wrapper = mount(KStore)
    wrapper.vm.lazy = [{
      label: 'config',
      path: 'config',
      children: [{
        label: 'port',
        path: 'config.port',
        children: [{ label: 3000, path: 'config.port.3000', children: [] }]
      }]
    }]
    wrapper.unmount()
    _storeChangedHandler('config', { port: 3001 })
    expect(wrapper.vm.lazy[0].children[0].children[0].label).toBe(3001)
  })

  // updateLazy skips array-typed values — only scalar keys trigger a findNode + updateValue
  it('updateLazy ignores array values in emitted payload', () => {
    const wrapper = mount(KStore)
    wrapper.vm.lazy = [{ label: 'items', path: 'items', children: [] }]
    const before = wrapper.vm.lazy[0].children.length
    _storeChangedHandler('items', { list: ['a', 'b'] })
    expect(wrapper.vm.lazy[0].children.length).toBe(before)
  })
})
