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
  </q-select>
</template>

<script setup>
import _ from 'lodash'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

// Inject a getUnits function: (quantity) => unit[] where each unit has { name, label }
// Falls back to using properties.field.options directly
const getUnits = inject('getUnits', null)

const options = computed(() => {
  const { t } = useI18n()
  let units
  if (getUnits) {
    units = getUnits(_.get(props.properties, 'field.quantity'))
    const unitsFilter = _.get(props.properties, 'field.filter', [])
    if (!_.isEmpty(unitsFilter)) units = _.filter(units, unit => _.includes(unitsFilter, unit.name))
    return units.map(unit => ({ value: unit.name, label: t(_.get(unit, 'label', '')) }))
  }
  // Fallback: use field.options directly (same format as KSelectField)
  units = _.get(props.properties, 'field.options', [])
  return units.map(unit => ({ value: unit.value ?? unit.name, label: t(_.get(unit, 'label', '')) }))
})

const field = useField(props, emit)
const { model, label, hasError, errorLabel, hasFocus, disabled, onChanged } = field

defineExpose({ properties: props.properties, ...field, options })
</script>
