import { describe, it, expect, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useI18n } from '../../src/composables'

// --- helpers ---

function mountWithI18n (i18n) {
  const TestComponent = defineComponent({
    setup () {
      return useI18n()
    },
    template: '<div />'
  })
  return mount(TestComponent, {
    global: {
      provide: { i18n }
    }
  })
}

// --- tests ---

describe('useI18n', () => {
  it('should return the translated string when the key exists', () => {
    const i18n = { tie: vi.fn().mockReturnValue('Hello!') }
    const wrapper = mountWithI18n(i18n)
    const result = wrapper.vm.tie('app.hello')
    expect(i18n.tie).toHaveBeenCalledWith('app.hello', undefined)
    expect(result).toBe('Hello!')
  })

  it('should return the key as-is when no translation is found', () => {
    const i18n = { tie: vi.fn((key) => key) }
    const wrapper = mountWithI18n(i18n)
    const result = wrapper.vm.tie('app.unknown')
    expect(result).toBe('app.unknown')
  })

  it('should forward params to i18n.tie', () => {
    const i18n = { tie: vi.fn().mockReturnValue('Hello, Alice!') }
    const wrapper = mountWithI18n(i18n)
    wrapper.vm.tie('app.greeting', { name: 'Alice' })
    expect(i18n.tie).toHaveBeenCalledWith('app.greeting', { name: 'Alice' })
  })
})
