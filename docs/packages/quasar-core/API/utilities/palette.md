---
title: palette
description: Utility object for resolving and matching colors across Quasar, HTML, and CSS theme palettes.
---

# palette

Utility object for resolving and matching colors across Quasar, HTML, and CSS theme palettes.

## resolve

### Signature

```js
palette.resolve(color, defaultColor)
```

### Description

Resolves a color value to a hex string. Accepts hex, HSL, RGB, Quasar palette names, HTML color names, and CSS theme variables (e.g. `primary`, `secondary`). Returns `defaultColor` if the color is empty or cannot be resolved.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `color` | `string` | yes | The color to resolve. Can be a hex string, `hsl(...)`, `rgb(...)`, a Quasar palette name (e.g. `'red-5'`), an HTML color name (e.g. `'coral'`), or a CSS theme variable name (e.g. `'primary'`) |
| `defaultColor` | `string` | no | Fallback value returned when `color` is empty or cannot be resolved |

### Returns

| Type | Description |
|------|-------------|
| `string` | The resolved color string, or `defaultColor` if unresolvable |

### Examples

```js
palette.resolve('#ff0000')
// '#ff0000'

palette.resolve('red-5')
// '#ef5350'

palette.resolve('coral')
// '#FF7F50'

palette.resolve('primary')
// resolves the CSS variable --q-primary, e.g. '#1976d2'

palette.resolve('', '#000000')
// '#000000'
```

## findClosest

### Signature

```js
palette.findClosest(color)
```

### Description

Finds the closest color name in the Quasar palette to the given color, using the CIEDE2000 color difference algorithm.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `color` | `string` | yes | A valid color value (hex, RGB, HSL, etc.) |

### Returns

| Type | Description |
|------|-------------|
| `string` | The key of the closest Quasar palette entry (e.g. `'red-5'`) |

### Throws

Throws an assertion error if `color` is not a valid color.

### Examples

```js
palette.findClosest('#e53935')
// 'red-7'

palette.findClosest('rgb(0, 150, 136)')
// 'teal-6'
```