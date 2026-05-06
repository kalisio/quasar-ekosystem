import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KSelectField from '../../../src/components/KSelectField.vue'

const selectStub = { template: '<select />', props: ['modelValue', 'options'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KSelectField', () => {
  const stubs = { 'q-select': selectStub, 'q-chip': true, 'q-item': true, 'q-item-section': true, 'q-item-label': true }
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
  ]

  // If there is a select when not in readOnly mode.
  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.find('select').exists()).toBe(true)
  })

  // In readOnly mode, the select is replaced by a chip.
  it('readOnly hides the select and shows a chip', () => {
    const wrapper = mount(KSelectField, { props: { ...makeProps({ field: { options } }), readOnly: true }, global: { stubs } })
    expect(wrapper.find('select').exists()).toBe(false)
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
  })

  // For multiselect, the empty value is [] not null.
  it('emptyModel returns [] for multiselect', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual([])
  })

  // If the field is required and has only one option, it should auto-select it.
  it('auto-fills when required is true and only one option exists', async () => {
    const singleOption = [{ label: 'Only Option', value: 'only' }]
    const wrapper = mount(KSelectField, {
      props: { ...makeProps({ field: { options: singleOption } }), required: true },
      global: { stubs }
    })
    await nextTick()
    expect(wrapper.vm.value()).toBe('only')
  })

  // The filter should narrow the displayed options.
  it('onFilter narrows the options list', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.onFilter('option a', (fn) => fn())
    expect(wrapper.vm.options.length).toBe(1)
    expect(wrapper.vm.options[0].value).toBe('a')
  })

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    await wrapper.setProps({ values: { test: 'b' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('b')
  })

  // isClearable returns true by default when field.clearable is not specified
  it('isClearable defaults to true', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(true)
  })

  // field.clearable=false disables the clear button
  it('isClearable returns false when field.clearable is false', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, clearable: false } }), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(false)
  })

  // clear() resets single-select model to null
  it('clear resets model to null for single-select', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBeNull()
  })

  // onFilter with empty string removes the filter and restores all options
  it('onFilter with empty string resets the filter', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.onFilter('option a', (fn) => fn())
    expect(wrapper.vm.options.length).toBe(1)
    wrapper.vm.onFilter('', (fn) => fn())
    expect(wrapper.vm.options.length).toBe(2)
  })

  // getId converts a string value to a kebab-case element id
  it('getId returns kebab-case id for string value', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.getId({ value: 'my option', label: 'My Option' })).toBe('my-option')
  })

  // isEmpty returns true for single-select when the model is null (default)
  it('isEmpty returns true when model is null', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns true for multiselect when model is empty array', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('clear resets multiselect model to []', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    wrapper.vm.fill(['a', 'b'])
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('hasChips returns false by default', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.hasChips()).toBe(false)
  })

  it('hasChips returns true when field.chips is set', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, chips: true } }), global: { stubs } })
    expect(wrapper.vm.hasChips()).toBe(true)
  })

  it('getId falls back to option.label when value is a complex object', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    const id = wrapper.vm.getId({ value: { nested: true }, label: 'My Complex Option' })
    expect(id).toBe('my-complex-option')
  })

  it('getId uses field.valueField to extract id from complex object', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, valueField: 'code' } }), global: { stubs } })
    const id = wrapper.vm.getId({ value: { code: 'opt-1', label: 'Option 1' }, label: 'Option 1' })
    expect(id).toBe('opt-1')
  })

  it('selectedClass returns default text-weight-regular', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-weight-regular')
  })

  it('selectedClass returns field.selectedClass when set', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, selectedClass: 'text-bold' } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-bold')
  })

  it('chips computed delegates to hasChips()', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.chips).toBe(false)
  })

  it('hasNoOption returns false when field.noOption is not set', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.hasNoOption).toBe(false)
  })

  it('hasNoOption returns true when field.noOption is set', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, noOption: 'No results' } }), global: { stubs } })
    expect(wrapper.vm.hasNoOption).toBe(true)
  })

  it('noOption returns null when field.noOption is not set', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.noOption).toBeNull()
  })

  it('noOption returns configured value', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, noOption: 'No matches' } }), global: { stubs } })
    expect(wrapper.vm.noOption).toBe('No matches')
  })
})
