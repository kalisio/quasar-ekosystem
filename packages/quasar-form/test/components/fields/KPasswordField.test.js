import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import KPasswordField from '../../../src/components/KPasswordField.vue'

const iconStub = { template: '<button @click="$emit(\'click\')" />', emits: ['click'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KPasswordField', () => {
  const inputWithAppendStub = { template: '<div><input /><slot name="append" /></div>', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }
  const stubs = { 'q-input': inputWithAppendStub, 'q-icon': iconStub }

  // If there is an input when not in readOnly mode.
  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  // Password is hidden by default (showPassword controls the input type).
  it('showPassword is true by default (password hidden)', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.showPassword).toBe(true)
  })

  // Clicking the eye icon should reveal the password.
  it('clicking the icon toggles showPassword', async () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showPassword).toBe(false)
  })

  // Autocomplete defaults to "on" to help password managers.
  it('autocomplete defaults to "on"', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.autocomplete).toBe('on')
  })

  // Check that field-changed is emitted with the password value.
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('secret123')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'secret123'])
  })

  /*
  // Clicking twice should hide it again.
  it('double-clicking icon re-hides the password', async () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showPassword).toBe(false)
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showPassword).toBe(true)
  }) */

  /* it('autocomplete can be customized via properties.field.autocomplete', () => { ... }) */
  /* it('fill sets the model value', () => { ... }) */
  /* it('clear resets model to null', () => { ... }) */
  /* it('values prop initializes the model', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('validate clears the error', () => { ... }) */
  /* it('values prop change updates the model reactively', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
})
