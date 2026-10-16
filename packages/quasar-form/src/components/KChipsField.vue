<template>
  <div>
    <div v-if="readOnly" :id="properties.name + '-field'">
      <template v-for="(chip, index) in model" :key="chipValue(chip) + '-' + index">
        <q-chip
          :icon="chipIcon(chip)"
          :color="chipColor(chip)"
          outline
          dense>
          {{chipValue(chip)}}
        </q-chip>
      </template>
    </div>
    <q-field v-else
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      :value="chips"
      :label="label"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      bottom-slots
    >
      <!-- Content -->
      <template v-slot:default>
        <div class="row items-end">
          <template v-for="(chip, index) in chips" :key="chipValue(chip) + '-' + index">
            <div class="q-pb-sm">
              <q-chip
                :id="'chip-' + index"
                class="chip"
                :icon="chipIcon(chip)"
                :color="chipColor(chip)"
                :label="chipValue(chip)"
                @remove="onChipRemoved(chip)"
                @click="onChipClicked(chip)"
                :clickable="Boolean(icon)"
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
            :after="inputActions"
            @keyup.enter="onChipAdded()"
          />
        </div>
      </template>
      <template v-if="hasHelper" v-slot:append>
        <k-action
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
    <k-icon-chooser
      ref="iconChooser"
      @icon-choosed="onIconChoosed" />
  </div>
</template>

<script setup>
import _ from 'lodash-es'
import { ref, computed, watch } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps, getIconName } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed', 'chip-clicked'])

function emptyModel() { return [] }

const {
  model, label,
  hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl, helperDialog, helperContext,
  hasFocus, hasError, errorLabel, disabled,
  value, isEmpty, clear, updateValue, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit, { emptyModel })

const icon = ref(_.get(props.properties, 'field.icon', true))
const input = ref('')
const chips = ref([])
const selectedChip = ref(null)

watch(model, (newModel) => {
  chips.value = newModel ? newModel.slice() : []
})

const inputActions = computed(() => {
  const actions = []
  const index = icon.value
    ? _.findIndex(chips.value, { value: input.value })
    : _.findIndex(chips.value, input.value)
  if (index === -1) {
    actions.push({ icon: 'send', content: true, handler: () => onChipAdded() })
  }
  actions.push({ icon: 'cancel', content: true, handler: () => { input.value = '' } })
  return actions
})

function fill(val) {
  model.value = val
  chips.value = val ? val.slice() : []
}

function chipIcon(chip) {
  return icon.value ? getIconName(chip) : undefined
}

function chipColor(chip) {
  return icon.value ? _.get(chip, 'icon.color', 'dark') : 'dark'
}

function chipValue(chip) {
  return icon.value ? chip.value || chip.name : chip
}

function onChipAdded() {
  const chip = icon.value
    ? {
        value: input.value,
        icon: {
          name: _.get(props.properties.field, 'icon.name', ''),
          color: _.get(props.properties.field, 'icon.color', 'dark')
        }
      }
    : input.value
  chips.value.push(chip)
  input.value = ''
  updateModel()
}

function onChipRemoved(oldChip) {
  chips.value = chips.value.filter(chip => icon.value ? chip.value !== oldChip.value : chip !== oldChip)
  updateModel()
}

function onChipClicked(chip) {
  if (!icon.value) return
  selectedChip.value = chip
  // Missing Component: KIconChooser
  // iconChooser.open(chip.icon)
  emit('chip-clicked', chip)
}

// Missing Component: KIconChooser
// function onIconChoosed(icon) {
//   selectedChip.value.icon = Object.assign({}, icon)
//   updateModel()
// }

function updateModel() {
  model.value = chips.value
  onChanged()
}

defineExpose({
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, updateValue,
  chips, input, selectedChip,
  onChipAdded, onChipRemoved, onChipClicked, updateModel,
  chipIcon, chipColor, chipValue
})
</script>

<style>
.chip {
  cursor: pointer;
}
</style>
