<template>
  <div class="k-text-field" />
</template>

<script setup>
import { useField } from '../../composables/index.js'

const props = defineProps({
  properties: { type: Object, required: true },
  values: { type: Object, default: null },
  required: { type: Boolean, default: false },
  dense: { type: Boolean, default: false }
})

const emit = defineEmits(['field-changed'])

defineExpose({ properties: props.properties, ...useField(props, emit) })
</script>
