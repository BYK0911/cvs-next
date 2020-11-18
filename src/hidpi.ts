
// canvas processed
const processedCanvasMap = new WeakMap()

/**
 * canvas hidpi polyfill func
 * @param {HTMLCanvasElement} canvas
 */
export function hidpi (canvas: HTMLCanvasElement):void {
  if (typeof window == 'undefined') return;
  if (processedCanvasMap.has(canvas)) return;
  // if (window.devicePixelRatio === 1) return;
  
  canvas.getContext = getContext;
  processedCanvasMap.set(canvas, true);
}

/**
 * get context method
 * @param {string} contextId canvas rendering context id 
 * @param {any} option canvas rendering context setting option
 */
function getContext (contextId: '2d', option?: CanvasRenderingContext2DSettings) : CanvasRenderingContext2D;
function getContext (contextId: 'bitmaprenderer', option?: ImageBitmapRenderingContextSettings) : ImageBitmapRenderingContext;
function getContext (contextId: "webgl", options?: WebGLContextAttributes): WebGLRenderingContext;
function getContext (contextId: "webgl2", options?: WebGLContextAttributes): WebGL2RenderingContext;
function getContext (this:HTMLCanvasElement, type: string, option: any): RenderingContext {
  if (type == '2d') {
    const pixelRatio = window.devicePixelRatio;
    
    this.style.width = this.width + 'px'; 
    this.style.height = this.height + 'px';
    this.width *= pixelRatio;
    this.height *= pixelRatio;

    const context = HTMLCanvasElement.prototype.getContext.call(this, '2d', option);
    processContext(context);

    return context;
  } else {
    return HTMLCanvasElement.prototype.getContext.call(this, type, option);
  }
}

/**
 * adjust the rendering context to fit the device pixel ratio
 * @param {CanvasRenderingContext2D} context canvas rendering context of 2d 
 */
function processContext (context: CanvasRenderingContext2D): void {
  const pixelRatio = window.devicePixelRatio;
  const ratioArgs = {
    'fillRect': 'all',
    'clearRect': 'all',
    'moveTo': 'all',
    'lineTo': 'all',
    'arc': [0,1,2],
    'arcTo': 'all',
    'bezierCurveTo': 'all',
    'isPointInPath': 'all',
    'isPointInStroke': 'all',
    'quadraticCurveTo': 'all',
    'rect': 'all',
    'translate': 'all',
    'createRadialGradient': 'all',
    'createLinearGradient': 'all',
    'createImageData': 'all',
    'getImageData': 'all',
    'putImageData': [1, 2]
  }

  for (const key in ratioArgs) {
    const k = key as keyof typeof ratioArgs;
    context[k] = function () {
      const value = ratioArgs[k as keyof typeof ratioArgs];
      const args = [...arguments];
      
      if (value === 'all') {
        args.forEach(v => v * pixelRatio);
      } else if (value instanceof Array) {
        value.forEach((v, i) => {
          value[i] = v * pixelRatio;
        })
      }

      return CanvasRenderingContext2D.prototype[k].apply(context, args)
    }
  }

  context.drawImage = function () {
    const args = [...arguments];
    let value: number[];

    switch (args.length) {
      case 3:
        args.push(args[0].width, args[0].height);
      case 5:
        value = [1, 2, 3, 4];
        break;
      case 9: 
        value = [5, 6, 7, 8]
        break;
    }

    value.forEach(i => {
      args[i] *= pixelRatio
    })

    CanvasRenderingContext2D.prototype.drawImage.apply(context, args)
  }

  context.stroke = function () {
    context.lineWidth *= pixelRatio;
    CanvasRenderingContext2D.prototype.stroke.apply(context, arguments);
    context.lineWidth /= pixelRatio;
  }

  context.strokeRect = function () {
    context.lineWidth *= pixelRatio;
    CanvasRenderingContext2D.prototype.strokeRect.apply(context, arguments);
    context.lineWidth /= pixelRatio;
  }

  context.fillText = function () {
    this.font = this.font.replace(/(\d+)(px|em|rem|pt)/g, (w:string, m: number, u:string) => m * pixelRatio + u)
    CanvasRenderingContext2D.prototype.fillText.apply(this, arguments)
    this.font = this.font.replace(/(\d+)(px|em|rem|pt)/g, (w:string, m: number, u:string) => m / pixelRatio + u)
  }

  context.strokeText = function () {
    context.lineWidth *= pixelRatio;
    this.font = this.font.replace(/(\d+)(px|em|rem|pt)/g, (w:string, m: number, u:string) => m * pixelRatio + u)
    CanvasRenderingContext2D.prototype.strokeText.apply(this, arguments)
    this.font = this.font.replace(/(\d+)(px|em|rem|pt)/g, (w:string, m: number, u:string) => m / pixelRatio + u)
    context.lineWidth /= pixelRatio;
  }
}