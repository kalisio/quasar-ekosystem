import { merge, omit, get } from 'lodash-es'
import { assert, is } from '@kalisio/common-core/predicates'
import { getLogger } from '@logtape/logtape'
import { getFingerprint, getFingerprintData } from '@thumbmarkjs/thumbmarkjs'
import { Platform as QPlatform } from 'quasar'

const logger = getLogger(['quasar-core', 'platform'])

const BUILD_MODES = ['PWA', 'SPA']
let _buildMode = null

export const Platform = {
  async initialize (buildMode) {
    assert.that(buildMode, (v) => is.oneOf(v, BUILD_MODES), `buildMode must be one of: ${BUILD_MODES.join(', ')}`)
    _buildMode = buildMode
    // use Quasar platform data
    merge(this, omit(QPlatform, ['install', '__installed']))
    // use fingerprint data
    this.fingerprint = await getFingerprint()
    this.fingerprintData = await getFingerprintData()
    // use build data
    this.is.pwa = buildMode === 'PWA'
    logger.debug('[quasar-core] Platform initialized with:', this)
  },
  getData (scope) {
    assert.that(_buildMode, is.defined, 'Platform must be initialized before calling getData')
    const data = {
      userAgent: this.userAgent,
      application: {
        mode: _buildMode,
        iframe: this.within.iframe,
        permissions: this.fingerprintData?.permissions
      },
      browser: {
        ...this.fingerprintData?.system?.browser,
        locale: this.fingerprintData?.locales,
        webgl: this.fingerprintData?.hardware?.videocard
      },
      system: {
        os: this.fingerprintData?.system?.platform,
        desktop: this.is.desktop || false,
        mobile: this.is.mobile || false,
        touch: this.is.touch || false
      }
    }
    if (is.empty(scope)) return data
    return get(data, scope)
  }
}
