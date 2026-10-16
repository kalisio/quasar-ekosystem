import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KPalette from '../../src/components/KPalette.vue'
import { QUASAR_PALETTE } from '../../src/utilities/palette.js'

describe('KPalette', () => {
  it('renders one button per color in palette', () => {
    const wrapper = mount(KPalette)
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(Object.keys(QUASAR_PALETTE).length)
  })

  it('emits update:modelValue with clicked color', async () => {
    const wrapper = mount(KPalette)
    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe(Object.keys(QUASAR_PALETTE)[0])
  })

  it('uses round shape when shape is round', () => {
    const wrapper = mount(KPalette, { props: { shape: 'round' } })
    const btn = wrapper.findAllComponents({ name: 'QBtn' })[0]
    expect(btn.props('round')).toBe(true)
  })

  it('text-color is white for non-white colors', () => {
    const firstColor = Object.keys(QUASAR_PALETTE)[0]
    const wrapper = mount(KPalette, { props: { modelValue: firstColor } })
    const btn = wrapper.findAllComponents({ name: 'QBtn' })[0]
    expect(btn.props('textColor')).toBe('white')
  })
})
