---
title: Graphics
description: Components for rendering graphical elements such as shapes, ribbons and color scales.
---

# Graphics

Components for rendering graphical elements such as shapes, ribbons and color scales.

## KShape

Renders an SVG shape using the [`@kalisio/common-graphics`](https://github.com/kalisio/common-ekosystem/tree/master/packages/common-graphics) library. Supported shape types include `circle`, `rect`, `diamond`, `triangle`, `star5`, `hexagon`, and more.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Object` | — *(required)* | Shape descriptor passed to `Graphiks.renderShape()`. Must include at least a `shape` key with a registered shape type name. |
| `tooltip` | `String` | `undefined` | Text displayed in a Quasar tooltip on hover. |

### Usage

```html
<!-- Basic circle -->
<KShape :options="{ shape: 'circle', size: 32 }" />

<!-- Triangle with a custom color -->
<KShape :options="{ shape: 'triangle', size: 24, color: '#e53935' }" />

<!-- With a tooltip -->
<KShape :options="{ shape: 'star5', size: 28 }" tooltip="Favorite" />
```

---

## KRibbon

Renders a diagonal banner ribbon, typically used to overlay a corner of a card or panel (e.g. "Beta", "New").

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `String` | `undefined` | Text displayed inside the ribbon. |
| `size` | `Number` | `32` | Height of the ribbon in pixels. Font size is derived as `size - 8`. |
| `color` | `String` | `'primary'` | Background color. Accepts any Quasar palette name, HTML color name, or CSS color value. |
| `textColor` | `String` | `'white'` | Text color. Same accepted formats as `color`. |
| `letterSpacing` | `Number` | `2` | Letter spacing in pixels. |
| `position` | `String` | `'top-left'` | Corner where the ribbon is anchored. One of `top-left`, `top-right`, `bottom-right`, `bottom-left`. |
| `origin` | `Array` | `[50, 50]` | `[x, y]` offset in pixels from the chosen corner, used to fine-tune positioning. |

### Usage

```html
<!-- Top-left "Beta" ribbon -->
<KRibbon text="Beta" />

<!-- Bottom-right ribbon with a custom color -->
<KRibbon text="New" position="bottom-right" color="#43a047" :origin="[60, 60]" />

<!-- Larger ribbon with adjusted letter spacing -->
<KRibbon text="Alpha" :size="40" :letterSpacing="4" color="deep-orange" />
```

---

## KColorScale

Renders a continuous or discrete color scale on an HTML canvas. The scale automatically redraws when its container is resized.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `String` | `undefined` | Title displayed above the color bar. |
| `colors` | `String \| Array` | `'OrRd'` | Color scheme. Accepts a [Chroma.js](https://gka.github.io/chroma.js/) scale name (e.g. `'OrRd'`, `'Viridis'`) or an array of CSS color values. |
| `domain` | `Array` | `[0, 1]` | Value range `[min, max]`. Use a reversed array (e.g. `[1, 0]`) to reverse the scale direction. |
| `classes` | `Array` | `null` | Class boundaries for a **discrete** scale. When set, the scale renders one colored box per interval. When `null`, the scale is **continuous**. |
| `unit` | `String` | `undefined` | Unit identifier. Reserved for future use. |
| `layout` | `Object` | see below | Layout configuration object. |
| `direction` | `String` | `'horizontal'` | Orientation of the scale. One of `horizontal`, `vertical`. |

#### `layout` object

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `gutter` | `Number` | `4` | Spacing in pixels between the label, the color bar and the ticks. |
| `label.size` | `Number` | `12` | Label font size in pixels. |
| `label.font` | `String` | `'Arial'` | Label font family. |
| `label.color` | `String` | `'black'` | Label text color. |
| `label.align` | `String` | `'left'` | Label text alignment. One of `left`, `center`, `right`. |
| `bar.height` | `Number` | `16` | Color bar height in pixels (horizontal mode). |
| `bar.width` | `Number` | `16` | Color bar width in pixels (vertical mode). |
| `ticks.size` | `Number` | `10` | Tick label font size in pixels. |
| `ticks.font` | `String` | `'Arial'` | Tick label font family. |
| `ticks.color` | `String` | `'black'` | Tick label text color. |
| `ticks.format` | `Object \| Function` | `{ notation: 'auto', precision: 3 }` | Tick formatting. Accepts a [mathjs format](https://mathjs.org/docs/reference/functions/format.html) options object or a function `({ tick, previousTick }) => string`. Returning a falsy value hides the tick. |

### Usage

```html
<!-- Continuous horizontal scale -->
<KColorScale label="Temperature" colors="RdYlBu" :domain="[-20, 40]" />

<!-- Continuous vertical scale -->
<KColorScale
  label="Wind speed"
  colors="Viridis"
  :domain="[0, 30]"
  direction="vertical"
/>

<!-- Discrete horizontal scale -->
<KColorScale
  label="Elevation"
  colors="OrRd"
  :domain="[0, 3000]"
  :classes="[0, 500, 1000, 2000, 3000]"
/>

<!-- Reversed domain -->
<KColorScale colors="Blues" :domain="[100, 0]" />

<!-- Custom tick formatting -->
<KColorScale
  :domain="[0, 1]"
  :layout="{
    ticks: {
      format: ({ tick }) => `${(tick * 100).toFixed(0)} %`
    }
  }"
/>
```
