import { register } from '@kalisio/quasar-core'
export * from './components'
export * from './composables'
export * from './utils'

register(import.meta.glob('./components/**/*.vue'))
