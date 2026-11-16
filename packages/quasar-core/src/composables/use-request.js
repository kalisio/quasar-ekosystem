import { onBeforeUnmount } from 'vue'
import { request } from '@kalisio/common-core/operators/request'

export function useRequest (url, options = {}) {
  // Data
  const req = request(url, options)

  // Functions
  async function fetch (fetchOptions) {
    try {
      return await req.fetch(fetchOptions)
    } catch (error) {
      if (!req.aborted) throw error
    }
  }

  // Hooks
  onBeforeUnmount(() => {
    if (!req.aborted) req.abort()
  })

  // Expose
  return {
    fetch,
    abort: (reason) => req.abort(reason),
    get aborted () { return req.aborted },
    get signal () { return req.signal }
  }
}
