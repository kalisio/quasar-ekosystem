<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-chip dense>{{ getLabel(model) }}</q-chip>
  </div>
  <q-select v-else
    ref="select"
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="items"
    :label="label"
    :multiple="multiple"
    autocomplete="off"
    hide-dropdown-icon
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
        <q-avatar v-if="getIcon(scope.opt)" :icon="getIcon(scope.opt)" color="primary" />
        {{ getLabel(scope.opt) }}
      </q-chip>
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section v-if="getIcon(scope.opt)" avatar>
          <q-icon :name="getIcon(scope.opt)" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ getLabel(scope.opt) }}</q-item-label>
          <q-item-label caption>{{ getDescription(scope.opt) }}</q-item-label>
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
import _ from 'lodash-es'
import { ref, computed, watch, inject } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const search = inject('search', async () => [])

function emptyModel() {
  return _.get(props.properties, 'multiselect', false) ? [] : null
}

const {
  model, label, hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl,
  helperDialog, helperContext, hasFocus, hasError, errorLabel, disabled,
  value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit, { emptyModel })

const select = ref(null)
const items = ref(null)
const options = ref([])

const multiple = computed(() => _.get(props.properties, 'multiselect', false))
const hasSingleService = computed(() => {
  const services = _.uniqBy(_.get(props.properties, 'services', []), 'service')
  return services.length === 1
})

watch(model, (newModel) => {
  items.value = newModel ? _.clone(newModel) : (multiple.value ? [] : null)
}, { immediate: true, flush: 'sync' })

function getServiceForItem(item) {
  return hasSingleService.value
    ? _.get(props.properties, 'services[0]')
    : _.find(_.get(props.properties, 'services', []), { service: item.service })
}
function getId(item) { return _.kebabCase(getLabel(item)) }
function getLabel(item) {
  const service = getServiceForItem(item)
  return _.get(item, service?.field || 'name', '')
}
function getDescription(item) {
  const service = getServiceForItem(item)
  return _.get(item, service?.description || 'description', '')
}
function getIcon(item) { return _.get(item, 'icon.name', _.get(item, 'icon', '')) }

function isEmpty() {
  return multiple.value ? _.isEmpty(model.value) : _.isNil(model.value)
}
function fill(val) {
  model.value = val
  onChanged()
}
function clear() {
  fill(_.get(props.properties, 'default', emptyModel()))
}

async function onSearch(pattern, update, abort) {
  if (pattern.length < 2) { abort(); return }
  const results = await search(_.get(props.properties, 'services', []), pattern)
  update(() => {
    if (multiple.value) {
      options.value = _.differenceWith(results, items.value || [], (item1, item2) => {
        return _.get(item1, item1.field) === _.get(item2, item2.field) && item1.service === item2.service
      })
    } else options.value = results
  })
}
function onSelected(val) {
  model.value = val ? items.value : emptyModel()
  options.value = []
  select.value?.updateInputValue?.('')
  onChanged()
}

defineExpose({
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError,
  items, options, multiple, hasSingleService,
  getServiceForItem, getId, getLabel, getDescription, getIcon, onSearch, onSelected
})
</script>
