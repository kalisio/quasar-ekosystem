import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
// import { nextTick } from 'vue'

import KTextField from '../../../src/components/KTextField.vue'

const inputStub = { template: '<input />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KTextField', () => {
  const stubs = { 'q-input': inputStub }

  // Edit mode renders a q-input (text).
  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  // readOnly shows the text value as plain text.
  it('renders text content in readOnly mode', () => {
    const wrapper = mount(KTextField, { props: { ...makeProps(), readOnly: true, values: { test: 'hello world' } }, global: { stubs } })
    expect(wrapper.text()).toContain('hello world')
  })

  // readOnly auto-detects URLs and renders them as clickable <a> links.
  it('renders a clickable link in readOnly mode when model is a URL', () => {
    const wrapper = mount(KTextField, { props: { ...makeProps(), readOnly: true, values: { test: 'https://example.com' } }, global: { stubs } })
    expect(wrapper.find('a[href="https://example.com"]').exists()).toBe(true)
  })

  /* it('fill sets the model value', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('hello')
    expect(wrapper.vm.value()).toBe('hello')
  }) */

  /* it('clear resets model to null', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('hello')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  }) */

  /* it('invalidate sets hasError to true', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('too short')
    expect(wrapper.vm.hasError).toBe(true)
  }) */

  /* it('validate clears the error', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('too short')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  }) */

  // Check that field-changed is emitted with the text value.
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('hello')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'hello'])
  })

  /* it('label is read from properties.field.label', () => {
    const wrapper = mount(KTextField, { props: makeProps({ field: { label: 'Full name' } }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Full name')
  }) */

  /* it('values prop initializes the model', () => {
    const wrapper = mount(KTextField, { props: { ...makeProps(), values: { test: 'init value' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('init value')
  }) */

  /* it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 'updated value' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('updated value')
  }) */

  /* it('field.disabled disables the field', () => {
    const wrapper = mount(KTextField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  }) */

  /* it('readOnly hides the input', () => {
    const wrapper = mount(KTextField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  }) */

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('hello')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('hello')
  }) */
})
