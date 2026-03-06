<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip dense :icon="model ? 'las la-check' : 'las la-ban'" :color="model ? 'positive' : 'negative'" />
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    borderless
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
  >
    <template v-slot:control>
      <q-toggle
        :id="properties.name + '-field'"
        v-model="model"
        @blur="onChanged"
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

// Booleans are never "empty" — default is false, not null
if (_.isNil(model.value)) model.value = false
function emptyModel () { return false }
function isEmpty () { return false }
function clear () { fill(_.get(props.properties, 'default', false)) }

defineExpose({ properties: props.properties, ...field, emptyModel, isEmpty, clear })
</script>
