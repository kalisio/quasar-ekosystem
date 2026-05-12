import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { baseConfig } from '../../vitest.base-config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PREFIX = '\0___'

const externalsPlugin = {
  name: 'quasar-core-externals',
  enforce: 'pre',
  resolveId (id) {
    if (id === 'loglevel' || id === 'config' || id === 'vue-router' || id === 'quasar' || id === 'sanitize-html') return PREFIX + id
    if (id === '@kalisio/common-core') return PREFIX + 'common-core'
    if (id === '@kalisio/common-graphics') return PREFIX + 'common-graphics'
    if (id.endsWith('KIcon.vue')) return PREFIX + 'KIcon'
    if (id.includes('moment-timezone')) return PREFIX + 'moment-timezone'
  },
  load (id) {
    if (id === PREFIX + 'sanitize-html') return 'export default (html) => html'
    if (id === PREFIX + 'common-graphics') {
      return `
      import chroma from 'chroma-js'
      export const color = {
        is: (v) => { try { return chroma.valid(v) } catch { return false } },
        contrast: (v, light = 'white', dark = 'black') => chroma.contrast(v, 'white') < chroma.contrast(v, 'black') ? dark : light,
        scale: (opts) => { let s = chroma.scale(opts.colors); if (opts.domain) s = s.domain(opts.domain); if (opts.classes) s = s.classes(opts.classes); return s }
      }
    `
    }
    if (id === PREFIX + 'common-core') {
      return `
      export function sanitize (html) { return html }
      export const is = {
        empty: (v) => v == null || v === '',
        string: (v) => typeof v === 'string',
        array: (v) => Array.isArray(v),
        plainObject: (v) => v !== null && typeof v === 'object' && !Array.isArray(v),
        number: (v) => typeof v === 'number',
        function: (v) => typeof v === 'function'
      }
      export const has = {
        key: (obj, key) => Object.prototype.hasOwnProperty.call(obj, key),
        path: (obj, path) => { try { return path.split('.').reduce((o, p) => o[p], obj) !== undefined } catch { return false } }
      }
      export const assert = { that: () => {} }
    `
    }
    if (id === PREFIX + 'KIcon') return 'import { h } from "vue"; export default { render: () => h("span") }'
    if (id === PREFIX + 'moment-timezone') {
      return `
      import moment from 'moment'
      const tz = function (datetime) { return moment(datetime) }
      tz.guess = () => 'UTC'
      tz.zone = () => null
      moment.tz = tz
      export default moment
    `
    }
    if (id === PREFIX + 'loglevel') return 'export default { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} }'
    if (id === PREFIX + 'config') return 'export default { publisherContact: "test@example.com", appName: "TestApp", appSlug: "test-app", domain: "localhost", flavor: "test" }'
    if (id === PREFIX + 'vue-router') return 'export const useRoute = () => ({ params: {}, query: {}, name: null }); export const useRouter = () => ({ push: () => {}, replace: () => {} })'
    if (id === PREFIX + 'quasar') {
      return `
      export const useQuasar = () => ({ screen: { lt: {}, gt: {} }, dialog: () => ({}), notify: () => {} })
      export const uid = () => 'test-uid'
      export const openURL = () => {}
      export const getCssVar = () => '#000000'
      export const colors = { getBrand: () => null, setBrand: () => {} }
      export const Notify = { create: () => {} }
      export class EventBus { on () {}; off () {}; emit () {} }
      export const useDialogPluginComponent = Object.assign(() => ({ dialogRef: { value: { show: () => {}, hide: () => {} } }, onDialogOK: () => {}, onDialogCancel: () => {} }), { emits: ['ok', 'hide', 'update:modelValue'] })
    `
    }
  },
  transform (code, id) {
    if (id.endsWith('.scss') || id.endsWith('.sass')) return { code: '', map: null }
  }
}

export default mergeConfig(baseConfig, defineConfig({
  plugins: [vue(), externalsPlugin],
  root: __dirname,
  test: {
    name: 'quasar-core',
    environment: 'happy-dom',
    setupFiles: ['./test/setup.js']
  },
  resolve: {
    conditions: ['import', 'browser', 'module', 'default']
  }
}))
