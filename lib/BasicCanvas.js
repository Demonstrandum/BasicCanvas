export const clone = obj => Object.assign(Object.create(Object.getPrototypeOf(obj)), console);

Math.TAU = 2 * Math.PI;
Math.HALF_PI = Math.PI * 0.5;
Number.prototype.roundTo = function (dp) {
  return parseFloat((this).toFixed(dp));
};

Array.prototype.mag = function () {
  return Math.sqrt(this.reduce((i, j) => i + j ** 2, 0));
};
Array.prototype.norm = function () {
  return this.map(e => e / this.mag());
};
Array.prototype.rotate = function (theta) {
  return [
    this[0] * Math.cos(theta) - this[1] * Math.sin(theta),
    this[0] * Math.sin(theta) + this[1] * Math.cos(theta)
  ];  // 2D roataion only.
};

export const plain = (s, ...exps) => s
  .map((e, i) => [e, exps[i]])
  .reduce((acc, val) => acc.concat(val), [])
  .join('');  // Extremely slow, exist to trick editors in to higlighting.

export const style = string => {
  const node = document.createElement('style');
  node.innerHTML = string;
  document.body.appendChild(node);
};

export const css = (s, ...exps) => style(plain(s, ...exps));

HTMLElement.prototype.html = function (s, ...exps) {
  const contain = document.createElement('del');
  contain.style.textDecoration = 'none';
  contain.innerHTML = String.raw(s, ...exps);
  this.appendChild(contain);
};

HTMLElement.prototype.css = function (properties) {
  for (const property in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, property)) {
      this.style[property] = properties[property];
    }
  }
};
Object.defineProperty(HTMLElement.prototype, 'elem', {
  get: function elem() {
    return this;
  }
});

export const click = (handler, canvas = null) => {
  if (canvas) {
    canvas.elem.addEventListener('click', handler, false);
  } else {
    window.addEventListener('click', handler, false);
  }
};

export const mouse_down = (handler, canvas = null) => {
  if (canvas) {
    canvas.elem.addEventListener('mousedown', handler, false);
  } else {
    window.addEventListener('mousedown', handler, false);
  }
};

export const mouse_up = (handler, canvas = null) => {
  if (canvas) {
    canvas.elem.addEventListener('mouseup', handler, false);
  } else {
    window.addEventListener('mouseup', handler, false);
  }
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

  floor() {
    return new PointObj(Math.floor(this.x), Math.floor(this.y));
  }

  sum() {
    return this.x + this.y;
  }

  add(other) {
    return new PointObj(this.x + other.x, this.y + other.y);
  }

  sub(other) {
    return new PointObj(this.x - other.x, this.y - other.y);
  }

  mul(other) {
    if (typeof (other) === 'number') {
      return new PointObj(this.x * other, this.y * other);
    }
    return new PointObj(this.x + other.x, this.y + other.y);
  }

  dot(other) {
    const standard = this.mul(other);
    return standard.sum();
  }

  div(other) {
    if (typeof (other) !== 'number') {
      throw new TypeError('Can only divide vectors by numerics.');
    }
    return new PointObj(this.x / other, this.y / other);
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
    this.hex = (typeof hex === 'string') ?
      `#${hex.split('#').slice(-1)[0]}` :
      `#${('000000' + hex.toString(16)).slice(-6)}`;
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
export const HSLA = HSL;
export const HSV = (h, s = 100, v = 100, a = 255) => new HSVObj(h, s, v, a);
export const HSVA = HSV;

class Shape {
  constructor(name, canvas) {
    this.name = name;
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
    if (y !== null) {
      point = Point(point, y);
    }
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

    c.rect(point.x, point.y, w, h);
    c.stroke();
    c.fill();
  }

  ellipse(point, w, h, fill = this.canvas.fill, stroke = this.canvas.stroke) {
    this.style(fill, stroke);
    const c = this.canvas.context;

    c.ellipse(point.x, point.y, w, h, 0, 0, Math.TAU);
    c.stroke();
    c.fill();
  }

  close() {
    this.vertex(Point(...this.vertices[0]));
    return this;
  }

  fill(color = this.canvas.fill) {
    // TODO: Either redraw all vertices and use built-in fill function,
    //       or, implement own fill function (see: https://stackoverflow.com/questions/31799038/filling-a-polygon)

    // Redraws all vertices, SLOW and BAD, SAD! (tbh, prolly faster than whatever I'd write)
    const c = this.canvas.context;
    c.moveTo(...this.vertices[0]);
    for (const vertex of this.vertices.slice(1)) {
      c.lineTo(...vertex);
    }

    this.style();
    c.fill();
    c.stroke();
  }
}

class Canvas {
  constructor(elem) {
    this.elem = elem;
    this._width = this.elem.width;
    this._height = this.elem.height;

    this.context = elem.getContext('2d');
    this.image_data = this.context.getImageData(0, 0, this.width, this.height);
    this.data = this.image_data.data;

    this.fill = RGB(255, 255, 255);
    this.stroke = RGB(0, 0, 0);
    this._stroke_weight = 1;
    this.stroke_cap = 'butt';
    this.font = '16px sans-serif';
    this.text_align = 'left';
    this._mouse_position = Point(NaN, NaN);
    this._mouse_listen = undefined;

    this.corner = {x: 0, y: 0};
    this.stretch = [1, 1];

    this.state_stack = [];
    // Saved properties of the objects state at a certain time.

    this.shapes = {};
    this.update = () => {};
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  set width(w) {
    this.elem.width = w;
    this._width = w;
    this.update_context();
  }

  set height(h) {
    this.elem.height = h;
    this._height = h;
    this.update_context();
  }

  get stroke_weight() {
    return this._stroke_weight / Math.max(...(this.stretch).map(e => Math.abs(e)));
  }

  set stroke_weight(w) {
    this._stroke_weight = w;
  }

  get mouse() {
    if (this._mouse_listen === undefined) {
      this._mouse_listen = this.elem.addEventListener('mousemove', evt => {
        const rect = this.elem.getBoundingClientRect();
        this._mouse_position = Point(
          (evt.clientX - rect.left) / this.stretch[0] + this.corner.x,
          (evt.clientY - rect.top)  / this.stretch[1] + this.corner.y
        );
      });
    }
    return this._mouse_position;
  }

  update_context() {
    this.context = this.elem.getContext('2d');
    this.image_data = this.context.getImageData(0, 0, this.width, this.height);
    this.data = this.image_data.data;
  }

  dimensions(w, h) {
    this.width = w;
    this.height = h;
    this.update_context();
  }

  translate(x, y) {
    [this.corner.x, this.corner.y] = [-x, -y];
    this.context.translate(x, y);
  }

  scale(x, y = x) {
    [this.corner.x, this.corner.y] = [this.corner.x / x, this.corner.y / y];
    this.stretch = [x, y];
    this.context.scale(x, y);
  }

  unscale() {
    this.scale(1 / this.stretch[0], 1 / this.stretch[1]);
  }

  save() {
    const keys = Object.keys(this);
    const saved = {};
    for (const key of keys) {
      if (typeof this[key] === 'object' && this[key].constructor === Object) {
        saved[key] = Object.assign({}, this[key]);
      } else if (key === 'state_stack') {
        continue;
      } else {
        saved[key] = this[key];
      }
    }
    this.state_stack.push(saved);
    return this.context.save();
  }

  restore() {
    const saved = this.state_stack.pop();
    for (const key in saved) {
      if (Object.prototype.hasOwnProperty.call(saved, key)) {
        this[key] = saved[key];
      }
    }
    return this.context.restore();
  }

  temp(λ) {
    this.save();
    λ();
    return this.restore();
  }

  color(point, other = null) {
    if (!other) {
      return Color(...this.context.getImageData(point.x, point.y, 1, 1).data);
    }
    this.context.fillStyle = other.toString();
    this.context.fillRect(
      point.x, point.y,
      1 / this.stretch[0], 1 / this.stretch[1]
    );
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
    c.textAlign = this.text_align;
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
