import { defineAsyncComponent, markRaw } from 'vue'
import { getLogger } from '@logtape/logtape'

export class Registry {
  constructor () {
    this.components = new Map()
    this.logger = getLogger(['quasar-core', 'registry'])
  }

  extractName (key) {
    return key.includes('/') ? key.split('/').pop().replace('.vue', '') : key
  }

  register (packageComponents) {
    for (const [key, value] of Object.entries(packageComponents)) {
      const name = this.extractName(key)
      this.components.set(name, value)
      this.logger.debug`Registered component: ${name}`
    }
  }

  load (componentName) {
    const name = this.extractName(componentName)
    const entry = this.components.get(name)
    if (!entry) {
      this.logger.error`Component not found in registry: ${componentName}`
      throw new Error(`Component "${componentName}" not found in registry`)
    }
    this.logger.debug`Loaded component: ${name}`
    return typeof entry === 'function'
      ? markRaw(defineAsyncComponent(entry))
      : markRaw(entry)
  }
}

export const registry = new Registry()

export function register (packageComponents) {
  registry.register(packageComponents)
}

export function load (componentName) {
  return registry.load(componentName)
}
