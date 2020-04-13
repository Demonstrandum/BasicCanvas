import * as BC from '../lib/BasicCanvas.js';
import { line } from '../lib/BasicShapes.js';

use(BC);
const PI = Math.PI

const sketch = BC.canvas_id('sketch');
sketch.dimensions(600, 600);

sketch.stroke = RGBA(255, 255, 255, 150);
sketch.stroke_weight = 2;
sketch.stroke_cap = 'round';

const bg = HEX(0x332233);
sketch.background(bg);

sketch.translate(sketch.width/5, sketch.height/4);

const length = 10;//px
const incr = 0.05;//rad

window.sketch = sketch;

const spiral = sketch.shape(shape => shape.vertex(0, 0));

let nth = 30.0;
let i = 0;
sketch.loop(frame => {
    if (frame % Math.round(nth) !== 0) return;
    if (Math.round(nth) !== 1) nth -= 0.5;
    i += 1;

    const angle = incr * i * (i - 1) / 2;

    if (frame === 1960) {
        sketch.text('etc.', P(250,0), '90px serif');
        sketch.break();
        return;
    }

    sketch.unscale();
    sketch.scale(2 - 0.17 * Math.log(i));
    sketch.background(bg);
    spiral.vertex(Polar(length, -angle, spiral.vertices.last));
    spiral.render();
});

