<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <div>{{ model }}</div>
  </div>
  <div v-else class="q-pa-md">
    <p :class="labelClass">{{ label }}</p>
    <div class="row q-gutter-x-sm justify-center" :id="properties.name + '-field'">
      <q-input
        v-for="i in tokenLength"
        :key="i"
        :for="properties.name + '-field' + i"
        :id="properties.name + '-field' + i"
        type="text"
        mask="#"
        v-model="fieldValues[i - 1]"
        style="width: 5ch"
        :disable="disabled"
        :autofocus="hasFocus && i === 1"
        outlined
        :ref="el => updateFieldRef(el, i - 1)"
        @update:model-value="updateModel(i)"
        @blur="onChanged"
        @keyup="onKeyUp($event, i - 1)"
      />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const fieldValues = ref([])
const fields = ref([])

const tokenLength = computed(() => _.get(props.properties, 'field.tokenLength', 6))
const labelClass = computed(() => ({
  'row justify-center': true,
  'text-red': !!errorLabel.value
}))

const field = useField(props, emit)
const { model, label, hasError, errorLabel, hasFocus, disabled, onChanged } = field

function updateModel (index) {
  model.value = _.join(fieldValues.value, '')
  onChanged()
  focusNextInput(index)
}

function updateFieldRef (element, index) {
  if (element) fields.value[index] = element
}

function focusNextInput (index) {
  if (_.inRange(index, 0, tokenLength.value)) fields.value[index]?.select?.()
}

function clearInput (index) {
  fieldValues.value[index] = ''
}

function onKeyUp (event, index) {
  const key = event.key
  if (key === 'ArrowLeft' || key === 'Backspace') {
    focusNextInput(index - 1)
    clearInput(index - 1)
  }
  if (key === 'ArrowRight') focusNextInput(index + 1)
}

defineExpose({ properties: props.properties, ...field, fieldValues, tokenLength, labelClass, updateModel, updateFieldRef, focusNextInput, clearInput, onKeyUp })
</script>
