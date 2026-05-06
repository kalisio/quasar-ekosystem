import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import KDateTimeRange from '../../../src/components/time/KDateTimeRange.vue'
import { Time } from '../../../src/time.js'

beforeAll(() => { Time.initialize() })

describe('KDateTimeRange', () => {
  it('mounts without errors', () => {
    const wrapper = mount(KDateTimeRange)
    expect(wrapper.exists()).toBe(true)
  })

  it('mounts with a valid modelValue', () => {
    const wrapper = mount(KDateTimeRange, {
      props: {
        modelValue: {
          start: '2024-06-01T00:00:00.000Z',
          end: '2024-06-30T23:59:59.000Z'
        },
        min: '2024-01-01T00:00:00.000Z',
        max: '2024-12-31T23:59:59.000Z'
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('initializes startTimeModel from modelValue', () => {
    const start = '2024-06-01T00:00:00.000Z'
    const wrapper = mount(KDateTimeRange, {
      props: {
        modelValue: { start, end: '2024-06-30T23:59:59.000Z' },
        min: '2024-01-01T00:00:00.000Z',
        max: '2024-12-31T23:59:59.000Z'
      }
    })
    expect(wrapper.vm.startTimeModel).toBe(start)
  })

  it('initializes endTimeModel from modelValue', () => {
    const end = '2024-06-30T23:59:59.000Z'
    const wrapper = mount(KDateTimeRange, {
      props: {
        modelValue: { start: '2024-06-01T00:00:00.000Z', end },
        min: '2024-01-01T00:00:00.000Z',
        max: '2024-12-31T23:59:59.000Z'
      }
    })
    expect(wrapper.vm.endTimeModel).toBe(end)
  })

  it('canDisplaySlider is false without slider and min/max', () => {
    const wrapper = mount(KDateTimeRange)
    expect(wrapper.vm.canDisplaySlider).toBe(false)
  })

  it('canDisplaySlider is false when slider is set but min/max are missing', () => {
    const wrapper = mount(KDateTimeRange, { props: { slider: { min: 0, max: 100 } } })
    expect(wrapper.vm.canDisplaySlider).toBe(false)
  })

  it('canDisplaySlider is true when slider, min and max are all set', () => {
    const wrapper = mount(KDateTimeRange, {
      props: {
        slider: { min: 0, max: 100 },
        min: '2024-01-01T00:00:00.000Z',
        max: '2024-12-31T23:59:59.000Z'
      }
    })
    expect(wrapper.vm.canDisplaySlider).toBe(true)
  })

  it('renders separator text between start and end pickers', () => {
    const wrapper = mount(KDateTimeRange, { props: { separator: '/' } })
    expect(wrapper.text()).toContain('/')
  })

  it('onRangeChanged emits update:modelValue', async () => {
    const wrapper = mount(KDateTimeRange, {
      props: {
        modelValue: {
          start: '2024-06-01T00:00:00.000Z',
          end: '2024-06-30T23:59:59.000Z'
        },
        min: '2024-01-01T00:00:00.000Z',
        max: '2024-12-31T23:59:59.000Z'
      }
    })
    wrapper.vm.onRangeChanged()
    await new Promise((resolve) => setTimeout(resolve, 150))
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toHaveProperty('start')
    expect(emitted[0][0]).toHaveProperty('end')
  })
})
