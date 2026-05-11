let _instance = null

export const i18n = {
  setInstance (instance) { _instance = instance },
  tie (key, params) {
    if (!_instance) return key
    return _instance.te(key) ? _instance.t(key, params) : key
  }
}
