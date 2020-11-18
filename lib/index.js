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
    'qudraticCurveTo',
    'transform',
    'translate',
    'scale',
    'rotate',
    'save',
    'restore',
    'fillText',
    'strokeText'
];
const aliasMap = {
    'beginPath': 'begin',
    'closePath': 'close',
    'clearReact': 'clear',
    'moveTo': 'mt',
    'lineTo': 'lt',
    'translate': 'move',
    'measureTextWidth': 'tw'
};
chainMethodMap.forEach(fn => {
    Painter.prototype[fn] = function () {
        this.ctx[fn](...arguments);
        return this;
    };
});
for (let k in aliasMap) {
    Painter.prototype[aliasMap[k]] = Painter.prototype[k];
}
