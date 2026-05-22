import { defineAsyncComponent } from 'vue'
import { i18n } from './utilities/i18n.js'

const componentModules = import.meta.glob('./components/**/*.vue')
const directiveModules = import.meta.glob('./directives/v-*.js', { eager: true })

export const plugin = {
  install (app, options = {}) {
    for (const [path, loader] of Object.entries(componentModules)) {
      const name = path.split('/').pop().replace('.vue', '')
      app.component(name, defineAsyncComponent(loader))
    }
    for (const [path, module] of Object.entries(directiveModules)) {
      const name = path.split('/').pop().replace('.js', '').slice(2)
      app.directive(name, Object.values(module)[0])
    }
    if (options.i18n) i18n.setInstance(options.i18n)
    app.provide('i18n', i18n)
    app.config.globalProperties.$tie = (key, params) => i18n.tie(key, params)
  }
}
