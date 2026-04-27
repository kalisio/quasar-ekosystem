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

  /* it('options are computed from properties.field.options', () => { ... }) */
  /* it('fill sets the model value', () => { ... }) */
  /* it('clear resets model to null for single-select', () => { ... }) */
  /* it('model initializes to [] for multiselect', () => { ... }) */
  /* it('isEmpty checks array emptiness for multiselect', () => { ... }) */
  /* it('onChanged emits field-changed', () => { ... }) */
  /* it('dense prop is forwarded to q-select', () => { ... }) */
  /* it('values prop initializes the model', () => { ... }) */
  /* it('clear resets model to [] for multiselect', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('validate clears the error', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
  /* it('isClearable defaults to true', () => { ... }) */
  /* it('isClearable can be disabled via properties.field.clearable', () => { ... }) */
  /* it('onFilter with empty string resets the filter', () => { ... }) */
  /* it('getId returns kebab-case id for string values', () => { ... }) */
  /* it('getId falls back to label for object values', () => { ... }) */
})
