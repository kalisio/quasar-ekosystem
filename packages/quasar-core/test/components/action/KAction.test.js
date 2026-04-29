import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import KAction from '../../../src/components/action/KAction.vue'

describe('KAction', () => {
  // isToggled is false at startup when no toggled prop is given
  it('isToggled starts as false', () => {
    const wrapper = mount(KAction, { props: { id: 'test' } })
    expect(wrapper.vm.isToggled).toBe(false)
  })

  // toggle() inverts the value of isToggled
  it('toggle() flips isToggled', () => {
    const wrapper = mount(KAction, { props: { id: 'test' } })
    wrapper.vm.toggle()
    expect(wrapper.vm.isToggled).toBe(true)
  })

  // The watcher keeps isToggled in sync when the toggled prop is updated from outside
  it('isToggled updates when toggled prop changes', async () => {
    const wrapper = mount(KAction, { props: { id: 'test', toggled: false } })
    await wrapper.setProps({ toggled: true })
    expect(wrapper.vm.isToggled).toBe(true)
  })

  // In button renderer, the rendered text switches to toggle.label after toggle() is called
  it('shows toggle.label in DOM after toggle', async () => {
    const wrapper = mount(KAction, { props: { id: 'test', renderer: 'button', label: 'Off', toggle: { label: 'On' } } })
    expect(wrapper.text()).toContain('Off')
    wrapper.vm.toggle()
    await nextTick()
    expect(wrapper.text()).toContain('On')
  })

  // The handler function is called when the button renderer element is clicked
  it('calls handler on click', async () => {
    const handler = vi.fn()
    const wrapper = mount(KAction, { props: { id: 'test', renderer: 'button', handler } })
    await wrapper.find('q-btn').trigger('click')
    expect(handler).toHaveBeenCalled()
  })
})
