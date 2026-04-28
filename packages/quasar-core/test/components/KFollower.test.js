import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KFollower from '../../src/KFollower.vue'

describe('KFollower', () => {
  it('computes top-right position style', () => {
    const wrapper = mount(KFollower, {
      props: { follower: { component: 'q-btn' }, targetId: 'x', anchor: 'top-right', offset: [10, 5] }
    })
    expect(wrapper.vm.computedStyle).toMatchObject({ top: '5px', right: '10px' })
  })
})
