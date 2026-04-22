<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip dense>{{ model }}</q-chip>
  </div>
  <q-field v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    :model-value="model"
    :label="label"
    borderless
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
    @update:model-value="onChanged"
  >
    <template v-slot:control>
      <q-option-group
        :id="properties.name + '-field'"
        v-model="model"
        :options="roles()"
        inline
        @update:model-value="onChanged"
      />
    </template>
  </q-field>
</template>

<script>
import _ from 'lodash'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'
// Missing: RoleNames (KDK permission constant)
// import { RoleNames } from '../../../common/permissions'

export default {
  // Missing Mixin: baseField
  // mixins: [baseField],
  props: fieldProps,
  emits: ['field-changed'],
  setup (props, { emit }) {
    function emptyModel () {
      const defaultRoleNames = ['owner', 'manager', 'member']
      const roleNames = _.get(props.properties, 'field.roles', defaultRoleNames)
      return roleNames.length ? roleNames[0] : ''
    }
    return { ...useField(props, emit, { emptyModel }), emptyModel }
  },
  methods: {
    roles () {
      const defaultRoleNames = ['owner', 'manager', 'member']
      // Missing: RoleNames — using default list
      // const roleNames = _.get(this.properties, 'field.roles', RoleNames)
      const roleNames = _.get(this.properties, 'field.roles', defaultRoleNames)
      return roleNames ? _.map(roleNames, role => { return { label: this.$t(_.upperCase(role)), value: role } }) : []
    },
    emptyModel () {
      const roleNames = _.get(this.properties, 'field.roles', ['owner', 'manager', 'member'])
      return roleNames ? roleNames[0] : ''
    },
    isEmpty () {
      // Can't actually be
      return false
    },
    clear () {
      this.fill(_.get(this.properties, 'default', this.emptyModel()))
    }
  },
  created () {
    // Missing: RoleNames — using default list
    // this.roleNames = _.get(this.properties, 'field.roles', RoleNames)
    if (!this.model) this.model = this.emptyModel()
  }
}
</script>
