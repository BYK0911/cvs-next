"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Painter = void 0;
const createCanvas_1 = __importDefault(require("./createCanvas"));
class Painter {
    constructor(canvasWidth = 500, canvasHeight = 300) {
        this.canvas = createCanvas_1.default();
        this.ctx = this.canvas.getContext('2d');
        this.resize(canvasWidth, canvasHeight);
    }
    set(key, value) {
        if (typeof key === 'string') {
            Object.assign(this.ctx, { [key]: value });
        }
        else {
            Object.assign(this.ctx, key);
        }
        return this;
    }
    resize(width, height) {
        if (!('style' in this.canvas)) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        else {
            const pixelRatio = window.devicePixelRatio;
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
            this.canvas.width = width * pixelRatio;
            this.canvas.height = height * pixelRatio;
        }
        return this;
    }
    measureTextWidth(text) {
        return this.ctx.measureText(text).width;
    }
    lineWidth(n) {
        this.ctx.lineWidth = n;
        return this;
    }
    polyline(points) {
        const len = points.length;
        if (len >= 4 && len % 2 === 0) {
            this.ctx.moveTo(points[0], points[1]);
            for (let i = 2; i < len; i += 2) {
                this.ctx.lineTo(points[i], points[i + 1]);
            }
        }
        return this;
    }
    text(content, x, y, options) {
        const { autoScale = false, wrap = true } = options;
        if (wrap && options.width)
            return this.mutipleLineText(content, x, y, options);
        if (autoScale && (options.width || options.height))
            return this.autoScaleText(content, x, y, options);
        const fontSize = this.fontSize();
        const { width = this.measureTextWidth(content), lineHeight = fontSize, align = 'left', vAlign = 'top', overflow = 'hidden' } = options;
        const height = options.height || lineHeight;
        const x0 = align === 'left' ? x : align === 'center' ? x - width / 2 : x - width;
        const y0 = vAlign === 'top' ? y : vAlign === 'middle' ? y - height / 2 : y - height;
        this.ctx.save();
        this.set({
            textAlign: 'left',
            textBaseline: 'top'
        });
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
    autoScaleText(text, x, y, options) {
        const fontSize = this.fontSize();
        let { width, height, lineHeight = fontSize, align = 'left', vAlign = 'top' } = options;
        const tw = this.measureTextWidth(text);
        if (width === undefined)
            width = height / lineHeight * tw;
        if (height === undefined)
            height = fontSize * width / tw;
        const x0 = align === 'left' ? x : align === 'center' ? x - width / 2 : x - width;
        const y0 = vAlign === 'top' ? y : vAlign === 'middle' ? y - height / 2 : y - height;
        this.ctx.save();
        this.set({
            textAlign: 'left',
            textBaseline: 'top'
        });
        this.ctx.translate(x0, y0);
        this.ctx.scale(width / tw, height / lineHeight);
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
        return this;
    }
    mutipleLineText(text, x, y, options) {
        const originalAlign = this.ctx.textAlign;
        const originalBaseline = this.ctx.textBaseline;
        const fontSize = this.fontSize();
        const { width = 500, lineHeight = fontSize, breakWord = false, overflow = 'hidden', align = 'left', vAlign = 'top' } = options;
        const words = text.split(breakWord ? '' : ' ');
        const lines = [];
        let currentLine = '';
        while (words.length) {
            const next = words.shift();
            // if (!currentLine && next == ' ') continue
            const tw = this.measureTextWidth(currentLine + next);
            if (tw > width) {
                if (currentLine === '') {
                    lines.push(next);
                }
                else {
                    lines.push(currentLine);
                    currentLine = next;
                }
            }
            else {
                currentLine += next;
            }
        }
        if (currentLine)
            lines.push(currentLine);
        if (lines.length === 0)
            return this;
        const H = lines.length * lineHeight;
        const height = options.height || H;
        const x0 = align === 'left' ? x : align === 'center' ? x - width / 2 : x - width;
        let y0 = vAlign === 'top' ? y : vAlign === 'middle' ? y - H / 2 : y - H;
        const _y0 = vAlign === 'top' ? y : vAlign === 'middle' ? y - height / 2 : y - height;
        y0 += (lineHeight - fontSize) / 2;
        if (overflow === 'hidden') {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.rect(x0, _y0, width, height);
            this.ctx.closePath();
            this.ctx.clip();
        }
        this.set({
            textAlign: 'left',
            textBaseline: 'top'
        });
        lines.forEach((l, i) => {
            this.ctx.fillText(l, x0, y0 + i * lineHeight);
        });
        if (overflow === 'hidden') {
            this.ctx.restore();
        }
        this.set({
            textAlign: originalAlign,
            textBaseline: originalBaseline
        });
        return this;
    }
    fontSize() {
        const re = /(\d+)(px|em|rem|pt)/;
        const size = this.ctx.font.match(re)[1];
        return +size;
    }
}
exports.Painter = Painter;
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
];
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
};
chainMethodMap.forEach(fn => {
    Painter.prototype[fn] = function () {
        this.ctx[fn](...arguments);
        return this;
    };
});
for (let k in aliasMap) {
    let alias = aliasMap[k];
    if (typeof alias == 'string') {
        Painter.prototype[alias] = Painter.prototype[k];
    }
    else {
        alias.forEach(a => {
            Painter.prototype[a] = Painter.prototype[k];
        });
    }
}
