import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KTagField from '../../../src/components/KTagField.vue'

const selectStub = { template: '<select />', props: ['modelValue', 'options'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KTagField', () => {
  const stubs = { 'q-select': selectStub, KChip: true, 'q-item': true, 'q-item-section': true }

  // If there is a q-select in edit mode
  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('select').exists()).toBe(true)
  })

  // If there is a chip in readOnly mode with a value provided
  it('renders a chip in readOnly mode when model is set', () => {
    const wrapper = mount(KTagField, { props: { ...makeProps(), readOnly: true, values: { test: { name: 'vue', color: 'green' } } }, global: { stubs } })
    expect(wrapper.find('k-chip-stub').exists()).toBe(true)
  })

  // fill also syncs the items local state — the select needs items to display the selected option
  it('fill sets model and syncs items', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    const tag = { name: 'typescript', color: 'blue' }
    wrapper.vm.fill(tag)
    expect(wrapper.vm.value()).toEqual(tag)
    expect(wrapper.vm.items).toEqual(tag)
  })

  // When a pattern yields no results, a "create" option is added so the user can create the tag inline
  it('onSearch adds create option when pattern not in results', async () => {
    const mockSearch = vi.fn().mockResolvedValue([])
    const wrapper = mount(KTagField, {
      props: makeProps({ services: [{ service: 'tags' }] }),
      global: { stubs, provide: { search: mockSearch } }
    })
    await wrapper.vm.onSearch('newtag', vi.fn(fn => fn()), vi.fn())
    expect(wrapper.vm.options.some(o => o.create)).toBe(true)
  })

  // If the selected option has create:true, the createTag inject is called to persist it
  it('onSelected calls createTag for new tags', async () => {
    const mockCreateTag = vi.fn().mockResolvedValue({ _id: '1' })
    const wrapper = mount(KTagField, {
      props: makeProps({ field: { service: 'items', property: 'tags' } }),
      global: { stubs, provide: { createTag: mockCreateTag } }
    })
    wrapper.vm.items = [{ name: 'brand-new', color: 'grey', create: true }]
    await wrapper.vm.onSelected([{ name: 'brand-new', color: 'grey', create: true }])
    expect(mockCreateTag).toHaveBeenCalled()
  })

  // If values prop changes after mount, the model should update reactively
  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    const tag = { name: 'react', color: 'blue' }
    await wrapper.setProps({ values: { test: tag } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(tag)
  })

  it('isEmpty returns true when model is null', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false after fill', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'vue', color: 'green' })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('clear resets single model to null', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'vue', color: 'green' })
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('clear resets multiselect model to []', () => {
    const wrapper = mount(KTagField, { props: makeProps({ multiselect: true }), global: { stubs } })
    wrapper.vm.fill([{ name: 'vue' }])
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('getId returns kebab-cased tag name', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.getId({ name: 'My Tag' })).toBe('my-tag')
  })

  it('isClearable defaults to true', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isClearable).toBe(true)
  })

  it('isClearable respects field.clearable', () => {
    const wrapper = mount(KTagField, { props: makeProps({ field: { clearable: false } }), global: { stubs } })
    expect(wrapper.vm.isClearable).toBe(false)
  })

  it('onSearch aborts when pattern is shorter than minCharsToSearch', async () => {
    const abort = vi.fn()
    const wrapper = mount(KTagField, { props: makeProps({ minCharsToSearch: 3 }), global: { stubs } })
    await wrapper.vm.onSearch('ab', vi.fn(), abort)
    expect(abort).toHaveBeenCalled()
  })

  it('onSelected with null resets model to emptyModel', async () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ name: 'vue' })
    await wrapper.vm.onSelected(null)
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('apply writes model value to a target object', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    const tag = { name: 'typescript', color: 'blue' }
    wrapper.vm.fill(tag)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual(tag)
  })

  it('onSearch in multiselect mode excludes already-selected tags', async () => {
    const mockSearch = vi.fn().mockResolvedValue([
      { name: 'vue', color: 'green' },
      { name: 'react', color: 'blue' }
    ])
    const wrapper = mount(KTagField, {
      props: makeProps({ multiselect: true, services: [{ service: 'tags' }] }),
      global: { stubs, provide: { search: mockSearch } }
    })
    wrapper.vm.items = [{ name: 'vue', color: 'green' }]
    await wrapper.vm.onSearch('react', vi.fn(fn => fn()), vi.fn())
    expect(wrapper.vm.options.every(o => o.name !== 'vue')).toBe(true)
  })
})
