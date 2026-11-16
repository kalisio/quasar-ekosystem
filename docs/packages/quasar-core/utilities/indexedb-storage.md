---
title: IndexedDB Storage
description: Asynchronous key-value storage with transactional updates.
---

# IndexedDB Storage

The `indexeddb-storage` module provides an asynchronous key-value storage API built on the browser's IndexedDB API.

It uses [idb-keyval](https://github.com/jakearchibald/idb-keyval) to expose a lightweight interface for storing, retrieving, updating and removing values.

Unlike Web Storage, IndexedDB supports asynchronous operations, larger datasets and transactional updates across browser tabs.

## Usage

```js
import { IndexedDBStorage } from '@kalisio/quasar-core/storage/indexeddb-storage'

// Initialize a database
IndexedDBStorage.initialize('my-app')

// Store a value
await IndexedDBStorage.set('settings', {
  theme: 'dark',
  language: 'en'
})

// Retrieve a value
const settings = await IndexedDBStorage.get('settings', {})

// Update a value
await IndexedDBStorage.update('counter', value => (value ?? 0) + 1)
```

All data operations return Promises and should be awaited.

## Initialization

The storage must be initialized with a non-empty string prefix before use.

```js
IndexedDBStorage.initialize('my-app')
```

The prefix identifies a dedicated IndexedDB database.

Each database contains an object store named `storage`.

Keys are stored without an additional prefix because namespace isolation is provided by the database itself.

Calling `initialize()` again with another prefix switches the active database.

Initialization is synchronous and configures the store. Database access occurs during subsequent asynchronous operations, which may reject if IndexedDB is unavailable or blocked.

## API

### `initialize(prefix)`

Configures the IndexedDB storage namespace.

**Parameters**

- `prefix` (`string`) — Non-empty database name.

**Returns:** `undefined`

Throws if the prefix is invalid.

### `set(key, value)`

Stores a value, replacing any existing value associated with the key.

```js
await IndexedDBStorage.set('features', [
  { id: 1, name: 'Feature A' },
  { id: 2, name: 'Feature B' }
])
```

**Parameters**

- `key` (`string`) — Non-empty storage key.
- `value` (`any`) — JSON-compatible value.

**Returns:** `Promise<void>`

The Promise resolves when the write transaction completes.

### `get(key, defaultValue)`

Retrieves a stored value.

```js
const features = await IndexedDBStorage.get('features', [])
```

**Parameters**

- `key` (`string`) — Non-empty storage key.
- `defaultValue` (`any`, optional) — Value returned when the key does not exist.

**Returns:** `Promise<any>`

An explicitly stored `null` is preserved and does not trigger the default value.

### `has(key)`

Checks whether a key exists.

```js
const exists = await IndexedDBStorage.has('features')
```

**Returns:** `Promise<boolean>`

A key containing `null` is considered present.

The implementation treats a retrieved `undefined` as an absent key. Top-level `undefined` values are therefore not supported by the storage contract.

### `update(key, updater)`

Atomically reads, transforms and writes a value using an IndexedDB `readwrite` transaction.

```js
await IndexedDBStorage.update('counter', value => (value ?? 0) + 1)
```

**Parameters**

- `key` (`string`) — Non-empty storage key.
- `updater` (`function`) — Synchronous callback receiving the current value and returning the replacement value.

**Returns:** `Promise<void>`

When the key does not exist, the updater receives `undefined`.

The updater must return a supported value. Returning `undefined` is rejected.

**Transactional behavior**

The read and write operations execute within the same transaction, preventing lost updates when multiple tabs or other contexts access the same database.

For example:

```js
const increment = () =>
  IndexedDBStorage.update('counter', value => (value ?? 0) + 1)

await Promise.all(Array.from({ length: 10 }, increment))

const counter = await IndexedDBStorage.get('counter')
// counter === 10
```

If the updater throws, the transaction is aborted and the previous value is preserved.

The updater must be synchronous. Asynchronous callbacks are not supported.

### `remove(key)`

Removes a stored value.

```js
await IndexedDBStorage.remove('features')
```

**Returns:** `Promise<void>`

Removing a nonexistent key has no effect.

## Supported values

Although IndexedDB natively supports structured cloning, this module defines a JSON-compatible value contract for consistency with other storage implementations.

Supported values include:

- Strings, finite numbers, booleans and `null`
- Arrays containing JSON-compatible values
- Plain objects containing JSON-compatible values

A top-level `undefined` is explicitly rejected.

Nested values are not recursively validated. Callers are responsible for respecting the JSON-compatible value contract.

Unlike Web Storage, IndexedDB does not serialize values to JSON strings. It uses the browser's structured clone algorithm.

Consequently, values outside the documented contract may be accepted but are not guaranteed to behave consistently with Web Storage.

## Persistence and isolation

Each storage prefix identifies an independent IndexedDB database.

```js
IndexedDBStorage.initialize('project-a')
await IndexedDBStorage.set('settings', { theme: 'dark' })

IndexedDBStorage.initialize('project-b')
const settings = await IndexedDBStorage.get('settings')
// undefined
```

Returning to `project-a` restores access to its stored values.

Data generally persists across page reloads, browser restarts and tabs using the same origin and storage partition, subject to browser storage policies.

IndexedDB storage may be cleared by users, privacy policies or browser storage eviction.

## Error handling

Storage operations return rejected Promises when:

- Storage has not been initialized.
- A key is invalid.
- A top-level value is `undefined`.
- IndexedDB is unavailable or blocked.
- A transaction fails or is aborted.
- Browser storage quota is exceeded.
- A value cannot be cloned.

```js
try {
  await IndexedDBStorage.set('settings', {
    theme: 'dark'
  })
} catch (error) {
  console.error('Unable to persist settings:', error)
}
```

Invalid prefixes cause `initialize()` to throw synchronously.

## Recommendations

Use `IndexedDBStorage` for:

- Larger structured datasets
- Application caches
- Offline data
- Persistent collections
- Counters and shared state requiring atomic updates across tabs

Use [Web Storage](./web-storage.md) for small settings and preferences when synchronous access is desirable.

Avoid storing sensitive credentials or secrets without appropriate security measures.