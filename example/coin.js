import * as BC from '../lib/BasicCanvas.js';

const sketch = BC.canvas_id('sketch');
sketch.dimensions(400, 400);

sketch.stroke = BC.RGBA(255, 10);
sketch.stroke_weight = 8;
sketch.stroke_cap = 'round';

const radius = 150;

let i = 0;
sketch.loop(() => {
  sketch.background(BC.RGBA(200, 120, 90));
  for (let j = 0; j < 8; j++) {
    sketch.render('coin', shape => {
      for (let theta = 0; theta <= Math.TAU; theta += 0.3) {
        shape.vertex(BC.Point(
          radius * Math.cos(i) * Math.cos(theta) + 200,
          radius * Math.sin(theta) + 200
        ));
      }
    }).close().fill(BC.RGBA(255, 20 * Math.sin(i + Math.PI / 2) ** 2));
  }
  i += 0.05;
});
