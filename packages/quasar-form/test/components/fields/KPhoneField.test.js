import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'

import KPhoneField from '../../../src/components/KPhoneField.vue'

config.global.mocks = {
  $t: (key) => key,
  $q: {
    iconSet: { editor: { align: 'format_align_left' } },
    lang: { editor: { align: 'Align' } },
    screen: {}
  }
}

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))

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

  /* it('fill sets the model value', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('+33612345678')
    expect(wrapper.vm.value()).toBe('+33612345678')
  }) */

  // Check if the field is empty after clearing.
  it('clear resets model to null', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('+33612345678')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  // If the phone is invalid, hasError should be set to true.
  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid phone')
    expect(wrapper.vm.hasError).toBe(true)
  })

  // After invalidating, validate should clear the error.
  it('validate clears the error', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid phone')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  // Check that field-changed is emitted with the phone value.
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('+33612345678')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', '+33612345678'])
  })

  /* it('label is read from properties.field.label', () => {
    const wrapper = mount(KPhoneField, { props: makeProps({ field: { label: 'Phone number' } }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Phone number')
  }) */

  // If values prop is provided on mount, the model should be initialized with the matching value.
  it('values prop initializes the model', () => {
    const wrapper = mount(KPhoneField, { props: { ...makeProps(), values: { test: '+33600000000' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('+33600000000')
  })

  /* it('field.disabled disables the field', () => {
    const wrapper = mount(KPhoneField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  }) */

  /* it('readOnly hides the input', () => {
    const wrapper = mount(KPhoneField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  }) */

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: '+33699999999' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('+33699999999')
  })

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('+33612345678')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('+33612345678')
  }) */
})
