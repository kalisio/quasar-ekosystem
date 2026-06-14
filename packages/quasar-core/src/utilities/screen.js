import { get } from 'lodash-es'
import { getLogger } from '@logtape/logtape'
import { toRef } from 'vue'
import { Screen, AppFullscreen } from 'quasar'
import { is } from '@kalisio/common-core/predicates'

const logger = getLogger(['quasar-core', 'utilities', 'screen'])

function resolveDimension (value, screenSize, dimensionName) {
  if (is.number(value)) {
    if (value > 100) return value
    return screenSize * value / 100
  }
  if (!is.plainObject(value)) {
    logger.warn(`Invalid ${dimensionName} parameter ${value}`)
    return undefined
  }
  const breakpointValue = get(value, Screen.name)
  if (!breakpointValue) {
    logger.warn(`Cannot find ${dimensionName} value for breakpoint ${Screen.name}`)
    return undefined
  }
  if (!is.number(breakpointValue)) {
    logger.warn(`Invalid ${dimensionName} value ${breakpointValue} for breakpoint ${Screen.name}`)
    return undefined
  }
  return resolveDimension(breakpointValue, screenSize, dimensionName)
}

export const screen = {
  Fullscreen: toRef(AppFullscreen, 'isActive'),

  resolveWidth (width) {
    return resolveDimension(width, Screen.width, 'width')
  },

  resolveHeight (height) {
    return resolveDimension(height, Screen.height, 'height')
  },

  resolveSize (size) {
    if (is.arrayOfLength(size, 2)) {
      return size
    }
    if (is.plainObject(size)) {
      const breakpointSize = get(size, Screen.name)
      return [this.resolveWidth(breakpointSize[0]), this.resolveHeight(breakpointSize[1])]
    }
    logger.warn(`Invalid size parameter ${size}`)
  },

  orientation () {
    return Screen.width > Screen.height ? 'landscape' : 'portrait'
  },

  async lockOrientation (orientation) {
    if (window.screen.orientation?.lock) await window.screen.orientation.lock(orientation)
  },

  async toggleFullscreen () {
    try {
      await AppFullscreen.toggle()
      return true
    } catch (err) {
      logger.warn(`Cannot toggle fullscreen mode: ${err}`)
      return false
    }
  }
}
