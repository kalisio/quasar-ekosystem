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
        :options="roles"
        inline
        @update:model-value="onChanged"
      />
    </template>
  </q-field>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useField } from '../composables/index.js'
import { fieldProps } from '../utils/index.js'

const props = defineProps(fieldProps)
const emit = defineEmits(['field-changed'])

const defaultRoleNames = ['owner', 'manager', 'member']

const roles = computed(() => {
  const roleNames = _.get(props.properties, 'field.roles', defaultRoleNames)
  return _.map(roleNames, role => ({ label: useI18n().t(role.toUpperCase()), value: role }))
})

const field = useField(props, emit)
const { model, label, hasError, errorLabel, disabled, fill, onChanged } = field

function emptyModel () { return roles.value.length ? roles.value[0].value : '' }
function isEmpty () { return false }
function clear () { fill(_.get(props.properties, 'default', emptyModel())) }

// Initialize with first role if no value
if (!model.value) model.value = emptyModel()

defineExpose({ properties: props.properties, ...field, roles, emptyModel, isEmpty, clear })
</script>
