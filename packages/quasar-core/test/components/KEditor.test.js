import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import KEditor from '../../src/components/KEditor.vue'
import { api } from '../../src/api.js'

// KEditor uses KForm without importing it — must be registered as a global component.
// api and Context are plain singleton objects — they can be spied on directly.

afterEach(() => {
  vi.restoreAllMocks()
})

// Creates a KForm stub whose validate() returns the given result
function makeKFormStub (validateResult) {
  return {
    template: '<form />',
    setup () { return { validate: () => validateResult } }
  }
}

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

  // When form validation fails, apply returns undefined without calling the service
  it('apply returns undefined when form is invalid', async () => {
    const wrapper = mount(KEditor, {
      props: { service: 'users' },
      global: { components: { KForm: makeKFormStub({ isValid: false, values: {} }) } }
    })
    const result = await wrapper.vm.apply()
    expect(result).toBeUndefined()
  })

  // When api.getService returns null, apply logs an error and returns undefined
  it('apply returns undefined when service is not found', async () => {
    vi.spyOn(api, 'getService').mockReturnValue(null)
    const wrapper = mount(KEditor, {
      props: { service: 'users' },
      global: { components: { KForm: makeKFormStub({ isValid: true, values: { name: 'Alice' } }) } }
    })
    const result = await wrapper.vm.apply()
    expect(result).toBeUndefined()
  })

  // In creation mode, apply calls service.create with the merged form values
  it('apply calls service.create in creation mode', async () => {
    const create = vi.fn().mockResolvedValue({})
    vi.spyOn(api, 'getService').mockReturnValue({ create })
    const wrapper = mount(KEditor, {
      props: { service: 'users' },
      global: { components: { KForm: makeKFormStub({ isValid: true, values: { name: 'Alice' } }) } }
    })
    await wrapper.vm.apply()
    expect(create).toHaveBeenCalledWith({ name: 'Alice' })
  })

  // In edition mode, apply calls service.patch with the object _id and the form values
  it('apply calls service.patch with object _id in edition mode', async () => {
    const patch = vi.fn().mockResolvedValue({})
    vi.spyOn(api, 'getService').mockReturnValue({ patch })
    const wrapper = mount(KEditor, {
      props: { service: 'users', object: { _id: '123', name: 'Alice' } },
      global: { components: { KForm: makeKFormStub({ isValid: true, values: { name: 'Bob' } }) } }
    })
    await wrapper.vm.apply()
    expect(patch).toHaveBeenCalledWith('123', { name: 'Bob' })
  })

  // apply returns true when the service call succeeds and no hook blocks it
  it('apply returns true on success', async () => {
    vi.spyOn(api, 'getService').mockReturnValue({ create: vi.fn().mockResolvedValue({}) })
    const wrapper = mount(KEditor, {
      props: { service: 'users' },
      global: { components: { KForm: makeKFormStub({ isValid: true, values: {} }) } }
    })
    expect(await wrapper.vm.apply()).toBe(true)
  })

  // beforeRequest is called with the form values and the editor context
  it('apply calls beforeRequest hook with values', async () => {
    const beforeRequest = vi.fn().mockResolvedValue({ isOk: true, values: { name: 'Alice' } })
    vi.spyOn(api, 'getService').mockReturnValue({ create: vi.fn().mockResolvedValue({}) })
    const wrapper = mount(KEditor, {
      props: { service: 'users', beforeRequest },
      global: { components: { KForm: makeKFormStub({ isValid: true, values: { name: 'Alice' } }) } }
    })
    await wrapper.vm.apply()
    expect(beforeRequest).toHaveBeenCalled()
  })

  // When beforeRequest returns isOk:false, apply stops without calling the service
  it('apply returns false when beforeRequest returns isOk:false', async () => {
    const create = vi.fn()
    const beforeRequest = vi.fn().mockResolvedValue({ isOk: false })
    vi.spyOn(api, 'getService').mockReturnValue({ create })
    const wrapper = mount(KEditor, {
      props: { service: 'users', beforeRequest },
      global: { components: { KForm: makeKFormStub({ isValid: true, values: {} }) } }
    })
    expect(await wrapper.vm.apply()).toBe(false)
    expect(create).not.toHaveBeenCalled()
  })

  // When afterRequest returns isOk:false, apply returns false even though the service call succeeded
  it('apply returns false when afterRequest returns isOk:false', async () => {
    const afterRequest = vi.fn().mockResolvedValue({ isOk: false })
    vi.spyOn(api, 'getService').mockReturnValue({ create: vi.fn().mockResolvedValue({}) })
    const wrapper = mount(KEditor, {
      props: { service: 'users', afterRequest },
      global: { components: { KForm: makeKFormStub({ isValid: true, values: {} }) } }
    })
    expect(await wrapper.vm.apply()).toBe(false)
  })
})
