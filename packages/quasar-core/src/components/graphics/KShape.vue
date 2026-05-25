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
import { Graphiks } from '@kalisio/common-graphics'

const graphiks = new Graphiks()

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
  const shape = graphiks.renderShape(props.options)
  return shape ? shape.toSVG() : undefined
})
</script>
