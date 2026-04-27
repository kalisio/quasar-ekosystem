import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KChipsField from '../../../src/components/KChipsField.vue'

// Renders the default slot — used by KChipsField which puts chips+input in v-slot:default
const chipsFieldStub = { template: '<div><slot /></div>' }
// Re-emits native keyup as a component event — allows @keyup.enter on q-input to fire in tests
const keyupInputStub = { template: '<input @keyup="$emit(\'keyup\', $event)" />', props: ['modelValue'], emits: ['update:modelValue', 'keyup'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KChipsField', () => {
  // chipsFieldStub renders the default slot so chips+input are visible in edit mode
  // keyupInputStub re-emits native keyup as component event so @keyup.enter fires
  const stubs = { 'q-field': chipsFieldStub, 'q-chip': true, 'q-input': keyupInputStub }

  // Edit mode renders a text input for typing chip values.
  it('renders an input in edit mode', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  // readOnly shows one chip per value in the array.
  it('renders a chip per value in readOnly mode', () => {
    const wrapper = mount(KChipsField, { props: { ...makeProps(), readOnly: true, values: { test: ['foo', 'bar'] } }, global: { stubs } })
    expect(wrapper.findAll('q-chip-stub').length).toBe(2)
  })

  // emptyModel is [] (not null), so the model is always an array.
  it('initializes model to [] when no values are provided', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.value()).toEqual([])
  })

  // chips is a local copy of the model — kept in sync via a flush:sync watcher.
  it('chips local state is initially empty', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.chips).toEqual([])
  })

  // input is the text the user is currently typing before pressing Enter.
  it('input state is initially empty string', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.input).toBe('')
  })

  // isEmpty is true when the chips array is empty.
  it('isEmpty returns true when model is empty array', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('isEmpty returns false when model has chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['tag1'])
    expect(wrapper.vm.isEmpty()).toBe(false)
  })

  /* it('fill sets the model to an array of chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['a', 'b', 'c'])
    expect(wrapper.vm.value()).toEqual(['a', 'b', 'c'])
  }) */

  // fill() also updates the chips local state immediately (flush:sync).
  it('fill syncs the chips local state (flush:sync watch)', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['a', 'b'])
    expect(wrapper.vm.chips).toEqual(['a', 'b'])
  })

  // After fill(), chip stubs appear in the DOM on the next tick.
  it('fill syncs chips displayed in edit mode', async () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['a', 'b'])
    await nextTick()
    expect(wrapper.findAll('q-chip-stub').length).toBe(2)
  })

  // clear() resets to [] (emptyModel).
  it('clear resets model to []', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['a', 'b'])
    wrapper.vm.clear()
    expect(wrapper.vm.value()).toEqual([])
  })

  // onChipAdded appends input to chips and clears the text input.
  it('onChipAdded appends the input value to chips and clears input', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    wrapper.vm.input = 'newtag'
    wrapper.vm.onChipAdded()
    expect(wrapper.vm.chips).toContain('newtag')
    expect(wrapper.vm.input).toBe('')
  })

  // onChipAdded also calls updateModel, so the model stays in sync.
  it('onChipAdded syncs chips to model via updateModel', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    wrapper.vm.input = 'newtag'
    wrapper.vm.onChipAdded()
    expect(wrapper.vm.value()).toContain('newtag')
  })

  // Pressing Enter in the input triggers onChipAdded (bound via @keyup.enter).
  it('pressing Enter in the input adds a chip via @keyup.enter', async () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    wrapper.vm.input = 'entertag'
    await wrapper.find('input').trigger('keyup', { key: 'Enter' })
    expect(wrapper.vm.chips).toContain('entertag')
  })

  // onChipRemoved removes the matching chip from the local chips array.
  it('onChipRemoved removes the chip from chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    wrapper.vm.fill(['a', 'b', 'c'])
    wrapper.vm.onChipRemoved('b')
    expect(wrapper.vm.chips).toEqual(['a', 'c'])
  })

  // updateModel syncs chips → model and emits field-changed in one call.
  it('updateModel syncs chips to model and emits field-changed', async () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.chips = ['x', 'y']
    wrapper.vm.updateModel()
    expect(wrapper.vm.value()).toEqual(['x', 'y'])
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', ['x', 'y']])
  })

  // In plain mode, chips are strings; chipValue/chipColor/chipIcon reflect that.
  it('chipValue returns the chip itself for string chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    expect(wrapper.vm.chipValue('hello')).toBe('hello')
  })

  it('chipColor returns dark for string chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    expect(wrapper.vm.chipColor('anything')).toBe('dark')
  })

  it('chipIcon returns undefined for string chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: false } }), global: { stubs } })
    expect(wrapper.vm.chipIcon('anything')).toBeUndefined()
  })

  // Icon mode: chips are objects { value, icon: { name, color } } instead of plain strings.
  it('icon mode: onChipAdded creates object chips with icon', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    wrapper.vm.input = 'mytag'
    wrapper.vm.onChipAdded()
    expect(wrapper.vm.chips[0]).toMatchObject({ value: 'mytag' })
    expect(wrapper.vm.chips[0].icon).toBeDefined()
  })

  it('icon mode: chipValue extracts chip.value from object chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    expect(wrapper.vm.chipValue({ value: 'hello', icon: { name: 'star', color: 'red' } })).toBe('hello')
  })

  it('icon mode: chipIcon extracts icon name from object chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    expect(wrapper.vm.chipIcon({ value: 'hello', icon: { name: 'star', color: 'red' } })).toBe('star')
  })

  it('icon mode: chipColor extracts icon color from object chips', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    expect(wrapper.vm.chipColor({ value: 'hello', icon: { name: 'star', color: 'red' } })).toBe('red')
  })

  // In icon mode, onChipRemoved matches by chip.value (not by reference).
  it('icon mode: onChipRemoved filters by chip.value', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    const chipA = { value: 'a', icon: { name: 'x', color: 'dark' } }
    const chipB = { value: 'b', icon: { name: 'y', color: 'dark' } }
    wrapper.vm.fill([chipA, chipB])
    wrapper.vm.onChipRemoved(chipA)
    expect(wrapper.vm.chips).toEqual([chipB])
  })

  // chipValue falls back to chip.name when chip.value is falsy (legacy icon objects).
  it('icon mode: chipValue falls back to chip.name when chip.value is falsy', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    expect(wrapper.vm.chipValue({ name: 'fallback', icon: {} })).toBe('fallback')
  })

  // chipColor falls back to 'dark' when icon.color is absent.
  it('icon mode: chipColor defaults to dark when icon.color is absent', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    expect(wrapper.vm.chipColor({ value: 'x', icon: {} })).toBe('dark')
  })

  // readOnly in icon mode still renders one chip per item.
  it('icon mode: readOnly renders chips using chipValue from icon objects', async () => {
    const chips = [{ value: 'alpha', icon: { name: 'star', color: 'primary' } }]
    const wrapper = mount(KChipsField, { props: { ...makeProps({ field: { icon: true } }), readOnly: true, values: { test: chips } }, global: { stubs } })
    expect(wrapper.findAll('q-chip-stub').length).toBe(1)
  })

  /* it('invalidate sets hasError to true', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    expect(wrapper.vm.hasError).toBe(true)
  }) */

  /* it('validate clears the error', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.invalidate('required')
    wrapper.vm.validate()
    expect(wrapper.vm.hasError).toBe(false)
  }) */

  /* it('onChanged emits field-changed', async () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['x', 'y'])
    await wrapper.vm.onChanged()
    expect(wrapper.emitted('field-changed')[0]).toEqual(['test', ['x', 'y']])
  }) */

  // If values prop is provided on mount, the model should be initialized with the matching value.
  it('values prop initializes the model', () => {
    const wrapper = mount(KChipsField, { props: { ...makeProps(), values: { test: ['init'] } }, global: { stubs } })
    expect(wrapper.vm.value()).toEqual(['init'])
  })

  // values prop change also syncs the chips local state (not just the model).
  it('values prop change updates the model and chips reactively', async () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    await wrapper.setProps({ values: { test: ['reactive'] } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(['reactive'])
    expect(wrapper.vm.chips).toEqual(['reactive'])
  })

  /* it('field.disabled disables the field', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { disabled: true } }), global: { stubs } })
    expect(wrapper.vm.disabled).toBe(true)
  }) */

  /* it('apply writes the model value to a target object', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(['tag1', 'tag2'])
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual(['tag1', 'tag2'])
  }) */

  // onChipClicked emits a chip-clicked event with the full chip payload (used by callers to handle icon actions).
  it('onChipClicked emits chip-clicked with the chip payload', () => {
    const wrapper = mount(KChipsField, { props: makeProps({ field: { icon: true } }), global: { stubs } })
    const chip = { value: 'hello', icon: { name: 'star', color: 'red' } }
    wrapper.vm.onChipClicked(chip)
    expect(wrapper.emitted('chip-clicked')).toBeTruthy()
    expect(wrapper.emitted('chip-clicked')[0][0]).toEqual(chip)
  })

  // onChipClicked does not throw for plain string chips (non-icon mode).
  it('onChipClicked does nothing harmful for string chips (non-icon mode)', () => {
    const wrapper = mount(KChipsField, { props: makeProps(), global: { stubs } })
    expect(() => wrapper.vm.onChipClicked('hello')).not.toThrow()
  })
})
