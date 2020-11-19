const path = require('path');
const fs = require('fs')
const { registerFont } = require('canvas');
const { Painter } = require('../lib');
const { render } = require('./render');

const p = new Painter(400, 200);
const fontPath = path.resolve(__dirname, '../public/fonts/STXINGKA.TTF');
registerFont(fontPath, { family: 'xingkai' })

render(p);

const filePath = path.resolve(__dirname, '../public/test.png');
const out = fs.createWriteStream(filePath);
const stream = p.canvas.createPNGStream();

stream.pipe(out);
out.on('finish', () =>  console.log('The PNG file was created.'));