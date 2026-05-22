---
title: quasar-core
description: Core components and directives for the Kalisio ekosystem
---

# quasar-core

_Core components and directives for the Kalisio ekosystem_

## Overview

**quasar-core** is the foundation of the quasar-ekosystem. It provides a set of generic UI components and directives built on top of the [Quasar Framework](https://quasar.dev), all automatically registered when the plugin is installed.

It is organized around 2 modules:

- [components](#components) — generic UI building blocks (avatar, chip, modal, tabs, tree…)
- [directives](#directives) — reusable Vue directives (`v-hover`, `v-safe-html`)

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

All components are automatically registered globally when the plugin is installed.

### Directives

**quasar-core** ships the following Vue directives, all automatically registered by the plugin:

| Directive | Description |
|---|---|
| `v-hover` | Attaches `mouseenter`, `mouseover` and `mouseleave` listeners. No-op on touch devices (`Platform.touch`). Accepts `{ enter, over, leave }` handlers. |
| `v-safe-html` | Injects sanitized HTML into an element's `innerHTML`. Uses `sanitize` from `@kalisio/common-core` to strip dangerous tags before rendering. Prefer this over `v-html`. |

```vue
<!-- v-hover -->
<div v-hover="{ enter: onEnter, leave: onLeave }">Hover me</div>

<!-- v-safe-html -->
<div v-safe-html="htmlContent" />
```

> [!TIP]
> `v-safe-html` is the safe replacement for `v-html`. It sanitizes content using the `basicFormatting` profile from `@kalisio/common-core` before injecting it into the DOM.

### Platform

The `Platform` utility extends Quasar's built-in platform detection with fingerprinting and build mode information.

```js
import { Platform } from '@kalisio/quasar-core'

await Platform.initialize('spa') // or 'pwa'

Platform.getData()                    // full data object
Platform.getData('application.mode') // 'spa' | 'pwa'
Platform.getData('system.desktop')   // true | false
```

`initialize(buildMode)` must be called once at application startup. It merges Quasar's platform data, collects browser fingerprint data, and stores the build mode.

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
