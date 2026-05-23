import { inject } from 'vue'

export function usePlatform () {
  return inject('platform')
}
