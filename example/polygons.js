import * as BC from '../lib/BasicCanvas.js';
import {polygon, grid} from '../lib/BasicShapes.js';

const P = BC.Point;

const canvas = BC.canvas(document.getElementById('sketch'));
canvas.dimensions(400, 400);
canvas.translate(canvas.width / 2, canvas.height / 2);
canvas.scale(40, 40);

canvas.stroke = BC.HEX('#111');
canvas.font = '12px monospace';

canvas.shape(null, grid(10));

canvas.stroke_weight = 1.5;
for (let gon = 3; gon <= 8; gon++) {
  canvas.stroke = BC.RGBA(0, (gon - 3) * 180 / 5 + 75);
  canvas.shape('regular', polygon(P(0, 0), gon, 3));
}
