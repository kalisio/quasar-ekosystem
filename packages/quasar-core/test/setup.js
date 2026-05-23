import { vi, beforeEach } from 'vitest'
import { config } from '@vue/test-utils'
import { Dialog } from 'quasar'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { createRouterMock, injectRouterMock } from 'vue-router-mock'

// Install Quasar
installQuasarPlugin({ plugins: { Dialog } })

// Install a mock router
export const router = createRouterMock({
  spy: {
    create: fn => vi.fn(fn),
    reset: spy => spy.mockReset()
  }
})
beforeEach(() => {
  router.reset()
  injectRouterMock(router)
})

// Provide singletons for composables usage
config.global.provide = {
  i18n: { tie: (key) => key },
  platform: { getData: vi.fn(), is: { desktop: true, mobile: false, touch: false, pwa: false } }
}

// Declare components
const componentFiles = import.meta.glob('../src/components/**/*.vue', { eager: true })
const components = {}
for (const path in componentFiles) {
  const name = path.split('/').pop().replace('.vue', '')
  components[name] = componentFiles[path].default
}
config.global.components = components

// Mock i18n functions
config.global.mocks = {
  $t: (key) => key,
  $tie: (key) => key
}
