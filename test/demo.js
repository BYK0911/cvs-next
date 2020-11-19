import { Painter } from '../lib'
import { render } from './render'

const p = new Painter(400, 200)

document.body.onload = () => render(p)

document.body.appendChild(p.canvas)