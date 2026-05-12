import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { baseConfig } from '../../vitest.base-config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function stub (name) {
  return path.resolve(__dirname, `test/stubs/${name}.js`)
}

// Aliases work for exact package names. For file-path patterns (relative imports
// like ./KIcon.vue or moment-timezone/data/...) we need resolveId instead.
const fileStubsPlugin = {
  name: 'quasar-core-file-stubs',
  enforce: 'pre',
  resolveId (id) {
    if (id.endsWith('KIcon.vue')) return stub('KIcon')
    if (id.includes('moment-timezone')) return stub('moment-timezone')
  },
  transform (code, id) {
    if (id.endsWith('.scss') || id.endsWith('.sass')) return { code: '', map: null }
  }
}

export default mergeConfig(baseConfig, defineConfig({
  plugins: [vue(), fileStubsPlugin],
  root: __dirname,
  test: {
    name: 'quasar-core',
    environment: 'happy-dom',
    setupFiles: ['./test/setup.js']
  },
  resolve: {
    conditions: ['import', 'browser', 'module', 'default'],
    alias: [
      { find: /^vue-router$/, replacement: stub('vue-router') },
      { find: /^quasar$/, replacement: stub('quasar') },
      { find: /^sanitize-html$/, replacement: stub('sanitize-html') },
      { find: /^@kalisio\/common-core$/, replacement: stub('common-core') },
      { find: /^@kalisio\/common-graphics$/, replacement: stub('common-graphics') }
    ]
  }
}))
