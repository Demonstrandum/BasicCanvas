import {canvas, css, Point, HEX, HSLA} from '../lib/BasicCanvas.js';
import {ellipse, line} from '../lib/BasicShapes.js';

const [sin, cos] = [Math.sin, Math.cos];  // Since we're using them so often.

const G = 9.81 / 60;  // 60 Hz refreshrate compensation.
const [m_1, m_2] = [10, 5];
const [L_1, L_2] = [100, 80];

/*
  Theta — (ϑ) is angular displacement (angle from the y-axis).
  Omega — (ω) is angular velocity, the rate of change of angular displacement.
  Alpha — (α) is angular acceleration, the rate of change of angular velocity.

  This is clearly akin to standard "displacement - velocity - acceleration",
  each being the rate of change (or the derivative with respect to time) of
  the other before itself.

  Thus, for each smallest increment of time:
    ω(t) = ω(t-1) + α(t)
    ϑ(t) = ϑ(t-1) + ω(t)    (Here, the unit for time is also the smallest
                             increment possible of time.)

  where α(t) actually, in this simulation, relies on the current:
  angles, masses, distances from the origin, etc.
*/

let [ϑ_1, ϑ_2] = [Math.PI, Math.PI + 0.2].map(e => e + Math.random() - 0.5);
let [ω_1, ω_2] = [0.001, 0.0];

const α_1 = () => (
  -G * (2 * m_1 + m_2) *
  sin(ϑ_1) - m_2 * G *
  sin(ϑ_1 - 2 * ϑ_2) - 2 * sin(ϑ_1 - ϑ_2) * m_2 *
  (ω_2 * ω_2 * L_2 + ω_1 * ω_1 * L_1 * cos(ϑ_1 - ϑ_2))
) / (L_1 * (2 * m_1 + m_2 - m_2 * cos(2 * ϑ_1 - 2 * ϑ_2)));

const α_2 = () => (
  2 * sin(ϑ_1 - ϑ_2) *
  (ω_1 * ω_1 * L_1 * (m_1 + m_2) +
  G * (m_1 + m_2) * cos(ϑ_1) +
  ω_2 * ω_2 * L_2 * m_2 * cos(ϑ_1 - ϑ_2))
) / (L_2 * (2 * m_1 + m_2 - m_2 * cos(2 * ϑ_1 - 2 * ϑ_2)));

const sketch = canvas(document.getElementById('sketch'));
[sketch.width, sketch.height] = [400, 400];
sketch.translate(sketch.width / 2, sketch.height / 3);

// Add some equations to the page:
document.body.html`
  <p id="equ">
    \begin{align}
      \alpha &= \frac{d^2\theta}{dt^2}\textrm{ / rad s$^{-2}$} \\
      \omega &= \frac{d\theta}{dt}\textrm{ / rad s$^{-1}$ } \\
      \theta &= \textrm{angular displacement}\textrm{ / rad} \\
    \end{align}
    <br/>
    \begin{align}
      \alpha_1 &= \frac{-g(2m_1 + m_2)\sin \theta_1 - m_2 g \sin(\theta_1 - 2\theta_2) - 2\sin(\theta_1 - \theta_2)m_2({\omega_2}^2L_2+{\omega_1}^2L_1\cos(\theta_1 - \theta_2))}{L_1(2m_1 + m_2 - m_2 \cos(2\theta_1 - 2\theta_2))}
      \\\\
      \alpha_2 &= \frac{2\sin(\theta_1 - \theta_2)({\omega_1}^2L_1(m_1+m_2)+g(m_1+m_2)\cos\theta_1 + {\omega_2}^2L_2m_2\cos(\theta_1 - \theta_2))}{L_1(2m_1 + m_2 - m_2 \cos(2\theta_1 - 2\theta_2))}
    \end{align}
  </p>
`;
css`
  #equ {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-bottom: 40px;
    margin-top: ${sketch.height}px;
  }
`;

const BG = HEX('#dfcbeb');
sketch.stroke_cap = 'round';

let coord_1 = Point(0, L_1);
let coord_2 = Point(0, L_1 + L_2);
const trail = [];

sketch.loop(() => {
  sketch.background(BG);
  sketch.fill = 'transparent';
  sketch.render('trail', shape => {
    sketch.stroke_weight = 1;
    let alpha = 1;
    for (const point of trail) {
      sketch.stroke = HSLA(alpha * (360 / 255), 100, 50, alpha);
      shape.vertex(point);
      alpha += 1;
    }
  });
  if (trail.length > 255) {
    trail.shift();  // We'll start deleting the end of the trail at this point.
  }

  sketch.stroke_weight = 2.5;
  sketch.fill = HEX('#000000aa');
  sketch.stroke = HEX('#000');
  sketch.render('origin', ellipse(Point(0, 0), 3));
  sketch.render('harnes', line(Point(0, 0), coord_1));
  sketch.render('bob_1', ellipse(coord_1,  m_1));
  sketch.render('link', line(coord_1, coord_2));
  sketch.render('bob_2', ellipse(coord_2, m_2));

  coord_1 = Point(
    L_1 * sin(ϑ_1),
    L_1 * cos(ϑ_1)  // We're taking angles from the y-axis this time.
  );
  coord_2 = Point(
    L_2 * sin(ϑ_2) + coord_1.x,
    L_2 * cos(ϑ_2) + coord_1.y
  );

  ω_1 += α_1();
  ω_2 += α_2();
  ϑ_1 += ω_1;
  ϑ_2 += ω_2;

  trail.push(coord_2);
});
