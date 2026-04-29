import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KSponsor from '../../src/components/KSponsor.vue'

describe('KSponsor', () => {
  // The KDK attribution key is rendered in the component's text content
  it('renders the KDK attribution text', () => {
    const wrapper = mount(KSponsor)
    expect(wrapper.text()).toContain('KSponsor.KDK_POWERED')
  })

  // A link pointing to kalisio.com is present in the rendered HTML
  it('renders a link to kalisio.com', () => {
    const wrapper = mount(KSponsor)
    expect(wrapper.find('a[href="https://kalisio.com"]').exists()).toBe(true)
  })

  // The q-img src points to the kalisio logo asset
  it('q-img displays the kalisio logo src', () => {
    const wrapper = mount(KSponsor)
    expect(wrapper.find('q-img').attributes('src')).toBe('kdk/kalisio.png')
  })

  // The KAction button links to the KDK documentation site
  it('has a KAction with the KDK documentation link', () => {
    const wrapper = mount(KSponsor)
    const kaction = wrapper.findComponent({ name: 'KAction' })
    expect(kaction.props('url')).toBe('https://kalisio.github.io/kdk')
  })
})
