import {canvas_id, P, Polar, HEX} from '../lib/BasicCanvas.js'

SIZE   = 15  # n×n grid.
SIDES  = 16  # Pixel length of sides  of each column.
HEIGHT = 70  # Pixel length of height of each column.
SPEED  =  1  # Relative speed of oscilations in heigt of a column.

SQRT_3 = Math.sqrt 3

sketch = canvas_id 'sketch'

sketch.dimensions 500, 500
sketch.translate sketch.width/2, sketch.height/2 + 10
sketch.fill = sketch.stroke = 'transparent'

PALLETE = {
  left:  HEX 0x415484
  right: HEX 0xe6e2b1
  top:   HEX 0x87b9b4
}

Point = Object.getPrototypeOf(P NaN, NaN)
Point.go = Point.add

NORTH_EAST = Polar SIDES, -1*Math.PI/6
NORTH_WEST = Polar SIDES, -5*Math.PI/6
SOUTH_WEST = Polar SIDES,  5*Math.PI/6

column = (point, height) ->
  p0 = point.add P 0, -height/2
  p1 = p0.go NORTH_EAST
  p2 = p1.go NORTH_WEST
  p3 = p2.go SOUTH_WEST
  # Top face
  top = sketch.shape (sub) ->
    sub.vertex p0
    sub.vertex p1
    sub.vertex p2
    sub.vertex p3
    sub.vertex p0
  top.fill PALLETE.top

  q0 = p0.add P 0, height
  q1 = q0.go NORTH_EAST
  # Right face
  right = sketch.shape (sub) ->
    sub.vertex p0
    sub.vertex q0
    sub.vertex q1
    sub.vertex p1
    sub.vertex p0
  right.fill PALLETE.right

  q2 = q0.go NORTH_WEST
  # Left face
  left = sketch.shape (sub) ->
    sub.vertex p0
    sub.vertex q0
    sub.vertex q2
    sub.vertex p3
    sub.vertex p0
  left.fill PALLETE.left


isometric = (x, y) ->
  P SIDES*(x-y)*SQRT_3/2, SIDES*(x+y)/2

distance = (x, y) ->
  x*x + y*y

HALF_SIZE = Math.floor(SIZE / 2)

sketch.loop (frame) ->
  sketch.background HEX 0xfafafa

  for x in [-HALF_SIZE..HALF_SIZE]
    for y in [-HALF_SIZE..HALF_SIZE]
      h = HEIGHT * (1 + Math.sin(SPEED*frame/10 + distance(x,y)/SIZE)) + HEIGHT
      column isometric(x, y), h
