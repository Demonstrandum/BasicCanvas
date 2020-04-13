import fs from 'fs';
import Canvas from 'canvas';

import * as BC from './lib/BasicCanvas.js';
import { line, polygon } from './lib/BasicShapes.js';

use(BC);

const sketch = canvas(Canvas.createCanvas());

sketch.dimensions(700, 700);
sketch.background(HEX(0xffbbdd));

sketch.translate(sketch.width / 2, sketch.height / 2);

sketch.stroke = HSL(340, 100, 45, 70);
sketch.stroke_weight = 5;
sketch.stroke_cap = 'round';

const branch = (previous, angle, depth, inc, first = true) => {
  if (depth <= 0) return;

  const next = Polar(depth * 7, -angle, previous);
  sketch.render(line(next, previous));

  const incr = inc + depth * 0.001;
  branch(next, angle + incr, depth - 1, inc, false);
  branch(next, angle - incr, depth - 1, inc, false);
};

const root = P(0, 120);
branch(root, Math.PI / 2, 11, 0.7);

const eye = sketch.shape(polygon(P(90, 40), 5, 30));
eye.scale(1, 0.7);

sketch.render(eye);
eye.translate(P(-180, 0));
sketch.render(eye);

const mouth = eye;
delete mouth.vertices[0];
delete mouth.vertices[5]
mouth.translate(P(90, 180));
mouth.scale(2, 0.8);
sketch.render(mouth);

const buffer = sketch.elem.toBuffer('image/png');
fs.writeFileSync('fractal-woman.png', buffer);
