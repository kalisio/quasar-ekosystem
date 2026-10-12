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

function onUpdated(val) {
  model.value = _.isNumber(val) ? val : null
  onChanged()
}

defineExpose({ fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError })
</script>
