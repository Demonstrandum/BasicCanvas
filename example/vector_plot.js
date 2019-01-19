import {canvas_id, P, Polar, HEX, HSL, css} from '../lib/BasicCanvas.js';
import {grid, vector, arrow} from '../lib/BasicShapes.js';
import {text} from '../lib/BasicDOM.js';

const ZOOM = 30;

document.body.html`
  <div id="controls">
    Modify the vector function:<br/>
    v(x, y) = <span id="i"></span>&#xee; + <span id="j"></span>&#x135;
  </div>
`;

const i_input = text('#i', 'y^3 - 9y');
const j_input = text('#j', 'x^3 - 9x');

const v = (x, y) => P(
  math.eval(i_input.value, {x, y}),  // Using the math.js library,
  math.eval(j_input.value, {x, y})   //   to parse the input expressions.
);

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
  sketch.shape(grid(10, 'night'));

  let [min, max] = [Infinity, -Infinity];
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

  console.log(`max: ${max}, min ${min}`);

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
i_input.change(draw, 500);
j_input.change(draw, 500);  // Wait 500ms for update.

css`
  #controls {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-bottom: 40px;
    margin-top: 340px;
    font-family: 'CMUSerifRoman', serif;
  }
  #controls input {
    border: none;
    max-width: 100px;
    text-align: center;
    padding: 3px;
    font-family: monospace;
    background: #eee;
    border-bottom: 1px dashed #aaa;
  }
`;
