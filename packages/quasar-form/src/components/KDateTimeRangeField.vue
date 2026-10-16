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
    <!-- Prepend icons -->
    <template v-slot:control>
      <!-- Missing Component: KDateTimeRange -->
      <!-- <KDateTimeRange v-model="model" v-bind="fieldProps" dense @update:modelValue="onChanged" /> -->
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
    <template v-if="hasHelper" v-slot:append>
      <KAction
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
  </q-field>
</template>

<script setup>
import { get } from 'lodash-es'
import { computed } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

// Missing Mixin: baseField
// mixins: [baseField],

function emptyModel () {
  const startField = get(props.properties, 'field.start', 'start')
  const endField = get(props.properties, 'field.end', 'end')
  return { [startField]: '', [endField]: '' }
}

const {
  model, label, hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl,
  helperDialog, helperContext, hasFocus, hasError, errorLabel, disabled,
  fill, value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit, { emptyModel })

const startField = computed(() => get(props.properties, 'field.start', 'start'))
const endField = computed(() => get(props.properties, 'field.end', 'end'))
const startValue = computed(() => get(model.value, startField.value, ''))
const endValue = computed(() => get(model.value, endField.value, ''))
const minStart = computed(() => get(props.properties, 'field.minStart', ''))
const maxStart = computed(() => endValue.value || get(props.properties, 'field.maxStart', ''))
const minEnd = computed(() => startValue.value || get(props.properties, 'field.minEnd', ''))
const maxEnd = computed(() => get(props.properties, 'field.maxEnd', ''))
const formattedDateTimeRange = computed(() => {
  if (!startValue.value && !endValue.value) return ''
  return `${startValue.value} — ${endValue.value}`
})

function isEmpty () { return !startValue.value && !endValue.value }
function clear () { fill(get(props.properties, 'default', emptyModel())) }
function onStartChanged (event) {
  model.value = { ...emptyModel(), ...model.value, [startField.value]: event.target.value }
  onChanged()
}
function onEndChanged (event) {
  model.value = { ...emptyModel(), ...model.value, [endField.value]: event.target.value }
  onChanged()
}

defineExpose({ fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError, startValue, endValue, formattedDateTimeRange, maxStart, minEnd, onStartChanged, onEndChanged })
</script>
