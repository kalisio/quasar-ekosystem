import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

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
  it('fill / values / validate work together', async () => {
    const wrapper = await mountReady()
    expect(wrapper.vm.validate().isValid).toBe(false)
    wrapper.vm.fill({ name: 'Alice', age: 30 })
    expect(wrapper.vm.values()).toEqual({ name: 'Alice', age: 30 })
    expect(wrapper.vm.validate().isValid).toBe(true)
  })

  // apply() écrit chaque valeur dans un objet cible.
  it('apply writes values to a target object', async () => {
    const wrapper = await mountReady()
    wrapper.vm.fill({ name: 'Bob', age: 25 })
    const obj = {}
    await wrapper.vm.apply(obj)
    expect(obj).toEqual({ name: 'Bob', age: 25 })
  })

  /* it('emits form-ready when all fields are mounted', () => { ... }) */
  /* it('assigns required flag based on schema.required array', () => { ... }) */
  /* it('renders nothing when no schema is provided', () => { ... }) */
  /* it('marks isReady as true after build', () => { ... }) */
  /* it('applies filter when provided', () => { ... }) */
  /* it('excludes required fields when empty', () => { ... }) */
  /* it('clears fields that have no matching value', () => { ... }) */
  /* it('throws when the form is not ready', () => { ... }) */
  /* it('clears all fields', () => { ... }) */
  /* it('invalidates the field that has the matching AJV error', () => { ... }) */
  /* it('submitted runs without error', () => { ... }) */
})
