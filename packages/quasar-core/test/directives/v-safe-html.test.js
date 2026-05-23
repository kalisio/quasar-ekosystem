import { describe, it, expect, vi, beforeEach } from 'vitest'
import { vSafeHtml } from '../../src/directives'

import { sanitize } from '@kalisio/common-core'

// --- mocks ---

vi.mock('@kalisio/common-core', () => ({
  sanitize: vi.fn((html, config) => `sanitized:${config ?? 'default'}:${html}`)
}))

// --- helpers ---

function makeEl () {
  return { innerHTML: '' }
}

function makeBinding (value) {
  return { value }
}

// --- tests ---

describe('vSafeHtml', () => {
  beforeEach(() => {
    sanitize.mockClear()
  })

  describe('mounted', () => {
    it('should sanitize with default config when binding is a string', () => {
      const el = makeEl()
      vSafeHtml.mounted(el, makeBinding('<p>hello</p>'))
      expect(sanitize).toHaveBeenCalledWith('<p>hello</p>')
    })

    it('should sanitize with a named profile', () => {
      const el = makeEl()
      vSafeHtml.mounted(el, makeBinding({ html: '<p>hello</p>', config: 'markdown' }))
      expect(sanitize).toHaveBeenCalledWith('<p>hello</p>', 'markdown')
    })

    it('should sanitize with a custom config object', () => {
      const el = makeEl()
      const config = { allowedTags: ['b', 'i'] }
      vSafeHtml.mounted(el, makeBinding({ html: '<b>bold</b>', config }))
      expect(sanitize).toHaveBeenCalledWith('<b>bold</b>', config)
    })

    it('should set innerHTML with the sanitized result', () => {
      sanitize.mockReturnValueOnce('<p>safe</p>')
      const el = makeEl()
      vSafeHtml.mounted(el, makeBinding('<p>hello</p>'))
      expect(el.innerHTML).toBe('<p>safe</p>')
    })
  })

  describe('updated', () => {
    it('should re-sanitize when the binding value changes', () => {
      const el = makeEl()
      vSafeHtml.mounted(el, makeBinding('<p>first</p>'))
      vSafeHtml.updated(el, makeBinding('<p>second</p>'))
      expect(sanitize).toHaveBeenCalledTimes(2)
      expect(sanitize).toHaveBeenLastCalledWith('<p>second</p>')
    })

    it('should re-sanitize with updated profile', () => {
      const el = makeEl()
      vSafeHtml.mounted(el, makeBinding({ html: '<p>hello</p>', config: 'strict' }))
      vSafeHtml.updated(el, makeBinding({ html: '<p>hello</p>', config: 'markdown' }))
      expect(sanitize).toHaveBeenLastCalledWith('<p>hello</p>', 'markdown')
    })
  })
})
