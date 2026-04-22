<template>
  <div v-if="readOnly">
    <q-chip :id="properties.name + '-field'" dense>
      {{ model }}
    </q-chip>
  </div>
  <q-select v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    :multiple="multiple"
    :options="options"
    emit-value
    map-options
    use-input
    :dense="dense"
    :clearable="isClearable()"
    :error="hasError"
    :error-message="errorLabel"
    :disable="disabled"
    :autofocus="hasFocus"
    bottom-slots
    @filter="onFilter"
    @blur="onChanged"
    @update:model-value="onChanged"
  >
    <!-- options display -->
    <template v-slot:option="scope">
      <q-item
        :dense="dense"
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!-- no options display -->
    <template v-if="hasNoOption" v-slot:no-option>
      <p v-if="typeof noOption === 'string'" class="noOptionText">{{ noOption }}</p>
      <!-- Missing: loadComponent (KDK) — dynamic component not supported
      <Suspense v-else>
        <component v-if="noOptionComponent" :is="noOptionComponent" v-bind="noOptionsAttributes" />
      </Suspense>
      -->
    </template>
    <!-- selected item display -->
    <template v-slot:selected-item="scope">
      <q-chip v-if="chips && scope.opt.label"
        removable
        :dense="dense"
        :color="scope.opt.color"
        :textColor="scope.opt.textColor"
        :tabindex="scope.tabindex"
        @remove="scope.removeAtIndex(scope.index)"
      >
        <span :class="selectedClass()">
          {{ scope.opt.label }}
        </span>
      </q-chip>
      <span v-else :class="selectedClass()">
        {{ scope.opt.label }}
      </span>
    </template>
    <!-- Helper -->
    <!-- Missing Component: KAction -->
    <!--
    <template v-if="hasHelper" v-slot:append>
      <k-action
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
  </q-select>
</template>

<script>
import _ from 'lodash'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'
import { makeDiacriticPattern } from '../utils/diacritics.js'

export default {
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    function emptyModel () {
      return _.get(props.properties, 'multiselect', false) ? [] : null
    }
    return { ...useField(props, emit, { emptyModel }), emptyModel }
  },
  data () {
    return {
      filter: null
    }
  },
  watch: {
    options: {
      immediate: true,
      handler (opts) {
        if (_.isEmpty(this.filter) && opts.length === 1 && this.required) {
          this.$nextTick(() => {
            this.fill(opts[0].value)
            this.onChanged(opts[0].value)
          })
        }
      }
    }
  },
  computed: {
    dense () {
      return this.$props.dense
    },
    multiple () {
      return this.isMultiselect()
    },
    chips () {
      return this.hasChips()
    },
    options () {
      let opts = _.map(_.get(this.properties, 'field.options', []), option => {
        const label = this.$t(_.get(option, 'label', ''))
        return Object.assign({}, option, { label })
      })
      if (this.filter) {
        opts = _.filter(opts, option => {
          const regExp = new RegExp(makeDiacriticPattern(this.filter))
          return regExp.test(option.label.toLowerCase())
        })
      }
      return opts
    },
    hasNoOption () {
      return !_.isEmpty(_.get(this.properties, 'field.noOption', {}))
    },
    noOption () {
      return _.get(this.properties, 'field.noOption', null)
    }
    // Missing: noOptionComponent, noOptionsAttributes (require loadComponent from KDK)
    // noOptionComponent () { return loadComponent(this.properties.field.noOption.component) },
    // noOptionsAttributes () { return _.omit(this.properties.field.noOption, 'component') }
  },
  methods: {
    isMultiselect () {
      return _.get(this.properties, 'multiselect', false)
    },
    isClearable () {
      return _.get(this.properties, 'field.clearable', true)
    },
    hasChips () {
      return _.get(this.properties, 'field.chips', false)
    },
    getId (option) {
      let id = option.value
      // Complex object ?
      if (typeof id === 'object') {
        // Extract value property or use label if none
        const valueField = _.get(this.properties, 'field.valueField')
        if (valueField) id = _.get(id, valueField)
        else id = option.label
      } else {
        // Ensure string not eg number
        id = id.toString()
      }
      return _.kebabCase(id)
    },
    isEmpty () {
      return this.multiple ? _.isEmpty(this.model) : _.isNil(this.model)
    },
    clear () {
      this.fill(_.get(this.properties, 'default', this.emptyModel()))
    },
    selectedClass () {
      return _.get(this.properties, 'field.selectedClass', 'text-weight-regular')
    },
    onFilter (pattern, update) {
      if (pattern === '') {
        update(() => {
          this.filter = null
        })
        return
      }
      update(() => {
        this.filter = pattern.toLowerCase()
      })
    }
  }
}
</script>
