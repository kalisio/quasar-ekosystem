<template>
  <q-select
    v-model="resolution"
    :options="resolutions"
    style="min-width: 30%"
    :label="label"
    :borderless="borderless"
    :disable="disabled"
    class="full-width"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label v-html="scope.opt.label" />
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:after>
      <div class="row items-baseline q-gutter-x-sm">
        <q-input
          v-model.number="width"
          type="number"
          min="256" max="4000"
          mask="(#)###"
          dense
          :borderless="borderless"
          input-class="text-center"
          style="max-width: 54px"
          :readonly="readonly"
          :disable="disabled"
          :autofocus="hasFocus"
          @update:model-value="updateModel()"
        />
        <span class="text-body1">x</span>
        <q-input
          v-model.number="height"
          type="number"
          min="256" max="4000"
          mask="(#)###"
          dense
          :borderless="borderless"
          input-class="text-center"
          style="max-width: 54px"
          :readonly="readonly"
          :disable="disabled"
          @update:model-value="updateModel()"
        />
      </div>
    </template>
  </q-select>
</template>

<script setup>
import { get, split } from 'lodash-es'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])
const { t } = useI18n()

const {
  model, label, hasFocus, hasError, errorLabel, disabled,
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, onChanged, apply, submitted
} = useField(props, emit)

const width = ref(1280)
const height = ref(720)
const resolution = ref(undefined)

const computedClass = computed(() => {
  const classObject = {}
  classObject['full-width row items-center no-wrap q-gutter-x-xs q-pb-md'] = true
  if (props.properties.center) classObject['justify-center'] = true
  return classObject
})
const borderless = computed(() => get(props.properties, 'field.borderless', false))
const readonly = computed(() => resolution.value?.readonly ?? true)
const resolutions = computed(() => [
  { label: t('KResolutionField.SD_LABEL'), description: t('KResolutionField.SD_DESCRIPTION'), value: '640x480', readonly: true },
  { label: t('KResolutionField.HD_LABEL'), description: t('KResolutionField.HD_DESCRIPTION'), value: '1280x720', readonly: true },
  { label: t('KResolutionField.FHD_LABEL'), description: t('KResolutionField.FHD_DESCRIPTION'), value: '1920x1080', readonly: true },
  { label: t('KResolutionField.QHD_LABEL'), description: t('KResolutionField.QHD_DESCRIPTION'), value: '2560x1440', readonly: true },
  { label: t('KResolutionField.2K_LABEL'), description: t('KResolutionField.2K_DESCRIPTION'), value: '2048x1080', readonly: true },
  { label: t('KResolutionField.4K_LABEL'), description: t('KResolutionField.4K_DESCRIPTION'), value: '3840x2160', readonly: true },
  { label: t('KResolutionField.PERSONALIZED_LABEL'), description: '', value: '1280x721', readonly: false }
])

watch(resolution, (val) => {
  if (!val) {
    resolution.value = resolutions.value[1]
    return
  }
  const size = split(val.value, 'x')
  width.value = Number(size[0])
  height.value = Number(size[1])
  updateModel()
}, { immediate: true, flush: 'sync' })

watch(width, (val) => {
  if (val < 256) width.value = 256
  if (val > 4000) width.value = 4000
  updateModel()
}, { flush: 'sync' })

watch(height, (val) => {
  if (val < 256) height.value = 256
  if (val > 4000) height.value = 4000
  updateModel()
}, { flush: 'sync' })

function updateModel() {
  model.value = { width: width.value, height: height.value }
  onChanged()
}

defineExpose({
  fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError,
  width, height, resolution, computedClass, borderless, readonly, resolutions, updateModel
})
</script>
