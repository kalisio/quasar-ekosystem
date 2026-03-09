import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  plugins: [vue()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components')
    }
  },
  test: {
    name: 'quasar-form',
    environment: 'happy-dom',
    globals: true,
    silent: false,
    testTimeout: 30000,
    include: ['test/**/*.test.js'],
    coverage: {
      provider: 'v8',
      all: true,
      clean: true,
      include: ['src/**/*.js'],
      exclude: ['node_modules/**', 'dist/**', 'test/**', '*.config.js'],
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: '../../coverage/quasar-form'
    }
  }
})
