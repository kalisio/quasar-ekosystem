---
title: vHover
description: Vue directive that binds hover event listeners on non-touch devices.
---

# vHover

Vue directive that binds hover event listeners on non-touch devices. On touch platforms, the directive is a no-op.

## Usage

### Signature

```js
v-hover="{ enter, over, leave }"
```

### Description

Attaches `mouseenter`, `mouseover`, and `mouseleave` event listeners to the host element. All three handlers are optional. The directive does nothing on touch devices.

### Binding value

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `enter` | `function` | no | Handler called when the mouse enters the element (`mouseenter`) |
| `over` | `function` | no | Handler called when the mouse moves over the element (`mouseover`) |
| `leave` | `function` | no | Handler called when the mouse leaves the element (`mouseleave`) |

### Examples

```html
<!-- Full usage -->
<div v-hover="{ enter: onEnter, over: onOver, leave: onLeave }" />

<!-- Enter and leave only -->
<div v-hover="{ enter: onEnter, leave: onLeave }" />

<!-- Single handler -->
<div v-hover="{ enter: () => console.log('hovered') }" />
```

```js
// Registering the directive globally
import { vHover } from './directives/hover.js'

app.directive('hover', vHover)
```