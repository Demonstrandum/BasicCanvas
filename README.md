# BasicCanvas
## Run
First clone:
```sh
git clone https://github.com/Demonstrandum/BasicCanvas.git
cd BasicCanvas
```
then run with:
```sh
./server.sh
```
And go to http://localhost:8000/example/ (for an example file, see the index.html code to switch example).

## Usage
TODO: Instructions on usage, for now look at the example files (and/or source files), still a small project.

## Example
Drawing a simple sinusoidal progressive wave:
```js
import * as BC from '../lib/BasicCanvas.js';
// Make sure you get the path correct.

let sketch = BC.canvas_id('sketch'); // Gets canvas with id="sketch"
sketch.dimensions(400, 400);

sketch.stroke = BC.Color(0);
sketch.stroke_weight = 3;
sketch.stroke_cap = 'round';


let i = 0;
sketch.loop(() => {
  sketch.background(BC.Color(255, 255, 110));

  sketch.shape('sine', (shape) => {
    for (let x = 0; x < 3*Math.PI; x += 0.1)
      shape.vertex(BC.Point(32*x + 50, 32*Math.sin(i)*Math.sin(x+j+i) + 100 + 30*j));
  });

  i += 0.1;
});
```
Make sure the relative path to the BasicCanvas.js file is correct.

If the above file is called something like `sine_wave.js` then the `index.html` file (in the same folder) should look something like:
```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Simple Sinusoidal Wave</title>
  </head>
  <body>
    <canvas id="sketch"></canvas>
    <script src="sine_wave.js" type="module" charset="utf-8"></script>
  </body>
</html>

```
