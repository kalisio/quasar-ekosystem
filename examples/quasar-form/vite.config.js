import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    conditions: ['import', 'browser', 'module', 'default'],
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  },
  server: {
    port: 8080
  }
})
