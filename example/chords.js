import * as BC from '../lib/BasicCanvas.js';

const sketch = BC.canvas_id('sketch');
sketch.FPS = 60;
sketch.dimensions(400, 400);

console.log(sketch._interval);

sketch.stroke = BC.RGBA(0, 20);
sketch.stroke_weight = 1;
sketch.stroke_cap = 'butt';

const polar = (r, theta) => BC.Point(r * Math.cos(theta), r * Math.sin(theta));

const radius = sketch.width / 2 - 30;
let last = polar(radius, 0);

sketch.translate(sketch.width / 2, sketch.height / 2);
sketch.background(BC.RGB(255));
sketch.loop(() => {
  const next = polar(radius, Math.random() * Math.TAU);
  sketch.shape('chord', shape => {
    shape.vertex(last);
    shape.vertex(next);
  });

  last = next;
});
