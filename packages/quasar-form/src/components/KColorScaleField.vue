<template>
  <div v-if="readOnly">
    <div :id="properties.name + '-field'" class="k-color-scale-preview">
      <span v-if="model">{{ getLabel(model) }}</span>
    </div>
  </div>
  <q-select v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :options="options"
    options-selected-class="hidden"
    emit-value
    map-options
    :clearable="isClearable"
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
            <div class="k-color-scale-bar" :style="getScaleStyle(scope.opt.value)" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const field = useField(props, emit)
const { model, label, hasError, errorLabel, disabled, onChanged } = field

const options = computed(() => _.get(props.properties, 'field.options', []))
const isClearable = computed(() => _.get(props.properties, 'field.clearable', true))

function getId (option) { return _.kebabCase(option.label) }

function getLabel (value) {
  const opt = _.find(options.value, o => _.isEqual(o.value, value))
  return opt?.label || ''
}

function getScaleStyle (value) {
  if (!value) return {}
  const colors = _.get(value, 'colors', _.get(value, 'scale', []))
  if (_.isEmpty(colors)) return {}
  const stops = colors.map((c, i) => `${_.isString(c) ? c : c.color} ${Math.round((i / (colors.length - 1)) * 100)}%`)
  return { background: `linear-gradient(to right, ${stops.join(', ')})`, height: '16px', borderRadius: '4px', width: '100%' }
}

defineExpose({ properties: props.properties, ...field, options, isClearable, getId, getLabel, getScaleStyle })
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
