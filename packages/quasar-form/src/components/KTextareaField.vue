<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    :model-value="model"
    :label="label"
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
  >
    <template v-slot:control>
      <q-input
        :id="properties.name + '-field'"
        type="textarea"
        v-model="model"
        :autofocus="hasFocus"
        @blur="onChanged"
        @update:model-value="onChanged"
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
const { model, label, hasError, errorLabel, hasFocus, disabled, onChanged, fill } = field

// KDK initializes model via emptyModel() = '' (not null like the base useField)
if (model.value === null) model.value = ''

function emptyModel () { return '' }
// KDK: _.isEqual(this.model, this.emptyModel()) — strict equality with ''
function isEmpty () { return model.value === '' }
function clear () { fill(_.get(props.properties, 'default', '')) }

defineExpose({ properties: props.properties, ...field, emptyModel, isEmpty, clear })
</script>
