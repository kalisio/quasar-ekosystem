import { ref, defineComponent, onBeforeUnmount } from 'vue'
import { useRequest } from '@kalisio/quasar-core'

// Public endpoint that deliberately delays 5 seconds before responding
const SLOW_URL = 'https://httpbin.org/delay/5'

// ── Without useRequest ─────────────────────────────────────────────────────
// Plain fetch: request stays in-flight after unmount, callback still runs
// and tries to update reactive state on a dead component.
const FetcherWithout = defineComponent({
  name: 'FetcherWithout',
  setup () {
    const status = ref('idle')

    async function load () {
      status.value = 'loading…'
      try {
        const res = await fetch(SLOW_URL)
        const json = await res.json()
        status.value = 'done — got ' + JSON.stringify(json).slice(0, 40)
        console.warn('[without] fetch resolved AFTER unmount if you navigated away — result ignored by Vue but request was never cancelled')
      } catch (e) {
        status.value = 'error: ' + e.message
        console.error('[without] unhandled error after unmount:', e)
      }
    }

    onBeforeUnmount(() => {
      console.warn('[without] unmounting — fetch is still in flight! Check the Network tab.')
    })

    return { status, load }
  },
  template: `
    <q-card flat bordered>
      <q-card-section class="text-subtitle1 text-negative">❌ Sans useRequest</q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-mb-sm text-caption">Statut : <strong>{{ status }}</strong></div>
        <q-btn color="negative" label="Démarrer la requête (5 s)" :disable="status === 'loading…'" @click="load" />
      </q-card-section>
      <q-card-section class="text-caption text-grey-7">
        Démontez le composant pendant le chargement → la requête reste active dans le Network tab, et le callback s'exécute sur un composant mort.
      </q-card-section>
    </q-card>
  `
})

// ── With useRequest ────────────────────────────────────────────────────────
// useRequest registers onBeforeUnmount → req.abort() and the fetch wrapper
// returns undefined silently, so the callback exits cleanly.
const FetcherWith = defineComponent({
  name: 'FetcherWith',
  setup () {
    const status = ref('idle')
    const { fetch: managedFetch } = useRequest()

    async function load () {
      status.value = 'loading…'
      try {
        const res = await managedFetch(SLOW_URL)
        if (!res) { status.value = 'annulée (composant démonté)'; return }
        const json = await res.json()
        status.value = 'done — got ' + JSON.stringify(json).slice(0, 40)
      } catch (e) {
        status.value = 'erreur : ' + e.message
      }
    }

    onBeforeUnmount(() => {
      console.info('[with] unmounting — useRequest annule automatiquement la requête.')
    })

    return { status, load }
  },
  template: `
    <q-card flat bordered>
      <q-card-section class="text-subtitle1 text-positive">✅ Avec useRequest</q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-mb-sm text-caption">Statut : <strong>{{ status }}</strong></div>
        <q-btn color="positive" label="Démarrer la requête (5 s)" :disable="status === 'loading…'" @click="load" />
      </q-card-section>
      <q-card-section class="text-caption text-grey-7">
        Démontez le composant pendant le chargement → la requête est annulée (Network tab: "cancelled"), le callback sort proprement.
      </q-card-section>
    </q-card>
  `
})

// ── Page ───────────────────────────────────────────────────────────────────
export default {
  components: { FetcherWithout, FetcherWith },
  setup () {
    const showWithout = ref(true)
    const showWith = ref(true)
    return { showWithout, showWith }
  },
  template: `
    <div class="q-gutter-lg">

      <q-banner class="bg-blue-1">
        <strong>Scénario :</strong>
        cliquez "Démarrer la requête" sur l'un des deux composants, puis cliquez
        "Démonter" <em>avant</em> que les 5 secondes s'écoulent.
        Ouvrez l'onglet <strong>Network</strong> des DevTools pour voir la différence.
      </q-banner>

      <div class="row q-gutter-md">

        <div class="col">
          <div class="q-mb-sm">
            <q-btn size="sm" :label="showWithout ? 'Démonter ❌' : 'Monter ❌'"
              :color="showWithout ? 'negative' : 'grey'"
              outline @click="showWithout = !showWithout" />
          </div>
          <fetcher-without v-if="showWithout" />
          <q-card v-else flat bordered class="text-center q-pa-md text-grey-6">composant démonté</q-card>
        </div>

        <div class="col">
          <div class="q-mb-sm">
            <q-btn size="sm" :label="showWith ? 'Démonter ✅' : 'Monter ✅'"
              :color="showWith ? 'positive' : 'grey'"
              outline @click="showWith = !showWith" />
          </div>
          <fetcher-with v-if="showWith" />
          <q-card v-else flat bordered class="text-center q-pa-md text-grey-6">composant démonté</q-card>
        </div>

      </div>
    </div>
  `
}
