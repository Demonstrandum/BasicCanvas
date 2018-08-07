export const clone = obj => Object.assign(Object.create(Object.getPrototypeOf(obj)), console);

Math.TAU = 2 * Math.PI;
HTMLElement.prototype.css = function (properties) {
  for (const property in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, property)) {
      this.style[property] = properties[property]
    }
  }
}

export const style = string => {
  const node = document.createElement('style');
  node.innerHTML = string;
  document.body.appendChild(node);
};

export const key_press = handler => {
  window.addEventListener('keypress', handler, false);
};

export const key_down = handler => {
  window.addEventListener('keydown', handler, false);
};

export const key_up = handler => {
  window.addEventListener('keyup', handler, false);
};

class PointObj {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  valueOf() {
    return this.toString();
  }
}
class NamedColorObj {
  constructor(color) {
    this.color = color;
  }

  toString() {
    return this.color;
  }

  valueOf() {
    return this.toString();
  }
}
class RGBAObj {
  constructor(r, g, b, a) {
    [this.r, this.g, this.b, this.a] = [r, g, b, a].map(Math.round);
    this.rgba = [this.r, this.g, this.b, this.a];
    this.rgb = this.rgba.slice(0, -1);
  }

  toString() {
    return `rgba(${this.rgb.join(', ')}, ${this.a / 255})`;
  }

  valueOf() {
    return this.toString();
  }
}

class HSLObj {
  constructor(h, s, l, a) {
    [this.h, this.s, this.l, this.a] = [h, s, l, a].map(Math.round);
  }

  toString() {
    return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a / 255})`;
  }

  valueOf() {
    return this.toString();
  }
}

class HSVObj extends HSLObj {
  toString() {
    return `hsva(${this.h}, ${this.s}%, ${this.l}%, ${this.a / 255})`;
  }
}
class HEXobj {
  constructor(hex) {
    this.hex = `#${hex.split('#').slice(-1)[0]}`;
  }

  toString() {
    return this.hex;
  }

  valueOf() {
    return this.toString();
  }
}

export const Point = (x, y) => new PointObj(x, y);
export const polar = (r, theta, origin = Point(0, 0)) => Point(
  r * Math.cos(theta) + origin.x,
  r * Math.sin(theta) + origin.y
);

export const Color = (r, g = -1, b = -1, a = 255) => {
  if (typeof r === 'string') {
    return new NamedColorObj(r);
  }
  if (b < 0 && g >= 0) {
    a = g;
  }
  if (b < 0) {
    [g, b] = [r, r];
  }

  return new RGBAObj(r, g, b, a);
};
export const RGBA = Color;
export const RGB  = Color;
export const HEX = hex => new HEXobj(hex);
export const HSL = (h, s = 100, l = 50, a = 255) => new HSLObj(h, s, l, a);
export const HSV = (h, s = 100, v = 100, a = 255) => new HSVObj(h, s, v, a);

class Shape {
  constructor(name, canvas) {
    this.shape_name = name;
    this.canvas = canvas;

    this.vertices = [];
  }

  style(
    fill = this.canvas.fill,
    stroke = this.canvas.stroke,
    stroke_weight = this.canvas.stroke_weight,
    stroke_cap = this.canvas.stroke_cap
  ) {
    const c = this.canvas.context;
    c.fillStyle = fill.toString();
    c.strokeStyle = stroke.toString();
    c.lineWidth = stroke_weight;
    c.lineCap = stroke_cap;
    return this;
  }

  point(point, color = this.canvas.stroke) {
    return this.canvas.color(point, color);
  }

  vertex(point, y = null) {
    if (y) point = Point(point, y);
    if (this.vertices.length === 0) {
      this.vertices.push([point.x, point.y]);
      return point;
    }

    const c = this.canvas.context;
    c.beginPath();
    c.moveTo(...this.vertices[this.vertices.length - 1]);
    const next = [point.x, point.y];
    c.lineTo(...next);
    this.style();
    c.stroke();

    this.vertices.push(next);
    return point;
  }

  rect(point, w, h, fill = this.canvas.fill, stroke = this.canvas.stroke) {
    this.style(fill, stroke);
    const c = this.canvas.context;

    c.fillRect(point.x, point.y, w, h);
    c.rect(point.x, point.y, w, h);
    c.stroke();
  }

  close() {
    this.vertex(Point(...this.vertices[0]));
    return this;
  }

  fill(color = this.canvas.fill) {
    // TODO: Either redraw all vertices and use built-in fill function,
    //       or, implement own fill function (see: https://stackoverflow.com/questions/31799038/filling-a-polygon)

    // redraws all vertices, SLOW and BAD, SAD! (tbh, prolly faster than whatever I'd write)
    const c = this.canvas.context;
    c.moveTo(...this.vertices[0]);
    for (const vertex of this.vertices.slice(1)) {
      c.lineTo(...vertex);
    }

    c.fillStyle = color.toString();
    c.fill();
  }
}

class Canvas {
  constructor(elem) {
    this.elem = elem;
    this.width = this.elem.width;
    this.height = this.elem.height;

    this.context = elem.getContext('2d');
    this.image_data = this.context.getImageData(0, 0, this.width, this.height);
    this.data = this.image_data.data;

    this.fill = Color(255, 255, 255);
    this.stroke = Color(0, 0, 0);
    this.stroke_weight = 1;
    this.stroke_cap = 'butt';
    this.font = '16px sans-serif';

    this.corner = {x: 0, y: 0};

    this.shapes = {};
    this.update = () => {};
  }

  set new_width(w) {
    this.elem.width = w;
    this.width = w;
    this.update_context();
  }

  set new_height(h) {
    this.elem.height = h;
    this.height = h;
    this.update_context();
  }

  update_context() {
    this.context = this.elem.getContext('2d');
    this.image_data = this.context.getImageData(0, 0, this.width, this.height);
    this.data = this.image_data.data;
  }

  dimensions(w, h) {
    this.elem.width = w;
    this.width = w;
    this.elem.height = h;
    this.height = h;
    this.update_context();
  }

  translate(x, y) {
    [this.corner.x, this.corner.y] = [-x, -y];
    this.context.translate(x, y);
  }

  color(point, other = null) {
    if (!other) {
      return Color(...this.context.getImageData(point.x, point.y, 1, 1).data);
    }
    this.context.fillStyle = other.toString();
    this.context.fillRect(point.x, point.y, 1, 1);
    return other;
  }

  point(point, color = this.stroke) {
    return this.color(point, color);
  }

  shape(name, construction) {
    if (!name) {
      name = `ImplicitShape${Object.keys(this.shapes).length}`;
    }
    this.shapes[name] = {
      construction,
      shape: new Shape(name, this)
    };
    this.context.beginPath();
    construction(this.shapes[name].shape);
    this.context.closePath();
    return this.shapes[name].shape;
  }

  text(string, point, font = this.font, fill = this.fill, storke = this.stroke) {
    const c = this.context;

    c.font = font;
    c.fillStyle = fill;
    c.strokeStyle = storke;
    c.fillText(string, point.x, point.y);
    c.strokeText(string, point.x, point.y);
  }

  background(c = this.fill, clear = false) {
    if (clear) {
      this.context.clearRect(
        this.corner.x, this.corner.y,
        -this.corner.x + this.width, -this.corner.y + this.height
      );
    }
    this.context.fillStyle = c.toString();
    this.context.fillRect(
      this.corner.x, this.corner.y,
      -this.corner.x + this.width, -this.corner.y + this.height
    );
  }

  update_frame(canvas) {
    canvas.shapes = {};
    (canvas.update)(canvas.frame++);
    window.requestAnimationFrame(() => {
      canvas.update_frame(canvas);
    });
  }

  loop(update) {
    this.shapes = {};
    this.update = update;
    this.frame = 1;
    window.requestAnimationFrame(() => {
      this.update_frame(this);
    });
  }
}

export const canvas = elem => {
  return new Canvas(elem);
};

export const canvas_id = id => {
  return canvas(document.getElementById(id));
};
