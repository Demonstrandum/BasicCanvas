import {canvas, css, Point, HEX, HSLA} from '../lib/BasicCanvas.js';
import {ellipse, line} from '../lib/BasicShapes.js';

const [sin, cos] = [Math.sin, Math.cos]; 

const g = 9.81 / 60;

let m = 1;
let k = Math.random()*0.01 + 0.01;
let x = (Math.random()-0.5)*20 + 5;
let theta = (Math.random()-0.5) * Math.PI;
let omega = Math.random()*0.02 + 0.02;
let v_x = Math.random()*2 + 0.1;
let L = 100;
const a_x = () => (L+x) * omega * omega + g * cos(theta) - (k * x)/m
const alpha = () => -g/(L+x) * sin(theta) - 2 * (omega * v_x)/(L+x)

//#######################################
const sketch = canvas(document.getElementById('sketch'));
[sketch.width, sketch.height] = [400, 400];
sketch.translate(sketch.width / 2, sketch.height / 3);

const BG = HEX('#dfcbeb');
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

//##############################################
    sketch.stroke_weight = 2.5;
    sketch.fill = HEX('#000000aa');
    sketch.stroke = HEX('#000');
    sketch.render('origin', ellipse(Point(0,0), 3));
    sketch.render('line', line(Point(0,0), coord));
    sketch.render('bob', ellipse(coord, 10));


    coord = Point(
        (L+x) * sin(theta),
        (L+x) * cos(theta)
    );

    v_x += a_x();
    let new_x = x;
    new_x += v_x;

    omega += alpha();
    theta += omega;

    x = new_x;

    trail.push(coord);
});
