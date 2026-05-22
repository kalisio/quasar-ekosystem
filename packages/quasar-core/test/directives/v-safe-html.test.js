import { describe, it, expect } from 'vitest'
import { vSafeHtml } from '../../src/directives/v-safe-html.js'

describe('vSafeHtml', () => {
  it('sets innerHTML on mount', () => {
    const el = document.createElement('div')
    vSafeHtml.mounted(el, { value: '<b>hello</b>' })
    expect(el.innerHTML).toBe('<b>hello</b>')
  })

  it('updates innerHTML when the binding value changes', () => {
    const el = document.createElement('div')
    vSafeHtml.mounted(el, { value: 'first' })
    vSafeHtml.updated(el, { value: 'second' })
    expect(el.innerHTML).toBe('second')
  })

  it('strips script tags', () => {
    const el = document.createElement('div')
    vSafeHtml.mounted(el, { value: '<script>xss</script>' })
    expect(el.innerHTML).toBe('')
  })
})
