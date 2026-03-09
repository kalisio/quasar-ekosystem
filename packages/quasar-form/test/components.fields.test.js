import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import KEmailField from '../src/components/KEmailField.vue'
import KUrlField from '../src/components/KUrlField.vue'
import KToggleField from '../src/components/KToggleField.vue'
import KPasswordField from '../src/components/KPasswordField.vue'
import KSelectField from '../src/components/KSelectField.vue'
import KPhoneField from '../src/components/KPhoneField.vue'
import KOptionsField from '../src/components/KOptionsField.vue'

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))

const inputStub = { template: '<input />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }
const iconStub = { template: '<button @click="$emit(\'click\')" />', emits: ['click'] }
const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }
const toggleStub = { template: '<input type="checkbox" />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }
const selectStub = { template: '<select />', props: ['modelValue', 'options'], emits: ['update:modelValue', 'blur'] }
const optionGroupStub = { template: '<div><slot v-for="opt in options" name="label" :="opt" /></div>', props: ['modelValue', 'options'], emits: ['update:modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KEmailField', () => {
  const stubs = { 'q-input': inputStub }

  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders a mailto link in readOnly mode', () => {
    const wrapper = mount(KEmailField, { props: { ...makeProps(), readOnly: true, values: { test: 'user@example.com' } }, global: { stubs } })
    expect(wrapper.find('a[href="mailto:user@example.com"]').exists()).toBe(true)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('user@example.com')
    expect(wrapper.vm.value()).toBe('user@example.com')
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('user@example.com')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid email')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid email')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('user@example.com')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'user@example.com'])
  })
})

describe('KUrlField', () => {
  const stubs = { 'q-input': inputStub }

  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders a link in readOnly mode', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), readOnly: true, values: { test: 'https://example.com' } }, global: { stubs } })
    expect(wrapper.find('a[href="https://example.com"]').exists()).toBe(true)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('https://example.com')
    expect(wrapper.vm.value()).toBe('https://example.com')
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('https://example.com')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid url')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid url')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('https://example.com')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'https://example.com'])
  })
})

describe('KToggleField', () => {
  const stubs = { 'q-field': fieldStub, 'q-toggle': toggleStub, 'q-chip': true }

  it('renders a q-toggle in edit mode', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  it('renders a q-chip in readOnly mode', () => {
    const wrapper = mount(KToggleField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
  })

  it('initializes model to false', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toBe(false)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(true)
    expect(wrapper.vm.value()).toBe(true)
  })

  it('clear resets model to false', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(true)
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe(false)
  })

  it('emptyModel returns false', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe(false)
  })

  it('isEmpty always returns false', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(true)
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', true])
  })
})

describe('KPasswordField', () => {
  const inputWithAppendStub = { template: '<div><input /><slot name="append" /></div>', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }
  const stubs = { 'q-input': inputWithAppendStub, 'q-icon': iconStub }

  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('showPassword is true by default (password hidden)', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.showPassword).toBe(true)
  })

  it('clicking the icon toggles showPassword', async () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showPassword).toBe(false)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('secret123')
    expect(wrapper.vm.value()).toBe('secret123')
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('secret123')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('secret123')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'secret123'])
  })
})

describe('KSelectField', () => {
  const stubs = { 'q-select': selectStub, 'q-chip': true, 'q-item': true, 'q-item-section': true, 'q-item-label': true }
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
  ]

  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('options are computed from properties.field.options', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.options.length).toBe(2)
    expect(wrapper.vm.options[0].value).toBe('a')
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    expect(wrapper.vm.value()).toBe('a')
  })

  it('clear resets model to null for single-select', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('emptyModel returns [] for multiselect', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual([])
  })

  it('model initializes to [] for multiselect', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    expect(wrapper.vm.value()).toEqual([])
  })

  it('isEmpty checks array emptiness for multiselect', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
    wrapper.vm.fill(['a'])
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('b')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'b'])
  })
})

describe('KPhoneField', () => {
  const stubs = { 'q-input': inputStub }

  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders a tel link in readOnly mode', () => {
    const wrapper = mount(KPhoneField, { props: { ...makeProps(), readOnly: true, values: { test: '+33612345678' } }, global: { stubs } })
    expect(wrapper.find('a[href="tel:+33612345678"]').exists()).toBe(true)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('+33612345678')
    expect(wrapper.vm.value()).toBe('+33612345678')
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('+33612345678')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid phone')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid phone')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('+33612345678')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', '+33612345678'])
  })
})

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

  it('fill sets the model value', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    expect(wrapper.vm.value()).toBe('a')
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('b')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'b'])
  })
})
