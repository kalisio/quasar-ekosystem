import { ref } from 'vue'
export { actionProps } from './utils.actions.js'

export function getHtmlColor (color) { return color }
export function getContrastColor () { return 'white' }
export function getIconName (icon, field) { return typeof icon === 'string' ? icon : icon?.[field] }
export function getInitials (name) {
  if (!name) return ''
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}
export function filterContent (c) { return c }
export function getBoundValue (v) { return v }
export function loadComponent (n) { return n }
export function bindParams () { return {} }
export function bindProperties (obj) { return obj }

export const Fullscreen = ref(false)
export function toggleFullscreen () { Fullscreen.value = !Fullscreen.value }
