import * as BC from '../lib/BasicCanvas.js';
import { rectangle } from  '../lib/BasicShapes.js';

use(BC)

const sketch = canvas_id('sketch');
sketch.dimensions(500, 500);

sketch.translate(sketch.width/2, sketch.height/2);
sketch.scale(sketch.width/2, -sketch.height/2);

sketch.render(rectangle(P(-1, -1), 2, 2))

const DISTANCE = 2.8;
const CUBE_VERTICES = [
	[-1, +1, +1],
	[+1, +1, +1],
	[+1, -1, +1],
	[-1, -1, +1],
	[-1, -1, -1],
	[-1, +1, -1],
	[+1, +1, -1],
	[+1, -1, -1],
];

const weak_perspective = p =>
	P(p.x / (p.z + DISTANCE), p.y / (p.z + DISTANCE));

const rotate_x = (p, theta) => [
	p.x,
	p.y * Math.cos(theta) - p.z * Math.sin(theta),
	p.y * Math.sin(theta) + p.z * Math.cos(theta)
];

const rotate_y = (p, theta) => [
    p.x * Math.cos(theta) + p.z * Math.sin(theta),
    p.y,
    p.z * Math.cos(theta) - p.x * Math.sin(theta)
];

const rotate_z = (p, theta) => [
    p.x * Math.cos(theta) - p.y * Math.sin(theta),
    p.x * Math.sin(theta) + p.y * Math.cos(theta),
    p.z
];


sketch.stroke = HEX('#ffffff55');
sketch.stroke_weight = 2;

const PINK   = HSLA(360, 100, 80, 180);
const CYAN   = HSLA(181, 100, 80, 180);
const GREEN  = HSLA(126, 100, 80, 180);
const PURPLE = HSLA(224, 100, 80, 180);
const BLUE   = HSLA(206, 100, 80, 180);
const YELLOW = HSLA( 62, 100, 80, 180);

const render_faces = v => {
	sketch.fill = PINK;
	const face1 = sketch.render(shape => {
        shape.vertex(v[0]);
		shape.vertex(v[1]);
		shape.vertex(v[2]);
		shape.vertex(v[3]);
		shape.close();
	});

	sketch.fill = CYAN;
	const face2 = sketch.render(shape => {
        shape.vertex(v[4]);
		shape.vertex(v[5]);
		shape.vertex(v[6]);
		shape.vertex(v[7]);
		shape.close();
	});

	sketch.fill = GREEN;
	const face3 = sketch.render(shape => {
        shape.vertex(v[0]);
		shape.vertex(v[1]);
		shape.vertex(v[6]);
		shape.vertex(v[5]);
		shape.close();
	});

	sketch.fill = PURPLE;
	const face4 = sketch.render(shape => {
        shape.vertex(v[6]);
		shape.vertex(v[7]);
		shape.vertex(v[2]);
		shape.vertex(v[1]);
		shape.close();
	});

	sketch.fill = BLUE;
	const face5 = sketch.render(shape => {
        shape.vertex(v[4]);
		shape.vertex(v[3]);
		shape.vertex(v[2]);
		shape.vertex(v[7]);
		shape.close();
	});

	sketch.fill = YELLOW;
	const face6 = sketch.render(shape => {
        shape.vertex(v[4]);
		shape.vertex(v[3]);
		shape.vertex(v[0]);
		shape.vertex(v[5]);
		shape.close();
	});

	return [face1, face2, face3, face4, face5, face6];
};

const BG = HEX(0x003457);

sketch.loop(frame => {
	sketch.background(BG);
	const vertices = CUBE_VERTICES
		.map(v => rotate_x(
			rotate_y(
				rotate_z(v,
					frame * 0.01),
				frame * 0.02),
			frame * 0.03));

	const vertices2D = vertices
		.map(weak_perspective);
	//console.log(vertices)
	const faces = render_faces(vertices2D);
});
