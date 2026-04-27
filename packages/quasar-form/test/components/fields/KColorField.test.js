import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'

import KColorField from '../../../src/components/KColorField.vue'

config.global.mocks = {
  $t: (key) => key,
  $q: {
    iconSet: { editor: { align: 'format_align_left' } },
    lang: { editor: { align: 'Align' } },
    screen: {}
  }
}

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))

const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }
// Renders its slot only when modelValue (v-model) is true — simulates q-dialog open/close
const dialogStub = { template: '<div v-if="modelValue"><slot /></div>', props: ['modelValue'], emits: ['update:modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KColorField', () => {
  // q-field renders the control slot; q-dialog shows its slot only when open; q-color is the picker
  const stubs = { 'q-field': fieldStub, 'q-dialog': dialogStub, 'q-color': true }

  // Edit mode renders the color swatch div (not a text input).
  it('renders a colored div in edit mode (via control slot)', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('.k-color-field').exists()).toBe(true)
  })

  // readOnly also shows the swatch (same div, no picker).
  it('renders a colored div in readOnly mode', () => {
    const wrapper = mount(KColorField, { props: { ...makeProps(), readOnly: true, values: { test: '#ff0000' } }, global: { stubs } })
    expect(wrapper.find('.k-color-field').exists()).toBe(true)
  })

  // emptyModel is '' (not null), and the CSS computed falls back to 'transparent'.
  it('initializes model to empty string when no default', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toBe('')
  })

  // properties.default pre-fills the model with a hex color.
  it('initializes model to properties.default when defined', () => {
    const wrapper = mount(KColorField, { props: makeProps({ default: '#ff0000' }), global: { stubs } })
    expect(wrapper.vm.value()).toBe('#ff0000')
  })

  /* it('fill sets the model to a hex color', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#123456')
    expect(wrapper.vm.value()).toBe('#123456')
  }) */

  // clear() resets to '' (emptyModel) so the swatch shows transparent.
  it('clear resets model to empty string', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#abcdef')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('')
  })

  // clear() uses properties.default if defined, instead of emptyModel.
  it('clear resets model to properties.default when defined', () => {
    const wrapper = mount(KColorField, { props: makeProps({ default: '#000000' }), global: { stubs } })
    wrapper.vm.fill('#abcdef')
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toBe('#000000')
  })

  // color is bound to CSS via v-bind; empty model maps to 'transparent' so the swatch is invisible.
  it('color computed is transparent when model is empty', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.color).toBe('transparent')
  })

  it('color computed reflects model value for CSS v-bind', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#ff0000')
    expect(wrapper.vm.color).toBe('#ff0000')
  })

  // picker is a boolean that drives the q-dialog; it starts closed.
  it('picker state starts as false', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.picker).toBe(false)
  })

  // q-color is inside a q-dialog, so it only appears in the DOM when picker is true.
  it('color picker dialog shows when picker is set to true', async () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.picker = true
    await nextTick()
    expect(wrapper.find('q-color-stub').exists()).toBe(true)
  })

  // onReferenceCreated wires a native onclick on the swatch element to open the picker.
  it('onReferenceCreated attaches a click handler that opens the picker', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    const fakeEl = {}
    wrapper.vm.onReferenceCreated({ $el: fakeEl })
    expect(typeof fakeEl.onclick).toBe('function')
    fakeEl.onclick()
    expect(wrapper.vm.picker).toBe(true)
  })

  // isClearable defaults to true so the swatch can be cleared.
  it('isClearable defaults to true', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(true)
  })

  // field.clearable: false disables the clear button.
  it('isClearable can be disabled via properties.field.clearable', () => {
    const wrapper = mount(KColorField, { props: makeProps({ field: { clearable: false } }), global: { stubs } })
    expect(wrapper.vm.isClearable()).toBe(false)
  })

  /* it('invalidate sets hasError to true', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid color')
    expect(wrapper.vm.hasError).toBe(true)
  }) */

  /* it('validate clears the error', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('invalid color')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  }) */

  /* it('onChanged emits field-changed', async () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#aabbcc')
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', '#aabbcc'])
  }) */

  // If values prop is provided on mount, the model should be initialized with the matching value.
  it('values prop initializes the model', () => {
    const wrapper = mount(KColorField, { props: { ...makeProps(), values: { test: '#112233' } }, global: { stubs } })
    expect(wrapper.vm.value()).toBe('#112233')
  })

  /* it('values prop change updates the model reactively', async () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: '#999999' } })
    await nextTick()
    expect(wrapper.vm.value()).toBe('#999999')
  }) */

  /* it('field.disabled disables the field', () => {
    const wrapper = mount(KColorField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  }) */

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#aabbcc')
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toBe('#aabbcc')
  }) */

  // onReferenceCreated(null) must not throw — the KAction trigger component may not always exist.
  it('onReferenceCreated with null ref does nothing (no throw)', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(() => wrapper.vm.onReferenceCreated(null)).not.toThrow()
    expect(wrapper.vm.picker).toBe(false)
  })

  // isEmpty is true when model is '' (no color chosen yet).
  it('isEmpty returns true when model is empty string', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false when model has a color', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill('#ff0000')
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  it('emptyModel returns empty string', () => {
    const wrapper = mount(KColorField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBe('')
  })
})
