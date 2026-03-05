import { describe, it, expect, beforeEach } from 'vitest'
import { Schema } from '../src/composables/schema.js'

const userSchema = {
  $id: 'user',
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'integer', minimum: 0 }
  },
  required: ['name']
}

describe('Schema', () => {
  beforeEach(() => {
    Schema.initialize()
  })

  describe('initialize', () => {
    it('throws when registering without initialization', () => {
      Schema.ajv = null
      expect(() => Schema.register(userSchema)).toThrow('Schema must be initialized first')
    })

    it('initializes with default options', () => {
      Schema.initialize()
      expect(Schema.ajv).toBeDefined()
    })

    it('accepts custom options', () => {
      Schema.initialize({ allErrors: false, strict: false })
      expect(Schema.ajv).toBeDefined()
    })
  })

  describe('register', () => {
    it('compiles a valid schema', () => {
      const validate = Schema.register(userSchema)
      expect(typeof validate).toBe('function')
    })

    it('throws when schema has no $id', () => {
      expect(() => Schema.register({ type: 'object' })).toThrow('the schema must have an `$id` property')
    })

    it('returns the same compiled validator when called twice with the same $id', () => {
      const v1 = Schema.register(userSchema)
      const v2 = Schema.register(userSchema)
      expect(v1).toBe(v2)
    })
  })

  describe('validate', () => {
    it('validates a valid object', () => {
      const validate = Schema.register(userSchema)
      expect(validate({ name: 'Alice', age: 30 })).toBe(true)
    })

    it('rejects an object missing a required field', () => {
      const validate = Schema.register(userSchema)
      expect(validate({ age: 30 })).toBe(false)
      expect(validate.errors).not.toBeNull()
    })

    it('rejects an object with a wrong type', () => {
      const validate = Schema.register(userSchema)
      expect(validate({ name: 'Alice', age: 'not-a-number' })).toBe(false)
    })

    it('rejects an integer below minimum', () => {
      const validate = Schema.register(userSchema)
      expect(validate({ name: 'Alice', age: -1 })).toBe(false)
    })
  })

  describe('keywords', () => {
    it('adds and retrieves a custom keyword', () => {
      Schema.addKeyword({ keyword: 'myCustomKeyword', schemaType: 'boolean' })
      expect(Schema.getKeyword('myCustomKeyword')).toBeTruthy()
    })

    it('removes a custom keyword', () => {
      Schema.addKeyword({ keyword: 'removableKeyword', schemaType: 'boolean' })
      Schema.removeKeyword('removableKeyword')
      expect(Schema.getKeyword('removableKeyword')).toBe(false)
    })
  })
})
