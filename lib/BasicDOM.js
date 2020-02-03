import * as BC from './BasicCanvas.js';

export const id_map = new WeakMap();
export let object_count = 0;

export const id = object => {
  if (!id_map.has(object)) {
    id_map.set(object, ++object_count);
  }
  return id_map.get(object);
};

BC.css`.hidden {
  position: absolute;
  height: 0;
  overflow: hidden;
  white-space: pre;
  z-index: -99;
}`

class Input {
  constructor(parent, type) {
    this.parent = parent;
    this.type = type;
    this.timeout = 0;

    this.elem = document.createElement('input');
    this.id = id(this.elem);
    this.hidden = null;
    this.lambda = null;

    this.elem.type = this.type;
    this.elem.className = 'BasicDOM-input';
    this.elem.id = `BD-DOM-${this.id}`;
    document.querySelector(this.parent).appendChild(this.elem);
  }

  dismount() {
    return document.querySelector(this.parent).removeChild(this.elem);
  }

  mount(parent = this.parent) {
    return document.querySelector(parent).appendChild(this.elem);
  }

  resize(self=this) {
    if (self.hidden !== null) {
      self.hidden.textContent = self.value;
      self.elem.style.width = `${self.hidden.offsetWidth + 4}px`;
    }
  }

  // Fit content.
  fit() {
    const hidden = document.createElement("span");
    hidden.setAttribute('class', 'hidden');
    hidden.textContent = this.value;
    document.body.appendChild(hidden);
    this.hidden = hidden;

    this.resize(this);
    this.elem.addEventListener('input', () => this.resize(this));
    return this;
  }

  update() {
    if (this.lambda !== null) this.lambda();
    if (this.hidden === null) this.fit();
    else this.resize(this);
  }

  change(lambda, timeout = this.timeout) {
    this.lambda = lambda;

    if (timeout === 0) {
      return this.elem.addEventListener('input', lambda);
    }

    let timed = null;
    this.elem.addEventListener('input', () => {
      clearTimeout(timed);
      timed = setTimeout(lambda, timeout);
    });
    return this;
  }

  get value() {
    return this.elem.value;
  }

  set value(v) {
    this.elem.value = v;
  }
}

export const input = (type = 'text', parent = 'body', value = '') => {
  const in_obj = new Input(parent, type);
  in_obj.value = value;
  return in_obj;
};

export const text = (parent = 'body', value = '') => {
  const in_obj = new Input(parent, 'text');
  in_obj.value = value;
  return in_obj;
};
