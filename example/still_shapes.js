import * as BC from '../lib/BasicCanvas.js';

// Awkwardly patch console.log(...)
const console_clone = BC.clone(console);

console.log = (...args) => {
	return console_clone.log(...(args.map(e => {
		if (e) {
			return e.valueOf();
		}
		return e;
	})));
};

/* Get sketching: */

const sketch = BC.canvas_id('sketch');
sketch.dimensions(400, 400);

sketch.fill = BC.Color(255, 255, 110);
sketch.background();

// Draw a line (vertical)
for (let i = 60; i < 300; i++) {
	sketch.color(BC.Point(80, i), BC.Color(0, 0, 0));
}

// Draw a parabola
for (let x = -20; x <= 20; x += 0.01) {
	sketch.color(BC.Point(10 * x + 200, -10 * x ** 2 + 300), BC.Color(255, 0, 100));
}

// Draw a sine wave using vertices (low res)
sketch.stroke = BC.Color(255);
sketch.stroke_weight = 3;
sketch.fill = BC.Color(150, 255, 190, 100);

const PI = 3.14159265;
sketch.shape('sine', shape => {
	for (let x = 0; x < 3 * PI; x += 0.2) {
		shape.vertex(BC.Point(32 * x + 50, 32 * Math.sin(x) + 100));
	}
}).close().fill();
// Sketch.shapes['sine'].shape.close(); // Or do this

const c = sketch.color(BC.Point(90, 110));
console.log(c);

// Checker pattern
import {rectangle} from '../lib/BasicShapes.js';

sketch.fill = BC.Color(0, 100);
sketch.stroke = BC.Color(0, 0);

const d = 50;
for (let r = 0; r < sketch.width / d; r++) {
	for (let c = 0; c < sketch.height / d; c++) {
		if ((r + c) % 2 === 0) {
			sketch.shape(null, rectangle(BC.Point(r * d, c * d), d, d));
		}
	}
}

// All our shapes
console.log(sketch.shapes);
