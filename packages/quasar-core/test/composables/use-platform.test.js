import { describe, it, expect, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { usePlatform } from '../../src/composables'

// --- helpers ---

function mountWithPlatform (platform) {
  const TestComponent = defineComponent({
    setup () {
      return { platform: usePlatform() }
    },
    template: '<div />'
  })
  return mount(TestComponent, {
    global: {
      provide: { platform }
    }
  })
}

// --- tests ---

describe('usePlatform', () => {
  it('should return the platform instance', () => {
    const platform = { getData: vi.fn(), is: { desktop: true, mobile: false } }
    const wrapper = mountWithPlatform(platform)
    expect(wrapper.vm.platform).toBe(platform)
  })

  it('should expose getData', () => {
    const platform = { getData: vi.fn().mockReturnValue('en-US') }
    const wrapper = mountWithPlatform(platform)
    const result = wrapper.vm.platform.getData('browser.locale')
    expect(platform.getData).toHaveBeenCalledWith('browser.locale')
    expect(result).toBe('en-US')
  })
})
