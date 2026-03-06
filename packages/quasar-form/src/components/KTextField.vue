<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <div v-html="text" />
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    type="text"
    v-model="model"
    :label="label"
    :input-class="inputClass"
    clearable
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    :autofocus="hasFocus"
    bottom-slots
    :debounce="debounce"
    @blur="onChanged"
    @update:model-value="onChanged"
  />
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { useField, fieldProps } from '../composables/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const field = useField(props, emit)
const { model, label, hasError, errorLabel, hasFocus, disabled, onChanged } = field

const text = computed(() => {
  if (_.startsWith(model.value, 'http://') || _.startsWith(model.value, 'https://')) {
    return `<a href='${model.value}' target="_blank">${model.value}</a>`
  }
  return model.value
})
const debounce = computed(() => _.get(props.properties, 'field.debounce', 0))
const inputClass = computed(() => _.get(props.properties, 'field.inputClass', 'text-weight-regular'))

defineExpose({ properties: props.properties, ...field })
</script>
