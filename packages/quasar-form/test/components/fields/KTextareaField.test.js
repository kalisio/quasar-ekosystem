import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KTextareaField from '../../../src/components/KTextareaField.vue'

const inputStub = { template: '<input />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KTextareaField', () => {
  const defaultSlotFieldStub = { template: '<div><slot /></div>', props: ['modelValue'] }
  const editorStub = { template: '<input />', props: ['modelValue', 'definitions', 'toolbar', 'contentStyle', 'contentClass', 'minHeight', 'maxHeight', 'dense'], emits: ['update:modelValue'] }
  const stubs = { 'q-field': defaultSlotFieldStub, 'q-input': inputStub, 'q-editor': editorStub }

  // Edit mode renders q-editor (stubbed as input here).
  it('renders a textarea in edit mode', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  // readOnly mode shows the raw text content, not an editor.
  it('renders text content in readOnly mode', () => {
    const wrapper = mount(KTextareaField, { props: { ...makeProps(), readOnly: true, values: { test: 'hello world' } }, global: { stubs } })
    expect(wrapper.find('div').text()).toBe('hello world')
  })

  // Unlike most fields, emptyModel is '' (empty string), not null.
  it('emptyModel returns empty string', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe('')
  })

  // clear() resets to '' (not null), matching emptyModel.
  it('clear resets model to empty string', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('some text')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('')
  })

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 'reactive text' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('reactive text')
  })

  /* it('model initializes to empty string (KDK emptyModel behavior)', () => { ... }) */
  /* it('isEmpty returns true for empty string', () => { ... }) */
  /* it('clear uses default value from properties', () => { ... }) */
  /* it('values prop initializes the model', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('validate clears the error', () => { ... }) */
  /* it('onChanged emits field-changed', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
})
