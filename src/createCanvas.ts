import { createCanvas, Canvas } from 'canvas';
import { hidpi } from './hidpi'

export default function (width = 500, height = 300): HTMLCanvasElement | Canvas {
  if (typeof window == 'undefined') {
    return createCanvas(width, height)
  } else {
    const canvas = document.createElement('canvas');
    canvas.width = width
    canvas.height = height
    hidpi(canvas)

    return canvas
  } 
}

