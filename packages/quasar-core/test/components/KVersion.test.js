import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KVersion from '../../src/components/KVersion.vue'

describe('KVersion', () => {
  it('exposes client version name from composable', () => {
    const wrapper = mount(KVersion)
    expect(wrapper.vm.clientVersionName).toBe('0.0.0')
  })
})
