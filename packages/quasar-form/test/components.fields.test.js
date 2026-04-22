import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
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
import KTextField from '../src/components/KTextField.vue'
import KNumberField from '../src/components/KNumberField.vue'
import KColorField from '../src/components/KColorField.vue'
import KSliderField from '../src/components/KSliderField.vue'
import KChipsField from '../src/components/KChipsField.vue'
import KRoleField from '../src/components/KRoleField.vue'
import KTokenField from '../src/components/KTokenField.vue'
import KResolutionField from '../src/components/KResolutionField.vue'
import KItemField from '../src/components/KItemField.vue'
import KPropertyItemField from '../src/components/KPropertyItemField.vue'
import KUnitField from '../src/components/KUnitField.vue'
import KFileField from '../src/components/KFileField.vue'
import KTagField from '../src/components/KTagField.vue'
import KIconField from '../src/components/KIconField.vue'
import KColorScaleField from '../src/components/KColorScaleField.vue'
import KDateTimeRangeField from '../src/components/KDateTimeRangeField.vue'

// Make this.$t and this.$q available in all mounted components
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
const iconStub = { template: '<button @click="$emit(\'click\')" />', emits: ['click'] }
const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }
const toggleStub = { template: '<input type="checkbox" />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }
const selectStub = { template: '<select />', props: ['modelValue', 'options'], emits: ['update:modelValue', 'blur'] }
const optionGroupStub = { template: '<div><slot v-for="opt in options" name="label" :="opt" /></div>', props: ['modelValue', 'options'], emits: ['update:modelValue'] }
// Renders its slot only when modelValue (v-model) is true — simulates q-dialog open/close
const dialogStub = { template: '<div v-if="modelValue"><slot /></div>', props: ['modelValue'], emits: ['update:modelValue'] }
// Renders the default slot — used by KChipsField which puts chips+input in v-slot:default
const chipsFieldStub = { template: '<div><slot /></div>' }
// Re-emits native keyup as a component event — allows @keyup.enter on q-input to fire in tests
const keyupInputStub = { template: '<input @keyup="$emit(\'keyup\', $event)" />', props: ['modelValue'], emits: ['update:modelValue', 'keyup'] }

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

  it('readOnly link href is bound to model value (not a static string)', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), readOnly: true, values: { test: 'https://dynamic.url' } }, global: { stubs } })
    expect(wrapper.find('a[href="https://dynamic.url"]').exists()).toBe(true)
  })

  it('readOnly link opens in a new tab (target=_blank)', () => {
    const wrapper = mount(KUrlField, { props: { ...makeProps(), readOnly: true, values: { test: 'https://example.com' } }, global: { stubs } })
    expect(wrapper.find('a').attributes('target')).toBe('_blank')
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

  it('autocomplete defaults to "on"', () => {
    const wrapper = mount(KPasswordField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.autocomplete).toBe('on')
  })

  it('autocomplete can be customized via properties.field.autocomplete', () => {
    const wrapper = mount(KPasswordField, { props: makeProps({ field: { autocomplete: 'new-password' } }), global: { stubs } })
    expect(wrapper.vm.autocomplete).toBe('new-password')
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

  it('multiple defaults to false', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.multiple).toBe(false)
  })

  it('multiple is true when multiselect is set in properties', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    expect(wrapper.vm.multiple).toBe(true)
  })

  it('chips defaults to false', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.chips).toBe(false)
  })

  it('chips is true when properties.field.chips is set', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, chips: true } }), global: { stubs } })
    expect(wrapper.vm.chips).toBe(true)
  })

  it('isClearable defaults to true', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(true)
  })

  it('isClearable can be disabled via properties.field.clearable', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, clearable: false } }), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(false)
  })

  it('selectedClass defaults to text-weight-regular', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-weight-regular')
  })

  it('selectedClass can be customized via properties.field.selectedClass', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, selectedClass: 'text-bold' } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-bold')
  })

  it('dense computed reflects the dense prop', () => {
    const wrapper = mount(KSelectField, { props: { ...makeProps({ field: { options } }), dense: true }, global: { stubs } })
    expect(wrapper.vm.dense).toBe(true)
  })

  it('onFilter narrows the options list', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.onFilter('option a', (fn) => fn())
    expect(wrapper.vm.options.length).toBe(1)
    expect(wrapper.vm.options[0].value).toBe('a')
  })

  it('onFilter with empty string resets the filter', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.onFilter('option a', (fn) => fn())
    wrapper.vm.onFilter('', (fn) => fn())
    expect(wrapper.vm.options.length).toBe(2)
  })

  it('getId returns kebab-case id for string values', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.getId({ value: 'my value', label: 'My Value' })).toBe('my-value')
  })

  it('getId falls back to label for object values', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.getId({ value: { nested: 'obj' }, label: 'My Label' })).toBe('my-label')
  })

  it('hasNoOption is false when field.noOption is not set', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.hasNoOption).toBe(false)
  })

  it('hasNoOption is true when field.noOption is a string', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, noOption: 'No results found' } }), global: { stubs } })
    expect(wrapper.vm.hasNoOption).toBe(true)
  })

  it('noOption returns the configured string', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, noOption: 'No results' } }), global: { stubs } })
    expect(wrapper.vm.noOption).toBe('No results')
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

  it('selectedClass() returns text-weight-regular by default', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-weight-regular')
  })

  it('selectedClass() returns custom class when set in properties', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options, selectedClass: 'text-italic' } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-italic')
  })

  it('readOnly shows an empty chip (KDK behavior — no label displayed)', () => {
    const wrapper = mount(KOptionsField, { props: { ...makeProps({ field: { options } }), readOnly: true, values: { test: 'a' } }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
  })
})

describe('KTextareaField', () => {
  const defaultSlotFieldStub = { template: '<div><slot /></div>', props: ['modelValue'] }
  const editorStub = { template: '<input />', props: ['modelValue', 'definitions', 'toolbar', 'contentStyle', 'contentClass', 'minHeight', 'maxHeight', 'dense'], emits: ['update:modelValue'] }
  const stubs = { 'q-field': defaultSlotFieldStub, 'q-input': inputStub, 'q-editor': editorStub }

  it('renders a textarea in edit mode', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders text content in readOnly mode', () => {
    const wrapper = mount(KTextareaField, { props: { ...makeProps(), readOnly: true, values: { test: 'hello world' } }, global: { stubs } })
    expect(wrapper.find('div').text()).toBe('hello world')
  })

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

  it('isEmpty returns false for non-empty string (not null)', () => {
    const wrapper = mount(KTextareaField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
    wrapper.vm.fill('hello')
    expect(wrapper.vm.isEmpty()).toBe(false)
    wrapper.vm.clear()
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

describe('KTextField', () => {
  const stubs = { 'q-input': inputStub }

  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders text content in readOnly mode', () => {
    const wrapper = mount(KTextField, { props: { ...makeProps(), readOnly: true, values: { test: 'hello world' } }, global: { stubs } })
    expect(wrapper.text()).toContain('hello world')
  })

  it('renders a clickable link in readOnly mode when model is a URL', () => {
    const wrapper = mount(KTextField, { props: { ...makeProps(), readOnly: true, values: { test: 'https://example.com' } }, global: { stubs } })
    expect(wrapper.find('a[href="https://example.com"]').exists()).toBe(true)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('hello')
    expect(wrapper.vm.value()).toBe('hello')
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('hello')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('too short')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('too short')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('hello')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'hello'])
  })

  it('label is read from properties.field.label', () => {
    const wrapper = mount(KTextField, { props: makeProps({ field: { label: 'Full name' } }), global: { stubs } })
    expect(wrapper.vm.label).toBe('Full name')
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KTextField, { props: { ...makeProps(), values: { test: 'init value' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('init value')
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 'updated value' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('updated value')
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KTextField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('readOnly hides the input', () => {
    const wrapper = mount(KTextField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KTextField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('hello')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('hello')
  })
})

describe('KNumberField', () => {
  const stubs = { 'q-input': inputStub }

  it('renders a q-input in edit mode', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders the number in readOnly mode', () => {
    const wrapper = mount(KNumberField, { props: { ...makeProps(), readOnly: true, values: { test: 42 } }, global: { stubs } })
    expect(wrapper.text()).toContain('42')
  })

  it('fill sets the model to a number', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(42)
    expect(wrapper.vm.value()).toBe(42)
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(42)
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBeNull()
  })

  it('isEmpty returns true when model is null', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false when model has a value', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(0)
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('out of range')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('out of range')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(7)
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 7])
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KNumberField, { props: { ...makeProps(), values: { test: 99 } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe(99)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 55 } })
    await nextTick()
    expect(wrapper.vm.value()).toBe(55)
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KNumberField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('readOnly hides the input', () => {
    const wrapper = mount(KNumberField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(42)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe(42)
  })

  it('onUpdated with a non-number value (null) sets model to null', async () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(42)
    await wrapper.findComponent(inputStub).vm.$emit('update:modelValue', null)
    await nextTick()
    expect(wrapper.vm.value()).toBeNull()
  })

  it('onUpdated with 0 keeps model as 0 (not null)', async () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    await wrapper.findComponent(inputStub).vm.$emit('update:modelValue', 0)
    await nextTick()
    expect(wrapper.vm.value()).toBe(0)
  })

  it('onUpdated with a number emits field-changed', async () => {
    const wrapper = mount(KNumberField, { props: makeProps(), global: { stubs } })
    await wrapper.findComponent(inputStub).vm.$emit('update:modelValue', 7)
    await nextTick()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed').at(-1)).toEqual(['test', 7])
  })
})

describe('KColorField', () => {
  // q-field renders the control slot; q-dialog shows its slot only when open; q-color is the picker
  const stubs = { 'q-field': fieldStub, 'q-dialog': dialogStub, 'q-color': true }

  it('renders a colored div in edit mode (via control slot)', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('.k-color-field').exists()).toBe(true)
  })

  it('renders a colored div in readOnly mode', () => {
    const wrapper = mount(KColorField, { props: { ...makeProps(), readOnly: true, values: { test: '#ff0000' } }, global: { stubs } })
    expect(wrapper.find('.k-color-field').exists()).toBe(true)
  })

  it('initializes model to empty string when no default', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toBe('')
  })

  it('initializes model to properties.default when defined', () => {
    const wrapper = mount(KColorField, { props: makeProps({ default: '#ff0000' }), global: { stubs } })
    expect(wrapper.vm.value()).toBe('#ff0000')
  })

  it('fill sets the model to a hex color', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#123456')
    expect(wrapper.vm.value()).toBe('#123456')
  })

  it('clear resets model to empty string', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#abcdef')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('')
  })

  it('clear resets model to properties.default when defined', () => {
    const wrapper = mount(KColorField, { props: makeProps({ default: '#000000' }), global: { stubs } })
    wrapper.vm.fill('#abcdef')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('#000000')
  })

  it('color computed is transparent when model is empty', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.color).toBe('transparent')
  })

  it('color computed reflects model value for CSS v-bind', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#ff0000')
    expect(wrapper.vm.color).toBe('#ff0000')
  })

  it('picker state starts as false', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.picker).toBe(false)
  })

  it('color picker dialog shows when picker is set to true', async () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.picker = true
    await nextTick()
    expect(wrapper.find('q-color-stub').exists()).toBe(true)
  })

  it('onReferenceCreated attaches a click handler that opens the picker', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    const fakeEl = {}
    wrapper.vm.onReferenceCreated({ $el: fakeEl })
    expect(typeof fakeEl.onclick).toBe('function')
    fakeEl.onclick()
    expect(wrapper.vm.picker).toBe(true)
  })

  it('isClearable defaults to true', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(true)
  })

  it('isClearable can be disabled via properties.field.clearable', () => {
    const wrapper = mount(KColorField, { props: makeProps({ field: { clearable: false } }), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(false)
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid color')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid color')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#aabbcc')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', '#aabbcc'])
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KColorField, { props: { ...makeProps(), values: { test: '#112233' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('#112233')
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: '#999999' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('#999999')
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KColorField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#aabbcc')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('#aabbcc')
  })

  it('onReferenceCreated with null ref does nothing (no throw)', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(() => wrapper.vm.onReferenceCreated(null)).not.toThrow()
    expect(wrapper.vm.picker).toBe(false)
  })

  it('isEmpty returns true when model is empty string', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false when model has a color', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#ff0000')
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('emptyModel returns empty string', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe('')
  })
})

describe('KSliderField', () => {
  const sliderStub = { template: '<input type="range" />', props: ['modelValue', 'min', 'max', 'step'], emits: ['update:modelValue', 'change'] }
  const stubs = { 'q-field': fieldStub, 'q-slider': sliderStub }

  it('renders a slider in edit mode', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="range"]').exists()).toBe(true)
  })

  it('renders the numeric value in readOnly mode', () => {
    const wrapper = mount(KSliderField, { props: { ...makeProps(), readOnly: true, values: { test: 42 } }, global: { stubs } })
    expect(wrapper.text()).toContain('42')
  })

  it('initializes model to min (0) when no value is set', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toBe(0)
  })

  it('min/max/step are read from properties.field', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ field: { min: 10, max: 50, step: 5 } }), global: { stubs } })
    expect(wrapper.vm.min).toBe(10)
    expect(wrapper.vm.max).toBe(50)
    expect(wrapper.vm.step).toBe(5)
  })

  it('initializes model to custom min when defined', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ field: { min: 20 } }), global: { stubs } })
    expect(wrapper.vm.value()).toBe(20)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(75)
    expect(wrapper.vm.value()).toBe(75)
  })

  it('clear resets model to min', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(75)
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe(0)
  })

  it('clear resets model to properties.default when defined', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ default: 50 }), global: { stubs } })
    wrapper.vm.fill(90)
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe(50)
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('out of range')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('out of range')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(30)
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 30])
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KSliderField, { props: { ...makeProps(), values: { test: 60 } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe(60)
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: 80 } })
    await nextTick()
    expect(wrapper.vm.value()).toBe(80)
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(42)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe(42)
  })

  it('emptyModel returns the min value', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ field: { min: 5 } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe(5)
  })

  it('isEmpty returns false (slider always has a value)', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('markers defaults to false', () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.markers).toBe(false)
  })

  it('markers is read from properties.field.markers', () => {
    const wrapper = mount(KSliderField, { props: makeProps({ field: { markers: true } }), global: { stubs } })
    expect(wrapper.vm.markers).toBe(true)
  })

  it('slider change event emits field-changed', async () => {
    const wrapper = mount(KSliderField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(50)
    await wrapper.findComponent(sliderStub).vm.$emit('change')
    await nextTick()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed').at(-1)).toEqual(['test', 50])
  })
})

describe('KChipsField', () => {
  // chipsFieldStub renders the default slot so chips+input are visible in edit mode
  // keyupInputStub re-emits native keyup as component event so @keyup.enter fires
  const stubs = { 'q-field': chipsFieldStub, 'q-chip': true, 'q-input': keyupInputStub }

  it('renders an input in edit mode', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders a chip per value in readOnly mode', () => {
    const wrapper = mount(KChipsField, { props: { ...makeProps(), readOnly: true, values: { test: ['foo', 'bar'] } }, global: { stubs } })
    expect(wrapper.findAll('q-chip-stub').length).toBe(2)
  })

  it('initializes model to [] when no values are provided', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toEqual([])
  })

  it('chips local state is initially empty', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.chips).toEqual([])
  })

  it('input state is initially empty string', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.input).toBe('')
  })

  it('isEmpty returns true when model is empty array', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false when model has chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['tag1'])
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('fill sets the model to an array of chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['a', 'b', 'c'])
    expect(wrapper.vm.value()).toEqual(['a', 'b', 'c'])
  })

  it('fill syncs the chips local state (flush:sync watch)', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['a', 'b'])
    expect(wrapper.vm.chips).toEqual(['a', 'b'])
  })

  it('fill syncs chips displayed in edit mode', async () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['a', 'b'])
    await nextTick()
    expect(wrapper.findAll('q-chip-stub').length).toBe(2)
  })

  it('clear resets model to []', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['a', 'b'])
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toEqual([])
  })

  it('onChipAdded appends the input value to chips and clears input', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    wrapper.vm.input = 'newtag'
    wrapper.vm.onChipAdded()
    expect(wrapper.vm.chips).toContain('newtag')
    expect(wrapper.vm.input).toBe('')
  })

  it('onChipAdded syncs chips to model via updateModel', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    wrapper.vm.input = 'newtag'
    wrapper.vm.onChipAdded()
    expect(wrapper.vm.value()).toContain('newtag')
  })

  it('pressing Enter in the input adds a chip via @keyup.enter', async () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    wrapper.vm.input = 'entertag'
    await wrapper.find('input').trigger('keyup', { key: 'Enter' })
    expect(wrapper.vm.chips).toContain('entertag')
  })

  it('onChipRemoved removes the chip from chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    wrapper.vm.fill(['a', 'b', 'c'])
    wrapper.vm.onChipRemoved('b')
    expect(wrapper.vm.chips).toEqual(['a', 'c'])
  })

  it('updateModel syncs chips to model and emits field-changed', async () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.chips = ['x', 'y']
    wrapper.vm.updateModel()
    expect(wrapper.vm.value()).toEqual(['x', 'y'])
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', ['x', 'y']])
  })

  it('chipValue returns the chip itself for string chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    expect(wrapper.vm.chipValue('hello')).toBe('hello')
  })

  it('chipColor returns dark for string chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    expect(wrapper.vm.chipColor('anything')).toBe('dark')
  })

  it('chipIcon returns undefined for string chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    expect(wrapper.vm.chipIcon('anything')).toBeUndefined()
  })

  it('icon mode: onChipAdded creates object chips with icon', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    wrapper.vm.input = 'mytag'
    wrapper.vm.onChipAdded()
    expect(wrapper.vm.chips[0]).toMatchObject({ value: 'mytag' })
    expect(wrapper.vm.chips[0].icon).toBeDefined()
  })

  it('icon mode: chipValue extracts chip.value from object chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    expect(wrapper.vm.chipValue({ value: 'hello', icon: { name: 'star', color: 'red' } })).toBe('hello')
  })

  it('icon mode: chipIcon extracts icon name from object chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    expect(wrapper.vm.chipIcon({ value: 'hello', icon: { name: 'star', color: 'red' } })).toBe('star')
  })

  it('icon mode: chipColor extracts icon color from object chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    expect(wrapper.vm.chipColor({ value: 'hello', icon: { name: 'star', color: 'red' } })).toBe('red')
  })

  it('icon mode: onChipRemoved filters by chip.value', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    const chipA = { value: 'a', icon: { name: 'x', color: 'dark' } }
    const chipB = { value: 'b', icon: { name: 'y', color: 'dark' } }
    wrapper.vm.fill([chipA, chipB])
    wrapper.vm.onChipRemoved(chipA)
    expect(wrapper.vm.chips).toEqual([chipB])
  })

  it('icon mode: chipValue falls back to chip.name when chip.value is falsy', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    expect(wrapper.vm.chipValue({ name: 'fallback', icon: {} })).toBe('fallback')
  })

  it('icon mode: chipColor defaults to dark when icon.color is absent', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    expect(wrapper.vm.chipColor({ value: 'x', icon: {} })).toBe('dark')
  })

  it('icon mode: readOnly renders chips using chipValue from icon objects', async () => {
    const chips = [{ value: 'alpha', icon: { name: 'star', color: 'primary' } }]
    const wrapper = mount(KChipsField, { props: { ...makeProps({ field: { icon: true } }), readOnly: true, values: { test: chips } }, global: { stubs } })
    expect(wrapper.findAll('q-chip-stub').length).toBe(1)
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['x', 'y'])
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', ['x', 'y']])
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KChipsField, { props: { ...makeProps(), values: { test: ['init'] } }, global: { stubs } })
    expect(wrapper.vm.value()).toEqual(['init'])
  })

  it('values prop change updates the model and chips reactively', async () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: ['reactive'] } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(['reactive'])
    expect(wrapper.vm.chips).toEqual(['reactive'])
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['tag1', 'tag2'])
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual(['tag1', 'tag2'])
  })

  it('onChipClicked emits chip-clicked with the chip payload', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    const chip = { value: 'hello', icon: { name: 'star', color: 'red' } }
    wrapper.vm.onChipClicked(chip)
    expect(wrapper.emitted('chip-clicked')).toBeTruthy()
    expect(wrapper.emitted('chip-clicked')[0][0]).toEqual(chip)
  })

  it('onChipClicked does nothing harmful for string chips (non-icon mode)', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(() => wrapper.vm.onChipClicked('hello')).not.toThrow()
  })
})

describe('KRoleField', () => {
  const stubs = { 'q-field': fieldStub, 'q-option-group': optionGroupStub, 'q-chip': { template: '<span><slot /></span>' } }

  it('renders a q-option-group in edit mode', () => {
    const wrapper = mount(KRoleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.findComponent(optionGroupStub).exists()).toBe(true)
  })

  it('renders a chip in readOnly mode', () => {
    const wrapper = mount(KRoleField, { props: { ...makeProps(), readOnly: true, values: { test: 'owner' } }, global: { stubs } })
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('defaults to first role when no value provided', () => {
    const wrapper = mount(KRoleField, { props: makeProps({ field: { roles: ['owner', 'manager', 'member'] } }), global: { stubs } })
    expect(wrapper.vm.value()).toBe('owner')
  })

  it('uses custom roles from field.roles', () => {
    const wrapper = mount(KRoleField, { props: makeProps({ field: { roles: ['admin', 'user'] } }), global: { stubs } })
    const roles = wrapper.vm.roles()
    expect(roles.map(r => r.value)).toEqual(['admin', 'user'])
  })

  it('isEmpty always returns false', () => {
    const wrapper = mount(KRoleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KRoleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('manager')
    expect(wrapper.vm.value()).toBe('manager')
  })

  it('clear resets to first role', () => {
    const wrapper = mount(KRoleField, { props: makeProps({ field: { roles: ['owner', 'manager'] } }), global: { stubs } })
    wrapper.vm.fill('manager')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('owner')
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KRoleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('member')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'member'])
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KRoleField, { props: { ...makeProps(), values: { test: 'manager' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('manager')
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KRoleField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KRoleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('manager')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('manager')
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KRoleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KRoleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('uses default role names when field.roles is not set', () => {
    const wrapper = mount(KRoleField, { props: makeProps({ field: {} }), global: { stubs } })
    const values = wrapper.vm.roles().map(r => r.value)
    expect(values).toEqual(['owner', 'manager', 'member'])
  })

  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KRoleField, { props: makeProps({ field: { roles: ['owner', 'manager', 'member'] } }), global: { stubs } })
    await wrapper.setProps({ values: { test: 'manager' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('manager')
  })

  it('roles computed labels are translated (uppercase key)', () => {
    const wrapper = mount(KRoleField, { props: makeProps({ field: { roles: ['owner'] } }), global: { stubs } })
    // vi.mock('vue-i18n') returns key as-is, so label should be the uppercase key
    expect(wrapper.vm.roles()[0].label).toBe('OWNER')
  })
})

describe('KTokenField', () => {
  const inputsStub = { template: '<input :id="id" />', props: ['modelValue', 'id', 'mask', 'disable', 'autofocus', 'outlined'], emits: ['update:modelValue', 'blur', 'keyup'] }
  const stubs = { 'q-input': inputsStub }

  it('renders the correct number of inputs from field.tokenLength', () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { tokenLength: 4 } }), global: { stubs } })
    expect(wrapper.findAll('input').length).toBe(4)
  })

  it('defaults to 6 inputs when tokenLength not set', () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    expect(wrapper.findAll('input').length).toBe(6)
  })

  it('renders text in readOnly mode', () => {
    const wrapper = mount(KTokenField, { props: { ...makeProps(), readOnly: true, values: { test: '1234' } }, global: { stubs } })
    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.findAll('input').length).toBe(0)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('123456')
    expect(wrapper.vm.value()).toBe('123456')
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KTokenField, { props: { ...makeProps(), values: { test: '654321' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('654321')
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid token')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid token')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('tokenLength computed returns field.tokenLength', () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { tokenLength: 8 } }), global: { stubs } })
    expect(wrapper.vm.tokenLength).toBe(8)
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('123456')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('123456')
  })

  it('updateModel joins fieldValues into the model string', async () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { tokenLength: 4 } }), global: { stubs } })
    wrapper.vm.fieldValues[0] = '1'
    wrapper.vm.fieldValues[1] = '2'
    wrapper.vm.fieldValues[2] = '3'
    wrapper.vm.fieldValues[3] = '4'
    wrapper.vm.updateModel(5) // index 5 is out of range, no focus attempt
    expect(wrapper.vm.value()).toBe('1234')
  })

  it('updateModel emits field-changed', async () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { tokenLength: 3 } }), global: { stubs } })
    wrapper.vm.fieldValues[0] = '7'
    wrapper.vm.fieldValues[1] = '8'
    wrapper.vm.fieldValues[2] = '9'
    await wrapper.vm.updateModel(4)
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed').at(-1)[1]).toBe('789')
  })

  it('onKeyUp Backspace clears the previous input cell', () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { tokenLength: 4 } }), global: { stubs } })
    wrapper.vm.fieldValues[0] = '5'
    wrapper.vm.fieldValues[1] = '6'
    wrapper.vm.onKeyUp({ key: 'Backspace' }, 1) // at index 1, clears index 0
    expect(wrapper.vm.fieldValues[0]).toBe('')
  })

  it('onKeyUp ArrowLeft clears the previous input cell', () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { tokenLength: 4 } }), global: { stubs } })
    wrapper.vm.fieldValues[0] = '3'
    wrapper.vm.onKeyUp({ key: 'ArrowLeft' }, 1)
    expect(wrapper.vm.fieldValues[0]).toBe('')
  })

  it('labelClass includes text-red when the field has an error', () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('wrong code')
    expect(wrapper.vm.labelClass['text-red']).toBe(true)
  })

  it('labelClass does not include text-red without error', () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.labelClass['text-red']).toBeFalsy()
  })

  it('clearInput empties the cell at the given index', () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { tokenLength: 4 } }), global: { stubs } })
    wrapper.vm.fieldValues[2] = '9'
    wrapper.vm.clearInput(2)
    expect(wrapper.vm.fieldValues[2]).toBe('')
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: '999999' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('999999')
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('123456')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })
})

describe('KResolutionField', () => {
  const stubs = { 'q-select': selectStub, 'q-input': inputStub, 'q-item': { template: '<li />' }, 'q-item-section': { template: '<span />' }, 'q-item-label': { template: '<span />' } }

  it('renders a q-select', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.findComponent(selectStub).exists()).toBe(true)
  })

  it('model is an object with width and height', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.model).toMatchObject({ width: expect.any(Number), height: expect.any(Number) })
  })

  it('defaults to HD resolution (1280x720)', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.model).toEqual({ width: 1280, height: 720 })
  })

  it('updateModel sets model from width and height', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.width = 1920
    wrapper.vm.height = 1080
    wrapper.vm.updateModel()
    expect(wrapper.vm.model).toEqual({ width: 1920, height: 1080 })
  })

  it('provides 7 resolution options', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.resolutions.length).toBe(7)
  })

  it('borderless defaults to false', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.borderless).toBe(false)
  })

  it('borderless can be set via field.borderless', () => {
    const wrapper = mount(KResolutionField, { props: makeProps({ field: { borderless: true } }), global: { stubs } })
    expect(wrapper.vm.borderless).toBe(true)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KResolutionField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('selecting the FHD preset sets width=1920 and height=1080', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    const fhd = wrapper.vm.resolutions.find(r => r.value === '1920x1080')
    wrapper.vm.resolution = fhd
    await nextTick()
    expect(wrapper.vm.width).toBe(1920)
    expect(wrapper.vm.height).toBe(1080)
    expect(wrapper.vm.model).toEqual({ width: 1920, height: 1080 })
  })

  it('selecting the personalized preset sets readonly to false', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    const personalized = wrapper.vm.resolutions.find(r => r.readonly === false)
    wrapper.vm.resolution = personalized
    await nextTick()
    expect(wrapper.vm.readonly).toBe(false)
  })

  it('width below 256 is clamped to 256', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    // Switch to personalized to allow custom width
    wrapper.vm.resolution = wrapper.vm.resolutions.find(r => !r.readonly)
    await nextTick()
    wrapper.vm.width = 10
    await nextTick()
    expect(wrapper.vm.width).toBe(256)
  })

  it('width above 4000 is clamped to 4000', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.resolution = wrapper.vm.resolutions.find(r => !r.readonly)
    await nextTick()
    wrapper.vm.width = 9999
    await nextTick()
    expect(wrapper.vm.width).toBe(4000)
  })

  it('height below 256 is clamped to 256', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.height = 50
    await nextTick()
    expect(wrapper.vm.height).toBe(256)
  })
})

describe('KItemField', () => {
  const stubs = { 'q-select': selectStub, 'q-chip': { template: '<span><slot /></span>' } }

  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    expect(wrapper.findComponent(selectStub).exists()).toBe(true)
  })

  it('renders a chip in readOnly mode', () => {
    const wrapper = mount(KItemField, { props: { ...makeProps({ services: [{ service: 'users', field: 'name' }] }), readOnly: true, values: { test: { name: 'Alice' } } }, global: { stubs } })
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('emptyModel returns null for single-select', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [] }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBeNull()
  })

  it('emptyModel returns [] for multiselect', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [], multiselect: true }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual([])
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    wrapper.vm.fill({ name: 'Bob' })
    expect(wrapper.vm.value()).toEqual({ name: 'Bob' })
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    wrapper.vm.fill({ name: 'Bob' })
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('search inject is used for onSearch', async () => {
    const mockSearch = vi.fn().mockResolvedValue([{ name: 'Alice', service: 'users' }])
    const wrapper = mount(KItemField, {
      props: makeProps({ services: [{ service: 'users', field: 'name' }] }),
      global: { stubs, provide: { search: mockSearch } }
    })
    let updated = false
    await wrapper.vm.onSearch('Ali', (fn) => { fn(); updated = true }, () => {})
    expect(mockSearch).toHaveBeenCalled()
    expect(updated).toBe(true)
  })

  it('onSearch aborts when pattern is too short', async () => {
    const abortFn = vi.fn()
    const wrapper = mount(KItemField, { props: makeProps({ services: [] }), global: { stubs } })
    await wrapper.vm.onSearch('a', () => {}, abortFn)
    expect(abortFn).toHaveBeenCalled()
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [] }), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    wrapper.vm.fill({ name: 'Charlie' })
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual({ name: 'Charlie' })
  })

  it('values prop change updates items reactively', async () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    expect(wrapper.vm.items).toBeNull()
    await wrapper.setProps({ values: { test: { name: 'Dave' } } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual({ name: 'Dave' })
    expect(wrapper.vm.items).toEqual({ name: 'Dave' })
  })

  it('getLabel uses the service field property to extract the label', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'displayName' }] }), global: { stubs } })
    expect(wrapper.vm.getLabel({ displayName: 'Alice Smith', service: 'users' })).toBe('Alice Smith')
  })

  it('getLabel falls back to name when no service field defined', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users' }] }), global: { stubs } })
    expect(wrapper.vm.getLabel({ name: 'Bob', service: 'users' })).toBe('Bob')
  })

  it('getIcon extracts icon.name from item', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [] }), global: { stubs } })
    expect(wrapper.vm.getIcon({ icon: { name: 'las la-user' } })).toBe('las la-user')
  })

  it('getIcon falls back to flat icon string', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [] }), global: { stubs } })
    expect(wrapper.vm.getIcon({ icon: 'las la-user' })).toBe('las la-user')
  })

  it('getIcon returns empty string when no icon', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [] }), global: { stubs } })
    expect(wrapper.vm.getIcon({})).toBe('')
  })

  it('onSelected with null value clears the model', async () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [] }), global: { stubs } })
    wrapper.vm.fill({ name: 'Eve' })
    await wrapper.vm.onSelected(null)
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('onSelected with a value syncs model from items', async () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    wrapper.vm.items = { name: 'Frank', service: 'users' }
    await wrapper.vm.onSelected({ name: 'Frank', service: 'users' })
    expect(wrapper.vm.value()).toEqual({ name: 'Frank', service: 'users' })
  })

  it('onSelected emits field-changed', async () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    wrapper.vm.items = { name: 'Grace', service: 'users' }
    await wrapper.vm.onSelected({ name: 'Grace' })
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  it('onSearch in multiselect mode excludes already-selected items', async () => {
    // The filter uses item.field to resolve the comparison key, so results must carry the field property
    const mockSearch = vi.fn().mockResolvedValue([
      { name: 'Alice', service: 'users', field: 'name' },
      { name: 'Bob', service: 'users', field: 'name' }
    ])
    const wrapper = mount(KItemField, {
      props: makeProps({ services: [{ service: 'users', field: 'name' }], multiselect: true }),
      global: { stubs, provide: { search: mockSearch } }
    })
    wrapper.vm.items = [{ name: 'Alice', service: 'users', field: 'name' }]
    await wrapper.vm.onSearch('li', (fn) => fn(), () => {})
    // Alice is already selected so only Bob should remain
    expect(wrapper.vm.options.length).toBe(1)
    expect(wrapper.vm.options[0].name).toBe('Bob')
  })

  it('getDescription uses the service description property', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name', description: 'email' }] }), global: { stubs } })
    expect(wrapper.vm.getDescription({ email: 'alice@example.com', service: 'users' })).toBe('alice@example.com')
  })

  it('getDescription falls back to description field when not configured', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    expect(wrapper.vm.getDescription({ description: 'A user', service: 'users' })).toBe('A user')
  })

  it('getId returns kebab-case from the label', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    expect(wrapper.vm.getId({ name: 'Alice Smith', service: 'users' })).toBe('alice-smith')
  })
})

describe('KPropertyItemField', () => {
  const stubs = { 'q-select': selectStub, 'q-chip': { template: '<span><slot /></span>' } }
  const serviceProps = { field: { service: 'items', propertyField: 'code', multiple: false } }

  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KPropertyItemField, { props: makeProps(serviceProps), global: { stubs } })
    expect(wrapper.findComponent(selectStub).exists()).toBe(true)
  })

  it('renders a chip in readOnly mode', () => {
    const wrapper = mount(KPropertyItemField, { props: { ...makeProps(serviceProps), readOnly: true, values: { test: 'ABC' } }, global: { stubs } })
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('emptyModel returns null for single', () => {
    const wrapper = mount(KPropertyItemField, { props: makeProps(serviceProps), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBeNull()
  })

  it('emptyModel returns [] for multiple', () => {
    const wrapper = mount(KPropertyItemField, { props: makeProps({ field: { ...serviceProps.field, multiple: true } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual([])
  })

  it('onSearch aborts when pattern is too short', async () => {
    const abortFn = vi.fn()
    const wrapper = mount(KPropertyItemField, { props: makeProps(serviceProps), global: { stubs } })
    await wrapper.vm.onSearch('x', () => {}, abortFn)
    expect(abortFn).toHaveBeenCalled()
  })

  it('search inject is used for onSearch', async () => {
    const mockSearch = vi.fn().mockResolvedValue([{ code: 'XYZ', description: 'Item XYZ' }])
    const wrapper = mount(KPropertyItemField, {
      props: makeProps(serviceProps),
      global: { stubs, provide: { search: mockSearch } }
    })
    let updated = false
    await wrapper.vm.onSearch('XY', (fn) => { fn(); updated = true }, () => {})
    expect(mockSearch).toHaveBeenCalled()
    expect(updated).toBe(true)
    expect(wrapper.vm.options[0]).toMatchObject({ id: 'xyz', value: 'XYZ' })
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KPropertyItemField, { props: makeProps(serviceProps), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KPropertyItemField, { props: makeProps({ field: { ...serviceProps.field, disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('onSelected with null clears the model', async () => {
    const wrapper = mount(KPropertyItemField, { props: makeProps(serviceProps), global: { stubs } })
    wrapper.vm.model = 'XYZ'
    await wrapper.vm.onSelected(null)
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('clear resets model to emptyModel', () => {
    const wrapper = mount(KPropertyItemField, { props: makeProps(serviceProps), global: { stubs } })
    wrapper.vm.model = 'ABC'
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBeNull()
  })

  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KPropertyItemField, { props: makeProps(serviceProps), global: { stubs } })
    await wrapper.setProps({ values: { test: 'CODE42' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('CODE42')
  })

  it('options are cleared after onSelected', async () => {
    const mockSearch = vi.fn().mockResolvedValue([{ code: 'ABC' }])
    const wrapper = mount(KPropertyItemField, {
      props: makeProps(serviceProps),
      global: { stubs, provide: { search: mockSearch } }
    })
    await wrapper.vm.onSearch('AB', (fn) => fn(), () => {})
    expect(wrapper.vm.options.length).toBe(1)
    await wrapper.vm.onSelected('ABC')
    expect(wrapper.vm.options.length).toBe(0)
  })

  it('onSearch in multiple mode excludes already-selected values', async () => {
    const mockSearch = vi.fn().mockResolvedValue([{ code: 'ABC' }, { code: 'XYZ' }])
    const wrapper = mount(KPropertyItemField, {
      props: makeProps({ field: { ...serviceProps.field, multiple: true } }),
      global: { stubs, provide: { search: mockSearch } }
    })
    // Simulate ABC already selected
    wrapper.vm.model = ['abc'] // ids are kebab-cased
    await wrapper.vm.onSearch('AB', (fn) => fn(), () => {})
    // ABC has id 'abc' which matches the selected value, so only XYZ should remain
    expect(wrapper.vm.options.length).toBe(1)
    expect(wrapper.vm.options[0].value).toBe('XYZ')
  })

  it('search result description field is mapped correctly', async () => {
    const mockSearch = vi.fn().mockResolvedValue([{ code: 'DEF', note: 'Some note' }])
    const wrapper = mount(KPropertyItemField, {
      props: makeProps({ field: { ...serviceProps.field, descriptionField: 'note' } }),
      global: { stubs, provide: { search: mockSearch } }
    })
    await wrapper.vm.onSearch('DE', (fn) => fn(), () => {})
    expect(wrapper.vm.options[0].description).toBe('Some note')
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KPropertyItemField, { props: makeProps(serviceProps), global: { stubs } })
    wrapper.vm.fill('XYZ')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('XYZ')
  })
})

describe('KUnitField', () => {
  const stubs = { 'q-select': selectStub }
  const unitOptions = [{ name: 'm', label: 'Meter' }, { name: 'km', label: 'Kilometer' }]

  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KUnitField, { props: makeProps({ field: { options: unitOptions } }), global: { stubs } })
    expect(wrapper.findComponent(selectStub).exists()).toBe(true)
  })

  it('renders model value in readOnly mode', () => {
    const wrapper = mount(KUnitField, { props: { ...makeProps({ field: {} }), readOnly: true, values: { test: 'm' } }, global: { stubs } })
    expect(wrapper.text()).toContain('m')
  })

  it('builds options from field.options when no getUnits inject', () => {
    const wrapper = mount(KUnitField, { props: makeProps({ field: { options: unitOptions } }), global: { stubs } })
    expect(wrapper.vm.options.map(o => o.value)).toEqual(['m', 'km'])
  })

  it('uses getUnits inject when provided', () => {
    const mockGetUnits = vi.fn().mockReturnValue([{ name: 'kg', label: 'Kilogram' }])
    const wrapper = mount(KUnitField, {
      props: makeProps({ field: { quantity: 'mass' } }),
      global: { stubs, provide: { getUnits: mockGetUnits } }
    })
    expect(mockGetUnits).toHaveBeenCalledWith('mass')
    expect(wrapper.vm.options[0].value).toBe('kg')
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KUnitField, { props: makeProps({ field: { options: unitOptions } }), global: { stubs } })
    wrapper.vm.fill('km')
    expect(wrapper.vm.value()).toBe('km')
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KUnitField, { props: makeProps({ field: { options: unitOptions } }), global: { stubs } })
    wrapper.vm.fill('m')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'm'])
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KUnitField, { props: makeProps({ field: {} }), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KUnitField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('applies unit filter from field.filter when getUnits is provided', () => {
    const mockGetUnits = vi.fn().mockReturnValue([{ name: 'm', label: 'Meter' }, { name: 'km', label: 'Kilometer' }, { name: 'cm', label: 'Centimeter' }])
    const wrapper = mount(KUnitField, {
      props: makeProps({ field: { quantity: 'length', filter: ['m', 'km'] } }),
      global: { stubs, provide: { getUnits: mockGetUnits } }
    })
    expect(wrapper.vm.options.map(o => o.value)).toEqual(['m', 'km'])
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KUnitField, { props: makeProps({ field: { options: unitOptions } }), global: { stubs } })
    wrapper.vm.fill('m')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('values prop initializes the model', () => {
    const wrapper = mount(KUnitField, { props: { ...makeProps({ field: { options: unitOptions } }), values: { test: 'km' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('km')
  })

  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KUnitField, { props: makeProps({ field: { options: unitOptions } }), global: { stubs } })
    await wrapper.setProps({ values: { test: 'km' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('km')
  })

  it('field.options value key overrides name', () => {
    const opts = [{ value: 'meter', name: 'm', label: 'Meter' }]
    const wrapper = mount(KUnitField, { props: makeProps({ field: { options: opts } }), global: { stubs } })
    expect(wrapper.vm.options[0].value).toBe('meter')
  })

  it('apply writes the model value to a target object', () => {
    const wrapper = mount(KUnitField, { props: makeProps({ field: { options: unitOptions } }), global: { stubs } })
    wrapper.vm.fill('km')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('km')
  })
})

// ─── KFileField ─────────────────────────────────────────────────────────────

describe('KFileField', () => {
  const fileStub = { template: '<input type="file" />', props: ['modelValue', 'accept', 'multiple'], emits: ['update:modelValue', 'rejected'] }
  const stubs = { 'q-file': fileStub, 'q-field': fieldStub, 'q-chip': true }

  function makeFile (name = 'test.txt', type = 'text/plain') {
    return { name, type, size: 100, File: {} }
  }

  it('renders q-file in edit mode when model is empty', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  it('renders q-field when model already has a file', () => {
    const wrapper = mount(KFileField, { props: { ...makeProps(), values: { test: makeFile() } }, global: { stubs } })
    expect(wrapper.find('input[type="file"]').exists()).toBe(false)
  })

  it('renders chips in readOnly mode for a single file', () => {
    const wrapper = mount(KFileField, { props: { ...makeProps(), readOnly: true, values: { test: makeFile('photo.jpg') } }, global: { stubs } })
    expect(wrapper.findAll('q-chip-stub').length).toBe(1)
  })

  it('renders a chip per file in readOnly mode with multiple=true', () => {
    const files = [makeFile('a.txt'), makeFile('b.txt')]
    const wrapper = mount(KFileField, { props: { ...makeProps({ field: { multiple: true } }), readOnly: true, values: { test: files } }, global: { stubs } })
    expect(wrapper.findAll('q-chip-stub').length).toBe(2)
  })

  it('emptyModel returns null for single-file mode', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBeNull()
  })

  it('emptyModel returns [] for multiple-file mode', () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { multiple: true } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual([])
  })

  it('isEmpty returns true when no file is set', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false after fill', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(makeFile())
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('fill sets the model', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    const f = makeFile('doc.pdf')
    wrapper.vm.fill(f)
    expect(wrapper.vm.value()).toEqual(f)
  })

  it('clear resets model to null (single)', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(makeFile())
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('clear resets model to [] (multiple)', () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { multiple: true } }), global: { stubs } })
    wrapper.vm.fill([makeFile()])
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toEqual([])
  })

  it('onFileCleared resets model and files ref', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(makeFile())
    wrapper.vm.onFileCleared()
    expect(wrapper.vm.files).toBeNull()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('onFilesChanged with no files resets model', async () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.files = null
    await wrapper.vm.onFilesChanged()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('onFilesChanged builds a single-file model', async () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.files = { name: 'img.png', type: 'image/png', size: 200 }
    await wrapper.vm.onFilesChanged()
    expect(wrapper.vm.value()).toMatchObject({ name: 'img.png', type: 'image/png' })
  })

  it('onFilesChanged builds an array model for multiple', async () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { multiple: true } }), global: { stubs } })
    wrapper.vm.files = [{ name: 'a.txt', type: 'text/plain' }, { name: 'b.txt', type: 'text/plain' }]
    await wrapper.vm.onFilesChanged()
    expect(wrapper.vm.value()).toHaveLength(2)
  })

  it('onFilesChanged emits field-changed', async () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.files = { name: 'x.txt', type: 'text/plain' }
    await wrapper.vm.onFilesChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  it('displayName returns filename for single file', () => {
    const wrapper = mount(KFileField, { props: { ...makeProps(), values: { test: makeFile('report.pdf') } }, global: { stubs } })
    expect(wrapper.vm.displayName).toBe('report.pdf')
  })

  it('displayName joins names for multiple files', () => {
    const files = [makeFile('a.txt'), makeFile('b.txt')]
    const wrapper = mount(KFileField, { props: { ...makeProps({ field: { multiple: true } }), values: { test: files } }, global: { stubs } })
    expect(wrapper.vm.displayName).toBe('a.txt, b.txt')
  })

  it('maxFiles defaults to 1 for single-file mode', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.maxFiles).toBe(1)
  })

  it('maxFiles defaults to 9 for multiple-file mode', () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { multiple: true } }), global: { stubs } })
    expect(wrapper.vm.maxFiles).toBe(9)
  })

  it('maxFileSize defaults to 1 MB', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.maxFileSize).toBe(1048576)
  })

  it('isClearable defaults to true', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isClearable).toBe(true)
  })

  it('isClearable respects field.clearable', () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { clearable: false } }), global: { stubs } })
    expect(wrapper.vm.isClearable).toBe(false)
  })

  it('values prop initializes model', () => {
    const f = makeFile('init.txt')
    const wrapper = mount(KFileField, { props: { ...makeProps(), values: { test: f } }, global: { stubs } })
    expect(wrapper.vm.value()).toEqual(f)
  })

  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    const f = makeFile('new.txt')
    await wrapper.setProps({ values: { test: f } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(f)
  })

  it('invalidate sets hasError', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears error', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('apply writes model to object', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    const f = makeFile('upload.csv')
    wrapper.vm.fill(f)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual(f)
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })

  it('filterSelectedFiles returns all files when no filter is set', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    const files = [{ name: 'a.csv' }, { name: 'b.json' }]
    expect(wrapper.vm.filterSelectedFiles(files)).toEqual(files)
  })

  it('filterSelectedFiles keeps only files whose name includes field.filter', () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { filter: '.csv' } }), global: { stubs } })
    const files = [{ name: 'data.csv' }, { name: 'image.png' }]
    expect(wrapper.vm.filterSelectedFiles(files)).toEqual([{ name: 'data.csv' }])
  })

  it('filterSelectedFiles returns empty array when no files match', () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { filter: '.pdf' } }), global: { stubs } })
    const files = [{ name: 'data.csv' }, { name: 'image.png' }]
    expect(wrapper.vm.filterSelectedFiles(files)).toEqual([])
  })
})

// ─── KTagField ──────────────────────────────────────────────────────────────

describe('KTagField', () => {
  const stubs = { 'q-select': selectStub, 'q-chip': true, 'q-item': true, 'q-item-section': true }

  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('renders a chip in readOnly mode when model is set', () => {
    const wrapper = mount(KTagField, { props: { ...makeProps(), readOnly: true, values: { test: { name: 'vue', color: 'green' } } }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
  })

  it('emptyModel returns null for single-select', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBeNull()
  })

  it('emptyModel returns [] for multiselect', () => {
    const wrapper = mount(KTagField, { props: makeProps({ multiselect: true }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual([])
  })

  it('isEmpty returns true when model is null', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false after fill', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'vue', color: 'green' })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('fill sets model and syncs items', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    const tag = { name: 'typescript', color: 'blue' }
    wrapper.vm.fill(tag)
    expect(wrapper.vm.value()).toEqual(tag)
    expect(wrapper.vm.items).toEqual(tag)
  })

  it('clear resets model to null (single)', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'vue', color: 'green' })
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('clear resets model to [] (multiselect)', () => {
    const wrapper = mount(KTagField, { props: makeProps({ multiselect: true }), global: { stubs } })
    wrapper.vm.fill([{ name: 'vue', color: 'green' }])
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toEqual([])
  })

  it('getId returns kebab-cased tag name', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getId({ name: 'My Tag' })).toBe('my-tag')
  })

  it('isClearable defaults to true', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isClearable).toBe(true)
  })

  it('isClearable respects field.clearable', () => {
    const wrapper = mount(KTagField, { props: makeProps({ field: { clearable: false } }), global: { stubs } })
    expect(wrapper.vm.isClearable).toBe(false)
  })

  it('onSearch aborts when pattern is too short', async () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    const abort = vi.fn()
    await wrapper.vm.onSearch('a', vi.fn(), abort)
    expect(abort).toHaveBeenCalled()
  })

  it('onSearch calls search inject', async () => {
    const mockSearch = vi.fn().mockResolvedValue([{ name: 'vue', color: 'green' }])
    const wrapper = mount(KTagField, {
      props: makeProps({ services: [{ service: 'tags' }] }),
      global: { stubs, provide: { search: mockSearch } }
    })
    const update = vi.fn(fn => fn())
    await wrapper.vm.onSearch('vue', update, vi.fn())
    expect(mockSearch).toHaveBeenCalled()
    expect(wrapper.vm.options).toHaveLength(1)
  })

  it('onSearch adds create option when pattern not in results', async () => {
    const mockSearch = vi.fn().mockResolvedValue([])
    const wrapper = mount(KTagField, {
      props: makeProps({ services: [{ service: 'tags' }] }),
      global: { stubs, provide: { search: mockSearch } }
    })
    const update = vi.fn(fn => fn())
    await wrapper.vm.onSearch('newtag', update, vi.fn())
    expect(wrapper.vm.options.some(o => o.create)).toBe(true)
  })

  it('onSelected updates model and emits field-changed', async () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    wrapper.vm.items = { name: 'react', color: 'blue' }
    await wrapper.vm.onSelected({ name: 'react', color: 'blue' })
    expect(wrapper.vm.value()).toEqual({ name: 'react', color: 'blue' })
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  it('onSelected with null resets model', async () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'vue', color: 'green' })
    await wrapper.vm.onSelected(null)
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('onSelected calls createTag for new tags', async () => {
    const mockCreateTag = vi.fn().mockResolvedValue({ _id: '1' })
    const wrapper = mount(KTagField, {
      props: makeProps({ field: { service: 'items', property: 'tags' } }),
      global: { stubs, provide: { createTag: mockCreateTag } }
    })
    wrapper.vm.items = [{ name: 'brand-new', color: 'grey', create: true }]
    await wrapper.vm.onSelected([{ name: 'brand-new', color: 'grey', create: true }])
    expect(mockCreateTag).toHaveBeenCalled()
  })

  it('values prop initializes model', () => {
    const tag = { name: 'vue', color: 'green' }
    const wrapper = mount(KTagField, { props: { ...makeProps(), values: { test: tag } }, global: { stubs } })
    expect(wrapper.vm.value()).toEqual(tag)
  })

  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    const tag = { name: 'react', color: 'blue' }
    await wrapper.setProps({ values: { test: tag } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(tag)
  })

  it('invalidate sets hasError', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears error', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('apply writes model to object', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    const tag = { name: 'css', color: 'purple' }
    wrapper.vm.fill(tag)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual(tag)
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KTagField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })
})

// ─── KIconField ─────────────────────────────────────────────────────────────

describe('KIconField', () => {
  // Renders both prepend and control slots so the q-btn inside prepend is accessible
  const iconFieldFieldStub = { template: '<div><slot name="prepend" /><slot name="control" /><slot name="default" /></div>', props: ['modelValue'] }
  const stubs = { 'q-field': iconFieldFieldStub, 'q-btn': iconStub, 'q-dialog': dialogStub, 'q-card': true, 'q-card-section': true, 'q-card-actions': true, 'q-input': inputStub, 'q-icon': true }

  it('renders a q-field in edit mode', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('renders a q-icon in readOnly mode when model is set', () => {
    const wrapper = mount(KIconField, { props: { ...makeProps(), readOnly: true, values: { test: { name: 'star', color: 'yellow' } } }, global: { stubs } })
    expect(wrapper.find('q-icon-stub').exists()).toBe(true)
  })

  it('emptyModel returns {name, color} when hasColor is true (default)', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual({ name: '', color: '' })
  })

  it('emptyModel returns empty string when field.color is false', () => {
    const wrapper = mount(KIconField, { props: makeProps({ field: { color: false } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe('')
  })

  it('isEmpty returns true when icon name is empty', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false after fill with icon object', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'star', color: 'yellow' })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('iconName computed returns name from object model', () => {
    const wrapper = mount(KIconField, { props: { ...makeProps(), values: { test: { name: 'home', color: 'blue' } } }, global: { stubs } })
    expect(wrapper.vm.iconName).toBe('home')
  })

  it('iconName computed returns string model directly', () => {
    const wrapper = mount(KIconField, { props: makeProps({ field: { color: false } }), global: { stubs } })
    wrapper.vm.fill('favorite')
    expect(wrapper.vm.iconName).toBe('favorite')
  })

  it('iconColor returns empty string when model has no color set (emptyModel has color: "")', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.iconColor).toBe('')
  })

  it('iconColor reads color from model object', () => {
    const wrapper = mount(KIconField, { props: { ...makeProps(), values: { test: { name: 'star', color: 'red' } } }, global: { stubs } })
    expect(wrapper.vm.iconColor).toBe('red')
  })

  it('onCleared resets model and emits field-changed', async () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'star', color: 'red' })
    await wrapper.vm.onCleared()
    expect(wrapper.vm.isEmpty()).toBe(true)
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  it('isClearable defaults to true', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(true)
  })

  it('isClearable respects field.clearable', () => {
    const wrapper = mount(KIconField, { props: makeProps({ field: { clearable: false } }), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(false)
  })

  it('fill sets the model', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'home', color: 'blue' })
    expect(wrapper.vm.value()).toEqual({ name: 'home', color: 'blue' })
  })

  it('clear resets model to emptyModel', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'star', color: 'red' })
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('values prop initializes model', () => {
    const icon = { name: 'home', color: 'blue' }
    const wrapper = mount(KIconField, { props: { ...makeProps(), values: { test: icon } }, global: { stubs } })
    expect(wrapper.vm.value()).toEqual(icon)
  })

  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    const icon = { name: 'search', color: 'green' }
    await wrapper.setProps({ values: { test: icon } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(icon)
  })

  it('invalidate sets hasError', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears error', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('apply writes model to object', () => {
    const wrapper = mount(KIconField, { props: makeProps(), global: { stubs } })
    const icon = { name: 'lock', color: 'grey' }
    wrapper.vm.fill(icon)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual(icon)
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KIconField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })
})

// ─── KColorScaleField ────────────────────────────────────────────────────────

describe('KColorScaleField', () => {
  const stubs = { 'q-select': selectStub, 'q-item': true, 'q-item-section': true, 'q-item-label': true }

  const colorScaleOptions = [
    { label: 'Reds', value: { colors: ['#fee', '#f00'] } },
    { label: 'Blues', value: { colors: ['#eef', '#00f'] } }
  ]

  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('renders text in readOnly mode when model is set', () => {
    const wrapper = mount(KColorScaleField, {
      props: { ...makeProps({ field: { options: colorScaleOptions } }), readOnly: true, values: { test: colorScaleOptions[0].value } },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('Reds')
  })

  it('options computed from field.options', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    expect(wrapper.vm.getOptions()).toHaveLength(2)
  })

  it('options defaults to [] when not defined', () => {
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
    expect(wrapper.vm.getId({ label: 'Red Scale', value: {} })).toBe('red-scale')
  })

  it('getLabel finds matching option label by value', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    expect(wrapper.vm.getLabel(colorScaleOptions[0].value)).toBe('Reds')
  })

  it('getLabel returns empty string when value not found', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getLabel({ colors: ['#000'] })).toBe('')
  })

  it('getScaleStyle returns background gradient for colors array', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    const style = wrapper.vm.getScaleStyle({ colors: ['#fee', '#f00'] })
    expect(style.background).toMatch(/linear-gradient/)
  })

  it('getScaleStyle returns empty object for null value', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getScaleStyle(null)).toEqual({})
  })

  it('getScaleStyle returns empty object when no colors', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getScaleStyle({})).toEqual({})
  })

  it('fill sets model', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    wrapper.vm.fill(colorScaleOptions[0].value)
    expect(wrapper.vm.value()).toEqual(colorScaleOptions[0].value)
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    wrapper.vm.fill(colorScaleOptions[0].value)
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    wrapper.vm.fill(colorScaleOptions[1].value)
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0][0]).toBe('test')
  })

  it('values prop initializes model', () => {
    const wrapper = mount(KColorScaleField, {
      props: { ...makeProps({ field: { options: colorScaleOptions } }), values: { test: colorScaleOptions[1].value } },
      global: { stubs }
    })
    expect(wrapper.vm.value()).toEqual(colorScaleOptions[1].value)
  })

  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    await wrapper.setProps({ values: { test: colorScaleOptions[0].value } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(colorScaleOptions[0].value)
  })

  it('invalidate sets hasError', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears error', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('apply writes model to object', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { options: colorScaleOptions } }), global: { stubs } })
    wrapper.vm.fill(colorScaleOptions[0].value)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual(colorScaleOptions[0].value)
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KColorScaleField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })
})

// ─── KDateTimeRangeField ────────────────────────────────────────────────────

describe('KDateTimeRangeField', () => {
  const stubs = { 'q-field': fieldStub }

  it('renders two datetime-local inputs in edit mode', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.findAll('input[type="datetime-local"]')).toHaveLength(2)
  })

  it('renders formatted text in readOnly mode', () => {
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps(), readOnly: true, values: { test: { start: '2024-01-01T00:00', end: '2024-01-02T00:00' } } },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('2024-01-01T00:00')
    expect(wrapper.text()).toContain('2024-01-02T00:00')
  })

  it('emptyModel returns object with start and end keys', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual({ start: '', end: '' })
  })

  it('emptyModel respects custom field.start and field.end names', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps({ field: { start: 'from', end: 'to' } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual({ from: '', to: '' })
  })

  it('isEmpty returns true when both start and end are empty', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ start: '', end: '' })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false when start is set', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ start: '2024-01-01T00:00', end: '' })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('startValue reads the start field from model', () => {
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps(), values: { test: { start: '2024-06-01T10:00', end: '' } } },
      global: { stubs }
    })
    expect(wrapper.vm.startValue).toBe('2024-06-01T10:00')
  })

  it('endValue reads the end field from model', () => {
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps(), values: { test: { start: '', end: '2024-06-05T18:00' } } },
      global: { stubs }
    })
    expect(wrapper.vm.endValue).toBe('2024-06-05T18:00')
  })

  it('startValue reads custom field name from field.start', () => {
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps({ field: { start: 'from', end: 'to' } }), values: { test: { from: '2024-01-01T09:00', to: '' } } },
      global: { stubs }
    })
    expect(wrapper.vm.startValue).toBe('2024-01-01T09:00')
  })

  it('formattedDateTimeRange shows both values separated by em dash', () => {
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps(), values: { test: { start: '2024-01-01T00:00', end: '2024-01-02T00:00' } } },
      global: { stubs }
    })
    expect(wrapper.vm.formattedDateTimeRange).toMatch(/2024-01-01T00:00.*2024-01-02T00:00/)
  })

  it('formattedDateTimeRange returns empty string when model is null', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.formattedDateTimeRange).toBe('')
  })

  it('onStartChanged updates start in model and emits field-changed', async () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ start: '', end: '2024-12-31T00:00' })
    await wrapper.vm.onStartChanged({ target: { value: '2024-06-01T08:00' } })
    expect(wrapper.vm.startValue).toBe('2024-06-01T08:00')
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  it('onEndChanged updates end in model and emits field-changed', async () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ start: '2024-01-01T00:00', end: '' })
    await wrapper.vm.onEndChanged({ target: { value: '2024-12-31T23:59' } })
    expect(wrapper.vm.endValue).toBe('2024-12-31T23:59')
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  it('fill sets model', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    const range = { start: '2024-01-01T00:00', end: '2024-01-07T00:00' }
    wrapper.vm.fill(range)
    expect(wrapper.vm.value()).toEqual(range)
  })

  it('clear resets model to emptyModel', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ start: '2024-01-01T00:00', end: '2024-01-07T00:00' })
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('clear uses properties.default when defined', () => {
    const defaultRange = { start: '2020-01-01T00:00', end: '2020-01-31T00:00' }
    const wrapper = mount(KDateTimeRangeField, { props: makeProps({ default: defaultRange }), global: { stubs } })
    wrapper.vm.fill({ start: '2024-01-01T00:00', end: '2024-01-07T00:00' })
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toEqual(defaultRange)
  })

  it('values prop initializes model', () => {
    const range = { start: '2024-03-01T08:00', end: '2024-03-15T17:00' }
    const wrapper = mount(KDateTimeRangeField, { props: { ...makeProps(), values: { test: range } }, global: { stubs } })
    expect(wrapper.vm.value()).toEqual(range)
  })

  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    const range = { start: '2025-01-01T00:00', end: '2025-01-31T00:00' }
    await wrapper.setProps({ values: { test: range } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(range)
  })

  it('invalidate sets hasError', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid range')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears error', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid range')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('apply writes model to object', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    const range = { start: '2024-06-01T00:00', end: '2024-06-30T00:00' }
    wrapper.vm.fill(range)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual(range)
  })

  it('field.disabled disables the field', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  })
})
