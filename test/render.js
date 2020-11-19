Object.defineProperty(exports, "__esModule", { value: true });

exports.render = function (p) {
  const gradient = p.createLinearGradient(400, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3');
  
  p.set({
    fillStyle: '#000',
    textAlign: 'center',
    textBaseline: 'middle'
  })
    .fillRect(0, 0, 500, 500)
    .set({ fillStyle: gradient })
    .fillRect(0, 0, 500, 500)
    
    .save()
    .move(200, 100)
    .rotate(Math.PI / 6)
    .set({
      fillStyle: '#555',
      font: '50px Arial',
    })
    .fillText('Hanshow', 0, 0)
    .restore()
    .set({
      fillStyle: '#ddd',
      font: '30px Arial',
    })
    .fillText('Hanshow', 80, 30)
    
    .set('strokeStyle', '#000')
    .begin()
    .polyline([0, 50, 400, 50])
    .stroke()
    .close()
    
    .set({
      fillStyle: '#f00',
      font: '50px xingkai',
    })
    .fillText('包宇坤', 120, 100)
    .set('fillStyle', '#fff')
    .text('电子价签产品线', 120, 130, { wrap: false, autoScale: true, width: 160, align: 'center' })

    .set({
      fillStyle: '#ddd',
      font: '14px xingkai'
    })
    .text('应用软件组 职位：Web前端开发工程师 手机号：187****7270 邮箱：bykmail1992@163.com', 220, 110, { width: 160, lineHeight: 24, vAlign: 'middle' })
}
