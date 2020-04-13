import * as _ from 'https://cdn.rawgit.com/Demonstrandum/4dcebc41e54961abd0b0a1b0ecfdd97d/raw/4fa388d578dadfea0d1218707d9f5022606de96d/perlin.js';
import * as BC from '../lib/BasicCanvas.js';
import { rectangle } from '../lib/BasicShapes.js';
use(BC)

const canvas = BC.canvas(document.getElementById('sketch'));
canvas.dimensions(400, 400);
canvas.stroke_cap = 'round';

const speed = 1/120;

let walk = [];

const rand = [
    Math.random(),
    Math.random(),
    Math.random()
].map(e => e * 1000);

canvas.loop(frame => {
    const hue = 360/2 * (1 + noise.simplex2(frame*speed, rand[0]));
    const sat = 100/2 * (1 + noise.simplex2(frame*speed, rand[1]));
    const lit = 100/2 * (1 + noise.simplex2(frame*speed, rand[2]));

    const colour = BC.HSL(hue, sat, lit);
    canvas.background(colour);

    walk.push([hue, sat, lit]);
    if (walk.length > 400)
        walk.shift();

    if (frame % 30 === 0) {
        const hue_norm = walk.map(e => e[0] / 360);
        console.log(`max: ${Math.max(...hue_norm)}, min: ${Math.min(...hue_norm)}`);
    }

    canvas.stroke = 'red';
    canvas.fill = 'green';
    canvas.stroke_weight = 1;
    canvas.render(rectangle(P(1,1), 360, 100));
    canvas.fill = 'transparent';
    canvas.stroke_weight = 3;
    canvas.render(shape => {
        for (const trip of walk) {
            const sat_map = trip[1] * 255/100;
            canvas.stroke = RGB(sat_map, sat_map, sat_map);
            shape.vertex(trip[0], trip[2]);
        }
    });
});

