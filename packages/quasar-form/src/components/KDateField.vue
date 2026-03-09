<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
    stack-label
  >
    <template v-slot:control>
      <input
        :id="properties.name + '-field'"
        type="date"
        v-model="model"
        @change="onChanged"
      />
    </template>
  </q-field>
</template>

<script setup>
import _ from 'lodash'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const field = useField(props, emit)
const { model, label, hasError, errorLabel, disabled, onChanged, fill } = field

// Initialize to today if no value provided
if (!model.value) model.value = emptyModel()

function emptyModel () {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '/')
}
function isEmpty () { return false }
function clear () { fill(_.get(props.properties, 'default', emptyModel())) }

defineExpose({ properties: props.properties, ...field, emptyModel, isEmpty, clear })
</script>
