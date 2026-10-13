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
      :clearable="isClearable()"
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
import _ from 'lodash-es'
import { ref, computed } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

function emptyModel() { return _.get(props.properties, 'default', '') }

const {
  model, label, hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl,
  helperDialog, helperContext, hasError, errorLabel, disabled,
  fill, value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit, { emptyModel })

const picker = ref(false)
const color = computed(() => model.value || 'transparent')

function isEmpty() { return !model.value }
function clear() { fill(emptyModel()) }
function onReferenceCreated(r) {
  // https://github.com/quasarframework/quasar/issues/8956
  if (r) r.$el.onclick = () => { picker.value = true }
}
function isClearable() { return _.get(props.properties, 'field.clearable', true) }

defineExpose({
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError,
  color, picker, onReferenceCreated, isClearable
})
</script>

<style scoped>
.k-color-field {
  background-color: v-bind(color);
  height: 16px;
  border-radius: 5px;
}
</style>
