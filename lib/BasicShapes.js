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

export const polar_line = (origin, mag, angle) => shape => {
  shape.vertex(origin);
  shape.vertex(BC.polar(mag, angle, origin));
};

export const arrow = (origin, mag, angle, headsize = mag / 5) => shape => {
  shape.canvas.shape(null, polar_line(origin, mag, angle));
  const arrow_angle = 2.4;
  const position = BC.polar(mag, angle, origin);
  shape.vertex(position);
  shape.vertex(BC.polar(headsize, angle - arrow_angle, position));
  shape.vertex(position);
  shape.vertex(BC.polar(headsize, angle + arrow_angle, position));
};
