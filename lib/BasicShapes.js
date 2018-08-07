import * as BC from './BasicCanvas.js';

export const rectangle = (point, w, h, fill = null, stroke = null) => shape => {
  const f = fill || shape.canvas.fill;
  const s = stroke || shape.canvas.stroke;
  shape.rect(point, w, h, f, s);
};

export const polar_vector = (origin, mag, angle) => shape => {
  shape.vertex(origin);
  shape.vertex(BC.polar(mag, angle, origin));
};

export const arrow = (origin, mag, angle, headsize = mag / 5) => shape => {
  shape.canvas.shape(null, polar_vector(origin, mag, angle));
  const arrow_angle = 2.4;
  const position = BC.polar(mag, angle, origin);
  shape.vertex(position);
  shape.vertex(BC.polar(headsize, angle - arrow_angle, position));
  shape.vertex(position);
  shape.vertex(BC.polar(headsize, angle + arrow_angle, position));
};
