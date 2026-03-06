<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <a :href="model" target="_blank">{{ model }}</a>
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    type="url"
    v-model="model"
    :label="label"
    clearable
    @blur="onChanged"
    @update:model-value="onChanged"
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    :autofocus="hasFocus"
    bottom-slots
  />
</template>

<script setup>
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const field = useField(props, emit)
const { model, label, hasError, errorLabel, hasFocus, disabled, onChanged } = field

defineExpose({ properties: props.properties, ...field })
</script>
