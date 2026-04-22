<template>
  <div v-if="readOnly">
    <!-- Missing Component: KColorScale -->
    <!-- <KColorScale v-bind="model" style="max-height: 46px" /> -->
    <div :id="properties.name + '-field'" class="k-color-scale-preview">
      <span v-if="model">{{ getLabel(model) }}</span>
    </div>
  </div>
  <q-select v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :options="getOptions()"
    options-selected-class="hidden"
    emit-value
    map-options
    :clearable="isClearable()"
    :error="hasError"
    :error-message="errorLabel"
    :disable="disabled"
    bottom-slots
    @blur="onChanged"
    @update:model-value="onChanged"
  >
    <!-- Selected display -->
    <template v-slot:selected-item="scope">
      <q-item class="full-width">
        <q-item-section>
          <q-item-label>
            <!-- Missing Component: KColorScale -->
            <!-- <KColorScale :key="scope.opt.label" v-bind="scope.opt.value" style="max-height: 46px;" /> -->
            <div class="k-color-scale-bar" :style="getScaleStyle(scope.opt.value)" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section>
          <q-item-label>
            <!-- Missing Component: KColorScale -->
            <!-- <KColorScale v-bind="scope.opt.value" style="max-height: 46px;" /> -->
            <div class="k-color-scale-bar" :style="getScaleStyle(scope.opt.value)" />
          </q-item-label>
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
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'
// Missing Component: KColorScale
// import { KColorScale } from '../media'

export default {
  // Missing Component: KColorScale
  // components: { KColorScale },
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    return useField(props, emit)
  },
  methods: {
    getId (option) {
      return _.kebabCase(option.label)
    },
    getOptions () {
      return _.get(this.properties, 'field.options', [])
    },
    isClearable () {
      return _.get(this.properties, 'field.clearable', true)
    },
    getLabel (value) {
      const options = this.getOptions()
      const opt = _.find(options, o => _.isEqual(o.value, value))
      return opt?.label || ''
    },
    getScaleStyle (value) {
      if (!value) return {}
      const colors = _.get(value, 'colors', _.get(value, 'scale', []))
      if (_.isEmpty(colors)) return {}
      const stops = colors.map((c, i) => `${_.isString(c) ? c : c.color} ${Math.round((i / (colors.length - 1)) * 100)}%`)
      return { background: `linear-gradient(to right, ${stops.join(', ')})`, height: '16px', borderRadius: '4px', width: '100%' }
    }
  }
}
</script>

<style scoped>
.k-color-scale-bar {
  height: 16px;
  border-radius: 4px;
  width: 100%;
  max-width: 240px;
}
.k-color-scale-preview {
  min-height: 24px;
}
</style>
