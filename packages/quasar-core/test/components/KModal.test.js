import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KModal from '../../src/components/KModal.vue'
import { nextTick } from 'vue'

describe('KModal', () => {
  // The title text is rendered inside the header element
  it('renders title text in the header', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const wrapper = mount(KModal, {
      props: { title: 'My Modal', modelValue: false },
      attachTo: div
    })
    wrapper.vm.show()
    await nextTick()
    await nextTick()
    const header = document.body.querySelector('.text-h6')
    expect(header?.textContent?.trim()).toBe('My Modal')
    wrapper.unmount()
    div.remove()
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
  it.skip('widthPolicy affects min-width in computedStyle', () => {
    const wide = mount(KModal, { props: { widthPolicy: 'wide' } })
    const narrow = mount(KModal, { props: { widthPolicy: 'narrow' } })
    const wideMatch = wide.vm.computedStyle.match(/min-width:\s*(\d+)vw/)
    const narrowMatch = narrow.vm.computedStyle.match(/min-width:\s*(\d+)vw/)
    expect(wideMatch).toBeTruthy()
    expect(narrowMatch).toBeTruthy()
    expect(parseInt(wideMatch[1])).toBeGreaterThan(parseInt(narrowMatch[1]))
  })

  // The footer section is only rendered when a buttons array is provided
  it.skip('renders footer when buttons prop is provided', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const withButtons = mount(KModal, { props: { buttons: [{ id: 'ok' }] }, attachTo: div })
    withButtons.vm.show()
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('#modal-footer')).not.toBeNull()
    withButtons.unmount()
    div.remove()

    const div2 = document.createElement('div')
    document.body.appendChild(div2)
    const withoutButtons = mount(KModal, { attachTo: div2 })
    withoutButtons.vm.show()
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('#modal-footer')).toBeNull()
    withoutButtons.unmount()
    div2.remove()
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

  // scrollable=false renders the default slot directly without a KScrollArea wrapper
  it('renders slot directly when scrollable is false', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const wrapper = mount(KModal, {
      props: { scrollable: false },
      slots: { default: '<p class="direct-slot">content</p>' },
      attachTo: div
    })
    wrapper.vm.show()
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('.direct-slot')).not.toBeNull()
    wrapper.unmount()
    div.remove()
  })

  // onHeaderResized stores the new header height when the size changes
  it('onHeaderResized updates headerHeight', () => {
    const wrapper = mount(KModal, { props: { scrollable: false } })
    wrapper.vm.onHeaderResized({ height: 60 })
    expect(wrapper.vm.headerHeight).toBe(60)
  })

  // onFooterResized stores the new footer height when the size changes
  it('onFooterResized updates footerHeight', () => {
    const wrapper = mount(KModal, { props: { scrollable: false } })
    wrapper.vm.onFooterResized({ height: 48 })
    expect(wrapper.vm.footerHeight).toBe(48)
  })
})
