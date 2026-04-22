<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip v-if="!multiple && model?.name">
      {{ model.name }}
    </q-chip>
    <q-chip v-else
      v-for="file in model"
      :key="file.name"
      icon="las la-cloud-upload-alt"
    >
      {{ file.name }}
    </q-chip>
  </div>
  <!-- -->
  <q-field v-else-if="!isModelEmpty"
    :for="properties.name + '-field'"
    v-model="model"
    :label="label"
    clearable
    @clear="onFileCleared"
    :disable="disabled"
  >
    <template v-slot:control>
      {{ displayName }}
    </template>
  </q-field>
  <q-file v-else
    :for="properties.name + '-field'"
    v-model="files"
    :label="label"
    :accept="acceptedTypes"
    :filter="filterSelectedFiles"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
    :disable="disabled"
    :multiple="multiple"
    :append="multiple"
    :use-chips="true"
    :clearable="isClearable"
    :max-files="maxFiles"
    :max-file-size="maxFileSize"
    :max-total-size="maxTotalSize"
    @update:model-value="onFilesChanged"
    @rejected="onFileRejected"
  >
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
  </q-file>
</template>

<script>
import _ from 'lodash'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'
// Missing: Reader, Storage, Notify, formatSize (needed for upload/submit)
// import { markRaw } from 'vue'
// import { Notify } from 'quasar'
// import { Reader } from '../../reader.js'
// import { Storage } from '../../storage.js'
// import { formatSize } from '../../utils/utils.files.js'

export default {
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    function emptyModel () {
      return _.get(props.properties, 'field.multiple', false) ? [] : null
    }
    return { ...useField(props, emit, { emptyModel }), emptyModel }
  },
  data () {
    return {
      files: null
    }
  },
  computed: {
    multiple () {
      return _.get(this.properties, 'field.multiple', false)
    },
    isModelEmpty () {
      return _.isEmpty(this.model)
    },
    displayName () {
      if (_.isArray(this.model)) return _.map(this.model, 'name').join(', ')
      return _.get(this.model, 'name', '')
    },
    acceptedTypes () {
      return _.get(this.properties, 'field.mimeTypes', '')
    },
    maxFiles () {
      return _.get(this.properties, 'field.maxFiles', this.multiple ? 9 : 1)
    },
    maxFileSize () {
      return _.get(this.properties, 'field.maxFileSize', 1048576)
    },
    maxTotalSize () {
      return _.get(this.properties, 'field.maxTotalSize', this.maxFileSize)
    },
    isClearable () {
      return _.get(this.properties, 'field.clearable', true)
    }
  },
  methods: {
    isEmpty () {
      return _.isEmpty(this.model)
    },
    clear () {
      this.fill(_.get(this.properties, 'default', this.emptyModel()))
    },
    onFileCleared () {
      this.files = null
      this.model = this.emptyModel()
      this.onChanged()
    },
    async onFilesChanged () {
      if (_.isEmpty(this.files)) {
        // field cleared
        this.model = this.emptyModel()
        return
      }
      // field updated
      const selectedFiles = this.multiple ? this.files : [this.files]
      const result = []
      for (const file of selectedFiles) {
        // Check whether the file will be uploaded without being read
        if (!_.get(this.properties, 'field.readContent', true)) {
          result.push({ name: file.name, type: file.type, File: file })
          continue
        }
        // Missing: Reader — fallback to simple object
        // const accepted = Reader.filter([file])
        // if (accepted.length === 1) { ... }
        result.push({ name: file.name, type: file.type, File: file })
      }
      if (this.multiple) this.model = result
      else this.model = _.get(result, '0', null)
      this.onChanged()
    },
    filterSelectedFiles (files) {
      const filter = _.get(this.properties, 'field.filter')
      if (!filter) return files
      return _.filter(files, file => file.name.includes(filter))
    },
    onFileRejected (errs) {
      // Missing: i18n, formatSize — rejection errors are not translated
      // const errors = [].concat(errs)
      // for (const error of errors) { ... }
    }
    // Missing: apply, upload, submitted (require Storage, Reader, Notify, i18n)
    // async apply (object, field) { ... }
    // async upload (object, field) { ... }
    // async submitted (object, field) { ... }
  }
}
</script>
