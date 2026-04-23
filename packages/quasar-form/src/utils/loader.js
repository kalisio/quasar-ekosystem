import { defineAsyncComponent, markRaw } from 'vue'

const componentModules = import.meta.glob('../components/**/*.vue')

export function loadComponent (componentName) {
  const name = componentName.includes('/') ? componentName.split('/').pop() : componentName
  const key = Object.keys(componentModules).find(k => k.endsWith(`/${name}.vue`))
  if (!key) throw new Error(`Component ${componentName} not found`)
  return markRaw(defineAsyncComponent(componentModules[key]))
}
