import { describe, it, expect, vi } from 'vitest'
import { vSafeHtml } from '../../src/directives/v-safe-html.js'

vi.mock('@kalisio/common-core', () => ({
  sanitize: vi.fn((html) => `sanitized:${html}`)
}))

describe('vSafeHtml', () => {
  it('sets innerHTML to the sanitized value on mount', () => {
    const el = document.createElement('div')
    vSafeHtml.mounted(el, { value: '<b>hello</b>' })
    expect(el.innerHTML).toBe('sanitized:<b>hello</b>')
  })

  it('updates innerHTML when the binding value changes', () => {
    const el = document.createElement('div')
    vSafeHtml.mounted(el, { value: 'first' })
    vSafeHtml.updated(el, { value: 'second' })
    expect(el.innerHTML).toBe('sanitized:second')
  })

  it('passes the binding value to sanitize', async () => {
    const { sanitize } = await import('@kalisio/common-core')
    const el = document.createElement('div')
    vSafeHtml.mounted(el, { value: '<script>xss</script>' })
    expect(sanitize).toHaveBeenCalledWith('<script>xss</script>')
  })
})
