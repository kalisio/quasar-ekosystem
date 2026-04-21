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
  </q-select>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, inject } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const select = ref(null)
const options = ref([])

// Inject a search function: (serviceConfig, pattern) => Promise<items[]>
const search = inject('search', async () => [])

const multiple = computed(() => _.get(props.properties, 'field.multiple', false))

function emptyModel () { return multiple.value ? [] : null }
const field = useField(props, emit, { emptyModel })
const { model, label, hasError, errorLabel, hasFocus, disabled, onChanged } = field

function isEmpty () { return multiple.value ? _.isEmpty(model.value) : _.isNil(model.value) }
function clear () { model.value = _.get(props.properties, 'default', emptyModel()) }

async function onSearch (pattern, update, abort) {
  if (pattern.length < 2) { abort(); return }
  const serviceConfig = {
    service: _.get(props.properties, 'field.service'),
    field: _.get(props.properties, 'field.propertyField'),
    baseQuery: _.get(props.properties, 'field.baseQuery')
  }
  const results = await search(serviceConfig, pattern)
  update(() => {
    const valueField = _.get(props.properties, 'field.propertyField')
    const descriptionField = _.get(props.properties, 'field.descriptionField', 'description')
    const newOptions = _.map(results, option => ({
      id: _.kebabCase(_.get(option, valueField)),
      value: _.get(option, valueField),
      description: _.get(option, descriptionField)
    }))
    if (multiple.value) {
      options.value = _.differenceWith(newOptions, _.castArray(model.value || []), (item1, item2) => item1.id === item2)
    } else options.value = newOptions
  })
}

function onSelected (value) {
  if (!value) model.value = emptyModel()
  options.value = []
  select.value?.updateInputValue?.('')
  onChanged()
}

defineExpose({ properties: props.properties, ...field, select, options, multiple, emptyModel, isEmpty, clear, onSearch, onSelected })
</script>
