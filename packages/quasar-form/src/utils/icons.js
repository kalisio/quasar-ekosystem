import _ from 'lodash'

// Extract icon name from a given icon property on a given target object
export function getIconName (object, path = 'icon.name') {
  // Make function work in a generic way, sometimes the provided input is directly the icon name
  const icon = (typeof object === 'object' ? _.get(object, path, '') : object)
  // Check whether the returned icon is an object (can be true in some cases)
  if (typeof icon === 'object') return ''
  // Name icons to ensure backward compatibility with font awesome 4
  return (icon.startsWith('fa-') ? `fas ${icon}` : icon)
}
