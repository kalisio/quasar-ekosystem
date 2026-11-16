import { assert, is } from '@kalisio/common-core/predicates'
import { getLogger } from '@kalisio/common-core/runtime'
import { computed, reactive, readonly, toRef } from 'vue'
import { Screen as QScreen, AppFullscreen } from 'quasar'

const logger = getLogger(['quasar-core', 'screen'])

// dense reads Screen.lt and wide reads Screen.gt, which do not define the same breakpoints
const DENSE_BREAKPOINTS = ['sm', 'md', 'lg', 'xl']
const WIDE_BREAKPOINTS = ['xs', 'sm', 'md', 'lg']
const DEFAULT_BREAKPOINT = 'sm'

const breakpoints = reactive({ dense: DEFAULT_BREAKPOINT, wide: DEFAULT_BREAKPOINT })

// Optional: the default breakpoints apply without it.
// A breakpoint that is not given is reset to its default.
function initialize ({ dense = DEFAULT_BREAKPOINT, wide = DEFAULT_BREAKPOINT } = {}) {
  assert.that(dense, (value) => is.oneOf(value, DENSE_BREAKPOINTS), `dense must be one of: ${DENSE_BREAKPOINTS.join(', ')}`)
  assert.that(wide, (value) => is.oneOf(value, WIDE_BREAKPOINTS), `wide must be one of: ${WIDE_BREAKPOINTS.join(', ')}`)
  breakpoints.dense = dense
  breakpoints.wide = wide
  logger.debug('Screen initialized with breakpoints {dense} and {wide}', { dense, wide })
}

async function toggleFullscreen () {
  try {
    await AppFullscreen.toggle()
    return true
  } catch (error) {
    logger.warn('Cannot toggle fullscreen mode: {error}', { error })
    return false
  }
}

// Quasar does not lock orientation: use the native Screen Orientation API
// lock() usually requires fullscreen and rejects on desktop and iOS Safari
async function lockOrientation (orientation) {
  if (typeof window.screen.orientation?.lock !== 'function') return false
  try {
    await window.screen.orientation.lock(orientation)
    return true
  } catch (error) {
    logger.warn('Cannot lock orientation to {orientation}: {error}', { orientation, error })
    return false
  }
}

// readonly() unwraps nested refs: Screen.dense is a boolean, not a ref.
// The Quasar Screen is not exposed here: through readonly() its methods (setSizes, setDebounce)
// would silently fail, so import it from quasar when needed.
export const Screen = readonly({
  initialize,
  dense: computed(() => QScreen.lt[breakpoints.dense]),
  wide: computed(() => QScreen.gt[breakpoints.wide]),
  // Viewport shape, same rule as the CSS orientation media feature
  orientation: computed(() => QScreen.height >= QScreen.width ? 'portrait' : 'landscape'),
  fullscreen: toRef(AppFullscreen, 'isActive'),
  toggleFullscreen,
  lockOrientation
})
