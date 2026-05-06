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

  // height below 256 is clamped to 256 (minimum allowed value)
  it('height below 256 is clamped to 256', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.resolution = wrapper.vm.resolutions.find(r => !r.readonly)
    await nextTick()
    wrapper.vm.height = 10
    await nextTick()
    expect(wrapper.vm.height).toBe(256)
  })

  // width above 4000 is clamped to 4000 (maximum allowed value)
  it('width above 4000 is clamped to 4000', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.resolution = wrapper.vm.resolutions.find(r => !r.readonly)
    await nextTick()
    wrapper.vm.width = 9999
    await nextTick()
    expect(wrapper.vm.width).toBe(4000)
  })

  // borderless defaults to false when not configured in field
  it('borderless defaults to false', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.borderless).toBe(false)
  })

  // borderless can be enabled via field.borderless property
  it('borderless is true when field.borderless is set', () => {
    const wrapper = mount(KResolutionField, { props: makeProps({ field: { borderless: true } }), global: { stubs } })
    expect(wrapper.vm.borderless).toBe(true)
  })

  // height above 4000 is clamped to 4000 (maximum allowed value)
  it('height above 4000 is clamped to 4000', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.resolution = wrapper.vm.resolutions.find(r => !r.readonly)
    await nextTick()
    wrapper.vm.height = 9999
    await nextTick()
    expect(wrapper.vm.height).toBe(4000)
  })

  // Preset resolutions are readonly — width/height inputs are disabled
  it('readonly is true for built-in presets', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.readonly).toBe(true)
  })

  // computedClass adds justify-center when properties.center is true
  it('computedClass includes justify-center when center is true', () => {
    const wrapper = mount(KResolutionField, { props: makeProps({ center: true }), global: { stubs } })
    expect(wrapper.vm.computedClass['justify-center']).toBe(true)
  })

  // computedClass does not add justify-center by default
  it('computedClass does not include justify-center by default', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.computedClass['justify-center']).toBeUndefined()
  })

  // isEmpty returns false when the model is set (default HD preset is applied on mount)
  it('isEmpty returns false when model is set', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  // fill sets the model directly
  it('fill sets the model to the given value', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill({ width: 800, height: 600 })
    expect(wrapper.vm.value()).toEqual({ width: 800, height: 600 })
  })

  // apply writes model to a target object (field name key)
  it('apply writes model to a target object', () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual({ width: 1280, height: 720 })
  })

  // onChanged emits field-changed with the field name and current model
  it('onChanged emits field-changed', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })

  // selecting the SD preset sets the model to 640x480
  it('selecting the SD preset sets width=640 and height=480', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.resolution = wrapper.vm.resolutions.find(r => r.value === '640x480')
    await nextTick()
    expect(wrapper.vm.model).toEqual({ width: 640, height: 480 })
  })

  // updateModel emits field-changed via onChanged
  it('updateModel emits field-changed', async () => {
    const wrapper = mount(KResolutionField, { props: makeProps(), global: { stubs } })
    wrapper.vm.width = 800
    wrapper.vm.height = 600
    await wrapper.vm.updateModel()
    expect(wrapper.emitted('field-changed')).toBeTruthy()
  })
})
