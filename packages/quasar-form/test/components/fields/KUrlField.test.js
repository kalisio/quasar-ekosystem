import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KUrlField from '../../../src/components/KUrlField.vue'

const inputStub = { template: '<input />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KUrlField', () => {
  const stubs = { 'q-input': inputStub }

  // If there is an input when not in readOnly mode.
  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  // If there is a clickable link in readOnly mode.
  it('renders a link in readOnly mode', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), readOnly: true, values: { test: 'https://example.com' } }, global: { stubs } })
    expect(wrapper.find('a[href="https://example.com"]').exists()).toBe(true)
  })

  // The link must open in a new tab.
  it('readOnly link opens in a new tab (target=_blank)', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), readOnly: true, values: { test: 'https://example.com' } }, global: { stubs } })
    expect(wrapper.find('a').attributes('target')).toBe('_blank')
  })

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 'https://reactive.example.com' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('https://reactive.example.com')
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
