---
title: usePlatform
description: Composable that provides access to the Platform utility.
---

# usePlatform

Composable that provides access to the `Platform` utility. Wraps `inject('platform')` for convenient use in components.

## Usage

### Signature

```js
const platform = usePlatform()
```

### Returns

| Type | Description |
|------|-------------|
| `object` | The initialized `Platform` singleton. See [Platform — getData](./platform#getdata) |

### Examples

```js
import { usePlatform } from 'quasar-core'

const platform = usePlatform()

const locale = computed(() => platform.getData('browser.locale'))
const isDesktop = computed(() => platform.getData('system.desktop'))
```

```html
<p v-if="platform.is.desktop">Desktop view</p>
```
