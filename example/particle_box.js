import * as BC from '../lib/BasicCanvas.js';

/* 
 * Loads of patchwork and context methods (and general methods)
 * that need to be written into the Canvas class.
 * Please ignore raw canvas workarounds
 */

Number.prototype.roundTo = function (dp) {
  return parseFloat((this).toFixed(dp));
};

const canvas = BC.canvas_id('sketch');
canvas.dimensions(400, 400);
canvas.translate(25, 375);
canvas.font = '12px Arial';

const stretch = [300, 20];
canvas.stroke_weight = 1/stretch[0];
canvas.context.scale(...stretch);

const grid = () => {
  const old_stroke = {
    color: canvas.stroke,
    weight: canvas.stroke_weight
  };
  console.log(canvas.corner)

  const [light, dark] = [BC.RGBA(0, 70), BC.RGBA(0, 230)]

  for (let x = Math.floor(canvas.corner.x/stretch[0]);
       x <= (canvas.corner.x + canvas.width)/stretch[0];
       x++) {
    canvas.stroke = light;
    canvas.shape(`x${x}_gridline`, shape => {
      shape.vertex(x, canvas.corner.y/stretch[1]);
      shape.vertex(x, (canvas.corner.y + canvas.height)/stretch[1]);
    });
    canvas.stroke = dark;
    canvas.shape(`x${x}_tick`, shape => {
      shape.vertex(x, -3/stretch[1]);
      shape.vertex(x, 3/stretch[1]);
    });

    canvas.context.save();
    canvas.context.scale(1/stretch[0], 1/stretch[1]);
    canvas.stroke = BC.Color('transparent');
    canvas.fill = dark;
    canvas.context.textAlign = 'right';
    if (x !== 0) canvas.text(x, BC.Point(x * stretch[0] + 4, 14));
    canvas.context.restore();
  }
  
  for (let y = Math.floor(canvas.corner.y/stretch[1]);
       y <= (canvas.corner.y + canvas.height)/stretch[1];
       y++) {
    canvas.stroke = light;
    canvas.shape(`y${y}_gridline`, shape => {
      shape.vertex(canvas.corner.x/stretch[0], y);
      shape.vertex((canvas.corner.x + canvas.width)/stretch[0], y);
    });
    canvas.stroke = dark;
    canvas.shape(`y${y}_tickline`, shape => {
      shape.vertex(-3/stretch[0], y);
      shape.vertex(3/stretch[0], y)
    });

    canvas.context.save();
    canvas.context.scale(1/stretch[0], 1/stretch[1]);
    canvas.stroke = BC.Color('transparent');
    canvas.fill = dark;
    canvas.context.textAlign = 'right';
    if (y !== 0) canvas.text(y, BC.Point(-4, y * stretch[1] + 4));
    canvas.context.restore();
  }
  
  // Origin
  canvas.context.save();
  canvas.context.scale(1/stretch[0], 1/stretch[1]);
  canvas.stroke = BC.Color('transparent');
  canvas.fill = dark;
  canvas.context.textAlign = 'right';
  canvas.text('0', BC.Point(-4, 4));
  canvas.context.restore();
  
  canvas.stroke = dark;
  canvas.shape('x_axis', shape => {
    shape.vertex(canvas.corner.x/stretch[0], 0);
    shape.vertex((canvas.corner.x + canvas.width)/stretch[0], 0);
  });
  canvas.shape('y_axis', shape => {
    shape.vertex(0, canvas.corner.y/stretch[1]);
    shape.vertex(0, (canvas.corner.y + canvas.height)/stretch[1])
  });
  
  console.log(canvas.shapes)
  canvas.stroke = old_stroke.color;
  canvas.stroke_weight = old_stroke.weight;
};

grid();

const L = 1;
const Ψ = (x, n) => Math.sqrt(2 / L) * Math.sin((x * n * Math.PI) / L);

for (let n = 1; n <= 6; n++) {
  canvas.shape(`Ψ_${n}`, shape => {
    for (let x = 0; x <= L + 0.005; x += 0.005) {
      shape.vertex(BC.Point(x, Ψ(x, n) - (n * 3 - 1)));
      console.log(`Ψ_${n}(${x.roundTo(5)}) = ${Ψ(x, n).roundTo(5)}`);
    }
  });
}
