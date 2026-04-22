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

<script>
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

export default {
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    return useField(props, emit)
  },
  data () {
    return {
      width: 1280,
      height: 720,
      resolution: undefined
    }
  },
  watch: {
    resolution: {
      handler (value) {
        if (!value) {
          this.resolution = this.resolutions[1]
          return
        }
        const size = _.split(value.value, 'x')
        this.width = Number(size[0])
        this.height = Number(size[1])
        this.updateModel()
      },
      immediate: true
    },
    width (value) {
      if (value < 256) this.width = 256
      if (value > 4000) this.width = 4000
      this.updateModel()
    },
    height (value) {
      if (value < 256) this.height = 256
      if (value > 4000) this.height = 4000
      this.updateModel()
    }
  },
  computed: {
    computedClass () {
      const classObject = {}
      classObject['full-width row items-center no-wrap q-gutter-x-xs q-pb-md'] = true
      if (this.properties.center) classObject['justify-center'] = true
      return classObject
    },
    borderless () {
      return _.get(this.properties, 'field.borderless', false)
    },
    readonly () {
      return this.resolution?.readonly ?? true
    },
    resolutions () {
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
    }
  },
  methods: {
    updateModel () {
      this.model = { width: this.width, height: this.height }
      this.onChanged()
    }
  }
}
</script>
