import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KModal from '../../src/components/KModal.vue'

describe('KModal', () => {
  // The title text is rendered inside the header element
  it('renders title text in the header', () => {
    const wrapper = mount(KModal, { props: { title: 'My Modal' } })
    expect(wrapper.find('.text-h6').text()).toBe('My Modal')
  })

  // computedClass builds a Quasar CSS class string from backgroundColor and textColor props
  it('computedClass contains background and text color', () => {
    const wrapper = mount(KModal, { props: { backgroundColor: 'white', textColor: 'black' } })
    expect(wrapper.vm.computedClass).toContain('bg-white')
    expect(wrapper.vm.computedClass).toContain('text-black')
  })

  // maximized=true adds column and full-height layout classes to computedClass
  it('computedClass adds column full-height when maximized', () => {
    const wrapper = mount(KModal, { props: { maximized: true } })
    expect(wrapper.vm.computedClass).toContain('column full-height')
  })

  // widthPolicy wide gives a larger min-width percentage than narrow
  it('widthPolicy affects min-width in computedStyle', () => {
    const wide = mount(KModal, { props: { widthPolicy: 'wide' } })
    const narrow = mount(KModal, { props: { widthPolicy: 'narrow' } })
    expect(wide.vm.computedStyle).toContain('90vw')
    expect(narrow.vm.computedStyle).toContain('25vw')
  })

  // The footer section is only rendered when a buttons array is provided
  it('renders footer when buttons prop is provided', () => {
    const withButtons = mount(KModal, { props: { buttons: [{ id: 'ok' }] } })
    const withoutButtons = mount(KModal)
    expect(withButtons.find('#modal-footer').exists()).toBe(true)
    expect(withoutButtons.find('#modal-footer').exists()).toBe(false)
  })

  // Reactive tests
  // Changing backgroundColor updates the bg-* class in computedClass
  it('updates computedClass when backgroundColor changes', async () => {
    const wrapper = mount(KModal, { props: { backgroundColor: 'white' } })
    expect(wrapper.vm.computedClass).toContain('bg-white')
    await wrapper.setProps({ backgroundColor: 'grey-2' })
    expect(wrapper.vm.computedClass).toContain('bg-grey-2')
    expect(wrapper.vm.computedClass).not.toContain('bg-white')
  })
})
