import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KDate from '../../../src/components/time/KDate.vue'
// import { Time } from '../../../src/time.js'

// beforeAll(() => { Time.initialize() })

describe('KDate', () => {
  it('mounts without errors', () => {
    const wrapper = mount(KDate)
    expect(wrapper.exists()).toBe(true)
  })

  it('computedButton has correct base attributes', () => {
    const wrapper = mount(KDate)
    const btn = wrapper.vm.computedButton
    expect(btn.id).toBe('date-button')
    expect(btn.flat).toBe(true)
    expect(btn.noCaps).toBe(true)
    expect(btn.dense).toBe(true)
  })

  it('computedButton includes icon when icon prop is set', () => {
    const wrapper = mount(KDate, { props: { icon: 'las la-calendar' } })
    expect(wrapper.vm.computedButton.icon).toBe('las la-calendar')
  })

  it('computedButton does not include icon when icon prop is null', () => {
    const wrapper = mount(KDate, { props: { icon: null } })
    expect(wrapper.vm.computedButton.icon).toBeUndefined()
  })

  it('computedButton is disabled when disabled prop is true', () => {
    const wrapper = mount(KDate, { props: { disabled: true } })
    expect(wrapper.vm.computedButton.disable).toBe(true)
  })

  it('computedButton uses dense class when dense prop is true', () => {
    const wrapper = mount(KDate, { props: { dense: true } })
    expect(wrapper.vm.computedButton.class).toBe('q-px-xs')
  })

  it('computedModel getter returns modelValue', () => {
    const wrapper = mount(KDate, { props: { modelValue: '2024-01-15' } })
    expect(wrapper.vm.computedModel).toBe('2024-01-15')
  })

  it('computedModel setter emits update:modelValue', () => {
    const wrapper = mount(KDate)
    wrapper.vm.computedModel = '2024-06-20'
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['2024-06-20'])
  })

  it('computedPicker includes mask YYYY-MM-DD', () => {
    const wrapper = mount(KDate)
    expect(wrapper.vm.computedPicker.mask).toBe('YYYY-MM-DD')
  })

  it('computedPicker merges picker prop with mask', () => {
    const wrapper = mount(KDate, { props: { picker: { color: 'red' } } })
    expect(wrapper.vm.computedPicker.color).toBe('red')
    expect(wrapper.vm.computedPicker.mask).toBe('YYYY-MM-DD')
  })
})
