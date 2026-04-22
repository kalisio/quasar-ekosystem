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
      return new Date().toISOString().slice(0, 10).replace(/-/g, '/')
    }
    return { ...useField(props, emit, { emptyModel }), emptyModel }
  },
  computed: {
    formattedDate () {
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
