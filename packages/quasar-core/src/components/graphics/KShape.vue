<template>
  <div>
    <div v-if="content" v-html="content" />
    <q-tooltip v-if="tooltip">
      {{ tooltip }}
    </q-tooltip>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ShapeFactory } from '@kalisio/common-graphics'

const factory = new ShapeFactory()

// Props
const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  tooltip: {
    type: String,
    default: undefined
  }
})

// Computed
const content = computed(() => {
  const shape = factory.build(props.options)
  return shape ? shape.toSVG() : undefined
})
</script>
