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
    :clearable="isClearable()"
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
    <!-- no options display -->
    <template v-if="hasNoOption" v-slot:no-option>
      <p v-if="typeof noOption === 'string'" class="noOptionText">{{ noOption }}</p>
      <!-- Missing: loadComponent (KDK) — dynamic component not supported
      <Suspense v-else>
        <component v-if="noOptionComponent" :is="noOptionComponent" v-bind="noOptionsAttributes" />
      </Suspense>
      -->
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
        <span :class="selectedClass()">
          {{ scope.opt.label }}
        </span>
      </q-chip>
      <span v-else :class="selectedClass()">
        {{ scope.opt.label }}
      </span>
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
import { filter, get, isEmpty, isNil, kebabCase, map } from 'lodash-es'
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'
import { string } from '@kalisio/common-core/utilities'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])
const { t } = useI18n()

function emptyModel() {
  return get(props.properties, 'multiselect', false) ? [] : null
}

const {
  model, label, hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl,
  helperDialog, helperContext, hasFocus, hasError, errorLabel, disabled,
  fill, value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit, { emptyModel })

const filter = ref(null)

const multiple = computed(() => isMultiselect())
const chips = computed(() => hasChips())
const options = computed(() => {
  let opts = map(get(props.properties, 'field.options', []), option => {
    const lbl = t(get(option, 'label', ''))
    return Object.assign({}, option, { label: lbl })
  })
  if (filter.value) {
    opts = filter(opts, option => {
      const regExp = new RegExp(string.makeDiacriticPattern(filter.value))
      return regExp.test(option.label.toLowerCase())
    })
  }
  return opts
})
const hasNoOption = computed(() => !isEmpty(get(props.properties, 'field.noOption', {})))
const noOption = computed(() => get(props.properties, 'field.noOption', null))

watch(options, (opts) => {
  if (isEmpty(filter.value) && opts.length === 1 && props.required) {
    nextTick(() => {
      fill(opts[0].value)
      onChanged()
    })
  }
}, { immediate: true })

function isMultiselect() { return get(props.properties, 'multiselect', false) }
function isClearable() { return get(props.properties, 'field.clearable', true) }
function hasChips() { return get(props.properties, 'field.chips', false) }
function getId(option) {
  let id = option.value
  if (typeof id === 'object') {
    const valueField = get(props.properties, 'field.valueField')
    if (valueField) id = get(id, valueField)
    else id = option.label
  } else {
    id = id.toString()
  }
  return kebabCase(id)
}
function isEmpty() {
  return multiple.value ? isEmpty(model.value) : isNil(model.value)
}
function clear() {
  fill(get(props.properties, 'default', emptyModel()))
}
function selectedClass() {
  return get(props.properties, 'field.selectedClass', 'text-weight-regular')
}
function onFilter(pattern, update) {
  if (pattern === '') {
    update(() => { filter.value = null })
    return
  }
  update(() => { filter.value = pattern.toLowerCase() })
}

defineExpose({
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError,
  options, filter, multiple, chips, hasNoOption, noOption,
  isMultiselect, isClearable, hasChips, getId, selectedClass, onFilter
})
</script>
