// Identify Node.js
const in_node = !!(typeof process !== 'undefined'
    && typeof process.versions.node !== 'undefined');
const is_worker = !!(typeof window === 'undefined'
    && typeof self !== 'undefined');
if (in_node) {
  console.log('Running under Node.js!');
  const window = global;
  global.window = window;
  global.HTMLElement = function HTMLElement() {
    this.width = this.height = 300;
  };
} else if (is_worker) {
  console.log('Running in web context without `window`.');
  const window = self;
  self.window = self;
  self.HTMLElement = function HTMLElement() {
    this.width = this.height = 300;
  }
}

let already_patched = (typeof window !== 'undefined'
    && typeof window._basiccanvas_imported !== 'undefined')
    || Object.prototype.hasOwnProperty('clone');

// Basic semi-related tools.
export const clone = obj => Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);

if (!already_patched) {
  Object.defineProperty(Object.prototype, 'clone',{
    value: function() { return clone(this) },
    writable: true,
    configurable: true,
    enumerable: false
  });
}

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
if (!already_patched) {
  Math.TAU = 2 * Math.PI;
  Math.HALF_PI = Math.PI * 0.5;
  Math.triangle = t => Math.abs(((t - 1) % 4) - 2) - 1;

  Object.defineProperty(Number.prototype, 'roundTo', {
    value: function (dp) {
      return parseFloat((this).toFixed(dp));
    },
    enumerable: false,
  });
  Object.defineProperty(Number.prototype, 'times', {
    value: function (fn) {
      for (let i = 1; i <= this.valueOf(); ++i) fn(i);
    },
    enumerable: false,
  });

  Object.defineProperty(Array.prototype, 'each', {
    value: Array.prototype.forEach,
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'select', {
    value: Array.prototype.filter,
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'reject', {
    value: function (lambda, array) {
      return this.filter((e) => !lambda(e), array);
    },
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'mag', {
    value: function () {
      return Math.sqrt(this.reduce((i, j) => i + j ** 2, 0));
    },
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'normalize', {
    value: function () {
      if (this.every(e => e === 0)) {
        return this;
      }
      return this.map(e => e / this.mag());
    },
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'rotate', {
    value: function (theta, origin=[0,0]) {
      return [  // Only 2D
        origin[0] + (this[0] - origin[0]) * Math.cos(theta) - (this[1] - origin[1]) * Math.sin(theta),
        origin[1] + (this[0] - origin[0]) * Math.sin(theta) + (this[1] - origin[1]) * Math.cos(theta)
      ];
    },
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'x', {
    get: function x() {
      return this[0];
    },
    set: function x(new_x) {
      return this[0] = new_x;
    },
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'y', {
    get: function y() {
      return this[1];
    },
    set: function y(new_y) {
      return this[1] = new_y;
    },
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'z', {
    get: function y() {
      return this[2];
    },
    set: function z(new_z) {
      return this[2] = new_z;
    },
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'first', {
    get: function first() {
      return this[0];
    },
    set: function first(other) {
      return this[0] = other;
    },
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'last', {
    get: function last() {
      return this[this.length - 1];
    },
    set: function last(other) {
      return this[this.length - 1] = other;
    },
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'tail', {
    get: function tail() {
      return this.slice(1);
    },
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'point', {
    get: function point() {
      return Point(this[0], this[1]);
    },
    enumerable: false,
  });
  Object.defineProperty(Array.prototype, 'head', {
    get: function first() {
      return this[0];
    },
    set: function first(other) {
      return this[0] = other;
    },
    enumerable: false,
  });

  Object.defineProperty(String.prototype, 'replaceAll', {
    value: function (search, replacement) {
      return this.replace(new RegExp(search, 'g'), replacement);
    },
    enumerable: false,
  });

  Object.defineProperty(HTMLElement.prototype, 'html', {
    value: function (s, ...exps) {
      const contain = document.createElement('del');
      contain.style.textDecoration = 'none';
      contain.innerHTML = String.raw(s, ...exps);
      this.appendChild(contain);
    },
    enumerable: false,
  });

  Object.defineProperty(HTMLElement.prototype, 'css', {
    value: function (properties) {
      for (const property in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, property)) {
          this.style[property] = properties[property];
        }
      }
    },
    enumerable: false,
  });

  Object.defineProperty(Object.prototype, 'omap',{
    value: function (lambda) {
        return Object.assign({},
          ...Object.keys(this).map(k => ({[k]: lambda(this[k])})));
    },
    enumerable: false
  });

  Object.defineProperty(HTMLElement.prototype, 'elem', {
    get: function elem() {
      return this;
    },
    enumerable: false,
  });
}

if (typeof window !== 'undefined') {
  window._basiccanvas_imported = true;
}

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
  constructor(x, y=null) {
    if (y === null && type(x) === 'array') {
      [this.x, this.y] = x;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  get 0() { return this.x; }
  get 1() { return this.y; }
  set 0(x) { this.x = x; }
  set 1(y) { this.y = y; }

  [Symbol.iterator]() {
    const array = [this.x, this.y];
    let i = 0;

    return {
      next() {
        const it = { value: array[i], done: i >= 2 };
        i += 1;
        return it;
      }
    };
  }

  get point() { return this; }
  get array() { return [this.x, this.y]; }
  set array(a) { [this.x, this.y] = a; }

  floor() {
    return new PointObj(Math.floor(this.x), Math.floor(this.y));
  }

  normalize(other = new PointObj(0, 0)) {
    return new PointObj(...this.sub(other).array.normalize());
  }

  unit(...args) {
    return this.normalize(...args);
  }

  sum() {
    return this.x + this.y;
  }

  add(other) {
    return new PointObj(this.x + other.x, this.y + other.y);
  }
  plus(other) { return this.add(other); }

  offset(x, y) {
    return new PointObj(this.x + x, this.y + y);
  }

  sub(other) {
    return new PointObj(this.x - other.x, this.y - other.y);
  }
  minus(other) { return this.sub(other); }

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

  quadrature() {
      return this.dot(this);
  }

  mag(other = new PointObj(0, 0)) {
    return this.sub(other).array.mag();
  }

  magnitude(...xs) {
    return this.mag(...xs);
  }

  norm(...xs) {
    return this.mag(...xs);
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

  dist(...xs) {
    return this.mag(...xs);
  }

  angle(other = new PointObj(0, 0)) {
    const v = this.sub(other);
    return Math.atan2(v.y, v.x);
  }

  phase(...xs) {
    return this.angle(...xs);
  }

  arg(...xs) {
    return this.angle(...xs);
  }

  rotate(theta, origin = new PointObj(0, 0)) {
    return new PointObj(...this.array.rotate(theta, origin.array));
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  valueOf() {
    return this.toString();
  }
}

class RGBAObj {
  constructor(r, g, b, a) {
    [this.r, this.g, this.b, this.a] = [r, g, b, a].map(Math.round);
  }

  get rgba() {
    return [this.r, this.g, this.b, this.a];
  }

  get rgb() {
    return this.rgba.slice(0, -1);
  }

  set rgba(arr) {
    [this.r, this.g, this.b, this.a] = arr;
  }

  set rgb(arr) {
    [this.r, this.g, this.b] = arr;
  }

  toString() {
    return `rgba(${this.rgb.join(', ')}, ${this.a / 255})`;
  }

  valueOf() {
    return this.toString();
  }
}

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

function hue_to_rgb(p, q, t) {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}

class HSLObj {
  constructor(h, s, l, a) {
    [this.h, this.s, this.l, this.a] = [h, s, l, a].map(Math.round);
    this.rgb = this.to_rgb();
  }

  to_rgb() {
    let r, g, b;
    const h = this.h / 360;
    const [s, l] = [this.s, this.l].map(n => n / 100);

    if (s == 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue_to_rgb(p, q, h + 1 / 3);
      g = hue_to_rgb(p, q, h);
      b = hue_to_rgb(p, q, h - 1 / 3);
    }

    return RGBA(r * 255, g * 255, b * 255, this.a);
  }

  toString() {
    return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a / 255})`;
  }

  valueOf() {
    return this.toString();
  }
}

class HSVObj {
  constructor(h, s, v, a) {
    [this.h, this.s, this.v, this.a] = [h, s, v, a].map(Math.round);
    this.rgb = this.to_rgb();
  }

  to_rgb() {
    let r, g, b;
    const h = this.h / 360;
    const [s, v] = [this.s, this.v].map(n => n / 100);

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }

    return RGBA(r * 255, g * 255, b * 255, this.a);
  }

  toString() {
    const [r, g, b, a] = this.to_rgb().rgba;
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  }

  valueOf() {
    return this.toString();
  }
}

class HEXobj {
  constructor(hex) {
    const chars = '000000ff'.split(''); // 0x000000ff

    let given;
    if (type(hex) === 'string') {
      given = hex.split('#').slice(-1)[0];
    } else if (type(hex) === 'array') {
      given = plain(...hex).split('#').slice(-1)[0];
    } else if (type(hex) === 'number') {
      given = hex.toString(16).padStart(6, '0');
      if (hex <= 0xffffff)
        given += 'ff';
    } else {
      given = hex.toString().split('#').slice(-1)[0];
    }

    // Short form.  Normal: 3,  With alpha: 4.
    if (given.length === 3 || given.length === 4) {
      chars[0] = given[0];
      chars[1] = given[0];
      chars[2] = given[1];
      chars[3] = given[1];
      chars[4] = given[2];
      chars[5] = given[2];
      if (given.length === 4) {
        chars[6] = given[3];
        chars[7] = given[3];
      }
    // Full form.  Normal: 6,  With alpha: 8.
    } else if (given.length === 6 || given.length === 8) {
      chars[0] = given[0];
      chars[1] = given[1];
      chars[2] = given[2];
      chars[3] = given[3];
      chars[4] = given[4];
      chars[5] = given[5];
      if (given.length === 8) {
        chars[6] = given[6];
        chars[7] = given[7];
      }
    } else {
      throw new Error('Invalid hex format: ' + given);
    }

    const str = chars.join('');
    this.str = '#' + str;
    this.hex = parseInt(str, 16);
  }

  get rgb() {
    return this.to_rgb();
  }

  to_rgb() {
    const r = this.hex >> 24 & 0xFF;
    const g = this.hex >> 16 & 0xFF;
    const b = this.hex >> 8  & 0xFF;
    const a = this.hex & 0xFF;
    return RGBA(r, g, b, a);
  }

  toString() {
    return this.str;
  }

  valueOf() {
    return this.toString();
  }
}

export const NAMED_COLORS = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  goldenrod: '#daa520',
  gold: '#ffd700',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavenderblush: '#fff0f5',
  lavender: '#e6e6fa',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  transparent: '#00000000',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
}.omap(c => (new HEXobj(c)).rgb);

class NamedColorObj {
  constructor(color) {
    this.color = color;
    this.rgb = this.to_rgb();
  }

  to_rgb() {
    return NAMED_COLORS[this.color];
  }

  toString() {
    return this.color;
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

export const HEX = hex => new HEXobj(hex);
export const HSL = (h, s = 100, l = 50, a = 255) => new HSLObj(h, s, l, a);
export const HSLA = HSL;
export const HSV = (h, s = 100, v = 100, a = 255) => new HSVObj(h, s, v, a);
export const HSVA = HSV;

export const TRANSPARENT = Object.freeze('transparent');

const rgb_regex = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
const hsl_regex = /^hsl\s*\(\s*(\d+)\s*,\s*(\d+(\%)?)\s*,\s*(\d+(\%)?)\s*\)$/i;
const rgba_regex = /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([+-]?\d+(\.\d+)?)\s*\)$/i;
const hsla_regex = /^hsla\s*\(\s*(\d+)\s*,\s*(\d+(\%)?)\s*,\s*(\d+(\%)?)\s*,\s*([+-]?\d+(\.\d+)?)\s*\)$/i;
const hex_regex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const trans_regex = /^transparent$/i;

export const to_rgb = c => {
  let match = null;

  if (type(c) === 'string') {
    // Check rgb
    match = (
      c.match(rgb_regex)  ||
      c.match(rgba_regex)
    );
    if (match) {
      if (match[4]) {
        alpha = 255 * parseFloat(match[4]);
      }
      return RGBA(...([match[1], match[2], match[3]].map(parseFloat)), alpha);
    }
    // Check hsl
    match = (
      c.match(hsl_regex)  ||
      c.match(hsla_regex)
    );
    if (match) {
      if (match[4]) {
        alpha = 255 * parseFloat(match[4]);
      }
      return HSLA(...([match[1], match[2], match[3]].map(parseFloat)), alpha).rgb;
    }
    // Check hex
    match = c.match(hex_regex);
    if (match) {
      return HEX(c).rgb;
    }
    return Color(c).rgb;
  }

  return c.rgb;
};

export const to_rgba = to_rgb;

// Implements and manages every rendered shape seen.
class Shape {
  constructor(name, canvas) {
    this.name = name;
    this.canvas = canvas;
    this.primitive = null;

    this.vertices = [];
    this.center = null;
    this.transformation = new DOMMatrix();
    this.hollow = false;

    this._stroke_changed = false;
    this._last_stroke_color = null;
    this._stroke_colors = {};
  }

  flesh() {
    this.canvas.context.fill();
    this.canvas.context.stroke();
    return this;
  }

  style(fill = this.canvas.fill,
        stroke = this.canvas.stroke,
        stroke_weight = this.canvas.stroke_weight,
        stroke_cap = this.canvas.stroke_cap,
        stroke_dash = this.canvas.stroke_dash) {
    if (stroke_weight === 0) {
      stroke = TRANSPARENT;
    }
    const c = this.canvas.context;
    c.fillStyle = (this.hollow) ? TRANSPARENT : fill.toString();
    c.strokeStyle = stroke.toString();
    c.lineWidth = stroke_weight;
    c.lineCap = stroke_cap;
    c.setLineDash(stroke_dash);
    return this;
  }

  point(point, color = this.canvas.stroke) {
    return this.canvas.color(point, color);
  }

  prepend_vertex(point, y = null) {
    if (y !== null) {
      if (Number.isNaN(point) || Number.isNaN(y)) {
        return this;
      }
      point = Point(point, y);
    }

    if (Number.isNaN(point.x) || Number.isNaN(point.y)) {
      return this;
    }

    // Shift every stroke color index up one:
    // Make a new record of colors with each index shifted +1.
    const new_stroke_colors = {};
    for (const i in this._stroke_colors) {
      new_stroke_colors[i + 1] = this._stroke_colors[i];
    }
    this._stroke_colors = new_stroke_colors;
    this._record_stroke_color(1);

    this.center = point;
    const next = [point.x, point.y];
    this.vertices.unshift(next);
    return this;
  }

  vertex(point, y = null) {
    if (y !== null) {
      if (Number.isNaN(point) || Number.isNaN(y)) {
        return this;
      }
      point = Point(point, y);
    }

    if (Number.isNaN(point.x) || Number.isNaN(point.y)) {
      return this;
    }

    if (this.vertices.length === 0) {
      this.vertices.push([point.x, point.y]);
      this.center = point;
      return this;
    }

    this._record_stroke_color(this.vertices.length);

    this.vertices.push([point.x, point.y]);
    return this;
  }

  _record_stroke_color(index) {
    const current_stroke_color = this.canvas.stroke.valueOf();
    const stroke_changed = this._last_stroke_color !== current_stroke_color;
    if (stroke_changed) {
      this._stroke_colors[index] = current_stroke_color;
      this._last_stroke_color = current_stroke_color;

      if (this._last_stroke_color !== null) this._stroke_changed = true;
    }
  }

  rect(point, w, h, fill = this.canvas.fill, stroke = this.canvas.stroke) {
    this.center = point;
    this.style(fill, stroke);
    const c = this.canvas.context;

    this.primitive = () => c.rect(point.x, point.y, w, h);
  }

  arc(p, r, angle_0, angle_1, cw=true) {
    this.center = point;
    const c = this.canvas.context;
    this.primitive = () => c.arc(p.x, p.y, r, angle_0, angle_1, !cw);
  }

  ellipse(point, w, h, fill = this.canvas.fill, stroke = this.canvas.stroke) {
    this.center = point;
    this.style(fill, stroke);
    const c = this.canvas.context;

    this.primitive = () =>
      c.ellipse(point.x, point.y, w, h, 0, 0, Math.TAU);
  }

  close() {
    this.vertex(...this.vertices[0]);
    return this;
  }

  fill(color = null) {
    let temp_color = color;
    if (temp_color === null) {
      temp_color = this.canvas.fill;
    }
    if (this.vertices.length < 2 && this.primitive === null) {
      return this;
    }

    let no_fill = false;
    if (this.hollow
    || (this.primitive === null && this.vertices.length < 3)
    || to_rgb(temp_color).a === 0) {
      temp_color = TRANSPARENT;
      no_fill = true;
    }

    const ctx = this.canvas.context;
    if (this.primitive === null && this.vertices.length > 0) {
      // Non-primitive shape defined by explicit vertices.
      // How we render the shape depends on if the storke changes.
      if (this._stroke_changed) {
        // If the stroke changes, first do a fill with no storke,
        // then do the special individual strokes.
        if (!no_fill) {
          // Fill in body of shape without stroke.
          let first = true;
          ctx.beginPath();
          for (const vertex of this.vertices) {
            if (vertex) {
              // Move-to on first vertex, otherwise line-to.
              if (first) {
                first = false;
                ctx.moveTo(...vertex);
              } else ctx.lineTo(...vertex);
            }
          }
          this.style(temp_color, TRANSPARENT);
          this.flesh();
        }
        // Stroke individual small paths.
        let current_stroke_color = this.canvas.stroke;
        let last_vetrex = null;
        let vertex_index = 0;
        for (const vertex of this.vertices) {
          ++vertex_index;
          // Set stroke color when/if it changes
          if (vertex_index in this._stroke_colors) {
            current_stroke_color = this._stroke_colors[vertex_index];
          }
          if (vertex) {
            if (last_vetrex === null) { last_vetrex = vertex; continue; }
            ctx.beginPath();
            ctx.moveTo(...last_vetrex);
            ctx.lineTo(...vertex);
            this.stroke(current_stroke_color);
            last_vetrex = vertex;
          }
        }
      } else {
        // Stroke doesn't change, just draw a path and flesh it out.
        let first = true;
        ctx.beginPath();
        for (const vertex of this.vertices) {
          if (vertex) {
            // Move-to on first vertex, otherwise line-to.
            if (first) {
              first = false;
              ctx.moveTo(...vertex);
            } else ctx.lineTo(...vertex);
          }
        }
        this.style(temp_color);
        this.flesh();
      }
    } else if (this.primitive !== null) {
      // Primitive shape.
      ctx.beginPath();
      ctx.save()
      const { a, b, c, d, e, f } = this.transformation;
      ctx.transform(a, b, c, d, e, f);
      this.primitive();
      this.style(temp_color);
      this.flesh();
      ctx.restore();
    }

    return this;
  }

  stroke(color = this.canvas.stroke) {
    this.style(RGBA(0, 0), color);
    this.flesh();
    return this;
  }

  render(...args) { this.fill(...args); }

  rotate(theta, origin = this.center) {
    const degrees = 180 * theta / Math.PI;
    this.transformation.translateSelf(origin.x, origin.y);
    this.transformation.rotateSelf(degrees);
    this.transformation.translateSelf(-origin.x, -origin.y);
    if (this.primitive !== null)
      return this;

    for (let i = 0; i < this.vertices.length; i++)
      if (this.vertices[i] !== undefined)
        this.vertices[i] = this.vertices[i].rotate(theta, origin.array);
    return this;
  }

  translate(x, y=null) {
    if (y === null)
      [x, y] = [x.x, x.y];
    if (this.center)
      this.center = this.center.add(P(x, y));
    this.transformation.translateSelf(x, y, 0);

    for (let v of this.vertices)
      if (v !== undefined)
        [v[0], v[1]] = [v[0] + x, v[1] + y];
    return this;
  }

  scale(w, h = null, origin = this.center) {
    if (h === null) h = w;
    this.transformation.scaleSelf(w, h, 1, origin.x, origin.y, 1);

    for (let v of this.vertices)
      if (v) [v[0], v[1]] = [
        origin.x + w * (v[0] - origin.x),
        origin.y + h * (v[1] - origin.y)
      ];
    return this;
  }
}

// Main Canvas class:
// --> First point of abstraction away from the standard canvas.
class Canvas {
  constructor(elem) {
    this.elem = elem;

    this.elem.width  = this.elem.width || 400;
    this.elem.height = this.elem.height || 400;
    this._width  = this.elem.width;
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
    this.scale_canvas();

    // Main API properties.
    this.fill = RGBA(255, 255, 255, 0);
    this.stroke = RGB(0, 0, 0);
    this._stroke_dash = [];
    this._stroke_weight = 1;
    this.stroke_cap = 'butt';
    this.font = '16px sans-serif';
    this.text_align = 'left';
    this._mouse_position = Point(NaN, NaN);
    this._mouse_listen = undefined;
    this._context_was_dpi_scaled = false;
    this._dpi_scale_ratio = 1;

    // Used for coördinate calculations.
    this.corner = {x: 0, y: 0};
    this.stretch = [1, 1];

    // Saved properties of the objects state at a certain time.
    this.state_stack = [];

    this.shapes = {};  // All shapes displayed on the canvas.
    this.update = () => { };  // Lambda for when drawing a frame.
  }

  // HiDPI canvas scaling to avoid pixilated appearance.
  scale_canvas(rescale=false) {
    if (typeof window === 'undefined') return;

    const pixel_ratio = window.devicePixelRatio || 1;

    const backing_store_ratio =
         this.context.webkitBackingStorePixelRatio
      || this.context.mozBackingStorePixelRatio
      || this.context.msBackingStorePixelRatio
      || this.context.oBackingStorePixelRatio
      || this.context.backingStorePixelRatio
      || 1;

    const ratio = pixel_ratio / backing_store_ratio;

    if (pixel_ratio !== backing_store_ratio) {
      // enlarge canvas by ratio
      this.elem.width = this._width * ratio;
      this.elem.height = this._height * ratio;
      // scale it back down with CSS
      this.elem.style.width = this._width + 'px';
      this.elem.style.height = this._height + 'px';
    }
    else {
      // normal 1:1 device; don't scale
      this.elem.width = this._width;
      this.elem.height = this._height;
      this.elem.style.width = '';
      this.elem.style.height = '';
    }

    // scale drawing back to normal proportions
    // (only do this once)
    if (rescale || !this._context_was_dpi_scaled) {
      this._context_was_dpi_scaled = true;
      this._dpi_scale_ratio = ratio;
      this.context.scale(ratio, ratio);
    }
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
    this.scale_canvas();
    this.update_context();
  }

  set height(h) {
    this.elem.height = h;
    this._height = h;
    this.scale_canvas();
    this.update_context();
  }

  get stroke_dash() {
    return this._stroke_dash;
  }

  set stroke_dash(d) {
    this.context.setLineDash(d);
    this._stroke_dash = d;
  }

  get stroke_weight() {
    return this._stroke_weight / Math.max(...(this.stretch).map(e => Math.abs(e)));
  }

  set stroke_weight(w) {
    this.context.lineWidth = w;
    this._stroke_weight = w;
  }

  get mouse() {
    if (this._mouse_listen === undefined) {
      this._mouse_listen = this.elem.addEventListener('mousemove', evt => {
        const rect = this.elem.getBoundingClientRect();
        const userCoordinates = this.context.getTransform();
        userCoordinates.invertSelf();
        const p = new DOMPoint(
          (evt.clientX - rect.left) * this._dpi_scale_ratio,
          (evt.clientY - rect.top)  * this._dpi_scale_ratio,
        ).matrixTransform(userCoordinates);
        this._mouse_position = Point(p.x, p.y);
      });
    }
    return this._mouse_position;
  }

  break() {
    this._break = true;
  }

  update_context() {
    this.context = this.elem.getContext('2d');
    this.image_data = this.context.getImageData(0, 0, this.width, this.height);
    this.data = this.image_data.data;
    this.scale_canvas(true);
  }

  dimensions(w, h) {
    this.width = w;
    this.height = h;
    this.update_context();
  }

  translate(x, y) {
    [this.corner.x, this.corner.y] = [this.corner.x - x, this.corner.y - y];
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
    _construction(SHAPE);

    return SHAPE;
  }

  render(...args) {
    let shape = null;
    if (args[0] instanceof Shape) shape = args[0];
    else                          shape = this.shape(...args);
    shape.fill();
    return shape;
  }

  text(string, point, font = this.font, fill = this.fill, stroke = this.stroke) {
    const c = this.context;

    c.font = font;
    c.textAlign = this.text_align;
    c.fillStyle = fill;
    c.lineWidth = this.stroke_weight;
    if (this.stroke_weight === 0)
      stroke = TRANSPARENT;
    c.strokeStyle = stroke;
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

    if (canvas._break) return;
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
    this._break = false;
    this.shapes = {};
    this.update = update;
    this.frame = 1;
    window.requestAnimationFrame(() => this.update_frame(this));
  }
}



// Create new `Canvas` instance in various ways.
export const canvas = elem => new Canvas(elem);

export const canvas_id = id => (
  canvas(document.getElementById(id))
);

export const canvas_new = (id, parent_selector = 'body') => {
  created = document.createElement('canvas');
  created.id = id;

  document.querySelector(parent_selector).appendChild(created);
  return canvas_id(id);
};
