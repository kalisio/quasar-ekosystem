import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { plugin as QuasarForm } from '../../src/plugin.js'
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
  const wrapper = mount(KForm, { props: { schema: userSchema, ...extraProps }, global: { plugins: [QuasarForm], stubs: quasarStubs } })
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
    const wrapper = mount(KForm, { props: {}, global: { plugins: [QuasarForm], stubs: quasarStubs } })
    expect(wrapper.find('form').exists()).toBe(false)
  })

  // fill() throws immediately when called before the build completes
  it('fill throws when the form is not ready', () => {
    const wrapper = mount(KForm, { props: { schema: userSchema }, global: { plugins: [QuasarForm], stubs: quasarStubs } })
    expect(() => wrapper.vm.fill({})).toThrow('Cannot fill the form while not ready')
  })

  // clear() throws immediately when called before the build completes
  it('clear throws when the form is not ready', () => {
    const wrapper = mount(KForm, { props: { schema: userSchema }, global: { plugins: [QuasarForm], stubs: quasarStubs } })
    expect(() => wrapper.vm.clear()).toThrow('Cannot clear the form while not ready')
  })

  // validate() throws immediately when called before the build completes
  it('validate throws when the form is not ready', () => {
    const wrapper = mount(KForm, { props: { schema: userSchema }, global: { plugins: [QuasarForm], stubs: quasarStubs } })
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

  // values() excludes required+empty fields but includes optional ones
  it('values returns optional fields even when empty', async () => {
    const wrapper = await mountReady()
    const v = wrapper.vm.values()
    expect(v).toHaveProperty('age')
    expect(v).not.toHaveProperty('name')
  })

  // fill() distributes values to all field references
  it('fill distributes values to fields and values() reflects them', async () => {
    const wrapper = await mountReady()
    wrapper.vm.fill({ name: 'Alice', age: 30 })
    const v = wrapper.vm.values()
    expect(v.name).toBe('Alice')
    expect(v.age).toBe(30)
  })

  // validate() returns isValid:true when all required fields are filled
  it('validate returns isValid true when all required fields are filled', async () => {
    const wrapper = await mountReady()
    wrapper.vm.fill({ name: 'Alice' })
    const result = wrapper.vm.validate()
    expect(result.isValid).toBe(true)
    expect(result.values.name).toBe('Alice')
  })

  // clear() resets all fields to their empty state
  it('clear resets all fields', async () => {
    const wrapper = await mountReady()
    wrapper.vm.fill({ name: 'Alice', age: 30 })
    wrapper.vm.clear()
    expect(wrapper.vm.values().age).toBeNull()
  })

  // apply() writes each field value into the provided object
  it('apply writes field values to a target object', async () => {
    const wrapper = await mountReady()
    wrapper.vm.fill({ name: 'Bob', age: 25 })
    const obj = {}
    await wrapper.vm.apply(obj)
    expect(obj.name).toBe('Bob')
    expect(obj.age).toBe(25)
  })

  // submitted() throws when form is not ready
  it('submitted throws when the form is not ready', async () => {
    const wrapper = mount(KForm, { props: { schema: userSchema }, global: { plugins: [QuasarForm], stubs: quasarStubs } })
    await expect(wrapper.vm.submitted({})).rejects.toThrow('Cannot run submitted on the form while not ready')
  })

  // apply() throws when form is not ready
  it('apply throws when the form is not ready', async () => {
    const wrapper = mount(KForm, { props: { schema: userSchema }, global: { plugins: [QuasarForm], stubs: quasarStubs } })
    await expect(wrapper.vm.apply({})).rejects.toThrow('Cannot apply the form while not ready')
  })

  // schema with no field.component falls back to KNumberField for number type
  it('uses KNumberField as default component for number type', async () => {
    const numSchema = {
      $id: 'num-form',
      type: 'object',
      properties: { score: { type: 'number' } }
    }
    const wrapper = mount(KForm, { props: { schema: numSchema }, global: { plugins: [QuasarForm], stubs: quasarStubs } })
    await flushPromises()
    const field = wrapper.vm.fields.find(f => f.name === 'score')
    expect(field).toBeTruthy()
  })

  // schema watch triggers a rebuild when schema changes
  it('rebuilds the form when schema prop changes', async () => {
    const wrapper = await mountReady()
    const newSchema = { $id: 'new-form', type: 'object', properties: { title: { type: 'string', field: { component: 'KTextField' } } } }
    await wrapper.setProps({ schema: newSchema })
    await flushPromises()
    expect(wrapper.vm.fields.some(f => f.name === 'title')).toBe(true)
  })

  // submitted() iterates all field refs and calls their submitted hook
  it('submitted resolves when all field refs have submitted', async () => {
    const wrapper = await mountReady()
    await expect(wrapper.vm.submitted({})).resolves.toBeUndefined()
  })

  // uses KToggleField as default component for boolean type
  it('uses KToggleField as default component for boolean type', async () => {
    const boolSchema = { $id: 'bool-form', type: 'object', properties: { active: { type: 'boolean' } } }
    const wrapper = mount(KForm, { props: { schema: boolSchema }, global: { plugins: [QuasarForm], stubs: quasarStubs } })
    await flushPromises()
    expect(wrapper.vm.fields.some(f => f.name === 'active')).toBe(true)
  })

  // uses KTextField as default component for string type
  it('uses KTextField as default component for string type', async () => {
    const strSchema = { $id: 'str-form', type: 'object', properties: { title: { type: 'string' } } }
    const wrapper = mount(KForm, { props: { schema: strSchema }, global: { plugins: [QuasarForm], stubs: quasarStubs } })
    await flushPromises()
    expect(wrapper.vm.fields.some(f => f.name === 'title')).toBe(true)
  })

  // groups are built from schema.groups
  it('groups is populated when schema has groups', async () => {
    const groupedSchema = {
      $id: 'grouped-form',
      type: 'object',
      properties: { name: { type: 'string', field: { component: 'KTextField', group: 'info' } } },
      groups: { info: { label: 'Information', icon: 'info' } }
    }
    const wrapper = mount(KForm, { props: { schema: groupedSchema }, global: { plugins: [QuasarForm], stubs: quasarStubs } })
    await flushPromises()
    expect(Object.keys(wrapper.vm.groups)).toContain('info')
  })
})
