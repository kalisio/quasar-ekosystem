<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-icon :name="iconName" :color="iconColor" />
  </div>
  <div v-else>
    <q-field
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      v-model="model"
      :label="label"
      :clearable="isClearable"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      bottom-slots
      @clear="onCleared">
      <!-- Icon name input -->
      <template v-slot:prepend>
        <q-btn
          id="icon-chooser-button"
          round
          flat
          icon="las la-icons"
          @click="showPicker = true"
        />
        <q-dialog v-model="showPicker">
          <q-card style="min-width: 320px">
            <q-card-section>
              <q-input
                v-model="pickerInput"
                label="Icon name"
                clearable
                @keyup.enter="applyPickerIcon"
              />
              <q-icon v-if="pickerInput" :name="pickerInput" size="lg" class="q-mt-sm" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="OK" color="primary" @click="applyPickerIcon" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </template>
      <!-- Content -->
      <template v-slot:default>
        <q-icon
          class="q-pt-xs"
          size="sm"
          id="choosed-icon"
          :name="iconName"
          :color="iconColor"
        />
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

const showPicker = ref(false)
const pickerInput = ref('')
const hasColor = _.get(props.properties, 'field.color', true)

const field = useField(props, emit)
const { model, label, hasError, errorLabel, disabled, fill: baseFill, onChanged } = field

const isClearable = computed(() => _.get(props.properties, 'field.clearable', true))
const iconName = computed(() => _.get(model.value, 'name', model.value || ''))
const iconColor = computed(() => _.get(model.value, 'color', 'dark'))

function emptyModel () { return hasColor ? { name: '', color: '' } : '' }
function isEmpty () { return hasColor ? !_.get(model.value, 'name') : !model.value }
function clear () { baseFill(_.get(props.properties, 'default', emptyModel())) }

function onCleared () {
  model.value = emptyModel()
  onChanged()
}

function applyPickerIcon () {
  if (!pickerInput.value) return
  model.value = hasColor
    ? { name: pickerInput.value, color: _.get(model.value, 'color', 'dark') }
    : pickerInput.value
  pickerInput.value = ''
  onChanged()
}

defineExpose({ properties: props.properties, ...field, showPicker, pickerInput, isClearable, iconName, iconColor, emptyModel, isEmpty, clear, onCleared, applyPickerIcon })
</script>
