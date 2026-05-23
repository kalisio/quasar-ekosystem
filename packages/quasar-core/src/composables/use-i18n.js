import { inject } from 'vue'

export function useI18n () {
  const I18n = inject('i18n')
  return { tie: (key, params) => I18n.tie(key, params) }
}
