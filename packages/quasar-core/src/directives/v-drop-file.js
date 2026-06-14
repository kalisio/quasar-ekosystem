import { getLogger } from '@logtape/logtape'
import { Notify } from 'quasar'
import { file } from '@kalisio/common-core/utilities'
import { I18n } from '../i18n.js'
import { palette } from '../utilities'

console.log('******************')
console.log(palette.resolve('negative'))

const logger = getLogger(['quasar-core', 'directives', 'v-drop-file'])

export const vDropFile = {

  mounted (el, binding) {
    el.__state = {
      dropCallback: binding.value?.dropCallback,
      acceptedTypes: binding.value?.mimeTypes,
      maxFiles: binding.value?.maxFiles,
      maxFileSize: binding.value?.maxFileSize,
      maxTotalSize: binding.value?.maxTotalSize,
      fontSize: binding.value?.fontSize ?? '2rem',
      enabled: binding.value?.enabled ?? true
    }
    // check whether the dropCallback has been set properly
    if (!el.__state.dropCallback || typeof el.__state.dropCallback !== 'function') {
      logger.error('Missing \'dropCallback\' argument in \'v-drop-file\' directive')
      return
    }
    // make element relative
    el.style.position = 'relative'
    // create overlay element
    const overlay = document.createElement('div')
    overlay.className = 'drag-overlay'
    overlay.innerHTML = '<div class="drag-overlay-box" />'
    el.appendChild(overlay)
    const style = document.createElement('style')
    style.textContent = `
      .drag-overlay {
        display: none;
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        justify-content: center;
        align-items: center;
        font-size: ${el.__state.fontSize};
        z-index: 9999;
        pointer-events: none;
      }
      .drag-overlay-box {
        display: flex;
        border: 3px dashed;
        width: 95%; height: 95%;
        border-radius: 5px;
        justify-content: center;
        align-items: center;
        pointer-events: none;
      }
    `
    document.head.appendChild(style)
    const showOverlay = () => (overlay.style.display = 'flex')
    const hideOverlay = () => (overlay.style.display = 'none')
    let dragCounter = 0
    let canDrop = false

    const onDragEnter = (e) => {
      // check whether the directive is enabled
      if (!el.__state.enabled) return
      e.preventDefault()
      // check the dragged items
      const items = Array.from(e.dataTransfer.items)
      let color, message
      if (el.__state.maxFiles && items.length > el.__state.maxFiles) {
        color = palette.resolve('negative')
        message = I18n.t('errors.MAX_FILES_REACHED', el.__state.maxFiles)
      } else {
        const acceptedItems = items.filter(item =>
          item.kind === 'file' && (!item.type || !el.__state.acceptedTypes || el.__state.acceptedTypes.includes(item.type))
        )
        const rejectedItems = items.filter(item => !acceptedItems.includes(item))
        if (acceptedItems.length === 0) {
          color = palette.resolve('negative')
          message = I18n.t('directives.ALL_FILES_ARE_UNSUPPORTED', rejectedItems.length)
        } else if (rejectedItems.length === 0) {
          color = palette.resolve('positive')
          message = I18n.t('directives.DROP_FILES', acceptedItems.length)
        } else {
          color = palette.resolve('warning')
          message = I18n.t('directives.SOME_FILES_ARE_UNSUPPORTED')
        }
        canDrop = acceptedItems.length > 0
      }
      // customize the overlay
      overlay.style.background = '#0007'
      const overlayBox = overlay.querySelector('.drag-overlay-box')
      overlayBox.textContent = message
      overlayBox.style.borderColor = color
      overlayBox.style.color = 'white'
      overlayBox.style.textShadow = '-2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black, 2px 2px 0 black'
      overlayBox.style.padding = '20px'
      // show the overlay
      dragCounter++
      showOverlay()
    }

    const onDragOver = (e) => {
      e.preventDefault()
    }

    const onDragLeave = (e) => {
      e.preventDefault()
      dragCounter--
      if (dragCounter === 0) hideOverlay()
    }

    const onDrop = async (e) => {
      e.preventDefault()
      dragCounter = 0
      hideOverlay()
      if (!canDrop) return

      const files = Array.from(e.dataTransfer.files)
      const acceptedFiles = el.__state.acceptedTypes
        ? files.filter(f => el.__state.acceptedTypes.includes(f.type))
        : files

      if (el.__state.maxTotalSize && acceptedFiles.length > 1) {
        const totalSize = acceptedFiles.reduce((sum, f) => sum + f.size, 0)
        if (totalSize > el.__state.maxTotalSize) {
          Notify.create({ type: 'negative', message: I18n.t('errors.MAX_TOTAL_SIZE_FILES_REACHED', { maxSize: file.formatSize(el.__state.maxTotalSize) }) })
          return
        }
      }

      for (const f of acceptedFiles) {
        if (el.__state.maxFileSize && f.size > el.__state.maxFileSize) {
          Notify.create({ type: 'negative', message: I18n.t('errors.MAX_FILE_SIZE_REACHED', { file: f.name, maxSize: file.formatSize(el.__state.maxFileSize) }) })
          continue
        }
        await el.__state.dropCallback(f)
      }
    }

    el.__handlers = { onDragEnter, onDragOver, onDragLeave, onDrop }
    el.addEventListener('dragenter', onDragEnter)
    el.addEventListener('dragover', onDragOver)
    el.addEventListener('dragleave', onDragLeave)
    el.addEventListener('drop', onDrop)
  },

  updated (el, binding) {
    if (binding.value !== binding.oldValue) {
      el.__state = {
        dropCallback: binding.value?.dropCallback,
        acceptedTypes: binding.value?.mimeTypes,
        maxFiles: binding.value?.maxFiles,
        maxFileSize: binding.value?.maxFileSize,
        maxTotalSize: binding.value?.maxTotalSize,
        fontSize: binding.value?.fontSize ?? '2rem',
        enabled: binding.value?.enabled ?? true
      }
    }
  },

  beforeUnmount (el) {
    const { onDragEnter, onDragOver, onDragLeave, onDrop } = el.__handlers
    el.removeEventListener('dragenter', onDragEnter)
    el.removeEventListener('dragover', onDragOver)
    el.removeEventListener('dragleave', onDragLeave)
    el.removeEventListener('drop', onDrop)
    delete el.__handlers
    delete el.__state
  }
}
