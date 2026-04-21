<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ formattedDateTimeRange }}
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
    stack-label
  >
    <template v-slot:control>
      <div class="row q-gutter-sm full-width">
        <input
          type="datetime-local"
          :value="startValue"
          :min="minStart"
          :max="maxStart"
          @change="onStartChanged"
        />
        <input
          type="datetime-local"
          :value="endValue"
          :min="minEnd"
          :max="maxEnd"
          @change="onEndChanged"
        />
      </div>
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

const startField = computed(() => _.get(props.properties, 'field.start', 'start'))
const endField = computed(() => _.get(props.properties, 'field.end', 'end'))

function emptyModel () { return { [startField.value]: '', [endField.value]: '' } }
const field = useField(props, emit, { emptyModel })
const { model, label, hasError, errorLabel, disabled, onChanged, fill } = field

const minStart = computed(() => _.get(props.properties, 'field.minStart', ''))
const maxStart = computed(() => endValue.value || _.get(props.properties, 'field.maxStart', ''))
const minEnd = computed(() => startValue.value || _.get(props.properties, 'field.minEnd', ''))
const maxEnd = computed(() => _.get(props.properties, 'field.maxEnd', ''))

const startValue = computed(() => _.get(model.value, startField.value, ''))
const endValue = computed(() => _.get(model.value, endField.value, ''))

const formattedDateTimeRange = computed(() => {
  if (!startValue.value && !endValue.value) return ''
  return `${startValue.value} — ${endValue.value}`
})

function isEmpty () { return !startValue.value && !endValue.value }
function clear () { fill(_.get(props.properties, 'default', emptyModel())) }

function onStartChanged (event) {
  model.value = { ...emptyModel(), ...model.value, [startField.value]: event.target.value }
  onChanged()
}

function onEndChanged (event) {
  model.value = { ...emptyModel(), ...model.value, [endField.value]: event.target.value }
  onChanged()
}

defineExpose({ properties: props.properties, ...field, startValue, endValue, formattedDateTimeRange, emptyModel, isEmpty, clear, onStartChanged, onEndChanged })
</script>
