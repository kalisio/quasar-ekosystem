import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'

import KSelectField from '../../../src/components/KSelectField.vue'

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

describe('KSelectField', () => {
  const stubs = { 'q-select': selectStub, 'q-chip': true, 'q-item': true, 'q-item-section': true, 'q-item-label': true }
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
  ]

  // If there is a select when not in readOnly mode.
  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.find('select').exists()).toBe(true)
  })

  // Options are computed from the schema field definition.
  it('options are computed from properties.field.options', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.options.length).toBe(2)
    expect(wrapper.vm.options[0].value).toBe('a')
  })

  /* it('fill sets the model value', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    expect(wrapper.vm.value()).toBe('a')
  }) */

  // For single-select, clear should reset to null.
  it('clear resets model to null for single-select', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  // For multiselect, the empty value is [] not null.
  it('emptyModel returns [] for multiselect', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual([])
  })

  // For multiselect, the model initializes to an empty array.
  it('model initializes to [] for multiselect', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    expect(wrapper.vm.value()).toEqual([])
  })

  // isEmpty checks array emptiness for multiselect, not null.
  it('isEmpty checks array emptiness for multiselect', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
    wrapper.vm.fill(['a'])
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  // Check that field-changed is emitted with the selected value.
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('b')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', 'b'])
  })

  // In readOnly mode, the select is replaced by a chip.
  it('readOnly hides the select', () => {
    const wrapper = mount(KSelectField, { props: { ...makeProps({ field: { options } }), readOnly: true }, global: { stubs } })
    expect(wrapper.find('select').exists()).toBe(false)
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
  })

  // The dense prop must be forwarded to q-select for compact layouts.
  it('dense prop is forwarded to q-select', () => {
    const denseStub = { template: '<select :data-dense="String(dense)" />', props: ['modelValue', 'options', 'dense'], emits: ['update:modelValue', 'blur', 'filter'] }
    const wrapper = mount(KSelectField, {
      props: { ...makeProps({ field: { options } }), dense: true },
      global: { stubs: { ...stubs, 'q-select': denseStub } }
    })
    expect(wrapper.find('[data-dense="true"]').exists()).toBe(true)
  })

  /* it('values prop initializes the model', () => {
    const wrapper = mount(KSelectField, { props: { ...makeProps({ field: { options } }), values: { test: 'a' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('a')
  }) */

  // For multiselect, clear should reset to [].
  it('clear resets model to [] for multiselect', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    wrapper.vm.fill(['a', 'b'])
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toEqual([])
  })

  // If the field is required and has only one option, it should auto-select it.
  it('auto-fills when required is true and only one option exists', async () => {
    const singleOption = [{ label: 'Only Option', value: 'only' }]
    const wrapper = mount(KSelectField, {
      props: { ...makeProps({ field: { options: singleOption } }), required: true },
      global: { stubs }
    })
    await nextTick()
    expect(wrapper.vm.value()).toBe('only')
  })

  /* it('invalidate sets hasError to true', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  }) */

  /* it('validate clears the error', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  }) */

  // If values prop changes after mount, the model should update reactively.
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    await wrapper.setProps({ values: { test: 'b' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('b')
  })

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.fill('a')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('a')
  }) */

  /* it('multiple defaults to false', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.multiple).toBe(false)
  }) */

  /* it('multiple is true when multiselect is set in properties', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ multiselect: true, field: { options } }), global: { stubs } })
    expect(wrapper.vm.multiple).toBe(true)
  }) */

  /* it('chips defaults to false', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.chips).toBe(false)
  }) */

  /* it('chips is true when properties.field.chips is set', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, chips: true } }), global: { stubs } })
    expect(wrapper.vm.chips).toBe(true)
  }) */

  // isClearable is true by default — the user can clear the selection.
  it('isClearable defaults to true', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(true)
  })

  // isClearable can be disabled to prevent clearing mandatory selections.
  it('isClearable can be disabled via properties.field.clearable', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, clearable: false } }), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(false)
  })

  /* it('selectedClass defaults to text-weight-regular', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-weight-regular')
  }) */

  /* it('selectedClass can be customized via properties.field.selectedClass', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, selectedClass: 'text-bold' } }), global: { stubs } })
    expect(wrapper.vm.selectedClass()).toBe('text-bold')
  }) */

  /* it('dense computed reflects the dense prop', () => {
    const wrapper = mount(KSelectField, { props: { ...makeProps({ field: { options } }), dense: true }, global: { stubs } })
    expect(wrapper.vm.dense).toBe(true)
  }) */

  // The filter should narrow the displayed options.
  it('onFilter narrows the options list', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.onFilter('option a', (fn) => fn())
    expect(wrapper.vm.options.length).toBe(1)
    expect(wrapper.vm.options[0].value).toBe('a')
  })

  // An empty filter string should reset the full options list.
  it('onFilter with empty string resets the filter', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    wrapper.vm.onFilter('option a', (fn) => fn())
    wrapper.vm.onFilter('', (fn) => fn())
    expect(wrapper.vm.options.length).toBe(2)
  })

  // getId generates a kebab-case DOM id from the option value.
  it('getId returns kebab-case id for string values', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.getId({ value: 'my value', label: 'My Value' })).toBe('my-value')
  })

  // For object values, getId falls back to the label.
  it('getId falls back to label for object values', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.getId({ value: { nested: 'obj' }, label: 'My Label' })).toBe('my-label')
  })

  /* it('hasNoOption is false when field.noOption is not set', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options } }), global: { stubs } })
    expect(wrapper.vm.hasNoOption).toBe(false)
  }) */

  /* it('hasNoOption is true when field.noOption is a string', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, noOption: 'No results found' } }), global: { stubs } })
    expect(wrapper.vm.hasNoOption).toBe(true)
  }) */

  /* it('noOption returns the configured string', () => {
    const wrapper = mount(KSelectField, { props: makeProps({ field: { options, noOption: 'No results' } }), global: { stubs } })
    expect(wrapper.vm.noOption).toBe('No results')
  }) */
})
