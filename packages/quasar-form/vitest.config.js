import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { baseConfig } from '../../vitest.base-config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default mergeConfig(baseConfig, defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar()
  ],
  root: __dirname,
  test: {
    name: 'quasar-form',
    environment: 'happy-dom',
    setupFiles: ['./test/setup.js'],
    server: {
      deps: {
        inline: ['quasar']
      }
    }
  },
  resolve: {
    conditions: ['development', 'import', 'browser', 'module', 'default']
  }
}))
