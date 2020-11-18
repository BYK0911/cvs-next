const path = require('path');
const fs = require('fs')
const { registerFont } = require('canvas');
const { Painter } = require('../lib');

const p = new Painter(400, 200);

const fontPath = path.resolve(__dirname, '../public/fonts/STXINGKA.TTF');
registerFont(fontPath, { family: 'xingkai' })

p.set({
  fillStyle: '#f0f0f0',
  textAlign: 'center',
  textBaseline: 'middle'
})

p.fillRect(0, 0, 500, 500)
  .save()
  .move(200, 100)
  .rotate(Math.PI / 6)
  .set({
    fillStyle: '#ccc',
    font: '50px Arial',
  })
  .fillText('Hello world', 0, 0)
  .restore()
  .set({
    fillStyle: '#f00',
    font: '50px xingkai',
  })
  .fillText('包宇坤', 200, 100)
  .set('strokeStyle', '#0af')
  .lw(2)
  .dash([5, 5])
  .begin()
  .polyline([10, 10, 390, 10, 390, 190, 10, 190])
  .close()
  .stroke()

const filePath = path.resolve(__dirname, '../public/test.png');
const out = fs.createWriteStream(filePath);
const stream = p.canvas.createPNGStream();

stream.pipe(out);
out.on('finish', () =>  console.log('The PNG file was created.'));