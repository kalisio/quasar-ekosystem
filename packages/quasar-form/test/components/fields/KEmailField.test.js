import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KEmailField from '../../../src/components/KEmailField.vue'

const inputStub = { template: '<input />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KEmailField', () => {
  const stubs = { 'q-input': inputStub }

  // If there is an input when not in readOnly mode
  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  // If there is a mailto link when in readOnly mode with a value provided.
  it('renders a mailto link in readOnly mode', () => {
    const wrapper = mount(KEmailField, { props: { ...makeProps(), readOnly: true, values: { test: 'user@example.com' } }, global: { stubs } })
    expect(wrapper.find('a[href="mailto:user@example.com"]').exists()).toBe(true)
  })

  /* it('fill sets the model value', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('user@example.com')
    expect(wrapper.vm.value()).toBe('user@example.com')
  }) */

  // Check if the field is empty using the clear method from useField.
  it('clear resets model to null', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('user@example.com')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  // If the email is invalid, hasError should be set to true.
  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid email')
    expect(wrapper.vm.hasError).toBe(true)
  })

  // After invalidating, validate should clear the error.
  it('validate clears the error', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid email')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  // Check that field-changed is emitted with the field name and value when onChanged is called.
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('user@example.com')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'user@example.com'])
  })

  /* it('label is read from properties.field.label', () => {
    const wrapper = mount(KEmailField, { props: makeProps({ field: { label: 'Email address' } }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Email address')
  }) */

  // If values prop is provided on mount, the model should be initialized with the matching value.
  it('values prop initializes the model', () => {
    const wrapper = mount(KEmailField, { props: { ...makeProps(), values: { test: 'init@example.com' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('init@example.com')
  })

  /* it('field.disabled disables the field', () => {
    const wrapper = mount(KEmailField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  }) */

  /* it('readOnly hides the input', () => {
    const wrapper = mount(KEmailField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  }) */

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toBeNull()
    await wrapper.setProps({ values: { test: 'updated@example.com' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('updated@example.com')
  })

  // Check that apply writes the field value onto a target object.
  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('user@example.com')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('user@example.com')
  })

  /* it('errorLabel uses field.errorLabel override', () => {
    const wrapper = mount(KEmailField, { props: makeProps({ field: { errorLabel: 'Invalid email format' } }), global: { stubs } })
    expect(wrapper.vm.errorLabel).toBe('Invalid email format')
  }) */

  /* it('label falls back to properties.description', () => {
    const wrapper = mount(KEmailField, { props: makeProps({ description: 'Your email', field: {} }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Your email')
  }) */
})
