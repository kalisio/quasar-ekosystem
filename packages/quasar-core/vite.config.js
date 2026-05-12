import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import { baseConfig } from '../../vite.base-config'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default mergeConfig(baseConfig, defineConfig({
  root: __dirname
}))
