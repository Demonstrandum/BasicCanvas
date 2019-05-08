var HALF_SIZE, HEIGHT, NORTH_EAST, NORTH_WEST, PALLETE, Point, SIDES, SIZE, SOUTH_WEST, SPEED, SQRT_3, column, distance, isometric, sketch;

import {
  canvas_id,
  P,
  Polar,
  HEX
} from '../lib/BasicCanvas.js';

SIZE = 15; // n×n grid.

SIDES = 16; // Pixel length of sides  of each column.

HEIGHT = 70; // Pixel length of height of each column.

SPEED = 1; // Relative speed of oscilations in heigt of a column.

SQRT_3 = Math.sqrt(3);

sketch = canvas_id('sketch');

sketch.dimensions(500, 500);

sketch.translate(sketch.width / 2, sketch.height / 2 + 10);

sketch.fill = sketch.stroke = 'transparent';

PALLETE = {
  left: HEX(0x415484),
  right: HEX(0xe6e2b1),
  top: HEX(0x87b9b4)
};

Point = Object.getPrototypeOf(P(0/0, 0/0));

Point.go = Point.add;

NORTH_EAST = Polar(SIDES, -1 * Math.PI / 6);

NORTH_WEST = Polar(SIDES, -5 * Math.PI / 6);

SOUTH_WEST = Polar(SIDES, 5 * Math.PI / 6);

column = function(point, height) {
  var left, p0, p1, p2, p3, q0, q1, q2, right, top;
  p0 = point.add(P(0, -height / 2));
  p1 = p0.go(NORTH_EAST);
  p2 = p1.go(NORTH_WEST);
  p3 = p2.go(SOUTH_WEST);
  // Top face
  top = sketch.shape(function(sub) {
    sub.vertex(p0);
    sub.vertex(p1);
    sub.vertex(p2);
    sub.vertex(p3);
    return sub.vertex(p0);
  });
  top.fill(PALLETE.top);
  q0 = p0.add(P(0, height));
  q1 = q0.go(NORTH_EAST);
  // Right face
  right = sketch.shape(function(sub) {
    sub.vertex(p0);
    sub.vertex(q0);
    sub.vertex(q1);
    sub.vertex(p1);
    return sub.vertex(p0);
  });
  right.fill(PALLETE.right);
  q2 = q0.go(NORTH_WEST);
  // Left face
  left = sketch.shape(function(sub) {
    sub.vertex(p0);
    sub.vertex(q0);
    sub.vertex(q2);
    sub.vertex(p3);
    return sub.vertex(p0);
  });
  return left.fill(PALLETE.left);
};

isometric = function(x, y) {
  return P(SIDES * (x - y) * SQRT_3 / 2, SIDES * (x + y) / 2);
};

distance = function(x, y) {
  return x * x + y * y;
};

HALF_SIZE = Math.floor(SIZE / 2);

sketch.loop(function(frame) {
  var h, i, ref, ref1, results, x, y;
  sketch.background(HEX(0xfafafa));
  results = [];
  for (x = i = ref = -HALF_SIZE, ref1 = HALF_SIZE; (ref <= ref1 ? i <= ref1 : i >= ref1); x = ref <= ref1 ? ++i : --i) {
    results.push((function() {
      var j, ref2, ref3, results1;
      results1 = [];
      for (y = j = ref2 = -HALF_SIZE, ref3 = HALF_SIZE; (ref2 <= ref3 ? j <= ref3 : j >= ref3); y = ref2 <= ref3 ? ++j : --j) {
        h = HEIGHT * (1 + Math.sin(SPEED * frame / 10 + distance(x, y) / SIZE)) + HEIGHT;
        results1.push(column(isometric(x, y), h));
      }
      return results1;
    })());
  }
  return results;
});
