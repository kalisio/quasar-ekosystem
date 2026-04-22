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
  methods: {
    options () {
      const options = _.get(this.properties, 'field.options', [])
      return options.map(option => {
        // Check if we have a translation key or directly the label content
        const label = _.get(option, 'label', '')
        return Object.assign({}, option, { label: this.$t(label) })
      })
    },
    selectedClass () {
      return _.get(this.properties, 'field.selectedClass', 'text-weight-regular')
    }
  }
}
</script>
