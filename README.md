# Why
* Node support
* Canvas hidpi polyfill
* Method alias
* Chain method
* Commonly used rendering methods

# Install
Install
```bash
npm install canvas_painter --save
```

# Getting Started
Basic
```js
import { createCanvas } from 'canvas_painter'

const canvas = createCanvas(500, 300)
const ctx = canvas.getContext('2d')

ctx.fillText('Hello World', 100, 100)
```