import * as BC from '../lib/BasicCanvas.js';
import {rectangle, grid} from '../lib/BasicShapes.js';


const tupper = (x, y) => {
  const exponent =  ((x * (-17n)) - (y % 17n));
  if (exponent < 0) return 0;
  return ((y / 17n) * (2n ** exponent)) % 2n;
};

const k_str = `960939379918958884971672962127852754715004339660129306651505` +
              `519271702802395266424689642842174350718121267153782770623355` +
              `993237280874144307891325963941337723487857735749823926629715` +
              `517173716995165232890538221612403238855866184013235585136048` +
              `828693337902491454229288667081096184496091705183454067827731` +
              `551705405381627380967602565625016981482083418783163849115590` +
              `225610003652351370343874461848378737238198224849863465033159` +
              `410054974700593138339226497249461751545728366702369745461014` +
              `655997933798537483143786841806593422227898388722980000748404` +
              `719`;

const k = BigInt(k_str);

const s = BC.canvas_id('sketch');
s.dimensions(400, 400);
s.translate((3 / 4) * s.width, (1 / 4) * s.height);
s.scale(-10, 10);

s.background(BC.HEX('#fff'));
s.stroke = BC.HEX('#000');
s.fill = s.stroke;

s.font = '9px serif';
s.render(null, grid());

for (let x = 0n; x <= 105n; x++) {
  for (let y = 0n; y < 17n; y++) {
    const point = BC.Point(Number(x), Number(y));
    const tupper_value = tupper(x, k + y);
    console.log(tupper_value);
    if (tupper_value > 0.5) {
      s.render(null, rectangle(point, 1));
    }
  }
}
