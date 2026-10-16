import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import KIconChooser from '../../src/components/KIconChooser.vue'

// Minimal FA icons.yml and empty categories.yml so created() does not throw
const ICONS_YAML = 'home:\n  styles:\n    - solid\n'
const CATEGORIES_YAML = '{}'

const globalConfig = {
  stubs: { KModal: true, KPalette: true },
  mocks: { $t: (key) => key }
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn()
    .mockResolvedValue({ status: 200, text: () => Promise.resolve(ICONS_YAML) })
  )
  // Second call (categories) returns empty object
  global.fetch
    .mockResolvedValueOnce({ status: 200, text: () => Promise.resolve(ICONS_YAML) })
    .mockResolvedValueOnce({ status: 200, text: () => Promise.resolve(CATEGORIES_YAML) })
})

describe('KIconChooser', () => {
  it('mounts without errors', async () => {
    const wrapper = mount(KIconChooser, {
      global: globalConfig
    })
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.exists()).toBe(true)
  })

  it('getIconId returns kebab-case name', () => {
    const wrapper = mount(KIconChooser, { global: globalConfig })
    expect(wrapper.vm.getIconId('fas fa-home')).toBe('fas-fa-home')
  })

  it('getIconColor returns grey-7 for unselected icon', () => {
    const wrapper = mount(KIconChooser, { global: globalConfig })
    expect(wrapper.vm.getIconColor('fas fa-star')).toBe('grey-7')
  })

  it('getIconColor returns selectedIcon color for selected icon', () => {
    const wrapper = mount(KIconChooser, { global: globalConfig })
    wrapper.vm.selectedIcon.name = 'fas fa-home'
    wrapper.vm.selectedIcon.color = 'red'
    expect(wrapper.vm.getIconColor('fas fa-home')).toBe('red')
  })

  it('getIconColor returns black when selected icon color is white', () => {
    const wrapper = mount(KIconChooser, { global: globalConfig })
    wrapper.vm.selectedIcon.name = 'fas fa-home'
    wrapper.vm.selectedIcon.color = 'white'
    expect(wrapper.vm.getIconColor('fas fa-home')).toBe('black')
  })

  it('maxPage is computed from allIcons and iconsPerPage', () => {
    const wrapper = mount(KIconChooser, { global: globalConfig })
    wrapper.vm.allIcons = Array.from({ length: 150 }, (_, i) => ({ name: `icon-${i}`, title: `icon-${i}` }))
    expect(wrapper.vm.maxPage).toBe(Math.ceil(150 / 70))
  })

  it('iconsPage returns correct slice for currentPage', () => {
    const wrapper = mount(KIconChooser, { global: globalConfig })
    wrapper.vm.allIcons = Array.from({ length: 150 }, (_, i) => ({ name: `icon-${i}`, title: `icon-${i}` }))
    wrapper.vm.currentPage = 2
    expect(wrapper.vm.iconsPage.length).toBe(70)
    expect(wrapper.vm.iconsPage[0].name).toBe('icon-70')
  })

  it('onIconSelected sets selectedIcon name', () => {
    const wrapper = mount(KIconChooser, { global: globalConfig })
    wrapper.vm.onIconSelected({ name: 'fas fa-home' })
    expect(wrapper.vm.selectedIcon.name).toBe('fas fa-home')
  })

  it('onIconSelected clears name when clicking the same icon again', () => {
    const wrapper = mount(KIconChooser, { global: globalConfig })
    wrapper.vm.selectedIcon.name = 'fas fa-home'
    wrapper.vm.onIconSelected({ name: 'fas fa-home' })
    expect(wrapper.vm.selectedIcon.name).toBe('')
  })

  it('iconSelected returns false when no icon selected', () => {
    const wrapper = mount(KIconChooser, { global: globalConfig })
    expect(wrapper.vm.iconSelected()).toBe(false)
  })

  it('iconSelected returns true after selecting an icon', () => {
    const wrapper = mount(KIconChooser, { global: globalConfig })
    wrapper.vm.selectedIcon.name = 'fas fa-home'
    expect(wrapper.vm.iconSelected()).toBe(true)
  })

  it('addFontAwsomeIcon pushes icon to list', () => {
    const wrapper = mount(KIconChooser, { global: globalConfig })
    const list = []
    wrapper.vm.addFontAwsomeIcon(list, 'home', 'fas fa-home')
    expect(list).toEqual([{ name: 'fas fa-home', title: 'home' }])
  })

  it('doDone emits icon-choosed with selectedIcon when palette is true', () => {
    const wrapper = mount(KIconChooser, {
      props: { palette: true },
      global: { ...globalConfig, stubs: { KModal: { template: '<div><slot /></div>', methods: { open () {}, close () {} } }, KPalette: true } }
    })
    wrapper.vm.selectedIcon = { name: 'fas fa-home', color: 'red' }
    wrapper.vm.doDone()
    expect(wrapper.emitted('icon-choosed')[0][0]).toEqual({ name: 'fas fa-home', color: 'red' })
  })

  it('doDone emits icon name only when palette is false', () => {
    const wrapper = mount(KIconChooser, {
      props: { palette: false },
      global: { ...globalConfig, stubs: { KModal: { template: '<div><slot /></div>', methods: { open () {}, close () {} } }, KPalette: true } }
    })
    wrapper.vm.selectedIcon = { name: 'fas fa-home', color: 'red' }
    wrapper.vm.doDone()
    expect(wrapper.emitted('icon-choosed')[0][0]).toBe('fas fa-home')
  })
})
