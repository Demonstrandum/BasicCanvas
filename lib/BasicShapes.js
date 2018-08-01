export const rectangle = (point, w, h, fill = null, stroke = null) => {
	return shape => {
		const f = fill || shape.canvas.fill;
		const s = stroke || shape.canvas.stroke;
		shape.rect(point, w, h, f, s);
	};
};
