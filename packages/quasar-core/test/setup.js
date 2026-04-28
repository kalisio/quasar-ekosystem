import { vi } from 'vitest'
import { config } from '@vue/test-utils'

vi.mock('quasar', () => {
  const EventBus = class { on () {}; off () {}; emit () {} }
  const useDialogPluginComponent = () => ({
    dialogRef: { value: { show: vi.fn(), hide: vi.fn() } },
    onDialogOK: vi.fn(),
    onDialogCancel: vi.fn()
  })
  useDialogPluginComponent.emits = ['ok', 'hide', 'update:modelValue']
  return {
    useQuasar: () => ({
      screen: { lt: { sm: false, md: false, lg: false, xl: false }, gt: { xs: true, sm: true }, height: 800 },
      dialog: vi.fn(() => ({ onOk: (cb) => { cb(); return { onCancel: vi.fn() } }, onCancel: vi.fn() })),
      notify: vi.fn()
    }),
    uid: () => 'test-uid',
    openURL: vi.fn(),
    getCssVar: vi.fn(() => '#1976D2'),
    useDialogPluginComponent,
    Notify: { create: vi.fn() },
    EventBus
  }
})

config.global.mocks = {
  $t: (key) => key,
  $tie: (key) => key,
  $q: {
    screen: { lt: { sm: false, md: false, lg: false, xl: false }, gt: { xs: true, sm: true }, height: 800 }
  }
}

config.global.directives = {
  'close-popup': () => {}
}
