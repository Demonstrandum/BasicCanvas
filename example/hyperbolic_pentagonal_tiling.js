import * as BC from '../lib/BasicCanvas.js';
import { ellipse, arc, line } from '../lib/BasicShapes.js';

use(BC);

const s = canvas_id('sketch');
s.dimensions(650, 600);
s.translate(s.width/2, s.height/2);
s.scale(Math.min(s.width, s.height) / 2.3);

const bg = RGBA(153, 170, 255);
const fg = RGBA(255, 130);


const circle_inverse = p => p.div(p.dot(p));

// find circle centre given 3 points
const circle_centre = (a, b, c) => Point(
    a.dot(a) * (b.y - c.y) + b.dot(b) * (c.y - a.y) + c.dot(c) * (a.y - b.y),
    a.dot(a) * (c.x - b.x) + b.dot(b) * (a.x - c.x) + c.dot(c) * (b.x - a.x),
).div(2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)));

// FIXME: global for debug
let focus, pinv, qinv, start, end;

// Connect two points by circle arc according to Poincaré disk model
const connect = (p, q) => {
    pinv = circle_inverse(p);
    qinv = circle_inverse(q)
    focus = circle_centre(p, q, pinv);
    const radius = focus.dist(p);

    [start, end] = [
        p.angle(focus),
        q.angle(focus),
    ].sort((a, b) => a - b);

    return arc(focus, radius,
        start, end,
        end - start < Math.PI);
}

const R = 0.36;

// Produce polygonal tile for {n,k} tiling.
const tile = (n, k) => {
    const vertices = new Array(n);
    const s = Math.sin(Math.HALF_PI - Math.PI/k - Math.PI/n)
            / Math.sqrt(1 - Math.sin(Math.PI/k)**2 - Math.sin(Math.PI/n)**2);
    for (let i = 0; i < n; ++i)
        vertices[i] = Polar(s, (3 + 2*i) * Math.PI / n);
    return vertices;
};

// Reflect polygon p along its side s, 0 ≤ s ≤ n-1.
const reflect = (p, s) => {
    const n = p.length;
    const vertices = [...p];
    const line = [p[s], p[(s + 1) % n];
    return p.map(v => reflect_line(line, v))
};

const pentagon = tile(5, 4);
console.log(pentagon)


s.loop(frame => {
    s.background(bg);
    // Bouding circle for Poincaré disk projection
    s.render(ellipse(P(0, 0), 1));
    // Straight lines are arcs of circles in this projection

    for (let i = 0; i < 5; ++i) {
        let p = pentagon[i];
        let q = pentagon[(i + 1) % 5];
        s.render(connect(p, q));

        /*for (let j = 0; j < 5; ++j) {
            let p0 = p.rotate(Math.PI / 5);
            let p1 = q.rotate(Math.PI / 5);
            let o = Polar(2 * R * Math.cos(Math.PI / 5), (2*j + 1) * Math.PI / 5);
            p0 = p0.add(o);
            p1 = p1.add(o);
            s.render(connect(p0, p1));
        }
        */
    }


});
