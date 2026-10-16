<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip v-if="!multiple && model?.name">
      {{ model.name }}
    </q-chip>
    <q-chip v-else
      v-for="file in model"
      :key="file.name"
      icon="las la-cloud-upload-alt"
    >
      {{ file.name }}
    </q-chip>
  </div>
  <!-- -->
  <q-field v-else-if="!isModelEmpty"
    :for="properties.name + '-field'"
    v-model="model"
    :label="label"
    clearable
    @clear="onFileCleared"
    :disable="disabled"
  >
    <template v-slot:control>
      {{ displayName }}
    </template>
  </q-field>
  <q-file v-else
    :for="properties.name + '-field'"
    v-model="files"
    :label="label"
    :accept="acceptedTypes"
    :filter="filterSelectedFiles"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
    :disable="disabled"
    :multiple="multiple"
    :append="multiple"
    :use-chips="true"
    :clearable="isClearable"
    :max-files="maxFiles"
    :max-file-size="maxFileSize"
    :max-total-size="maxTotalSize"
    @update:model-value="onFilesChanged"
    @rejected="onFileRejected"
  >
    <template v-if="hasHelper" v-slot:append>
      <KAction
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
  </q-file>
</template>

<script setup>
import { filter, get, isArray, isEmpty as _isEmpty, map } from 'lodash-es'
import { ref, computed } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

function emptyModel() {
  return get(props.properties, 'field.multiple', false) ? [] : null
}

const {
  model, label, hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl,
  helperDialog, helperContext, hasError, errorLabel, disabled,
  fill, value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit, { emptyModel })

const files = ref(null)

const multiple = computed(() => get(props.properties, 'field.multiple', false))
const isModelEmpty = computed(() => _isEmpty(model.value))
const displayName = computed(() => {
  if (isArray(model.value)) return map(model.value, 'name').join(', ')
  return get(model.value, 'name', '')
})
const acceptedTypes = computed(() => get(props.properties, 'field.mimeTypes', ''))
const maxFiles = computed(() => get(props.properties, 'field.maxFiles', multiple.value ? 9 : 1))
const maxFileSize = computed(() => get(props.properties, 'field.maxFileSize', 1048576))
const maxTotalSize = computed(() => get(props.properties, 'field.maxTotalSize', maxFileSize.value))
const isClearable = computed(() => get(props.properties, 'field.clearable', true))

function isEmpty() { return _isEmpty(model.value) }
function clear() { fill(get(props.properties, 'default', emptyModel())) }

function onFileCleared() {
  files.value = null
  model.value = emptyModel()
  onChanged()
}
async function onFilesChanged() {
  if (_isEmpty(files.value)) {
    model.value = emptyModel()
    return
  }
  const selectedFiles = multiple.value ? files.value : [files.value]
  const result = []
  for (const file of selectedFiles) {
    result.push({ name: file.name, type: file.type, File: file })
  }
  if (multiple.value) model.value = result
  else model.value = get(result, '0', null)
  onChanged()
}
function filterSelectedFiles(fileList) {
  const filterStr = get(props.properties, 'field.filter')
  if (!filterStr) return fileList
  return filter(fileList, file => file.name.includes(filterStr))
}
function onFileRejected(errs) {}

defineExpose({
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError,
  files, multiple, isModelEmpty, displayName, acceptedTypes, maxFiles, maxFileSize, maxTotalSize, isClearable,
  onFileCleared, onFilesChanged, filterSelectedFiles, onFileRejected
})
</script>
