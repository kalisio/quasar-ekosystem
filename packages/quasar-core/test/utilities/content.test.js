import { describe, it, expect, beforeEach, vi } from 'vitest'

let content

beforeEach(async () => {
  vi.resetModules()
  const module = await import('../../src/utilities/content.js')
  content = module.content
})

describe('content.resolve', () => {
  it('returns the value as-is if it is not a string', () => {
    expect(content.resolve(42, {})).toBe(42)
    expect(content.resolve(true, {})).toBe(true)
    expect(content.resolve(null, {})).toBe(null)
  })

  it('returns the value as-is if it does not start with :', () => {
    expect(content.resolve('hello', {})).toBe('hello')
  })

  it('resolves a path from the context', () => {
    expect(content.resolve(':name', { name: 'Alice' })).toBe('Alice')
  })

  it('resolves a nested path from the context', () => {
    expect(content.resolve(':user.name', { user: { name: 'Alice' } })).toBe('Alice')
  })

  it('returns undefined if the path does not exist in the context', () => {
    expect(content.resolve(':missing', {})).toBeUndefined()
  })

  it('resolves an argument index', () => {
    expect(content.resolve(':0', {}, ['first', 'second'])).toBe('first')
    expect(content.resolve(':1', {}, ['first', 'second'])).toBe('second')
  })

  it('delegates to a registered resolver', () => {
    content.registerResolver((value) => {
      if (value === ':custom') return 'from-resolver'
    })
    expect(content.resolve(':custom', {})).toBe('from-resolver')
  })

  it('moves to the next resolver if the current one returns undefined', () => {
    content.registerResolver(() => undefined)
    expect(content.resolve(':name', { name: 'Alice' })).toBe('Alice')
  })

  it('calls resolvers in registration order', () => {
    content.registerResolver((value) => { if (value === ':x') return 'first' })
    content.registerResolver((value) => { if (value === ':x') return 'second' })
    expect(content.resolve(':x', {})).toBe('first')
  })
})

describe('content.generateHandler', () => {
  it('generates a handler that calls a context function', () => {
    const context = { greet: (name) => `Hello ${name}` }
    const handler = content.generateHandler(context, 'greet')
    expect(handler('Alice')).toBe('Hello Alice')
  })

  it('supports the ! prefix to negate the result', () => {
    const context = { isActive: () => true }
    const handler = content.generateHandler(context, '!isActive')
    expect(handler()).toBe(false)
  })

  it('returns the property value if it is not a function', () => {
    const context = { label: 'hello' }
    const handler = content.generateHandler(context, 'label')
    expect(handler()).toBe('hello')
  })

  it('passes fixed params to the handler', () => {
    const context = { add: (a, b) => a + b }
    const handler = content.generateHandler(context, 'add', [1, 2])
    expect(handler()).toBe(3)
  })
})

describe('content.bindParams', () => {
  it('returns null and undefined as-is', () => {
    expect(content.bindParams(null, {})).toBeNull()
    expect(content.bindParams(undefined, {})).toBeUndefined()
  })

  it('resolves an array of params', () => {
    const context = { name: 'Alice' }
    expect(content.bindParams([':name', 'static'], context, [])).toEqual(['Alice', 'static'])
  })

  it('resolves an object of params', () => {
    const context = { name: 'Alice' }
    expect(content.bindParams({ key: ':name' }, context, [])).toEqual({ key: 'Alice' })
  })

  it('resolves a scalar value', () => {
    const context = { count: 42 }
    expect(content.bindParams(':count', context, [])).toBe(42)
  })
})

describe('content.bindHandler', () => {
  it('replaces a string handler with a function', () => {
    const context = { save: () => 'saved' }
    const component = { handler: 'save' }
    content.bindHandler(component, 'handler', context)
    expect(typeof component.handler).toBe('function')
    expect(component.handler()).toBe('saved')
  })

  it('ignores handlers starting with :', () => {
    const component = { handler: ':someProp' }
    content.bindHandler(component, 'handler', {})
    expect(component.handler).toBe(':someProp')
  })

  it('handles an array of handlers with a logical AND', () => {
    const context = { a: () => true, b: () => false }
    const component = { handler: ['a', 'b'] }
    content.bindHandler(component, 'handler', context)
    expect(component.handler()).toBe(false)
  })

  it('handles an object handler with name and params', () => {
    const context = { add: (a, b) => a + b }
    const component = { handler: { name: 'add', params: [1, 2] } }
    content.bindHandler(component, 'handler', context)
    expect(component.handler()).toBe(3)
  })
})

describe('content.bindProperties', () => {
  it('resolves string properties starting with :', () => {
    const context = { title: 'Hello' }
    const item = { label: ':title' }
    content.bindProperties(item, context)
    expect(item.label).toBe('Hello')
  })

  it('skips reserved bindings', () => {
    const context = { content: 'should not bind' }
    const item = { content: ':content' }
    content.bindProperties(item, context)
    expect(item.content).toBe(':content')
  })

  it('skips properties listed in omit', () => {
    const context = { title: 'Hello' }
    const item = { label: ':title' }
    content.bindProperties(item, context, ['label'])
    expect(item.label).toBe(':title')
  })

  it('recursively resolves nested objects', () => {
    const context = { name: 'Alice' }
    const item = { nested: { label: ':name' } }
    content.bindProperties(item, context)
    expect(item.nested.label).toBe('Alice')
  })

  it('resolves arrays', () => {
    const context = { name: 'Alice' }
    const items = [{ label: ':name' }]
    content.bindProperties(items, context)
    expect(items[0].label).toBe('Alice')
  })
})

describe('content.bind', () => {
  it('binds properties and handlers of a component', () => {
    const context = { title: 'Hello', save: () => 'saved' }
    const data = [{ label: ':title', handler: 'save' }]
    content.bind(data, context)
    expect(data[0].label).toBe('Hello')
    expect(data[0].handler()).toBe('saved')
  })

  it('recursively binds nested content', () => {
    const context = { name: 'Alice' }
    const data = [{ content: [{ label: ':name' }] }]
    content.bind(data, context)
    expect(data[0].content[0].label).toBe('Alice')
  })

  it('skips omitted properties', () => {
    const context = { label: 'Hello' }
    const data = [{ label: ':label' }]
    content.bind(data, context, ['label'])
    expect(data[0].label).toBe(':label')
  })
})

describe('content.filter', () => {
  it('returns a non-object value as-is', () => {
    expect(content.filter('hello', {})).toBe('hello')
  })

  it('filters an array using a sift filter', () => {
    const data = [{ role: 'admin' }, { role: 'user' }, { role: 'admin' }]
    const result = content.filter(data, { role: 'admin' })
    expect(result).toHaveLength(2)
  })

  it('filters a single object', () => {
    const data = { role: 'user', label: 'test' }
    const result = content.filter(data, { role: 'admin' })
    expect(result).toBeUndefined()
  })

  it('recursively filters nested content', () => {
    const data = [{ content: [{ role: 'admin' }, { role: 'user' }] }]
    content.filter(data, { role: 'admin' })
    expect(data[0].content).toHaveLength(1)
    expect(data[0].content[0].role).toBe('admin')
  })
})
