---
title: screen
description: Utility object for resolving responsive dimensions and managing screen state.
---

# screen

Utility object for resolving responsive dimensions and managing screen state. Integrates with Quasar's `Screen` plugin to support percentage-based and breakpoint-aware sizing.

## resolveWidth

### Signature

```js
screen.resolveWidth(width)
```

### Description

Resolves a width value to an absolute pixel number. Accepts a fixed pixel value, a percentage of the current screen width, or an object mapping Quasar breakpoint names to values.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `width` | `number \| object` | yes | The width to resolve |

### Returns

| Type | Description |
|------|-------------|
| `number \| undefined` | The resolved pixel value, or `undefined` if the input is invalid |

### Examples

```js
// Fixed value above 100 — returned as-is
screen.resolveWidth(800)
// 800

// Percentage of screen width (e.g. Screen.width = 1024)
screen.resolveWidth(50)
// 512

// Breakpoint object (e.g. Screen.name = 'md')
screen.resolveWidth({ sm: 300, md: 800, lg: 1200 })
// 800
```

## resolveHeight

### Signature

```js
screen.resolveHeight(height)
```

### Description

Resolves a height value to an absolute pixel number. Accepts a fixed pixel value, a percentage of the current screen height, or an object mapping Quasar breakpoint names to values.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `height` | `number \| object` | yes | The height to resolve |

### Returns

| Type | Description |
|------|-------------|
| `number \| undefined` | The resolved pixel value, or `undefined` if the input is invalid |

### Examples

```js
// Fixed value above 100 — returned as-is
screen.resolveHeight(400)
// 400

// Percentage of screen height (e.g. Screen.height = 768)
screen.resolveHeight(50)
// 384

// Breakpoint object (e.g. Screen.name = 'md')
screen.resolveHeight({ sm: 200, md: 400, lg: 600 })
// 400
```

## resolveSize

### Signature

```js
screen.resolveSize(size)
```

### Description

Resolves a size to a `[width, height]` tuple. Accepts a pre-resolved tuple or an object mapping Quasar breakpoint names to `[width, height]` tuples. Each dimension is resolved via `resolveWidth` and `resolveHeight`.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `size` | `[number, number] \| object` | yes | The size to resolve |

### Returns

| Type | Description |
|------|-------------|
| `[number, number] \| undefined` | The resolved `[width, height]` tuple, or `undefined` if the input is invalid |

### Examples

```js
// Pre-resolved tuple — returned as-is
screen.resolveSize([800, 400])
// [800, 400]

// Breakpoint object (e.g. Screen.name = 'md')
screen.resolveSize({ sm: [300, 200], md: [800, 400], lg: [1200, 600] })
// [800, 400]
```

## orientation

### Signature

```js
screen.orientation()
```

### Description

Returns the current screen orientation based on the ratio of `Screen.width` to `Screen.height`.

### Returns

| Type | Description |
|------|-------------|
| `string` | `'landscape'` if width is greater than height, `'portrait'` otherwise |

### Examples

```js
screen.orientation()
// 'landscape' or 'portrait'
```

## lockOrientation

### Signature

```js
screen.lockOrientation(orientation)
```

### Description

Locks the screen orientation using the native Screen Orientation API, if available.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `orientation` | `string` | yes | The orientation to lock. See [Screen Orientation API](https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock) for accepted values |

### Returns

| Type | Description |
|------|-------------|
| `Promise<void>` | Resolves when the orientation is locked, or immediately if the API is unavailable |

### Examples

```js
await screen.lockOrientation('portrait')
await screen.lockOrientation('landscape')
```

## toggleFullscreen

### Signature

```js
screen.toggleFullscreen()
```

### Description

Toggles fullscreen mode using Quasar's `AppFullscreen` plugin. Returns `false` silently if the operation fails.

### Returns

| Type | Description |
|------|-------------|
| `Promise<boolean>` | `true` if toggled successfully, `false` otherwise |

### Examples

```js
await screen.toggleFullscreen()
// true
```
