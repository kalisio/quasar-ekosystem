import { assert, is } from '@kalisio/common-core/predicates'
import { getLogger } from '@kalisio/common-core/runtime'
import { Platform as QPlatform } from 'quasar'

const logger = getLogger(['quasar-core', 'platform'])

const BUILD_MODES = ['PWA', 'SPA']

let _webgl

// Computed once: browsers limit the number of live WebGL contexts
function getWebGLInfo () {
  if (_webgl) return _webgl
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
  if (!gl) {
    _webgl = { supported: false }
    return _webgl
  }
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  _webgl = {
    supported: true,
    version: gl.getParameter(gl.VERSION),
    vendor: gl.getParameter(debugInfo?.UNMASKED_VENDOR_WEBGL ?? gl.VENDOR),
    renderer: gl.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL ?? gl.RENDERER)
  }
  gl.getExtension('WEBGL_lose_context')?.loseContext()
  return _webgl
}

export const Platform = {
  initialize (buildMode) {
    assert.that(buildMode, (value) => is.oneOf(value, BUILD_MODES), `buildMode must be one of: ${BUILD_MODES.join(', ')}`)
    // Reference Quasar objects rather than copying them, to keep their lazy getters (e.g. has.webStorage),
    // except is, which is copied to add the build data without altering Quasar's
    this.userAgent = QPlatform.userAgent
    this.is = { ...QPlatform.is, pwa: buildMode === 'PWA' }
    this.has = QPlatform.has
    this.within = QPlatform.within
    // Detect WebGL capabilities once during initialization
    this.webgl = getWebGLInfo()
    logger.debug('Platform initialized with {platform}', { platform: this })
  }
}
