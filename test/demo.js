import { Painter } from '../lib'
import { render } from './render'

const p = new Painter(400, 200)

document.body.onload = () => {
  render(p)

  const img = new Image()
  img.src = '../public/logo.png'
  img.onload = function () {
    p.img(img, 10, 14, 120, 24);
  }
}

document.body.appendChild(p.canvas)