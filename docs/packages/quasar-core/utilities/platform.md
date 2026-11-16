---
title: Platform
description: Browser platform detection and WebGL capabilities.
---

# Platform

The `platform` module extends [Quasar Platform](https://quasar.dev/options/platform-detection) with application build information and WebGL capabilities.

It provides a unified interface for accessing browser, device and environment information.

The module exposes a singleton `Platform` object that must be initialized before use.

## Initialization

Initialize the platform with the application build mode:

```js
Platform.initialize('PWA')
```

Supported build modes are:

- `PWA` — Progressive Web Application.
- `SPA` — Single Page Application.

Initialization is synchronous and performs the following operations:

1. References browser and device information from Quasar Platform.
2. Adds the application build mode indicator to `Platform.is`.
3. Detects and caches WebGL capabilities.
4. Logs the initialized platform information.

An invalid build mode throws an error.

Initialization can be called again with a different build mode. WebGL capabilities are detected only once.

## Platform properties

The module exposes the following properties:

| Property | Description |
|---|---|
| `userAgent` | Browser user-agent string |
| `is` | Browser, operating system and device information |
| `has` | Browser capability indicators |
| `within` | Information about the application's execution context |
| `webgl` | Detected WebGL capabilities |

The `userAgent`, `has` and `within` properties reference the corresponding Quasar Platform values.

The `is` property is copied from Quasar Platform to allow additional application-specific properties without modifying the original object.

### Application build mode

The module extends `Platform.is` with a `pwa` boolean:

```js
Platform.initialize('PWA')

Platform.is.pwa // true
```

For an SPA build:

```js
Platform.initialize('SPA')

Platform.is.pwa // false
```

### Browser and device information

Existing Quasar Platform properties remain accessible:

```js
Platform.is.desktop
Platform.is.mobile
Platform.is.name
Platform.is.version
Platform.is.platform

Platform.has.touch
Platform.has.webStorage

Platform.within.iframe
```

Refer to the [Quasar Platform documentation](https://quasar.dev/options/platform-detection) for the complete list of available properties.

The module retains references to Quasar's capability objects, preserving their dynamic getters.

## WebGL capabilities

WebGL capabilities are automatically detected during initialization and exposed through `Platform.webgl`.

```js
Platform.initialize('PWA')

if (Platform.webgl.supported) {
  console.log(Platform.webgl.version)
  console.log(Platform.webgl.vendor)
  console.log(Platform.webgl.renderer)
}
```

### Properties

| Property | Type | Description |
|---|---|---|
| `supported` | `boolean` | Whether a WebGL context is available |
| `version` | `string` | WebGL version reported by the graphics context |
| `vendor` | `string` | Graphics vendor information |
| `renderer` | `string` | Graphics renderer information |

When WebGL is unavailable, the result contains only:

```js
{
  supported: false
}
```

### Detection process

The module creates a temporary canvas and attempts to obtain a WebGL context.

It first requests WebGL 2:

```js
canvas.getContext('webgl2')
```

If unavailable, it falls back to WebGL 1:

```js
canvas.getContext('webgl')
```

When a context is available, the module retrieves its version, vendor and renderer information.

If the `WEBGL_debug_renderer_info` extension is available, the module uses its unmasked vendor and renderer parameters.

Otherwise, it uses the standard WebGL vendor and renderer parameters.

The reported vendor and renderer depend on browser permissions, graphics drivers and privacy protections.

### Context cleanup

After collecting the information, the module attempts to release the temporary WebGL context using the optional `WEBGL_lose_context` extension.

This reduces unnecessary consumption of graphics resources.

If the extension is unavailable, the context cannot be explicitly released through that mechanism.

### Caching

WebGL capabilities are detected only once per module instance.

Subsequent calls to `Platform.initialize()` reuse the cached result rather than creating another WebGL context.

This applies whether WebGL was initially detected as supported or unsupported.

The cached result represents the capabilities detected during the first successful detection and is not automatically refreshed.

## Error handling

`Platform.initialize()` throws if the build mode is not `PWA` or `SPA`.

WebGL detection reports `{ supported: false }` when neither WebGL 2 nor WebGL 1 provides a context.

Unexpected errors during canvas creation or WebGL operations are not intercepted and may propagate to the caller.

## Runtime considerations

The module targets browser applications built as SPA or PWA.

WebGL detection requires a browser environment with access to `document` and the Canvas API. Initialization must therefore run in the browser, not during server-side rendering or inside a service worker.

Because initialization performs WebGL detection, it is recommended to initialize the platform once during application startup, before other application modules consume its properties.

## Example

```js
Platform.initialize('PWA')

// Application environment
console.log(Platform.is.pwa)
console.log(Platform.is.mobile)
console.log(Platform.within.iframe)

// Browser capabilities
console.log(Platform.has.touch)

// Graphics capabilities
if (Platform.webgl.supported) {
  console.log('WebGL available:', Platform.webgl.version)
} else {
  console.warn('WebGL is not available')
}
```


