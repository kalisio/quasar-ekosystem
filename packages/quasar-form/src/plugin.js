import { defineAsyncComponent } from 'vue'
import QuasarCore from '@kalisio/quasar-core'

const modules = import.meta.glob('./components/**/*.vue')

export const plugin = {
  install (app, options = {}) {
    app.use(QuasarCore, options)
    for (const [path, loader] of Object.entries(modules)) {
      const name = path.split('/').pop().replace('.vue', '')
      app.component(name, defineAsyncComponent(loader))
    }
  }
}
