import { defineAsyncComponent } from 'vue'
import { i18n } from './utilities/i18n.js'

const modules = import.meta.glob('./components/**/*.vue')

export const plugin = {
  install (app, options = {}) {
    for (const [path, loader] of Object.entries(modules)) {
      const name = path.split('/').pop().replace('.vue', '')
      app.component(name, defineAsyncComponent(loader))
    }
    if (options.i18n) i18n.setInstance(options.i18n)
    app.provide('i18n', i18n)
    app.config.globalProperties.$tie = (key, params) => i18n.tie(key, params)
  }
}
