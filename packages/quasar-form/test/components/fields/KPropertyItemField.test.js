import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KPropertyItemField from '../../../src/components/KPropertyItemField.vue'

const selectStub = { template: '<select />', props: ['modelValue', 'options'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KPropertyItemField', () => {
  const stubs = { 'q-select': selectStub, 'q-chip': { template: '<span><slot /></span>' } }
  const serviceProps = { field: { service: 'items', propertyField: 'code', multiple: false } }

  // If there is a q-select in edit mode
  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KPropertyItemField, { props: makeProps(serviceProps), global: { stubs } })
    expect(wrapper.findComponent(selectStub).exists()).toBe(true)
  })

  // If there is a chip in readOnly mode with a value provided
  it('renders a chip in readOnly mode', () => {
    const wrapper = mount(KPropertyItemField, { props: { ...makeProps(serviceProps), readOnly: true, values: { test: 'ABC' } }, global: { stubs } })
    expect(wrapper.find('span').exists()).toBe(true)
  })

  // onSearch delegates to the injected search function and maps results to options
  it('search inject is used for onSearch', async () => {
    const mockSearch = vi.fn().mockResolvedValue([{ code: 'XYZ', description: 'Item XYZ' }])
    const wrapper = mount(KPropertyItemField, {
      props: makeProps(serviceProps),
      global: { stubs, provide: { search: mockSearch } }
    })
    let updated = false
    await wrapper.vm.onSearch('XY', (fn) => { fn(); updated = true }, () => {})
    expect(mockSearch).toHaveBeenCalled()
    expect(updated).toBe(true)
    expect(wrapper.vm.options[0]).toMatchObject({ id: 'xyz', value: 'XYZ' })
  })

  // If values prop changes after mount, the model should update reactively
  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KPropertyItemField, { props: makeProps(serviceProps), global: { stubs } })
    await wrapper.setProps({ values: { test: 'CODE42' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('CODE42')
  })

  // Options list is cleared after a selection to avoid stale results on next search
  it('options are cleared after onSelected', async () => {
    const mockSearch = vi.fn().mockResolvedValue([{ code: 'ABC' }])
    const wrapper = mount(KPropertyItemField, {
      props: makeProps(serviceProps),
      global: { stubs, provide: { search: mockSearch } }
    })
    await wrapper.vm.onSearch('AB', (fn) => fn(), () => {})
    expect(wrapper.vm.options.length).toBe(1)
    await wrapper.vm.onSelected('ABC')
    expect(wrapper.vm.options.length).toBe(0)
  })

  // Already-selected values are excluded from search results in multiple mode
  it('onSearch in multiple mode excludes already-selected values', async () => {
    const mockSearch = vi.fn().mockResolvedValue([{ code: 'ABC' }, { code: 'XYZ' }])
    const wrapper = mount(KPropertyItemField, {
      props: makeProps({ field: { ...serviceProps.field, multiple: true } }),
      global: { stubs, provide: { search: mockSearch } }
    })
    wrapper.vm.model = ['abc'] // ids are kebab-cased
    await wrapper.vm.onSearch('AB', (fn) => fn(), () => {})
    expect(wrapper.vm.options.length).toBe(1)
    expect(wrapper.vm.options[0].value).toBe('XYZ')
  })

  // descriptionField config maps an alternate property to the option description slot
  it('search result description field is mapped correctly', async () => {
    const mockSearch = vi.fn().mockResolvedValue([{ code: 'DEF', note: 'Some note' }])
    const wrapper = mount(KPropertyItemField, {
      props: makeProps({ field: { ...serviceProps.field, descriptionField: 'note' } }),
      global: { stubs, provide: { search: mockSearch } }
    })
    await wrapper.vm.onSearch('DE', (fn) => fn(), () => {})
    expect(wrapper.vm.options[0].description).toBe('Some note')
  })

  /* it('emptyModel returns null for single', () => { ... }) */
  /* it('emptyModel returns [] for multiple', () => { ... }) */
  /* it('onSearch aborts when pattern is too short', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
  /* it('onSelected with null clears the model', () => { ... }) */
  /* it('clear resets model to emptyModel', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
})
