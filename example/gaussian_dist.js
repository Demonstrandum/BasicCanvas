import * as BC from '../lib/BasicCanvas.js';
import {grid, ellipse} from '../lib/BasicShapes.js';

use(BC);

const sketch = canvas_id('sketch');

sketch.dimensions(400, 400);
sketch.translate(200, 200);
sketch.scale(30, -30);

sketch.fill = Color`transparent`;
sketch.stroke = Color`black`;

const gaussian = (mean = 0, σ = 1) => {
  const ϑ = Math.random() * Math.TAU;
  const ρ = Math.sqrt(-2 * Math.log(1 - Math.random()));
  const radius = σ * ρ;

  return Polar(radius, ϑ, P(mean, mean));
};

const points = [];
const r = 0.4;

sketch.loop(() => {
  sketch.background('#fff');

  sketch.temp(() => {
    for (const x of points) {
      sketch.stroke_weight = 0;
      const dot = sketch.shape(ellipse(P(x, 0), 0.15, r));
      dot.fill(RGBA(0, 20));
    }
  });

  sketch.shape(shape => {
    let prev = -6;
    let freq = 0;

    for (const x of points.sort((n, m) => n - m)) {
      if (x === prev) {
        freq++;
      } else {
        shape.vertex(x, 0.6 + 100 * freq / points.length);
        freq = 0;
      }
      prev = x;
    }
  });

  if (points.length > 1500) {
    points.length = 0;
  }

  const position = gaussian(0, 1.4);
  points.push(position.x.roundTo(1));

  sketch.shape(grid(6));
});
