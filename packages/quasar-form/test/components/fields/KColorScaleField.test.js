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

  it('getOptions returns field.options array', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    expect(wrapper.vm.getOptions()).toHaveLength(2)
  })

  it('getOptions returns [] when not defined', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getOptions()).toEqual([])
  })

  it('isClearable defaults to true', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(true)
  })

  it('isClearable respects field.clearable', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { clearable: false } }), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(false)
  })

  it('getId returns kebab-cased label', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getId({ label: 'Red Scale' })).toBe('red-scale')
  })

  it('getLabel returns empty string when value not found in options', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    expect(wrapper.vm.getLabel({ colors: ['#000'] })).toBe('')
  })

  it('getScaleStyle returns empty object for null value', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getScaleStyle(null)).toEqual({})
  })

  it('getScaleStyle returns empty object when colors array is empty', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getScaleStyle({ colors: [] })).toEqual({})
  })

  it('getScaleStyle supports scale key as fallback to colors', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    const style = wrapper.vm.getScaleStyle({ scale: ['#fee', '#f00'] })
    expect(style.background).toMatch(/linear-gradient/)
  })

  it('fill sets model and clear resets it to null', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    wrapper.vm.fill(colorScaleOptions[0].value)
    expect(wrapper.vm.value()).toEqual(colorScaleOptions[0].value)
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('apply writes model to a target object', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(colorScaleOptions[0].value)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual(colorScaleOptions[0].value)
  })
})
