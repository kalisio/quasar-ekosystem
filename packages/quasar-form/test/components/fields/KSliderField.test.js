import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'

import KSliderField from '../../../src/components/KSliderField.vue'

config.global.mocks = {
  $t: (key) => key,
  $q: {
    iconSet: { editor: { align: 'format_align_left' } },
    lang: { editor: { align: 'Align' } },
    screen: {}
  }
}

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))

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

  // emptyModel uses field.min, so the initial value matches the slider minimum.
  it('initializes model to custom min when defined', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ field: { min: 20 } }), global: { stubs } })
    expect(wrapper.vm.value()).toBe(20)
  })

  /* it('fill sets the model value', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(75)
    expect(wrapper.vm.value()).toBe(75)
  }) */

  // clear() resets to min (emptyModel), not 0 if min is different.
  it('clear resets model to min', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(75)
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe(0)
  })

  // clear() uses properties.default if defined, instead of emptyModel.
  it('clear resets model to properties.default when defined', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ default: 50 }), global: { stubs } })
    wrapper.vm.fill(90)
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe(50)
  })

  /* it('invalidate sets hasError to true', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('out of range')
    expect(wrapper.vm.hasError).toBe(true)
  }) */

  /* it('validate clears the error', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('out of range')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  }) */

  /* it('onChanged emits field-changed', async () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(30)
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 30])
  }) */

  /* it('values prop initializes the model', () => {
    const wrapper = mount(KSliderField, { props: { ...makeProps(), values: { test: 60 } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe(60)
  }) */

  /* it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 80 } })
    await nextTick()
    expect(wrapper.vm.value()).toBe(80)
  }) */

  /* it('field.disabled disables the field', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  }) */

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(42)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe(42)
  }) */

  // emptyModel returns field.min, not 0, to stay consistent with the slider range.
  it('emptyModel returns the min value', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ field: { min: 5 } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe(5)
  })

  // A slider always has a numeric value, so isEmpty is always false.
  it('isEmpty returns false (slider always has a value)', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  // markers is forwarded to q-slider; false by default.
  it('markers defaults to false', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.markers).toBe(false)
  })

  it('markers is read from properties.field.markers', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ field: { markers: true } }), global: { stubs } })
    expect(wrapper.vm.markers).toBe(true)
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
})
