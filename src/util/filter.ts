import { Canvas, Image, createCanvas } from 'canvas'

interface Color {
  r: number;
  g: number;
  b: number;
}

// 默认调色板
const defaultPalette = [
  { r: 0, g: 0, b: 0 },
  { r: 255, g: 255, b: 255 },
]

/**
 * 二值化
 * @param imageData 像素信息
 * @param colors 颜色列表
 */
export function binary (image: ImageData | Canvas | Image, colors?: string[], options?: { width: number, height: number }): ImageData {
  const imageData =  image instanceof ImageData ? image : getImageData(image, options)
  const palette = colors?.length > 0 ? initPalette(colors) : defaultPalette;
  const data = imageData.data;
  const len = imageData.data.length;

  for (let i = 0; i < len; i += 4) {
    const { r, g, b } = getClosestColor({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2]
    }, palette)

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  return imageData;
}

/**
 * 图像抖动
 * @param imageData 像素信息
 * @param colors 颜色列表
 */
export function dithering (image: ImageData | Canvas | Image, colors: string[], options?: { width: number, height: number }): ImageData {
  const imageData =  image instanceof ImageData ? image : getImageData(image, options)
  const palette = colors?.length > 0 ? initPalette(colors) : defaultPalette;
  const data = imageData.data;
  const len = imageData.data.length;
  const width = imageData.width;
  const height = imageData.height;

  for (let i = 0; i < len; i += 4) {
    const c = {
      r: data[i],
      g: data[i + 1],
      b: data[i + 2]
    }
    const closest = getClosestColor(c, palette);
    const { r, g, b } = closest;
    const diff = sub(c, closest);

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    const row = i / 4 % width;
    const col = i / 4 - row * width;
    if (col < width - 1) update(data, i + 4, mul(diff, 7 / 16));
    if (col > 1 && row < height - 1) update(data, i + width * 4 - 4, mul(diff, 3 / 16));
    if (row < height - 1) update(data, i + width * 4, mul(diff, 5 / 16));
    if (col < width - 1 && row < height - 1) update(data, i + width * 4 + 4, mul(diff, 1 / 16));
  }
  return imageData;
}

function getImageData (image: Canvas | Image, options?: { width: number, height: number }): ImageData {
  const width = options?.width || image.width;
  const height = options?.height || image.height;
  const p = createCanvas(width, height).getContext('2d');
  p.drawImage(image, 0, 0, width, height);

  return p.getImageData(0, 0, width, height)
}

/**
 * 获取颜色的rgb值
 * @param colors 颜色列表
 */
function initPalette (colors: string[]): Color[] {
  const len = colors.length
  const cvs = createCanvas(len, 1);
  const ctx = cvs.getContext('2d');

  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i, 0, 1, 1);
  })

  const data = ctx.getImageData(0, 0, len, 1).data
  const palette = [];

  for(let i = 0; i < len * 4; i += 4) {
    palette.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2]
    })
  }

  return palette;
}

/**
 * 从调色板中获取最近邻色
 * @param c 颜色
 * @param palette 调色板
 */
function getClosestColor (c: Color, palette: Color[]): Color {
  let closest: Color;
  let delta = Infinity;
  palette.forEach(_c => {
    const dist = getColorDistance(c, _c);
    if (dist < delta) {
      delta = dist
      closest = _c
    } 
  })
  return closest;
}

/**
 * 计算两个颜色的距离
 * @param c1 颜色1
 * @param c2 颜色2
 */
function getColorDistance (c1: Color, c2: Color): number {
  return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b);
}

function update (data: Uint8ClampedArray, i: number, c: Color): void {
  data[i] += c.r;
  data[i + 1] += c.g;
  data[i + 2] += c.b;
}

function sub (c1: Color, c2: Color): Color {
  return {
    r: c1.r - c2.r,
    g: c1.g - c2.g,
    b: c1.b - c2.b
  };
}

function mul (c: Color, n: number): Color {
  return {
    r: c.r * n,
    g: c.g * n,
    b: c.b * n
  };
}