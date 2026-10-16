<template>
  <q-icon
    v-bind="computedIcon"
    class="k-icon"
  >
    <div
      v-if="computedOverlay"
      class="k-icon-overlay"
    >
      <q-icon v-bind="computedOverlay" />
    </div>
  </q-icon>
</template>

<script setup>
import { get, isString, omit } from 'lodash-es'
import { computed } from 'vue'
import { palette } from '../utilities/palette.js'

// Props
const props = defineProps({
  icon: {
    type: [String, Object],
    default: undefined
  }
})

// Data
const defaultColor = 'grey-9'

// Computed
const computedIcon = computed(() => {
  if (!props.icon) return
  if (isString(props.icon)) return { name: props.icon }
  return omit(props.icon, ['overlay', 'color'])
})
const computedIconColor = computed(() => {
  if (!props.icon) return
  if (isString(props.icon)) return defaultColor
  return palette.resolve(props.icon.color, defaultColor)
})
const computedOverlay = computed(() => {
  return omit(get(props.icon, 'overlay', {}), ['color', 'rotation'])
})
const computedOverlayColor = computed(() => {
  return palette.resolve(get(props.icon, 'overlay.color', defaultColor))
})
const computedOverlayTransform = computed(() => {
  return `rotate(${get(props.icon, 'overlay.rotation', 0)}deg)`
})
</script>

<style lang="scss" scoped>
.k-icon {
  position: relative;
  color: v-bind(computedIconColor);
}
.k-icon-overlay {
  position: absolute;
  color: v-bind(computedOverlayColor);
  transform: v-bind(computedOverlayTransform);
}
</style>
