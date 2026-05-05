import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import KDialog from '../../src/components/KDialog.vue'

describe('KDialog', () => {
  // A default KDialog always has an ok-action button in its computed buttons list
  it('includes an ok-action button by default', () => {
    const wrapper = mount(KDialog)
    expect(wrapper.vm.computedButtons.some(b => b.id === 'ok-action')).toBe(true)
  })

  // Passing a string cancelAction adds a cancel-action button to the list
  it('adds cancel-action when cancelAction prop is set', () => {
    const wrapper = mount(KDialog, { props: { cancelAction: 'Cancel' } })
    expect(wrapper.vm.computedButtons.some(b => b.id === 'cancel-action')).toBe(true)
  })

  // The okAction string becomes the label on the ok-action button
  it('uses custom okAction label', () => {
    const wrapper = mount(KDialog, { props: { okAction: 'Submit' } })
    const okButton = wrapper.vm.computedButtons.find(b => b.id === 'ok-action')
    expect(okButton.label).toBe('Submit')
  })

  // Reactive tests
  // Setting cancelAction after mount adds the cancel button dynamically
  it('adds cancel button when cancelAction changes', async () => {
    const wrapper = mount(KDialog)
    expect(wrapper.vm.computedButtons.some(b => b.id === 'cancel-action')).toBe(false)
    await wrapper.setProps({ cancelAction: 'Cancel' })
    expect(wrapper.vm.computedButtons.some(b => b.id === 'cancel-action')).toBe(true)
  })

  // When okAction is an object, its properties are merged into the button pushed to computedButtons
  it('okAction as object includes custom properties in button', () => {
    const wrapper = mount(KDialog, { props: { okAction: { id: 'custom-ok', label: 'Save', renderer: 'form-button' } } })
    const okButton = wrapper.vm.computedButtons.find(b => b.id === 'custom-ok')
    expect(okButton).toBeDefined()
    expect(okButton.label).toBe('Save')
  })

  // computedHandlers returns empty object when handlers prop is null (default)
  it('computedHandlers returns empty object when handlers is null', () => {
    const wrapper = mount(KDialog)
    expect(wrapper.vm.computedHandlers).toEqual({})
  })

  // computedHandlers returns the handlers object when a non-empty one is provided
  it('computedHandlers returns handlers when provided', () => {
    const handlers = { change: () => {} }
    const wrapper = mount(KDialog, { props: { handlers } })
    expect(wrapper.vm.computedHandlers).toStrictEqual(handlers)
  })

  // When cancelAction is an object, the else branch executes but the button is not pushed
  it('cancelAction as object executes the object branch without pushing a cancel button', () => {
    const wrapper = mount(KDialog, { props: { cancelAction: { label: 'Cancel', handler: vi.fn() } } })
    expect(wrapper.vm.computedButtons.some(b => b.id === 'cancel-action')).toBe(false)
  })

  // computedAttrs strips the 'component.' prefix from fallthrough attribute keys
  it('computedAttrs strips component. prefix from attribute keys', () => {
    const wrapper = mount(KDialog, { attrs: { 'component.foo': 'bar' } })
    expect(wrapper.vm.computedAttrs.foo).toBe('bar')
    expect(wrapper.vm.computedAttrs['component.foo']).toBeUndefined()
  })
})
