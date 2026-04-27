import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'

import KTokenField from '../../../src/components/KTokenField.vue'

config.global.mocks = {
  $t: (key) => key,
  $q: {
    iconSet: { editor: { align: 'format_align_left' } },
    lang: { editor: { align: 'Align' } },
    screen: {}
  }
}

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KTokenField', () => {
  // Re-emits keyup so @keyup handlers on q-input fire; id prop needed for focus-next-cell logic
  const inputsStub = { template: '<input :id="id" />', props: ['modelValue', 'id', 'mask', 'disable', 'autofocus', 'outlined'], emits: ['update:modelValue', 'blur', 'keyup'] }
  const stubs = { 'q-input': inputsStub }

  // Number of input cells matches field.tokenLength
  it('renders the correct number of inputs from field.tokenLength', () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { tokenLength: 4 } }), global: { stubs } })
    expect(wrapper.findAll('input').length).toBe(4)
  })

  // Default token length is 6 when not configured
  it('defaults to 6 inputs when tokenLength not set', () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    expect(wrapper.findAll('input').length).toBe(6)
  })

  // In readOnly mode there are no inputs — value is shown as text
  it('renders text in readOnly mode', () => {
    const wrapper = mount(KTokenField, { props: { ...makeProps(), readOnly: true, values: { test: '1234' } }, global: { stubs } })
    expect(wrapper.findAll('input').length).toBe(0)
  })

  // updateModel joins individual cell values into a single string and updates the model
  it('updateModel joins fieldValues into the model string', async () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { tokenLength: 4 } }), global: { stubs } })
    wrapper.vm.fieldValues[0] = '1'
    wrapper.vm.fieldValues[1] = '2'
    wrapper.vm.fieldValues[2] = '3'
    wrapper.vm.fieldValues[3] = '4'
    wrapper.vm.updateModel(5) // index 5 is out of range, no focus attempt
    expect(wrapper.vm.value()).toBe('1234')
  })

  /*
  //Backspace at index N clears cell N-1 to allow re-entry
  it('onKeyUp Backspace clears the previous input cell', () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { tokenLength: 4 } }), global: { stubs } })
    wrapper.vm.fieldValues[0] = '5'
    wrapper.vm.onKeyUp({ key: 'Backspace' }, 1)
    expect(wrapper.vm.fieldValues[0]).toBe('')
  }) */

  // labelClass adds text-red when field has an error, used to color the label
  it('labelClass includes text-red when the field has an error', () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('wrong code')
    expect(wrapper.vm.labelClass['text-red']).toBe(true)
  })

  /*
  //clearInput zeros out a specific cell without affecting others
  it('clearInput empties the cell at the given index', () => {
    const wrapper = mount(KTokenField, { props: makeProps({ field: { tokenLength: 4 } }), global: { stubs } })
    wrapper.vm.fieldValues[2] = '9'
    wrapper.vm.clearInput(2)
    expect(wrapper.vm.fieldValues[2]).toBe('')
  }) */

  // If values prop changes after mount, the model should update reactively
  it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KTokenField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: '999999' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('999999')
  })

  /* it('tokenLength computed returns field.tokenLength', () => { ... }) */
  /* it('updateModel emits field-changed', () => { ... }) */
  /* it('onKeyUp ArrowLeft clears the previous input cell', () => { ... }) */
  /* it('labelClass does not include text-red without error', () => { ... }) */
  /* it('fill sets the model value', () => { ... }) */
  /* it('values prop initializes the model', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('validate clears the error', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
  /* it('onChanged emits field-changed', () => { ... }) */
})
