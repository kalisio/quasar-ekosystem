import { describe, it, expect, vi, beforeEach } from 'vitest'
import { vDropFile } from '../../src/directives/v-drop-file.js'

// --- mocks ---

const { notifyCreate } = vi.hoisted(() => ({
  notifyCreate: vi.fn()
}))

vi.mock('quasar', async (importOriginal) => {
  const quasar = await importOriginal()
  return {
    ...quasar,
    Notify: { create: notifyCreate }
  }
})

vi.mock('../../src/utilities', async (importOriginal) => {
  const module = await importOriginal()
  return {
    ...module,
    palette: {
      ...module.palette,
      resolve: (color) => {
        if (color === 'negative') return '#ff0000'
        if (color === 'positive') return '#00ff00'
        if (color === 'warning') return '#ffff00'
        return color
      }
    }
  }
})

// --- helpers ---

function createElement (bindingValue) {
  const el = document.createElement('div')
  vDropFile.mounted(el, { value: bindingValue })
  return el
}

function makeDragEvent (type, { files = [], items = [] } = {}) {
  const event = new Event(type)
  event.preventDefault = vi.fn()
  event.dataTransfer = { files, items }
  return event
}

// --- tests ---

describe('vDropFile', () => {
  let dropCallback

  beforeEach(() => {
    dropCallback = vi.fn()
    notifyCreate.mockReset()
  })

  describe('mounted', () => {
    it('does not throw when dropCallback is missing', () => {
      expect(() => vDropFile.mounted(document.createElement('div'), { value: {} })).not.toThrow()
    })

    it('sets position relative on the element', () => {
      const el = createElement({ dropCallback })
      expect(el.style.position).toBe('relative')
    })

    it('appends a drag overlay to the element', () => {
      const el = createElement({ dropCallback })
      expect(el.querySelector('.drag-overlay')).toBeTruthy()
      expect(el.querySelector('.drag-overlay-box')).toBeTruthy()
    })

    it('stores state on el.__state', () => {
      const el = createElement({ dropCallback, mimeTypes: ['text/plain'], maxFiles: 3, enabled: false })
      expect(el.__state.dropCallback).toBe(dropCallback)
      expect(el.__state.acceptedTypes).toEqual(['text/plain'])
      expect(el.__state.maxFiles).toBe(3)
      expect(el.__state.enabled).toBe(false)
    })

    it('defaults fontSize to 2rem and enabled to true', () => {
      const el = createElement({ dropCallback })
      expect(el.__state.fontSize).toBe('2rem')
      expect(el.__state.enabled).toBe(true)
    })
  })

  describe('onDragEnter', () => {
    it('does nothing when disabled', () => {
      const el = createElement({ dropCallback, enabled: false })
      const overlay = el.querySelector('.drag-overlay')
      el.dispatchEvent(makeDragEvent('dragenter', { items: [{ kind: 'file', type: 'text/plain' }] }))
      expect(overlay.style.display).not.toBe('flex')
    })

    it('shows overlay with negative color when maxFiles exceeded', () => {
      const el = createElement({ dropCallback, maxFiles: 1 })
      el.dispatchEvent(makeDragEvent('dragenter', {
        items: [{ kind: 'file', type: 'text/plain' }, { kind: 'file', type: 'text/plain' }]
      }))
      expect(el.querySelector('.drag-overlay').style.display).toBe('flex')
      expect(el.querySelector('.drag-overlay-box').style.borderColor).toBe('#ff0000')
    })

    it('shows overlay with positive color when all files are accepted', () => {
      const el = createElement({ dropCallback, mimeTypes: ['text/plain'] })
      el.dispatchEvent(makeDragEvent('dragenter', {
        items: [{ kind: 'file', type: 'text/plain' }]
      }))
      expect(el.querySelector('.drag-overlay-box').style.borderColor).toBe('#00ff00')
    })

    it('shows overlay with warning color when some files are rejected', () => {
      const el = createElement({ dropCallback, mimeTypes: ['text/plain'] })
      el.dispatchEvent(makeDragEvent('dragenter', {
        items: [{ kind: 'file', type: 'text/plain' }, { kind: 'file', type: 'application/pdf' }]
      }))
      expect(el.querySelector('.drag-overlay-box').style.borderColor).toBe('#ffff00')
    })

    it('shows overlay with negative color when all files are rejected', () => {
      const el = createElement({ dropCallback, mimeTypes: ['text/plain'] })
      el.dispatchEvent(makeDragEvent('dragenter', {
        items: [{ kind: 'file', type: 'application/pdf' }]
      }))
      expect(el.querySelector('.drag-overlay-box').style.borderColor).toBe('#ff0000')
    })
  })

  describe('onDragLeave', () => {
    it('hides overlay when drag leaves', () => {
      const el = createElement({ dropCallback })
      el.dispatchEvent(makeDragEvent('dragenter', { items: [{ kind: 'file', type: 'text/plain' }] }))
      el.dispatchEvent(makeDragEvent('dragleave'))
      expect(el.querySelector('.drag-overlay').style.display).toBe('none')
    })

    it('keeps overlay visible when dragging over children', () => {
      const el = createElement({ dropCallback })
      el.dispatchEvent(makeDragEvent('dragenter', { items: [{ kind: 'file', type: 'text/plain' }] }))
      el.dispatchEvent(makeDragEvent('dragenter', { items: [{ kind: 'file', type: 'text/plain' }] }))
      el.dispatchEvent(makeDragEvent('dragleave'))
      expect(el.querySelector('.drag-overlay').style.display).toBe('flex')
    })
  })

  describe('onDrop', () => {
    it('calls dropCallback with each accepted file', async () => {
      const el = createElement({ dropCallback })
      const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
      el.dispatchEvent(makeDragEvent('dragenter', { items: [{ kind: 'file', type: 'text/plain' }] }))
      await el.__handlers.onDrop(makeDragEvent('drop', { files: [file] }))
      expect(dropCallback).toHaveBeenCalledWith(file)
    })

    it('filters files by acceptedTypes', async () => {
      const el = createElement({ dropCallback, mimeTypes: ['text/plain'] })
      const accepted = new File(['a'], 'a.txt', { type: 'text/plain' })
      const rejected = new File(['b'], 'b.pdf', { type: 'application/pdf' })
      el.dispatchEvent(makeDragEvent('dragenter', {
        items: [{ kind: 'file', type: 'text/plain' }, { kind: 'file', type: 'application/pdf' }]
      }))
      await el.__handlers.onDrop(makeDragEvent('drop', { files: [accepted, rejected] }))
      expect(dropCallback).toHaveBeenCalledTimes(1)
      expect(dropCallback).toHaveBeenCalledWith(accepted)
    })

    it('notifies and skips file exceeding maxFileSize', async () => {
      const el = createElement({ dropCallback, maxFileSize: 3 })
      const bigFile = new File(['hello'], 'big.txt', { type: 'text/plain' })
      el.dispatchEvent(makeDragEvent('dragenter', { items: [{ kind: 'file', type: 'text/plain' }] }))
      await el.__handlers.onDrop(makeDragEvent('drop', { files: [bigFile] }))
      expect(notifyCreate).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }))
      expect(dropCallback).not.toHaveBeenCalled()
    })

    it('notifies and aborts when total size exceeds maxTotalSize', async () => {
      const el = createElement({ dropCallback, maxTotalSize: 3 })
      const f1 = new File(['hello'], 'a.txt', { type: 'text/plain' })
      const f2 = new File(['world'], 'b.txt', { type: 'text/plain' })
      el.dispatchEvent(makeDragEvent('dragenter', {
        items: [{ kind: 'file', type: 'text/plain' }, { kind: 'file', type: 'text/plain' }]
      }))
      await el.__handlers.onDrop(makeDragEvent('drop', { files: [f1, f2] }))
      expect(notifyCreate).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }))
      expect(dropCallback).not.toHaveBeenCalled()
    })

    it('does not call dropCallback when canDrop is false', async () => {
      const el = createElement({ dropCallback, mimeTypes: ['text/plain'] })
      const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' })
      el.dispatchEvent(makeDragEvent('dragenter', { items: [{ kind: 'file', type: 'application/pdf' }] }))
      await el.__handlers.onDrop(makeDragEvent('drop', { files: [file] }))
      expect(dropCallback).not.toHaveBeenCalled()
    })
  })

  describe('updated', () => {
    it('updates state when binding value changes', () => {
      const el = createElement({ dropCallback })
      const newCallback = vi.fn()
      vDropFile.updated(el, {
        value: { dropCallback: newCallback, enabled: false },
        oldValue: { dropCallback }
      })
      expect(el.__state.dropCallback).toBe(newCallback)
      expect(el.__state.enabled).toBe(false)
    })

    it('does not update state when binding value is unchanged', () => {
      const binding = { dropCallback }
      const el = createElement(binding)
      vDropFile.updated(el, { value: binding, oldValue: binding })
      expect(el.__state.dropCallback).toBe(dropCallback)
    })
  })

  describe('beforeUnmount', () => {
    it('removes all event listeners', () => {
      const el = createElement({ dropCallback })
      const spy = vi.spyOn(el, 'removeEventListener')
      vDropFile.beforeUnmount(el)
      expect(spy).toHaveBeenCalledWith('dragenter', expect.any(Function))
      expect(spy).toHaveBeenCalledWith('dragover', expect.any(Function))
      expect(spy).toHaveBeenCalledWith('dragleave', expect.any(Function))
      expect(spy).toHaveBeenCalledWith('drop', expect.any(Function))
    })

    it('cleans up __handlers and __state', () => {
      const el = createElement({ dropCallback })
      vDropFile.beforeUnmount(el)
      expect(el.__handlers).toBeUndefined()
      expect(el.__state).toBeUndefined()
    })
  })
})
