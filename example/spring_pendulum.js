import { canvas, Point, HEX, HSLA } from '../lib/BasicCanvas.js';
import { ellipse } from '../lib/BasicShapes.js';

const [sin, cos] = [Math.sin, Math.cos]; 

const g = 9.81 / 60;

let m = 3;
let k = Math.random()*0.01 + 0.01;
let x = (Math.random()-0.5)*20 + 5;
let theta = (Math.random()-0.5) * Math.PI;
let omega = Math.random()*0.02 + 0.02;
let v_x = Math.random()*2 + 0.1;
let L = 100;
const a_x = () => (L+x) * omega * omega + g * cos(theta) - (k * x)/m
const alpha = () => -g/(L+x) * sin(theta) - 2 * (omega * v_x)/(L+x)

const sketch = canvas(document.getElementById('sketch'));
[sketch.width, sketch.height] = [400, 400];
sketch.translate(sketch.width / 2, sketch.height / 3);

const BG = HEX('#cdf');
sketch.stroke_cap = 'round';

let coord = Point(0, L);
const trail = [];

sketch.loop(() => {
    sketch.background(BG);
    sketch.fill = 'transparent';
    sketch.render('trail', shape => {
      sketch.stroke_weight = 1;
      let transparency = 1;
      for (const point of trail) {
        sketch.stroke = HSLA(transparency * (360 / 255), 100, 50, transparency);
        shape.vertex(point);
        transparency += 1;
      }
    });
    if (trail.length > 255) {
      trail.shift();  // We'll start deleting the end of the trail at this point.
    }

    sketch.stroke = HEX('#000');
    sketch.stroke_weight = 2.5;

    let spring = sketch.shape('spring', shape => {
        for (let i = 0; i < 1; i += 0.001) {
            shape.vertex(i, 6*sin(i*14*Math.PI));
        }
    });
    spring.scale(L+x - 20, 1);  // Make room for the line at the bottom.
    spring.vertex(L+x, spring.vertices.slice(-1)[0][1]);  // Adds the little line on the end.
    spring.translate(20, 0);  // Make room for line at the top.
    spring.vertices.unshift([0, 0]);  // Add on a (0, 0) vertex for the line on the top.
    spring.rotate(-theta + Math.PI/2);  // Rotate the spring to match bob motion.

    spring.render();

    coord = Point(...spring.vertices.slice(-1)[0]);  // The bob is at the end of the spring.
    

    sketch.fill = HEX('#000000aa');
    sketch.render('origin', ellipse(Point(0,0), 3));
    sketch.render('bob', ellipse(coord, 10));

    v_x += a_x();
    let new_x = x;
    new_x += v_x;
    omega += alpha();
    theta += omega;  // Euler Integration.
    x = new_x;

    trail.push(coord);
});
