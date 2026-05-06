import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import KTimeControl from '../../../src/components/time/KTimeControl.vue'
import { Time } from '../../../src/time.js'

// Renders a button that calls handler on click — allows triggering KTimeControl's action handlers
const kActionStub = {
  template: '<button :id="id" @click="handler && handler()"><slot /></button>',
  props: ['id', 'icon', 'tooltip', 'dense', 'handler']
}
const kDateTimeStub = { name: 'KDateTime', template: '<div />', props: ['modelValue', 'timezone', 'dense', 'options'], emits: ['update:modelValue'] }
const stubs = {
  KAction: kActionStub,
  KDateTime: kDateTimeStub,
  'q-badge': { template: '<span><slot /></span>', props: ['floating', 'rounded', 'color'] },
  'q-icon': true
}

beforeAll(() => { Time.initialize() })

describe('KTimeControl', () => {
  beforeEach(() => { Time.initialize() })
  afterEach(() => { if (Time.isRealtime()) Time.stopRealtime() })

  it('mounts without errors', () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    expect(wrapper.exists()).toBe(true)
  })

  // dense is driven by $q.screen.lt.sm — false in the test mock
  it('dense is false when screen is not small', () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    expect(wrapper.vm.dense).toBe(false)
  })

  // dateTime getter returns current time as ISO string
  it('dateTime getter returns current time as ISO string', () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    expect(wrapper.vm.dateTime).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  // dateTime setter calls Time.setCurrentTime
  it('dateTime setter updates the current time', () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    const iso = '2024-06-15T10:30:00.000Z'
    wrapper.vm.dateTime = iso
    expect(Time.getCurrentTime().toISOString()).toBe(iso)
  })

  // timezone computed reads from the store's time.format.timezone
  it('timezone computed returns the configured timezone', () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    expect(wrapper.vm.timezone).toBeTruthy()
  })

  // onRealTimeClicked starts realtime when not already running
  it('onRealTimeClicked starts realtime', async () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    await wrapper.find('#timecontrol-now').trigger('click')
    expect(Time.isRealtime()).toBe(true)
  })

  // onRealTimeClicked stops realtime when already running
  it('onRealTimeClicked stops realtime when already running', async () => {
    Time.startRealtime()
    const wrapper = mount(KTimeControl, { global: { stubs } })
    await wrapper.find('#timecontrol-now').trigger('click')
    expect(Time.isRealtime()).toBe(false)
  })

  // onPreviousStepClicked subtracts step minutes from current time
  it('onPreviousStepClicked moves time back by step', async () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    const before = Time.getCurrentTime().valueOf()
    await wrapper.find('#previous-step').trigger('click')
    expect(Time.getCurrentTime().valueOf()).toBeLessThan(before)
  })

  // onNextStepClicked adds step minutes to current time
  it('onNextStepClicked moves time forward by step', async () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    const before = Time.getCurrentTime().valueOf()
    await wrapper.find('#next-step').trigger('click')
    expect(Time.getCurrentTime().valueOf()).toBeGreaterThan(before)
  })

  // onPreviousHourClicked subtracts 1 hour
  it('onPreviousHourClicked moves time back one hour', async () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    const before = Time.getCurrentTime().valueOf()
    await wrapper.find('#previous-hour').trigger('click')
    expect(Time.getCurrentTime().valueOf()).toBeLessThan(before)
  })

  // onNextHourClicked adds 1 hour
  it('onNextHourClicked moves time forward one hour', async () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    const before = Time.getCurrentTime().valueOf()
    await wrapper.find('#next-hour').trigger('click')
    expect(Time.getCurrentTime().valueOf()).toBeGreaterThan(before)
  })

  // onPreviousDayClicked subtracts 1 day
  it('onPreviousDayClicked moves time back one day', async () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    const before = Time.getCurrentTime().valueOf()
    await wrapper.find('#previous-day').trigger('click')
    const diff = before - Time.getCurrentTime().valueOf()
    expect(diff).toBeCloseTo(24 * 60 * 60 * 1000, -3)
  })

  // onNextDayClicked adds 1 day
  it('onNextDayClicked moves time forward one day', async () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    const before = Time.getCurrentTime().valueOf()
    await wrapper.find('#next-day').trigger('click')
    const diff = Time.getCurrentTime().valueOf() - before
    expect(diff).toBeCloseTo(24 * 60 * 60 * 1000, -3)
  })

  // onStepClicked sets the step via Time.setStep
  it('onStepClicked updates the time step', () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    wrapper.vm.onStepClicked(60)
    expect(Time.getStep()).toBe(60)
  })

  // previous-step and next-step step size reflects current Time.getStep()
  it('previous-step moves by current step amount', async () => {
    Time.setStep(30)
    const wrapper = mount(KTimeControl, { global: { stubs } })
    const before = Time.getCurrentTime().valueOf()
    await wrapper.find('#previous-step').trigger('click')
    const diff = before - Time.getCurrentTime().valueOf()
    expect(diff).toBeCloseTo(30 * 60 * 1000, -3)
  })

  it('next-step moves by current step amount', async () => {
    Time.setStep(30)
    const wrapper = mount(KTimeControl, { global: { stubs } })
    const before = Time.getCurrentTime().valueOf()
    await wrapper.find('#next-step').trigger('click')
    const diff = Time.getCurrentTime().valueOf() - before
    expect(diff).toBeCloseTo(30 * 60 * 1000, -3)
  })

  // KDateTime v-model setter — emitting update:modelValue propagates to Time.setCurrentTime
  it('KDateTime v-model update sets current time', async () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    const iso = '2024-08-01T12:00:00.000Z'
    await wrapper.findComponent({ name: 'KDateTime' }).vm.$emit('update:modelValue', iso)
    expect(Time.getCurrentTime().toISOString()).toBe(iso)
  })

  // dense=false means non-dense action buttons are rendered
  it('renders previous-hour and next-hour in non-dense mode', () => {
    const wrapper = mount(KTimeControl, { global: { stubs } })
    expect(wrapper.find('#previous-hour').exists()).toBe(true)
    expect(wrapper.find('#next-hour').exists()).toBe(true)
    expect(wrapper.find('#previous-day').exists()).toBe(true)
    expect(wrapper.find('#next-day').exists()).toBe(true)
  })
})
