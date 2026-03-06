<template>
  <div v-if="readOnly">
    <q-chip :id="properties.name + '-field'" dense>
      {{ model }}
    </q-chip>
  </div>
  <q-select v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :multiple="multiple"
    :options="options"
    emit-value
    map-options
    use-input
    :dense="dense"
    :clearable="isClearable"
    :error="hasError"
    :error-message="errorLabel"
    :disable="disabled"
    :autofocus="hasFocus"
    bottom-slots
    @filter="onFilter"
    @blur="onChanged"
    @update:model-value="onChanged"
  >
    <!-- options display -->
    <template v-slot:option="scope">
      <q-item
        :dense="dense"
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!-- selected item display -->
    <template v-slot:selected-item="scope">
      <q-chip v-if="chips && scope.opt.label"
        removable
        :dense="dense"
        :color="scope.opt.color"
        :textColor="scope.opt.textColor"
        :tabindex="scope.tabindex"
        @remove="scope.removeAtIndex(scope.index)"
      >
        <span :class="selectedClass">{{ scope.opt.label }}</span>
      </q-chip>
      <span v-else :class="selectedClass">{{ scope.opt.label }}</span>
    </template>
  </q-select>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'
import { makeDiacriticPattern } from '../utils/diacritics.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const filter = ref(null)

const multiple = computed(() => _.get(props.properties, 'multiselect', false))
const chips = computed(() => _.get(props.properties, 'field.chips', false))
const isClearable = computed(() => _.get(props.properties, 'field.clearable', true))
const selectedClass = computed(() => _.get(props.properties, 'field.selectedClass', 'text-weight-regular'))
const options = computed(() => {
  let opts = _.map(_.get(props.properties, 'field.options', []), option => {
    return Object.assign({}, option, { label: useI18n().t(_.get(option, 'label', '')) })
  })
  if (filter.value) {
    opts = _.filter(opts, option => {
      return new RegExp(makeDiacriticPattern(filter.value)).test(option.label.toLowerCase())
    })
  }
  return opts
})

const field = useField(props, emit)
const { model, label, hasError, errorLabel, hasFocus, disabled, onChanged, fill } = field

// Multiselect starts as [] not null
if (multiple.value && _.isNil(model.value)) model.value = []

// Auto-fill required single-option fields
watch(options, (opts) => {
  if (_.isEmpty(filter.value) && opts.length === 1 && props.required) {
    nextTick(() => {
      fill(opts[0].value)
      onChanged()
    })
  }
}, { immediate: true })

function emptyModel () { return multiple.value ? [] : null }
function isEmpty () { return multiple.value ? _.isEmpty(model.value) : _.isNil(model.value) }
function clear () { fill(_.get(props.properties, 'default', emptyModel())) }

function getId (option) {
  let id = option.value
  if (typeof id === 'object') {
    const valueField = _.get(props.properties, 'field.valueField')
    if (valueField) id = _.get(id, valueField)
    else id = option.label
  } else {
    id = id.toString()
  }
  return _.kebabCase(id)
}

function onFilter (pattern, update) {
  if (pattern === '') {
    update(() => { filter.value = null })
    return
  }
  update(() => { filter.value = pattern.toLowerCase() })
}

defineExpose({ properties: props.properties, ...field, options, emptyModel, isEmpty, clear })
</script>
