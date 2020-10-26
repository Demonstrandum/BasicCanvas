import * as BC from '../lib/BasicCanvas.js';
import { ellipse, line, rectangle } from '../lib/BasicShapes.js';

use(BC);

// Load 'mathcal' font.
load_font('Parisienne',
	"url(https://fonts.gstatic.com/s/parisienne/v8/E21i_d3kivvAkxhLEVZpQyhwDw.woff2)");

const a_mean_svg = new Image();
a_mean_svg.src = './a_mean.svg';
const g_mean_svg = new Image();
g_mean_svg.src = './g_mean.svg';

const r = 260
const G = (a, b) => Math.sqrt(a * b);

const BG = HEX('#fff');
const COLOUR_A = HEX('#f47').to_rgb();
const COLOUR_B = HEX('#3bf').to_rgb();

const sketch = canvas_id('sketch');
window.sketch = sketch;
sketch.dimensions(600, 400);
sketch.translate(sketch.width / 2, 3 * sketch.height / 4);
sketch.scale(1, -1);
sketch.text_align = 'center'

const dip = -5;

let a = 400;
let follow = false;
mouse_down(() => {
	follow = true;
}, sketch);
mouse_up(() => {
	follow = false;
}, sketch);

sketch.loop(() => {
	sketch.background(BG, true);

	if (follow) {
		a = sketch.mouse.x + r;
		if (a > 2*r-40)
			a = 2*r-40;
		else if (a < 40)
			a = 40;
		a = Math.round(a) || 400;
	}
	const b = 2*r - a;
	const g = G(a, b);

	sketch.fill = 'transparent'
	sketch.stroke = 'black'
	sketch.stroke_weight = 1;
	sketch.stroke_dash = [];
	sketch.render(ellipse(P(0, 0), r));
	sketch.render(line(P(-r - 20, 0), P(r + 20, 0)));

	sketch.stroke_dash = [4, 5];
	sketch.render('A', line(P(0, dip), P(0, r)));
	sketch.render('G', line(P(a-r, dip), P(a-r, g)));
	sketch.stroke_dash = [8, 5];
	sketch.render('delta', line(P(0, g), P(a-r, g)));

	sketch.stroke_weight = 0;
	sketch.fill = 'black';
	sketch.font = "32px 'Parisienne'";
	sketch.temp(() => {
		sketch.unscale();
		sketch.text('A', P(0, -r - 10));
		sketch.text('G', P(a-r, -g - 10));
	});

	sketch.fill = 'transparent';
	sketch.stroke_dash = [7, 2];
	sketch.stroke_weight = 2;
	sketch.stroke = COLOUR_A;
	sketch.render('a', line(P(-r, dip), P(a-r, dip)));
	sketch.render(line(P(-r, 0), P(a-r, g)));
	sketch.stroke = COLOUR_B;
	sketch.render('b', line(P(a-r, dip), P(a+b-r, dip)));
	sketch.render(line(P(r, 0), P(a-r, g)));

	sketch.stroke = 'gray';
	sketch.shape(rectangle(P(a-r, g), 20))
		.rotate(3*Math.PI/2 - Math.atan(a/g))
		.render();

	sketch.stroke_weight = 0;
	sketch.font = "italic 24px 'CMUClassicalSerifItalic'";
	sketch.fill = COLOUR_A
	sketch.temp(() => {
		sketch.unscale();
		sketch.text('a', Point(a/2-r - 22, 30));
		sketch.font = "24px 'CMUSerifRoman'";
		sketch.text(' = ' + a, Point(a/2-r + 22, 30));
	});

	sketch.fill.a = 100;
	sketch.render(shape => {
		shape.vertex(P(-r, 0));
		shape.vertex(P(a-r, g));
		shape.vertex(P(a-r, 0));
		shape.close()
	});
	sketch.fill.a = 255;

	sketch.fill = COLOUR_B
	sketch.temp(() => {
		sketch.unscale();
		sketch.text('b', Point(a-r + b/2 - 22, 30));
		sketch.font = "24px 'CMUSerifRoman'";
		sketch.text(' = ' + b, Point(a-r + b/2 + 22, 30));
	});

	sketch.fill.a = 100;
	sketch.render(shape => {
		shape.vertex(P(r, 0));
		shape.vertex(P(a-r, g));
		shape.vertex(P(a-r, 0));
		shape.close()
	});
	sketch.fill.a = 255;


	sketch.temp(() => {
		sketch.unscale();
		sketch.context.drawImage(a_mean_svg, -75, -r/2);
		sketch.context.drawImage(g_mean_svg, a-r + 5, -g/2);
	});
});


document.body.html`
	<div id="caption">
		<p style="font-family: 'CMUSerifRoman', sans-serif">
			Click and drag to interact with the proof.
		</p>
		<p>\[ \frac{a+b}{2} \ge \sqrt{ab} \]</p>
	</div>
`;

css`#caption {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding-bottom: 40px;
	margin-top: ${3 * sketch.height / 4}px;
}`;
