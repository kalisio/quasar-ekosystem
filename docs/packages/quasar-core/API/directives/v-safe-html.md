---
title: vSafeHtml
description: Vue directive that sanitizes and renders HTML content safely.
---

# vSafeHtml

Vue directive that sanitizes and renders HTML content safely before injecting it into the DOM. Supports named sanitization profiles and custom configurations.

## Usage

### Signature

```js
v-safe-html="html"
v-safe-html="{ html, config }"
```

### Description

Sanitizes the provided HTML string and assigns it to the element's `innerHTML`. Runs on both `mounted` and `updated` lifecycle hooks. When `config` is omitted, the default sanitization profile (`basicFormatting`) is used.

### Binding value

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `html` | `string` | yes | The HTML string to sanitize and render |
| `config` | `string \| object` | no | A named sanitization profile or a custom `sanitize-html` config object. Defaults to `'basicFormatting'` |

### Available profiles

See the [sanitize built-in profiles documentation](https://kalisio.github.io/common-ekosystem/packages/common-core/API/operators/sanitize.html#built-in-profiles) for the full list of available profile names.

### Examples

```html
<!-- Default profile (basicFormatting) -->
<div v-safe-html="content" />

<!-- Named profile -->
<div v-safe-html="{ html: content, config: 'markdown' }" />

<!-- Custom config object -->
<div v-safe-html="{ html: content, config: { allowedTags: ['b', 'i'] } }" />
```

```js
// Registering the directive globally
import { vSafeHtml } from './directives/safe-html.js'

app.directive('safe-html', vSafeHtml)
```