import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
// import { nextTick } from 'vue'

import KDatetimeField from '../../../src/components/KDatetimeField.vue'

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

describe('KDatetimeField', () => {
  const stubs = { 'q-field': fieldStub }

  // Edit mode renders a native datetime-local input.
  it('renders a datetime-local input in edit mode', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="datetime-local"]').exists()).toBe(true)
  })

  // readOnly shows the raw ISO string (no formatting).
  it('renders the model value in readOnly mode', () => {
    const isoDate = '2024-06-15T10:30:00.000Z'
    const wrapper = mount(KDatetimeField, { props: { ...makeProps(), readOnly: true, values: { test: isoDate } }, global: { stubs } })
    expect(wrapper.find('div').text()).toBe(isoDate)
  })

  // emptyModel defaults to now (current timestamp), not null or a fixed value.
  it('initializes model to current datetime when no values provided', () => {
    const before = Date.now()
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    const after = Date.now()
    const modelTime = new Date(wrapper.vm.value()).getTime()
    expect(modelTime).toBeGreaterThanOrEqual(before)
    expect(modelTime).toBeLessThanOrEqual(after)
  })

  // emptyModel returns a valid ISO string, not null or empty.
  it('emptyModel returns an ISO date string', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  // A datetime field always has a value, so isEmpty is always false.
  it('isEmpty always returns false', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  /* it('fill sets the model value', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024-01-01T00:00:00.000Z')
    expect(wrapper.vm.value()).toBe('2024-01-01T00:00:00.000Z')
  }) */

  // clear() resets to "now" (emptyModel), not to the previously filled value.
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

  // If values prop is provided on mount, the model should be initialized with the matching value.
  it('values prop initializes the model', () => {
    const isoDate = '2024-03-15T12:00:00.000Z'
    const wrapper = mount(KDatetimeField, { props: { ...makeProps(), values: { test: isoDate } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe(isoDate)
  })

  // field.defaultOffset shifts the emptyModel timestamp by a fixed number of seconds.
  it('field.defaultOffset shifts emptyModel by seconds', () => {
    const offset = 3600 // +1 hour
    const before = Date.now() + offset * 1000
    const wrapper = mount(KDatetimeField, { props: makeProps({ field: { defaultOffset: offset } }), global: { stubs } })
    const after = Date.now() + offset * 1000
    const modelTime = new Date(wrapper.vm.emptyModel()).getTime()
    expect(modelTime).toBeGreaterThanOrEqual(before)
    expect(modelTime).toBeLessThanOrEqual(after)
  })

  /* it('onChanged emits field-changed', async () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024-06-01T08:00:00.000Z')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', '2024-06-01T08:00:00.000Z'])
  }) */

  // clear() uses properties.default if defined, instead of emptyModel (now).
  it('clear uses properties.default when defined', () => {
    const defaultDate = '2000-01-01T00:00:00.000Z'
    const wrapper = mount(KDatetimeField, { props: makeProps({ default: defaultDate }), global: { stubs } })
    wrapper.vm.fill('2024-06-01T08:00:00.000Z')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe(defaultDate)
  })

  /* it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    const newDate = '2025-01-15T12:00:00.000Z'
    await wrapper.setProps({ values: { test: newDate } })
    await nextTick()
    expect(wrapper.vm.value()).toBe(newDate)
  }) */

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('2024-06-01T08:00:00.000Z')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('2024-06-01T08:00:00.000Z')
  }) */

  /* it('invalidate sets hasError to true', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid date')
    expect(wrapper.vm.hasError).toBe(true)
  }) */

  /* it('validate clears the error', () => {
    const wrapper = mount(KDatetimeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid date')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  }) */
})
