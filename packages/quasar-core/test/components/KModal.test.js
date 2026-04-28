import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KModal from '../../src/KModal.vue'

describe('KModal', () => {
  it('exposes the title prop', () => {
    const wrapper = mount(KModal, { props: { title: 'My Modal' } })
    expect(wrapper.vm.title).toBe('My Modal')
  })
})
