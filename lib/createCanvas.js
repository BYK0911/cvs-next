"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const hidpi_1 = require("./hidpi");
function default_1(width = 500, height = 300) {
    if (typeof window == 'undefined') {
        return canvas_1.createCanvas(width, height);
    }
    else {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        hidpi_1.hidpi(canvas);
        return canvas;
    }
}
exports.default = default_1;
