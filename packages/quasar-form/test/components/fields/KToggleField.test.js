import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'

import KToggleField from '../../../src/components/KToggleField.vue'

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
const toggleStub = { template: '<input type="checkbox" />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KToggleField', () => {
  const stubs = { 'q-field': fieldStub, 'q-toggle': toggleStub, 'q-chip': true }

  // If there is a checkbox when not in readOnly mode.
  it('renders a q-toggle in edit mode', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  // If there is a chip in readOnly mode.
  it('renders a q-chip in readOnly mode', () => {
    const wrapper = mount(KToggleField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
  })

  // Toggle defaults to false, unlike text fields that default to null.
  it('initializes model to false', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toBe(false)
  })

  /* it('fill sets the model value', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(true)
    expect(wrapper.vm.value()).toBe(true)
  }) */

  // Clear should reset to false, not null.
  it('clear resets model to false', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(true)
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe(false)
  })

  /* it('emptyModel returns false', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe(false)
  }) */

  // A toggle is never "empty" — false is a valid value.
  it('isEmpty always returns false', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  // Check that field-changed is emitted with the boolean value.
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(true)
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', true])
  })

  /* it('values prop initializes model to true', () => {
    const wrapper = mount(KToggleField, { props: { ...makeProps(), values: { test: true } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe(true)
  }) */

  // If a default is provided in properties, clear should restore it.
  it('clear uses default value from properties', () => {
    const wrapper = mount(KToggleField, { props: makeProps({ default: true }), global: { stubs } })
    wrapper.vm.fill(false)
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe(true)
  })

  // In readOnly mode, a true value shows a check icon with positive color.
  it('readOnly shows check icon and positive color when model is true', () => {
    const wrapper = mount(KToggleField, { props: { ...makeProps(), readOnly: true, values: { test: true } }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').attributes('icon')).toBe('las la-check')
    expect(wrapper.find('q-chip-stub').attributes('color')).toBe('positive')
  })

  // In readOnly mode, a false value shows a ban icon with negative color.
  it('readOnly shows ban icon and negative color when model is false', () => {
    const wrapper = mount(KToggleField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').attributes('icon')).toBe('las la-ban')
    expect(wrapper.find('q-chip-stub').attributes('color')).toBe('negative')
  })

  /* it('invalidate sets hasError to true', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  }) */

  /* it('validate clears the error', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  }) */

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: true } })
    await nextTick()
    expect(wrapper.vm.value()).toBe(true)
  })

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KToggleField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(true)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe(true)
  }) */
})
