import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { baseConfig } from '../../vitest.base-config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Virtual stubs for modules that do not exist yet in src/.
const MISSING = {
  i18n: 'export const i18n = { t: k => k, tie: k => k, tu: k => k }',

  document: 'export const Document = { sanitizeHtml: h => h ?? \'\' }',

  storage: 'export const Storage = { getObjectUrl: async () => null, download: async () => ({ uri: null }) }',

  api: 'export const api = { getService: () => null }',

  context: 'export const Context = { get: () => null }',

  events: 'export const Events = { on: () => {}, off: () => {} }',

  layout: `export const Layout = {
    findSticky: () => null, showSticky: () => {}, hideSticky: () => {},
    findWindow: () => null, openWidget: () => {}, closeWidget: () => {}
  }`,

  platform: 'export const Platform = { getData: () => ({}) }',

  'utils.actions': `export const actionProps = {
    id: { type: String }, label: { type: [String, Object], default: null },
    icon: { type: String }, iconRight: { type: String },
    color: { type: String, default: 'black' }, tooltip: { type: String },
    badge: { type: Object }, size: { type: String, default: 'md' },
    flat: { type: Boolean, default: true }, outline: { type: Boolean, default: false },
    stack: { type: Boolean, default: false }, renderer: { type: String, default: 'button' },
    toggled: { type: Boolean, default: false }, toggle: { type: Object },
    url: { type: String }, handler: { type: Function },
    route: { type: Object }, dialog: { type: Object },
    closePopup: { type: [Boolean, Number], default: false },
    propagate: { type: Boolean, default: true },
    disabled: { type: [Boolean, Function], default: false },
    context: { type: Object }, loading: { type: Boolean, default: false }
  }`,

  'utils.content': `
    export function bindParams() { return {} }
    export function bindProperties(obj) { return obj }
  `,

  utils: `
    import { ref } from 'vue'
    import { actionProps } from '___utils.actions'
    export { actionProps }
    export function filterContent(c) { return c }
    export function getBoundValue(v) { return v }
    export function loadComponent(n) { return n }
    export function getHtmlColor(c) { return c }
    export function getContrastColor() { return 'white' }
    export function getIconName(icon, field) { return typeof icon === 'string' ? icon : icon?.[field] }
    export function getInitials(name) {
      if (!name) return ''
      return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    }
    export function bindParams() { return {} }
    export function bindProperties(obj) { return obj }
    export const Fullscreen = ref(false)
    export function toggleFullscreen() { Fullscreen.value = !Fullscreen.value }
  `,

  composables: `
    import { ref } from 'vue'
    export function useVersion() {
      return { clientVersionName: ref('0.0.0'), apiVersionName: ref('0.0.0') }
    }
  `,

  config: `export default {
    appName: 'TestApp', appSlug: 'test-app', appLogo: 'test-logo.png',
    publisherContact: 'test@example.com', domain: 'localhost', flavor: 'test'
  }`,

  loglevel: 'export default { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} }',

  'vue-router': `
    import { vi } from 'vitest'
    export const useRoute = () => ({ params: {}, query: {}, name: null })
    export const useRouter = () => ({ push: vi.fn(), replace: vi.fn() })
  `,

  index: `
    import { ref } from 'vue'
    export const Store = ref({})
    export const i18n = { t: k => k, tie: k => k }
  `,

  KIcon: 'export default { template: \'<span class="k-icon-stub" />\', props: { icon: { type: String, default: undefined } } }'
}

const PREFIX = '\0___'

const testPlugin = {
  name: 'quasar-core-test',
  enforce: 'pre',

  resolveId (id) {
    if (id.startsWith('___')) return PREFIX + id
    if (id === 'config') return PREFIX + '___config'
    if (id === 'loglevel') return PREFIX + '___loglevel'
    if (id === 'vue-router') return PREFIX + '___vue-router'
  },

  load (id) {
    if (!id.startsWith(PREFIX)) return
    const key = id.slice(PREFIX.length + 3) // strip '\0___' + '___'
    return MISSING[key]
  },

  transform (code, id) {
    if (id.includes('lang.scss') || id.includes('lang.sass') || id.endsWith('.scss') || id.endsWith('.sass')) {
      return { code: '', map: null }
    }
  }
}

export default mergeConfig(baseConfig, defineConfig({
  plugins: [vue(), testPlugin],
  root: __dirname,
  resolve: {
    alias: [
      { find: /.*\/i18n(\.js)?$/, replacement: '___i18n' },
      { find: /.*\/document(\.js)?$/, replacement: '___document' },
      { find: /.*\/storage(\.js)?$/, replacement: '___storage' },
      { find: /.*\/api(\.js)?$/, replacement: '___api' },
      { find: /.*\/context(\.js)?$/, replacement: '___context' },
      { find: /.*\/events(\.js)?$/, replacement: '___events' },
      { find: /.*\/layout(\.js)?$/, replacement: '___layout' },
      { find: /.*\/platform(\.js)?$/, replacement: '___platform' },
      { find: /.*\/utils\/utils\.actions(\.js)?$/, replacement: '___utils.actions' },
      { find: /.*\/utils\/utils\.content(\.js)?$/, replacement: '___utils.content' },
      { find: /.*\/utils\/index(\.js)?$/, replacement: '___utils' },
      { find: /.*\/utils$/, replacement: '___utils' },
      { find: /.*\/composables\/index(\.js)?$/, replacement: '___composables' },
      { find: /.*\/composables$/, replacement: '___composables' },
      { find: /.*\/graphics\/KIcon\.vue$/, replacement: '___KIcon' },
      { find: /^\.\.$/, replacement: '___index' }
    ]
  },
  test: {
    name: 'quasar-core',
    environment: 'happy-dom',
    setupFiles: ['./test/setup.js']
  }
}))
