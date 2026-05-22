import _ from 'lodash-es'
import { getLogger } from '@logtape/logtape'
import { getFingerprint, getFingerprintData } from '@thumbmarkjs/thumbmarkjs'
import { Platform as QPlatform } from 'quasar'

const logger = getLogger(['kdk', 'platform'])

export const Platform = {
  async initialize (buildMode) {
    // use Quasar platform data
    _.merge(this, _.omit(QPlatform, ['install', '__installed']))
    // use fingerprint data
    this.fingerprint = await getFingerprint()
    this.fingerprintData = await getFingerprintData()
    // use build data
    this.is.pwa = buildMode === 'pwa'
    logger.debug('[KDK] Platform initialized with:', this)
  },
  getData (scope) {
    const data = {
      userAgent: this.userAgent,
      application: {
        mode: this.is.pwa ? 'PWA' : 'SPA',
        iframe: this.within.iframe,
        permissions: _.get(this.fingerprintData, 'permissions')
      },
      browser: Object.assign({},
        _.get(this.fingerprintData, 'system.browser'),
        { locale: _.get(this.fingerprintData, 'locales') },
        { webgl: _.get(this.fingerprintData, 'hardware.videocard') }
      ),
      system: {
        os: _.get(this.fingerprintData, 'system.platform'),
        desktop: this.is.desktop || false,
        mobile: this.is.mobile || false,
        touch: this.is.touch || false
      }
    }
    if (_.isEmpty(scope)) return data
    return _.get(data, scope)
  }
}
