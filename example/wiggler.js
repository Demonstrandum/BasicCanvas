import * as BC from '../lib/BasicCanvas.js';
import { ellipse, polygon } from '../lib/BasicShapes.js';

const canvas = BC.canvas_id('sketch');
BC.load_font('6809', 'url(/example/6809.ttf)');
const chomp   = new Audio('https://freesound.org/data/previews/270/270342_5123851-lq.mp3');
const achieve = new Audio('https://freesound.org/data/previews/270/270331_5123851-lq.mp3');
const death   = new Audio('https://freesound.org/data/previews/190/190843_3296616-lq.mp3');

BC.css`body, html { overflow: hidden; }`;
canvas.dimensions(window.innerWidth, window.innerHeight);
canvas.stroke_cap = 'round';

class Snake {
  constructor(name) {
    this.name = name;
    this.width = 10;

    this.initial = [BC.Point(100, canvas.height / 2)];
    this.body = this.initial.map(clone).slice();

    this.direction = [1, 0];
    this.speed = 4;

    this.grow();
  }

  die() {
    death.load();
    death.play();
    this.body = this.initial.map(clone).slice();
    this.direction = [1, 0];
    this.speed = 4;

    this.grow();
  }

  grow() {
    if (this.body.length < 2) {
      const vel = BC.Point(...this.direction);
      const tail = BC.Point(2 * this.width, 2 * this.width).mul(vel);
      this.body.push(this.body[0].sub(tail));
      return;
    }
    const last = this.body.length - 1;
    const delta = this.body[last - 1].sub(this.body[last]);
    const new_snakelet = this.body[last].sub(delta);
    this.body.push(new_snakelet);
  }

  move() {
    let previous = this.body[0];
    this.body[0].x += this.speed * this.direction[0];
    this.body[0].y += this.speed * this.direction[1];

    for (const snakelet of this.body.slice(1)) {
      let delta = previous.sub(snakelet);
      delta = delta.sub(delta.unit().scale(2 * this.width));
      snakelet.x += delta.x;
      snakelet.y += delta.y;
      previous = clone(snakelet);
    }
  }

  intersecting() {
    const head = this.body[0];
    if ((head.x + this.width >= canvas.width) ||
    (head.x - this.width <= 0) ||
    (head.y + this.width >= canvas.height) ||
    (head.y - this.width <= 0)) {
      this.die();
      return true;
    }
    for (const snakelet of this.body.slice(2)) {
      const dist = head.sub(snakelet).mag();
      if (dist <= 2 * this.width) {
        this.die();
        return true;
      }
    }
    return false;
  }

  show(frame = 0) {
    canvas.stroke_weight = 4;
    canvas.fill = BC.RGBA(255, 100);
    let wheel = 0;
    for (const snakelet of this.body) {
      canvas.stroke = BC.HSL(10 * frame * this.speed / 4 - wheel, 100, 70);
      canvas.render(ellipse(snakelet, this.width));
      wheel += 180 / this.body.length;
    }

    canvas.stroke_weight = 1;
    canvas.fill = '#fff';
    canvas.stroke = '#222';

    canvas.text_align = 'center';
    canvas.font = '100px \'6809\'';
    canvas.text(this.body.length - 1, BC.Point(canvas.width / 2, 100));
  }
}

const snake = new Snake('Mr. Wiggles');

BC.key_down(event => {
  if        (event.key === 'ArrowUp'   && snake.direction[1] !==  1) {
    snake.direction = [0, -1];
  } else if (event.key === 'ArrowDown' && snake.direction[1] !== -1) {
    snake.direction = [0, 1];
  } else if (event.key == 'ArrowRight' && snake.direction[0] !== -1) {
    snake.direction = [1, 0];
  } else if (event.key == 'ArrowLeft'  && snake.direction[0] !==  1) {
    snake.direction = [-1, 0];
  }
});

let apple = null;
const flash = 20;
const padding = 60;

canvas.loop(frame => {
  canvas.background('#fff');

  const overlapping = true;
  while (apple === null) {
    apple = BC.Point(padding + Math.random() * (canvas.width  - 2 * padding),
      padding + Math.random() * (canvas.height - 2 * padding));
    for (const snakelet in snake.body) {
      const distance = apple.sub(snakelet).mag();
      if (distance <= 2 * snake.width + 50) {
        apple = null;
        break;
      }
    }
  }

  canvas.stroke_weight = 3;

  const strength = (frame % flash > flash / 2) ? '9' : '3';
  canvas.stroke = `#f${strength.repeat(2)}`;
  canvas.fill =   `#f${strength.repeat(2)}6`;
  canvas.render(polygon(apple, 5, snake.width));

  if (snake.body[0].sub(apple).mag() < 2 * snake.width) {
    snake.grow();

    const sound = ((snake.body.length - 1) % 10 == 0) ? achieve : chomp;
    sound.load();
    sound.play();

    snake.speed += 0.1;
    apple = null;
  }

  snake.move();
  snake.show(frame);
  snake.intersecting();
});
