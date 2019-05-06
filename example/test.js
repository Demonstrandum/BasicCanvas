import * as BC from '../lib/BasicCanvas.js';

use(BC);

const sketch = canvas_id('sketch');
sketch.dimensions(400, 400);

sketch.background(RGB(100, 170, 155));

sketch.fill = HEX(0x34ff99)
sketch.stroke = HSL(200, 100, 50);


const triangle = sketch.shape(shape => {
  shape.vertex(200, 80);
  shape.vertex(45, 350);
  shape.vertex(355, 350);
  shape.close();
  shape.center = P(200, 240)
});

triangle.render();
triangle.rotate(Math.PI)
triangle.scale(0.8)
triangle.translate(0, 20)
triangle.render(RGBA(255, 100, 200, 100));

sketch.point(triangle.center, RGB(0));
