import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import KDatetimeField from '../../../src/components/KDatetimeField.vue'

const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KDatetimeField', () => {
  const stubs = { 'q-field': fieldStub }

  // Edit mode renders a native datetime-local input.
  it('renders a datetime-local input in edit mode', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="datetime-local"]').exists()).toBe(true)
  })

  // readOnly shows the raw ISO string (no formatting).
  it('renders the model value in readOnly mode', () => {
    const isoDate = '2024-06-15T10:30:00.000Z'
    const wrapper = mount(KDatetimeField, { props: { ...makeProps(), readOnly: true, values: { test: isoDate } }, global: { stubs } })
    expect(wrapper.find('div').text()).toBe(isoDate)
  })

  // emptyModel returns a valid ISO string, not null or empty.
  it('emptyModel returns an ISO date string', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  // A datetime field always has a value, so isEmpty is always false.
  it('isEmpty always returns false', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  // clear() uses properties.default if defined, instead of emptyModel (now).
  it('clear uses properties.default when defined', () => {
    const defaultDate = '2000-01-01T00:00:00.000Z'
    const wrapper = mount(KDatetimeField, { props: makeProps({ default: defaultDate }), global: { stubs } })
    wrapper.vm.fill('2024-06-01T08:00:00.000Z')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe(defaultDate)
  })

  /* it('initializes model to current datetime when no values provided', () => { ... }) */
  /* it('clear resets to emptyModel (current datetime)', () => { ... }) */
  /* it('values prop initializes the model', () => { ... }) */
  /* it('field.defaultOffset shifts emptyModel by seconds', () => { ... }) */
  /* it('onChanged emits field-changed', () => { ... }) */
  /* it('values prop change updates the model reactively', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('validate clears the error', () => { ... }) */
})
