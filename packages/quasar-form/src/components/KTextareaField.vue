<template>
  <!-- Missing Component: KTextArea -->
  <!-- <KTextArea v-if="readOnly" :text="model" :length="150" /> -->
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    :model-value="model"
    :label="label"
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
  >
    <!-- Content -->
    <template v-slot:default>
      <div class="q-pt-md full-width">
        <q-editor
          :id="properties.name + '-field'"
          v-model="model"
          :definitions="definitions"
          :toolbar="editorToolbar"
          :content-style="{ overflowWrap: 'anywhere' }"
          content-class="text-grey-8"
          min-height="5rem"
          max-height="10rem"
          dense
        />
      </div>
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
</template>

<script>
import _ from 'lodash'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'
// Missing Component: KTextArea
// import KTextArea from '../KTextArea.vue'

export default {
  // Missing Component: KTextArea
  // components: { KTextArea },
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    function emptyModel () { return '' }
    return { ...useField(props, emit, { emptyModel }), emptyModel }
  },
  computed: {
    editorToolbar () {
      let configuration
      const defaultToolbar = {
        xs: [
          ['bold', 'italic', 'underline', 'strike', 'align'],
          [{
            label: '',
            icon: this.$q.iconSet.editor.align,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          }],
          ['undo', 'redo'],
          ['clear']
        ],
        'gt.xs': [
          ['bold', 'italic', 'underline', 'strike', 'unordered', 'ordered'],
          ['quote', 'link', 'hr'],
          [{
            label: this.$q.lang.editor.align,
            icon: this.$q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          }],
          ['undo', 'redo'],
          ['clear']
        ]
      }
      _.forEach(this.properties.toolbar || _.get(this.properties, 'field.toolbar') || defaultToolbar, (value, key) => {
        if (_.get(this.$q.screen, key)) {
          configuration = value
          return false
        }
      })
      return configuration
    }
  },
  data () {
    return {
      definitions: {
        clear: {
          tip: this.$t('KTextAreaField.CLEAR_TOOLTIP'),
          icon: 'cancel',
          handler: this.clear
        }
      }
    }
  },
  methods: {
    isEmpty () {
      return this.model === ''
    },
    clear () {
      this.fill(_.get(this.properties, 'default', ''))
    }
  }
}
</script>
