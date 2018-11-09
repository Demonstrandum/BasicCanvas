import * as BC from '../lib/BasicCanvas.js';
import {grid, ellipse} from '../lib/BasicShapes.js';

use(BC);

const sketch = canvas_id('sketch');

sketch.dimensions(400, 400);
sketch.translate(200, 200);
sketch.scale(30, -30);

sketch.fill = RGBA(0, 20);
sketch.stroke = Color`black`;

Number.prototype.dp = function (places) {
  return Math.round(this * (10 ** places)) / (10 ** places);
};

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

  for (const old of points) {
    sketch.temp(() => {
      sketch.stroke_weight = 0;
      sketch.shape(ellipse(old, 0.15, r));
    });
  }

  sketch.shape(shape => {
    let prev = P(-6, 0);
    let freq = 0;

    for (const old of points.sort((n, m) => n.x - m.x)) {
      if (old.x === prev.x) {
        freq++;
      } else {
        shape.vertex(old.x, 0.6 + 100 * freq / points.length);
        freq = 0;
      }
      prev = old;
    }
  });

  if (points.length > 1500) {
    points.length = 0;
  }

  const position = gaussian(0, 1.4);
  position.x = position.x.dp(1);
  position.y = 0;
  points.push(position);

  sketch.shape(grid(10));
});
