import chroma from 'chroma-js'

export const color = {
  is: (v) => { try { return chroma.valid(v) } catch { return false } },
  contrast: (v, light = 'white', dark = 'black') => chroma.contrast(v, 'white') < chroma.contrast(v, 'black') ? dark : light,
  scale: (opts) => {
    let s = chroma.scale(opts.colors)
    if (opts.domain) s = s.domain(opts.domain)
    if (opts.classes) s = s.classes(opts.classes)
    return s
  }
}
