---
title: useField
description: Composable that provides common field behaviour for form field components.
---

# useField

Composable that provides reactive state and methods shared by all field components: value binding, validation, label resolution and helper slot data.

## Usage

### Signature

```js
const { model, label, fill, clear, value, validate, invalidate, onChanged } = useField(props, emit, opts)
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `props` | `object` | yes | Component props (must include the `fieldProps` shape) |
| `emit` | `function` | yes | Component emit function |
| `opts.emptyModel` | `() => any` | no | Returns the value used when the field is empty (default: `() => null`) |

### Returns

| Name | Type | Description |
|------|------|-------------|
| `model` | `ref` | The current field value |
| `label` | `computed<string>` | Resolved from `properties.field.label` or `properties.description` |
| `hasHelper` | `computed<boolean>` | `true` when `properties.field.helper` is set |
| `helperLabel` | `computed` | Helper action label |
| `helperIcon` | `computed` | Helper action icon |
| `helperTooltip` | `computed` | Helper tooltip text |
| `helperUrl` | `computed` | Helper URL |
| `helperDialog` | `computed` | Helper dialog config |
| `helperContext` | `computed` | Helper dialog context |
| `hasFocus` | `computed<boolean>` | `true` when `properties.field.focus` is set |
| `hasError` | `computed<boolean>` | `true` when the field has a validation error |
| `errorLabel` | `computed<string>` | Current error message |
| `disabled` | `computed<boolean>` | `true` when `properties.field.disabled` is set |
| `fill(value)` | `function` | Sets the model and clears any error |
| `clear()` | `function` | Resets to `properties.default` or `emptyModel()` |
| `emptyModel()` | `function` | Returns the empty value for this field type |
| `isEmpty()` | `function` | `true` when `model` equals `emptyModel()` |
| `value()` | `function` | Returns the current model value |
| `validate()` | `function` | Clears the error state |
| `invalidate(message)` | `function` | Sets an error message |
| `onChanged()` | `function` | Emits `field-changed` and enforces non-nullable behaviour |
| `apply(object, field)` | `function` | Writes `value()` into `object[field]` |
| `submitted(object, field)` | `function` | Post-submit hook (no-op by default) |
| `onHelperDialogConfirmed(ctx)` | `function` | Opens `ctx.url` if present |

### Examples

```js
import { useField } from '@kalisio/quasar-form'
import { fieldProps } from '@kalisio/quasar-form'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const { model, label, fill, clear, value, validate, invalidate, onChanged } = useField(props, emit)
```

With a custom empty value:

```js
const { model } = useField(props, emit, { emptyModel: () => [] })
```
