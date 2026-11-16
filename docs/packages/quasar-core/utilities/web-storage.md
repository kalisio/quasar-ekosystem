---
title: Web Storage
description: Synchronous key-value storage using localStorage and sessionStorage.
---

# Web Storage

The `web-storage` module provides a simple, synchronous key-value storage API built on the browser's native Web Storage API.

It exposes two storage instances:

- **`LocalStorage`** — Persistent storage across browser sessions.
- **`SessionStorage`** — Temporary storage scoped to a browser tab or page session.

Both implementations support namespaced keys, JSON serialization and synchronous updates.

## Usage

```js
import { LocalStorage, SessionStorage } from '@kalisio/quasar-core/storage/web-storage'

// Initialize a storage namespace
LocalStorage.initialize('my-app')
SessionStorage.initialize('my-app')

// Store values
LocalStorage.set('theme', 'dark')
SessionStorage.set('current-page', 2)

// Retrieve values
const theme = LocalStorage.get('theme', 'light')
const page = SessionStorage.get('current-page', 1)
```

All operations are synchronous. No `await` is required.

## Initialization

Each storage instance must be initialized with a non-empty string prefix before use.

```js
LocalStorage.initialize('my-app')
```

The prefix is automatically prepended to every key using the format `prefix-key`.

For example:

```js
LocalStorage.set('theme', 'dark')
```

Stores the value under the browser storage key `my-app-theme`.

Initialization can be called again with a different prefix to switch namespaces.

The browser storage API is accessed during initialization rather than at module load time. If storage is blocked or unavailable, a warning is logged and subsequent data operations throw an error.

## API

### `initialize(prefix)`

Initializes the storage instance with a namespace.

**Parameters**

- `prefix` (`string`) — Non-empty namespace identifier.

**Returns:** `undefined`

Throws if the prefix is invalid.

### `set(key, value)`

Stores a value, replacing any existing value associated with the key.

```js
LocalStorage.set('settings', {
  theme: 'dark',
  language: 'en'
})
```

**Parameters**

- `key` (`string`) — Non-empty storage key.
- `value` (`any`) — JSON-compatible value.

**Returns:** `undefined`

### `get(key, defaultValue)`

Retrieves a stored value.

```js
const settings = LocalStorage.get('settings', {})
```

**Parameters**

- `key` (`string`) — Non-empty storage key.
- `defaultValue` (`any`, optional) — Value returned when the key is missing or the stored JSON cannot be parsed.

**Returns:** The stored value or `defaultValue`.

An explicitly stored `null` is preserved and does not trigger the default.

If the stored value is malformed JSON, a warning is logged and the default value is returned.

### `has(key)`

Checks whether a key exists.

```js
if (LocalStorage.has('settings')) {
  // Settings are stored
}
```

**Returns:** `boolean`

A key containing `null` is considered present. Existence is checked independently of JSON parsing.

### `update(key, updater)`

Reads, transforms and writes a value synchronously.

```js
LocalStorage.update('counter', value => (value ?? 0) + 1)
```

**Parameters**

- `key` (`string`) — Non-empty storage key.
- `updater` (`function`) — Synchronous callback receiving the current value and returning the replacement value.

**Returns:** `undefined`

When the key does not exist, the updater receives `undefined`.

Updates execute synchronously within the current JavaScript execution context. They are **not atomic across tabs or independent contexts**.

If the updater throws or returns `undefined`, the previous value is preserved.

### `remove(key)`

Removes a stored value.

```js
LocalStorage.remove('settings')
```

**Returns:** `undefined`

Removing a nonexistent key has no effect.

## Supported values

Values must be JSON-compatible:

- Strings, finite numbers, booleans and `null`
- Arrays containing JSON-compatible values
- Plain objects containing JSON-compatible values

A top-level `undefined` is rejected. Nested values are not recursively validated.

Values are serialized using `JSON.stringify()` and deserialized using `JSON.parse()`.

Avoid storing functions, `Date`, `Map`, `Set`, `BigInt`, circular references, non-finite numbers or objects containing `undefined`, since they can produce errors or unexpected serialization results.

## Persistence and isolation

| Property | LocalStorage | SessionStorage |
|---|---|---|
| Persists across page reloads | Yes | Yes |
| Persists across browser sessions | Generally yes | No |
| Shared across tabs | Yes, within the same storage partition | Generally no |
| Storage format | JSON string | JSON string |
| API | Synchronous | Synchronous |
| Atomic updates across tabs | No | No |

Browser policies, privacy settings or user actions may remove stored data.

## Error handling

Data operations throw when:

- Storage has not been initialized.
- Storage is unavailable or blocked.
- A key is invalid.
- A top-level value is `undefined`.
- Serialization fails.
- The browser denies the operation or storage quota is exceeded.

```js
try {
  LocalStorage.set('settings', { theme: 'dark' })
} catch (error) {
  console.error('Unable to save settings:', error)
}
```

## Recommendations

Use `LocalStorage` for small, persistent application preferences such as theme, language and display options.

Use `SessionStorage` for temporary state tied to a browser tab, such as navigation state or transient UI preferences.

Avoid storing large datasets or sensitive credentials in Web Storage. For larger datasets or transactional updates, prefer [IndexedDB Storage](./indexeddb-storage.md).

