import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KEditor from '../../src/components/KEditor.vue'

// KEditor uses KForm without importing it — must be registered as a global component.
// Missing: api (Feathers service client), Context (app context).

describe('KEditor', () => {
  // Without an object prop, mode is set to creation at initialization
  it('initializes in creation mode', () => {
    const wrapper = mount(KEditor, {
      props: { service: 'users' },
      global: { components: { KForm: { template: '<form />' } } }
    })
    expect(wrapper.vm.getContext().mode).toBe('creation')
  })

  // When an existing object is passed, mode switches to edition
  it('initializes in edition mode when object is provided', () => {
    const wrapper = mount(KEditor, {
      props: { service: 'users', object: { _id: '123', name: 'Alice' } },
      global: { components: { KForm: { template: '<form />' } } }
    })
    expect(wrapper.vm.getContext().mode).toBe('edition')
  })

  // getContext returns the full props object including service name
  it('getContext includes service in props', () => {
    const wrapper = mount(KEditor, {
      props: { service: 'events' },
      global: { components: { KForm: { template: '<form />' } } }
    })
    expect(wrapper.vm.getContext().props.service).toBe('events')
  })

  // dense prop defaults to false when not explicitly provided
  it('dense prop defaults to false', () => {
    const wrapper = mount(KEditor, {
      props: { service: 'users' },
      global: { components: { KForm: { template: '<form />' } } }
    })
    expect(wrapper.vm.getContext().props.dense).toBe(false)
  })

  // filter prop value is accessible from getContext when set
  it('getContext reflects filter prop', () => {
    const wrapper = mount(KEditor, {
      props: { service: 'users', filter: ['name'] },
      global: { components: { KForm: { template: '<form />' } } }
    })
    expect(wrapper.vm.getContext().props.filter).toEqual(['name'])
  })
})
