import { canvas_id, Polar, P , RGBA, HSLA } from '../lib/BasicCanvas.js';
import { ellipse } from '../lib/BasicShapes.js';

const s = canvas_id('sketch');
s.dimensions(650, 600);
s.translate(s.width/2, s.height/2);

const bg = RGBA(153, 170, 255);
const fg = RGBA(255, 130);


let r = 200; //px
let epic_r = 40; //px
let points = 13;
let phase = 0; //rad


s.loop(frame => {
	phase += 0.07;
	if (phase > Math.TAU) phase = 0;
	epic_r = 38 * (1.6 + Math.sin(frame / 60));

	const vertices = [];

	s.background(bg);
	s.stroke = fg;

	// Draw epicycles.
	points.times(n => {
		const theta = n * Math.TAU / points;
		const centre = Polar(r, theta);
		s.stroke_weight = 2;
		s.render(ellipse(centre, epic_r));

		const vertex = Polar(epic_r, phase - theta, centre);
		vertices.push(vertex);
		s.stroke_weight = 0;
		s.fill = HSLA(n * 360 / points, 90, 70);
		s.render(ellipse(vertex, 7));
		s.fill = 'transparent';
	});

	s.stroke_weight = 3;

	// Resulting ellipse.
	s.shape(ellipse(P(0, 0), r + epic_r, r - epic_r))
		.rotate(phase / 2)
		.render();

	// Lines joining ellipse vertices.
	s.stroke.a -= 60;
	s.shape(shape => {
		for (const vertex of vertices)
			shape.vertex(vertex);
	}).close().render();
	s.stroke.a += 60;
});
