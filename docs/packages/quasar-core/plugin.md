---
title: plugin
description: Vue plugin that registers components, directives, and initializes i18n and platform utilities.
---

# plugin

The main entry point of the package. Registers all components and directives globally, and sets up the `Platform` and `I18n` utilities. Must be installed before using any component, directive, or utility from this package.

## Usage

### Signature

```js
app.use(plugin, options)
```

### Description

Installing the plugin does the following:

- Registers all package components as async global components, available without import in any template.
- Registers all package directives (e.g. `v-hover`, `v-safe-html`) globally.
- Initializes the `Platform` utility with the provided build mode.
- Initializes the `I18n` utility with the provided vue-i18n instance, if any.
- Exposes `Platform` and `I18n` to all components via `inject` and global properties.

### Options

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `buildMode` | `string` | yes | The Quasar build mode. Must be `'PWA'` or `'SPA'` |
| `i18n` | `object` | no | A vue-i18n instance created with `createI18n` |

### Examples

```js
// Quasar boot file
import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import { plugin } from 'quasar-core'

const i18n = createI18n({ locale: 'en', messages: { ... } })

export default defineBoot(async ({ app }) => {
  await app.use(plugin, {
    buildMode: process.env.BUILD_MODE,
    i18n
  })
})
```

## Accessing Platform

The `Platform` object exposes browser, system, and fingerprint data collected at initialization.

```js
// Composition API
const platform = inject('platform')
const locale = platform.getData('browser.locale')

// Options API / template
const locale = this.$platform.getData('browser.locale')
```

```html
<p>{{ $platform.getData('system.os') }}</p>
```

For the full list of available fields, see [getData](./platform#getdata).

## Accessing I18n

The `I18n` utility provides `tie` — translate if exists — which returns the translation key as-is when no translation is found, without logging a warning.

```js
// Composition API
const i18n = inject('i18n')
i18n.tie('app.welcome')
i18n.tie('app.greeting', { name: 'Alice' })

// Options API / template
this.$tie('app.welcome')
```

```html
<p>{{ $tie('app.welcome') }}</p>
```