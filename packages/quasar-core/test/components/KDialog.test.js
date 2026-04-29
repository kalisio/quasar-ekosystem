import { describe, it, expect } from 'vitest'
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
})
