import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { baseConfig } from '../../vitest.base-config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PREFIX = '\0___'

const externalsPlugin = {
  name: 'quasar-moment-externals',
  enforce: 'pre',
  resolveId (id) {
    if (id === '../../time.js') return PREFIX + 'time'
    if (id === '../../i18n.js') return PREFIX + 'i18n'
  },
  load (id) {
    if (id === PREFIX + 'time') return 'export const Time = { getFormat: () => ({ date: { short: "YYYY-MM-DD" } }), getFormatTimezone: () => "UTC" }'
    if (id === PREFIX + 'i18n') return 'export const i18n = { tie: (key) => key, t: (key) => key }'
  }
}

export default mergeConfig(baseConfig, defineConfig({
  plugins: [vue(), externalsPlugin],
  root: __dirname,
  test: {
    name: 'quasar-moment',
    environment: 'happy-dom',
    setupFiles: ['./test/setup.js']
  }
}))
