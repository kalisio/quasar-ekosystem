import { inject } from 'vue'

export function useI18n () {
  return inject('i18n')
}
