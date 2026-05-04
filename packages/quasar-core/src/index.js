import { reactive } from 'vue'
import { load, register } from './utils/registry.js'

export const Store = reactive({})
export { i18n } from './i18n.js'
export { load, register }

register(import.meta.glob('./components/**/*.vue'))
