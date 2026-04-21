<template>
  <div>
    <div v-if="readOnly" :id="properties.name + '-field'">
      <div class="full-width k-color-field" />
    </div>
    <q-field v-else
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      :ref="onReferenceCreated"
      :label="label"
      stack-label
      v-model="model"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      :clearable="isClearable"
      bottom-slots
      @clear="model = ''">
      <!-- Control -->
      <template v-slot:control>
        <div class="full-width k-color-field" />
        <q-dialog v-model="picker">
          <q-color
            no-header
            format-model="hex"
            v-model="model"
            default-view="palette"
          />
        </q-dialog>
      </template>
    </q-field>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const picker = ref(false)

function emptyModel () { return _.get(props.properties, 'default', '') }
const field = useField(props, emit, { emptyModel })
const { model, label, hasError, errorLabel, disabled, fill } = field

const isClearable = computed(() => _.get(props.properties, 'field.clearable', true))
const color = computed(() => model.value || 'transparent')

function isEmpty () { return !model.value }
function clear () { fill(emptyModel()) }

function onReferenceCreated (ref) {
  if (ref) {
    ref.$el.onclick = () => { picker.value = true }
  }
}

defineExpose({ properties: props.properties, ...field, picker, isClearable, color, emptyModel, isEmpty, clear, onReferenceCreated })
</script>

<style scoped>
.k-color-field {
  background-color: v-bind(color);
  height: 16px;
  border-radius: 5px;
}
</style>
