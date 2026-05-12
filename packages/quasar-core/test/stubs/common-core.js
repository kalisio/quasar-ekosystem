export function sanitize (html) { return html }

export const is = {
  empty: (v) => v == null || v === '',
  string: (v) => typeof v === 'string',
  array: (v) => Array.isArray(v),
  plainObject: (v) => v !== null && typeof v === 'object' && !Array.isArray(v),
  number: (v) => typeof v === 'number',
  function: (v) => typeof v === 'function'
}

export const has = {
  key: (obj, key) => Object.prototype.hasOwnProperty.call(obj, key),
  path: (obj, path) => {
    try { return path.split('.').reduce((o, p) => o[p], obj) !== undefined } catch { return false }
  }
}

export const assert = { that: () => {} }
