import * as BC from '../lib/BasicCanvas.js';
import {line} from '../lib/BasicShapes.js';

use(BC);

const sketch = canvas_id('sketch');
sketch.dimensions(400, 400);
sketch.translate(sketch.width / 2, sketch.height / 2);

sketch.fill = RGB(50, 30, 80);
sketch.stroke = HSL(340, 100, 45, 170);
sketch.stroke_weight = 4;
sketch.stroke_cap = 'round';

const branch = (previous, angle, depth, inc, first = true) => {
  if (depth < 0) return;

  let next = previous;
  if (!first) {
    next = Polar(Math.sqrt(depth) * 16, -angle, previous);
    sketch.render(line(next, previous));
  }

  branch(next, angle + inc, depth - 1, inc, false);
  branch(next, angle - inc, depth - 1, inc, false);
};

const tree = P(0, 10);
sketch.loop(frame => {
  sketch.background();
  sketch.render(line(P(0, 200), tree));
  branch(tree, Math.PI / 2, 7, 0.6 + Math.sin(frame / 20) / 3);
});
