import * as BC from '../lib/BasicCanvas.js';


let sketch = BC.canvas_id('sketch');
sketch.dimensions(400, 400);

sketch.stroke = BC.Color(0);
sketch.stroke_weight = 3;
sketch.stroke_cap = 'round';


let i = 0;
sketch.loop(() => {
  sketch.background(BC.Color(255, 255, 110));
  for (let j = 0; j < 8; j++) {
    sketch.shape('sine', (shape) => {
      for (let x = 0; x < 3*Math.PI; x += 0.1)
        shape.vertex(BC.Point(32*x + 50, 32*Math.sin(i)*Math.sin(x+j+i) + 100 + 30*j));
    });
  }
  i += 0.1;
});
