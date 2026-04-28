import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KAvatar from '../../src/components/KAvatar.vue'

describe('KAvatar', () => {
  it('computes initials from subject name', async () => {
    const wrapper = mount(KAvatar, { props: { subject: { name: 'Alice Bob' } } })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.initials).toBe('AB')
  })
})
