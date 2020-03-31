import * as _ from 'https://cdn.rawgit.com/Demonstrandum/4dcebc41e54961abd0b0a1b0ecfdd97d/raw/4fa388d578dadfea0d1218707d9f5022606de96d/perlin.js';
import * as BC from '../lib/BasicCanvas.js';

use(BC)

const canvas = BC.canvas(document.getElementById('sketch'));
canvas.dimensions(400, 400);

const UPPER = 0xffffff;

canvas.loop(frame => {
    const noise_value = Math.round(
        UPPER * (0.5 + noise.perlin2(271, frame/9000)));

    const colour = BC.HEX(noise_value);
    if (frame % 30 === 0) console.log(colour.str);
    canvas.background(colour);
});

