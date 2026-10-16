import { onBeforeUnmount } from 'vue'
import { request } from '@kalisio/common-core/operators/request'

export function useRequest (options = {}) {
  const req = request(options)

  onBeforeUnmount(() => {
    if (!req.aborted) req.abort()
  })

  async function fetch (input, fetchOptions) {
    try {
      return await req.fetch(input, fetchOptions)
    } catch (error) {
      if (!req.aborted) throw error
    }
  }

  return {
    fetch,
    abort: (reason) => req.abort(reason),
    get aborted () { return req.aborted },
    get signal () { return req.signal }
  }
}
