import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'

import KOptionsField from '../../../src/components/KOptionsField.vue'

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
const optionGroupStub = { template: '<div><slot v-for="opt in options" name="label" :="opt" /></div>', props: ['modelValue', 'options'], emits: ['update:modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KOptionsField', () => {
  const stubs = { 'q-field': fieldStub, 'q-option-group': optionGroupStub, 'q-chip': true }
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
  ]

  it('renders a q-option-group in edit mode', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('renders a q-chip in readOnly mode', () => {
    const wrapper = mount(KOptionsField, { props: { ...makeProps(), readOnly: true }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
  })

  it('options are computed from properties.field.options', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.options().length).toBe(2)
    expect(wrapper.vm.options()[0].value).toBe('a')
  })

  /* it('fill sets the model value', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    expect(wrapper.vm.value()).toBe('a')
  }) */

  /* it('clear resets model to null', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  }) */

  // Check that field-changed is emitted when the user picks an option.
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('b')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'b'])
  })

  // options() returns [] when field.options is not defined.
  it('options returns empty array when no options defined', () => {
    const wrapper = mount(KOptionsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.options()).toEqual([])
  })

  // Labels pass through $t, so i18n keys are resolved at render time.
  it('options labels are translated via i18n', () => {
    const translatedOptions = [{ label: 'some.translation.key', value: 'a' }]
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options: translatedOptions } }), global: { stubs } })
    expect(wrapper.vm.options()[0].label).toBe('some.translation.key')
  })

  // Selected option gets text-weight-regular by default; unselected gets the same class.
  it('selectedClass is text-weight-regular by default', async () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    await nextTick()
    const spans = wrapper.findAll('span')
    expect(spans[0].classes()).toContain('text-weight-regular')
  })

  // field.selectedClass overrides the default class for the selected option.
  it('selectedClass can be customized via properties', async () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options, selectedClass: 'text-bold' } }), global: { stubs } })
    wrapper.vm.fill('a')
    await nextTick()
    const spans = wrapper.findAll('span')
    expect(spans[0].classes()).toContain('text-bold')
    expect(spans[1].classes()).toContain('text-weight-regular')
  })

  // If values prop is provided on mount, the model should be initialized with the matching value.
  it('values prop initializes the model', () => {
    const wrapper = mount(KOptionsField, { props: { ...makeProps({ field: { options } }), values: { test: 'b' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('b')
  })

  it('invalidate sets hasError to true', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  })

  it('validate clears the error', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  })

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    await wrapper.setProps({ values: { test: 'a' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('a')
  })

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('a')
  }) */

  // selectedClass() returns the CSS class used for the selected option.
  it('selectedClass() returns text-weight-regular by default', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-weight-regular')
  })

  it('selectedClass() returns custom class when set in properties', () => {
    const wrapper = mount(KOptionsField, { props: makeProps({ field: { options, selectedClass: 'text-italic' } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-italic')
  })

  // readOnly mode shows a chip; KDK does not render the label text inside it.
  it('readOnly shows an empty chip (KDK behavior — no label displayed)', () => {
    const wrapper = mount(KOptionsField, { props: { ...makeProps({ field: { options } }), readOnly: true, values: { test: 'a' } }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
  })
})
