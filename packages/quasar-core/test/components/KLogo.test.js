import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KLogo from '../../src/components/KLogo.vue'

describe('KLogo', () => {
  it('resolves a logo path from config', () => {
    const wrapper = mount(KLogo)
    expect(wrapper.vm.logo).toBeTruthy()
  })
})
