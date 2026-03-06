<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    type="number"
    v-model.number="model"
    :label="label"
    clearable
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    :autofocus="hasFocus"
    bottom-slot
    @blur="onChanged"
    @update:model-value="onUpdated"
  />
</template>

<script setup>
import _ from 'lodash'
import { useField, fieldProps } from '../composables/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const field = useField(props, emit)
const { model, label, hasError, errorLabel, hasFocus, disabled, onChanged } = field

function onUpdated (value) {
  model.value = _.isNumber(value) ? value : null
  onChanged()
}

defineExpose({ properties: props.properties, ...field })
</script>
