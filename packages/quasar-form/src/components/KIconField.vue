<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-icon :name="model.name" :color="model.color" />
  </div>
  <div v-else>
    <q-field
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      v-model="model"
      :label="label"
      :clearable="isClearable()"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      bottom-slots
      @clear="onCleared">
      <!-- Icon chooser -->
      <template v-slot:prepend>
        <q-btn
          id="icon-chooser-button"
          round
          flat
          icon="las la-icons"
          @click="onIconClicked" />
        <!-- Missing Component: KIconChooser -->
        <!-- <k-icon-chooser
          id="icon-chooser"
          ref="iconChooser"
          :icon-set="iconSet"
          :palette="color"
          @icon-choosed="onIconChoosed" /> -->
      </template>
      <!-- Content -->
      <template v-slot:default>
        <q-icon
          class="q-pt-xs"
          size="sm"
          id="choosed-icon"
          :name="iconName"
          :color="iconColor" />
      </template>
      <!-- Helper -->
      <!-- Missing Component: KAction -->
      <!--
      <template v-if="hasHelper" v-slot:append>
        <KAction
          :id="properties.name + '-helper'"
          :label="helperLabel"
          :icon="helperIcon"
          :tooltip="helperTooltip"
          :url="helperUrl"
          :dialog="helperDialog"
          :context="helperContext"
          @dialog-confirmed="onHelperDialogConfirmed"
          color="primary"
        />
      </template>
      -->
    </q-field>
  </div>
</template>

<script>
import _ from 'lodash'
import { useField } from '../composables/index.js'
import { fieldProps, getIconName } from '../utils/index.js'
// Missing Component: KIconChooser
// import { KIconChooser } from '../input'

export default {
  // Missing Component: KIconChooser
  // components: { KIconChooser },
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    // emptyModel depends on this.color (data), so we read from props here
    function emptyModel () {
      const color = _.get(props.properties, 'field.color', true)
      return color ? { name: '', color: '' } : ''
    }
    return { ...useField(props, emit, { emptyModel }), emptyModel }
  },
  computed: {
    hasIcon () {
      return !this.isEmpty()
    },
    iconName () {
      return getIconName(this.model, 'name')
    },
    iconColor () {
      // We support icon without a color
      return _.get(this.model, 'color', 'dark')
    }
  },
  data () {
    return {
      iconSet: _.get(this.properties.field, 'iconSet', 'font-awesome'),
      color: _.get(this.properties.field, 'color', true),
      inverted: _.get(this.properties.field, 'inverted', false)
    }
  },
  methods: {
    emptyModel () {
      // We support icon without a color, in this case we have a string as model
      return (this.color ? { name: '', color: '' } : '')
    },
    isEmpty () {
      return this.color ? !_.get(this.model, 'name') : !this.model
    },
    clear () {
      this.fill(_.get(this.properties, 'default', this.emptyModel()))
    },
    isClearable () {
      return _.get(this.properties, 'field.clearable', true)
    },
    onCleared () {
      this.model = this.emptyModel()
      this.onChanged()
    },
    onIconClicked () {
      // Missing Component: KIconChooser
      // this.$refs.iconChooser.open(this.model)
    },
    onIconChoosed (icon) {
      // We support icon without a color, in this case we have a string as model
      // Missing Component: KIconChooser
      // this.model = (this.color ? Object.assign({}, icon) : icon)
      // this.onChanged()
    }
  }
}
</script>
