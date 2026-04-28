import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KDialog from '../../src/KDialog.vue'

describe('KDialog', () => {
  it('includes an ok-action button by default', () => {
    const wrapper = mount(KDialog)
    expect(wrapper.vm.computedButtons.some(b => b.id === 'ok-action')).toBe(true)
  })
})
