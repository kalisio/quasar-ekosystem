---
title: KForm
description: JSON Schema-driven form component.
---

# KForm

Renders a form from a JSON Schema. Each property in the schema is mapped to a field component automatically.

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | `string \| object` | — | JSON Schema or schema name registered in the schema registry |
| `values` | `object` | `null` | Initial values to fill the form with |
| `filter` | `string \| array` | `null` | Limits the rendered fields to the listed property names |
| `dense` | `boolean` | `false` | Passes dense mode to all field components |
| `readOnly` | `boolean` | `false` | Passes read-only mode to all field components |

## Exposed API

### fill

#### Signature

```js
form.fill(values)
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `values` | `object` | Key/value map of field names to set |

### clear

#### Signature

```js
form.clear()
```

Resets all fields to their empty value.

### values

#### Signature

```js
const data = form.values()
```

#### Returns

| Type | Description |
|------|-------------|
| `object` | Current field values (required empty fields are excluded) |

### validate

#### Signature

```js
const { isValid, values } = form.validate()
```

#### Returns

| Name | Type | Description |
|------|------|-------------|
| `isValid` | `boolean` | `true` when all fields pass validation |
| `values` | `object` | Current field values at time of validation |

### apply

#### Signature

```js
await form.apply(object)
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `object` | `object` | Target object to write field values into |

### submitted

#### Signature

```js
await form.submitted(object)
```

Calls each field's post-submit hook (e.g. file upload). Same parameter as `apply`.

### getField

#### Signature

```js
const fieldRef = form.getField(name)
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `name` | `string` | Property name of the field to retrieve |

#### Returns

| Type | Description |
|------|-------------|
| `object` | The field descriptor including its component reference |

### isReady

`ref<boolean>` — `true` once all field components have mounted.

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `form-ready` | — | Emitted once all fields have been mounted |
| `field-changed` | `(name, value)` | Emitted by any field when its value changes |

## Usage

### Examples

```vue
<KForm :schema="schema" :values="initialValues" ref="form" @form-ready="onReady" />
```

```js
const form = ref(null)

// fill from existing object
form.value.fill({ name: 'Alice', age: 30 })

// read values
const data = form.value.values()

// validate before submit
const { isValid, values } = form.value.validate()
if (isValid) await form.value.apply(myObject)
```

### Schema format

Each property in the schema can carry a `field` key that controls how it is rendered:

```json
{
  "$id": "user",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "field": { "component": "KTextField", "label": "fields.name" }
    },
    "role": {
      "type": "string",
      "field": { "component": "KRoleField" }
    }
  },
  "required": ["name"]
}
```

When `field.component` is omitted the form picks a default based on the JSON Schema type:

| Type | Default component |
|------|------------------|
| `string` | `KTextField` |
| `integer` / `number` | `KNumberField` |
| `boolean` | `KToggleField` |
