<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ formattedDateTimeRange }}
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
      <!-- Missing Component: KDateTimeRange -->
      <!-- <KDateTimeRange v-model="model" v-bind="fieldProps" dense @update:modelValue="onChanged" /> -->
      <div class="row q-gutter-sm full-width">
        <input
          type="datetime-local"
          :value="startValue"
          :min="minStart"
          :max="maxStart"
          @change="onStartChanged"
        />
        <input
          type="datetime-local"
          :value="endValue"
          :min="minEnd"
          :max="maxEnd"
          @change="onEndChanged"
        />
      </div>
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

<script>
import { get } from 'lodash-es'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

export default {
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    function emptyModel () {
      const startField = get(props.properties, 'field.start', 'start')
      const endField = get(props.properties, 'field.end', 'end')
      return { [startField]: '', [endField]: '' }
    }
    return { ...useField(props, emit, { emptyModel }), emptyModel }
  },
  computed: {
    startField () {
      return get(this.properties, 'field.start', 'start')
    },
    endField () {
      return get(this.properties, 'field.end', 'end')
    },
    startValue () {
      return get(this.model, this.startField, '')
    },
    endValue () {
      return get(this.model, this.endField, '')
    },
    minStart () {
      return get(this.properties, 'field.minStart', '')
    },
    maxStart () {
      return this.endValue || get(this.properties, 'field.maxStart', '')
    },
    minEnd () {
      return this.startValue || get(this.properties, 'field.minEnd', '')
    },
    maxEnd () {
      return get(this.properties, 'field.maxEnd', '')
    },
    formattedDateTimeRange () {
      if (!this.startValue && !this.endValue) return ''
      return `${this.startValue} — ${this.endValue}`
    }
  },
  methods: {
    isEmpty () {
      return !this.startValue && !this.endValue
    },
    clear () {
      this.fill(get(this.properties, 'default', this.emptyModel()))
    },
    onStartChanged (event) {
      this.model = { ...this.emptyModel(), ...this.model, [this.startField]: event.target.value }
      this.onChanged()
    },
    onEndChanged (event) {
      this.model = { ...this.emptyModel(), ...this.model, [this.endField]: event.target.value }
      this.onChanged()
    }
  }
}
</script>
