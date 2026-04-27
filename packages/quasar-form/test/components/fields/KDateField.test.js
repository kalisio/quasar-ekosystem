import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
// import { nextTick } from 'vue'

import KDateField from '../../../src/components/KDateField.vue'

config.global.mocks = {
  $t: (key) => key,
  $q: {
    iconSet: { editor: { align: 'format_align_left' } },
    lang: { editor: { align: 'Align' } },
    screen: {}
  }
}

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))

const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KDateField', () => {
  const stubs = { 'q-field': fieldStub }

  // Edit mode renders a native date input.
  it('renders a date input in edit mode', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="date"]').exists()).toBe(true)
  })

  // readOnly shows the raw date string (YYYY/MM/DD format).
  it('renders the model value in readOnly mode', () => {
    const wrapper = mount(KDateField, { props: { ...makeProps(), readOnly: true, values: { test: '2024/06/15' } }, global: { stubs } })
    expect(wrapper.find('div').text()).toBe('2024/06/15')
  })

  // emptyModel defaults to today, not null.
  it('initializes model to today when no values provided', () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/')
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toBe(today)
  })

  // Quasar date picker uses YYYY/MM/DD (slashes, not dashes).
  it('emptyModel returns date in YYYY/MM/DD format', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
  })

  // A date field always has a value, so isEmpty is always false.
  it('isEmpty always returns false', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  /* it('fill sets the model value', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024/01/01')
    expect(wrapper.vm.value()).toBe('2024/01/01')
  }) */

  // clear() resets to today (emptyModel), not to the previously filled value.
  it('clear resets to today', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2020/01/01')
    wrapper.vm.clear()
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/')
    expect(wrapper.vm.value()).toBe(today)
  })

  // If values prop is provided on mount, the model should be initialized with the matching value.
  it('values prop initializes the model', () => {
    const wrapper = mount(KDateField, { props: { ...makeProps(), values: { test: '2024/03/15' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('2024/03/15')
  })

  /* it('invalidate sets hasError to true', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid date')
    expect(wrapper.vm.hasError).toBe(true)
  }) */

  // Check that field-changed is emitted when the user picks a date.
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024/06/01')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', '2024/06/01'])
  })

  // clear() uses properties.default if defined, instead of today.
  it('clear uses properties.default when defined', () => {
    const wrapper = mount(KDateField, { props: makeProps({ default: '2000/01/01' }), global: { stubs } })
    wrapper.vm.fill('2024/06/01')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('2000/01/01')
  })

  /* it('validate clears the error', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid date')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  }) */

  /* it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: '2025/06/15' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('2025/06/15')
  }) */

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KDateField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024/06/01')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('2024/06/01')
  }) */

  /* it('field.disabled disables the field', () => {
    const wrapper = mount(KDateField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  }) */
})
