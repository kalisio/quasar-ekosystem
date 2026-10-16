import { get, isEmpty as _isEmpty, isEqual, isNil, set } from 'lodash-es'
import { ref, computed, watch, getCurrentInstance } from 'vue'
import { openURL } from 'quasar'
import { useI18n } from 'vue-i18n'

// opts.emptyModel — optional function () => <empty value for this field type>
// Defaults to () => null. Override when the field's natural empty state is not null
// (e.g. [] for multi-select, '' for text, { width, height } for resolution).
// Providing it ensures clear() and updateValue(null) reset to the correct value
// instead of null, even when called from within the composable.
export function useField (props, emit, opts = {}) {
  const _emptyModel = opts.emptyModel ?? (() => null)
  const { t } = useI18n()

  // State
  const model = ref(_emptyModel())
  const error = ref('')

  // Computed
  const label = computed(() => {
    const description = get(props.properties, 'description', '')
    return t(get(props.properties.field, 'label', description))
  })
  const hasHelper = computed(() => !_isEmpty(get(props.properties.field, 'helper', {})))
  const helperLabel = computed(() => get(props.properties.field?.helper, 'label', null))
  const helperIcon = computed(() => get(props.properties.field?.helper, 'icon', undefined))
  const helperTooltip = computed(() => get(props.properties.field?.helper, 'tooltip', ''))
  const helperUrl = computed(() => get(props.properties.field?.helper, 'url', null))
  const helperDialog = computed(() => get(props.properties.field?.helper, 'dialog', null))
  const helperContext = computed(() => get(props.properties.field?.helper, 'context', null))
  const hasFocus = computed(() => get(props.properties.field, 'focus', false))
  const hasError = computed(() => !_isEmpty(error.value))
  const errorLabel = computed(() => {
    let err = get(props.properties.field, 'errorLabel', '')
    if (!err) err = error.value
    return t(err)
  })
  const disabled = computed(() => get(props.properties.field, 'disabled', false))

  // Watch values prop to sync model
  watch(() => props.values, (values) => {
    if (values) updateValue(get(values, props.properties.name))
    else clear()
  })

  // Methods
  function emptyModel () {
    return _emptyModel()
  }
  function isEmpty () {
    return isEqual(model.value, emptyModel())
  }
  function value () {
    return model.value
  }
  function fill (val) {
    model.value = val
    error.value = ''
  }
  function clear () {
    fill(get(props.properties, 'default', emptyModel()))
  }
  function updateValue (val) {
    if (isNil(val)) clear()
    else fill(val)
  }
  function validate () {
    error.value = ''
  }
  function invalidate (err) {
    error.value = err
  }
  async function onChanged () {
    // Quasar resets the model to null when clearing but the field's emptyModel may differ
    const nullable = get(props.properties, 'nullable', false)
    if (isNil(model.value) && !nullable) {
      clear()
    }
    emit('field-changed', props.properties.name, model.value)
  }
  function apply (object, field) {
    // By default simply set the current value on the given object field to apply the form
    set(object, field, value())
  }
  function submitted (object, field) {
    // To be overloaded if you need to perform specific operations after the form has been submitted
  }
  function onHelperDialogConfirmed (context) {
    if (context.url) openURL(context.url)
  }

  // Initialize model from values if provided
  if (props.values) updateValue(get(props.values, props.properties.name))

  // Don't expose functions that the component already defines in its own methods —
  // setup() wins over methods in Vue 3, so we must yield to avoid shadowing them.
  const componentMethods = getCurrentInstance()?.type?.methods || {}
  const expose = {
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
    value,
    updateValue,
    validate,
    invalidate,
    onChanged,
    apply,
    submitted,
    onHelperDialogConfirmed
  }
  if (!componentMethods.emptyModel) expose.emptyModel = emptyModel
  if (!componentMethods.isEmpty) expose.isEmpty = isEmpty
  if (!componentMethods.fill) expose.fill = fill
  if (!componentMethods.clear) expose.clear = clear
  return expose
}
