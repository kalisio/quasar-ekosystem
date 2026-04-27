import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KRoleField from '../../../src/components/KRoleField.vue'

const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }
const optionGroupStub = { template: '<div><slot v-for="opt in options" name="label" :="opt" /></div>', props: ['modelValue', 'options'], emits: ['update:modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KRoleField', () => {
  const stubs = { 'q-field': fieldStub, 'q-option-group': optionGroupStub, 'q-chip': { template: '<span><slot /></span>' } }

  /*
  //If there is a q-option-group in edit mode
  it('renders a q-option-group in edit mode', () => {
    const wrapper = mount(KRoleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.findComponent(optionGroupStub).exists()).toBe(true)
  }) */

  // If there is a chip in readOnly mode with a value provided
  it('renders a chip in readOnly mode', () => {
    const wrapper = mount(KRoleField, { props: { ...makeProps(), readOnly: true, values: { test: 'owner' } }, global: { stubs } })
    expect(wrapper.find('span').exists()).toBe(true)
  })

  // Role field always defaults to the first role — never empty
  it('defaults to first role when no value provided', () => {
    const wrapper = mount(KRoleField, { props: makeProps({ field: { roles: ['owner', 'manager', 'member'] } }), global: { stubs } })
    expect(wrapper.vm.value()).toBe('owner')
  })

  // Custom roles list replaces the built-in default
  it('uses custom roles from field.roles', () => {
    const wrapper = mount(KRoleField, { props: makeProps({ field: { roles: ['admin', 'user'] } }), global: { stubs } })
    expect(wrapper.vm.roles().map(r => r.value)).toEqual(['admin', 'user'])
  })

  // Role field is always considered non-empty (always has a value selected)
  it('isEmpty always returns false', () => {
    const wrapper = mount(KRoleField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  // Clear resets to the first role, not null — role field must always have a value
  it('clear resets to first role', () => {
    const wrapper = mount(KRoleField, { props: makeProps({ field: { roles: ['owner', 'manager'] } }), global: { stubs } })
    wrapper.vm.fill('manager')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('owner')
  })

  // If values prop changes after mount, the model should update reactively
  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KRoleField, { props: makeProps({ field: { roles: ['owner', 'manager', 'member'] } }), global: { stubs } })
    await wrapper.setProps({ values: { test: 'manager' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('manager')
  })

  /* it('onChanged emits field-changed', () => { ... }) */
  /* it('values prop initializes the model', () => { ... }) */
  /* it('uses default role names when field.roles is not set', () => { ... }) */
  /* it('roles computed labels are translated (uppercase key)', () => { ... }) */
  /* it('fill sets the model value', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('validate clears the error', () => { ... }) */
})
