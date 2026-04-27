import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'

import KUnitField from '../../../src/components/KUnitField.vue'

config.global.mocks = {
  $t: (key) => key,
  $q: {
    iconSet: { editor: { align: 'format_align_left' } },
    lang: { editor: { align: 'Align' } },
    screen: {}
  }
}

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))

const selectStub = { template: '<select />', props: ['modelValue', 'options'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KUnitField', () => {
  const stubs = { 'q-select': selectStub }
  const unitOptions = [{ name: 'm', label: 'Meter' }, { name: 'km', label: 'Kilometer' }]

  // If there is a q-select in edit mode
  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KUnitField, { props: makeProps({ field: { options: unitOptions } }), global: { stubs } })
    expect(wrapper.findComponent(selectStub).exists()).toBe(true)
  })

  // In readOnly mode the selected unit is shown as text
  it('renders model value in readOnly mode', () => {
    const wrapper = mount(KUnitField, { props: { ...makeProps({ field: {} }), readOnly: true, values: { test: 'm' } }, global: { stubs } })
    expect(wrapper.text()).toContain('m')
  })

  // When no getUnits inject is provided, options come from field.options
  it('builds options from field.options when no getUnits inject', () => {
    const wrapper = mount(KUnitField, { props: makeProps({ field: { options: unitOptions } }), global: { stubs } })
    expect(wrapper.vm.options.map(o => o.value)).toEqual(['m', 'km'])
  })

  // When getUnits inject is provided, it takes priority over field.options
  it('uses getUnits inject when provided', () => {
    const mockGetUnits = vi.fn().mockReturnValue([{ name: 'kg', label: 'Kilogram' }])
    const wrapper = mount(KUnitField, {
      props: makeProps({ field: { quantity: 'mass' } }),
      global: { stubs, provide: { getUnits: mockGetUnits } }
    })
    expect(mockGetUnits).toHaveBeenCalledWith('mass')
    expect(wrapper.vm.options[0].value).toBe('kg')
  })

  // field.filter restricts the visible units to a subset of what getUnits returns
  it('applies unit filter from field.filter when getUnits is provided', () => {
    const mockGetUnits = vi.fn().mockReturnValue([{ name: 'm', label: 'Meter' }, { name: 'km', label: 'Kilometer' }, { name: 'cm', label: 'Centimeter' }])
    const wrapper = mount(KUnitField, {
      props: makeProps({ field: { quantity: 'length', filter: ['m', 'km'] } }),
      global: { stubs, provide: { getUnits: mockGetUnits } }
    })
    expect(wrapper.vm.options.map(o => o.value)).toEqual(['m', 'km'])
  })

  // The value key in field.options overrides the name as the stored value
  it('field.options value key overrides name', () => {
    const opts = [{ value: 'meter', name: 'm', label: 'Meter' }]
    const wrapper = mount(KUnitField, { props: makeProps({ field: { options: opts } }), global: { stubs } })
    expect(wrapper.vm.options[0].value).toBe('meter')
  })

  /* it('onChanged emits field-changed', () => { ... }) */
  /* it('fill sets the model value', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
  /* it('clear resets model to null', () => { ... }) */
  /* it('values prop initializes the model', () => { ... }) */
  /* it('values prop change updates the model reactively', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
})
