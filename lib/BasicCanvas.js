// Basic semi-related tools.
export const clone = obj => Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
Object.prototype.clone = function () {
  return clone(this);
};

export const type = element => (
  ({}).toString.call(element).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
);

// --> Try to make `use()`, `type()` and `clone()` functions global.
let _use;
if (typeof window === 'undefined') {
  _use = (namespace, global) => Object.assign(global, namespace);
} else {
  _use = (namespace, global = window) => Object.assign(global, namespace);

  window.use = _use;
  window.type = type;
  window.clone = clone;
}

export const use = _use;

export const load_font = (name, path, description) => {
  const font = new FontFace(name, path, description);
  font.load().then(loaded => document.fonts.add(loaded));
  return font;
};

export const plain = (...args) => String.raw({raw: args[0]}, ...args.slice(1));

export const style = string => {
  const node = document.createElement('style');
  node.innerHTML = string;
  document.body.appendChild(node);
};

export const css = (s, ...exps) => style(plain(s, ...exps));

// Patching and Monkey Patching prototypes.
Math.TAU = 2 * Math.PI;
Math.HALF_PI = Math.PI * 0.5;
Number.prototype.roundTo = function (dp) {
  return parseFloat((this).toFixed(dp));
};

Array.prototype.mag = function () {
  return Math.sqrt(this.reduce((i, j) => i + j ** 2, 0));
};
Array.prototype.norm = function () {
  if (this.every(e => e === 0)) {
    return this;
  }
  return this.map(e => e / this.mag());
};
Array.prototype.rotate = function (theta) {
  return [
    this[0] * Math.cos(theta) - this[1] * Math.sin(theta),
    this[0] * Math.sin(theta) + this[1] * Math.cos(theta)
  ];  // 2D roataion only.
};

String.prototype.replaceAll = function (search, replacement) {
  return this.replace(new RegExp(search, 'g'), replacement);
};

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

Object.prototype.omap = function (lambda) {
  return Object.assign({}, ...Object.keys(this).map(k => ({[k]: lambda(this[k])})));
};

Object.defineProperty(HTMLElement.prototype, 'elem', {
  get: function elem() {
    return this;
  }
});

// More interaction-specific tools
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

// Classes for specific data-types
class PointObj {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get array() {
    return [this.x, this.y];
  }

  set array(a) {
    [this.x, this.y] = a;
  }

  floor() {
    return new PointObj(Math.floor(this.x), Math.floor(this.y));
  }

  norm(other = new PointObj(0, 0)) {
    return new PointObj(...this.sub(other).array.norm());
  }

  unit(...args) {
    return this.norm(...args);
  }

  sum() {
    return this.x + this.y;
  }

  add(other) {
    return new PointObj(this.x + other.x, this.y + other.y);
  }

  offset(x, y) {
    return new PointObj(this.x + x, this.y + y);
  }

  sub(other) {
    return new PointObj(this.x - other.x, this.y - other.y);
  }

  scale(scalar) {
    return new PointObj(this.x * scalar, this.y * scalar);
  }

  mul(other) {
    if (typeof (other) === 'number') {
      return this.scale(other);
    }
    return new PointObj(this.x * other.x, this.y * other.y);
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

  mag(other = new PointObj(0, 0)) {
    return this.sub(other).array.mag();
  }

  size(...xs) {
    return this.mag(...xs);
  }

  length(...xs) {
    return this.mag(...xs);
  }

  modulus(...xs) {
    return this.mag(...xs);
  }

  angle(other = new PointObj(0, 0)) {
    const v = this.sub(other);
    return Math.atan2(v.y, v.x);
  }

  phase(...xs) {
    return this.angle(...xs);
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
    if (type(hex) === 'array') {
      this.hex = `#${hex[0].split('#').slice(-1)[0]}`;
      return;
    }
    this.hex = (type(hex) === 'string') ?
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

// Construction functions for data-types
export const Point = (x, y) => new PointObj(x, y);
export const Polar = (r, theta, origin = Point(0, 0)) => Point(
  r * Math.cos(theta) + origin.x,
  r * Math.sin(theta) + origin.y
);

export const [P, point, polar] = [Point, Point, Polar];

export const Color = (r, g = -1, b = -1, a = 255) => {
  if (type(r) === 'string') {
    return new NamedColorObj(r);
  }
  if (type(r) === 'array') {
    return new NamedColorObj(r[0]);
  }
  if (b < 0 && g >= 0) {
    a = g;
  }
  if (b < 0) {
    [g, b] = [r, r];
  }

  return new RGBAObj(r, g, b, a);
};

export const Colour = Color;
export const RGBA = Color;
export const RGB = Color;
export const HEX = hex => new HEXobj(hex);
export const HSL = (h, s = 100, l = 50, a = 255) => new HSLObj(h, s, l, a);
export const HSLA = HSL;
export const HSV = (h, s = 100, v = 100, a = 255) => new HSVObj(h, s, v, a);
export const HSVA = HSV;

export const TRANSPARENT = Object.freeze('transparent');

export const compute_color = c => {
  const temp_div = document.createElement('div');
  let match = null;

  temp_div.style.color = c.toString();
  document.body.appendChild(temp_div);

  const computed = getComputedStyle(temp_div);
  match = (computed.color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i) ||
	computed.color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([+-]?\d+(\.\d+)?)\s*\)$/i) ||
  	computed.color.match(/^transparent$/i));

  document.body.removeChild(temp_div);
  if (!match) {
    throw new Error(`Color '${c}', could not be parsed.\nComputed style was: '${computed.color}'`);
  }

  let alpha = 255;
  if (match[0] === TRANSPARENT) {
    return RGBA(0, 0, 0, 0);
  }
  if (match[4]) {
    alpha = 255 * parseFloat(match[4]);
  }

  return RGBA(...([match[1], match[2], match[3]].map(parseFloat)), alpha);
};

// Implements and manages every rendered shape seen.
class Shape {
  constructor(name, canvas) {
    this.name = name;
    this.canvas = canvas;
    this.primitive = null;

    this.vertices = [];
    this.center = Point(0, 0);
    this.hollow = false;
  }

  flesh() {
    this.canvas.context.fill();
    this.canvas.context.stroke();
  }

  style(
    fill = this.canvas.fill,
    stroke = this.canvas.stroke,
    stroke_weight = this.canvas.stroke_weight,
    stroke_cap = this.canvas.stroke_cap
  ) {
    if (stroke_weight === 0) {
      stroke = TRANSPARENT;
    }
    const c = this.canvas.context;
    c.fillStyle = (this.hollow) ? TRANSPARENT : fill.toString();
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
      this.center = point;
      return point;
    }

    const c = this.canvas.context;
    c.beginPath();
    c.moveTo(...this.vertices[this.vertices.length - 1]);
    const next = [point.x, point.y];
    c.lineTo(...next);
    this.style();
    this.flesh();

    this.vertices.push(next);
    return point;
  }

  rect(point, w, h, fill = this.canvas.fill, stroke = this.canvas.stroke) {
    this.style(fill, stroke);
    const c = this.canvas.context;

    this.primitive = () => c.rect(point.x, point.y, w, h);
    this.primitive();
    this.flesh();
  }

  ellipse(point, w, h, fill = this.canvas.fill, stroke = this.canvas.stroke) {
    this.style(fill, stroke);
    const c = this.canvas.context;

    this.primitive = () => c.ellipse(point.x, point.y, w, h, 0, 0, Math.TAU);
    this.primitive();
    this.flesh();
  }

  close() {
    this.vertex(Point(...this.vertices[0]));
    return this;
  }

  fill(color = null) {
    // TODO: Either redraw all vertices and use built-in fill function,
    //       or, implement own fill function (see: https://stackoverflow.com/questions/31799038/filling-a-polygon)

    // Secretly redraws all vertices,
    //   SLOW and BAD, SAD! (tbh, prolly faster than whatever I'd write)
    let temp_color = color;
    if (temp_color === null) {
      temp_color = this.canvas.fill;
    }

    if (this.hollow ||
     compute_color(temp_color).a === 0 ||
     (this.vertices.length < 3 && !this.primitive)) {
      return;
    }

    if (this.primitive === null) {
      if (this.vertices.length > 0) {
        const c = this.canvas.context;
        c.moveTo(...this.vertices[0]);
        for (const vertex of this.vertices.slice(1)) {
          c.lineTo(...vertex);
      	}
      }
    } else {
      this.primitive();
    }

    this.style(temp_color);
    this.flesh();
  }
}

// Main Canvas class:
// --> First point of abstraction away from the standard canvas.
class Canvas {
  constructor(elem) {
    this.elem = elem;
    this._width = this.elem.width;
    this._height = this.elem.height;

    // FPS variables.
    this._now = null;
    this._Δ = null;
    this._then = Date.now();
    this._interval = 1000 / 60;

    // Canvas Context.
    this.context = elem.getContext('2d');
    this.image_data = this.context.getImageData(0, 0, this.width, this.height);
    this.data = this.image_data.data;

    // Main API properties.
    this.fill = RGBA(255, 255, 255, 0);
    this.stroke = RGB(0, 0, 0);
    this._stroke_weight = 1;
    this.stroke_cap = 'butt';
    this.font = '16px sans-serif';
    this.text_align = 'left';
    this._mouse_position = Point(NaN, NaN);
    this._mouse_listen = undefined;

    // Used for coördinate calculations.
    this.corner = {x: 0, y: 0};
    this.stretch = [1, 1];

    // Saved properties of the objects state at a certain time.
    this.state_stack = [];

    this.shapes = {};  // All shapes displayed on the canvas.
    this.update = () => { };  // Lambda for when drawing a frame.
  }

  get FPS() {
    return 1000 / this._Δ;
  }

  set FPS(frame_rate) {
    this._interval = 1000 / frame_rate;
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
    if (w === 0) {
      this.stroke = TRANSPARENT;
    }
    this._stroke_weight = w;
  }

  get mouse() {
    if (this._mouse_listen === undefined) {
      this._mouse_listen = this.elem.addEventListener('mousemove', evt => {
        const rect = this.elem.getBoundingClientRect();
        this._mouse_position = Point(
          (evt.clientX - rect.left) / this.stretch[0] + this.corner.x,
          (evt.clientY - rect.top) / this.stretch[1] + this.corner.y
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

  rotate(theta) {
    this.context.rotate(theta);
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
      if (this[key] !== null && typeof this[key] === 'object' && this[key].constructor === Object) {
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

  shape(name, construction = null) {
    let [_name, _construction] = [null, null];
    if (construction === null && typeof name === 'function') {
      _construction = name;
    } else {
      _construction = construction;
    }
    if (name === null || name === undefined || construction === null) {
      _name = `ImplicitName${Object.keys(this.shapes).length}`;
    } else {
      _name = name;
    }

    const SHAPE = new Shape(_name, this);
    this.shapes[_name] = {
      draw: _construction,
      shape: SHAPE
    };
    this.context.beginPath();
    _construction(SHAPE);
    this.context.closePath();

    if (this.fill !== TRANSPARENT && SHAPE.primitive === null) {
      SHAPE.fill();
    }
    return SHAPE;
  }

  render(...args) {
    return this.shape(...args);
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
        this.corner.x,
        this.corner.y,
        -this.corner.x + Math.sign(this.stretch[0]) * this.width,
        -this.corner.y + Math.sign(this.stretch[1]) * this.height
      );
    }
    this.context.fillStyle = c.toString();
    this.context.fillRect(
      this.corner.x,
      this.corner.y,
      -this.corner.x + Math.sign(this.stretch[0]) * this.width,
      -this.corner.y + Math.sign(this.stretch[1]) * this.height
    );
  }

  update_frame(canvas) {
    canvas.shapes = {};

    window.requestAnimationFrame(() => {
      canvas.update_frame(canvas);
    });

    canvas._now = Date.now();
    canvas._Δ = canvas._now - canvas._then;

    if (canvas._Δ > canvas._interval) {
      canvas._then = canvas._now - (canvas._Δ % canvas._interval);
      canvas.update(canvas.frame++);
    }
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

// Create new `Canvas` instance in various ways.
export const canvas = elem => (
  new Canvas(elem)
);

export const canvas_id = id => (
  canvas(document.getElementById(id))
);

export const canvas_new = (id, parent_selector = 'body') => {
  created = document.createElement('canvas');
  created.id = id;

  document.querySelector(parent_selector).appendChild(created);
  return canvas_id(id);
};
