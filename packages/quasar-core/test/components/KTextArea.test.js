import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KTextArea from '../../src/components/KTextArea.vue'

describe('KTextArea', () => {
  it('starts collapsed', () => {
    const wrapper = mount(KTextArea, { props: { text: 'Hello' } })
    expect(wrapper.vm.isExpanded).toBe(false)
  })
})
