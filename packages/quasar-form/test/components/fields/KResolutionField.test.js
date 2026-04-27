import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KResolutionField from '../../../src/components/KResolutionField.vue'

const inputStub = { template: '<input />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] }
const selectStub = { template: '<select />', props: ['modelValue', 'options'], emits: ['update:modelValue', 'blur'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KResolutionField', () => {
  const stubs = { 'q-select': selectStub, 'q-input': inputStub, 'q-item': { template: '<li />' }, 'q-item-section': { template: '<span />' }, 'q-item-label': { template: '<span />' } }

  // If there is a q-select in edit mode
  it('renders a q-select', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.findComponent(selectStub).exists()).toBe(true)
  })

  // Default resolution is 1280x720
  it('defaults to 1280x720 resolution', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.model).toEqual({ width: 1280, height: 720 })
  })

  // updateModel builds the model object from the separate width/height reactive values
  it('updateModel sets model from width and height', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.width = 1920
    wrapper.vm.height = 1080
    wrapper.vm.updateModel()
    expect(wrapper.vm.model).toEqual({ width: 1920, height: 1080 })
  })

  // Built-in preset list has exactly 7 entries
  it('provides 7 resolution options', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.resolutions.length).toBe(7)
  })

  // Selecting a preset syncs width and height and rebuilds the model
  it('selecting the FHD preset sets width=1920 and height=1080', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.resolution = wrapper.vm.resolutions.find(r => r.value === '1920x1080')
    await nextTick()
    expect(wrapper.vm.model).toEqual({ width: 1920, height: 1080 })
  })

  // The "personalized" preset unlocks the custom width/height inputs
  it('selecting the personalized preset sets readonly to false', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.resolution = wrapper.vm.resolutions.find(r => r.readonly === false)
    await nextTick()
    expect(wrapper.vm.readonly).toBe(false)
  })

  // Width is clamped to prevent invalid resolutions
  it('width below 256 is clamped to 256', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.resolution = wrapper.vm.resolutions.find(r => !r.readonly)
    await nextTick()
    wrapper.vm.width = 10
    await nextTick()
    expect(wrapper.vm.width).toBe(256)
  })

  /* it('model is an object with width and height', () => { ... }) */
  /* it('borderless defaults to false', () => { ... }) */
  /* it('borderless can be set via field.borderless', () => { ... }) */
  /* it('onChanged emits field-changed', () => { ... }) */
  /* it('width above 4000 is clamped to 4000', () => { ... }) */
  /* it('height below 256 is clamped to 256', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
})
