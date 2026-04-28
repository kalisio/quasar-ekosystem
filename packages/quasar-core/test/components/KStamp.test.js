import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KStamp from '../../src/KStamp.vue'

describe('KStamp', () => {
  it('reports canShowIcon when icon prop is provided', () => {
    const wrapper = mount(KStamp, { props: { text: 'Hello', icon: 'las la-star' } })
    expect(wrapper.vm.canShowIcon).toBe(true)
  })
})
