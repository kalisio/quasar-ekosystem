import { ref } from 'vue'
import { useQuasar, exportFile } from 'quasar'
import { KForm, schemaRegistry } from '@kalisio/quasar-form'
import designSchema from '@schemas/design.json'

const EXAMPLE = JSON.stringify(designSchema, null, 2)

export default {
  components: { KForm },

  template: `
    <div class="row q-gutter-lg justify-center">
      <div class="column q-gutter-sm" style="width: 440px">
        <div class="text-subtitle2">JSON Schema</div>
        <q-input
          v-model="raw"
          type="textarea"
          outlined
          :error="!!error"
          :error-message="error"
          input-style="font-family: monospace; font-size: 13px; min-height: 480px"
          @update:model-value="onInput"
        />
        <q-btn
          outline
          color="primary"
          icon="download"
          label="Download schema"
          :disable="!!error"
          @click="download"
        />
      </div>
      <div class="column q-gutter-sm" style="width: 440px">
        <div class="text-subtitle2">Preview</div>
        <div class="q-pa-md bg-grey-2">
          <k-form v-if="schema" :key="formKey" :schema="schema" />
          <div v-else class="text-grey text-caption">Le schéma JSON doit être valide pour afficher le formulaire.</div>
        </div>
      </div>
    </div>
  `,

  setup () {
    const $q = useQuasar()
    const raw = ref(EXAMPLE)
    const schema = ref(null)
    const error = ref('')
    const formKey = ref(0)
    let debounce = null

    function applySchema (value) {
      try {
        const parsed = JSON.parse(value)
        if (!parsed.$id) throw new Error('Le schéma doit avoir un champ "$id"')
        schemaRegistry.initialize()
        schema.value = parsed
        error.value = ''
        formKey.value++
      } catch (e) {
        schema.value = null
        error.value = e.message
      }
    }

    function onInput (value) {
      clearTimeout(debounce)
      debounce = setTimeout(() => applySchema(value), 400)
    }

    function download () {
      const filename = schema.value?.$id?.split('/').pop()?.replace('#', '') ?? 'schema.json'
      const blob = new Blob([raw.value], { type: 'application/json' })
      const status = exportFile(filename, blob, 'application/json')
      if (!status) {
        $q.notify({
          message: 'Error while downloading schema',
          color: 'negative',
          icon: 'error',
          position: 'bottom'
        })
      }
    }

    applySchema(EXAMPLE)

    return { raw, schema, error, formKey, onInput, download }
  }
}
