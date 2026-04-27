import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'

import KTextareaField from '../../../src/components/KTextareaField.vue'

config.global.mocks = {
  $t: (key) => key,
  $q: {
    iconSet: { editor: { align: 'format_align_left' } },
    lang: { editor: { align: 'Align' } },
    screen: {}
  }
}

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))

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
  it('model initializes to empty string (KDK emptyModel behavior)', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toBe('')
  })

  it('emptyModel returns empty string', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe('')
  })

  it('isEmpty returns true for empty string', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  /* it('isEmpty returns false for non-empty string (not null)', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
    wrapper.vm.fill('hello')
    expect(wrapper.vm.isEmpty()).toBe(false)
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  }) */

  /* it('isEmpty returns false when filled', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('some text')
    expect(wrapper.vm.isEmpty()).toBe(false)
  }) */

  /* it('fill sets the model value', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('some text')
    expect(wrapper.vm.value()).toBe('some text')
  }) */

  // clear() resets to '' (not null), matching emptyModel.
  it('clear resets model to empty string', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('some text')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('')
  })

  // clear() uses properties.default if defined, instead of emptyModel.
  it('clear uses default value from properties', () => {
    const wrapper = mount(KTextareaField, { props: makeProps({ default: 'default text' }), global: { stubs } })
    wrapper.vm.fill('other text')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('default text')
  })

  // If values prop is provided on mount, the model should be initialized with the matching value.
  it('values prop initializes the model', () => {
    const wrapper = mount(KTextareaField, { props: { ...makeProps(), values: { test: 'init text' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('init text')
  })

  /* it('label is read from properties.field.label', () => {
    const wrapper = mount(KTextareaField, { props: makeProps({ field: { label: 'Description' } }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Description')
  }) */

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  // Check that field-changed is emitted with the textarea content.
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('some text')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'some text'])
  })

  /* it('readOnly hides the input', () => {
    const wrapper = mount(KTextareaField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  }) */

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 'reactive text' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('reactive text')
  })

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('some text')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('some text')
  }) */

  /* it('field.disabled disables the field', () => {
    const wrapper = mount(KTextareaField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  }) */
})
