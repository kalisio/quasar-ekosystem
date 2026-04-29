import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KToggleFullscreenAction from '../../../src/components/action/KToggleFullscreenAction.vue'
import KAction from '../../../src/components/action/KAction.vue'

describe('KToggleFullscreenAction', () => {
  // KAction is rendered as the inner action component
  it('renders a KAction child', () => {
    const wrapper = mount(KToggleFullscreenAction, { props: { id: 'test' } })
    expect(wrapper.findComponent(KAction).exists()).toBe(true)
  })

  // The toggled prop on KAction reflects the Fullscreen reactive ref (false at startup)
  it('KAction receives Fullscreen state as toggled', () => {
    const wrapper = mount(KToggleFullscreenAction, { props: { id: 'test' } })
    expect(wrapper.findComponent(KAction).props('toggled')).toBe(false)
  })

  // The handler prop on KAction is the toggleFullscreen function
  it('KAction receives toggleFullscreen as handler', () => {
    const wrapper = mount(KToggleFullscreenAction, { props: { id: 'test' } })
    expect(typeof wrapper.findComponent(KAction).props('handler')).toBe('function')
  })
})
