import { vi, beforeEach } from 'vitest'
import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { Dialog, Notify } from 'quasar'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { createRouterMock, injectRouterMock } from 'vue-router-mock'
import { I18n } from '../src/i18n.js'

// Install Quasar
installQuasarPlugin({ plugins: { Dialog, Notify } })

// Create I18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      directives: {
        DROP_FILES: 'Drop file here | Drop files here',
        ALL_FILES_ARE_UNSUPPORTED: 'Oops ! File is not supported | Oops ! None of the files are supported',
        SOME_FILES_ARE_UNSUPPORTED: 'Some files will be ignored due to unsupported types'
      },
      errors: {
        MAX_FILES_REACHED: 'Oops ! You can only drop one file | Oops! You can only drop up to {n} files at once',
        MAX_FILE_SIZE_REACHED: 'Oops ! The file exceeds the maximum allowed size of {maxSize}',
        MAX_TOTAL_SIZE_FILES_REACHED: 'Oops ! The total size files exceeds the maximum allowed total limit of {maxSize}'
      }
    }
  }
})
I18n.setInstance(i18n)
config.global.config = {
  globalProperties: {
    $tie: (key, params) => I18n.tie(key, params)
  }
}

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
