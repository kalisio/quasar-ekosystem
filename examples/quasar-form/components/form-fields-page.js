import { ref, reactive, computed, watch } from 'vue'
import { KForm } from '@kalisio/quasar-form'

const schemas = {
  user: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://kalisio.xyz/schemas/user.create.json#',
    title: 'Create user',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 128,
        field: { component: 'form/KTextField', label: 'Name' }
      },
      email: {
        type: 'string',
        field: { component: 'form/KEmailField', label: 'Email' }
      },
      password: {
        type: 'string',
        minLength: 8,
        field: { component: 'form/KPasswordField', label: 'Password' }
      },
      role: {
        type: 'string',
        field: {
          component: 'form/KSelectField',
          label: 'Role',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' }
          ],
          clearable: false
        }
      },
      color: {
        type: 'string',
        default: '#1976D2',
        field: { component: 'form/KColorField', label: 'Color', clearable: false }
      },
      active: {
        type: 'boolean',
        field: { component: 'form/KToggleField', label: 'Active' }
      }
    },
    required: ['name', 'email', 'role']
  },

  event: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://kalisio.xyz/schemas/event.create.json#',
    title: 'Create event',
    type: 'object',
    properties: {
      title: {
        type: 'string',
        minLength: 2,
        maxLength: 128,
        field: { component: 'form/KTextField', label: 'Title' }
      },
      type: {
        type: 'string',
        field: {
          component: 'form/KSelectField',
          label: 'Type',
          options: [
            { label: 'Meeting', value: 'meeting' },
            { label: 'Task', value: 'task' },
            { label: 'Reminder', value: 'reminder' }
          ],
          clearable: false
        }
      },
      color: {
        type: 'string',
        default: '#1976D2',
        field: { component: 'form/KColorField', label: 'Color', clearable: false }
      },
      duration: {
        type: 'integer',
        default: 30,
        minimum: 5,
        maximum: 180,
        field: { component: 'form/KSliderField', label: 'Duration (min)', min: 5, max: 180, step: 5 }
      },
      public: {
        type: 'boolean',
        field: { component: 'form/KToggleField', label: 'Public' }
      }
    },
    required: ['title', 'type']
  }
}

// Singleton partagé entre les instances Edit et View
const currentValues = reactive({
  user: { name: 'Alice', email: 'alice@example.com', role: 'editor', color: '#1976D2', active: true },
  event: { title: 'Sprint planning', type: 'meeting', color: '#1976D2', duration: 60, public: true }
})

export default {
  components: { KForm },

  props: {
    readOnly: { type: Boolean, default: false }
  },

  template: `
    <div class="column q-gutter-md" style="max-width: 480px">
      <q-btn-toggle
        v-model="activeKey"
        spread
        no-caps
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          { label: 'User', value: 'user' },
          { label: 'Event', value: 'event' }
        ]"
      />

      <div :style="readOnly ? 'pointer-events: none; user-select: none' : ''">
        <k-form
          ref="formRef"
          :schema="schema"
          :values="values"
          @form-ready="onFormReady"
          @field-changed="onFieldChanged"
        />
      </div>

      <div v-if="!readOnly" class="row q-gutter-sm">
        <q-btn color="primary" label="Validate" :disable="!ready" @click="onValidate" />
        <q-btn flat label="Reset" :disable="!ready" @click="onClear" />
      </div>

      <q-card v-if="submitted" flat bordered>
        <q-card-section class="text-caption">
          <pre>{{ JSON.stringify(submitted, null, 2) }}</pre>
        </q-card-section>
      </q-card>
    </div>
  `,

  setup () {
    const formRef = ref(null)
    const activeKey = ref('user')
    const ready = ref(false)
    const submitted = ref(null)

    const schema = computed(() => schemas[activeKey.value])
    const values = computed(() => currentValues[activeKey.value])

    watch(activeKey, () => {
      ready.value = false
      submitted.value = null
    })

    function onFormReady () {
      ready.value = true
    }

    function onFieldChanged (name, val) {
      currentValues[activeKey.value][name] = val
      submitted.value = null
    }

    function onValidate () {
      const { isValid, values } = formRef.value.validate()
      if (isValid) submitted.value = values
    }

    function onClear () {
      formRef.value.clear()
      submitted.value = null
    }

    return { formRef, activeKey, schema, values, ready, submitted, onFormReady, onFieldChanged, onValidate, onClear }
  }
}
