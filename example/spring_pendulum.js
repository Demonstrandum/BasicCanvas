import { canvas, Point, HEX, HSLA, css } from '../lib/BasicCanvas.js';
import { ellipse } from '../lib/BasicShapes.js';

const [sin, cos] = [Math.sin, Math.cos];

const g = 9.81 / 60;

let m = 3 * (0.4 + Math.random());
let k = 0.01 * (1 + Math.random());
let ext = (Math.random() - 0.5) * 20 + 5;
let theta = (Math.random() - 0.5) * 2*Math.PI;
let omega = 0.02 * (1 + Math.random());
let v_ext = Math.random() + 0.1;
let L = 100;
const a_ext = () => (L+ext) * omega * omega + g * cos(theta) - (k * ext)/m
const alpha = () => -g/(L+ext) * sin(theta) - 2 * (omega * v_ext)/(L+ext)

const sketch = canvas(document.getElementById('sketch'));
[sketch.width, sketch.height] = [420, 480];
sketch.translate(sketch.width / 2, sketch.height / 3);

document.body.html`<p id="equ">
    \begin{align}
      \ddot{\vartheta} &= -\frac{g}{l + x}\sin \vartheta - \frac{2\dot{x}}{l + x}\dot{\vartheta}
      \\\\
      \ddot{x} &= (l + x)\dot{\vartheta}^2 - \frac{kx}{m} + g \cos \vartheta
    \end{align}
  </p>
`;
css`
  #equ {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-bottom: 40px;
    margin-top: ${sketch.height / 1.25}px;
  }
`;

const BG = HEX('#cdf');
sketch.stroke_cap = 'round';

let wire_end = Point(0, L);
const trail = [];

sketch.loop(frame => {
    sketch.background(BG);
    sketch.fill = 'transparent';
    sketch.render('trail', shape => {
      sketch.stroke_weight = 1;
      let transparency = 1;
      for (const point of trail) {
        sketch.stroke = HSLA(frame + transparency * (360 / 255), 100, 50, transparency);
        shape.vertex(point);
        transparency += 0.75;
      }
    });
    if (trail.length > 255 / 0.75) {
      trail.shift();  // We'll start deleting the end of the trail at this point.
    }

    sketch.stroke = HEX('#000');
    sketch.stroke_weight = 2.5;

    let spring = sketch.shape('spring', shape => {
        for (let i = 0; i < 1; i += 0.001) {
            shape.vertex(i, 6*sin(i*14*Math.PI));
        }
    });
    spring.scale(L+ext - 20, 1);  // Make room for the line at the bottom.
    spring.vertex(L+ext, spring.vertices.last.y);  // Adds the little line on the end.
    spring.translate(20, 0);  // Make room for line at the top.
    spring.prepend_vertex(0, 0);  // Add on a (0, 0) vertex for the line on the top.
    spring.rotate(-theta + Math.PI / 2);  // Rotate the spring to match bob motion.

    spring.render();

    wire_end = Point(spring.vertices.last);  // The bob is at the end of the spring.

    sketch.fill = HEX('#000000aa');
    sketch.render('origin', ellipse(Point(0,0), 3));
    sketch.render('bob', ellipse(wire_end, m * 3.5));

    sketch.stroke_weight = 0;
    sketch.fill = HEX('#000e')
    sketch.font = 'serif';
    sketch.text(`m = ${m.roundTo(3)} kg`, wire_end.add(Point(20, 0)))

    v_ext += a_ext();
    let new_ext = ext;
    new_ext += v_ext;
    omega += alpha();
    theta += omega;  // Euler Integration.
    ext = new_ext;

    trail.push(wire_end);
});
