import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KEditor from '../../src/components/KEditor.vue'

// KEditor uses KForm without importing it — must be registered as a global component.
// Missing: api (Feathers service client), Context (app context).

describe('KEditor', () => {
  it('initializes in creation mode', () => {
    const wrapper = mount(KEditor, {
      props: { service: 'users' },
      global: { components: { KForm: { template: '<form />' } } }
    })
    expect(wrapper.vm.getContext().mode).toBe('creation')
  })
})
