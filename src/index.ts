import { CanvasRenderingContext2D } from "canvas";
import createCanvas from "./createCanvas";

interface TextSettings{
  width?: number;
  height?: number;
  autoScale?: boolean;
  wrap?: boolean;
  breakWord?: boolean;
  overflow?: 'auto' | 'hidden';
  lineHeight?: number;
  align?: 'left' | 'center' | 'right';
  vAlign?: 'top' | 'middle' | 'bottom';
}
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

  lineWidth (n: number): Painter {
    this.ctx.lineWidth = n;

    return this;
  }

  polyline (points: number[]): Painter {
    const len = points.length;
    if (len >= 4 && len % 2 === 0) {
      this.ctx.moveTo(points[0], points[1])

      for (let i = 2; i < len; i += 2) {
        this.ctx.lineTo(points[i], points[i + 1])
      }
    }
    return this
  }

  text (content: string, x: number, y: number, options: TextSettings): Painter {
    const { autoScale = false, wrap = true } = options
    if (wrap && options.width) return this.mutipleLineText(content, x, y, options);
    if (autoScale && (options.width || options.height)) return this.autoScaleText(content, x, y, options);

    const fontSize = this.fontSize()
    const {
      width = this.measureTextWidth(content),
      lineHeight = fontSize,
      align = 'left',
      vAlign = 'top',
      overflow = 'hidden'
    } = options
    const height = options.height || lineHeight;

    const x0 = align === 'left' ? x : align === 'center' ? x - width / 2 : x - width;
    const y0 = vAlign === 'top' ? y : vAlign === 'middle' ? y - height / 2 : y - height;

    this.ctx.save();
    this.set({
      textAlign: 'left',
      textBaseline: 'top'
    })
    if (overflow === 'hidden') {
      this.ctx.beginPath();
      this.ctx.rect(x0, y0, width, height);
      this.ctx.closePath();
      this.ctx.clip();
    }
    this.ctx.fillText(content, x0, y0);
    this.ctx.restore();

    return this;
  }

  autoScaleText (text: string, x: number, y: number, options: TextSettings): Painter {
    const fontSize = this.fontSize()
    let {
      width,
      height,
      lineHeight = fontSize,
      align = 'left',
      vAlign = 'top'
    } = options

    const tw = this.measureTextWidth(text);
    if (width === undefined) width = height / lineHeight * tw;
    if (height === undefined) height = fontSize * width / tw;
    const x0 = align === 'left' ? x : align === 'center' ? x - width / 2 : x - width;
    const y0 = vAlign === 'top' ? y : vAlign === 'middle' ? y - height / 2 : y - height;

    this.ctx.save();
    this.set({
      textAlign: 'left',
      textBaseline: 'top'
    })
    this.ctx.translate(x0, y0);
    this.ctx.scale(width / tw, height / lineHeight);
    this.ctx.fillText(text, 0, 0);
    this.ctx.restore();

    return this;
  }

  mutipleLineText (text: string, x: number, y: number, options: TextSettings): Painter {
    const originalAlign = this.ctx.textAlign;
    const originalBaseline = this.ctx.textBaseline;
    const fontSize = this.fontSize()

    const {
      width = 500,
      lineHeight = fontSize,
      breakWord = false,
      overflow = 'hidden',
      align = 'left',
      vAlign = 'top'
    } = options

    const words = text.split(breakWord ? '' : ' ')
    const lines = []
    let currentLine = ''

    while(words.length) {
      const next = words.shift()
      // if (!currentLine && next == ' ') continue
      const tw = this.measureTextWidth(currentLine + next)
      if (tw > width) {
        if (currentLine === '') {
          lines.push(next)
        } else {
          lines.push(currentLine)
          currentLine = next
        }
      } else {
        currentLine += next
      }
    }

    if (currentLine) lines.push(currentLine)

    if (lines.length === 0) return this

    const H = lines.length * lineHeight
    const height = options.height || H
    const x0 = align === 'left' ? x : align === 'center' ? x - width / 2 : x - width;
    let y0 = vAlign === 'top' ? y : vAlign === 'middle' ? y - H / 2 : y - H;
    const _y0 = vAlign === 'top' ? y : vAlign === 'middle' ? y - height / 2 : y - height;
    y0 += (lineHeight - fontSize) / 2

    if (overflow === 'hidden') {
      this.ctx.save()
      this.ctx.beginPath();
      this.ctx.rect(x0, _y0, width, height);
      this.ctx.closePath();
      this.ctx.clip();
    }

    this.set({
      textAlign: 'left',
      textBaseline: 'top'
    })
    lines.forEach((l, i) => {
      this.ctx.fillText(l, x0, y0 + i * lineHeight);
    })

    if (overflow === 'hidden') {
      this.ctx.restore();
    }

    this.set({
      textAlign: originalAlign,
      textBaseline: originalBaseline
    })

    return this
  }

  fontSize (): number {
    const re = /(\d+)(px|em|rem|pt)/;
    const size = this.ctx.font.match(re)[1];
    return +size;
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
  'quadraticCurveTo',
  'transform',
  'translate',
  'scale',
  'rotate',
  'save',
  'restore',
  'fillText',
  'strokeText',
  'setLineDash'
]

const aliasMap = {
  'beginPath': ['begin', 'start'],
  'closePath': ['close', 'end'],
  'clearReact': 'clear',
  'moveTo': 'mt',
  'lineTo': 'lt',
  'translate': ['move', 'mv'],
  'measureTextWidth': 'tw',
  'quadraticCurveTo': 'qt',
  'besizerCurveTo': 'ct',
  'lineWidth': 'lw',
  'setLineDash': ['lineDash', 'dash']
}

chainMethodMap.forEach(fn => {
  Painter.prototype[fn] = function (): Painter {
    this.ctx[fn](...arguments);

    return this;
  }
})

for (let k in aliasMap) {
  let alias = aliasMap[k as keyof typeof aliasMap]
  if (typeof alias == 'string') {
    Painter.prototype[alias] = Painter.prototype[k]
  } else {
    alias.forEach(a => {
      Painter.prototype[a] = Painter.prototype[k]
    })
  }
}