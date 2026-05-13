import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { Dialog } from 'quasar'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'

installQuasarPlugin({ plugins: { Dialog } })

config.global.mocks = {
  $t: (key) => key
}

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))
