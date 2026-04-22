<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-chip dense>{{ getLabel(model) }}</q-chip>
  </div>
  <q-select v-else
    ref="select"
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="items"
    :label="label"
    :multiple="multiple"
    autocomplete="off"
    hide-dropdown-icon
    use-input
    clearable
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    :autofocus="hasFocus"
    bottom-slots
    :options="options"
    @filter="onSearch"
    @update:model-value="onSelected"
  >
    <!-- Value display -->
    <template v-slot:selected-item="scope">
      <q-chip
        square
        removable
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        color="primary"
        text-color="white"
      >
        <q-avatar v-if="getIcon(scope.opt)" :icon="getIcon(scope.opt)" color="primary" />
        {{ getLabel(scope.opt) }}
      </q-chip>
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section v-if="getIcon(scope.opt)" avatar>
          <q-icon :name="getIcon(scope.opt)" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ getLabel(scope.opt) }}</q-item-label>
          <q-item-label caption>{{ getDescription(scope.opt) }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import { inject } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

export default {
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    // Inject a search function: (services, pattern) => Promise<items[]>
    const search = inject('search', async () => [])
    function emptyModel () {
      return _.get(props.properties, 'multiselect', false) ? [] : null
    }
    return { ...useField(props, emit, { emptyModel }), emptyModel, search }
  },
  data () {
    return {
      items: null,
      options: []
    }
  },
  watch: {
    model: {
      handler (newModel) {
        this.items = newModel ? _.clone(newModel) : (this.multiple ? [] : null)
      },
      immediate: true,
      flush: 'sync'
    }
  },
  computed: {
    multiple () {
      return _.get(this.properties, 'multiselect', false)
    },
    hasSingleService () {
      const services = _.uniqBy(_.get(this.properties, 'services', []), 'service')
      return services.length === 1
    }
  },
  methods: {
    getServiceForItem (item) {
      return this.hasSingleService
        ? _.get(this.properties, 'services[0]')
        : _.find(_.get(this.properties, 'services', []), { service: item.service })
    },
    getId (item) {
      return _.kebabCase(this.getLabel(item))
    },
    getLabel (item) {
      const service = this.getServiceForItem(item)
      return _.get(item, service?.field || 'name', '')
    },
    getDescription (item) {
      const service = this.getServiceForItem(item)
      return _.get(item, service?.description || 'description', '')
    },
    getIcon (item) {
      return _.get(item, 'icon.name', _.get(item, 'icon', ''))
    },
    isEmpty () {
      return this.multiple ? _.isEmpty(this.model) : _.isNil(this.model)
    },
    fill (value) {
      this.model = value
      this.onChanged()
    },
    clear () {
      this.fill(_.get(this.properties, 'default', this.emptyModel()))
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < 2) { abort(); return }
      const results = await this.search(_.get(this.properties, 'services', []), pattern)
      update(() => {
        if (this.multiple) {
          this.options = _.differenceWith(results, this.items || [], (item1, item2) => {
            return _.get(item1, item1.field) === _.get(item2, item2.field) && item1.service === item2.service
          })
        } else this.options = results
      })
    },
    onSelected (value) {
      if (value) {
        this.model = this.multiple ? this.items : this.items
      } else this.model = this.emptyModel()
      this.options = []
      this.$refs.select?.updateInputValue?.('')
      this.onChanged()
    }
  }
}
</script>
