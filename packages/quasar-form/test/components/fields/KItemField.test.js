import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KItemField from '../../../src/components/KItemField.vue'

const selectStub = { template: '<select />', props: ['modelValue', 'options'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KItemField', () => {
  const stubs = { 'q-select': selectStub, 'q-chip': true }

  // If there is a q-select in edit mode
  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    expect(wrapper.findComponent(selectStub).exists()).toBe(true)
  })

  // If there is a chip in readOnly mode with a value provided
  it('renders a chip in readOnly mode', () => {
    const wrapper = mount(KItemField, { props: { ...makeProps({ services: [{ service: 'users', field: 'name' }] }), readOnly: true, values: { test: { name: 'Alice' } } }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
  })

  // onSearch delegates to the injected search function provided by a parent
  it('search inject is used for onSearch', async () => {
    const mockSearch = vi.fn().mockResolvedValue([{ name: 'Alice', service: 'users' }])
    const wrapper = mount(KItemField, {
      props: makeProps({ services: [{ service: 'users', field: 'name' }] }),
      global: { stubs, provide: { search: mockSearch } }
    })
    let updated = false
    await wrapper.vm.onSearch('Ali', (fn) => { fn(); updated = true }, () => {})
    expect(mockSearch).toHaveBeenCalled()
    expect(updated).toBe(true)
  })

  // values watcher also updates the items local state (displayed in the select)
  it('values prop change updates items reactively', async () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    await wrapper.setProps({ values: { test: { name: 'Dave' } } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual({ name: 'Dave' })
    expect(wrapper.vm.items).toEqual({ name: 'Dave' })
  })

  // getLabel uses the configured service field to extract a display string
  it('getLabel uses the service field property to extract the label', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'displayName' }] }), global: { stubs } })
    expect(wrapper.vm.getLabel({ displayName: 'Alice Smith', service: 'users' })).toBe('Alice Smith')
  })

  // onSelected emits field-changed after syncing model
  it('onSelected emits field-changed', async () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    wrapper.vm.items = { name: 'Grace', service: 'users' }
    await wrapper.vm.onSelected({ name: 'Grace' })
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  // Already-selected items are excluded from search results in multiselect mode
  it('onSearch in multiselect mode excludes already-selected items', async () => {
    // The filter uses item.field to resolve the comparison key, so results must carry the field property
    const mockSearch = vi.fn().mockResolvedValue([
      { name: 'Alice', service: 'users', field: 'name' },
      { name: 'Bob', service: 'users', field: 'name' }
    ])
    const wrapper = mount(KItemField, {
      props: makeProps({ services: [{ service: 'users', field: 'name' }], multiselect: true }),
      global: { stubs, provide: { search: mockSearch } }
    })
    wrapper.vm.items = [{ name: 'Alice', service: 'users', field: 'name' }]
    await wrapper.vm.onSearch('li', (fn) => fn(), () => {})
    // Alice is already selected so only Bob should remain
    expect(wrapper.vm.options.length).toBe(1)
    expect(wrapper.vm.options[0].name).toBe('Bob')
  })

  /* it('emptyModel returns null for single-select', () => { ... }) */
  /* it('emptyModel returns [] for multiselect', () => { ... }) */
  /* it('fill sets the model value', () => { ... }) */
  /* it('clear resets model to null', () => { ... }) */
  /* it('onSearch aborts when pattern is too short', () => { ... }) */
  /* it('invalidate sets hasError to true', () => { ... }) */
  /* it('apply writes the model value to a target object', () => { ... }) */
  /* it('getLabel falls back to name when no service field defined', () => { ... }) */
  /* it('getIcon extracts icon.name from item', () => { ... }) */
  /* it('getIcon falls back to flat icon string', () => { ... }) */
  /* it('getIcon returns empty string when no icon', () => { ... }) */
  /* it('onSelected with null value clears the model', () => { ... }) */
  /* it('onSelected with a value syncs model from items', () => { ... }) */
  /* it('getDescription uses the service description property', () => { ... }) */
  /* it('getDescription falls back to description field when not configured', () => { ... }) */
  /* it('getId returns kebab-case from the label', () => { ... }) */
})
