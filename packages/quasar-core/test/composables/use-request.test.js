import { createRenderer } from 'vue'
import { useRequest } from '../../src/composables/use-request.js'

const URL = 'https://example.org/resource'

// A minimal Vue renderer allows lifecycle tests without a DOM environment
const renderer = createRenderer({
  patchProp () {},
  insert () {},
  remove () {},
  createElement: (tag) => ({ tag }),
  createText: (text) => ({ text }),
  createComment: (text) => ({ comment: text }),
  setText () {},
  setElementText () {},
  parentNode: () => null,
  nextSibling: () => null
})
const mountedApps = new Set()
function mountUseRequest (url = URL, options = {}) {
  let composable
  const app = renderer.createApp({
    setup () {
      composable = useRequest(url, options)
      return () => null
    }
  })
  app.mount({})
  mountedApps.add(app)
  function unmount () {
    if (mountedApps.delete(app)) app.unmount()
  }
  return { composable, unmount }
}

// Simulate a pending fetch that rejects when its signal is aborted
function createPendingFetch () {
  const started = Promise.withResolvers()
  const mock = vi.fn((input, options) => {
    const pending = Promise.withResolvers()
    const signal = options.signal
    started.resolve(input)
    if (signal.aborted) pending.reject(signal.reason)
    else signal.addEventListener('abort', () => pending.reject(signal.reason), { once: true })
    return pending.promise
  })
  vi.stubGlobal('fetch', mock)
  return { mock, started: started.promise }
}

describe('useRequest', () => {
  let fetchMock
  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })
  afterEach(() => {
    for (const app of mountedApps) app.unmount()
    mountedApps.clear()
    vi.unstubAllGlobals()
  })
  describe('initialization', () => {
    it('exposes an independent request signal', () => {
      const first = mountUseRequest()
      const second = mountUseRequest()
      expect(first.composable.signal).toBeInstanceOf(AbortSignal)
      expect(first.composable.aborted).toBe(false)
      expect(first.composable.signal).not.toBe(second.composable.signal)
    })
    it('does not start fetching during setup', () => {
      mountUseRequest()
      expect(fetchMock).not.toHaveBeenCalled()
    })
    it('honors the signal supplied at creation', () => {
      const controller = new AbortController()
      const { composable } = mountUseRequest(URL, { signal: controller.signal })
      controller.abort()
      expect(composable.aborted).toBe(true)
      expect(composable.signal.aborted).toBe(true)
    })
  })
  describe('fetch', () => {
    it('forwards fetch options and returns the response', async () => {
      const { composable } = mountUseRequest(URL, { retries: 0 })
      const response = new Response('content')
      const options = { headers: { Accept: 'application/json' } }
      fetchMock.mockResolvedValue(response)
      expect(await composable.fetch(options)).toBe(response)
      expect(fetchMock).toHaveBeenCalledOnce()
      const [url, init] = fetchMock.mock.calls[0]
      expect(url).toBe(URL)
      expect(init.headers).toBeInstanceOf(Headers)
      expect(init.headers.get('accept')).toBe('application/json')
      expect(init.signal).toBeInstanceOf(AbortSignal)
    })
    it('works without fetch options', async () => {
      const { composable } = mountUseRequest()
      const response = new Response('content')
      fetchMock.mockResolvedValue(response)
      expect(await composable.fetch()).toBe(response)
      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock.mock.calls[0][0]).toBe(URL)
    })
    it('returns unsuccessful HTTP responses', async () => {
      const { composable } = mountUseRequest(URL, { retries: 0 })
      const response = new Response('missing', { status: 404 })
      fetchMock.mockResolvedValue(response)
      expect(await composable.fetch()).toBe(response)
    })
    it('uses retry options from the underlying operator', async () => {
      const { composable } = mountUseRequest(URL, { retries: 1, retryDelay: 0 })
      fetchMock.mockResolvedValueOnce(new Response('unavailable', { status: 503 }))
      fetchMock.mockResolvedValueOnce(new Response('content'))
      expect((await composable.fetch()).status).toBe(200)
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
    it('propagates network errors when not aborted', async () => {
      const { composable } = mountUseRequest(URL, { retries: 0 })
      const error = new Error('Network failure')
      fetchMock.mockRejectedValue(error)
      await expect(composable.fetch()).rejects.toBe(error)
      expect(composable.aborted).toBe(false)
    })
    it('propagates a cancellation from an external fetch signal', async () => {
      const { composable } = mountUseRequest(URL, { retries: 0 })
      const controller = new AbortController()
      controller.abort()
      await expect(composable.fetch({ signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
      expect(composable.aborted).toBe(false)
      expect(fetchMock).not.toHaveBeenCalled()
    })
    it('silently ignores fetch after manual abort', async () => {
      const { composable } = mountUseRequest()
      composable.abort()
      await expect(composable.fetch()).resolves.toBeUndefined()
      expect(fetchMock).not.toHaveBeenCalled()
    })
    it('silently ignores an in-flight fetch aborted manually', async () => {
      const { composable } = mountUseRequest(URL, { retries: 0 })
      const pending = createPendingFetch()
      const fetching = composable.fetch()
      await pending.started
      composable.abort()
      await expect(fetching).resolves.toBeUndefined()
      expect(pending.mock).toHaveBeenCalledOnce()
    })
    it('does not abort after a successful fetch', async () => {
      const { composable } = mountUseRequest()
      fetchMock.mockResolvedValue(new Response('content'))
      await composable.fetch()
      expect(composable.aborted).toBe(false)
    })
  })
  describe('abort', () => {
    it('exposes the aborted state after manual cancellation', () => {
      const { composable } = mountUseRequest()
      composable.abort()
      expect(composable.aborted).toBe(true)
      expect(composable.signal.aborted).toBe(true)
    })
    it('forwards the abort reason', () => {
      const { composable } = mountUseRequest()
      const reason = new Error('Cancelled')
      composable.abort(reason)
      expect(composable.signal.reason).toBe(reason)
    })
  })
  describe('lifecycle', () => {
    it('aborts the request on unmount', () => {
      const { composable, unmount } = mountUseRequest()
      unmount()
      expect(composable.aborted).toBe(true)
      expect(composable.signal.aborted).toBe(true)
    })
    it('preserves an existing abort reason on unmount', () => {
      const { composable, unmount } = mountUseRequest()
      const reason = new Error('Cancelled manually')
      composable.abort(reason)
      unmount()
      expect(composable.signal.reason).toBe(reason)
    })
    it('aborts only the unmounted component request', () => {
      const first = mountUseRequest()
      const second = mountUseRequest()
      first.unmount()
      expect(first.composable.aborted).toBe(true)
      expect(second.composable.aborted).toBe(false)
    })
    it('silently ignores an in-flight fetch aborted on unmount', async () => {
      const { composable, unmount } = mountUseRequest(URL, { retries: 0 })
      const pending = createPendingFetch()
      const fetching = composable.fetch()
      await pending.started
      unmount()
      await expect(fetching).resolves.toBeUndefined()
      expect(composable.aborted).toBe(true)
    })
  })
})
