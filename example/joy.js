import * as _ from 'https://cdn.rawgit.com/Demonstrandum/4dcebc41e54961abd0b0a1b0ecfdd97d/raw/4fa388d578dadfea0d1218707d9f5022606de96d/perlin.js';
import * as BC from '../lib/BasicCanvas.js';
import {rectangle} from '../lib/BasicShapes.js';

const canvas = BC.canvas(document.getElementById('sketch'));
canvas.dimensions(450, 600);
canvas.translate(canvas.width / 2, canvas.height / 2);

canvas.fill = '#000';
canvas.stroke_weight = 1;

const base = 3.7;
const w = 0.0000006;
const offset = 20;
const spacing = 10;
const depth = 3;

const rows =  Math.floor(canvas.height / spacing) - 12;

canvas.loop(frame => {
  canvas.background();

  for (let row = -rows / 2; row < rows / 2; row++) {
    canvas.render(shape => {
      const lower = -canvas.width / 2 + depth + 10;
      const upper = canvas.width  / 2 - depth - 10;

      canvas.stroke = '#fff';
      for (let x = lower; x <= upper; x++) {
        let height = -70 * Math.pow(
          base,
          -(w + 0.0000001) * Math.pow(
            Math.abs(x),
            3)) + 10; // Don't allow it to be zero, otherwise it's just flat...

        height *= 0.1
          + 0.54 * noise.perlin2(x / 25, row + frame / 120)
          + 0.15 * noise.perlin2(x / 5, -row + frame / 40 + 1);
        shape.vertex(x, offset + height + spacing * row);
      }
      canvas.stroke = '#000';
      shape.vertex(upper, 50 + offset + spacing * row);
      shape.vertex(lower, 50 + offset + spacing * row);
      shape.close();
    });
  }
});
