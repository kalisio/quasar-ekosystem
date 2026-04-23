import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import vue from '@vitejs/plugin-vue'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    conditions: ['development', 'import', 'browser', 'module', 'default'],
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@schemas': resolve(__dirname, 'schemas')
    }
  },
  server: {
    port: 8080
  }
})
