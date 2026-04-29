import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import KAvatar from '../../src/components/KAvatar.vue'

describe('KAvatar', () => {
  // Extracts uppercase initials from a two-word name
  it('computes initials from subject name', async () => {
    const wrapper = mount(KAvatar, { props: { subject: { name: 'Alice Bob' } } })
    await flushPromises()
    expect(wrapper.vm.initials).toBe('AB')
  })

  // Reads the avatar URI from the subject's avatar object
  it('sets avatar when subject has avatar.uri', async () => {
    const wrapper = mount(KAvatar, { props: { subject: { avatar: { uri: 'http://example.com/photo.jpg' } } } })
    await flushPromises()
    expect(wrapper.vm.avatar).toBe('http://example.com/photo.jpg')
  })

  // Reads icon name and color from the subject's icon object
  it('sets icon when subject has icon field', async () => {
    const wrapper = mount(KAvatar, { props: { subject: { icon: { name: 'home', color: 'blue' } } } })
    await flushPromises()
    expect(wrapper.vm.icon).toBe('home')
    expect(wrapper.vm.color).toBe('blue')
  })

  // All display values are null when the subject carries no data
  it('renders nothing when subject is empty', async () => {
    const wrapper = mount(KAvatar, { props: { subject: {} } })
    await flushPromises()
    expect(wrapper.vm.avatar).toBeNull()
    expect(wrapper.vm.icon).toBeNull()
    expect(wrapper.vm.initials).toBeNull()
  })

  // Reactive tests
  // Changing the subject prop recalculates initials from the new name
  it('updates initials when subject prop changes', async () => {
    const wrapper = mount(KAvatar, { props: { subject: { name: 'Alice Bob' } } })
    await flushPromises()
    expect(wrapper.vm.initials).toBe('AB')
    await wrapper.setProps({ subject: { name: 'John Doe' } })
    await flushPromises()
    expect(wrapper.vm.initials).toBe('JD')
  })

  // Switching from a name subject to an icon subject resolves the icon
  it('sets icon when subject changes to icon subject', async () => {
    const wrapper = mount(KAvatar, { props: { subject: { name: 'Alice' } } })
    await flushPromises()
    expect(wrapper.vm.initials).toBe('A')
    await wrapper.setProps({ subject: { icon: { name: 'home' } } })
    await flushPromises()
    expect(wrapper.vm.icon).toBe('home')
  })
})
