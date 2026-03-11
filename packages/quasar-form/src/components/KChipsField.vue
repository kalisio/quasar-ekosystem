<template>
  <div>
    <div v-if="readOnly" :id="properties.name + '-field'">
      <template v-for="(chip, index) in model" :key="chipValue(chip) + '-' + index">
        <q-chip
          :icon="chipIcon(chip)"
          :color="chipColor(chip)"
          outline
          dense>
          {{ chipValue(chip) }}
        </q-chip>
      </template>
    </div>
    <q-field v-else
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      :model-value="chips"
      :label="label"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      bottom-slots>
      <!-- Content -->
      <template v-slot:default>
        <div class="row items-end">
          <template v-for="(chip, index) in chips" :key="chipValue(chip) + '-' + index">
            <div class="q-pb-sm">
              <q-chip
                :id="'chip-' + index"
                :icon="chipIcon(chip)"
                :color="chipColor(chip)"
                :label="chipValue(chip)"
                @remove="onChipRemoved(chip)"
                removable
                outline
                dense
                square />
            </div>
          </template>
          <q-input
            class="q-pl-sm col-grow"
            :for="properties.name + '-field'"
            :id="properties.name + '-field'"
            v-model="input"
            :autofocus="hasFocus"
            type="text"
            @keyup.enter="onChipAdded()"
          />
        </div>
      </template>
    </q-field>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, watch } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const icon = _.get(props.properties, 'field.icon', false)
const input = ref('')
const chips = ref([])

const field = useField(props, emit)
const { model, label, hasError, errorLabel, hasFocus, disabled, fill: baseFill, onChanged } = field

if (_.isNil(model.value)) model.value = []

// Keep chips in sync with model for all mutation paths (values prop, fill, updateModel)
watch(model, (newModel) => {
  chips.value = newModel ? newModel.slice() : []
}, { immediate: true, flush: 'sync' })

function emptyModel () { return [] }
function isEmpty () { return _.isEmpty(model.value) }
function fill (value) { baseFill(value) }
function clear () { fill(_.get(props.properties, 'default', [])) }

function chipIcon (chip) {
  return icon ? _.get(chip, 'icon.name', undefined) : undefined
}
function chipColor (chip) {
  return icon ? _.get(chip, 'icon.color', 'dark') : 'dark'
}
function chipValue (chip) {
  return icon ? (chip.value || chip.name) : chip
}

function onChipAdded () {
  const chip = icon
    ? { value: input.value, icon: { name: _.get(props.properties.field, 'icon.name', ''), color: _.get(props.properties.field, 'icon.color', 'dark') } }
    : input.value
  chips.value.push(chip)
  input.value = ''
  updateModel()
}

function onChipRemoved (oldChip) {
  chips.value = chips.value.filter(chip => icon ? chip.value !== oldChip.value : chip !== oldChip)
  updateModel()
}

function updateModel () {
  model.value = chips.value
  onChanged()
}

defineExpose({ properties: props.properties, ...field, input, chips, fill, emptyModel, isEmpty, clear, chipValue, chipIcon, chipColor, onChipAdded, onChipRemoved, updateModel })
</script>
