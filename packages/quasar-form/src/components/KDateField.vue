<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ formattedDate }}
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
      <!-- Missing Component: KDate -->
      <!-- <KDate v-model="model" v-bind="fieldProps" dense @update:modelValue="onChanged" /> -->
      <input
        :id="properties.name + '-field'"
        type="date"
        v-model="model"
        @change="onChanged"
      />
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
  return new Date().toISOString().slice(0, 10).replace(/-/g, '/')
}

const {
  model, label, hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl,
  helperDialog, helperContext, hasFocus, hasError, errorLabel, disabled,
  fill, value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit, { emptyModel })

const formattedDate = computed(() => model.value)

function isEmpty () { return false }
function clear () { fill(get(props.properties, 'default', emptyModel())) }

defineExpose({ fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError })
</script>
