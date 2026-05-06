import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KOptionsField from '../../../src/components/KOptionsField.vue'

const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }
const optionGroupStub = { template: '<div><slot v-for="opt in options" name="label" :="opt" /></div>', props: ['modelValue', 'options'], emits: ['update:modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KOptionsField', () => {
  const stubs = { 'q-field': fieldStub, 'q-option-group': optionGroupStub, 'q-chip': true }
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
  ]

  it('renders a q-option-group in edit mode', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('renders a q-chip in readOnly mode', () => {
    const wrapper = mount(KOptionsField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
  })

  it('options are computed from properties.field.options', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.options().length).toBe(2)
    expect(wrapper.vm.options()[0].value).toBe('a')
  })

  // field.selectedClass overrides the default CSS class for the selected option label.
  it('selectedClass can be customized via properties', async () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options, selectedClass: 'text-bold' } }), global: { stubs } })
    wrapper.vm.fill('a')
    await nextTick()
    const spans = wrapper.findAll('span')
    expect(spans[0].classes()).toContain('text-bold')
    expect(spans[1].classes()).toContain('text-weight-regular')
  })

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    await wrapper.setProps({ values: { test: 'a' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('a')
  })

  it('options returns empty array when no options defined', () => {
    const wrapper = mount(KOptionsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.options()).toEqual([])
  })

  it('selectedClass returns text-weight-regular by default', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-weight-regular')
  })

  it('selectedClass returns custom class when set in properties', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options, selectedClass: 'text-bold' } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-bold')
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('b')
    expect(wrapper.vm.value()).toBe('b')
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('apply writes model value to a target object', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('a')
  })
})
