import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import KDateTime from '../../../src/components/time/KDateTime.vue'
import { Time } from '../../../src/time.js'

beforeAll(() => { Time.initialize() })

describe('KDateTime', () => {
  it('mounts without errors', () => {
    const wrapper = mount(KDateTime)
    expect(wrapper.exists()).toBe(true)
  })

  it('mounts with a valid ISO modelValue', () => {
    const iso = '2024-06-15T10:30:00.000Z'
    const wrapper = mount(KDateTime, { props: { modelValue: iso } })
    expect(wrapper.exists()).toBe(true)
  })

  it('computedDateModel returns null when no modelValue', () => {
    const wrapper = mount(KDateTime)
    expect(wrapper.vm.computedDateModel).toBeNull()
  })

  it('computedDateModel returns formatted date from modelValue', () => {
    const wrapper = mount(KDateTime, { props: { modelValue: '2024-06-15T10:30:00.000Z' } })
    expect(wrapper.vm.computedDateModel).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('computedTimeModel returns null when no modelValue', () => {
    const wrapper = mount(KDateTime)
    expect(wrapper.vm.computedTimeModel).toBeNull()
  })

  it('computedTimeModel returns formatted time from modelValue', () => {
    const wrapper = mount(KDateTime, { props: { modelValue: '2024-06-15T10:30:00.000Z' } })
    expect(wrapper.vm.computedTimeModel).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })

  it('setting computedDateModel emits update:modelValue as ISO string', async () => {
    const wrapper = mount(KDateTime)
    wrapper.vm.computedDateModel = '2024-06-15'
    await new Promise((resolve) => setTimeout(resolve, 150))
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('setting computedTimeModel after date emits update:modelValue', async () => {
    const wrapper = mount(KDateTime, { props: { modelValue: '2024-06-15T10:00:00.000Z' } })
    wrapper.vm.computedTimeModel = '12:30:00'
    await new Promise((resolve) => setTimeout(resolve, 150))
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('renders separator between date and time', () => {
    const wrapper = mount(KDateTime, { props: { separator: '|' } })
    expect(wrapper.text()).toContain('|')
  })

  it('computedDatePicker has no options when no min/max', () => {
    const wrapper = mount(KDateTime)
    expect(wrapper.vm.computedDatePicker.options).toBeUndefined()
  })

  it('computedDatePicker has options function when min is set', () => {
    const wrapper = mount(KDateTime, { props: { min: '2024-01-01T00:00:00.000Z' } })
    expect(typeof wrapper.vm.computedDatePicker.options).toBe('function')
  })

  it('computedTimePicker has options function when max is set', () => {
    const wrapper = mount(KDateTime, { props: { max: '2024-12-31T23:59:59.000Z' } })
    expect(typeof wrapper.vm.computedTimePicker.options).toBe('function')
  })

  it('checkDate returns false for date before min', () => {
    const min = '2024-06-01T00:00:00.000Z'
    const max = '2024-12-31T23:59:59.000Z'
    const wrapper = mount(KDateTime, {
      props: { modelValue: '2024-07-15T10:00:00.000Z', min, max }
    })
    const result = wrapper.vm.computedDatePicker.options('2024/05/01')
    expect(result).toBe(false)
  })

  it('checkDate returns true for date within range', () => {
    const min = '2024-01-01T00:00:00.000Z'
    const max = '2024-12-31T23:59:59.000Z'
    const wrapper = mount(KDateTime, {
      props: { modelValue: '2024-07-15T10:00:00.000Z', min, max }
    })
    const result = wrapper.vm.computedDatePicker.options('2024/07/15')
    expect(result).toBe(true)
  })

  it('checkTime returns false for hour before min constraint', () => {
    const min = '2024-06-15T14:00:00.000Z'
    const max = '2024-06-15T22:00:00.000Z'
    const wrapper = mount(KDateTime, {
      props: { modelValue: '2024-06-15T15:00:00.000Z', min, max }
    })
    const result = wrapper.vm.computedTimePicker.options('10', '00', '00')
    expect(result).toBe(false)
  })

  it('checkTime returns false for hour after max constraint', () => {
    const min = '2024-06-15T08:00:00.000Z'
    const max = '2024-06-15T18:00:00.000Z'
    const wrapper = mount(KDateTime, {
      props: { modelValue: '2024-06-15T12:00:00.000Z', min, max }
    })
    const result = wrapper.vm.computedTimePicker.options('23', '00', '00')
    expect(result).toBe(false)
  })

  it('checkTime returns true for hour within both constraints', () => {
    const min = '2024-06-15T08:00:00.000Z'
    const max = '2024-06-15T20:00:00.000Z'
    const wrapper = mount(KDateTime, {
      props: { modelValue: '2024-06-15T12:00:00.000Z', min, max }
    })
    const result = wrapper.vm.computedTimePicker.options('12', '00', '00')
    expect(result).toBe(true)
  })

  it('modelValue watcher updates the date part', async () => {
    const wrapper = mount(KDateTime, { props: { modelValue: '2024-06-15T10:00:00.000Z' } })
    await wrapper.setProps({ modelValue: '2024-09-20T08:00:00.000Z' })
    expect(wrapper.vm.computedDateModel).toContain('2024-09')
  })

  it('min watcher enables date constraint', async () => {
    const wrapper = mount(KDateTime, { props: { modelValue: '2024-06-15T10:00:00.000Z' } })
    expect(wrapper.vm.computedDatePicker.options).toBeUndefined()
    await wrapper.setProps({ min: '2024-01-01T00:00:00.000Z' })
    expect(typeof wrapper.vm.computedDatePicker.options).toBe('function')
  })

  it('max watcher enables time constraint', async () => {
    const wrapper = mount(KDateTime, { props: { modelValue: '2024-06-15T10:00:00.000Z' } })
    await wrapper.setProps({ max: '2024-12-31T23:59:59.000Z' })
    expect(typeof wrapper.vm.computedTimePicker.options).toBe('function')
  })

  it('timezone watcher recomputes dateTime and min/max', async () => {
    const wrapper = mount(KDateTime, {
      props: {
        modelValue: '2024-06-15T10:00:00.000Z',
        min: '2024-01-01T00:00:00.000Z',
        max: '2024-12-31T23:59:59.000Z',
        timezone: 'UTC'
      }
    })
    await wrapper.setProps({ timezone: 'Europe/Paris' })
    expect(wrapper.vm.computedDateModel).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
