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
import _ from 'lodash'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const width = ref(1280)
const height = ref(720)
const resolution = ref(undefined)

const field = useField(props, emit)
const { model, label, hasFocus, disabled, onChanged } = field

const borderless = computed(() => _.get(props.properties, 'field.borderless', false))
const readonly = computed(() => resolution.value?.readonly ?? true)

const resolutions = computed(() => {
  const { t } = useI18n()
  return [
    { label: t('KResolutionField.SD_LABEL'), description: t('KResolutionField.SD_DESCRIPTION'), value: '640x480', readonly: true },
    { label: t('KResolutionField.HD_LABEL'), description: t('KResolutionField.HD_DESCRIPTION'), value: '1280x720', readonly: true },
    { label: t('KResolutionField.FHD_LABEL'), description: t('KResolutionField.FHD_DESCRIPTION'), value: '1920x1080', readonly: true },
    { label: t('KResolutionField.QHD_LABEL'), description: t('KResolutionField.QHD_DESCRIPTION'), value: '2560x1440', readonly: true },
    { label: t('KResolutionField.2K_LABEL'), description: t('KResolutionField.2K_DESCRIPTION'), value: '2048x1080', readonly: true },
    { label: t('KResolutionField.4K_LABEL'), description: t('KResolutionField.4K_DESCRIPTION'), value: '3840x2160', readonly: true },
    { label: t('KResolutionField.PERSONALIZED_LABEL'), description: '', value: '1280x721', readonly: false }
  ]
})

watch(resolution, (value) => {
  if (!value) {
    resolution.value = resolutions.value[1]
    return
  }
  const size = _.split(value.value, 'x')
  width.value = Number(size[0])
  height.value = Number(size[1])
  updateModel()
}, { immediate: true })

watch(width, (value) => {
  if (value < 256) width.value = 256
  if (value > 4000) width.value = 4000
  updateModel()
})

watch(height, (value) => {
  if (value < 256) height.value = 256
  if (value > 4000) height.value = 4000
  updateModel()
})

function updateModel () {
  model.value = { width: width.value, height: height.value }
  onChanged()
}

defineExpose({ properties: props.properties, ...field, width, height, resolution, borderless, readonly, resolutions, updateModel })
</script>
