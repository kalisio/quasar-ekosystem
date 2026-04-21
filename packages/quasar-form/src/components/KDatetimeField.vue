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
        type="datetime-local"
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

function emptyModel () {
  const offset = _.get(props.properties, 'field.defaultOffset', 0)
  return new Date(Date.now() + offset * 1000).toISOString()
}
const field = useField(props, emit, { emptyModel })
const { model, label, hasError, errorLabel, disabled, onChanged, fill } = field

function isEmpty () { return false }
function clear () { fill(_.get(props.properties, 'default', emptyModel())) }

defineExpose({ properties: props.properties, ...field, emptyModel, isEmpty, clear })
</script>
