import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import KFileField from '../../../src/components/KFileField.vue'

const fieldStub = { template: '<div><slot name="control" /></div>', props: ['modelValue'] }

function makeProps (propertiesOverride = {}) {
  return { properties: { name: 'test', field: {}, ...propertiesOverride } }
}

describe('KFileField', () => {
  const fileStub = { template: '<input type="file" />', props: ['modelValue', 'accept', 'multiple'], emits: ['update:modelValue', 'rejected'] }
  const stubs = { 'q-file': fileStub, 'q-field': fieldStub, 'q-chip': true }

  function makeFile (name = 'test.txt', type = 'text/plain') {
    return { name, type, size: 100, File: {} }
  }

  // q-file (file picker) is shown when no file is selected yet
  it('renders q-file in edit mode when model is empty', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  // Once a file is selected, q-file is replaced by q-field showing the file info
  it('renders q-field when model already has a file', () => {
    const wrapper = mount(KFileField, { props: { ...makeProps(), values: { test: makeFile() } }, global: { stubs } })
    expect(wrapper.find('input[type="file"]').exists()).toBe(false)
  })

  // Chips are used to display selected files in readOnly mode
  it('renders chips in readOnly mode for a single file', () => {
    const wrapper = mount(KFileField, { props: { ...makeProps(), readOnly: true, values: { test: makeFile('photo.jpg') } }, global: { stubs } })
    expect(wrapper.findAll('q-chip-stub').length).toBe(1)
  })

  // onFileCleared is triggered by the clear button inside q-field; it resets both model and files ref
  it('onFileCleared resets model and files ref', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(makeFile())
    wrapper.vm.onFileCleared()
    expect(wrapper.vm.files).toBeNull()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  // onFilesChanged is called when the q-file input value changes
  it('onFilesChanged builds a single-file model', async () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.files = { name: 'img.png', type: 'image/png', size: 200 }
    await wrapper.vm.onFilesChanged()
    expect(wrapper.vm.value()).toMatchObject({ name: 'img.png', type: 'image/png' })
  })

  it('onFilesChanged builds an array model for multiple', async () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { multiple: true } }), global: { stubs } })
    wrapper.vm.files = [{ name: 'a.txt', type: 'text/plain' }, { name: 'b.txt', type: 'text/plain' }]
    await wrapper.vm.onFilesChanged()
    expect(wrapper.vm.value()).toHaveLength(2)
  })

  // displayName builds a human-readable label from the selected file(s)
  it('displayName returns filename for single file', () => {
    const wrapper = mount(KFileField, { props: { ...makeProps(), values: { test: makeFile('report.pdf') } }, global: { stubs } })
    expect(wrapper.vm.displayName).toBe('report.pdf')
  })

  // If values prop changes after mount, the model should update reactively
  it('values prop change updates model reactively', async () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    const f = makeFile('new.txt')
    await wrapper.setProps({ values: { test: f } })
    await nextTick()
    expect(wrapper.vm.value()).toEqual(f)
  })

  // filterSelectedFiles allows post-selection filtering (e.g., enforce extension)
  it('filterSelectedFiles keeps only files whose name includes field.filter', () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { filter: '.csv' } }), global: { stubs } })
    const files = [{ name: 'data.csv' }, { name: 'image.png' }]
    expect(wrapper.vm.filterSelectedFiles(files)).toEqual([{ name: 'data.csv' }])
  })

  /* it('renders a chip per file in readOnly mode with multiple=true', () => { ... }) */
  /* it('emptyModel returns null for single-file mode', () => { ... }) */
  /* it('emptyModel returns [] for multiple-file mode', () => { ... }) */
  /* it('isEmpty returns true when no file is set', () => { ... }) */
  /* it('isEmpty returns false after fill', () => { ... }) */
  /* it('clear resets model to [] (multiple)', () => { ... }) */
  /* it('onFilesChanged with no files resets model', () => { ... }) */
  /* it('onFilesChanged emits field-changed', () => { ... }) */
  /* it('displayName joins names for multiple files', () => { ... }) */
  /* it('maxFiles defaults to 1 for single-file mode', () => { ... }) */
  /* it('maxFiles defaults to 9 for multiple-file mode', () => { ... }) */
  /* it('maxFileSize defaults to 1 MB', () => { ... }) */
  /* it('isClearable defaults to true', () => { ... }) */
  /* it('isClearable respects field.clearable', () => { ... }) */
  /* it('filterSelectedFiles returns all files when no filter is set', () => { ... }) */
  /* it('filterSelectedFiles returns empty array when no files match', () => { ... }) */
  /* it('fill sets the model', () => { ... }) */
  /* it('clear resets model to null (single)', () => { ... }) */
  /* it('values prop initializes model', () => { ... }) */
  /* it('invalidate sets hasError', () => { ... }) */
  /* it('validate clears error', () => { ... }) */
  /* it('apply writes model to object', () => { ... }) */
  /* it('field.disabled disables the field', () => { ... }) */
})
