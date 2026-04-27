import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import KDateField from '../../../src/components/KDateField.vue'

const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KDateField', () => {
  const stubs = { 'q-field': fieldStub }

  // Edit mode renders a native date input.
  it('renders a date input in edit mode', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="date"]').exists()).toBe(true)
  })

  // readOnly shows the raw date string (YYYY/MM/DD format).
  it('renders the model value in readOnly mode', () => {
    const wrapper = mount(KDateField, { props: { ...makeProps(), readOnly: true, values: { test: '2024/06/15' } }, global: { stubs } })
    expect(wrapper.find('div').text()).toBe('2024/06/15')
  })

  // Quasar date picker uses YYYY/MM/DD (slashes, not dashes).
  it('emptyModel returns date in YYYY/MM/DD format', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
  })

  // A date field always has a value, so isEmpty is always false.
  it('isEmpty always returns false', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  // clear() uses properties.default if defined, instead of today.
  it('clear uses properties.default when defined', () => {
    const wrapper = mount(KDateField, { props: makeProps({ default: '2000/01/01' }), global: { stubs } })
    wrapper.vm.fill('2024/06/01')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('2000/01/01')
  })

  /* it('initializes model to today when no values provided', () => { ... }) */
  /* it('fill sets the model value', () => { ... }) */
  /* it('clear resets to today', () => { ... }) */
  /* it('values prop initializes the model', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('validate clears the error', () => { ... }) */
  /* it('onChanged emits field-changed', () => { ... }) */
  /* it('values prop change updates the model reactively', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
})
