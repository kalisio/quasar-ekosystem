import { defineAsyncComponent } from 'vue'

const modules = import.meta.glob('./components/**/*.vue')

export const plugin = {
  install (app) {
    for (const [path, loader] of Object.entries(modules)) {
      const name = path.split('/').pop().replace('.vue', '')
      app.component(name, defineAsyncComponent(loader))
    }
  }
}
