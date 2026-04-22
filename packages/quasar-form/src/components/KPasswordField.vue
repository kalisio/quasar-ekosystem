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

<script>
import _ from 'lodash'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

export default {
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    return useField(props, emit)
  },
  data () {
    return {
      showPassword: true,
      autocomplete: _.get(this.properties, 'field.autocomplete', 'on')
    }
  },
  created () {
    // generate a default password if required
    // Missing: generateRandomPassword
    // if (_.get(this.properties, 'field.suggest')) {
    //   const length = _.get(this.properties.field.suggest, 'length', 12)
    //   const rules = _.get(this.properties.field.suggest, 'rules', /[\w\d?-]/)
    //   _.set(this.properties, 'default', generateRandomPassword(length, false, rules))
    // }
  }
}
</script>
