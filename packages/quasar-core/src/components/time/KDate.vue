<template>
  <q-btn v-bind="computedButton">
    <q-popup-proxy>
      <q-date
        id="date-picker"
        v-model="computedModel"
        v-bind="computedPicker"
      />
    </q-popup-proxy>
  </q-btn>
</template>

<script setup>
import { get, isEmpty, merge } from 'lodash-es'
import moment from 'moment'
import { computed } from 'vue'
import { useI18n } from '../../composables'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  picker: {
    type: Object,
    default: () => null
  },
  format: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: 'las la-calendar'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const { tie } = useI18n()
const mask = 'YYYY-MM-DD'

// Computed
const computedModel = computed({
  get: function () {
    return props.modelValue
  },
  set: function (value) {
    emit('update:modelValue', value)
  }
})
const computedButton = computed(() => {
  // compute format
  let format = props.format
  // if (isEmpty(format)) format = get(Time.getFormat(), 'date.short')
  if (isEmpty(format)) format = 'iso'
  // compute label
  const label = isEmpty(computedModel.value) ? tie(props.placeholder) : moment(computedModel.value, mask).format(format)
  // define button spec
  const spec = {
    id: 'date-button',
    label,
    flat: true,
    noCaps: true,
    disable: props.disabled,
    dense: true,
    class: props.dense ? 'q-px-xs' : 'q-pa-sm'
  }
  // add icon if defined
  if (props.icon) spec.icon = props.icon
  return spec
})
const computedPicker = computed(() => {
  const picker = { mask }
  return merge({}, props.picker, picker)
})
</script>
