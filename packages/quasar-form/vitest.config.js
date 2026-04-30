import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { baseConfig } from '../../vitest.base-config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PREFIX = '\0___'

const externalsPlugin = {
  name: 'quasar-form-externals',
  enforce: 'pre',
  resolveId (id) {
    if (id === 'quasar') return PREFIX + id
  },
  load (id) {
    if (id === PREFIX + 'quasar') return 'export const openURL = () => {}; export const Notify = { create: () => {} }'
  }
}

export default mergeConfig(baseConfig, defineConfig({
  plugins: [vue(), externalsPlugin],
  root: __dirname,
  test: {
    name: 'quasar-form',
    environment: 'happy-dom',
    setupFiles: ['./test/setup.js']
  }
}))
