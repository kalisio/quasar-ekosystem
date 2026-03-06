import { describe, it, expect, beforeEach } from 'vitest'
import { schemaRegistry } from '../src/utils/index.js'

const userschemaRegistry = {
  $id: 'user',
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'integer', minimum: 0 }
  },
  required: ['name']
}

describe('schemaRegistry', () => {
  beforeEach(() => {
    schemaRegistry.initialize()
  })

  describe('initialize', () => {
    it('throws when registering without initialization', () => {
      schemaRegistry.ajv = null
      expect(() => schemaRegistry.register(userschemaRegistry)).toThrow('schemaRegistry must be initialized first')
    })

    it('initializes with default options', () => {
      schemaRegistry.initialize()
      expect(schemaRegistry.ajv).toBeDefined()
    })

    it('accepts custom options', () => {
      schemaRegistry.initialize({ allErrors: false, strict: false })
      expect(schemaRegistry.ajv).toBeDefined()
    })
  })

  describe('register', () => {
    it('compiles a valid schema', () => {
      const validate = schemaRegistry.register(userschemaRegistry)
      expect(typeof validate).toBe('function')
    })

    it('throws when schema has no $id', () => {
      expect(() => schemaRegistry.register({ type: 'object' })).toThrow('the schema must have an `$id` property')
    })

    it('returns the same compiled validator when called twice with the same $id', () => {
      const v1 = schemaRegistry.register(userschemaRegistry)
      const v2 = schemaRegistry.register(userschemaRegistry)
      expect(v1).toBe(v2)
    })
  })

  describe('validate', () => {
    it('validates a valid object', () => {
      const validate = schemaRegistry.register(userschemaRegistry)
      expect(validate({ name: 'Alice', age: 30 })).toBe(true)
    })

    it('rejects an object missing a required field', () => {
      const validate = schemaRegistry.register(userschemaRegistry)
      expect(validate({ age: 30 })).toBe(false)
      expect(validate.errors).not.toBeNull()
    })

    it('rejects an object with a wrong type', () => {
      const validate = schemaRegistry.register(userschemaRegistry)
      expect(validate({ name: 'Alice', age: 'not-a-number' })).toBe(false)
    })

    it('rejects an integer below minimum', () => {
      const validate = schemaRegistry.register(userschemaRegistry)
      expect(validate({ name: 'Alice', age: -1 })).toBe(false)
    })
  })

  describe('keywords', () => {
    it('adds and retrieves a custom keyword', () => {
      schemaRegistry.addKeyword({ keyword: 'myCustomKeyword', schemaType: 'boolean' })
      expect(schemaRegistry.getKeyword('myCustomKeyword')).toBeTruthy()
    })

    it('removes a custom keyword', () => {
      schemaRegistry.addKeyword({ keyword: 'removableKeyword', schemaType: 'boolean' })
      schemaRegistry.removeKeyword('removableKeyword')
      expect(schemaRegistry.getKeyword('removableKeyword')).toBe(false)
    })
  })
})
