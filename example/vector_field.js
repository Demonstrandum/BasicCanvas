import * as _ from 'https://cdn.rawgit.com/Demonstrandum/4dcebc41e54961abd0b0a1b0ecfdd97d/raw/4fa388d578dadfea0d1218707d9f5022606de96d/perlin.js';
import * as BC from '../lib/BasicCanvas.js';
import {arrow} from '../lib/BasicShapes.js';

const canvas = BC.canvas(document.getElementById('sketch'));
const [width, height] = [400, 400];
canvas.dimensions(width, height);

canvas.fill = BC.HEX('#eee');
canvas.stroke_weight = 1.25;

const size = 16;
const zoom = 0.07;

const rows = size;
const cols = size;

canvas.loop(frame => {
  canvas.background();
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const origin = BC.Point(
        row * width / rows,
        col * height / cols
      );
      const phase = noise.perlin3(
        row * zoom,
        col * zoom,
        frame / 40
      ) * Math.TAU;
      const mag = width / size;

      canvas.stroke = BC.HSL(phase * 100 / Math.TAU + 300);
      canvas.render(arrow(mag - 3, phase, origin));
    }
  }
});
