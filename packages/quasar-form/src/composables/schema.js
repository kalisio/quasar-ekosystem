import _ from 'lodash'
import { ref, readonly } from 'vue'
import { schemaRegistry as registry } from '../utils/index.js'

export function useSchema () {
  const validator = ref(null)
  const schemaRegistry = ref(null)

  async function compile (schemaNameOrObject, propertiesFilter) {
    if (typeof schemaNameOrObject === 'string') {
      const schemaModule = await import(`@schemas/${schemaNameOrObject}.json`)
      schemaRegistry.value = _.cloneDeep(schemaModule.default)
    } else {
      schemaRegistry.value = _.cloneDeep(schemaNameOrObject)
    }
    if (propertiesFilter) {
      let properties = propertiesFilter
      if (typeof propertiesFilter === 'string') properties = _.split(propertiesFilter, ',')
      _.forOwn(schemaRegistry.value.properties, (_value, key) => {
        if (!properties.includes(key)) delete schemaRegistry.value.properties[key]
      })
      schemaRegistry.value.$id += properties.join()
      schemaRegistry.value.required = _.intersection(schemaRegistry.value.required, properties)
    }
    validator.value = registry.register(schemaRegistry.value)
  }

  function validate (values) {
    if (!validator.value) return { isValid: false, errors: [] }
    const result = validator.value(values)
    return { isValid: result, errors: validator.value.errors || [] }
  }

  return {
    schemaRegistry: readonly(schemaRegistry),
    compile,
    validate
  }
}
