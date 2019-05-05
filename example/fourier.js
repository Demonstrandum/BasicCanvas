import * as BC from '../lib/BasicCanvas.js';
import {ellipse, line} from '../lib/BasicShapes.js';

use(BC);

const sketch = canvas_id('sketch');

sketch.dimensions(700, 360);
sketch.translate(3 * sketch.width / 4, sketch.height / 2);
sketch.scale(-1, 1);

console.log(sketch.corner);

const BG = HEX`#000`;
sketch.fill = 'transparent';
sketch.stroke = HEX`#fff`;
sketch.stroke_weight = 2;

const SPEED = 0.3;
const STEP = 2;    // 1:SAWTOOTH; 2:SQUARE, 3+:FUNKY
const DEPTH = STEP * 10;
const radius = 120;
const bar = radius * (
  [...new Array(DEPTH).keys()]
    .reduce((a, x) => a + 1 / (STEP * x + 1), 0)
);// Couldn't be bothered to write a loop for the minimum
  //   bar length, so this is my way of summing a harmonic series.

const trail = [];
const outline = [];

const series = (theta, n = 1, tail = P(0, 0)) => {
  if (n > DEPTH) {
    sketch.stroke = HEX`#fff`;
    return tail;
  }

  const r = radius / n;
  sketch.stroke = RGBA(255, 100 + n * 120 / DEPTH);
  sketch.render(ellipse(tail, r));
  const head = tail.add(Polar(r, n * Math.PI * theta));
  sketch.stroke = RGBA(255, 80);
  sketch.render(line(head, tail))
  return series(theta, n + STEP, head);
};

sketch.loop(frame => {
  sketch.background(BG);
  sketch.point(P(0, 0));

  const theta = SPEED * frame / 90;
  const outer = series(theta);
  const end = P(bar, outer.y);

  sketch.stroke_cap = 'round';
  sketch.render(ellipse(outer, 2, 2));
  sketch.shape(line(outer, end)).stroke(RGBA(255, 200));
  sketch.render(ellipse(end, 2, 2));

  if (trail.length > 120 * SPEED * DEPTH) {
    trail.pop();
  }
  trail.unshift(outer.y);

  let x = bar;
  sketch.render(shape => {
    for (const y of trail) {
      shape.vertex(x, y);
      x += SPEED;
    }
  });

  sketch.stroke_cap = 'butt';
  if (outline.length > 80 * SPEED * DEPTH) {
    outline.shift();
  }
  outline.push(outer);
  sketch.render(shape => {
    let i = 0;
    for (const p of outline) {
      sketch.stroke = RGBA(255, i * 255 / outline.length);
      shape.vertex(p);
      i += 1;
    }
  });
  sketch.stroke = HEX`#fff`;
});
