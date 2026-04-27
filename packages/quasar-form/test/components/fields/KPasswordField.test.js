import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
// import { nextTick } from 'vue'

import KPasswordField from '../../../src/components/KPasswordField.vue'

config.global.mocks = {
  $t: (key) => key,
  $q: {
    iconSet: { editor: { align: 'format_align_left' } },
    lang: { editor: { align: 'Align' } },
    screen: {}
  }
}

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))

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

  // Clicking twice should hide it again.
  it('double-clicking icon re-hides the password', async () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showPassword).toBe(false)
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showPassword).toBe(true)
  })

  /* it('fill sets the model value', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('secret123')
    expect(wrapper.vm.value()).toBe('secret123')
  }) */

  /* it('clear resets model to null', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('secret123')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  }) */

  // Check that field-changed is emitted with the password value.
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('secret123')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'secret123'])
  })

  /* it('values prop initializes the model', () => {
    const wrapper = mount(KPasswordField, { props: { ...makeProps(), values: { test: 'mypassword' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('mypassword')
  }) */

  /* it('invalidate sets hasError to true', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('too short')
    expect(wrapper.vm.hasError).toBe(true)
  }) */

  /* it('validate clears the error', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('too short')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  }) */

  /* it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 'newpass' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('newpass')
  }) */

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('secret123')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('secret123')
  }) */

  // Autocomplete defaults to "on" to help password managers.
  it('autocomplete defaults to "on"', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.autocomplete).toBe('on')
  })

  // Autocomplete can be set to "new-password" to prevent autofill on registration forms.
  it('autocomplete can be customized via properties.field.autocomplete', () => {
    const wrapper = mount(KPasswordField, { props: makeProps({ field: { autocomplete: 'new-password' } }), global: { stubs } })
    expect(wrapper.vm.autocomplete).toBe('new-password')
  })
})
