import { sanitize } from '@kalisio/common-core'

function sanitizeHtml (el, binding) {
  const isObject = typeof binding.value === 'object' && binding.value !== null
  const html = isObject ? binding.value.html : binding.value
  const config = isObject ? binding.value.config : undefined
  el.innerHTML = config ? sanitize(html, config) : sanitize(html)
}

export const vSafeHtml = {
  mounted: sanitizeHtml,
  updated: sanitizeHtml
}
