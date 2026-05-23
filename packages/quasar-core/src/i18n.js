import { assert, is } from '@kalisio/common-core/predicates'

let _instance = null

export const I18n = {
  setInstance (instance) {
    assert.that(instance, is.defined, 'instance must be defined')
    _instance = instance
  },

  tie (key, params) {
    assert.that(_instance, is.defined, 'i18n must be initialized before calling tie')
    return _instance.global.te(key)
      ? _instance.global.t(key, params)
      : key
  }
}
