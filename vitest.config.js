import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import path from 'path'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/test/**/*.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      all: true,
      clean: true,
      include: ['packages/*/src/**/*.js']
    },
    silent: false,
    testTimeout: 30000,
    projects: [
      {
        plugins: [vue()],
        resolve: {
          alias: {
            '@components': path.join(__dirname, 'packages/quasar-form/src/components')
          }
        },
        test: {
          name: 'quasar-form',
          root: 'packages/quasar-form',
          environment: 'happy-dom',
          include: ['test/**/*.test.js']
        }
      }
    ]
  }
})
