import { has, is } from '@kalisio/common-core/predicates'
import _ from 'lodash-es'
import sift from 'sift'

const RESOLVERS = []

export const HANDLERS = ['handler', 'visible', 'hidden', 'disabled', 'on.listener']

// Some bindings are not managed when reading content from config but externally on-demand, e.g. by KContent or KAction
// The content 'reserved' property is also used to recurse at caller level
export const RESERVED_BINDINGS = ['content', 'visible', 'hidden', 'route']

export const content = {

  registerResolver (resolver) {
    RESOLVERS.push(resolver)
  },

  resolve (value, context, args = []) {
    if (!is.string(value) || !value.startsWith(':')) return value
    for (const resolver of RESOLVERS) {
      const result = resolver(value, context, args)
      if (result !== undefined) return result
    }
    const path = value.substring(1)
    const n = _.toNumber(path)
    if (_.isFinite(n)) return args[n]
    if (has.path(context, path)) return _.get(context, path)
    return undefined
  },

  generateHandler (context, name, params) {
    const isNot = name.startsWith('!')
    if (isNot) name = name.substring(1)
    return (...args) => {
      const handler = _.get(context, name)
      let result
      if (typeof handler === 'function') {
        result = params ? handler(...content.bindParams(params, context, args)) : handler(...args)
      } else {
        result = handler
      }
      return isNot ? !result : result
    }
  },

  bindParams (params, context, args) {
    if (is.nil(params)) return params
    if (is.array(params)) return params.map(p => content.bindParams(p, context, args))
    if (typeof params === 'object') return _.mapValues(params, v => content.bindParams(v, context, args))
    return content.resolve(params, context, args)
  },

  bindHandler (component, path, context) {
    const handler = _.get(component, path)
    if (is.array(handler)) {
      const hs = handler.map(h => content.generateHandler(context, h.name || h, h.params))
      _.set(component, path, (...args) => hs.reduce((result, h) => result && h(...args), true))
    } else if (handler && typeof handler === 'object') {
      if (handler.name && !handler.name.startsWith(':')) {
        _.set(component, path, content.generateHandler(context, handler.name, handler.params))
      }
    } else if (typeof handler === 'string' && !handler.startsWith(':')) {
      _.set(component, path, content.generateHandler(context, handler))
    }
    return _.get(component, path)
  },

  bindProperties (item, context, omit = []) {
    if (is.array(item)) {
      return item.map(i => content.bindProperties(i, context, omit))
    }
    if (typeof item === 'object' && item !== null) {
      _.forOwn(item, (value, key) => {
        if (![...RESERVED_BINDINGS, ...omit].includes(key)) {
          item[key] = typeof value === 'string'
            ? content.resolve(value, context)
            : content.bindProperties(value, context, omit)
        }
      })
    }
    return item
  },

  bind (data, context, omit = []) {
    const components = _.flatMapDeep(data)
    _.forEach(components, component => {
      for (const path of HANDLERS) content.bindHandler(component, path, context)
      content.bindProperties(component, context, omit)
      if (component.content) content.bind(component.content, context, omit)
    })
    return data
  },

  filter (data, filter) {
    if (typeof data !== 'object') return data
    const isArray = is.array(data)
    let filtered = data
    if (!isArray) {
      if (filtered.content) filtered.content = content.filter(filtered.content, filter)
      else {
        _.keys(filtered).forEach(mode => {
          filtered[mode] = content.filter(filtered[mode], filter)
        })
      }
      filtered = [filtered]
    } else {
      filtered.forEach(item => {
        if (item.content) item.content = content.filter(item.content, filter)
      })
    }
    filtered = filtered.filter(sift(filter))
    return isArray ? filtered : filtered[0]
  }

}
