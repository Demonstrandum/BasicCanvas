export const rectangle = (point, w, h, fill=null, stroke=null) => {
  return (shape) => {
    let f = fill || shape.canvas.fill;
    let s = stroke || shape.canvas.stroke
    shape.rect(point, w, h, f, s)
  };
};
