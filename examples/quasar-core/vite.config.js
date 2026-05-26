import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    conditions: ['development', 'import', 'browser', 'module', 'default'],
    alias: {
      vue: resolve(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js')
    }
  },
  optimizeDeps: {
    exclude: ['@kalisio/common-graphics']
  },
  server: {
    port: 8080
  }
})
