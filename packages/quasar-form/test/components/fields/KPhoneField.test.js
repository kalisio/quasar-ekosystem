import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KPhoneField from '../../../src/components/KPhoneField.vue'

const inputStub = { template: '<input />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KPhoneField', () => {
  const stubs = { 'q-input': inputStub }

  // If there is an input when not in readOnly mode.
  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  // In readOnly mode, the phone number is a clickable tel: link.
  it('renders a tel link in readOnly mode', () => {
    const wrapper = mount(KPhoneField, { props: { ...makeProps(), readOnly: true, values: { test: '+33612345678' } }, global: { stubs } })
    expect(wrapper.find('a[href="tel:+33612345678"]').exists()).toBe(true)
  })

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: '+33699999999' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('+33699999999')
  })

  /* it('fill sets the model value', () => { ... }) */
  /* it('clear resets model to null', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('validate clears the error', () => { ... }) */
  /* it('onChanged emits field-changed', () => { ... }) */
  /* it('values prop initializes the model', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
})
