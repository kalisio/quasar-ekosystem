---
title: v-drop-file
description: Directive that enables drag-and-drop file handling on any element.
---

# v-drop-file

Directive that enables drag-and-drop file handling on any element. Displays an overlay during drag operations with visual feedback, and validates files before passing them to a callback.

## Usage

### Signature

```html
<div v-drop-file="options" />
```

### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `dropCallback` | `function` | — | **Required.** Called with each accepted `File` object after drop. |
| `mimeTypes` | `string[]` | `undefined` | List of accepted MIME types. If omitted, all file types are accepted. |
| `maxFiles` | `number` | `undefined` | Maximum number of files allowed in a single drop. |
| `maxFileSize` | `number` | `undefined` | Maximum size in bytes for a single file. |
| `maxTotalSize` | `number` | `undefined` | Maximum combined size in bytes for all dropped files. |
| `fontSize` | `string` | `'2rem'` | Font size of the overlay message. |
| `enabled` | `boolean` | `true` | Whether the directive is active. |

### Examples

```html
<div v-drop-file="{ dropCallback: onFileDrop }">
  Drop files here
</div>
```

```html
<div v-drop-file="{
  dropCallback: onFileDrop,
  mimeTypes: ['image/png', 'image/jpeg'],
  maxFiles: 3,
  maxFileSize: 5 * 1024 * 1024,
  maxTotalSize: 10 * 1024 * 1024
}">
  Drop images here
</div>
```

```js
async function onFileDrop (file) {
  const text = await file.text()
  console.log(text)
}
```

## Behavior

### Overlay

An overlay is displayed while files are being dragged over the element. The border color reflects the validity of the dragged files:

- **Positive** — all files are accepted
- **Warning** — some files are rejected (unsupported type)
- **Negative** — all files are rejected, or the file count exceeds `maxFiles`

The overlay uses a drag counter to handle nested elements correctly — it stays visible when dragging over child elements.

### Validation

Validation happens in two phases:

- **On drag enter** — file count and MIME type are checked to show feedback in the overlay.
- **On drop** — file size (`maxFileSize`) and total size (`maxTotalSize`) are checked. Files exceeding `maxFileSize` are skipped individually with a notification. If the total size exceeds `maxTotalSize`, the entire drop is aborted with a notification.

### Callback

`dropCallback` receives a native `File` object for each accepted file. Reading the file content is left to the caller:

```js
async function onFileDrop (file) {
  const buffer = await file.arrayBuffer()
  // or
  const text = await file.text()
}
```