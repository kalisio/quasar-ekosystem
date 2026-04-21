<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    borderless
    :error="hasError"
    :error-message="errorLabel"
    :disable="disabled"
    bottom-slots
  >
    <template v-slot:control>
      <q-slider
        :id="properties.name + '-field'"
        v-model="model"
        :min="min"
        :max="max"
        :step="step"
        :markers="markers"
        @change="onChanged"
      />
    </template>
  </q-field>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const min = computed(() => _.get(props.properties, 'field.min', 0))
const max = computed(() => _.get(props.properties, 'field.max', 100))
const step = computed(() => _.get(props.properties, 'field.step', 1))
const markers = computed(() => _.get(props.properties, 'field.markers', false))

function emptyModel () { return min.value }
const field = useField(props, emit, { emptyModel })
const { model, label, hasError, errorLabel, disabled, fill, onChanged } = field

function isEmpty () { return model.value === null }
function clear () { fill(_.get(props.properties, 'default', min.value)) }

defineExpose({ properties: props.properties, ...field, min, max, step, emptyModel, isEmpty, clear })
</script>
