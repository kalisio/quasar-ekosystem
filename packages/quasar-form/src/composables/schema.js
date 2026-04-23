import _ from 'lodash'
import { ref, readonly } from 'vue'
import { schemaRegistry as registry } from '../utils/index.js'

export function useSchema () {
  const validator = ref(null)
  const schema = ref(null)

  async function compile (schemaNameOrObject, propertiesFilter) {
    if (typeof schemaNameOrObject === 'string') {
      const schemaModule = await import(`@schemas/${schemaNameOrObject}.json`)
      schema.value = _.cloneDeep(schemaModule.default)
    } else {
      schema.value = _.cloneDeep(schemaNameOrObject)
    }
    if (propertiesFilter) {
      let properties = propertiesFilter
      if (typeof propertiesFilter === 'string') properties = _.split(propertiesFilter, ',')
      _.forOwn(schema.value.properties, (_value, key) => {
        if (!properties.includes(key)) delete schema.value.properties[key]
      })
      schema.value.$id += properties.join()
      schema.value.required = _.intersection(schema.value.required, properties)
    }
    validator.value = registry.register(schema.value)
  }

  function validate (values) {
    if (!validator.value) return { isValid: false, errors: [] }
    const result = validator.value(values)
    return { isValid: result, errors: validator.value.errors || [] }
  }

  return {
    schema: readonly(schema),
    compile,
    validate
  }
}
