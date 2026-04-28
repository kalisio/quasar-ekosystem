import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import KAction from '../../../src/components/action/KAction.vue'

const stubs = {
  'q-btn': { template: '<button class="q-btn" @click="$emit(\'click\')"><slot /></button>', emits: ['click'] },
  'q-item': { template: '<div class="q-item"><slot /></div>' },
  'q-item-section': { template: '<div><slot /></div>' },
  'q-item-label': { template: '<span><slot /></span>' },
  'q-tooltip': true,
  'q-badge': true,
  'k-icon': true
}

describe('KAction', () => {
  it('calls handler on click', async () => {
    const handler = vi.fn()
    const wrapper = mount(KAction, { props: { renderer: 'button', handler }, global: { stubs } })
    await wrapper.find('.q-btn').trigger('click')
    expect(handler).toHaveBeenCalled()
  })
})
