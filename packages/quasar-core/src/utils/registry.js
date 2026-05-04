import { defineAsyncComponent, markRaw } from 'vue'

const components = new Map()

export function register (packageComponents) {
  for (const [key, value] of Object.entries(packageComponents)) {
    const name = key.includes('/') ? key.split('/').pop().replace('.vue', '') : key
    components.set(name, value)
  }
}

export function load (componentName) {
  const name = componentName.includes('/') ? componentName.split('/').pop().replace('.vue', '') : componentName
  const entry = components.get(name)
  if (!entry) throw new Error(`Component "${componentName}" not found in registry`)
  return typeof entry === 'function'
    ? markRaw(defineAsyncComponent(entry))
    : markRaw(entry)
}
