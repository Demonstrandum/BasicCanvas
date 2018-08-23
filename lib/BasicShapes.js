import * as BC from './BasicCanvas.js';

export const rectangle = (point, w, h = null, fill = null, stroke = null) => shape => {
  const f = fill || shape.canvas.fill;
  const s = stroke || shape.canvas.stroke;
  shape.rect(point, w, h ? h : w, f, s);
};

export const ellipse = (point, w, h = null, fill = null, stroke = null) => shape => {
  const f = fill || shape.canvas.fill;
  const s = stroke || shape.canvas.stroke;

  shape.ellipse(point, w, h ? h : w, f, s);
};

export const line = (origin, position) => shape => {
  shape.vertex(origin);
  shape.vertex(position);
};

export const polar_line = (mag, angle, origin = BC.Point(0, 0)) => shape => {
  shape.vertex(origin);
  shape.vertex(BC.polar(mag, angle, origin));
};

export const arrow = (mag, angle, origin = BC.Point(0, 0), headsize = mag / 5) => shape => {
  shape.canvas.shape(null, polar_line(mag, angle, origin));
  const arrow_angle = 2.4;
  const position = BC.polar(mag, angle, origin);
  shape.vertex(position);
  shape.vertex(BC.polar(headsize, angle - arrow_angle, position));
  shape.vertex(position);
  shape.vertex(BC.polar(headsize, angle + arrow_angle, position));
};

export const grid = () => shape => {  // Maybe allow arguments to modify how the grid works.
  const {canvas} = shape;
  const {stretch} = canvas;
  canvas.temp(() => {
    const [light, dark] = [BC.RGBA(0, 70), BC.RGBA(0, 230)];

    const x_range = [canvas.corner.x, canvas.corner.x + canvas.width / stretch[0]];
    for (let x = Math.floor(Math.min(...x_range));
      x <= Math.max(...x_range);
      x++)  {
      canvas.stroke = light;
      canvas.shape(`x${x}_gridline`, shape => {
        shape.vertex(x, canvas.corner.y);
        shape.vertex(x, canvas.corner.y + canvas.height / stretch[1]);
      });
      canvas.stroke = dark;
      canvas.shape(`x${x}_tick`, shape => {
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

    const y_range = [canvas.corner.y, canvas.corner.y + canvas.height / stretch[1]];
    for (let y = Math.floor(Math.min(...y_range));
      y <= Math.max(...y_range);
      y++) {
      canvas.stroke = light;
      canvas.shape(`y${y}_gridline`, shape => {
        shape.vertex(canvas.corner.x, y);
        shape.vertex(canvas.corner.x + canvas.width / stretch[0], y);
      });
      canvas.stroke = dark;
      canvas.shape(`y${y}_tickline`, shape => {
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

    // Origin
    canvas.temp(() => {
      canvas.unscale();
      canvas.stroke = BC.Color('transparent');
      canvas.fill = dark;
      canvas.text_align = 'right';
      canvas.text('0', BC.Point(-4, 4));
    });

    canvas.stroke = dark;
    canvas.shape('x_axis', shape => {
      shape.vertex(canvas.corner.x, 0);
      shape.vertex((canvas.corner.x + canvas.width) / stretch[0], 0);
    });
    canvas.shape('y_axis', shape => {
      shape.vertex(0, canvas.corner.y);
      shape.vertex(0, canvas.corner.y + canvas.height / stretch[1]);
    });
  });
};
