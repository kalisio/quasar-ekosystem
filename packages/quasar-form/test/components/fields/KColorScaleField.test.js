import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KColorScaleField from '../../../src/components/KColorScaleField.vue'

const selectStub = { template: '<select />', props: ['modelValue', 'options'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KColorScaleField', () => {
  const stubs = { 'q-select': selectStub, 'q-item': true, 'q-item-section': true, 'q-item-label': true }

  const colorScaleOptions = [
    { label: 'Reds', value: { colors: ['#fee', '#f00'] } },
    { label: 'Blues', value: { colors: ['#eef', '#00f'] } }
  ]

  // If there is a q-select in edit mode
  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    expect(wrapper.find('select').exists()).toBe(true)
  })

  // In readOnly mode the selected scale label is rendered as text
  it('renders text in readOnly mode when model is set', () => {
    const wrapper = mount(KColorScaleField, {
      props: { ...makeProps({ field: { options: colorScaleOptions } }), readOnly: true, values: { test: colorScaleOptions[0].value } },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('Reds')
  })

  // getLabel looks up the option label by matching the full value object
  it('getLabel finds matching option label by value', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    expect(wrapper.vm.getLabel(colorScaleOptions[0].value)).toBe('Reds')
  })

  // getScaleStyle produces the CSS gradient background used in the option preview
  it('getScaleStyle returns background gradient for colors array', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    const style = wrapper.vm.getScaleStyle({ colors: ['#fee', '#f00'] })
    expect(style.background).toMatch(/linear-gradient/)
  })

  // If values prop changes after mount, the model should update reactively
  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    await wrapper.setProps({ values: { test: colorScaleOptions[0].value } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(colorScaleOptions[0].value)
  })

  /* it('options computed from field.options', () => { ... }) */
  /* it('options defaults to [] when not defined', () => { ... }) */
  /* it('isClearable defaults to true', () => { ... }) */
  /* it('isClearable respects field.clearable', () => { ... }) */
  /* it('getId returns kebab-cased label', () => { ... }) */
  /* it('getLabel returns empty string when value not found', () => { ... }) */
  /* it('getScaleStyle returns empty object for null value', () => { ... }) */
  /* it('getScaleStyle returns empty object when no colors', () => { ... }) */
  /* it('onChanged emits field-changed', () => { ... }) */
  /* it('fill sets model', () => { ... }) */
  /* it('clear resets model to null', () => { ... }) */
  /* it('values prop initializes model', () => { ... }) */
  /* it('invalidate sets hasError', () => { ... }) */
  /* it('validate clears error', () => { ... }) */
  /* it('apply writes model to object', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
})
