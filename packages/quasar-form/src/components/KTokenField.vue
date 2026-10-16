<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <div v-html="text" />
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
      >
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
      </q-input>
    </div>
  </div>
</template>

<script setup>
import { get, inRange, join } from 'lodash-es'
import { ref, computed } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const {
  model, label,
  hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl, helperDialog, helperContext,
  hasFocus, hasError, errorLabel, disabled,
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit)

const fieldValues = ref([])
const fields = ref([])

const text = computed(() => model.value)
const tokenLength = computed(() => get(props.properties, 'field.tokenLength', get(props.properties, 'tokenLength', 6)))
const labelClass = computed(() => ({
  'row justify-center': true,
  'text-red': !!errorLabel.value
}))

function updateModel(index) {
  model.value = join(fieldValues.value, '')
  onChanged()
  focusNextInput(index)
}

function updateFieldRef(element, index) {
  if (element) fields.value[index] = element
}

function focusNextInput(index) {
  if (inRange(index, 0, tokenLength.value)) fields.value[index]?.select?.()
}

function clearInput(index) {
  fieldValues.value[index] = ''
}

function onKeyUp(event, index) {
  const key = event.key
  if (key === 'ArrowLeft' || key === 'Backspace') {
    focusNextInput(index - 1)
    clearInput(index - 1)
  }
  if (key === 'ArrowRight') focusNextInput(index + 1)
}

defineExpose({
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError,
  fieldValues, fields, text, tokenLength, labelClass,
  updateModel, updateFieldRef, focusNextInput, clearInput, onKeyUp
})
</script>
