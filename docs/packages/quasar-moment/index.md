---
title: quasar-moment
description: Time and date components powered by Moment.js
---

# quasar-moment

_Time and date components powered by Moment.js_

## Overview

**quasar-moment** provides Vue components for displaying and formatting time and date values using [Moment.js](https://momentjs.com). All components are automatically registered into the `@kalisio/quasar-core` registry when the package is imported, making them available by name anywhere in the ekosystem.

| Component | Description |
|---|---|
| `KDate` | Displays a formatted date value with locale-aware output |

## Installation

Install with your preferred package manager:

::: code-group

```bash [pnpm]
pnpm add @kalisio/quasar-moment
```

```bash [npm]
npm install @kalisio/quasar-moment
```

```bash [yarn]
yarn add @kalisio/quasar-moment
```

:::

> [!NOTE]
> **quasar-moment** requires `@kalisio/quasar-core` and `moment` as peer dependencies.
