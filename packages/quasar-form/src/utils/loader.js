import { defineAsyncComponent, markRaw } from 'vue'

const componentModules = import.meta.glob('../components/**/*.vue')

export function loadComponent (componentName) {
  const key = Object.keys(componentModules).find(k => k.endsWith(`/${componentName}.vue`))
  if (!key) throw new Error(`Component ${componentName} not found`)
  return markRaw(defineAsyncComponent(componentModules[key]))
}
