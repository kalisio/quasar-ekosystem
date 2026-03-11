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
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

function options () {
  return _.map(_.get(props.properties, 'field.options', []), option => {
    return Object.assign({}, option, { label: useI18n().t(_.get(option, 'label', '')) })
  })
}

function selectedClass () {
  return _.get(props.properties, 'field.selectedClass', 'text-weight-regular')
}

const field = useField(props, emit)
const { model, label, hasError, errorLabel, disabled, onChanged } = field

defineExpose({ properties: props.properties, ...field, options, selectedClass })
</script>
