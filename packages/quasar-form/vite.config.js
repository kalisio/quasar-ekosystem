import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { baseConfig } from '../../vite.base-config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default mergeConfig(baseConfig, defineConfig({
  root: __dirname,
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.cjs'
    },
    rollupOptions: {
      external: [
        /@kalisio\//,
        '@logtape/logtape',
        'ajv',
        'ajv-format',
        'ajv-keywords',
        'lodash',
        'quasar',
        'vue',
        'vue-i18n'
      ]
    }
  }
}))
