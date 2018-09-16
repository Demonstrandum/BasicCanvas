import * as BC from '../lib/BasicCanvas.js';

const sketch = BC.canvas_id('sketch');
sketch.dimensions(400, 400);
sketch.translate(sketch.width / 2, sketch.height / 2);

sketch.fill = BC.RGB(50, 30, 80);
sketch.stroke = BC.HSL(340, 100, 45, 170);
sketch.stroke_weight = 4;
sketch.stroke_cap = 'round';

const vector = (origin, length, angle) => {
  const final = BC.Point(
    length * Math.cos(-angle) + origin.x,
    length * Math.sin(-angle) + origin.y
  );
  sketch.shape(null, shape => {
    shape.vertex(origin);
    shape.vertex(final);
  });
  return final;
};

const branch = (previus, angle, depth, inc) => {
  if (depth < 0) {
    return;
  }

  const next = vector(previus, (depth) ** (1 / 2) * 16, angle);

  branch(next, angle + inc, depth - 1, inc);
  branch(next, angle - inc, depth - 1, inc);
};

sketch.loop(frame => {
  sketch.background();
  vector(BC.Point(0, 200), 130, Math.PI / 2);
  branch(BC.Point(0, 70), Math.PI / 2, 7, 0.6 + Math.sin(frame / 10) / 3);
});
