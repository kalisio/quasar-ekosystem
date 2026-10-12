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

<script setup>
import _ from 'lodash-es'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'
// Missing: RoleNames (KDK permission constant)
// import { RoleNames } from '../../../common/permissions'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])
const { t } = useI18n()

function emptyModel() {
  const defaultRoleNames = ['owner', 'manager', 'member']
  const roleNames = _.get(props.properties, 'field.roles', defaultRoleNames)
  return roleNames.length ? roleNames[0] : ''
}

const {
  model, label, hasError, errorLabel, disabled,
  fill, clear, value, validate, invalidate, onChanged, apply, submitted
} = useField(props, emit, { emptyModel })

function isEmpty() { return false }

function roles() {
  const defaultRoleNames = ['owner', 'manager', 'member']
  // Missing: RoleNames — using default list
  const roleNames = _.get(props.properties, 'field.roles', defaultRoleNames)
  return roleNames ? _.map(roleNames, role => ({ label: t(_.upperCase(role)), value: role })) : []
}

defineExpose({ fill, emptyModel, isEmpty, clear, value, validate, invalidate, apply, submitted, onChanged, hasError, roles })
</script>
