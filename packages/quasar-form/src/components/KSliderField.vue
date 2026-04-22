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
    function emptyModel () {
      return _.get(props.properties, 'field.min', 0)
    }
    return { ...useField(props, emit, { emptyModel }), emptyModel }
  },
  computed: {
    min () {
      return _.get(this.properties, 'field.min', 0)
    },
    max () {
      return _.get(this.properties, 'field.max', 100)
    },
    step () {
      return _.get(this.properties, 'field.step', 1)
    },
    markers () {
      return _.get(this.properties, 'field.markers', false)
    }
  },
  methods: {
    isEmpty () {
      return this.model === null
    },
    clear () {
      this.fill(_.get(this.properties, 'default', this.min))
    }
  }
}
</script>
