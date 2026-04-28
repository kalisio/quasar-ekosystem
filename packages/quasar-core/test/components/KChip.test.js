import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KChip from '../../src/components/KChip.vue'

describe('KChip', () => {
  it('computes label from prop', () => {
    const wrapper = mount(KChip, { props: { label: 'Hello' } })
    expect(wrapper.vm.computedLabel).toBe('Hello')
  })
})
