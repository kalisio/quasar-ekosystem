import { sanitize } from '@kalisio/common-core'

function sanitizeHtml (el, binding) {
  el.innerHTML = sanitize(binding.value)
}

export const vSafeHtml = {
  mounted: sanitizeHtml,
  updated: sanitizeHtml
}
