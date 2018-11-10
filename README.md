# BasicCanvas

## Usage
jsdelivr CDN (use this to import):
- Canvas
  ```
  https://cdn.jsdelivr.net/gh/Demonstrandum/BasicCanvas@v1.0.3/lib/BasicCanvas.js
  ```
- Shapes
  ```
  https://cdn.jsdelivr.net/gh/Demonstrandum/BasicCanvas@v1.0.3/lib/BasicShapes.js
  ```

TODO: Instructions on usage, for now look at the example files (and/or source files), still a small project.

## Run Examples
Example hosted with ▲now: [canvas.knutsen.co](https://canvas.knutsen.co/example/)

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

## Example
Drawing a simple sinusoidal progressive wave:
```js
import * as BC from '../lib/BasicCanvas.js';
// Make sure you get the path correct. (You need a web server running for imports to work...)

const sketch = BC.canvas_id('sketch'); // Gets canvas with id="sketch".
sketch.dimensions(400, 400); // Width x Height, canvas size.

sketch.stroke = BC.RGB(0); // Same as BC.RGB(0, 0, 0).
sketch.stroke_weight = 8; // 8px wide.
sketch.stroke_cap = 'round';

sketch.loop(frame => {
  sketch.background(BC.RGB(255, 255, 110)); // Redraw background each frame.

  sketch.shape('sine', shape => { // Create new shape: name, construction of shape callback
    for (let x = 0; x < 3 * Math.PI; x += 0.2) { // Sine curve at this frame
      shape.vertex(BC.Point(32 * x + 50, 32 * Math.sin(x + frame / 10) + 200));
    }
  });
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
Or, you could use the `your_example.js` file found in the example/ folder of the repo.
