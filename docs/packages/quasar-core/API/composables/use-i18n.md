---
title: useI18n
description: Composable that provides access to the I18n utility.
---

# useI18n

Composable that provides access to the `I18n` utility. Wraps `inject('i18n')` for convenient use in components.

## Usage

### Signature

```js
const { tie } = useI18n()
```

### Returns

| Name | Type | Description |
|------|------|-------------|
| `tie` | `function` | Translates a key if it exists, otherwise returns the key as-is. See [I18n — tie](./plugin#accessing-i18n) |

### Examples

```js
import { useI18n } from 'quasar-core'

const { tie } = useI18n()

const label = computed(() => tie('app.welcome'))
const greeting = computed(() => tie('app.greeting', { name: 'Alice' }))
```

```html
<p>{{ tie('app.welcome') }}</p>
```
