import * as BC from '../lib/BasicCanvas.js';
import {ellipse, star, line} from '../lib/BasicShapes.js';

use(BC);

// Configure:
const r = 160;
const NUMERALS = {
  12: 'XII', 3: 'III', 6: 'VI', 9: 'IX'
};

const SIXTH_PI     = Math.TAU / 12;
const THIRTIETH_PI = Math.TAU / 60;

load_font('SC', 'url(https://fonts.gstatic.com/s/playfairdisplaysc/v8/ke85OhoaMkR6-hSn7kbHVoFf7ZfgMPr_lbkMEA.woff2)');

// Time from GMT:
const time_from = offset => {
  const date  = new Date();
  const utc   = date.getTime() + (date.getTimezoneOffset() * 60000);
  const other = new Date(utc + (3600000 * offset));

  return other.toTimeString().split(':').slice(0, 3).map(parseFloat);
};
const SEC_OFF = time_from(0)[2] * Math.TAU / 60 - Math.PI / 2;

// Make second canvas with some standard JS:
const lonDOM = document.getElementById('sketch');
const newDOM   = lonDOM.cloneNode(true);
document.body.appendChild(newDOM);

[lonDOM.id, newDOM.id] = ['london', 'ny'];
const [london, ny] = [canvas(lonDOM), canvas(newDOM)];

// Position the canvases:
lonDOM.css({transform: 'translate(-105%, -50%)'});
newDOM.css({transform: 'translate(   5%, -50%)'});

// Draw on the two canvases:
let zone = 0;
const TIME_ZONES = [0, -5];  // London, New York.

for (const clock of [london, ny]) {
  clock.dimensions(400, 400);
  clock.translate(clock.width / 2, clock.height / 2);

  clock.stroke = HEX`#fff`;
  clock.stroke_weight = 2;
  clock.stroke_cap = 'butt';
  clock.text_align = 'center';

  clock.zone = zone;
  clock.place_name = (zone == 0) ? 'London' : 'New York';
  clock.loop(frame => {
    clock.background(HEX`#111`);

    clock.fill = HEX`#fff`;
    clock.stroke_weight = 0;
    clock.font = '30px SC';
    clock.text(clock.place_name, P(0, 70));

    for (let i = 12; i > 0; i--) {
      const tick = Polar(r, i * SIXTH_PI - Math.PI / 2);
      if (i % 3 !== 0) {
        clock.render(ellipse(tick, 2));
      } else {
        clock.text(NUMERALS[i], tick.add(P(0, 10)));
      }
    }

    const [hour, min, sec] = time_from(TIME_ZONES[clock.zone]);

    const HOUR_OFF = SIXTH_PI     * min / 60 - Math.PI / 2;
    const MIN_OFF  = THIRTIETH_PI * sec / 60 - Math.PI / 2;

    const sec_hand  = Polar(r -  0, (Math.TAU / 3600) * (frame % 3600) + SEC_OFF);
    const hour_hand = Polar(r - 60, SIXTH_PI     * (hour % 12) + HOUR_OFF);
    const min_hand  = Polar(r - 20, THIRTIETH_PI * (min  % 60) + MIN_OFF);

    clock.stroke = HEX`#ffffffaa`;
    clock.stroke_weight = 1;
    clock.fill = 'transparent';
    clock.render(star(P(0, 0), 27, 30, 12));

    clock.stroke_weight = 4;
    clock.render(line(hour_hand, P(0, 0)));
    clock.stroke_weight = 2;
    clock.render(line(min_hand,  P(0, 0)));
    clock.stroke = HEX`#ff3300aa`;
    clock.render(line(sec_hand,  P(0, 0)));
    clock.stroke = HEX`#fff`;
    clock.fill = HEX`#fff`;
    clock.render(ellipse(P(0, 0), 2));
  });

  zone++;
}
