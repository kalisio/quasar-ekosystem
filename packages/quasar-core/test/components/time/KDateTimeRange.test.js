import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KDateTimeRange from '../../../src/components/time/KDateTimeRange.vue'
// import { Time } from '../../../src/time.js'

// beforeAll(() => { Time.initialize() })

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

  it('onRangeChanged resets rangeModel to 0/100 when duration is zero', async () => {
    const sameTime = '2024-06-15T12:00:00.000Z'
    const wrapper = mount(KDateTimeRange, {
      props: {
        modelValue: { start: sameTime, end: sameTime },
        min: sameTime,
        max: sameTime
      }
    })
    wrapper.vm.startTimeModel = sameTime
    wrapper.vm.endTimeModel = sameTime
    wrapper.vm.onRangeChanged()
    await new Promise((resolve) => setTimeout(resolve, 150))
    expect(wrapper.vm.rangeModel.min).toBe(0)
    expect(wrapper.vm.rangeModel.max).toBe(100)
  })

  it('onSliderUpdated computes start/end from slider position when duration > 0', () => {
    const wrapper = mount(KDateTimeRange, {
      props: {
        min: '2024-01-01T00:00:00.000Z',
        max: '2024-12-31T23:59:59.000Z',
        slider: { min: 0, max: 100 }
      }
    })
    wrapper.vm.rangeModel.min = 25
    wrapper.vm.rangeModel.max = 75
    wrapper.vm.onSliderUpdated()
    expect(wrapper.vm.startTimeModel).toBeTruthy()
    expect(wrapper.vm.endTimeModel).toBeTruthy()
  })

  it('onSliderUpdated sets start/end to min/max when duration is zero', () => {
    const sameTime = '2024-06-15T12:00:00.000Z'
    const wrapper = mount(KDateTimeRange, {
      props: {
        min: sameTime,
        max: sameTime,
        slider: { min: 0, max: 100 }
      }
    })
    wrapper.vm.onSliderUpdated()
    expect(wrapper.vm.startTimeModel).toBe(sameTime)
    expect(wrapper.vm.endTimeModel).toBe(sameTime)
  })

  it('onSliderChanged triggers emit', async () => {
    const wrapper = mount(KDateTimeRange, {
      props: {
        modelValue: {
          start: '2024-06-01T00:00:00.000Z',
          end: '2024-06-30T23:59:59.000Z'
        }
      }
    })
    wrapper.vm.onSliderChanged()
    await new Promise((resolve) => setTimeout(resolve, 150))
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
