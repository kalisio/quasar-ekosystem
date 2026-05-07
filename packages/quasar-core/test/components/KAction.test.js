import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { openURL } from 'quasar'
import KAction from '../../src/components/KAction.vue'

afterEach(() => vi.restoreAllMocks())

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

  // computedLabel returns toggle.label when isToggled and toggle has a label
  it('computedLabel uses toggle.label when toggled', () => {
    const wrapper = mount(KAction, { props: { id: 'test', label: 'Off', toggle: { label: 'On' } } })
    wrapper.vm.toggle()
    expect(wrapper.vm.computedLabel).toBe('On')
  })

  // computedIcon returns toggle.icon when isToggled and toggle has an icon
  it('computedIcon uses toggle.icon when toggled', () => {
    const wrapper = mount(KAction, { props: { id: 'test', icon: 'la-star', toggle: { icon: 'la-heart' } } })
    wrapper.vm.toggle()
    expect(wrapper.vm.computedIcon).toBe('la-heart')
  })

  // computedColor defaults to primary when toggled and toggle has no color property
  it('computedColor returns primary when toggled without toggle.color', () => {
    const wrapper = mount(KAction, { props: { id: 'test', color: 'red', toggle: {} } })
    wrapper.vm.toggle()
    expect(wrapper.vm.computedColor).toBe('primary')
  })

  // computedDisabled calls the disabled function and returns its result
  it('computedDisabled calls function when disabled is a function', () => {
    const disabled = vi.fn(() => true)
    const wrapper = mount(KAction, { props: { id: 'test', disabled } })
    expect(wrapper.vm.computedDisabled).toBe(true)
    expect(disabled).toHaveBeenCalled()
  })

  // Clicking the button in button renderer emits the triggered event
  it('emits triggered when button is clicked', async () => {
    const wrapper = mount(KAction, { props: { id: 'test', renderer: 'button' } })
    await wrapper.find('q-btn').trigger('click')
    expect(wrapper.emitted('triggered')).toBeTruthy()
  })

  // In item renderer, a q-item element is present in the DOM
  it('item renderer renders q-item', () => {
    const wrapper = mount(KAction, { props: { id: 'test', renderer: 'item' } })
    expect(wrapper.find('q-item').exists()).toBe(true)
  })

  // computedTooltip returns undefined when the action is disabled (hides tooltip on disabled button)
  it('computedTooltip is undefined when disabled', () => {
    const wrapper = mount(KAction, { props: { id: 'test', disabled: true, tooltip: 'some tip' } })
    expect(wrapper.vm.computedTooltip).toBeUndefined()
  })

  // computedTooltip returns toggle.tooltip when toggled and toggle declares a tooltip
  it('computedTooltip uses toggle.tooltip when toggled', () => {
    const wrapper = mount(KAction, { props: { id: 'test', tooltip: 'Normal', toggle: { tooltip: 'Toggled tip' } } })
    wrapper.vm.toggle()
    expect(wrapper.vm.computedTooltip).toBe('Toggled tip')
  })

  // computedBadgeLabel reads badge.label through i18n.tie
  it('computedBadgeLabel returns badge label when set', () => {
    const wrapper = mount(KAction, { props: { id: 'test', badge: { label: 'new' } } })
    expect(wrapper.vm.computedBadgeLabel).toBe('new')
  })

  // computedBadgeLabel returns undefined when badge has no label property
  it('computedBadgeLabel returns undefined when badge has no label', () => {
    const wrapper = mount(KAction, { props: { id: 'test', badge: { color: 'red' } } })
    expect(wrapper.vm.computedBadgeLabel).toBeUndefined()
  })

  // url prop causes openURL to be called when the button is clicked
  it('url prop calls openURL on click', async () => {
    const wrapper = mount(KAction, { props: { id: 'test', renderer: 'button', url: 'https://example.com' } })
    await wrapper.find('q-btn').trigger('click')
    expect(openURL).toHaveBeenCalledWith('https://example.com')
  })

  // dialog prop causes $q.dialog to open and emits dialog-confirmed via mock's onOk callback
  it('dialog prop emits dialog-confirmed when $q.dialog onOk fires', async () => {
    const wrapper = mount(KAction, { props: { id: 'test', renderer: 'button', dialog: {} } })
    await wrapper.find('q-btn').trigger('click')
    expect(wrapper.emitted('dialog-confirmed')).toBeTruthy()
  })

  // form-button renderer renders a q-btn element
  it('form-button renderer renders q-btn', () => {
    const wrapper = mount(KAction, { props: { id: 'test', renderer: 'form-button', label: 'Submit' } })
    expect(wrapper.find('q-btn').exists()).toBe(true)
  })

  // fab renderer renders a q-btn with the k-fab CSS class
  it('fab renderer renders q-btn with k-fab class', () => {
    const wrapper = mount(KAction, { props: { id: 'test', renderer: 'fab' } })
    expect(wrapper.find('q-btn.k-fab').exists()).toBe(true)
  })

  // tab renderer renders a q-btn element
  it('tab renderer renders q-btn', () => {
    const wrapper = mount(KAction, { props: { id: 'test', renderer: 'tab', label: 'Tab 1' } })
    expect(wrapper.find('q-btn').exists()).toBe(true)
  })
})
