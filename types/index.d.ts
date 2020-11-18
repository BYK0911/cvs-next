import { CanvasRenderingContext2D } from "canvas";
interface MutipleLineTextSettings {
    width: number;
    height?: number;
    overflow?: 'auto' | 'hidden';
    lineHeight?: number;
    breakWord?: true;
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
    mutipleLineText(text: string, x: number, y: number, options: MutipleLineTextSettings): this;
    fontSize(): number;
}
export {};
