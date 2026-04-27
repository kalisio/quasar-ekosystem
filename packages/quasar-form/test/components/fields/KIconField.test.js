import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KIconField from '../../../src/components/KIconField.vue'

const inputStub = { template: '<input />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }
const iconStub = { template: '<button @click="$emit(\'click\')" />', emits: ['click'] }
// Renders its slot only when modelValue (v-model) is true — simulates q-dialog open/close
const dialogStub = { template: '<div v-if="modelValue"><slot /></div>', props: ['modelValue'], emits: ['update:modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KIconField', () => {
  // Renders both prepend and control slots so the q-btn inside prepend is accessible
  const iconFieldFieldStub = { template: '<div><slot name="prepend" /><slot name="control" /><slot name="default" /></div>', props: ['modelValue'] }
  const stubs = { 'q-field': iconFieldFieldStub, 'q-btn': iconStub, 'q-dialog': dialogStub, 'q-card': true, 'q-card-section': true, 'q-card-actions': true, 'q-input': inputStub, 'q-icon': true }

  // In readOnly mode with a model, a q-icon is rendered
  it('renders a q-icon in readOnly mode when model is set', () => {
    const wrapper = mount(KIconField, { props: { ...makeProps(), readOnly: true, values: { test: { name: 'star', color: 'yellow' } } }, global: { stubs } })
    expect(wrapper.find('q-icon-stub').exists()).toBe(true)
  })

  // emptyModel shape differs depending on whether color is enabled
  it('emptyModel returns {name, color} when hasColor is true (default)', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual({ name: '', color: '' })
  })

  it('emptyModel returns empty string when field.color is false', () => {
    const wrapper = mount(KIconField, { props: makeProps({ field: { color: false } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe('')
  })

  // iconName extracts the name from either an object or a plain string model
  it('iconName computed returns name from object model', () => {
    const wrapper = mount(KIconField, { props: { ...makeProps(), values: { test: { name: 'home', color: 'blue' } } }, global: { stubs } })
    expect(wrapper.vm.iconName).toBe('home')
  })

  // iconColor is derived from the model object
  it('iconColor reads color from model object', () => {
    const wrapper = mount(KIconField, { props: { ...makeProps(), values: { test: { name: 'star', color: 'red' } } }, global: { stubs } })
    expect(wrapper.vm.iconColor).toBe('red')
  })

  // onCleared resets to emptyModel and emits field-changed in one step
  it('onCleared resets model and emits field-changed', async () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'star', color: 'red' })
    await wrapper.vm.onCleared()
    expect(wrapper.vm.isEmpty()).toBe(true)
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  // If values prop changes after mount, the model should update reactively
  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    const icon = { name: 'search', color: 'green' }
    await wrapper.setProps({ values: { test: icon } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(icon)
  })

  /* it('renders a q-field in edit mode', () => { ... }) */
  /* it('isEmpty returns true when icon name is empty', () => { ... }) */
  /* it('isEmpty returns false after fill with icon object', () => { ... }) */
  /* it('iconName computed returns string model directly', () => { ... }) */
  /* it('iconColor returns empty string when model has no color set', () => { ... }) */
  /* it('isClearable defaults to true', () => { ... }) */
  /* it('isClearable respects field.clearable', () => { ... }) */
  /* it('fill sets the model', () => { ... }) */
  /* it('clear resets model to emptyModel', () => { ... }) */
  /* it('values prop initializes model', () => { ... }) */
  /* it('invalidate sets hasError', () => { ... }) */
  /* it('validate clears error', () => { ... }) */
  /* it('apply writes model to object', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
})
