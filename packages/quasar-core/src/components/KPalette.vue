<template>
  <div class="row justify-center q-gutter-xs full-width">
    <template v-for="(color, index) in colors" :key="index">
      <q-btn
        :id="'style-color-' + color"
        :round="shape === 'round'"
        :icon="modelValue === color ? 'las la-check' : ''"
        :color="color"
        :text-color="color === 'white' ? 'black' : 'white'"
        small
        @click="$emit('update:modelValue', color)" />
    </template>
  </div>
</template>

<script setup>
import { QUASAR_PALETTE } from '../utilities/palette.js'

defineOptions({ name: 'k-palette' })

defineProps({
  modelValue: { type: String, default: 'dark' },
  shape: { type: String, default: 'square', validator: (v) => ['round', 'square'].includes(v) }
})

defineEmits(['update:modelValue'])

const colors = Object.keys(QUASAR_PALETTE)
</script>
