<template>
  <div v-if="readOnly && model" :id="properties.name + '-field'">
    <q-chip dense>{{ model }}</q-chip>
  </div>
  <q-select v-else
    ref="select"
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :multiple="multiple"
    autocomplete="off"
    hide-dropdown-icon
    emit-value
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
        {{ scope.opt }}
      </q-chip>
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="scope.opt.id"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.value }}</q-item-label>
          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
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
    // Inject a search function: (serviceConfig, pattern) => Promise<items[]>
    const search = inject('search', async () => [])
    function emptyModel () {
      return _.get(props.properties, 'field.multiple', false) ? [] : null
    }
    return { ...useField(props, emit, { emptyModel }), emptyModel, search }
  },
  data () {
    return {
      options: []
    }
  },
  computed: {
    multiple () {
      return _.get(this.properties, 'field.multiple', false)
    }
  },
  methods: {
    isEmpty () {
      return this.multiple ? _.isEmpty(this.model) : _.isNil(this.model)
    },
    clear () {
      this.model = _.get(this.properties, 'default', this.emptyModel())
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < 2) { abort(); return }
      const serviceConfig = {
        service: _.get(this.properties, 'field.service'),
        field: _.get(this.properties, 'field.propertyField'),
        baseQuery: _.get(this.properties, 'field.baseQuery')
      }
      const results = await this.search(serviceConfig, pattern)
      update(() => {
        const valueField = _.get(this.properties, 'field.propertyField')
        const descriptionField = _.get(this.properties, 'field.descriptionField', 'description')
        const newOptions = _.map(results, option => ({
          id: _.kebabCase(_.get(option, valueField)),
          value: _.get(option, valueField),
          description: _.get(option, descriptionField)
        }))
        if (this.multiple) {
          this.options = _.differenceWith(newOptions, _.castArray(this.model || []), (item1, item2) => item1.id === item2)
        } else this.options = newOptions
      })
    },
    onSelected (value) {
      if (!value) this.model = this.emptyModel()
      this.options = []
      this.$refs.select?.updateInputValue?.('')
      this.onChanged()
    }
  }
}
</script>
