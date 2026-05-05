---
title: quasar-core
description: Core components and component registry for the Kalisio ekosystem
---

# quasar-core

_Core components and component registry for the Kalisio ekosystem_

## Overview

**quasar-core** is the foundation of the quasar-ekosystem. It provides two things: a set of generic UI components built on top of the [Quasar Framework](https://quasar.dev), and a **component registry** that lets any package register and resolve Vue components by name at runtime.

It is organized around 2 modules:

- [components](#components) — generic UI building blocks (avatar, chip, modal, tabs, tree…)
- [registry](#registry) — shared component registry for cross-package component resolution

### Registry

The registry is the architectural backbone of the ekosystem. Any package can register its own components into the shared registry at initialization time, and any other package can load them by name without creating hard dependencies between packages.

```js
import { register, load } from '@kalisio/quasar-core'

// register all components from a package (typically called in src/index.js)
register(import.meta.glob('./components/**/*.vue'))

// load any registered component by name
const KTextField = load('KTextField')
```

The registry exposes a singleton `Registry` instance and two standalone functions:

| Export | Description |
|---|---|
| `registry` | The singleton `Registry` instance |
| `register(packageComponents)` | Registers a glob of Vue components into the shared registry |
| `load(componentName)` | Returns a component from the registry, wrapped in `defineAsyncComponent` if lazy |

> [!NOTE]
> `register()` accepts both eager components (plain objects) and lazy loaders (functions returning a Promise), as produced by `import.meta.glob`.

### Components

**quasar-core** ships the following generic components:

| Component | Description |
|---|---|
| `KAction` | Multi-renderer action button (button, item, fab, tab…) with toggle and handler support |
| `KAvatar` | Avatar built from a subject — displays initials, an image or an icon |
| `KChip` | Chip with label, icon and v-model support |
| `KContent` | Dynamically renders a list of components from a content descriptor array or object |
| `KDialog` | Confirmation dialog with configurable OK and Cancel actions |
| `KEditor` | Form wrapper bound to a Feathers service, supporting create and edit modes |
| `KExpandable` | Animated expand/collapse container driven by a prop |
| `KFollower` | Overlay component that positions itself relative to a target element |
| `KModal` | Modal window with header, scrollable content and footer buttons |
| `KPanel` | Horizontal or vertical action bar driven by a content array |
| `KScrollArea` | Scroll area with configurable scrollbar style |
| `KSponsor` | KDK and Kalisio attribution block |
| `KStamp` | Icon and text block with vertical or horizontal layout |
| `KStore` | Reactive application store displayed as a tree |
| `KTab` | Tab navigation driven by a content object |
| `KTextArea` | Expandable text area with scroll |
| `KTree` | Hierarchical tree with lazy node loading |

All components are automatically registered into the shared registry when the package is imported.

## Installation

Install with your preferred package manager:

::: code-group

```bash [pnpm]
pnpm add @kalisio/quasar-core
```

```bash [npm]
npm install @kalisio/quasar-core
```

```bash [yarn]
yarn add @kalisio/quasar-core
```

:::
