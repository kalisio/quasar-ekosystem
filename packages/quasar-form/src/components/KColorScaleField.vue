<template>
  <div v-if="readOnly">
    <KColorScale v-bind="model" style="max-height: 46px" />
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
            <KColorScale
              :key="scope.opt.label"
              v-bind="scope.opt.value"
              style="max-height: 46px;"
            />
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
            <KColorScale
              v-bind="scope.opt.value"
              style="max-height: 46px;"
            />
          </q-item-label>
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

<script>
import { find, get, isEmpty, isEqual, isString, kebabCase } from 'lodash-es'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'
export default {
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    return useField(props, emit)
  },
  methods: {
    getId (option) {
      return kebabCase(option.label)
    },
    getOptions () {
      return get(this.properties, 'field.options', [])
    },
    isClearable () {
      return get(this.properties, 'field.clearable', true)
    },
    getLabel (value) {
      const options = this.getOptions()
      const opt = find(options, o => isEqual(o.value, value))
      return opt?.label || ''
    },
    getScaleStyle (value) {
      if (!value) return {}
      const colors = get(value, 'colors', get(value, 'scale', []))
      if (isEmpty(colors)) return {}
      const stops = colors.map((c, i) => `${isString(c) ? c : c.color} ${Math.round((i / (colors.length - 1)) * 100)}%`)
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
