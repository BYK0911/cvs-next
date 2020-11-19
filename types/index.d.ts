import { CanvasRenderingContext2D } from "canvas";
interface TextSettings {
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
export declare class Painter {
    canvas: HTMLCanvasElement | import("canvas").Canvas;
    ctx: CanvasRenderingContext2D;
    [key: string]: any;
    constructor(canvasWidth?: number, canvasHeight?: number);
    set(key: string, value: any): Painter;
    set(option: object): Painter;
    resize(width: number, height: number): Painter;
    measureTextWidth(text: string): number;
    lineWidth(n: number): Painter;
    polyline(points: number[]): Painter;
    text(content: string, x: number, y: number, options: TextSettings): Painter;
    autoScaleText(text: string, x: number, y: number, options: TextSettings): Painter;
    mutipleLineText(text: string, x: number, y: number, options: TextSettings): Painter;
    fontSize(): number;
}
export {};
