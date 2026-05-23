<template>
  <div v-if="hasTabs && current" class="fit column">
    <!-- Tabs -->
    <q-tabs
      v-model="current"
      :no-caps="noCaps"
      outside-arrows
      mobile-arrows
      :dense="dense"
      class="full-width text-primary"
      @update:model-value="onTabChanged"
    >
      <template v-for="(tab, index) in tabs" :key="tab">
        <q-tab
          :name="tab"
          :id="tab"
          :label="getLabel(index) || tab"
        />
      </template>
    </q-tabs>
    <q-separator />
    <!-- Panel -->
    <KContent
      :id="`${current}-panel`"
      :content="panel"
      :mode="current"
      :filter="filter"
      @triggered="onContentTriggered"
      class="col full-width"
    />
  </div>
</template>

<script setup>
import _ from 'lodash-es'
import { ref, computed, watch } from 'vue'
import { useI18n } from '../composables'
import KContent from './KContent.vue'

// Props
const props = defineProps({
  content: {
    type: Object,
    default: () => null
  },
  mode: {
    type: String,
    default: undefined
  },
  filter: {
    type: Object,
    default: () => {}
  },
  context: {
    type: Object,
    default: () => null
  },
  labels: {
    type: Array,
    default: () => null
  },
  noCaps: {
    type: Boolean,
    default: true
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Emit
const emit = defineEmits(['tab-changed', 'triggered'])

// Data
const { tie } = useI18n()
const current = ref(null)

// Computed
const hasTabs = computed(() => {
  return !_.isEmpty(tabs.value)
})
const tabs = computed(() => {
  return getModes()
})
const panel = computed(() => {
  return _.get(props.content, current.value)
})

// Watch
watch(() => props.mode, (mode) => {
  current.value = mode
}, { immediate: true })

// Function
function getModes () {
  return _.keys(props.content)
}
function getLabel (index) {
  const label = _.nth(props.labels, index)
  if (label) return tie(label)
}
function onTabChanged (params) {
  emit('tab-changed', params)
}
function onContentTriggered (params) {
  emit('triggered', params)
}
</script>
