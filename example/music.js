import {canvas, P}  from '../lib/BasicCanvas.js';
import {grid, line} from '../lib/BasicShapes.js';

const s = canvas(document.getElementById('sketch'));

s.dimensions(640, 480);
s.translate(30, s.height / 2);
s.scale(100, 70);

s.stroke = '#fff';
s.font = '14px monospace';

const original = 't*((t-2296&t)>>11)';

let context;
if('webkitAudioContext' in window) {
  context = new webkitAudioContext();
} else {
  context = new AudioContext();
}
const rate = 11025;// Hz
const sample_duration = 40;

const buffer = context.createBuffer(1, sample_duration * rate, rate);
const analyser = context.createAnalyser();

let offset = 0;

const generate = () => {
  const now = buffer.getChannelData(0);
  let t = 0;
  for (let i = 0; i < buffer.length; i++) {
    t = i + offset;
    now[i] = (eval(original) % 256) / 127.5 - 1;
  }

  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(analyser);
  source.connect(context.destination);

  // start the source playing
  source.start();
  offset += buffer.length;
};

setInterval(() => {
  s.background('#000');
  s.render(grid(20, 'night'));

  const freq = new Uint8Array(1000);
  analyser.getByteFrequencyData(freq);

  const amp = freq[0];
  console.log(freq);

  s.render(line(P(0, amp), P(6, amp)));
}, 600);

generate();
setInterval(generate, sample_duration * 1000);
