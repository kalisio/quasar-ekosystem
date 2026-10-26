<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <KChip v-bind="model" :label="model.name" />
  </div>
  <q-select v-else
    ref="select"
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="items"
    :label="label"
    :multiple="properties.multiselect"
    autocomplete="off"
    hide-dropdown-icon
    use-input
    :clearable="isClearable"
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    :autofocus="hasFocus"
    bottom-slots
    :options="options"
    @filter="onSearch"
    @update:model-value="onSelected">
    <!-- Value display -->
    <template v-slot:selected-item="scope">
      <KChip v-bind="scope.opt" :label="scope.opt.name" square removable @remove="scope.removeAtIndex(scope.index)" />
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section v-if="scope.opt.create" class="col-auto">
          {{ scope.opt.name }}
        </q-item-section>
        <q-item-section v-else>
          <KChip v-bind="scope.opt" :label="scope.opt.name" />
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { clone, defaults, differenceWith, filter, find, get, isArray, isEmpty as _isEmpty, isNil, kebabCase } from 'lodash-es'
import { ref, computed, watch, inject } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

// Missing Mixin: baseField
// mixins: [baseField],

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

// Inject search and create functions — consumers must provide these via provide()
const search = inject('search', async () => [])
const createTag = inject('createTag', async () => null)

function emptyModel () { return props.properties.multiselect ? [] : null }

const {
  model, label, hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl,
  helperDialog, helperContext, hasFocus, hasError, errorLabel, disabled,
  value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit, { emptyModel })

const select = ref(null)
const items = ref(null)
const options = ref([])
const searchString = ref('')

watch(model, (newModel) => {
  if (newModel) items.value = clone(newModel)
  else items.value = props.properties.multiselect ? [] : null
}, { immediate: true, flush: 'sync' })

const isClearable = computed(() => get(props.properties, 'field.clearable', true))

function getId (item) { return kebabCase(item.name) }
function isEmpty () {
  return props.properties.multiselect ? _isEmpty(model.value) : isNil(model.value)
}
function fill (newValue) {
  model.value = newValue
  onChanged()
}
function clear () {
  fill(get(props.properties, 'default', emptyModel()))
}
// Missing Component: KPanel
// getActions (item) {
//   if (item.scope !== 'user') return []
//   return [{ ... }]
// },
async function onSearch (pattern, update, abort) {
  if (pattern.length < get(props.properties, 'minCharsToSearch', 2)) {
    abort()
    return
  }
  searchString.value = pattern
  const results = await search(get(props.properties, 'services', []), pattern)
  update(() => {
    if (props.properties.multiselect) {
      options.value = differenceWith(results, items.value || [], (a, b) => a.name === b.name && a.color === b.color)
    } else options.value = results

    const hasInvalidMinLength = pattern.length < get(props.properties, 'minLength', 0)
    const hasInvalidMaxLength = pattern.length > get(props.properties, 'maxLength', 256)
    if (hasInvalidMinLength || hasInvalidMaxLength) return
    options.value = filter(options.value, item => !item.create)
    if (pattern !== '' && !find(results, { name: pattern })) {
      options.value.push({ name: pattern, color: 'grey', create: true })
    }
  })
}
async function onSelected (val) {
  if (val) model.value = items.value
  else model.value = emptyModel()
  options.value = []
  select.value?.updateInputValue?.('')
  onChanged()

  if (!model.value) return
  const tagList = isArray(model.value) ? model.value : [model.value]
  for (const item of tagList) {
    if (item.create) {
      const hasInvalidMinLength = item.name.length < get(props.properties, 'minLength', 0)
      const hasInvalidMaxLength = item.name.length > get(props.properties, 'maxLength', 256)
      if (hasInvalidMinLength || hasInvalidMaxLength) return
      defaults(item, {
        service: get(props.properties, 'field.service'),
        property: get(props.properties, 'field.property'),
        scope: 'user',
        color: 'grey',
        description: ''
      })
      delete item.create
      await createTag(item)
    }
  }
}

defineExpose({ fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError, getId, isClearable, items, onSearch, onSelected, options })
</script>
