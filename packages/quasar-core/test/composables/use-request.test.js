import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useRequest } from '../../src/composables/use-request.js'

afterEach(() => vi.restoreAllMocks())

function mountUseRequest (options) {
  let exposed
  const TestComponent = defineComponent({
    setup () {
      exposed = useRequest(options)
      return exposed
    },
    template: '<div />'
  })
  const wrapper = mount(TestComponent)
  return { wrapper, composable: exposed }
}

describe.skip('useRequest', () => {
  it('fetch resolves with the response on success', async () => {
    const mockResponse = new Response('ok', { status: 200 })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    const { composable } = mountUseRequest()
    const result = await composable.fetch('https://example.com')
    expect(result).toBe(mockResponse)
  })

  it('aborted is false initially', () => {
    const { composable } = mountUseRequest()
    expect(composable.aborted).toBe(false)
  })

  it('signal is an AbortSignal', () => {
    const { composable } = mountUseRequest()
    expect(composable.signal).toBeInstanceOf(AbortSignal)
  })

  it('abort() sets aborted to true', () => {
    const { composable } = mountUseRequest()
    composable.abort()
    expect(composable.aborted).toBe(true)
  })

  it('fetch throws when request fails and not aborted', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
    const { composable } = mountUseRequest()
    await expect(composable.fetch('https://example.com')).rejects.toThrow('network error')
  })

  it('fetch swallows error when aborted (component unmounted)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('AbortError', 'AbortError')))
    const { composable, wrapper } = mountUseRequest()
    composable.abort()
    await wrapper.unmount()
    const result = await composable.fetch('https://example.com')
    expect(result).toBeUndefined()
  })

  it('onBeforeUnmount aborts the request automatically', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('ok')))
    const { composable, wrapper } = mountUseRequest()
    expect(composable.aborted).toBe(false)
    await wrapper.unmount()
    expect(composable.aborted).toBe(true)
  })
})
