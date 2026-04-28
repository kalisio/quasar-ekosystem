import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KPanel from '../../src/KPanel.vue'

describe('KPanel', () => {
  it('reports hasContent when content is provided', () => {
    const wrapper = mount(KPanel, { props: { content: [{ component: 'q-btn' }] } })
    expect(wrapper.vm.hasContent).toBe(true)
  })
})
