import * as BC from '../lib/BasicCanvas.js';

const sketch = BC.canvas_id('sketch');
sketch.dimensions(400, 400);

sketch.stroke = BC.Color(0, 0, 0, 100);
sketch.stroke_weight = 8;
sketch.stroke_cap = 'round';

let i = 0;
sketch.loop(() => {
  sketch.background(BC.Color(255, 150, 90));
  for (let j = 0; j < 8; j++) {
    sketch.shape('sine', shape => {
      for (let x = 0; x < 3 * Math.PI; x += 0.4) {
        shape.vertex(BC.Point(
          32 * x + 50,
          32 * Math.sin(i) * Math.sin(x + j + i) + 100 + 32 * j
        ));
      }
    });
  }
  i += 0.1;
});
