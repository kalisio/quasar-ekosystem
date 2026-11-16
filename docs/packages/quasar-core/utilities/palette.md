---
title: palette
description: Utilities for resolving colors and finding the closest matching Quasar palette color.
---

# palette

Utilities for resolving colors from Quasar, HTML/CSS named colors, and application theme variables, and finding the closest matching color in the Quasar palette.

The implementation relies on:

- [Quasar Color Palette](https://quasar.dev/style/color-palette/) for predefined colors and theme variables.
- [chroma.js](https://gka.github.io/chroma.js/) for HTML/CSS named colors and perceptual color comparison.

## resolve

### Signature

```js
palette.resolve(color, defaultColor)
```

### Description

Resolves a color to its corresponding CSS color value.

Supported inputs include:

- Hexadecimal, RGB, RGBA, and HSL color strings, returned unchanged.
- [Quasar palette colors](https://quasar.dev/style/color-palette/#color-list), such as `red`, `blue-3`, or `deep-purple-10`.
- HTML/CSS named colors provided by [`chroma.colors`](https://gka.github.io/chroma.js/), such as `coral` or `navy`.
- Quasar theme variables, such as `primary`, `secondary`, or `accent`, resolved from their CSS custom properties (`--q-primary`, etc.).

When a color name exists in both the Quasar and HTML palettes, **the Quasar palette takes precedence**.

If the color is empty or cannot be resolved, the function returns `defaultColor`.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `color` | `string` | Yes | Color value or name to resolve |
| `defaultColor` | `string` | No | Fallback value when the color cannot be resolved |

### Returns

| Type | Description |
|------|-------------|
| `string \| undefined` | Resolved CSS color value, or `defaultColor` if resolution fails |

The returned value is not necessarily hexadecimal. Explicit color strings retain their original representation.

### Examples

```js
// Explicit color values
palette.resolve('#ff0000')
// '#ff0000'

palette.resolve('rgb(255, 0, 0)')
// 'rgb(255, 0, 0)'

// Quasar palette
palette.resolve('red-5')
// '#ef5350'

// Quasar takes precedence over HTML colors
palette.resolve('red')
// '#f44336' (Quasar), not '#ff0000' (HTML)

// HTML/CSS named colors
palette.resolve('coral')
// '#ff7f50'

// Application theme variables
palette.resolve('primary')
// Value of --q-primary, e.g. '#1976d2'

// Fallback
palette.resolve('', '#000000')
// '#000000'

palette.resolve('unknown-color', '#000000')
// '#000000'
```

::: tip
Theme colors are resolved through Quasar's `getCssVar()` utility. Their values depend on the current application theme and require the corresponding CSS variables to be available.
:::

## findClosest

### Signature

```js
palette.findClosest(color)
```

### Description

Finds the closest matching color in the [Quasar color palette](https://quasar.dev/style/color-palette/#color-list).

Color similarity is calculated using the **CIEDE2000 (ΔE00)** perceptual color difference algorithm, implemented by [`chroma.deltaE()`](https://gka.github.io/chroma.js/).

Unlike `resolve()`, this function does not resolve theme variables. It compares a valid color value against the predefined `QUASAR_PALETTE` entries.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `color` | `string` | Yes | Valid color value (hex, RGB, HSL, etc.) |

### Returns

| Type | Description |
|------|-------------|
| `string` | Name of the closest Quasar palette entry |

Some Quasar entries share identical values (e.g. `teal` and `teal-6`). In such cases, the first matching entry in `QUASAR_PALETTE` is returned.

### Throws

Throws an assertion error if `color` is not a valid color.

### Examples

```js
palette.findClosest('#e53935')
// 'red-7'

palette.findClosest('rgb(0, 150, 136)')
// 'teal'

palette.findClosest('#f44336')
// 'red'
```


