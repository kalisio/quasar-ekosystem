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
import { get } from 'lodash-es'
import { ref } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const {
  model, label, hasFocus, hasError, errorLabel, disabled,
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, onChanged, apply, submitted
} = useField(props, emit)

const showPassword = ref(true)
const autocomplete = ref(get(props.properties, 'field.autocomplete', 'on'))

// Missing: generateRandomPassword
// if (get(props.properties, 'field.suggest')) {
//   const length = get(props.properties.field.suggest, 'length', 12)
//   const rules = get(props.properties.field.suggest, 'rules', /[\w\d?-]/)
//   set(props.properties, 'default', generateRandomPassword(length, false, rules))
// }

defineExpose({ fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError, showPassword, autocomplete })
</script>
