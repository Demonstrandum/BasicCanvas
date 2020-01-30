import { canvas_id, P, Polar, HEX, HSL, css } from '../lib/BasicCanvas.js';
import { grid, vector, arrow } from '../lib/BasicShapes.js';
import { text } from '../lib/BasicDOM.js';

const ZOOM = 30;

document.body.html`
  <div id="controls">
    Modify the vector function, in the form:<br />
      v(x, y) = f(x, y) &times (g(x, y)&#xee + h(x, y)&#x135)<br />
      v(x, y) = (<span id="factor"></span>) &times;
        ((<span id="i"></span>)&#xee; + (<span id="j"></span>)&#x135;)
    <br />
    where <i>f, g</i> and <i>h</i> are scalars,<br />
    and <i>r</i> represents the distance of the given point in space from
    the origin.
  </div>
`;

const factor_input = text('#factor', '1');
const i_input = text('#i', 'y^3 - 9y');
const j_input = text('#j', 'x^3 - 9x');

const v = (x, y) => {
  const symbols = { x, y, r: Math.sqrt(x*x + y*y) };
  return P(
    math.eval(i_input.value, symbols),
    math.eval(j_input.value, symbols)
  ).scale(math.eval(factor_input.value, symbols));
};

const sketch = canvas_id('sketch');
sketch.dimensions(640, 480);
sketch.translate(sketch.width / 2, sketch.height / 2);
sketch.scale(ZOOM, -ZOOM);

sketch.font = '12px monospace';
sketch.fill = sketch.stroke = HEX`#fff`;
sketch.stroke_weight = 2;

const CORNER = sketch.corner.omap(Math.floor);

const draw = () => {
  sketch.background(HEX`#000`, true);
  sketch.render(grid(10, 'night'));

  let [min, max] = [0, 0];
  for (let {y} = CORNER; y >= -CORNER.y; y--) {
    for (let {x} = CORNER; x <= -CORNER.x; x++) {
      const size = v(x, y).size();
      if (size < min) {
        min = size;
      }
      if (size > max) {
        max = size;
      }
    }
  }

  for (let {y} = CORNER; y >= -CORNER.y; y--) {
    for (let {x} = CORNER; x <= -CORNER.x; x++) {
      const origin = P(x, y);
      const pointing = v(x, y);

      const ratio = (pointing.mag() - min) / (max - min);
      const scaled = pointing.unit().mul(0.8 + 0.2 * ratio);

      sketch.stroke = HSL(200 + 160 * ratio);
      sketch.render(vector(scaled.add(origin), P(x, y)));
    }
  }
};

draw(); // Inital draw
i_input.change(draw, 500).fit();
j_input.change(draw, 500).fit();  // Wait 500ms for update.
factor_input.change(draw, 500).fit();

css`
  #controls {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80vw;
    transform: translate(-50%, -50%);
    padding-bottom: 40px;
    margin-top: 340px;
    font-family: 'CMUSerifRoman', serif;
  }
  #controls input {
    border: none;
    min-width: 100px;
    text-align: center;
    padding: 3px;
    font-family: monospace;
    background: #eee;
    border-bottom: 1px dashed #aaa;
  }
  .hidden {
    font: inherit;
    font-family: monospace;
  }
  #controls #factor input {
    min-width: 50px;
  }
`;
