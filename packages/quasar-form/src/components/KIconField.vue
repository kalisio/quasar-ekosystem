<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-icon :name="model.name" :color="model.color" />
  </div>
  <div v-else>
    <q-field
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      v-model="model"
      :label="label"
      :clearable="isClearable()"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      bottom-slots
      @clear="onCleared">
      <!-- Icon chooser -->
      <template v-slot:prepend>
        <q-btn
          id="icon-chooser-button"
          round
          flat
          icon="las la-icons"
          @click="onIconClicked" />
        <k-icon-chooser
          id="icon-chooser"
          ref="iconChooser"
          :icon-set="iconSet"
          :palette="color"
        @icon-choosed="onIconChoosed" />
      </template>
      <!-- Content -->
      <template v-slot:default>
        <q-icon
          class="q-pt-xs"
          size="sm"
          id="choosed-icon"
          :name="iconName"
          :color="iconColor" />
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
  </div>
</template>

<script setup>
import { get } from 'lodash-es'
import { computed } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps, getIconName } from '../utils/index.js'
// Missing Component: KIconChooser
// import { KIconChooser } from '../input'

// Missing Component: KIconChooser
// components: { KIconChooser },
// Missing Mixin: baseField
// mixins: [baseField],

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const iconSet = get(props.properties.field, 'iconSet', 'font-awesome')
const color = get(props.properties.field, 'color', true)
const inverted = get(props.properties.field, 'inverted', false)

function emptyModel () {
  // We support icon without a color, in this case we have a string as model
  return color ? { name: '', color: '' } : ''
}

const {
  model, label, hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl,
  helperDialog, helperContext, hasFocus, hasError, errorLabel, disabled,
  fill, value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit, { emptyModel })

const hasIcon = computed(() => !isEmpty())
const iconName = computed(() => getIconName(model.value, 'name'))
const iconColor = computed(() => {
  // We support icon without a color
  return get(model.value, 'color', 'dark')
})

function isEmpty () { return color ? !get(model.value, 'name') : !model.value }
function clear () { fill(get(props.properties, 'default', emptyModel())) }
function isClearable () { return get(props.properties, 'field.clearable', true) }
function onCleared () {
  model.value = emptyModel()
  onChanged()
}
function onIconClicked () {
  // Missing Component: KIconChooser
  // this.$refs.iconChooser.open(model.value)
}
function onIconChoosed (icon) {
  // We support icon without a color, in this case we have a string as model
  // Missing Component: KIconChooser
  // model.value = (color ? Object.assign({}, icon) : icon)
  // onChanged()
}

defineExpose({ fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError, hasIcon, iconName, iconColor, isClearable, onCleared })
</script>
