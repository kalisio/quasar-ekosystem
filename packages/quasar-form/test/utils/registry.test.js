import { describe, it, expect } from 'vitest'
import { load } from '@kalisio/quasar-core'
import '@kalisio/quasar-moment'

describe('registry (from quasar-form)', () => {
  it('loads KDate registered by quasar-moment', () => {
    expect(load('KDate')).toBeDefined()
  })
})
