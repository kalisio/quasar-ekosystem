import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'

import KTagField from '../../../src/components/KTagField.vue'

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

describe('KTagField', () => {
  const stubs = { 'q-select': selectStub, 'q-chip': true, 'q-item': true, 'q-item-section': true }

  // If there is a q-select in edit mode
  it('renders a q-select in edit mode', () => {
    const wrapper = mount(KTagField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('select').exists()).toBe(true)
  })

  // If there is a chip in readOnly mode with a value provided
  it('renders a chip in readOnly mode when model is set', () => {
    const wrapper = mount(KTagField, { props: { ...makeProps(), readOnly: true, values: { test: { name: 'vue', color: 'green' } } }, global: { stubs } })
    expect(wrapper.find('q-chip-stub').exists()).toBe(true)
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

  /* it('emptyModel returns null for single-select', () => { ... }) */
  /* it('emptyModel returns [] for multiselect', () => { ... }) */
  /* it('isEmpty returns true when model is null', () => { ... }) */
  /* it('isEmpty returns false after fill', () => { ... }) */
  /* it('clear resets model to null (single)', () => { ... }) */
  /* it('clear resets model to [] (multiselect)', () => { ... }) */
  /* it('getId returns kebab-cased tag name', () => { ... }) */
  /* it('isClearable defaults to true', () => { ... }) */
  /* it('isClearable respects field.clearable', () => { ... }) */
  /* it('onSearch aborts when pattern is too short', () => { ... }) */
  /* it('onSearch calls search inject', () => { ... }) */
  /* it('onSelected updates model and emits field-changed', () => { ... }) */
  /* it('onSelected with null resets model', () => { ... }) */
  /* it('values prop initializes model', () => { ... }) */
  /* it('invalidate sets hasError', () => { ... }) */
  /* it('validate clears error', () => { ... }) */
  /* it('apply writes model to object', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
})
