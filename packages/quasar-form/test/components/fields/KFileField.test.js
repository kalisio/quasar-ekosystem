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

  it('emptyModel returns null for single-file mode', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toBeNull()
  })

  it('emptyModel returns [] for multiple-file mode', () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { multiple: true } }), global: { stubs } })
    expect(wrapper.vm.emptyModel()).toEqual([])
  })

  it('clear resets single model to null', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(makeFile())
    wrapper.vm.clear()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('onFilesChanged with empty files resets model to emptyModel', async () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    wrapper.vm.fill(makeFile())
    wrapper.vm.files = null
    await wrapper.vm.onFilesChanged()
    expect(wrapper.vm.isEmpty()).toBe(true)
  })

  it('onFilesChanged with readContent=false skips reading and stores File ref', async () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { readContent: false } }), global: { stubs } })
    wrapper.vm.files = { name: 'data.csv', type: 'text/csv' }
    await wrapper.vm.onFilesChanged()
    expect(wrapper.vm.value()).toMatchObject({ name: 'data.csv', type: 'text/csv' })
    expect(wrapper.vm.value().File).toBeTruthy()
  })

  it('displayName joins names for multiple files', () => {
    const wrapper = mount(KFileField, {
      props: { ...makeProps({ field: { multiple: true } }), values: { test: [makeFile('a.txt'), makeFile('b.txt')] } },
      global: { stubs }
    })
    expect(wrapper.vm.displayName).toBe('a.txt, b.txt')
  })

  it('maxFiles defaults to 1 for single-file mode', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.maxFiles).toBe(1)
  })

  it('maxFiles defaults to 9 for multiple-file mode', () => {
    const wrapper = mount(KFileField, { props: makeProps({ field: { multiple: true } }), global: { stubs } })
    expect(wrapper.vm.maxFiles).toBe(9)
  })

  it('isClearable defaults to true', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    expect(wrapper.vm.isClearable).toBe(true)
  })

  it('filterSelectedFiles returns all files when no filter is set', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    const files = [{ name: 'a.csv' }, { name: 'b.png' }]
    expect(wrapper.vm.filterSelectedFiles(files)).toEqual(files)
  })

  it('apply writes model value to a target object', () => {
    const wrapper = mount(KFileField, { props: makeProps(), global: { stubs } })
    const f = makeFile('doc.pdf')
    wrapper.vm.fill(f)
    const obj = {}
    wrapper.vm.apply(obj, 'test')
    expect(obj.test).toEqual(f)
  })
})
