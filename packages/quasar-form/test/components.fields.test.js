import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KEmailField from '../src/components/KEmailField.vue'
import KUrlField from '../src/components/KUrlField.vue'
import KToggleField from '../src/components/KToggleField.vue'
import KPasswordField from '../src/components/KPasswordField.vue'
import KSelectField from '../src/components/KSelectField.vue'
import KPhoneField from '../src/components/KPhoneField.vue'
import KOptionsField from '../src/components/KOptionsField.vue'
import KTextareaField from '../src/components/KTextareaField.vue'
import KDatetimeField from '../src/components/KDatetimeField.vue'
import KDateField from '../src/components/KDateField.vue'

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

  it('label is read from properties.field.label', () => {
    const wrapper = mount(KEmailField, { props: makeProps({ field: { label: 'Email address' } }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Email address')
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KEmailField, { props: { ...makeProps(), values: { test: 'init@example.com' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('init@example.com')
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KEmailField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('readOnly hides the input', () => {
    const wrapper = mount(KEmailField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toBeNull()
    await wrapper.setProps({ values: { test: 'updated@example.com' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('updated@example.com')
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KEmailField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('user@example.com')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('user@example.com')
  })

  it('errorLabel uses field.errorLabel override', () => {
    const wrapper = mount(KEmailField, { props: makeProps({ field: { errorLabel: 'Invalid email format' } }), global: { stubs } })
    expect(wrapper.vm.errorLabel).toBe('Invalid email format')
  })

  it('label falls back to properties.description', () => {
    const wrapper = mount(KEmailField, { props: makeProps({ description: 'Your email', field: {} }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Your email')
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

  it('label is read from properties.field.label', () => {
    const wrapper = mount(KUrlField, { props: makeProps({ field: { label: 'Website' } }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Website')
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), values: { test: 'https://init.example.com' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('https://init.example.com')
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KUrlField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('readOnly hides the input', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 'https://reactive.example.com' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('https://reactive.example.com')
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KUrlField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('https://example.com')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('https://example.com')
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

  it('values prop initializes model to true', () => {
    const wrapper = mount(KToggleField, { props: { ...makeProps(), values: { test: true } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe(true)
  })

  it('clear uses default value from properties', () => {
    const wrapper = mount(KToggleField, { props: makeProps({ default: true }), global: { stubs } })
    wrapper.vm.fill(false)
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe(true)
  })

  it('readOnly shows check icon and positive color when model is true', () => {
    const wrapper = mount(KToggleField, { props: { ...makeProps(), readOnly: true, values: { test: true } }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').attributes('icon')).toBe('las la-check')
    expect(wrapper.find('q-chip-stub').attributes('color')).toBe('positive')
  })

  it('readOnly shows ban icon and negative color when model is false', () => {
    const wrapper = mount(KToggleField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').attributes('icon')).toBe('las la-ban')
    expect(wrapper.find('q-chip-stub').attributes('color')).toBe('negative')
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: true } })
    await nextTick()
    expect(wrapper.vm.value()).toBe(true)
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(true)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe(true)
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

  it('values prop initializes the model', () => {
    const wrapper = mount(KPasswordField, { props: { ...makeProps(), values: { test: 'mypassword' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('mypassword')
  })

  it('double-clicking icon re-hides the password', async () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showPassword).toBe(false)
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showPassword).toBe(true)
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('too short')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('too short')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 'newpass' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('newpass')
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('secret123')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('secret123')
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

  it('readOnly hides the select', () => {
    const wrapper = mount(KSelectField, { props: { ...makeProps({ field: { options } }), readOnly: true }, global: { stubs } })
    expect(wrapper.find('select').exists()).toBe(false)
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
  })

  it('dense prop is forwarded to q-select', () => {
    const denseStub = { template: '<select :data-dense="String(dense)" />', props: ['modelValue', 'options', 'dense'], emits: ['update:modelValue', 'blur', 'filter'] }
    const wrapper = mount(KSelectField, {
      props: { ...makeProps({ field: { options } }), dense: true },
      global: { stubs: { ...stubs, 'q-select': denseStub } }
    })
    expect(wrapper.find('[data-dense="true"]').exists()).toBe(true)
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KSelectField, { props: { ...makeProps({ field: { options } }), values: { test: 'a' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('a')
  })

  it('clear resets model to [] for multiselect', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    wrapper.vm.fill(['a', 'b'])
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toEqual([])
  })

  it('auto-fills when required is true and only one option exists', async () => {
    const singleOption = [{ label: 'Only Option', value: 'only' }]
    const wrapper = mount(KSelectField, {
      props: { ...makeProps({ field: { options: singleOption } }), required: true },
      global: { stubs }
    })
    await nextTick()
    expect(wrapper.vm.value()).toBe('only')
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    await wrapper.setProps({ values: { test: 'b' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('b')
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('a')
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

  it('label is read from properties.field.label', () => {
    const wrapper = mount(KPhoneField, { props: makeProps({ field: { label: 'Phone number' } }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Phone number')
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KPhoneField, { props: { ...makeProps(), values: { test: '+33600000000' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('+33600000000')
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KPhoneField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('readOnly hides the input', () => {
    const wrapper = mount(KPhoneField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: '+33699999999' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('+33699999999')
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KPhoneField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('+33612345678')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('+33612345678')
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

  it('options returns empty array when no options defined', () => {
    const wrapper = mount(KOptionsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.options()).toEqual([])
  })

  it('options labels are translated via i18n', () => {
    const translatedOptions = [{ label: 'some.translation.key', value: 'a' }]
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options: translatedOptions } }), global: { stubs } })
    expect(wrapper.vm.options()[0].label).toBe('some.translation.key')
  })

  it('selectedClass is text-weight-regular by default', async () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    await nextTick()
    const spans = wrapper.findAll('span')
    expect(spans[0].classes()).toContain('text-weight-regular')
  })

  it('selectedClass can be customized via properties', async () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options, selectedClass: 'text-bold' } }), global: { stubs } })
    wrapper.vm.fill('a')
    await nextTick()
    const spans = wrapper.findAll('span')
    expect(spans[0].classes()).toContain('text-bold')
    expect(spans[1].classes()).toContain('text-weight-regular')
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KOptionsField, { props: { ...makeProps({ field: { options } }), values: { test: 'b' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('b')
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    await wrapper.setProps({ values: { test: 'a' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('a')
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('a')
  })
})

describe('KTextareaField', () => {
  const stubs = { 'q-field': fieldStub, 'q-input': inputStub }

  it('renders a textarea in edit mode', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders text content in readOnly mode', () => {
    const wrapper = mount(KTextareaField, { props: { ...makeProps(), readOnly: true, values: { test: 'hello world' } }, global: { stubs } })
    expect(wrapper.find('div').text()).toBe('hello world')
  })

  it('emptyModel returns empty string', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe('')
  })

  it('isEmpty returns true for empty string', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false when filled', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('some text')
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('some text')
    expect(wrapper.vm.value()).toBe('some text')
  })

  it('clear resets model to empty string', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('some text')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('')
  })

  it('clear uses default value from properties', () => {
    const wrapper = mount(KTextareaField, { props: makeProps({ default: 'default text' }), global: { stubs } })
    wrapper.vm.fill('other text')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('default text')
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KTextareaField, { props: { ...makeProps(), values: { test: 'init text' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('init text')
  })

  it('label is read from properties.field.label', () => {
    const wrapper = mount(KTextareaField, { props: makeProps({ field: { label: 'Description' } }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Description')
  })

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

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('some text')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'some text'])
  })

  it('readOnly hides the input', () => {
    const wrapper = mount(KTextareaField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 'reactive text' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('reactive text')
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('some text')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('some text')
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KTextareaField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })
})

describe('KDatetimeField', () => {
  const stubs = { 'q-field': fieldStub }

  it('renders a datetime-local input in edit mode', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="datetime-local"]').exists()).toBe(true)
  })

  it('renders the model value in readOnly mode', () => {
    const isoDate = '2024-06-15T10:30:00.000Z'
    const wrapper = mount(KDatetimeField, { props: { ...makeProps(), readOnly: true, values: { test: isoDate } }, global: { stubs } })
    expect(wrapper.find('div').text()).toBe(isoDate)
  })

  it('initializes model to current datetime when no values provided', () => {
    const before = Date.now()
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    const after = Date.now()
    const modelTime = new Date(wrapper.vm.value()).getTime()
    expect(modelTime).toBeGreaterThanOrEqual(before)
    expect(modelTime).toBeLessThanOrEqual(after)
  })

  it('emptyModel returns an ISO date string', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('isEmpty always returns false', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024-01-01T00:00:00.000Z')
    expect(wrapper.vm.value()).toBe('2024-01-01T00:00:00.000Z')
  })

  it('clear resets to emptyModel (current datetime)', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2020-01-01T00:00:00.000Z')
    const before = Date.now()
    wrapper.vm.clear()
    const after = Date.now()
    const modelTime = new Date(wrapper.vm.value()).getTime()
    expect(modelTime).toBeGreaterThanOrEqual(before)
    expect(modelTime).toBeLessThanOrEqual(after)
  })

  it('values prop initializes the model', () => {
    const isoDate = '2024-03-15T12:00:00.000Z'
    const wrapper = mount(KDatetimeField, { props: { ...makeProps(), values: { test: isoDate } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe(isoDate)
  })

  it('field.defaultOffset shifts emptyModel by seconds', () => {
    const offset = 3600 // +1 hour
    const before = Date.now() + offset * 1000
    const wrapper = mount(KDatetimeField, { props: makeProps({ field: { defaultOffset: offset } }), global: { stubs } })
    const after = Date.now() + offset * 1000
    const modelTime = new Date(wrapper.vm.emptyModel()).getTime()
    expect(modelTime).toBeGreaterThanOrEqual(before)
    expect(modelTime).toBeLessThanOrEqual(after)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024-06-01T08:00:00.000Z')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', '2024-06-01T08:00:00.000Z'])
  })

  it('clear uses properties.default when defined', () => {
    const defaultDate = '2000-01-01T00:00:00.000Z'
    const wrapper = mount(KDatetimeField, { props: makeProps({ default: defaultDate }), global: { stubs } })
    wrapper.vm.fill('2024-06-01T08:00:00.000Z')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe(defaultDate)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    const newDate = '2025-01-15T12:00:00.000Z'
    await wrapper.setProps({ values: { test: newDate } })
    await nextTick()
    expect(wrapper.vm.value()).toBe(newDate)
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024-06-01T08:00:00.000Z')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('2024-06-01T08:00:00.000Z')
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid date')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid date')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })
})

describe('KDateField', () => {
  const stubs = { 'q-field': fieldStub }

  it('renders a date input in edit mode', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="date"]').exists()).toBe(true)
  })

  it('renders the model value in readOnly mode', () => {
    const wrapper = mount(KDateField, { props: { ...makeProps(), readOnly: true, values: { test: '2024/06/15' } }, global: { stubs } })
    expect(wrapper.find('div').text()).toBe('2024/06/15')
  })

  it('initializes model to today when no values provided', () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/')
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toBe(today)
  })

  it('emptyModel returns date in YYYY/MM/DD format', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
  })

  it('isEmpty always returns false', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024/01/01')
    expect(wrapper.vm.value()).toBe('2024/01/01')
  })

  it('clear resets to today', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2020/01/01')
    wrapper.vm.clear()
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/')
    expect(wrapper.vm.value()).toBe(today)
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KDateField, { props: { ...makeProps(), values: { test: '2024/03/15' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('2024/03/15')
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid date')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024/06/01')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', '2024/06/01'])
  })

  it('clear uses properties.default when defined', () => {
    const wrapper = mount(KDateField, { props: makeProps({ default: '2000/01/01' }), global: { stubs } })
    wrapper.vm.fill('2024/06/01')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('2000/01/01')
  })

  it('validate clears the error', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid date')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: '2025/06/15' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('2025/06/15')
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024/06/01')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('2024/06/01')
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KDateField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })
})
