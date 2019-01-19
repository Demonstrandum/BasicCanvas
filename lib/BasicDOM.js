import * as BC from './BasicCanvas.js';

export const id_map = new WeakMap();
export let object_count = 0;

export const id = object => {
  if (!id_map.has(object)) {
    id_map.set(object, ++object_count);
  }
  return id_map.get(object);
};

class Input {
  constructor(parent, type) {
    this.parent = parent;
    this.type = this.type;
    this.timeout = 0;

    this.elem = document.createElement('input');
    this.id = id(this.elem);

    this.elem.type = this.type;
    this.elem.className = `BasicDOM-input DOM${this.id}`;
    document.querySelector(this.parent).appendChild(this.elem);
  }

  dismount() {
    return document.querySelector(this.parent).removeChild(this.elem);
  }

  mount(parent = this.parent) {
    return document.querySelector(parent).appendChild(this.elem);
  }

  change(lambda, timeout = this.timeout) {
    if (timeout === 0) {
      return this.elem.addEventListener('input', lambda);
    }

    let timed = null;
    this.elem.addEventListener('keyup', e => {
      clearTimeout(timed);
      timed = setTimeout(lambda, timeout);
    });
  }

  get value() {
    return this.elem.value;
  }

  set value(v) {
    return this.elem.value = v;
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
