<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-chip dense>{{ model }}</q-chip>
  </div>
  <q-select v-else
    ref="select"
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :multiple="multiple"
    autocomplete="off"
    hide-dropdown-icon
    emit-value
    use-input
    clearable
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
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        color="primary"
        text-color="white"
      >
        {{ scope.opt }}
      </q-chip>
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="scope.opt.id"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.value }}</q-item-label>
          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <k-action
        :id="properties.name + '-helper'"
        :label="helperLabel"
        :icon="helperIcon"
        :tooltip="helperTooltip"
        :url="helperUrl"
        :dialog="helperDialog"
        :context="helperContext"
        @dialog-confirmed="onHelperDialogConfirmed"
        color="primary"
      />
    </template>
  </q-select>
</template>

<script setup>
import { castArray, differenceWith, get, isEmpty, isNil, kebabCase, map } from 'lodash-es'
import { ref, computed, inject } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const search = inject('search', async () => [])

function emptyModel() {
  return get(props.properties, 'field.multiple', false) ? [] : null
}

const {
  model, label, hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl,
  helperDialog, helperContext, hasFocus, hasError, errorLabel, disabled,
  fill, value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit, { emptyModel })

const select = ref(null)
const options = ref([])

const multiple = computed(() => get(props.properties, 'field.multiple', false))

function isEmpty() {
  return multiple.value ? isEmpty(model.value) : isNil(model.value)
}
function clear() {
  model.value = get(props.properties, 'default', emptyModel())
}

async function onSearch(pattern, update, abort) {
  if (pattern.length < 2) { abort(); return }
  const serviceConfig = {
    service: get(props.properties, 'field.service'),
    field: get(props.properties, 'field.propertyField'),
    baseQuery: get(props.properties, 'field.baseQuery')
  }
  const results = await search(serviceConfig, pattern)
  update(() => {
    const valueField = get(props.properties, 'field.propertyField')
    const descriptionField = get(props.properties, 'field.descriptionField', 'description')
    const newOptions = map(results, option => ({
      id: kebabCase(get(option, valueField)),
      value: get(option, valueField),
      description: get(option, descriptionField)
    }))
    if (multiple.value) {
      options.value = differenceWith(newOptions, castArray(model.value || []), (item1, item2) => item1.id === item2)
    } else options.value = newOptions
  })
}
function onSelected(val) {
  if (!val) model.value = emptyModel()
  options.value = []
  select.value?.updateInputValue?.('')
  onChanged()
}

defineExpose({
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError,
  model, options, multiple, onSearch, onSelected
})
</script>
