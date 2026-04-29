import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KVersion from '../../src/components/KVersion.vue'

describe('KVersion', () => {
  // clientVersionName is exposed by the useVersion composable and defaults to 0.0.0
  it('exposes client version name from composable', () => {
    const wrapper = mount(KVersion)
    expect(wrapper.vm.clientVersionName).toBe('0.0.0')
  })

  // apiVersionName is exposed by the useVersion composable and defaults to 0.0.0
  it('exposes api version name from composable', () => {
    const wrapper = mount(KVersion)
    expect(wrapper.vm.apiVersionName).toBe('0.0.0')
  })

  // Two q-badge elements are rendered — one for client version and one for API version
  it('renders two version badges', () => {
    const wrapper = mount(KVersion)
    expect(wrapper.findAll('q-badge')).toHaveLength(2)
  })
})
