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
      fillStyle: '#333',
      font: '50px Arial',
    })
    .fillText('Hanshow', 0, 0)
    .restore()
    .set({
      fillStyle: '#999',
      font: '18px xingkai',
      textAlign: 'right',
      textBaseline: 'bottom'
    })
    .fillText('汉朔电子科技有限公司', 390, 42)
    
    .set('strokeStyle', '#ddd')
    .begin()
    .polyline([0, 50, 400, 50])
    .stroke()
    .close()
    
    .set({
      fillStyle: '#f00',
      font: '50px xingkai',
      textAlign: 'center',
      textBaseline: 'middle'
    })
    .fillText('包宇坤', 120, 100)
    .set('fillStyle', '#ccc')
    .text('电子价签产品线', 120, 130, { wrap: false, autoScale: true, width: 160, align: 'center' })

    .set({ font: '14px xingkai' })
    .text('应用软件组 职位：Web前端开发工程师 手机号：18730647270 邮箱：bykmail1992@163.com', 230, 120, { width: 160, lineHeight: 24, vAlign: 'middle' })
}
