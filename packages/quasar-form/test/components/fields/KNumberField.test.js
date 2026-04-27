import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'

import KNumberField from '../../../src/components/KNumberField.vue'

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

describe('KNumberField', () => {
  const stubs = { 'q-input': inputStub }

  // Edit mode renders a q-input (number type).
  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  // readOnly shows the numeric value as text.
  it('renders the number in readOnly mode', () => {
    const wrapper = mount(KNumberField, { props: { ...makeProps(), readOnly: true, values: { test: 42 } }, global: { stubs } })
    expect(wrapper.text()).toContain('42')
  })

  /* it('fill sets the model to a number', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(42)
    expect(wrapper.vm.value()).toBe(42)
  }) */

  /* it('clear resets model to null', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(42)
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBeNull()
  }) */

  /* it('isEmpty returns true when model is null', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  }) */

  // 0 is a valid value, so isEmpty must return false (not treat 0 as falsy).
  it('isEmpty returns false when model has a value', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(0)
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  /* it('invalidate sets hasError to true', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('out of range')
    expect(wrapper.vm.hasError).toBe(true)
  }) */

  /* it('validate clears the error', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('out of range')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  }) */

  /* it('onChanged emits field-changed', async () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(7)
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 7])
  }) */

  /* it('values prop initializes the model', () => {
    const wrapper = mount(KNumberField, { props: { ...makeProps(), values: { test: 99 } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe(99)
  }) */

  /* it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 55 } })
    await nextTick()
    expect(wrapper.vm.value()).toBe(55)
  }) */

  /* it('field.disabled disables the field', () => {
    const wrapper = mount(KNumberField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  }) */

  /* it('readOnly hides the input', () => {
    const wrapper = mount(KNumberField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  }) */

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(42)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe(42)
  }) */

  // When the input emits null (user cleared the field), model must become null not 0.
  it('onUpdated with a non-number value (null) sets model to null', async () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(42)
    await wrapper.findComponent(inputStub).vm.$emit('update:modelValue', null)
    await nextTick()
    expect(wrapper.vm.value()).toBeNull()
  })

  // When the input emits 0, model must be 0 (not null — 0 is a valid number).
  it('onUpdated with 0 keeps model as 0 (not null)', async () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    await wrapper.findComponent(inputStub).vm.$emit('update:modelValue', 0)
    await nextTick()
    expect(wrapper.vm.value()).toBe(0)
  })

  // When the input emits a number, field-changed should be emitted immediately (not only on blur).
  it('onUpdated with a number emits field-changed', async () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    await wrapper.findComponent(inputStub).vm.$emit('update:modelValue', 7)
    await nextTick()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed').at(-1)).toEqual(['test', 7])
  })
})
