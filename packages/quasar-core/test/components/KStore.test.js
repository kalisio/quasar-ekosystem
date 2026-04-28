import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KStore from '../../src/components/KStore.vue'

// Missing: Store (reactive KDK store), Events (app event bus).

describe('KStore', () => {
  it('initializes a lazy tree array', () => {
    const wrapper = mount(KStore)
    expect(Array.isArray(wrapper.vm.lazy)).toBe(true)
  })
})
