import { defineAsyncComponent, markRaw } from 'vue'
import { getLogger } from '@logtape/logtape'

const logger = getLogger(['quasar-core', 'component-registry'])

class Registry {
  constructor () {
    this.components = new Map()
  }

  extractName (key) {
    return key.includes('/') ? key.split('/').pop().replace('.vue', '') : key
  }

  register (packageComponents) {
    for (const [key, value] of Object.entries(packageComponents)) {
      const name = this.extractName(key)
      this.components.set(name, value)
      logger.debug`Registered component: ${name}`
    }
  }

  load (componentName) {
    const name = this.extractName(componentName)
    const entry = this.components.get(name)
    if (!entry) {
      logger.error`Component not found in registry: ${componentName}`
      throw new Error(`Component "${componentName}" not found in registry`)
    }
    logger.debug`Loaded component: ${name}`
    return typeof entry === 'function'
      ? markRaw(defineAsyncComponent(entry))
      : markRaw(entry)
  }
}

export const ComponentRegistry = new Registry()
ComponentRegistry.register(import.meta.glob('./components/**/*.vue'))
