import * as BC from '../lib/BasicCanvas.js';

const sketch = BC.canvas_id('sketch');
sketch.dimensions(400, 400);

sketch.stroke = BC.RGBA(0, 0, 0, 100);
sketch.stroke_weight = 8;
sketch.stroke_cap = 'round';

sketch.loop(frame => {
  const i = frame / 10;
  sketch.background(BC.RGBA(255, 150, 90));
  for (let j = 0; j < 8; j++) {
    sketch.render('sine', shape => {
      for (let x = 0; x < 3 * Math.PI; x += 0.4) {
        shape.vertex(BC.Point(
          32 * x + 50,
          32 * Math.sin(i) * Math.sin(x + j + i) + 100 + 32 * j
        ));
      }
    });
  }
});
