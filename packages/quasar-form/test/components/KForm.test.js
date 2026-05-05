import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import '../../src/index.js'
import KForm from '../../src/components/KForm.vue'
import { schemaRegistry } from '../../src/utils/index.js'

vi.mock('@logtape/logtape', () => ({
  getLogger: () => ({ debug: vi.fn(), error: vi.fn(), warn: vi.fn(), info: vi.fn() })
}))

// Quasar component stubs — render slots so child fields mount properly
const quasarStubs = {
  'q-form': { template: '<form @submit.prevent="$emit(\'submit\', $event)"><slot /></form>', emits: ['submit'] },
  'q-expansion-item': { template: '<div><slot name="header" /><slot /></div>' },
  'q-card': { template: '<div><slot /></div>' },
  'q-card-section': { template: '<div><slot /></div>' },
  'q-item-section': { template: '<div><slot /></div>' },
  'q-input': { template: '<input />', props: ['modelValue'], emits: ['update:modelValue', 'blur'] },
  'k-action': true
}

const userSchema = {
  $id: 'user-form',
  type: 'object',
  properties: {
    name: { type: 'string', field: { component: 'KTextField' } },
    age: { type: ['integer', 'null'], field: { component: 'KNumberField' } }
  },
  required: ['name']
}

async function mountReady (extraProps = {}) {
  const wrapper = mount(KForm, { props: { schema: userSchema, ...extraProps }, global: { stubs: quasarStubs } })
  await flushPromises()
  return wrapper
}

describe('KForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    schemaRegistry.initialize()
  })

  // Le formulaire est rendu depuis un schéma JSON.
  it('renders the form from a schema', async () => {
    const wrapper = await mountReady()
    expect(wrapper.find('form').exists()).toBe(true)
  })

  // fill() distribue les valeurs, values() les retourne, validate() les vérifie.
  it.skip('fill / values / validate work together', async () => {
    const wrapper = await mountReady()
    expect(wrapper.vm.validate().isValid).toBe(false)
    wrapper.vm.fill({ name: 'Alice', age: 30 })
    expect(wrapper.vm.values()).toEqual({ name: 'Alice', age: 30 })
    expect(wrapper.vm.validate().isValid).toBe(true)
  })

  // apply() écrit chaque valeur dans un objet cible.
  it.skip('apply writes values to a target object', async () => {
    const wrapper = await mountReady()
    wrapper.vm.fill({ name: 'Bob', age: 25 })
    const obj = {}
    await wrapper.vm.apply(obj)
    expect(obj).toEqual({ name: 'Bob', age: 25 })
  })

  // Without a schema prop, the q-form element is not rendered at all
  it('renders nothing when no schema is provided', () => {
    const wrapper = mount(KForm, { props: {}, global: { stubs: quasarStubs } })
    expect(wrapper.find('form').exists()).toBe(false)
  })

  // fill() throws immediately when called before the build completes
  it('fill throws when the form is not ready', () => {
    const wrapper = mount(KForm, { props: { schema: userSchema }, global: { stubs: quasarStubs } })
    expect(() => wrapper.vm.fill({})).toThrow('Cannot fill the form while not ready')
  })

  // clear() throws immediately when called before the build completes
  it('clear throws when the form is not ready', () => {
    const wrapper = mount(KForm, { props: { schema: userSchema }, global: { stubs: quasarStubs } })
    expect(() => wrapper.vm.clear()).toThrow('Cannot clear the form while not ready')
  })

  // validate() throws immediately when called before the build completes
  it('validate throws when the form is not ready', () => {
    const wrapper = mount(KForm, { props: { schema: userSchema }, global: { stubs: quasarStubs } })
    expect(() => wrapper.vm.validate()).toThrow('Cannot validate the form while not ready')
  })

  // isReady becomes true once all field components have mounted and registered themselves
  it('marks isReady as true after build', async () => {
    const wrapper = await mountReady()
    expect(wrapper.vm.isReady).toBe(true)
  })

  // form-ready is emitted exactly once when all field refs have been set
  it('emits form-ready when all fields are mounted', async () => {
    const wrapper = await mountReady()
    expect(wrapper.emitted('form-ready')).toBeTruthy()
    expect(wrapper.emitted('form-ready').length).toBe(1)
  })

  // Fields listed in schema.required receive required:true on their descriptor
  it('assigns required flag based on schema.required array', async () => {
    const wrapper = await mountReady()
    const nameField = wrapper.vm.fields.find(f => f.name === 'name')
    expect(nameField.required).toBe(true)
    const ageField = wrapper.vm.fields.find(f => f.name === 'age')
    expect(ageField.required).toBe(false)
  })

  // Passing filter=['name'] limits the built fields to the listed property
  it('applies filter when provided — keeps only the filtered property', async () => {
    const wrapper = await mountReady({ filter: ['name'] })
    expect(wrapper.vm.fields.length).toBe(1)
    expect(wrapper.vm.fields[0].name).toBe('name')
  })

  // groups is empty when schema has no groups section
  it('groups is empty when schema has no groups', async () => {
    const wrapper = await mountReady()
    expect(wrapper.vm.groups).toEqual({})
  })

  // validate returns isValid:false when a required field has no value
  it('returns isValid false when a required field is missing', async () => {
    const wrapper = await mountReady()
    const result = wrapper.vm.validate()
    expect(result.isValid).toBe(false)
  })
})
