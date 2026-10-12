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
    :input-class="inputClass()"
    clearable
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    :autofocus="hasFocus"
    bottom-slots
    :debounce="debounce"
    @blur="onChanged"
    @update:model-value='onChanged'
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
</template>

<script setup>
import _ from 'lodash-es'
import { computed } from 'vue'
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

const text = computed(() => {
  if (_.startsWith(model.value, 'http://') || _.startsWith(model.value, 'https://')) {
    return `<a href='${model.value}' target="_blank">${model.value}</a>`
  }
  return model.value
})

const debounce = computed(() => _.get(props.properties, 'field.debounce', 0))

function inputClass() {
  return _.get(props.properties, 'field.inputClass', 'text-weight-regular')
}

defineExpose({ fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError })
</script>
