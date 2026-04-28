import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KSponsor from '../../src/components/KSponsor.vue'

describe('KSponsor', () => {
  it('renders the KDK attribution text', () => {
    const wrapper = mount(KSponsor)
    expect(wrapper.text()).toContain('KSponsor.KDK_POWERED')
  })
})
