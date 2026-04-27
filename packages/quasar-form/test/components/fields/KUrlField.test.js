import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'

import KUrlField from '../../../src/components/KUrlField.vue'

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

describe('KUrlField', () => {
  const stubs = { 'q-input': inputStub }

  // If there is an input when not in readOnly mode.
  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  // If there is a clickable link in readOnly mode.
  it('renders a link in readOnly mode', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), readOnly: true, values: { test: 'https://example.com' } }, global: { stubs } })
    expect(wrapper.find('a[href="https://example.com"]').exists()).toBe(true)
  })

  /* it('readOnly link href is bound to model value (not a static string)', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), readOnly: true, values: { test: 'https://dynamic.url' } }, global: { stubs } })
    expect(wrapper.find('a[href="https://dynamic.url"]').exists()).toBe(true)
  }) */

  // The link must open in a new tab.
  it('readOnly link opens in a new tab (target=_blank)', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), readOnly: true, values: { test: 'https://example.com' } }, global: { stubs } })
    expect(wrapper.find('a').attributes('target')).toBe('_blank')
  })

  /* it('fill sets the model value', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('https://example.com')
    expect(wrapper.vm.value()).toBe('https://example.com')
  }) */

  // Check if the field is empty after clearing.
  it('clear resets model to null', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('https://example.com')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  // If the url is invalid, hasError should be set to true.
  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid url')
    expect(wrapper.vm.hasError).toBe(true)
  })

  // After invalidating, validate should clear the error.
  it('validate clears the error', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid url')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  // Check that field-changed is emitted with the field name and value when onChanged is called.
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('https://example.com')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'https://example.com'])
  })

  /* it('label is read from properties.field.label', () => {
    const wrapper = mount(KUrlField, { props: makeProps({ field: { label: 'Website' } }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Website')
  }) */

  // If values prop is provided on mount, the model should be initialized with the matching value.
  it('values prop initializes the model', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), values: { test: 'https://init.example.com' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('https://init.example.com')
  })

  /* it('field.disabled disables the field', () => {
    const wrapper = mount(KUrlField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  }) */

  /* it('readOnly hides the input', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  }) */

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 'https://reactive.example.com' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('https://reactive.example.com')
  })

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('https://example.com')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('https://example.com')
  }) */
})
