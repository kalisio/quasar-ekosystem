import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { I18n } from '../../src/i18n.js'
import { useI18n } from '../../src/composables/use-i18n.js'

// --- helpers ---

function mountWithI18n (messages = {}) {
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: messages } })
  I18n.setInstance(i18n)
  const TestComponent = defineComponent({
    setup () { return useI18n() },
    template: '<div />'
  })
  return mount(TestComponent, {
    global: {
      provide: { i18n: I18n }
    }
  })
}

// --- tests ---

describe('useI18n', () => {
  it('should return the translated string when the key exists', () => {
    const wrapper = mountWithI18n({ app: { hello: 'Hello!' } })
    expect(wrapper.vm.tie('app.hello')).toBe('Hello!')
  })

  it('should return the key as-is when no translation is found', () => {
    const wrapper = mountWithI18n()
    expect(wrapper.vm.tie('app.unknown')).toBe('app.unknown')
  })

  it('should forward params', () => {
    const wrapper = mountWithI18n({ app: { greeting: 'Hello, {name}!' } })
    expect(wrapper.vm.tie('app.greeting', { name: 'Alice' })).toBe('Hello, Alice!')
  })
})
