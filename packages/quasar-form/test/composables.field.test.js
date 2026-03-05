import { describe, it, expect, beforeEach, vi } from 'vitest'
import { reactive, nextTick } from 'vue'
import { useField } from '../src/composables/field.js'

vi.mock('quasar', () => ({ openURL: vi.fn() }))
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key) => key }) }))

function makeProps (propertiesOverride = {}, values = null) {
  return reactive({
    properties: {
      name: 'username',
      description: 'Your username',
      ...propertiesOverride
    },
    values
  })
}

describe('useField', () => {
  let props
  let emit
  let field

  beforeEach(() => {
    props = makeProps()
    emit = vi.fn()
    field = useField(props, emit)
  })

  describe('initial state', () => {
    it('model starts as null', () => {
      expect(field.model.value).toBeNull()
    })

    it('error starts empty', () => {
      expect(field.error.value).toBe('')
    })

    it('initializes model from values when provided', () => {
      const p = makeProps({}, { username: 'alice' })
      const f = useField(p, emit)
      expect(f.model.value).toBe('alice')
    })
  })

  describe('emptyModel', () => {
    it('returns null', () => {
      expect(field.emptyModel()).toBeNull()
    })
  })

  describe('fill', () => {
    it('sets the model value', () => {
      field.fill('alice')
      expect(field.model.value).toBe('alice')
    })

    it('clears the error', () => {
      field.invalidate('some error')
      field.fill('alice')
      expect(field.error.value).toBe('')
    })
  })

  describe('clear', () => {
    it('resets model to null when no default', () => {
      field.fill('alice')
      field.clear()
      expect(field.model.value).toBeNull()
    })

    it('resets model to default value when defined', () => {
      const p = makeProps({ default: 'guest' })
      const f = useField(p, emit)
      f.fill('alice')
      f.clear()
      expect(f.model.value).toBe('guest')
    })
  })

  describe('updateValue', () => {
    it('fills when value is not nil', () => {
      field.updateValue('bob')
      expect(field.model.value).toBe('bob')
    })

    it('clears when value is null', () => {
      field.fill('bob')
      field.updateValue(null)
      expect(field.model.value).toBeNull()
    })

    it('clears when value is undefined', () => {
      field.fill('bob')
      field.updateValue(undefined)
      expect(field.model.value).toBeNull()
    })
  })

  describe('isEmpty', () => {
    it('returns true when model is null', () => {
      expect(field.isEmpty()).toBe(true)
    })

    it('returns false when model has a value', () => {
      field.fill('alice')
      expect(field.isEmpty()).toBe(false)
    })
  })

  describe('value', () => {
    it('returns the current model value', () => {
      field.fill('charlie')
      expect(field.value()).toBe('charlie')
    })
  })

  describe('validate / invalidate', () => {
    it('validate clears the error', () => {
      field.invalidate('bad input')
      field.validate()
      expect(field.error.value).toBe('')
    })

    it('invalidate sets the error message', () => {
      field.invalidate('required field')
      expect(field.error.value).toBe('required field')
    })
  })

  describe('onChanged', () => {
    it('emits field-changed with field name and value', async () => {
      field.fill('dave')
      await field.onChanged()
      expect(emit).toHaveBeenCalledWith('field-changed', 'username', 'dave')
    })

    it('clears null model when field is not nullable', async () => {
      field.fill(null)
      await field.onChanged()
      expect(field.model.value).toBeNull()
      expect(emit).toHaveBeenCalledWith('field-changed', 'username', null)
    })

    it('keeps null model when field is nullable', async () => {
      const p = makeProps({ nullable: true })
      const f = useField(p, emit)
      f.model.value = null
      await f.onChanged()
      expect(f.model.value).toBeNull()
      expect(emit).toHaveBeenCalledWith('field-changed', 'username', null)
    })
  })

  describe('apply', () => {
    it('sets the field value on a target object', () => {
      field.fill('eve')
      const obj = {}
      field.apply(obj, 'username')
      expect(obj.username).toBe('eve')
    })

    it('supports nested field paths', () => {
      field.fill('eve')
      const obj = {}
      field.apply(obj, 'user.name')
      expect(obj.user.name).toBe('eve')
    })
  })

  describe('computed: label', () => {
    it('returns description when no field.label is defined', () => {
      expect(field.label.value).toBe('Your username')
    })

    it('returns field.label when defined', () => {
      const p = makeProps({ field: { label: 'Username' } })
      const f = useField(p, emit)
      expect(f.label.value).toBe('Username')
    })

    it('uses the i18n t() translator for the label', () => {
      const p = makeProps({ field: { label: 'myKey' } })
      const f = useField(p, emit)
      // mock returns the key as-is
      expect(f.label.value).toBe('myKey')
    })
  })

  describe('computed: hasHelper / helper fields', () => {
    it('hasHelper is false when no helper is defined', () => {
      expect(field.hasHelper.value).toBe(false)
    })

    it('hasHelper is true when helper object is set', () => {
      const p = makeProps({ field: { helper: { label: 'Help', tooltip: 'Info' } } })
      const f = useField(p, emit)
      expect(f.hasHelper.value).toBe(true)
    })

    it('returns helper sub-fields', () => {
      const p = makeProps({ field: { helper: { label: 'Help', icon: 'info', tooltip: 'Tooltip', url: 'http://x', dialog: 'dlg', context: 'ctx' } } })
      const f = useField(p, emit)
      expect(f.helperLabel.value).toBe('Help')
      expect(f.helperIcon.value).toBe('info')
      expect(f.helperTooltip.value).toBe('Tooltip')
      expect(f.helperUrl.value).toBe('http://x')
      expect(f.helperDialog.value).toBe('dlg')
      expect(f.helperContext.value).toBe('ctx')
    })
  })

  describe('computed: hasFocus / disabled / hasError / errorLabel', () => {
    it('hasFocus is false by default', () => {
      expect(field.hasFocus.value).toBe(false)
    })

    it('hasFocus reflects field.focus', () => {
      const p = makeProps({ field: { focus: true } })
      const f = useField(p, emit)
      expect(f.hasFocus.value).toBe(true)
    })

    it('disabled is false by default', () => {
      expect(field.disabled.value).toBe(false)
    })

    it('disabled reflects field.disabled', () => {
      const p = makeProps({ field: { disabled: true } })
      const f = useField(p, emit)
      expect(f.disabled.value).toBe(true)
    })

    it('hasError is false when no error', () => {
      expect(field.hasError.value).toBe(false)
    })

    it('hasError is true after invalidate', () => {
      field.invalidate('oops')
      expect(field.hasError.value).toBe(true)
    })

    it('errorLabel returns the error message', () => {
      field.invalidate('invalid value')
      expect(field.errorLabel.value).toBe('invalid value')
    })

    it('errorLabel uses field.errorLabel override', () => {
      const p = makeProps({ field: { errorLabel: 'Custom error' } })
      const f = useField(p, emit)
      expect(f.errorLabel.value).toBe('Custom error')
    })
  })

  describe('watch: values', () => {
    it('updates model when values change', async () => {
      props.values = { username: 'frank' }
      await nextTick()
      expect(field.model.value).toBe('frank')
    })

    it('clears model when values become null', async () => {
      props.values = { username: 'frank' }
      await nextTick()
      props.values = null
      await nextTick()
      expect(field.model.value).toBeNull()
    })
  })

  describe('onHelperDialogConfirmed', () => {
    it('calls openURL when context has a url', async () => {
      const { openURL } = await import('quasar')
      field.onHelperDialogConfirmed({ url: 'https://example.com' })
      expect(openURL).toHaveBeenCalledWith('https://example.com')
    })

    it('does not call openURL when context has no url', async () => {
      const { openURL } = await import('quasar')
      openURL.mockClear()
      field.onHelperDialogConfirmed({})
      expect(openURL).not.toHaveBeenCalled()
    })
  })
})
