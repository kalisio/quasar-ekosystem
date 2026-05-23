---
title: Platform
description: Utility object for accessing platform, browser, and fingerprint data.
---

# Platform

Unique object for accessing platform, browser, and fingerprint data. Extends Quasar's platform detection with fingerprinting capabilities.

## initialize

### Signature

```js
Platform.initialize(mode)
```

### Description

Initializes the Platform object by merging Quasar platform data, collecting fingerprint data, and setting the application mode. Must be called before any other method.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `mode` | `string` | yes | The application mode. Must be `'PWA'` or `'SPA'` |

### Returns

| Type | Description |
|------|-------------|
| `Promise<void>` | Resolves when the platform is fully initialized |

### Throws

Throws an assertion error if `mode` is not `'PWA'` or `'SPA'`.

### Examples

```js
await Platform.initialize('PWA')
// Platform is now ready to use

await Platform.initialize('SPA')
// Platform is now ready to use
```

## getData

### Signature

```js
Platform.getData(scope)
```

### Description

Returns a structured snapshot of the current platform data, including user agent, application context, browser details, and system information. If `scope` is provided, only the matching nested value is returned.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `scope` | `string` | no | A dot-notation path to a specific field in the data object (e.g. `'browser.locale'`). If empty, the full object is returned |

### Returns

| Type | Description |
|------|-------------|
| `object` | The full platform data object, or the value at the given `scope` path |

### Examples

```js
Platform.getData()
// {
//   userAgent: 'Mozilla/5.0 ...',
//   application: { mode: 'PWA', iframe: false, permissions: { ... } },
//   browser: { locale: 'en-US', webgl: 'NVIDIA ...', ... },
//   system: { os: 'Win32', desktop: true, mobile: false, touch: false }
// }

Platform.getData('browser.locale')
// 'en-US'

Platform.getData('system.os')
// 'Win32'
```