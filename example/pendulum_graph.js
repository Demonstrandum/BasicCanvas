import * as BC from '../lib/BasicCanvas.js';
import { ellipse, arc, line, grid } from '../lib/BasicShapes.js';

use(BC);

const [sin, cos] = [Math.sin, Math.cos];

const g = 9.81 / 60;
const m = 10;
const L = 200;

let ϑ = Math.PI / 2 + Math.random() - 0.5;
let ω = 0.001;

const α = () => -g/L * sin(ϑ);

const X_COLOUR = HEX('#d9346ed0');
const Y_COLOUR = HEX('#9a91edd0');
const ANGLE_COLOUR = HEX('#ebbf3d');

// Build div with two canvases.
document.getElementById('sketch').remove();
const canvases = document.createElement('div');
const _sketch = document.createElement('canvas');
const _graph  = document.createElement('canvas');

canvases.setAttribute('id', 'canvases');
_sketch .setAttribute('id', 'sketch');
_graph  .setAttribute('id', 'graph');

canvases.appendChild(_sketch);
canvases.appendChild(_graph);
document.body.prepend(canvases);

const sketch = canvas(_sketch);
const graph  = canvas(_graph);

[sketch.width, sketch.height] = [500, 400];
[graph.width, graph.height] = [500, 150];

window.stop_render = () => {
  sketch.break();
  graph.break();
};

// Add some equations to the page:
document.body.html`
  <p id="equ">
    \begin{align}
      \frac{\text{d}^2\vartheta}{\text{d}t^2} &= -\frac{g}{L}\sin\vartheta
    \end{align}
  </p>
`;
css`
  #sketch {
    transform: translate(-50%, -80%);
  }
  #graph {
    transform: translate(-50%, calc(-100% + 250px));
  }
  #equ {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -90%);
    padding-bottom: 40px;
    margin-top: ${sketch.height}px;
  }
`;

sketch.translate(sketch.width / 2, sketch.height / 4);

const BG_s = HEX('#87caac');
sketch.stroke_cap = 'round';

let coord = Point(0, L);
const trail = [];
let cw = false;

sketch.font = '12px monospace';

sketch.loop(() => {
  sketch.background(BG_s, true);

  sketch.stroke_weight = 2.5;
  sketch.stroke = HEX('#0002');
  sketch.render('x-axis', line(
    Point(sketch.corner.x, L/2),
    Point(sketch.corner.x + sketch.width, L/2)));
  sketch.render('y-axis', line(
    Point(0, sketch.corner.y),
    Point(0, sketch.corner.y + sketch.height)));

  sketch.stroke_dash = [4, 5];
  sketch.fill = 'transparent';
  sketch.stroke = ANGLE_COLOUR;
  const cw = ϑ < 0;
  if (ϑ != Math.PI/2)
    sketch.render('angle', arc(P(0, 0), 30, Math.PI/2, Math.PI/2 - ϑ, cw));

  sketch.stroke = X_COLOUR;
  sketch.render('x-value', line(Point(0, coord.y), coord));
  sketch.stroke = Y_COLOUR;
  sketch.render('y-value', line(Point(coord.x, L/2), coord));

  sketch.stroke_dash = [];
  sketch.stroke = 'transparent';

  sketch.fill = X_COLOUR;
  sketch.text('x = ' + Math.round(coord.x),
    Point(coord.x / 2, coord.y + 20));
  sketch.fill = Y_COLOUR;
  sketch.text('y = ' + Math.round(coord.y),
    Point(coord.x + 20, (coord.y + L/2) / 2));

  sketch.fill = HEX('#000000aa');
  sketch.stroke = HEX('#000');
  sketch.render('origin', ellipse(Point(0, 0), 3));
  sketch.render('harnes', line(Point(0, 0), coord));
  sketch.render('bob',    ellipse(coord,  m));

  coord = Polar(L, Math.PI / 2 - ϑ);

  /*
   * ω(t + dt) = ω(t) + α(t)dt
   * ϑ(t + dt) = ϑ(t) + ω(t)dt
   *
   * Here dt = 1.
   * In 60 FPS, that's dt = 1/60 seconds.
   */

  ω += α();
  ϑ += ω;

  trail.push(coord);
});

// Render graph:
graph.translate(15, graph.height / 2);
graph.scale(30, -40);

const BG_g = HEX('#bddbce')

graph.font = '11px monospace';
graph.stroke = RGBA(0, 100);
graph.stroke_weight = 2;

let x_ticks = true;

graph.loop(() => {
  graph.background(BG_g, true);
  graph.render(grid(6, false, { x_ticks }));

  graph.temp(() => {
    graph.unscale();
    graph.fill = HEX(0x000000);
    graph.stroke_weight = 0;
    graph.text('time / s', Point(420, 30));
    graph.text('normalised displacement', Point(15, -55));
  });

  // Plot angle-values:
  graph.stroke = ANGLE_COLOUR;
  graph.render('angle-values', shape => {
    let t = 0;
    for (const c of trail) {
      shape.vertex(t, 2 * Math.atan2(c.x, c.y) / Math.PI);
      t += 1/60;
    }
  });

  // Plot x-values:
  graph.stroke = X_COLOUR;
  graph.render('x-values', shape => {
    let t = 0;
    for (const c of trail) {
      shape.vertex(t, c.x / L);
      t += 1/60;  // 60 FPS
    }
    if (t > 16) {
      trail.shift();
      x_ticks = false;
    }
  });

  // Plot y-values:
  graph.stroke = Y_COLOUR;
  graph.render('y-values', shape => {
    let t = 0;
    for (const c of trail) {
      shape.vertex(t, (L/2 - c.y) / L);
      t += 1/60;
    }
  });
});
