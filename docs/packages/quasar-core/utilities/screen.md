---
title: Screen
description: Reactive viewport breakpoints, orientation and fullscreen management.
---

# Screen

The `screen` module provides a reactive interface for managing responsive layouts, viewport orientation and fullscreen mode.

Built on [Quasar Screen](https://quasar.dev/options/screen-plugin) and `AppFullscreen`, it exposes computed properties that can be used directly in Vue components.

The module supports configurable density and width breakpoints, viewport orientation detection, fullscreen toggling and orientation locking.

## Usage

```js
import { Screen } from '@kalisio/quasar-core/screen'

// Optional: configure responsive breakpoints
Screen.initialize({ dense: 'md', wide: 'lg' })

// Read reactive screen properties
console.log(Screen.dense)
console.log(Screen.wide)
console.log(Screen.orientation)
console.log(Screen.fullscreen)

// Toggle fullscreen mode
await Screen.toggleFullscreen()
```

Unlike the native Quasar Screen API, the module exposes a restricted, read-only interface for its reactive properties.

## Initialization

### `initialize(options)`

Configures the breakpoints used by the `dense` and `wide` properties.

```js
Screen.initialize({
  dense: 'sm',
  wide: 'lg'
})
```

**Options**

| Option | Type | Default | Description |
|---|---|---|---|
| `dense` | `string` | `'sm'` | Breakpoint used to determine dense layouts |
| `wide` | `string` | `'sm'` | Breakpoint used to determine wide layouts |

Initialization is optional. Default breakpoints are available immediately, without calling `initialize()`.

Calling `initialize()` again replaces the current configuration. Any omitted option is reset to its default value.

Invalid breakpoints cause an exception.

## Responsive properties

### `dense`

A reactive boolean indicating whether the viewport is below the configured density breakpoint.

It uses Quasar's `Screen.lt` properties.

Supported breakpoints are `sm`, `md`, `lg` and `xl`.

```js
Screen.initialize({ dense: 'md' })

if (Screen.dense) {
  // Use a compact layout
}
```

For example, `dense: 'md'` corresponds to `QScreen.lt.md`.

### `wide`

A reactive boolean indicating whether the viewport is above the configured width breakpoint.

It uses Quasar's `Screen.gt` properties.

Supported breakpoints are `xs`, `sm`, `md` and `lg`.

```js
Screen.initialize({ wide: 'lg' })

if (Screen.wide) {
  // Use a spacious layout
}
```

For example, `wide: 'lg'` corresponds to `QScreen.gt.lg`.

### Breakpoint semantics

The `dense` and `wide` properties are independent. They do not necessarily represent opposite states.

Both are derived from Quasar's responsive breakpoint system:

| Property | Quasar expression | Meaning |
|---|---|---|
| `dense` | `QScreen.lt[denseBreakpoint]` | Viewport below the configured breakpoint |
| `wide` | `QScreen.gt[wideBreakpoint]` | Viewport above the configured breakpoint |

Quasar defines different breakpoint keys for `lt` and `gt`, which explains the different sets of accepted values.

Refer to the [Quasar Screen documentation](https://quasar.dev/options/screen-plugin) for breakpoint definitions and configuration.

## Viewport orientation

### `orientation`

A reactive string describing the shape of the viewport.

Possible values:

- `portrait`
- `landscape`

```js
if (Screen.orientation === 'portrait') {
  // Adapt the layout for a taller viewport
}
```

The orientation is determined from the viewport dimensions:

- `portrait` when height is greater than or equal to width.
- `landscape` when width is greater than height.

This follows the CSS orientation media feature.

It does not necessarily represent the physical orientation of the device. For example, resizing a desktop browser window can change the reported orientation.

## Fullscreen

### `fullscreen`

A reactive boolean indicating whether Quasar's fullscreen plugin reports fullscreen mode as active.

```js
if (Screen.fullscreen) {
  // Application is in fullscreen mode
}
```

The value is derived from `AppFullscreen.isActive` and remains synchronized with Quasar's fullscreen state.

### `toggleFullscreen()`

Toggles fullscreen mode using Quasar's `AppFullscreen` plugin.

```js
const success = await Screen.toggleFullscreen()
```

**Returns:** `Promise<boolean>`

- `true` if the fullscreen toggle operation completes successfully.
- `false` if the operation fails.

Errors are logged as warnings rather than propagated.

Fullscreen operations may require a user interaction, such as clicking a button.

Example with Vue and Quasar:

```vue
<template>
  <q-btn
    :icon="Screen.fullscreen ? 'fullscreen_exit' : 'fullscreen'"
    @click="Screen.toggleFullscreen()"
  />
</template>

<script setup>
import { Screen } from '@kalisio/quasar-core/screen'
</script>
```

## Orientation locking

### `lockOrientation(orientation)`

Attempts to lock the physical screen orientation using the browser's native Screen Orientation API.

```js
const success = await Screen.lockOrientation('landscape')
```

**Parameters**

- `orientation` (`string`) — A screen orientation lock type supported by the browser.

Common values include:

- `portrait`
- `landscape`
- `portrait-primary`
- `portrait-secondary`
- `landscape-primary`
- `landscape-secondary`
- `any`
- `natural`

**Returns:** `Promise<boolean>`

- `true` when the orientation lock succeeds.
- `false` when the API is unavailable or the request fails.

When an orientation lock request fails, the error is logged as a warning.

### Browser restrictions

Orientation locking is subject to browser and operating system restrictions.

In particular:

- Many browsers require fullscreen mode before allowing orientation locking.
- Desktop browsers may reject orientation lock requests.
- Some mobile browsers, including iOS Safari, may not support the API.
- The operation may fail due to browser permissions or platform limitations.

Example:

```js
const fullscreen = await Screen.toggleFullscreen()

if (fullscreen && Screen.fullscreen) {
  const locked = await Screen.lockOrientation('landscape')
  if (!locked) {
    console.warn('Landscape orientation could not be locked')
  }
}
```

Note that `Screen.orientation` describes the viewport shape, while `lockOrientation()` operates on the native Screen Orientation API. These are related but distinct concepts.

## Reactivity

The properties `dense`, `wide`, `orientation` and `fullscreen` are reactive Vue values.

They are exposed through a deep readonly Vue wrapper that automatically unwraps nested computed refs.

Consequently, properties can be accessed directly:

```js
Screen.dense
Screen.orientation
Screen.fullscreen
```

There is no need to use `.value`.

They can also be used in Vue computed properties:

```js
import { computed } from 'vue'
import { Screen } from '@kalisio/quasar-core/screen'

const layoutMode = computed(() => Screen.dense ? 'compact' : 'comfortable')
```

Attempting to assign directly to reactive screen properties is not supported.

Use `Screen.initialize()` to change responsive breakpoints, and the provided methods to request fullscreen or orientation changes.

## Accessing native Quasar features

The module intentionally does not expose the underlying Quasar Screen object.

For native Quasar Screen properties and configuration methods such as `setSizes()` or `setDebounce()`, import it directly:

```js
import { Screen as QScreen } from 'quasar'

QScreen.setDebounce(100)
```

This keeps the `Screen` facade focused on application-level responsive behavior while preserving access to the complete Quasar API when needed.

## Error handling

| Operation | Error behavior |
|---|---|
| `initialize()` | Throws on invalid breakpoints |
| `toggleFullscreen()` | Logs a warning and returns `false` on failure |
| `lockOrientation()` | Returns `false` if unsupported; logs a warning and returns `false` on rejection |
| Reactive properties | Read-only; no direct mutation supported |

## Example: responsive fullscreen layout

```vue
<template>
  <div :class="{ 'dense-layout': Screen.dense }">
    <q-toolbar>
      <q-toolbar-title>Application</q-toolbar-title>

      <q-btn
        :icon="Screen.fullscreen ? 'fullscreen_exit' : 'fullscreen'"
        flat
        round
        @click="Screen.toggleFullscreen()"
      />
    </q-toolbar>

    <div v-if="Screen.wide">
      Wide layout
    </div>
    <div v-else>
      Standard layout
    </div>
  </div>
</template>

<script setup>
import { Screen } from '@kalisio/quasar-core/screen'

Screen.initialize({
  dense: 'sm',
  wide: 'lg'
})
</script>
```


