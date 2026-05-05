---
title: quasar-form
description: JSON Schema-driven form builder for Quasar
---

# quasar-form

_JSON Schema-driven form builder for Quasar_

## Overview

**quasar-form** generates Quasar forms automatically from a [JSON Schema](https://json-schema.org). Given a schema, `KForm` introspects each property, selects the appropriate field component, enforces validation rules, and exposes a simple API to fill, read and validate the form values.

It is organized around 3 modules:

- [components](#components) — `KForm` and a library of 27 field types
- [composables](#composables) — `useSchema` and `useField` for reusable field logic
- [utilities](#utilities) — schema registry and field helpers

### Components

#### KForm

`KForm` is the main component. It takes a JSON Schema as input and renders all declared properties as the appropriate field components:

```vue
<KForm :schema="userSchema" ref="form" />
```

```js
const userSchema = {
  $id: 'user',
  type: 'object',
  properties: {
    name: { type: 'string', field: { component: 'KTextField' } },
    age:  { type: 'integer', minimum: 0 }
  },
  required: ['name']
}
```

The `field.component` property in each schema property selects which field component to render. When omitted, **quasar-form** picks a default based on the JSON Schema type:

| JSON Schema type | Default component |
|---|---|
| `string` | `KTextField` |
| `integer` / `number` | `KNumberField` |
| `boolean` | `KToggleField` |

`KForm` exposes the following methods:

| Method | Description |
|---|---|
| `fill(values)` | Distributes values to matching fields |
| `values()` | Returns the current field values as an object |
| `validate()` | Validates the form against the schema and returns `{ isValid, errors }` |
| `apply(object)` | Writes the current values into a target object |
| `clear()` | Resets all fields |

#### Field components

The following field components are available:

| Component | Description |
|---|---|
| `KTextField` | Single-line text input |
| `KTextareaField` | Multi-line text input |
| `KNumberField` | Numeric input with optional unit |
| `KPasswordField` | Password input with visibility toggle |
| `KEmailField` | Email address input |
| `KPhoneField` | Phone number input |
| `KUrlField` | URL input |
| `KDateField` | Date picker |
| `KDatetimeField` | Date and time picker |
| `KDateTimeRangeField` | Date and time range picker |
| `KColorField` | Color picker |
| `KColorScaleField` | Color scale picker |
| `KToggleField` | Boolean toggle |
| `KSliderField` | Numeric slider |
| `KSelectField` | Single-value select |
| `KOptionsField` | Multi-value option selector |
| `KIconField` | Icon picker |
| `KFileField` | File upload |
| `KChipsField` | Free-form chip list |
| `KTagField` | Tag selector |
| `KTokenField` | Token input |
| `KItemField` | Item selector backed by a service |
| `KPropertyItemField` | Key/value property editor |
| `KRoleField` | Role selector |
| `KResolutionField` | Resolution selector |
| `KUnitField` | Value with unit selector |

All field components are automatically registered into the `@kalisio/quasar-core` registry when the package is imported.

### Composables

| Composable | Description |
|---|---|
| `useSchema()` | Compiles a JSON Schema with AJV and returns a `validate` function and a reactive `schema` ref |
| `useField()` | Provides common field behaviour: value binding, validation state, label and tooltip resolution |

### Utilities

| Export | Description |
|---|---|
| `schemaRegistry` | AJV-based registry for compiling and caching JSON Schema validators |
| `fieldProps` | Shared prop definitions reused across all field components |
| `makeDiacriticPattern(str, options?)` | Builds a regex pattern that matches a string regardless of diacritics |
| `getIconName(icon, field?)` | Resolves an icon descriptor to a string icon name |

## Installation

Install with your preferred package manager:

::: code-group

```bash [pnpm]
pnpm add @kalisio/quasar-form
```

```bash [npm]
npm install @kalisio/quasar-form
```

```bash [yarn]
yarn add @kalisio/quasar-form
```

:::
