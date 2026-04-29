import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KBugReportAction from '../../../src/components/action/KBugReportAction.vue'
import KAction from '../../../src/components/action/KAction.vue'

describe('KBugReportAction', () => {
  // The url prop forwarded to KAction is a mailto link pointing to the configured publisher contact
  it('passes a mailto url to KAction', () => {
    const wrapper = mount(KBugReportAction, { props: { id: 'test' } })
    const action = wrapper.findComponent(KAction)
    expect(action.props('url')).toMatch(/^mailto:.*test@example\.com/)
  })
})
