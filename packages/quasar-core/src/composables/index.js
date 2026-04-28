import { ref } from 'vue'

export function useVersion () {
  return { clientVersionName: ref('0.0.0'), apiVersionName: ref('0.0.0') }
}
