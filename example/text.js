import * as BC from '../lib/BasicCanvas.js';

use(BC);

const sketch = canvas_id('sketch');
sketch.dimensions(400, 280);

sketch.fill = '#000';
sketch.stroke = 'transparent';

const google_font = `https://fonts.googleapis.com/css?family=`;

/// / Option 1. built in `FontFace`:
const marker = new FontFace(
  'marker',
  `local('Permanent Marker Regular'), local('PermanentMarker-Regular'), url(https://fonts.gstatic.com/s/permanentmarker/v7/Fh4uPib9Iyv2ucM6pGQMWimMp004La2Cfw.woff2) format('woff2')`
);  // Copied from fonts.google.com stylesheets

marker.load().then(font => document.fonts.add(font));

/// / Option 2. adding CSS:
BC.style(BC.css`
  @font-face {
    font-family: 'Playfair Display SC';
    src: url(https://fonts.gstatic.com/s/playfairdisplaysc/v7/ke85OhoaMkR6-hSn7kbHVoFf7ZfgMPr_lbkMEA.woff2);
  }
`);
// or
// BC.style(BC.css`
//  @import url('https://fonts.googleapis.com/css?family=Playfair+Display+SC');
// `);

/// / Option 3. Builtin:
BC.load_font('6809', 'url(/example/6809.ttf)');

// Then draw:
document.fonts.ready.then(() => {
  sketch.loop(frame => {
    sketch.background('#fff');
    sketch.fill = HSL(frame % 360);
    sketch.stroke = HSLA(
      (frame + 180) % 360,
      100,
      50,
      (Math.sin(frame / 30) ** 2) * 255
    );

    sketch.font = `40px 'marker'`;
    sketch.text('First Option', Point(45, 100));

    sketch.font = `40px 'Playfair Display SC'`;
    sketch.text('Second Option', Point(45, 150));

    sketch.font = `40px '6809'`;
    sketch.text('Better Option', Point(45, 200));
  });
});

