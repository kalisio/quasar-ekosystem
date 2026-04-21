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
  />
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const files = ref(null)
const multiple = computed(() => _.get(props.properties, 'field.multiple', false))

function emptyModel () { return multiple.value ? [] : null }
const field = useField(props, emit, { emptyModel })
const { model, label, hasError, errorLabel, disabled, onChanged } = field
const isModelEmpty = computed(() => _.isEmpty(model.value))
const displayName = computed(() => {
  if (_.isArray(model.value)) return _.map(model.value, 'name').join(', ')
  return _.get(model.value, 'name', '')
})
const acceptedTypes = computed(() => _.get(props.properties, 'field.mimeTypes', ''))
const maxFiles = computed(() => _.get(props.properties, 'field.maxFiles', multiple.value ? 9 : 1))
const maxFileSize = computed(() => _.get(props.properties, 'field.maxFileSize', 1048576))
const maxTotalSize = computed(() => _.get(props.properties, 'field.maxTotalSize', maxFileSize.value))
const isClearable = computed(() => _.get(props.properties, 'field.clearable', true))

function isEmpty () { return _.isEmpty(model.value) }
function clear () { field.fill(_.get(props.properties, 'default', emptyModel())) }

function onFileCleared () {
  files.value = null
  model.value = emptyModel()
  onChanged()
}

function onFilesChanged () {
  if (_.isEmpty(files.value)) {
    model.value = emptyModel()
    return
  }
  const selectedFiles = multiple.value ? files.value : [files.value]
  const result = selectedFiles.map(file => ({ name: file.name, type: file.type, File: file }))
  model.value = multiple.value ? result : _.get(result, '0', null)
  onChanged()
}

function filterSelectedFiles (files) {
  const filter = _.get(props.properties, 'field.filter')
  if (!filter) return files
  return _.filter(files, file => file.name.includes(filter))
}

function onFileRejected () {
  // Rejection is handled by Quasar's built-in messages
}

defineExpose({ properties: props.properties, ...field, files, multiple, isModelEmpty, displayName, acceptedTypes, maxFiles, maxFileSize, maxTotalSize, isClearable, emptyModel, isEmpty, clear, onFileCleared, onFilesChanged, filterSelectedFiles, onFileRejected })
</script>
