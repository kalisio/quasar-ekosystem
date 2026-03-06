<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    :type="showPassword ? 'password' : 'text'"
    v-model="model"
    :label="label"
    clearable
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    :autofocus="hasFocus"
    bottom-slots
    :autocomplete="autocomplete"
    @blur="onChanged"
    @update:model-value="onChanged"
  >
    <template v-slot:append>
      <q-icon
        :id="properties.name + '-field-visibility'"
        :name="showPassword ? 'visibility_off' : 'visibility'"
        class="q-pl-md cursor-pointer"
        @click="showPassword = !showPassword"
      />
    </template>
  </q-input>
</template>

<script setup>
import _ from 'lodash'
import { ref } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const showPassword = ref(true)
const autocomplete = _.get(props.properties, 'field.autocomplete', 'on')

const field = useField(props, emit)
const { model, label, hasError, errorLabel, hasFocus, disabled, onChanged } = field

defineExpose({ properties: props.properties, ...field, showPassword })
</script>
