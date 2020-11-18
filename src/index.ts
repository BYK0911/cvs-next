import { CanvasRenderingContext2D } from "canvas";
import createCanvas from "./createCanvas";

export class Painter {
  canvas = createCanvas();
  ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  [key: string]: any;

  constructor (canvasWidth = 500, canvasHeight = 300) {
    this.resize(canvasWidth, canvasHeight);
  }

  set (key: string, value: any): Painter;
  set (option: object): Painter;
  set (key: any, value?: any): Painter {
    if (typeof key === 'string') {
      Object.assign(this.ctx, { [key]: value })
    } else {
      Object.assign(this.ctx, key)
    }

    return this
  }

  resize (width: number, height: number): Painter {
    if (!('style' in this.canvas)) {
      this.canvas.width = width;
      this.canvas.height = height;
    } else {
      const pixelRatio = window.devicePixelRatio;

      this.canvas.style.width = width + 'px';
      this.canvas.style.height = height + 'px';
      this.canvas.width = width * pixelRatio;
      this.canvas.height = height * pixelRatio;
    }

    return this;
  }

  measureTextWidth (text: string): number {
    return this.ctx.measureText(text).width
  }
}

// chain method
const chainMethodMap = [
  'beginPath',
  'closePath',
  'clip',
  'moveTo',
  'lineTo',
  'rect',
  'clearRect',
  'fillRect',
  'strokeRect',
  'fill',
  'stroke',
  'arc',
  'arcTo',
  'besizerCurveTo',
  'qudraticCurveTo',
  'transform',
  'translate',
  'scale',
  'rotate',
  'save',
  'restore',
  'fillText',
  'strokeText'
]

const aliasMap = {
  'beginPath': 'begin',
  'closePath': 'close',
  'clearReact': 'clear',
  'moveTo': 'mt',
  'lineTo': 'lt',
  'translate': 'move',
  'measureTextWidth': 'tw'
}

chainMethodMap.forEach(fn => {
  Painter.prototype[fn] = function (): Painter {
    this.ctx[fn](...arguments);

    return this;
  }
})

for (let k in aliasMap) {
  Painter.prototype[aliasMap[k as keyof typeof aliasMap]] = Painter.prototype[k]
}