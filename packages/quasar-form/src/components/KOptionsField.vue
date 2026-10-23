<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip dense />
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    :model-value="model"
    :label="label"
    borderless
    hide-bottom-space
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
  >
    <template v-slot:control>
      <q-option-group
        :id="properties.name + '-field'"
        v-model="model"
        :options="options()"
        :disable="disabled"
        :color="disabled ? 'grey-7' : 'primary'"
        @update:model-value="onChanged"
        inline
      >
        <template v-slot:label="opt">
          <span :class="model === opt.value ? selectedClass() : 'text-weight-regular'">
            {{ opt.label }}
          </span>
        </template>
      </q-option-group>
    </template>
  </q-field>
</template>

<script setup>
import { get } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])
const { t } = useI18n()

const {
  model, label, hasError, errorLabel, disabled,
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, onChanged, apply, submitted
} = useField(props, emit)

function options() {
  return get(props.properties, 'field.options', []).map(option => {
    const label = get(option, 'label', '')
    return { ...option, label: t(label) }
  })
}

function selectedClass() {
  return get(props.properties, 'field.selectedClass', 'text-weight-regular')
}

defineExpose({ fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError, options, selectedClass })
</script>
