import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import KTime from '../../../src/components/time/KTime.vue'
import { Time } from '../../../src/time.js'

beforeAll(() => { Time.initialize() })

describe('KTime', () => {
  it('mounts without errors', () => {
    const wrapper = mount(KTime)
    expect(wrapper.exists()).toBe(true)
  })

  it('computedButton has correct base attributes', () => {
    const wrapper = mount(KTime)
    const btn = wrapper.vm.computedButton
    expect(btn.id).toBe('time-button')
    expect(btn.flat).toBe(true)
    expect(btn.noCaps).toBe(true)
    expect(btn.dense).toBe(true)
  })

  it('computedButton shows placeholder label when no value', () => {
    const wrapper = mount(KTime, { props: { placeholder: 'KTime.SELECT_TIME' } })
    expect(wrapper.vm.computedButton.label).toBe('KTime.SELECT_TIME')
  })

  it('computedButton shows formatted time when value is set', () => {
    const wrapper = mount(KTime, { props: { modelValue: '14:30:00' } })
    expect(wrapper.vm.computedButton.label).toBeTruthy()
  })

  it('computedButton is disabled when disabled prop is true', () => {
    const wrapper = mount(KTime, { props: { disabled: true } })
    expect(wrapper.vm.computedButton.disable).toBe(true)
  })

  it('computedButton uses dense class when dense prop is true', () => {
    const wrapper = mount(KTime, { props: { dense: true } })
    expect(wrapper.vm.computedButton.class).toBe('q-px-xs')
  })

  it('computedModel getter returns modelValue', () => {
    const wrapper = mount(KTime, { props: { modelValue: '08:00:00' } })
    expect(wrapper.vm.computedModel).toBe('08:00:00')
  })

  it('computedModel setter emits update:modelValue', () => {
    const wrapper = mount(KTime)
    wrapper.vm.computedModel = '10:00:00'
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['10:00:00'])
  })

  it('computedPicker includes mask HH:mm:ss', () => {
    const wrapper = mount(KTime)
    expect(wrapper.vm.computedPicker.mask).toBe('HH:mm:ss')
  })

  it('computedPicker reflects withSeconds prop', () => {
    const wrapper = mount(KTime, { props: { withSeconds: true } })
    expect(wrapper.vm.computedPicker.withSeconds).toBe(true)
  })

  it('computedPicker merges picker prop with mask', () => {
    const wrapper = mount(KTime, { props: { picker: { color: 'primary' } } })
    expect(wrapper.vm.computedPicker.color).toBe('primary')
    expect(wrapper.vm.computedPicker.mask).toBe('HH:mm:ss')
  })
})
