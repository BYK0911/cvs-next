import { Painter } from '../lib'

const p = new Painter(400, 200)

document.body.onload = () => {
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
    .fillText('包宇坤', 120, 100)
    .set('strokeStyle', '#0af')
    .lw(2)
    .dash([5, 5])
    .begin()
    .polyline([10, 10, 390, 10, 390, 190, 10, 190])
    .close()
    .stroke()
    .set({
      fillStyle: '#666',
      font: '14px xingkai'
    })
    .text('这是一段非常长的句子，很有可能会换行显示，限制宽度为100px，超出后会换行', 220, 60, { width: 160, breakWord: true, lineHeight: 20 })
    .text('自动缩放', 100, 120, { wrap: false, autoScale: true, width: 100, height: 50 })
    .text('自动缩放', 100, 120, { wrap: false, width: 100, height: 50 })
}
document.body.appendChild(p.canvas)