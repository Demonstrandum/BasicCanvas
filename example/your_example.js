/*
 * Replace me with your example/practise code!
 */

import * as BC from '../lib/BasicCanvas.js';
// Make sure you get the path correct.

const sketch = BC.canvas_id('sketch'); // Gets canvas with id="sketch".
sketch.dimensions(400, 400); // Width x Height, canvas size.

sketch.stroke = BC.RGB(0); // Same as BC.RGB(0, 0, 0).
sketch.stroke_weight = 8; // 8px wide.
sketch.stroke_cap = 'round';

sketch.loop(frame => {
  sketch.background(BC.RGB(255, 255, 110)); // Redraw background each frame.

  sketch.render('sine', shape => { // Create new shape: name, construction of shape callback
    for (let x = 0; x < 3 * Math.PI; x += 0.2) { // Sine curve at this frame
      shape.vertex(BC.Point(32 * x + 50, 32 * Math.sin(x + frame / 10) + 200));
    }
  });
});
