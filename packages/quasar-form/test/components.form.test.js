import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import KForm from '../src/components/KForm.vue'
import { Schema } from '../src/utils/index.js'

// logtape is a platform concern (like global.document in graphiks): silence noise
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
  'k-action': true
}

// Schema fixture — age uses ['integer', 'null'] so optional null fields pass AJV validation
const userSchema = {
  $id: 'user-form',
  type: 'object',
  properties: {
    name: { type: 'string', field: { component: 'KTextField' } },
    age: { type: ['integer', 'null'], field: { component: 'KNumberField' } }
  },
  required: ['name']
}

// Helper: mount KForm and wait for the full async build cycle
async function mountReady (schemaObj, extraProps = {}) {
  const wrapper = mount(KForm, {
    props: { schema: schemaObj, ...extraProps },
    global: { stubs: quasarStubs }
  })
  await flushPromises()
  return wrapper
}

describe('KForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Schema.initialize()
  })

  describe('render', () => {
    it('renders nothing when no schema is provided', async () => {
      const wrapper = mount(KForm, { global: { stubs: quasarStubs } })
      await flushPromises()
      expect(wrapper.find('form').exists()).toBe(false)
    })

    it('renders the form once the schema is compiled', async () => {
      const wrapper = await mountReady(userSchema)
      expect(wrapper.find('form').exists()).toBe(true)
    })

    it('renders one field per schema property', async () => {
      const wrapper = await mountReady(userSchema)
      expect(wrapper.find('.k-text-field').exists()).toBe(true)
      expect(wrapper.find('.k-number-field').exists()).toBe(true)
    })
  })

  describe('build', () => {
    it('emits form-ready when all fields are mounted', async () => {
      const wrapper = await mountReady(userSchema)
      expect(wrapper.emitted('form-ready')).toBeTruthy()
    })

    it('marks isReady as true after build', async () => {
      const wrapper = await mountReady(userSchema)
      expect(wrapper.vm.isReady).toBe(true)
    })

    it('assigns required flag based on schema.required array', async () => {
      const wrapper = await mountReady(userSchema)
      expect(wrapper.vm.getField('name').required).toBe(true)
      expect(wrapper.vm.getField('age').required).toBe(false)
    })

    it('applies filter when provided — keeps only the filtered property', async () => {
      const wrapper = await mountReady(userSchema, { filter: 'age' })
      expect(wrapper.vm.getField('age')).toBeTruthy()
      expect(wrapper.vm.getField('name')).toBeUndefined()
    })
  })

  describe('values', () => {
    it('excludes required fields when empty', async () => {
      const wrapper = await mountReady(userSchema)
      // name is required and empty → excluded; age is optional → included even if null
      expect(wrapper.vm.values()).toEqual({ age: null })
    })

    it('includes required fields when filled', async () => {
      const wrapper = await mountReady(userSchema)
      wrapper.vm.getField('name').reference.fill('Alice')
      expect(wrapper.vm.values()).toEqual({ name: 'Alice', age: null })
    })

    it('includes optional fields with their value', async () => {
      const wrapper = await mountReady(userSchema)
      wrapper.vm.getField('age').reference.fill(30)
      expect(wrapper.vm.values()).toEqual({ age: 30 })
    })
  })

  describe('fill', () => {
    it('fills each field with the matching value', async () => {
      const wrapper = await mountReady(userSchema)
      wrapper.vm.fill({ name: 'Bob', age: 25 })
      expect(wrapper.vm.getField('name').reference.value()).toBe('Bob')
      expect(wrapper.vm.getField('age').reference.value()).toBe(25)
    })

    it('clears fields that have no matching value', async () => {
      const wrapper = await mountReady(userSchema)
      wrapper.vm.fill({ name: 'Bob', age: 25 })
      wrapper.vm.fill({ name: 'Bob' })
      expect(wrapper.vm.getField('age').reference.isEmpty()).toBe(true)
    })

    it('throws when the form is not ready', async () => {
      const wrapper = mount(KForm, { global: { stubs: quasarStubs } })
      expect(() => wrapper.vm.fill({})).toThrow('Cannot fill the form while not ready')
    })
  })

  describe('clear', () => {
    it('clears all fields', async () => {
      const wrapper = await mountReady(userSchema)
      wrapper.vm.fill({ name: 'Bob', age: 25 })
      wrapper.vm.clear()
      expect(wrapper.vm.getField('name').reference.isEmpty()).toBe(true)
      expect(wrapper.vm.getField('age').reference.isEmpty()).toBe(true)
    })

    it('throws when the form is not ready', async () => {
      const wrapper = mount(KForm, { global: { stubs: quasarStubs } })
      expect(() => wrapper.vm.clear()).toThrow('Cannot clear the form while not ready')
    })
  })

  describe('validate', () => {
    it('returns isValid true when all required fields are filled', async () => {
      const wrapper = await mountReady(userSchema)
      wrapper.vm.getField('name').reference.fill('Alice')
      const { isValid } = wrapper.vm.validate()
      expect(isValid).toBe(true)
    })

    it('returns isValid false when a required field is missing', async () => {
      const wrapper = await mountReady(userSchema)
      // name is required and empty → AJV should detect it
      const { isValid } = wrapper.vm.validate()
      expect(isValid).toBe(false)
    })

    it('invalidates the field that has the matching AJV error', async () => {
      const wrapper = await mountReady(userSchema)
      wrapper.vm.validate()
      // name is required and missing → field should be invalidated
      expect(wrapper.vm.getField('name').reference.hasError).toBe(true)
    })

    it('validates (clears error on) fields that have no error', async () => {
      const wrapper = await mountReady(userSchema)
      // First invalidate age manually, then validate — age has no AJV error so it should be cleared
      wrapper.vm.getField('age').reference.invalidate('test error')
      wrapper.vm.validate()
      expect(wrapper.vm.getField('age').reference.hasError).toBe(false)
    })
  })

  describe('apply / submitted', () => {
    it('apply sets each field value on the target object', async () => {
      const wrapper = await mountReady(userSchema)
      wrapper.vm.fill({ name: 'Bob', age: 25 })
      const obj = {}
      await wrapper.vm.apply(obj)
      expect(obj.name).toBe('Bob')
      expect(obj.age).toBe(25)
    })

    it('submitted runs without error', async () => {
      const wrapper = await mountReady(userSchema)
      await expect(wrapper.vm.submitted({})).resolves.toBeUndefined()
    })
  })
})
