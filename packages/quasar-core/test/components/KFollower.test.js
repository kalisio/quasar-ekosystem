import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KFollower from '../../src/components/KFollower.vue'

const follower = { component: 'KChip', label: 'test' }

describe('KFollower', () => {
  it('positions top-right by default', () => {
    const wrapper = mount(KFollower, { props: { follower, targetId: 'target' } })
    expect(wrapper.vm.computedStyle.top).toBe('0px')
    expect(wrapper.vm.computedStyle.right).toBe('0px')
    expect(wrapper.vm.computedStyle.position).toBe('absolute')
  })

  it('positions top-left when anchor is top-left', () => {
    const wrapper = mount(KFollower, { props: { follower, targetId: 'target', anchor: 'top-left' } })
    expect(wrapper.vm.computedStyle.top).toBeDefined()
    expect(wrapper.vm.computedStyle.left).toBeDefined()
    expect(wrapper.vm.computedStyle.right).toBeUndefined()
  })

  it('positions bottom-left when anchor is bottom-left', () => {
    const wrapper = mount(KFollower, { props: { follower, targetId: 'target', anchor: 'bottom-left' } })
    expect(wrapper.vm.computedStyle.bottom).toBeDefined()
    expect(wrapper.vm.computedStyle.left).toBeDefined()
  })

  it('positions bottom-right for unknown anchor (default)', () => {
    const wrapper = mount(KFollower, { props: { follower, targetId: 'target', anchor: 'bottom-right' } })
    expect(wrapper.vm.computedStyle.bottom).toBeDefined()
    expect(wrapper.vm.computedStyle.right).toBeDefined()
  })

  it('applies offset to position', () => {
    const wrapper = mount(KFollower, { props: { follower, targetId: 'target', anchor: 'top-right', offset: [10, 20] } })
    expect(wrapper.vm.computedStyle.right).toBe('10px')
    expect(wrapper.vm.computedStyle.top).toBe('20px')
  })

  it('omits component key from computedProps', () => {
    const wrapper = mount(KFollower, { props: { follower, targetId: 'target' } })
    expect(wrapper.vm.computedProps.component).toBeUndefined()
    expect(wrapper.vm.computedProps.label).toBe('test')
  })

  // Responsive tests
  it('updates style when anchor prop changes', async () => {
    const wrapper = mount(KFollower, { props: { follower, targetId: 'target', anchor: 'top-right' } })
    expect(wrapper.vm.computedStyle.top).toBeDefined()
    expect(wrapper.vm.computedStyle.right).toBeDefined()
    await wrapper.setProps({ anchor: 'bottom-left' })
    expect(wrapper.vm.computedStyle.bottom).toBeDefined()
    expect(wrapper.vm.computedStyle.left).toBeDefined()
    expect(wrapper.vm.computedStyle.top).toBeUndefined()
  })

  it('updates style when offset prop changes', async () => {
    const wrapper = mount(KFollower, { props: { follower, targetId: 'target', offset: [0, 0] } })
    expect(wrapper.vm.computedStyle.right).toBe('0px')
    await wrapper.setProps({ offset: [15, 25] })
    expect(wrapper.vm.computedStyle.right).toBe('15px')
    expect(wrapper.vm.computedStyle.top).toBe('25px')
  })
})
