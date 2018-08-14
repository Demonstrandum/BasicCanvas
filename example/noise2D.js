import * as _ from 'https://cdn.rawgit.com/Demonstrandum/4dcebc41e54961abd0b0a1b0ecfdd97d/raw/4fa388d578dadfea0d1218707d9f5022606de96d/perlin.js';
import * as BC from '../lib/BasicCanvas.js';

const canvas = BC.canvas(document.getElementById('sketch'));
canvas.dimensions(400, 400);

canvas.fill = BC.HEX('#ccc');
canvas.stroke = BC.HEX('#111');

canvas.loop(frame => {
  canvas.background();

  const wave = canvas.shape('wave', shape => {
    let perlin_x = 0;
    for (let x = 0; x < canvas.width; x++) {
      const y = 100 * noise.perlin2(perlin_x, frame / 60);
      shape.vertex(x, y + 200);
      perlin_x += 0.02;
    }

    shape.vertex(canvas.width, canvas.height);
    shape.vertex(0, canvas.height);
  });

  wave.close();
  wave.fill(canvas.stroke);
});
