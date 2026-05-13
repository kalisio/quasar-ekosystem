import { config } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { Dialog } from 'quasar'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'

// Install a router
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }]
})
config.global.plugins = [router]

// Install Quasar
installQuasarPlugin({ plugins: { Dialog } })

// Install the components
const componentFiles = import.meta.glob('../src/components/**/*.vue', { eager: true })
const components = {}
for (const path in componentFiles) {
  const name = path.split('/').pop().replace('.vue', '')
  components[name] = componentFiles[path].default
}
config.global.components = components

config.global.mocks = {
  $t: (key) => key,
  $tie: (key) => key
}
