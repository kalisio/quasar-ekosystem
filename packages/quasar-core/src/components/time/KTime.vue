<template>
  <q-btn v-bind="computedButton">
    <q-popup-proxy>
      <q-time
        id="time-picker"
        v-model="computedModel"
        v-bind="computedPicker"
      />
    </q-popup-proxy>
  </q-btn>
</template>

<script setup>
import _ from 'lodash-es'
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
  withSeconds: {
    type: Boolean,
    default: false
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
    default: 'las la-clock'
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
const mask = 'HH:mm:ss'

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
  // if (_.isEmpty(format)) format = _.get(Time.getFormat(), 'time.long')
  if (_.isEmpty(format)) format = 'HH:mm'
  // compute label
  let label
  // if (!_.isEmpty(computedModel.value)) label = moment.tz(computedModel.value, mask, Time.getFormatTimezone()).format(format)
  if (!_.isEmpty(computedModel.value)) label = moment(computedModel.value, mask).format(format)
  else label = tie(props.placeholder)
  // define button spec
  const spec = {
    id: 'time-button',
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
  const picker = {
    mask,
    withSeconds: props.withSeconds
  }
  return _.merge({}, props.picker, picker)
})
</script>
