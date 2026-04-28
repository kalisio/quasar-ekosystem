import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KTab from '../../src/KTab.vue'

describe('KTab', () => {
  it('derives tab list from content keys', () => {
    const content = { info: [], settings: [] }
    const wrapper = mount(KTab, { props: { content, mode: 'info' } })
    expect(wrapper.vm.tabs).toEqual(['info', 'settings'])
  })
})
