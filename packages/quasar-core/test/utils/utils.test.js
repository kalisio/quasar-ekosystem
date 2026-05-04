import { describe, it, expect } from 'vitest'
import { Document } from '../../src/document.js'
import { filterContent, getBoundValue, bindParams, bindProperties } from '../../src/utils/utils.content.js'
import {
  getHtmlColor, getContrastColor, filterContent as fc,
  loadComponent, bindParams as bp, bindProperties as bprop,
  toggleFullscreen, Fullscreen
} from '../../src/utils/index.js'

describe('Document', () => {
  it('sanitizeHtml returns the string unchanged', () => {
    expect(Document.sanitizeHtml('hello')).toBe('hello')
  })
  it('sanitizeHtml returns empty string for null', () => {
    expect(Document.sanitizeHtml(null)).toBe('')
  })
})

describe('utils.content', () => {
  it('utility functions return their input', () => {
    expect(filterContent('x')).toBe('x')
    expect(getBoundValue(42)).toBe(42)
    expect(bindParams()).toEqual({})
    expect(bindProperties({ a: 1 })).toEqual({ a: 1 })
  })
})

describe('utils/index', () => {
  it('trivial utility functions return their input', () => {
    expect(getHtmlColor('red')).toBe('red')
    expect(getContrastColor()).toBe('white')
    expect(fc('x')).toBe('x')
    expect(loadComponent('K')).toBe('K')
    expect(bp()).toEqual({})
    expect(bprop({ a: 1 })).toEqual({ a: 1 })
  })

  it('toggleFullscreen flips the Fullscreen ref', () => {
    const before = Fullscreen.value
    toggleFullscreen()
    expect(Fullscreen.value).toBe(!before)
  })
})
