import { ref, reactive, computed, watch } from 'vue'
import { KForm } from '@kalisio/quasar-form'
import userSchema from '@schemas/user.create.json'
import eventSchema from '@schemas/event.create.json'

const schemas = { user: userSchema, event: eventSchema }

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
    <div class="row q-gutter-md justify-center">
      <div class="column q-gutter-md" style="min-width: 400px">
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

        <div class="q-pa-md bg-grey-2" :style="readOnly ? 'pointer-events: none; user-select: none' : ''">
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
      </div>

      <q-card flat bordered style="min-width: 260px">
        <q-card-section class="text-caption">
          <pre>{{ JSON.stringify(displayValues, null, 2) }}</pre>
        </q-card-section>
      </q-card>
    </div>
  `,

  setup () {
    const formRef = ref(null)
    const activeKey = ref('user')
    const ready = ref(false)
    const displayValues = ref({ ...currentValues.user })

    const schema = computed(() => schemas[activeKey.value])
    const values = computed(() => currentValues[activeKey.value])

    watch(activeKey, () => {
      ready.value = false
      displayValues.value = { ...currentValues[activeKey.value] }
    })

    function onFormReady () {
      ready.value = true
    }

    function onFieldChanged (name, val) {
      currentValues[activeKey.value][name] = val
    }

    function onValidate () {
      const { isValid, values } = formRef.value.validate()
      if (isValid) displayValues.value = values
    }

    function onClear () {
      formRef.value.clear()
      displayValues.value = { ...currentValues[activeKey.value] }
    }

    return { formRef, activeKey, schema, values, ready, displayValues, onFormReady, onFieldChanged, onValidate, onClear }
  }
}
