import _ from 'lodash'
import { ref, computed, watch } from 'vue'
import { openURL } from 'quasar'

export function useField (props, emit, { t } = {}) {
  // Translate if a translator function is provided, otherwise return the key as-is
  const tie = t || ((key) => key)

  // State
  const model = ref(emptyModel())
  const error = ref('')

  // Computed
  const label = computed(() => {
    const description = _.get(props.properties, 'description', '')
    return tie(_.get(props.properties.field, 'label', description))
  })
  const hasHelper = computed(() => !_.isEmpty(_.get(props.properties.field, 'helper', {})))
  const helperLabel = computed(() => _.get(props.properties.field?.helper, 'label', null))
  const helperIcon = computed(() => _.get(props.properties.field?.helper, 'icon', undefined))
  const helperTooltip = computed(() => _.get(props.properties.field?.helper, 'tooltip', ''))
  const helperUrl = computed(() => _.get(props.properties.field?.helper, 'url', null))
  const helperDialog = computed(() => _.get(props.properties.field?.helper, 'dialog', null))
  const helperContext = computed(() => _.get(props.properties.field?.helper, 'context', null))
  const hasFocus = computed(() => _.get(props.properties.field, 'focus', false))
  const hasError = computed(() => !_.isEmpty(error.value))
  const errorLabel = computed(() => {
    let err = _.get(props.properties.field, 'errorLabel', '')
    if (!err) err = error.value
    return tie(err)
  })
  const disabled = computed(() => _.get(props.properties.field, 'disabled', false))

  // Watch values prop to sync model
  watch(() => props.values, (values) => {
    if (values) updateValue(_.get(values, props.properties.name))
    else clear()
  })

  // Methods
  function emptyModel () {
    return null
  }
  function isEmpty () {
    return _.isEqual(model.value, emptyModel())
  }
  function value () {
    return model.value
  }
  function fill (val) {
    model.value = val
    error.value = ''
  }
  function clear () {
    fill(_.get(props.properties, 'default', emptyModel()))
  }
  function updateValue (val) {
    if (_.isNil(val)) clear()
    else fill(val)
  }
  function validate () {
    error.value = ''
  }
  function invalidate (err) {
    error.value = err
  }
  async function onChanged () {
    // Quasar resets the model to null when clearing but in the schema an empty model might be a different value
    const nullable = _.get(props.properties, 'nullable', false)
    if (_.isNil(model.value) && !nullable) {
      clear()
    }
    emit('field-changed', props.properties.name, model.value)
  }
  function apply (object, field) {
    // By default simply set the current value on the given object field to apply the form
    _.set(object, field, value())
  }
  function submitted (object, field) {
    // To be overloaded if you need to perform specific operations after the form has been submitted
  }
  function onHelperDialogConfirmed (context) {
    if (context.url) openURL(context.url)
  }

  // Initialize model from values if provided
  if (props.values) updateValue(_.get(props.values, props.properties.name))

  return {
    model,
    error,
    label,
    hasHelper,
    helperLabel,
    helperIcon,
    helperTooltip,
    helperUrl,
    helperDialog,
    helperContext,
    hasFocus,
    hasError,
    errorLabel,
    disabled,
    emptyModel,
    isEmpty,
    value,
    fill,
    clear,
    updateValue,
    validate,
    invalidate,
    onChanged,
    apply,
    submitted,
    onHelperDialogConfirmed
  }
}
