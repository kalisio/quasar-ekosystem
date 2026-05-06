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

  it('emptyModel returns null for single-select', () => {
    const wrapper = mount(KItemField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBeNull()
  })

  it('emptyModel returns [] for multiselect', () => {
    const wrapper = mount(KItemField, { props: makeProps({ multiselect: true }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual([])
  })

  it('isEmpty returns true when model is null', () => {
    const wrapper = mount(KItemField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('fill sets the model value', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    wrapper.vm.fill({ name: 'Alice', service: 'users' })
    expect(wrapper.vm.value()).toEqual({ name: 'Alice', service: 'users' })
  })

  it('clear resets model to null', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    wrapper.vm.fill({ name: 'Alice', service: 'users' })
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('getId returns kebab-case from the item label', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    const id = wrapper.vm.getId({ name: 'Alice Smith', service: 'users' })
    expect(id).toBe('alice-smith')
  })

  it('getDescription uses the service description field', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name', description: 'bio' }] }), global: { stubs } })
    expect(wrapper.vm.getDescription({ bio: 'Developer', service: 'users' })).toBe('Developer')
  })

  it('getDescription falls back to description property when not configured', () => {
    const wrapper = mount(KItemField, { props: makeProps({ services: [{ service: 'users', field: 'name' }] }), global: { stubs } })
    expect(wrapper.vm.getDescription({ description: 'Fallback', service: 'users' })).toBe('Fallback')
  })

  it('getIcon extracts icon.name from item', () => {
    const wrapper = mount(KItemField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getIcon({ icon: { name: 'las la-user' } })).toBe('las la-user')
  })

  it('getIcon falls back to flat icon string', () => {
    const wrapper = mount(KItemField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getIcon({ icon: 'las la-star' })).toBe('las la-star')
  })

  it('getIcon returns empty string when no icon', () => {
    const wrapper = mount(KItemField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getIcon({})).toBe('')
  })

  it('onSearch aborts when pattern is less than 2 characters', async () => {
    const mockSearch = vi.fn()
    const wrapper = mount(KItemField, { props: makeProps(), global: { stubs, provide: { search: mockSearch } } })
    const abort = vi.fn()
    await wrapper.vm.onSearch('a', vi.fn(), abort)
    expect(abort).toHaveBeenCalled()
    expect(mockSearch).not.toHaveBeenCalled()
  })

  it('onSelected with null value clears the model', async () => {
    const wrapper = mount(KItemField, { props: makeProps(), global: { stubs } })
    wrapper.vm.items = { name: 'Alice' }
    await wrapper.vm.onSelected(null)
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('apply writes model value to a target object', () => {
    const wrapper = mount(KItemField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'Alice' })
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual({ name: 'Alice' })
  })
})
