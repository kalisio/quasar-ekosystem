---
title: useSchema
description: Composable for compiling and validating JSON Schemas with AJV.
---

# useSchema

Composable for compiling a JSON Schema with AJV and validating values against it. Used internally by `KForm`.

## Usage

### Signature

```js
const { schema, compile, validate } = useSchema()
```

### Returns

| Name | Type | Description |
|------|------|-------------|
| `schema` | `readonly ref<object>` | The compiled schema object |
| `compile(schemaOrName, filter?)` | `async function` | Compiles the schema; `filter` is a comma-separated string or array of property names to keep |
| `validate(values)` | `function` | Validates `values` against the schema; returns `{ isValid, errors }` |

### Examples

```js
import { useSchema } from '@kalisio/quasar-form'

const { schema, compile, validate } = useSchema()

await compile('user')               // load from @schemas/user.json
await compile(mySchemaObject)       // pass inline
await compile('user', 'name,role')  // filter to specific properties

const { isValid, errors } = validate({ name: 'Alice' })
```
