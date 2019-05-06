var sketch, stars;

import * as BasicCanvas from '../lib/BasicCanvas.js';

import {
  star
} from '../lib/BasicShapes.js';

use(BasicCanvas);

load_font('display', "url(https://fonts.gstatic.com/s/playfairdisplay/v14/nuFlD-vYSZviVYUb_rj3ij__anPXBYf9lW4e5g.woff2) format('woff2')");

sketch = canvas_id('sketch');

sketch.dimensions(500, 300);

sketch.stroke = TRANSPARENT;

stars = [];

sketch.loop(function(frame) {
  var alpha, i, len, location, s, size;
  sketch.background(HEX(0x100044));
  if (frame % 3 === 0) {
    location = Point(Math.random() * sketch.width, Math.random() * sketch.height);
    size = 6 * Math.random();
    s = sketch.shape(star(location, 4, 5 + size, 5));
    s.rotate(Math.PI * Math.random());
    stars.push(s);
  }
  alpha = 0;
  for (i = 0, len = stars.length; i < len; i++) {
    s = stars[i];
    s.fill(RGBA(255, 255, 130, alpha));
    alpha += 255 / stars.length;
  }
  if (stars.length > 100) {
    stars.shift();
  }
  sketch.fill = '#fff';
  sketch.font = 'bold 100px display';
  sketch.text('Heilige', P(91, 148));
  return sketch.text('Nacht', P(101, 230));
});
