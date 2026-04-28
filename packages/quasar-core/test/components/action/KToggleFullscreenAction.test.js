import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KToggleFullscreenAction from '../../../src/components/action/KToggleFullscreenAction.vue'

// Missing: Fullscreen (ref), toggleFullscreen(), actionProps.

const stubs = { 'k-action': { template: '<button class="k-action" />' } }

describe('KToggleFullscreenAction', () => {
  it('renders a KAction', () => {
    const wrapper = mount(KToggleFullscreenAction, { global: { stubs } })
    expect(wrapper.find('.k-action').exists()).toBe(true)
  })
})
