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
    .fillText('包宇坤', 200, 100)
}
document.body.appendChild(p.canvas)