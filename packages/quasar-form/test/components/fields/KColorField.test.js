import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KColorField from '../../../src/components/KColorField.vue'

const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }
// Renders its slot only when modelValue (v-model) is true — simulates q-dialog open/close
const dialogStub = { template: '<div v-if="modelValue"><slot /></div>', props: ['modelValue'], emits: ['update:modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KColorField', () => {
  // q-field renders the control slot; q-dialog shows its slot only when open; q-color is the picker
  const stubs = { 'q-field': fieldStub, 'q-dialog': dialogStub, 'q-color': true }

  // Edit mode renders the color swatch div (not a text input).
  it('renders a colored div in edit mode (via control slot)', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('.k-color-field').exists()).toBe(true)
  })

  // color is bound to CSS via v-bind; empty model maps to 'transparent' so the swatch is invisible.
  it('color computed is transparent when model is empty', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.color).toBe('transparent')
  })

  it('color computed reflects model value for CSS v-bind', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#ff0000')
    expect(wrapper.vm.color).toBe('#ff0000')
  })

  // q-color is inside a q-dialog, so it only appears in the DOM when picker is true.
  it('color picker dialog shows when picker is set to true', async () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.picker = true
    await nextTick()
    expect(wrapper.find('q-color-stub').exists()).toBe(true)
  })

  // onReferenceCreated wires a native onclick on the swatch element to open the picker.
  it('onReferenceCreated attaches a click handler that opens the picker', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    const fakeEl = {}
    wrapper.vm.onReferenceCreated({ $el: fakeEl })
    expect(typeof fakeEl.onclick).toBe('function')
    fakeEl.onclick()
    expect(wrapper.vm.picker).toBe(true)
  })

  /*
  // readOnly also shows the swatch (same div, no picker).
  it('renders a colored div in readOnly mode', () => {
    const wrapper = mount(KColorField, { props: { ...makeProps(), readOnly: true, values: { test: '#ff0000' } }, global: { stubs } })
    expect(wrapper.find('.k-color-field').exists()).toBe(true)
  }) */

  /* it('initializes model to empty string when no default', () => { ... }) */
  /* it('initializes model to properties.default when defined', () => { ... }) */
  /* it('fill sets the model to a hex color', () => { ... }) */
  /* it('clear resets model to empty string', () => { ... }) */
  /* it('clear resets model to properties.default when defined', () => { ... }) */
  /* it('picker state starts as false', () => { ... }) */
  /* it('isClearable defaults to true', () => { ... }) */
  /* it('isClearable can be disabled via properties.field.clearable', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('validate clears the error', () => { ... }) */
  /* it('onChanged emits field-changed', () => { ... }) */
  /* it('values prop initializes the model', () => { ... }) */
  /* it('values prop change updates the model reactively', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
  /* it('onReferenceCreated with null ref does nothing (no throw)', () => { ... }) */
  /* it('isEmpty returns true when model is empty string', () => { ... }) */
  /* it('isEmpty returns false when model has a color', () => { ... }) */
  /* it('emptyModel returns empty string', () => { ... }) */
})
