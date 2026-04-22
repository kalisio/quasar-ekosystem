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
    <!-- Helper -->
    <!-- Missing Component: KAction -->
    <!--
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
    -->
  </q-select>
</template>

<script>
import _ from 'lodash'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

export default {
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    // Inject a getUnits function: (quantity) => unit[] where each unit has { name, label }
    // Falls back to using properties.field.options directly
    const getUnits = inject('getUnits', null)
    return { ...useField(props, emit), getUnits }
  },
  computed: {
    options () {
      const { t } = useI18n()
      let units
      if (this.getUnits) {
        units = this.getUnits(_.get(this.properties, 'field.quantity'))
        const unitsFilter = _.get(this.properties, 'field.filter', [])
        if (!_.isEmpty(unitsFilter)) units = _.filter(units, unit => _.includes(unitsFilter, unit.name))
        return units.map(unit => ({ value: unit.name, label: t(_.get(unit, 'label', '')) }))
      }
      // Fallback: use field.options directly (same format as KSelectField)
      units = _.get(this.properties, 'field.options', [])
      return units.map(unit => ({ value: unit.value ?? unit.name, label: t(_.get(unit, 'label', '')) }))
    }
  }
}
</script>
