import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KScrollArea from '../../src/components/KScrollArea.vue'

describe('KScrollArea', () => {
  it('initializes height at zero before any scroll', () => {
    const wrapper = mount(KScrollArea, { props: { maxHeight: 300 } })
    expect(wrapper.vm.cssHeight).toBe('0px')
  })
})
