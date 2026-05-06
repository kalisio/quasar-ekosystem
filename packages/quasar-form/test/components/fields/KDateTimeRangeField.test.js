import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KDateTimeRangeField from '../../../src/components/KDateTimeRangeField.vue'

const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KDateTimeRangeField', () => {
  const stubs = { 'q-field': fieldStub }

  // Two native datetime-local inputs are rendered in edit mode
  it('renders two datetime-local inputs in edit mode', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.findAll('input[type="datetime-local"]')).toHaveLength(2)
  })

  // field.start and field.end allow renaming the stored keys (e.g. from/to)
  it('emptyModel respects custom field.start and field.end names', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps({ field: { start: 'from', end: 'to' } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual({ from: '', to: '' })
  })

  // startValue computed accessor for the native input value binding
  it('startValue reads the start field from model', () => {
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps(), values: { test: { start: '2024-06-01T10:00', end: '' } } },
      global: { stubs }
    })
    expect(wrapper.vm.startValue).toBe('2024-06-01T10:00')
  })

  // formattedDateTimeRange is shown in readOnly mode
  it('formattedDateTimeRange shows both values', () => {
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps(), values: { test: { start: '2024-01-01T00:00', end: '2024-01-02T00:00' } } },
      global: { stubs }
    })
    expect(wrapper.vm.formattedDateTimeRange).toMatch(/2024-01-01T00:00.*2024-01-02T00:00/)
  })

  // onStartChanged updates only the start half and emits field-changed
  it('onStartChanged updates start in model and emits field-changed', async () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ start: '', end: '2024-12-31T00:00' })
    await wrapper.vm.onStartChanged({ target: { value: '2024-06-01T08:00' } })
    expect(wrapper.vm.startValue).toBe('2024-06-01T08:00')
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  // clear can restore a default range instead of an empty one when properties.default is set
  it('clear uses properties.default when defined', () => {
    const defaultRange = { start: '2020-01-01T00:00', end: '2020-01-31T00:00' }
    const wrapper = mount(KDateTimeRangeField, { props: makeProps({ default: defaultRange }), global: { stubs } })
    wrapper.vm.fill({ start: '2024-01-01T00:00', end: '2024-01-07T00:00' })
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toEqual(defaultRange)
  })

  // If values prop changes after mount, the model should update reactively
  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    const range = { start: '2025-01-01T00:00', end: '2025-01-31T00:00' }
    await wrapper.setProps({ values: { test: range } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(range)
  })

  it('isEmpty returns true when both start and end are empty', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false when start is set', () => {
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps(), values: { test: { start: '2024-01-01T00:00', end: '' } } },
      global: { stubs }
    })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('endValue reads the end field from model', () => {
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps(), values: { test: { start: '', end: '2024-12-31T00:00' } } },
      global: { stubs }
    })
    expect(wrapper.vm.endValue).toBe('2024-12-31T00:00')
  })

  it('formattedDateTimeRange returns empty string when both values are absent', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.formattedDateTimeRange).toBe('')
  })

  it('onEndChanged updates end in model and emits field-changed', async () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ start: '2024-01-01T00:00', end: '' })
    await wrapper.vm.onEndChanged({ target: { value: '2024-12-31T23:59' } })
    expect(wrapper.vm.endValue).toBe('2024-12-31T23:59')
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  it('maxStart is constrained by endValue when end is set', () => {
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps(), values: { test: { start: '', end: '2024-06-30T00:00' } } },
      global: { stubs }
    })
    expect(wrapper.vm.maxStart).toBe('2024-06-30T00:00')
  })

  it('minEnd is constrained by startValue when start is set', () => {
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps(), values: { test: { start: '2024-01-15T00:00', end: '' } } },
      global: { stubs }
    })
    expect(wrapper.vm.minEnd).toBe('2024-01-15T00:00')
  })

  it('apply writes model to a target object', () => {
    const range = { start: '2024-01-01T00:00', end: '2024-01-31T00:00' }
    const wrapper = mount(KDateTimeRangeField, {
      props: { ...makeProps(), values: { test: range } },
      global: { stubs }
    })
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual(range)
  })

  it('clear resets model to empty start/end', () => {
    const wrapper = mount(KDateTimeRangeField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ start: '2024-01-01T00:00', end: '2024-01-31T00:00' })
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })
})
