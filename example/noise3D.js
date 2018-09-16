import * as _ from 'https://cdn.rawgit.com/Demonstrandum/4dcebc41e54961abd0b0a1b0ecfdd97d/raw/4fa388d578dadfea0d1218707d9f5022606de96d/perlin.js';
import * as BC from '../lib/BasicCanvas.js';

const canvas = BC.canvas(document.getElementById('sketch'));
canvas.dimensions(100, 100);

canvas.fill = BC.HEX('#fff');
canvas.background();

noise.seed(Math.random());  // Use the Noise library

// Even using simplex is slow... (my fault)
canvas.loop(frame => {
  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      const mono = 127.5 * (noise.perlin3(x * 0.04, y * 0.04, frame * 0.1) + 1);
      canvas.point(BC.Point(x, y), BC.RGB(mono));
    }
  }
});
