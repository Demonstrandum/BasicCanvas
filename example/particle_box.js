import * as BC from '../lib/BasicCanvas.js';
import {grid} from '../lib/BasicShapes.js';

const canvas = BC.canvas_id('sketch');
canvas.dimensions(400, 400);
canvas.translate(25, 375);
canvas.scale(300, -20);

canvas.font = '12px Arial';

canvas.shape('gird', grid());

const L = 1;
const Ψ = (x, n) => Math.sqrt(2 / L) * Math.sin((x * n * Math.PI) / L);

for (let n = 1; n <= 6; n++) {
  canvas.shape(`Ψ_${n}`, shape => {
    for (let x = 0; x <= L + 0.005; x += 0.005) {
      shape.vertex(BC.Point(x, Ψ(x, n) + (n * 3 - 1)));
      console.log(`Ψ_${n}(${x.roundTo(5)}) = ${Ψ(x, n).roundTo(5)}`);
    }
  });
}
