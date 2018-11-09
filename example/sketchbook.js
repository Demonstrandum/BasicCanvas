import * as BC from '../lib/BasicCanvas.js';

const canvas = BC.canvas(document.getElementById('sketch'));
canvas.dimensions(400, 400);
canvas.translate(canvas.width / 2, canvas.height / 2);
canvas.scale(10, 10);

canvas.stroke = BC.HEX`#a9f`;
canvas.stroke_weight = 20;
canvas.stroke_cap = 'round';
canvas.fill = BC.HEX('#fafafa');
canvas.font = '12px monospace';

let vertices = [];
let drawing = false;

BC.mouse_down(() => {
  drawing = true;
}, canvas);

BC.mouse_up(() => {
  drawing = false;
  vertices = [];
}, canvas);

canvas.background();
canvas.loop(() => {
  if (drawing) {
    vertices.push(canvas.mouse);
  }

  canvas.shape('path', shape => {
    for (const vertex of vertices) {
      shape.vertex(vertex);
    }
  });
});
