import { reactive, markRaw } from 'vue'
import { KTextField, KNumberField, KSelectField, KColorField, KSliderField, KToggleField } from '@kalisio/quasar-form'

export default {
  template: `
    <div class="row q-col-gutter-md">
      <div v-for="demo in demos" :key="demo.name" class="col-xs-12 col-sm-6 col-md-4">
        <q-card>
          <q-card-section class="text-subtitle1 text-weight-medium">{{ demo.label }}</q-card-section>
          <q-card-section>
            <component
              :is="demo.component"
              :properties="demo.properties"
              :values="values"
              :read-only="readOnly"
              @field-changed="(name, val) => (values[name] = val)"
            />
          </q-card-section>
          <q-separator />
          <q-card-section class="text-caption text-grey-7">
            {{ JSON.stringify(values[demo.name] ?? null) }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  `,

  props: {
    readOnly: { type: Boolean, default: false }
  },

  setup () {
    const values = reactive({
      firstName: 'Alice',
      age: 30,
      country: 'fr',
      color: '#1976D2',
      temperature: 22,
      active: true
    })

    const demos = [
      {
        name: 'firstName',
        label: 'KTextField',
        component: markRaw(KTextField),
        properties: { name: 'firstName', field: { label: 'Prénom' } }
      },
      {
        name: 'age',
        label: 'KNumberField',
        component: markRaw(KNumberField),
        properties: { name: 'age', field: { label: 'Âge' } }
      },
      {
        name: 'country',
        label: 'KSelectField',
        component: markRaw(KSelectField),
        properties: {
          name: 'country',
          field: {
            label: 'Pays',
            options: [
              { label: 'France', value: 'fr' },
              { label: 'Allemagne', value: 'de' },
              { label: 'Espagne', value: 'es' },
              { label: 'Italie', value: 'it' }
            ]
          }
        }
      },
      {
        name: 'color',
        label: 'KColorField',
        component: markRaw(KColorField),
        properties: { name: 'color', default: '#1976D2', field: { label: 'Couleur' } }
      },
      {
        name: 'temperature',
        label: 'KSliderField',
        component: markRaw(KSliderField),
        properties: {
          name: 'temperature',
          field: { label: 'Température (°C)', min: -20, max: 50, step: 1, markers: true }
        }
      },
      {
        name: 'active',
        label: 'KToggleField',
        component: markRaw(KToggleField),
        properties: { name: 'active', field: { label: 'Actif' } }
      }
    ]

    return { values, demos }
  }
}
