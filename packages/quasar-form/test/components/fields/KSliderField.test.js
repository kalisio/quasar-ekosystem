import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KSliderField from '../../../src/components/KSliderField.vue'

const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KSliderField', () => {
  const sliderStub = { template: '<input type="range" />', props: ['modelValue', 'min', 'max', 'step'], emits: ['update:modelValue', 'change'] }
  const stubs = { 'q-field': fieldStub, 'q-slider': sliderStub }

  // Edit mode renders a q-slider (stubbed as range input).
  it('renders a slider in edit mode', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="range"]').exists()).toBe(true)
  })

  // readOnly shows the numeric value as text.
  it('renders the numeric value in readOnly mode', () => {
    const wrapper = mount(KSliderField, { props: { ...makeProps(), readOnly: true, values: { test: 42 } }, global: { stubs } })
    expect(wrapper.text()).toContain('42')
  })

  // emptyModel is the min value (0 by default), so the slider starts at the left.
  it('initializes model to min (0) when no value is set', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toBe(0)
  })

  // min/max/step are forwarded to q-slider from field properties.
  it('min/max/step are read from properties.field', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ field: { min: 10, max: 50, step: 5 } }), global: { stubs } })
    expect(wrapper.vm.min).toBe(10)
    expect(wrapper.vm.max).toBe(50)
    expect(wrapper.vm.step).toBe(5)
  })

  // emptyModel returns field.min, not 0, to stay consistent with the slider range.
  it('emptyModel returns the min value', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ field: { min: 5 } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe(5)
  })

  // Slider uses the @change event (not @update:modelValue) to avoid spamming field-changed during drag.
  it('slider change event emits field-changed', async () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(50)
    await wrapper.findComponent(sliderStub).vm.$emit('change')
    await nextTick()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed').at(-1)).toEqual(['test', 50])
  })

  /* it('initializes model to custom min when defined', () => { ... }) */
  /* it('fill sets the model value', () => { ... }) */
  /* it('clear resets model to min', () => { ... }) */
  /* it('clear resets model to properties.default when defined', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('validate clears the error', () => { ... }) */
  /* it('onChanged emits field-changed', () => { ... }) */
  /* it('values prop initializes the model', () => { ... }) */
  /* it('values prop change updates the model reactively', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
  /* it('isEmpty returns false (slider always has a value)', () => { ... }) */
  /* it('markers defaults to false', () => { ... }) */
  /* it('markers is read from properties.field.markers', () => { ... }) */
})
