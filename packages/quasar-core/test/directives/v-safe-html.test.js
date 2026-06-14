import { describe, it, expect } from 'vitest'
import { vSafeHtml } from '../../src/directives'

// --- helpers ---

function makeEl () {
  return document.createElement('div')
}

function makeBinding (value) {
  return { value }
}

// --- tests ---

describe('vSafeHtml', () => {
  describe('mounted', () => {
    it('should set innerHTML when binding is a string', () => {
      const el = makeEl()
      vSafeHtml.mounted(el, makeBinding('<p>hello</p>'))
      expect(el.innerHTML).toBe('<p>hello</p>')
    })

    it('should set innerHTML when binding is an object with html', () => {
      const el = makeEl()
      vSafeHtml.mounted(el, makeBinding({ html: '<p>hello</p>', config: 'markdown' }))
      expect(el.innerHTML).toBe('<p>hello</p>')
    })

    it('should set innerHTML with a custom config object', () => {
      const el = makeEl()
      vSafeHtml.mounted(el, makeBinding({ html: '<b>bold</b>', config: { allowedTags: ['b', 'i'] } }))
      expect(el.innerHTML).toBe('<b>bold</b>')
    })

    it('should strip disallowed tags', () => {
      const el = makeEl()
      vSafeHtml.mounted(el, makeBinding('<script>alert("xss")</script><p>safe</p>'))
      expect(el.innerHTML).not.toContain('<script>')
      expect(el.innerHTML).toContain('<p>safe</p>')
    })
  })

  describe('updated', () => {
    it('should update innerHTML when binding value changes', () => {
      const el = makeEl()
      vSafeHtml.mounted(el, makeBinding('<p>first</p>'))
      vSafeHtml.updated(el, makeBinding('<p>second</p>'))
      expect(el.innerHTML).toBe('<p>second</p>')
    })

    it('should update innerHTML with new profile', () => {
      const el = makeEl()
      vSafeHtml.mounted(el, makeBinding({ html: '<p>hello</p>', config: 'strict' }))
      vSafeHtml.updated(el, makeBinding({ html: '<p>world</p>', config: 'markdown' }))
      expect(el.innerHTML).toBe('<p>world</p>')
    })
  })
})
