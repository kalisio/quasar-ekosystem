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

  it('isEmpty returns true when model is empty', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false after fill', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#abc123')
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('clear resets model to empty string', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#ff0000')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('clear resets to properties.default when set', () => {
    const wrapper = mount(KColorField, { props: makeProps({ default: '#000000' }), global: { stubs } })
    wrapper.vm.fill('#ff0000')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('#000000')
  })

  it('isClearable defaults to true', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(true)
  })

  it('isClearable respects field.clearable', () => {
    const wrapper = mount(KColorField, { props: makeProps({ field: { clearable: false } }), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(false)
  })

  it('onReferenceCreated with null ref does not throw', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(() => wrapper.vm.onReferenceCreated(null)).not.toThrow()
  })

  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: '#336699' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('#336699')
  })

  it('apply writes model value to a target object', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#00ff00')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('#00ff00')
  })
})
