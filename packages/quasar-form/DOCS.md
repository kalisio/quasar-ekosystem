# quasar-form

## Quick start

`quasar-form` generates a complete form UI from a JSON Schema — fields, labels, validation, layout — with a single component.

**1. Initialize AJV once at app startup**
```js
import { schemaRegistry } from 'quasar-form'
schemaRegistry.initialize()
```

**2. Drop `KForm` in a template** — it renders all fields defined in the schema
```html
<KForm schema="user-create" :values="user" ref="form" @field-changed="onChange" />
```

**3. On submit, validate and read the values**
```js
const { isValid, values } = form.value.validate()
if (isValid) await api.save(values)
```

---

## JSON Schema format

```json
{
  "$id": "user-create",
  "type": "object",
  "required": ["name", "role"],
  "properties": {
    "name":  { "type": "string", "field": { "component": "KTextField", "label": "Name" } },
    "email": { "type": "string", "field": { "component": "KEmailField", "label": "Email" } },
    "score": { "type": "number", "field": { "component": "KSliderField", "min": 0, "max": 10 } }
  }
}
```

If `field.component` is omitted, it is inferred automatically: `number`/`integer` → `KNumberField`, `boolean` → `KToggleField`, `string` → `KTextField`.

---

## KForm

**Props**: `schema` (string or object), `values`, `filter` (subset of fields), `dense`, `onSubmit`

**Events**: `field-changed(name, value)`, `form-ready`

**Exposed methods**: `fill(values)`, `clear()`, `values()`, `validate()` → `{ isValid, values }`, `getField(name)`, `isReady`

**Slot overrides**:
```html
<KForm :schema="mySchema">
  <template #before-name><h3>Identity</h3></template>
  <template #email><MyCustomEmailField /></template>
</KForm>
```

**Field groups**: fields with `"group": "advanced"` are rendered inside a `q-expansion-item`. Declare groups in `schema.groups`.

---

## Field components

| Component | Notable `field` options |
|---|---|
| `KTextField` | — |
| `KEmailField` | `mailto:` link in readOnly |
| `KUrlField` | `target=_blank` link in readOnly |
| `KPhoneField` | `tel:` link in readOnly |
| `KPasswordField` | show/hide toggle |
| `KTextareaField` | `rows` (default 3) |
| `KNumberField` | — |
| `KToggleField` | Boolean |
| `KSelectField` | `options[]`, `clearable`, `chips`, `multiselect` |
| `KOptionsField` | `options[]` — inline radio/checkbox group |
| `KDatetimeField` | `defaultOffset` (seconds from now) |
| `KDateField` | `mask` (default `YYYY/MM/DD`) |
| `KColorField` | `clearable` |
| `KSliderField` | `min`, `max`, `step`, `markers` |
| `KChipsField` | `icon: { name, color }` — Enter to add |
| `KRoleField` | `roles[]` (default `['owner','manager','member']`) |
| `KTokenField` | `tokenLength` (default 6) — OTP input |
| `KResolutionField` | 7 presets + custom; model is `{ width, height }` |
| `KItemField` | `services[]`, `multiselect` — requires `search` inject |
| `KPropertyItemField` | `service`, `propertyField`, `baseQuery` — requires `search` inject |
| `KUnitField` | `quantity`, `filter[]` — requires `getUnits` inject |
| `KFileField` | `multiple`, `mimeTypes`, `maxFiles`, `maxFileSize`, `maxTotalSize`, `clearable` |
| `KTagField` | `services[]`, `multiselect`, `minCharsToSearch`, `minLength`, `maxLength`, `service`, `property` — requires `search` and `createTag` injects |
| `KIconField` | `color` (default `true`), `clearable` — opens an inline picker dialog |
| `KColorScaleField` | `options[]` — each option is `{ label, value: { colors[] } }`; renders gradient bars |
| `KDateTimeRangeField` | `start` (default `'start'`), `end` (default `'end'`), `minStart`, `maxStart`, `minEnd`, `maxEnd` |

---

## Dependency injection

Some fields require functions injected in the component tree:

```js
// For KItemField and KPropertyItemField
provide('search', async (services, pattern) => { /* query Feathers */ })

// For KUnitField
provide('getUnits', (quantity) => unitsStore.getUnits(quantity))

// For KTagField — search returns tag objects { name, color }
provide('search', async (services, pattern) => { /* query tags service */ })
// For KTagField — creates a new tag object in the backend
provide('createTag', async (tag) => { /* POST to tags service */ })
```

Without injection, these components render without errors but without data.

---

## Bugs surfaced by tests (comparison with KDK)

Test coverage revealed several divergences between KDK and this library, some of which expose bugs in the original KDK.

### Bugs in the original KDK

**KFileField** — `onFilesChanged`: in the file-reading loop, the `try/catch` block ends with `} this.error = 'KFileField.INVALID_FILE_TYPE'` without an `else`. The error is therefore always overwritten after each successfully read file. Fixed here: the error is never set on valid files.

**KPropertyItemField** — `onSelected`: when the value is truthy, the method does not explicitly update `this.model` (it assumes `v-model` on `q-select` with `emit-value` already did it). This implicit behaviour is confusing and can lead to desynchronisation. Here, `v-model="model"` handles updates directly, which is more explicit.

**KChipsField** — `icon` defaults to `true` in KDK: with string chips, `chipValue(chip)` returns `chip.value || chip.name`, i.e. `undefined || undefined`, making chips invisible. In `quasar-form` the default is `false` (text chips) to avoid this silent failure. Pass `field.icon: true` explicitly to enable icon mode.

**KSelectField** — `noOption` template: the KDK template uses `typeof this.properties.field.noOption === 'string'` directly, which references `this` (Options API syntax). In `quasar-form`, `noOption` and `hasNoOption` are properly exposed `computed` refs.

### Intentional architectural differences

| Component | KDK | quasar-form | Reason |
|---|---|---|---|
| `KChipsField` | `icon` default `true` | `icon` default `false` | Avoids `chipValue` → `undefined` with text chips |
| `KTokenField` | `properties.tokenLength` | `properties.field.tokenLength` | Consistency with the `field.*` convention in quasar-form |
| `KIconField` | Opens `KIconChooser` | Opens a simple `q-dialog` | No KDK dependency; emits `chip-clicked` for external integration |
| `KChipsField` | Opens `KIconChooser` on click | Emits `chip-clicked` | Same principle; the integrator can provide their own picker |
| `KDatetimeField` | `KDateTime` component | `<input type="datetime-local">` | No KDK dependency |
| `KDateField` | `KDate` component + moment.js | `<input type="date">` | No KDK dependency |
| `KColorScaleField` | `KColorScale` component | CSS `linear-gradient` | Equivalent visual output without dependency |
| `KDateTimeRangeField` | `KDateTimeRange` component | Two `<input type="datetime-local">` | Same model value `{ start, end }` |
| `KFileField` | `Reader` + `Storage` (upload) | Selection only; upload via `apply`/`submitted` to implement | No KDK dependency |
| `KTagField` | `api.getService` + `Search` | `inject('search')` + `inject('createTag')` | Same pattern as `KItemField` |
