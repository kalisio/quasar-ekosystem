import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KDate from '../../src/components/KDate.vue'

describe('KDate', () => {
  // computedPicker always sets mask to YYYY-MM-DD regardless of any other picker props
  it('computedPicker always includes mask YYYY-MM-DD', () => {
    const wrapper = mount(KDate)
    expect(wrapper.vm.computedPicker.mask).toBe('YYYY-MM-DD')
  })

  // picker prop is merged in, so custom fields coexist with the fixed mask
  it('computedPicker merges custom picker props with mask', () => {
    const wrapper = mount(KDate, { props: { picker: { firstDayOfWeek: '1' } } })
    expect(wrapper.vm.computedPicker.firstDayOfWeek).toBe('1')
    expect(wrapper.vm.computedPicker.mask).toBe('YYYY-MM-DD')
  })

  // When modelValue is empty, the placeholder string is used as the button label
  it('computedButton shows placeholder when modelValue is empty', () => {
    const wrapper = mount(KDate, { props: { placeholder: 'Select a date' } })
    expect(wrapper.vm.computedButton.label).toBe('Select a date')
  })

  // The default calendar icon (las la-calendar) is included in the button spec
  it('computedButton includes default calendar icon', () => {
    const wrapper = mount(KDate)
    expect(wrapper.vm.computedButton.icon).toBe('las la-calendar')
  })

  // disabled=true is forwarded to the button spec as disable:true
  it('computedButton.disable is true when disabled prop is set', () => {
    const wrapper = mount(KDate, { props: { disabled: true } })
    expect(wrapper.vm.computedButton.disable).toBe(true)
  })

  // dense=true applies the compact padding class instead of the full padding class
  it('computedButton uses compact class when dense is true', () => {
    const wrapper = mount(KDate, { props: { dense: true } })
    expect(wrapper.vm.computedButton.class).toBe('q-px-xs')
  })
})
