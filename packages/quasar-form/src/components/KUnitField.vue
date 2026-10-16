<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-select v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :options="options"
    emit-value
    map-options
    :error="hasError"
    :error-message="errorLabel"
    :disable="disabled"
    :autofocus="hasFocus"
    bottom-slots
    @blur="onChanged"
    @update:model-value="onChanged"
  >
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="scope.opt.value"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
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
  </q-select>
</template>

<script setup>
import { filter, get, includes, isEmpty as _isEmpty } from 'lodash-es'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])
const { t } = useI18n()
const getUnits = inject('getUnits', null)

const {
  model, label, hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl,
  helperDialog, helperContext, hasFocus, hasError, errorLabel, disabled,
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit)

const options = computed(() => {
  let units
  if (getUnits) {
    units = getUnits(get(props.properties, 'field.quantity'))
    const unitsFilter = get(props.properties, 'field.filter', [])
    if (!_isEmpty(unitsFilter)) units = filter(units, unit => includes(unitsFilter, unit.name))
    return units.map(unit => ({ value: unit.name, label: t(get(unit, 'label', '')) }))
  }
  units = get(props.properties, 'field.options', [])
  return units.map(unit => ({ value: unit.value ?? unit.name, label: t(get(unit, 'label', '')) }))
})

defineExpose({
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError,
  options
})
</script>
