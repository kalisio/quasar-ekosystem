import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KBugReportAction from '../../../src/action/KBugReportAction.vue'

// Missing: Platform (platform info), useVersion (client/api versions), config (npm).

const stubs = { 'k-action': { template: '<a class="k-action" :href="url" />', props: ['url'] } }

describe('KBugReportAction', () => {
  it('builds a mailto url from config', () => {
    const wrapper = mount(KBugReportAction, { global: { stubs } })
    expect(wrapper.vm.url).toMatch(/^mailto:.*test@example\.com/)
  })
})
