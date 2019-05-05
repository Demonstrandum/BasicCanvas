import * as BC from '../lib/BasicCanvas.js';
import {rectangle} from '../lib/BasicShapes.js';

const DIFFICULTY = 4;
let rainbow = false;

const sketch = BC.canvas_id('sketch');
sketch.dimensions(800, 500);
sketch.fill = BC.Color`white`;
sketch.stroke = BC.Color`transparent`;

BC.style(BC.css`
  @font-face {
    font-family: '6809';
    src: url('./6809.ttf');
  }
`);
sketch.font = `70px '6809'`;

const BACKGROUND = BC.RGBA(0, 100);
const [UP, STILL, DOWN] = [1, 0, -1];

class Paddle {
  constructor(speed, position = BC.Point(0, 0)) {
    this.speed = speed;
    this.position = position;
    this.score = 0;
    [this.width, this.height] = [30, 80];
  }

  move(direction, bounds) {
    this.position.y -= this.speed * direction;
    if (this.position.y > bounds.bottom) {
      this.position.y = bounds.bottom;
    }
    if (this.position.y < bounds.top) {
      this.position.y = bounds.top;
    }
  }

  render(canvas) {
    canvas.render(null, rectangle(this.position, this.width, this.height));
  }
}

class Ball {
  constructor(speed, starting) {
    this.start = starting;
    this.position = BC.Point(starting.x, starting.y).floor();
    this.speed = speed;
    this.direction = [-1, -1].map(e => e * speed);
    this.radius = 30;
    this.acceleration = 0.4;
  }

  win(paddle) {
    this.position = BC.Point(this.start.x, this.start.y).floor();
    paddle.score += 1;
    this.direction[0] *= -1;
    this.direction[1] *= (Math.random() > 0.5) ? -1 : 1;
    this.direction = this.direction.map(e => (e / Math.abs(e)) * this.speed);
  }

  bounce(dir) {
    this.position.x += (dir === 'left' ? 1 : -1) * 10;
    this.direction[0] *= -1;

    const reflection = 0.2 * (Math.random() - 0.5);
    this.direction = this.direction.map(
      e => e + (Math.sign(e) * this.acceleration)
    );
    this.direction = this.direction.rotate(reflection);
  }

  move(bounds, paddles) {
    this.position.x += Math.round(this.direction[0]);
    this.position.y += Math.round(this.direction[1]);
    if (this.position.y < bounds.top || this.position.y - this.radius > bounds.bottom) {
      this.direction[1] *= -1;
    }
    if (this.position.x >= paddles[0].position.x &&
        this.position.x < paddles[0].position.x + paddles[0].width &&
        this.position.y + this.radius >= paddles[0].position.y &&
        this.position.y <= paddles[0].position.y + paddles[0].height) {
      this.bounce('left');
    }
    if (this.position.x + 2 * this.radius + 20 < paddles[0].position.x) {
      this.win(paddles[1]);
    }

    if (this.position.x < paddles[1].position.x && this.position.x + this.radius >= paddles[1].position.x &&
        this.position.y + this.radius >= paddles[1].position.y &&
        this.position.y <= paddles[1].position.y + paddles[1].height) {
      this.bounce('right');
    }
    if (this.position.x - 2 * this.radius - 20 > paddles[1].position.x) {
      this.win(paddles[0]);
    }
  }

  render(canvas) {
    canvas.render(null, rectangle(this.position, this.radius, this.radius));
  }
}

BC.click(() => {
  rainbow = !rainbow;
}, sketch);

let direction = STILL;
let follow_ball = STILL;
BC.key_down(event => {
  if (event.key === 'ArrowUp') {
    direction = UP;
  } else if (event.key === 'ArrowDown') {
    direction = DOWN;
  }
});

BC.key_up(() => {
  direction = STILL;
});

const PADDING = 20;
const paddle = new Paddle(12, BC.Point(PADDING, PADDING));
const poodle = new Paddle(12, BC.Point(sketch.width - PADDING - paddle.width, PADDING));
const ball = new Ball(7, BC.Point(sketch.width / 2 - 15, sketch.height / 2 - 15));
const bounds = {top: PADDING, bottom: sketch.height - PADDING - paddle.height};

// Poodle "AI"
setInterval(() => {
  if (ball.position.x < sketch.width / 2 || ball.direction[0] < 0) {
    follow_ball = STILL;
    return;
  }
  if (ball.position.y > poodle.position.y + poodle.height / 4) {
    follow_ball = DOWN;
  } else if (ball.position.y + ball.radius >= poodle.position.y && ball.position.y <= poodle.position.y + poodle.height) {
    follow_ball = STILL;
  } else {
    follow_ball = UP;
  }
}, 800 / DIFFICULTY);

sketch.loop(frame => {
  sketch.fill = rainbow ? BC.HSL(frame * 12) : BC.Color`white`;
  sketch.background(rainbow ? BC.RGB(0, 30) : BACKGROUND);

  poodle.move(follow_ball, bounds);
  paddle.move(direction, bounds);
  ball.move(bounds, [paddle, poodle]);

  sketch.text(paddle.score, BC.Point(sketch.width / 4, 100));
  sketch.text(poodle.score, BC.Point(3 * sketch.width / 4 - 50, 100));

  for (let stripe = 0; stripe < sketch.width / 30; stripe++) {
    sketch.render(null,
      rectangle(BC.Point(sketch.width / 2 - 5, 30 * stripe), 10, 20));
  }

  paddle.render(sketch);
  poodle.render(sketch);
  ball.render(sketch);
});
