import * as BC from '../lib/BasicCanvas.js';
import { ellipse, line } from '../lib/BasicShapes.js';
use(BC);

const c = canvas_id('sketch');
c.dimensions(500, 500);
c.translate(c.width / 2, c.height / 2);
c.scale(c.width / 2 - 20, c.height / 2 - 20);

const BG = HEX(0x7989EF);
const FG = HEX(0xffffff);

c.fill = TRANSPARENT;
c.stroke = FG;
c.text_align = 'center';
c.font = '0.12pt monospace';

const R = 1;
const FIGURES = 7;

let total_distances = 0;
c.loop(iterations => {
	c.background(BG);
	iterations += 1;

	c.stroke_weight = 3;
	c.stroke = FG;
	c.render(ellipse(P(0, 0), R));

	const p1 = Polar(R, Math.random() * Math.TAU);
	const p2 = Polar(R, Math.random() * Math.TAU);
	c.render(ellipse(p1, 0.013));
	c.render(ellipse(p2, 0.013));

	c.stroke_weight = 2;
	c.stroke = RGBA(255, 210);
	c.render(line(p1, p2));

	const distance = p2.sub(p1).magnitude();
	total_distances += distance;
	const mean = total_distances / iterations;
	c.text(` 4/π = ${(4/Math.PI).toFixed(FIGURES)}...`, P(0, 0));
	c.text(`Mean = ${mean.toFixed(FIGURES)}...`, P(0, 0.15));
}, 10);
