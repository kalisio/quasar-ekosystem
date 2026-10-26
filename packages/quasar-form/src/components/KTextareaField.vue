<template>
  <KTextArea v-if="readOnly" :text="model" :length="150" />
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
  </q-field>
</template>

<script setup>
import { forEach, get } from 'lodash-es'
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'
// Missing Component: KTextArea
// import KTextArea from '../KTextArea.vue'

// Missing Component: KTextArea
// components: { KTextArea },
// Missing Mixin: baseField
// mixins: [baseField],

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])
const $q = useQuasar()
const { t } = useI18n()

function emptyModel () { return '' }

const {
  model, label, hasHelper, helperLabel, helperIcon, helperTooltip, helperUrl,
  helperDialog, helperContext, hasFocus, hasError, errorLabel, disabled,
  fill, value, validate, invalidate, onChanged, apply, submitted, onHelperDialogConfirmed
} = useField(props, emit, { emptyModel })

function isEmpty () { return model.value === '' }
function clear () { fill(get(props.properties, 'default', '')) }

const definitions = {
  clear: {
    tip: t('KTextAreaField.CLEAR_TOOLTIP'),
    icon: 'cancel',
    handler: clear
  }
}

const editorToolbar = computed(() => {
  let configuration
  const defaultToolbar = {
    xs: [
      ['bold', 'italic', 'underline', 'strike', 'align'],
      [{
        label: '',
        icon: $q.iconSet.editor.align,
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
        label: $q.lang.editor.align,
        icon: $q.iconSet.editor.align,
        fixedLabel: true,
        list: 'only-icons',
        options: ['left', 'center', 'right', 'justify']
      }],
      ['undo', 'redo'],
      ['clear']
    ]
  }
  forEach(props.properties.toolbar || get(props.properties, 'field.toolbar') || defaultToolbar, (v, key) => {
    if (get($q.screen, key)) {
      configuration = v
      return false
    }
  })
  return configuration
})

defineExpose({ fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError })
</script>
