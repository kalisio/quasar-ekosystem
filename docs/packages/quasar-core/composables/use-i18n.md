---
title: useI18n
description: Composable that provides access to the I18n utility.
---

# useI18n

Composable that provides access to the `I18n` utility from within a component setup.

## Usage

### Signature

```js
const i18n = useI18n()
```

### Returns

Returns the `I18n` instance. See [I18n](./i18n) for the full API.

### Examples

```js
import { useI18n } from 'quasar-core'

const { tie, t } = useI18n()

const label = computed(() => tie('app.welcome'))
const greeting = computed(() => tie('app.greeting', { name: 'Alice' }))
```

```html
<p>{{ tie('app.welcome') }}</p>
```