<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-chip :color="model.color" dense>
      {{ model.name }}
    </q-chip>
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
    @update:model-value="onSelected"
  >
    <!-- Value display -->
    <template v-slot:selected-item="scope">
      <q-chip
        square
        removable
        :color="scope.opt.color"
        :label="scope.opt.name"
        @remove="scope.removeAtIndex(scope.index)"
      />
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
          <q-chip :color="scope.opt.color" square dense :label="scope.opt.name" />
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch, inject } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const select = ref(null)
const items = ref(null)
const options = ref([])
const searchString = ref('')

// Inject search and create functions — consumers must provide these via provide()
const search = inject('search', async () => [])
const createTag = inject('createTag', async () => null)

function emptyModel () { return props.properties.multiselect ? [] : null }
const field = useField(props, emit, { emptyModel })
const { model, label, hasError, errorLabel, hasFocus, disabled, onChanged } = field

// Keep items in sync with model for all mutation paths (values prop, fill, etc.)
watch(model, (newModel) => {
  items.value = newModel ? _.clone(newModel) : (props.properties.multiselect ? [] : null)
}, { immediate: true, flush: 'sync' })

const isClearable = computed(() => _.get(props.properties, 'field.clearable', true))

function getId (item) { return _.kebabCase(item.name) }
function isEmpty () {
  return props.properties.multiselect ? _.isEmpty(model.value) : _.isNil(model.value)
}
function fill (value) { field.fill(value) }
function clear () { field.fill(_.get(props.properties, 'default', emptyModel())) }

async function onSearch (pattern, update, abort) {
  if (pattern.length < _.get(props.properties, 'minCharsToSearch', 2)) {
    abort()
    return
  }
  searchString.value = pattern
  const results = await search(_.get(props.properties, 'services', []), pattern)
  update(() => {
    if (props.properties.multiselect) {
      options.value = _.differenceWith(results, items.value || [], (a, b) => a.name === b.name && a.color === b.color)
    } else options.value = results

    const hasInvalidMinLength = pattern.length < _.get(props.properties, 'minLength', 0)
    const hasInvalidMaxLength = pattern.length > _.get(props.properties, 'maxLength', 256)
    if (hasInvalidMinLength || hasInvalidMaxLength) return
    options.value = _.filter(options.value, item => !item.create)
    if (pattern !== '' && !_.find(results, { name: pattern })) {
      options.value.push({ name: pattern, color: 'grey', create: true })
    }
  })
}

async function onSelected (value) {
  if (value) model.value = items.value
  else model.value = emptyModel()
  options.value = []
  select.value?.updateInputValue?.('')
  onChanged()

  if (!model.value) return
  const tagList = _.isArray(model.value) ? model.value : [model.value]
  for (const item of tagList) {
    if (item.create) {
      const hasInvalidMinLength = item.name.length < _.get(props.properties, 'minLength', 0)
      const hasInvalidMaxLength = item.name.length > _.get(props.properties, 'maxLength', 256)
      if (hasInvalidMinLength || hasInvalidMaxLength) return
      _.defaults(item, {
        service: _.get(props.properties, 'field.service'),
        property: _.get(props.properties, 'field.property'),
        scope: 'user',
        color: 'grey',
        description: ''
      })
      delete item.create
      await createTag(item)
    }
  }
}

defineExpose({ properties: props.properties, ...field, select, items, options, isClearable, getId, emptyModel, isEmpty, fill, clear, onSearch, onSelected })
</script>
