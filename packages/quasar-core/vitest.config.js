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
    if (id === 'loglevel' || id === 'config' || id === 'vue-router' || id === 'quasar') return PREFIX + id
    if (id.endsWith('KIcon.vue')) return PREFIX + 'KIcon'
  },
  load (id) {
    if (id === PREFIX + 'KIcon') return 'import { h } from "vue"; export default { render: () => h("span") }'
    if (id === PREFIX + 'loglevel') return 'export default { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} }'
    if (id === PREFIX + 'config') return 'export default { publisherContact: "test@example.com", appName: "TestApp", appSlug: "test-app", domain: "localhost", flavor: "test" }'
    if (id === PREFIX + 'vue-router') return 'export const useRoute = () => ({ params: {}, query: {}, name: null }); export const useRouter = () => ({ push: () => {}, replace: () => {} })'
    if (id === PREFIX + 'quasar') {
      return `
      export const useQuasar = () => ({ screen: { lt: {}, gt: {} }, dialog: () => ({}), notify: () => {} })
      export const uid = () => 'test-uid'
      export const openURL = () => {}
      export const getCssVar = () => '#000000'
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
  }
}))
