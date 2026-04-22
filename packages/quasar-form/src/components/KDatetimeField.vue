<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ formattedDateTime }}
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
      <!-- Missing Component: KDateTime -->
      <!-- <KDateTime v-model="model" v-bind="fieldProps" dense @update:modelValue="onChanged" /> -->
      <input
        :id="properties.name + '-field'"
        type="datetime-local"
        v-model="model"
        @change="onChanged"
      />
    </template>
    <!-- Helper -->
    <!-- Missing Component: KAction -->
    <!--
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
    -->
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
      const offset = _.get(props.properties, 'field.defaultOffset', 0)
      return new Date(Date.now() + offset * 1000).toISOString()
    }
    return { ...useField(props, emit, { emptyModel }), emptyModel }
  },
  computed: {
    formattedDateTime () {
      return this.model
    }
  },
  methods: {
    isEmpty () {
      return false
    },
    clear () {
      this.fill(_.get(this.properties, 'default', this.emptyModel()))
    }
  }
}
</script>
