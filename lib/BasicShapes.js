import * as BC from './BasicCanvas.js';

export const rectangle = (point, w, h = null, fill = null, stroke = null) => shape => {
  const f = fill || shape.canvas.fill;
  const s = stroke || shape.canvas.stroke;
  shape.rect(point, w, h ? h : w, f, s);
  shape.center = point;
};

export const ellipse = (point, w, h = null, fill = null, stroke = null) => shape => {
  const f = fill || shape.canvas.fill;
  const s = stroke || shape.canvas.stroke;

  shape.ellipse(point, w, h ? h : w, f, s);
  shape.center = point;
};

export const arc = (point, r, angle_0, angle_1, cw=true) => shape => {
  shape.arc(point, r, angle_0, angle_1, cw);
  shape.center = point;
};

export const line = (origin, position) => shape => {
  shape.hollow = true;
  shape.vertex(origin);
  shape.vertex(position);
};

export const polygon = (centre, sides, radius) => shape => {
  sides = Math.abs(sides);
  const exterior = 2 * Math.PI / sides;
  for (let partial = -Math.HALF_PI; partial <= Math.TAU - Math.HALF_PI; partial += exterior) {
    shape.vertex(
      centre.x + radius * Math.cos(partial),
      centre.y + radius * Math.sin(partial)
    );
  }
  shape.center = centre;
};

export const star = (point, inner, outer, points) => shape => {
  const angle_frac = Math.TAU / points;
  const half_angle = angle_frac / 2;

  for (let theta = 0; theta < Math.TAU; theta += angle_frac) {
    shape.vertex(BC.Polar(outer, theta, point));
    shape.vertex(BC.Polar(inner, theta + half_angle, point));
  }
  shape.close();
  shape.center = point;
};

export const polar_line = (mag, angle, origin = BC.Point(0, 0)) => shape => {
  shape.vertex(origin);
  shape.vertex(BC.Polar(mag, angle, origin));
};

export const arrow = (mag, angle, origin = BC.Point(0, 0), headsize = 1 / 5) => shape => {
  shape.hollow = true;
  polar_line(mag, angle, origin)(shape);
  const arrow_angle = 2.4;
  const point = BC.Polar(mag, angle, origin);
  shape.vertex(point);
  shape.vertex(BC.Polar(mag * headsize, angle - arrow_angle, point));
  shape.vertex(point);
  shape.vertex(BC.Polar(mag * headsize, angle + arrow_angle, point));
};

export const vector = (point, origin = BC.Point(0, 0), headsize = 1 / 5) => shape => {
  shape.hollow = true;
  line(origin, point)(shape);
  const arrow_angle = 2.4;
  const length = point.length(origin);
  const angle = point.angle(origin);
  shape.vertex(point);
  shape.vertex(BC.Polar(length * headsize, angle - arrow_angle, point));
  shape.vertex(point);
  shape.vertex(BC.Polar(length * headsize, angle + arrow_angle, point));
};

export const grid = (opaque = 40, night = false, options={}) => shape => {  // Maybe allow arguments to modify how the grid works.

  options = {
    // Defaults:
    x_ticks: true,
    y_ticks: true,
    // Overrides:
    ...options
  };
  const { canvas } = shape;
  const { stretch } = canvas;
  canvas.temp(() => {
    canvas.stroke_weight = 2;
    const base = night ? 255 : 0;
    const [light, dark] = [BC.RGBA(base, opaque), BC.RGBA(base, opaque + 40)];

    const x_range = [canvas.corner.x, canvas.corner.x + canvas.width / stretch[0]];
    for (let x = Math.floor(Math.min(...x_range));
      x <= Math.max(...x_range);
      x++) {
      canvas.stroke = light;
      canvas.render(`x${x}_gridline`, shape => {
        shape.vertex(x, canvas.corner.y);
        shape.vertex(x, canvas.corner.y + canvas.height / stretch[1]);
      });
      canvas.stroke = dark;
      if (options.x_ticks) {
        canvas.render(`x${x}_tick`, shape => {
          shape.vertex(x, -3 / stretch[1]);
          shape.vertex(x, 3 / stretch[1]);
        });

        canvas.temp(() => {
          canvas.unscale();
          canvas.stroke = BC.Color('transparent');
          canvas.fill = dark;
          canvas.text_align = 'right';
          if (x !== 0) {
            canvas.text(x, BC.Point(x * stretch[0] + 4, 14));
          }
        });
      }
    }

    const y_range = [canvas.corner.y, canvas.corner.y + canvas.height / stretch[1]];
    for (let y = Math.floor(Math.min(...y_range));
      y <= Math.max(...y_range);
      y++) {
      canvas.stroke = light;
      canvas.render(`y${y}_gridline`, shape => {
        shape.vertex(canvas.corner.x, y);
        shape.vertex(canvas.corner.x + canvas.width / stretch[0], y);
      });
      canvas.stroke = dark;

      if (options.y_ticks) {
        canvas.render(`y${y}_tickline`, shape => {
          shape.vertex(-3 / stretch[0], y);
          shape.vertex(3 / stretch[0], y);
        });

        canvas.temp(() => {
          canvas.unscale();
          canvas.stroke = BC.Color('transparent');
          canvas.fill = dark;
          canvas.text_align = 'right';
          if (y !== 0) {
            canvas.text(y, BC.Point(-4, y * stretch[1] + 4));
          }
        });
      }
    }

    // Origin
    canvas.temp(() => {
      canvas.unscale();
      canvas.stroke = BC.Color('transparent');
      canvas.fill = dark;
      canvas.text_align = 'right';
      canvas.text('0', BC.Point(-4, 4));
    });

    canvas.stroke = dark;
    canvas.render('x_axis', shape => {
      shape.vertex(canvas.corner.x, 0);
      shape.vertex(canvas.corner.x + canvas.width / stretch[0], 0);
    });
    canvas.render('y_axis', shape => {
      shape.vertex(0, canvas.corner.y);
      shape.vertex(0, canvas.corner.y + canvas.height / stretch[1]);
    });
  });
};
