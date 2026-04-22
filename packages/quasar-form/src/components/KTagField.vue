<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <!-- Missing Component: KChip -->
    <!-- <KChip v-bind="model" :label="model.name" /> -->
    <q-chip :color="model.color" dense>
      {{ model.name }}
    </q-chip>
  </div>
  <q-select v-else
    ref="select"
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="items"
    :label="label"
    :multiple="properties.multiselect"
    autocomplete="off"
    hide-dropdown-icon
    use-input
    :clearable="isClearable"
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    :autofocus="hasFocus"
    bottom-slots
    :options="options"
    @filter="onSearch"
    @update:model-value="onSelected">
    <!-- Value display -->
    <template v-slot:selected-item="scope">
      <!-- Missing Component: KChip -->
      <!-- <KChip v-bind="scope.opt" :label="scope.opt.name" square removable @remove="scope.removeAtIndex(scope.index)" /> -->
      <q-chip
        square
        removable
        :color="scope.opt.color"
        :label="scope.opt.name"
        @remove="scope.removeAtIndex(scope.index)"
      />
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section v-if="scope.opt.create" class="col-auto">
          {{ scope.opt.name }}
        </q-item-section>
        <q-item-section v-else>
          <!-- Missing Component: KChip -->
          <!-- <KChip v-bind="scope.opt" :label="scope.opt.name" /> -->
          <q-chip :color="scope.opt.color" square dense :label="scope.opt.name" />
        </q-item-section>
        <!-- Missing Component: KPanel -->
        <!--
        <q-item-section v-if="!scope.opt.create" class="col-auto">
          <KPanel id="tag-actions" :content="getActions(scope.opt)" />
        </q-item-section>
        -->
      </q-item>
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import { inject } from 'vue'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'
// Missing Component: KChip
// import KChip from '../KChip.vue'

export default {
  // Missing Component: KChip
  // components: { KChip },
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    // Inject search and create functions — consumers must provide these via provide()
    const search = inject('search', async () => [])
    const createTag = inject('createTag', async () => null)
    function emptyModel () { return props.properties.multiselect ? [] : null }
    return { ...useField(props, emit, { emptyModel }), emptyModel, search, createTag }
  },
  data () {
    return {
      items: null,
      options: [],
      searchString: ''
    }
  },
  watch: {
    model: {
      handler (newModel) {
        this.items = newModel ? _.clone(newModel) : (this.properties.multiselect ? [] : null)
      },
      immediate: true,
      flush: 'sync'
    }
  },
  computed: {
    isClearable () {
      return _.get(this.properties, 'field.clearable', true)
    }
  },
  methods: {
    getId (item) {
      return _.kebabCase(item.name)
    },
    isEmpty () {
      return this.properties.multiselect ? _.isEmpty(this.model) : _.isNil(this.model)
    },
    fill (value) {
      this.model = value
      this.onChanged()
    },
    clear () {
      this.fill(_.get(this.properties, 'default', this.emptyModel()))
    },
    // Missing Component: KPanel
    // getActions (item) {
    //   if (item.scope !== 'user') return []
    //   return [{ ... }]
    // },
    async onSearch (pattern, update, abort) {
      if (pattern.length < _.get(this.properties, 'minCharsToSearch', 2)) {
        abort()
        return
      }
      this.searchString = pattern
      const results = await this.search(_.get(this.properties, 'services', []), pattern)
      update(() => {
        if (this.properties.multiselect) {
          this.options = _.differenceWith(results, this.items || [], (a, b) => a.name === b.name && a.color === b.color)
        } else this.options = results

        const hasInvalidMinLength = pattern.length < _.get(this.properties, 'minLength', 0)
        const hasInvalidMaxLength = pattern.length > _.get(this.properties, 'maxLength', 256)
        if (hasInvalidMinLength || hasInvalidMaxLength) return
        this.options = _.filter(this.options, item => !item.create)
        if (pattern !== '' && !_.find(results, { name: pattern })) {
          this.options.push({ name: pattern, color: 'grey', create: true })
        }
      })
    },
    async onSelected (value) {
      if (value) this.model = this.items
      else this.model = this.emptyModel()
      this.options = []
      this.$refs.select?.updateInputValue?.('')
      this.onChanged()

      if (!this.model) return
      const tagList = _.isArray(this.model) ? this.model : [this.model]
      for (const item of tagList) {
        if (item.create) {
          const hasInvalidMinLength = item.name.length < _.get(this.properties, 'minLength', 0)
          const hasInvalidMaxLength = item.name.length > _.get(this.properties, 'maxLength', 256)
          if (hasInvalidMinLength || hasInvalidMaxLength) return
          _.defaults(item, {
            service: _.get(this.properties, 'field.service'),
            property: _.get(this.properties, 'field.property'),
            scope: 'user',
            color: 'grey',
            description: ''
          })
          delete item.create
          await this.createTag(item)
        }
      }
    }
  }
}
</script>
