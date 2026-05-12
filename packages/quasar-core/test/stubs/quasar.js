export const useQuasar = () => ({ screen: { lt: {}, gt: {} }, dialog: () => ({}), notify: () => {} })
export const uid = () => 'test-uid'
export const openURL = () => {}
export const getCssVar = () => '#000000'
export const colors = { getBrand: () => null, setBrand: () => {} }
export const Notify = { create: () => {} }
export class EventBus { on () {}; off () {}; emit () {} }
export const useDialogPluginComponent = Object.assign(
  () => ({ dialogRef: { value: { show: () => {}, hide: () => {} } }, onDialogOK: () => {}, onDialogCancel: () => {} }),
  { emits: ['ok', 'hide', 'update:modelValue'] }
)
