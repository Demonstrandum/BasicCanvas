export const clone = obj => Object.assign(Object.create(Object.getPrototypeOf(obj)), console);

class PointObj {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	toString() {
		return `(${this.x}, ${this.y})`;
	}

	valueOf() {
		return this.toString();
	}
}

class ColorObj {
	constructor(r, g, b, a) {
		[this.r, this.g, this.b, this.a] = [r, g, b, a];
		this.rgba = [this.r, this.g, this.b, this.a];
		this.rgb = this.rgba.slice(0, -1);
	}

	toString() {
		return `rgba(${this.rgb.join(', ')}, ${this.a / 255})`;
	}

	valueOf() {
		return this.toString();
	}
}

export const Point = (x, y) => {
	return new PointObj(x, y);
};
export const Color = (r, g = -1, b = -1, a = 255) => {
	if (b < 0 && g > 0) { // TODO: Extend Color() and ColorObj to support
		a = g;
	} //       Named colours and hexcodes.
	if (b < 0) {
		[g, b] = [r, r];
	}

	return new ColorObj(r, g, b, a);
};

class Shape {
	constructor(name, canvas) {
		this.shape_name = name;
		this.canvas = canvas;

		this.vertices = [];
	}

	style(
		fill = this.canvas.fill,
		stroke = this.canvas.stroke,
		stroke_weight = this.canvas.stroke_weight,
		stroke_cap = this.canvas.stroke_cap
	) {
		const c = this.canvas.context;
		c.fillStyle = fill.toString();
		c.strokeStyle = stroke.toString();
		c.lineWidth = stroke_weight;
		c.lineCap = stroke_cap;
		return this;
	}

	point(point, color = this.canvas.stroke) {
		return this.canvas.color(point, color);
	}

	vertex(point) {
		if (this.vertices.length === 0) {
			this.vertices.push([point.x, point.y]);
			return point;
		}

		const c = this.canvas.context;
		c.beginPath();
		c.moveTo(...this.vertices[this.vertices.length - 1]);
		const next = [point.x, point.y];
		c.lineTo(...next);
		this.style();
		c.stroke();

		this.vertices.push(next);
		return point;
	}

	rect(point, w, h, fill = this.canvas.fill, stroke = this.canvas.stroke) {
		this.style(fill, stroke);
		const c = this.canvas.context;
		c.fillRect(point.x, point.y, w, h);
		c.rect(point.x, point.y, w, h);
		c.stroke();
	}

	close() {
		this.vertex(Point(...this.vertices[0]));
		return this;
	}

	fill(color = this.canvas.fill) {
		// TODO: Either redraw all vertices and use built-in fill function,
		//       or, implement own fill function (see: https://stackoverflow.com/questions/31799038/filling-a-polygon)

		// redraws all vertices, SLOW and BAD, SAD! (tbh, prolly faster than whatever I'd write)
		const c = this.canvas.context;
		c.moveTo(...this.vertices[0]);
		for (const vertex of this.vertices) {
			c.lineTo(...vertex);
		}
		c.closePath();
		c.fillStyle = color.toString();
		c.fill();
	}
}

class Canvas {
	constructor(elem) {
		this.canvas_elem = elem;
		this.context = elem.getContext('2d');

		this.fill = Color(255, 255, 255);
		this.stroke = Color(0, 0, 0);
		this.stroke_weight = 1;
		this.stroke_cap = 'butt';

		this.shapes = {};
		this.update = () => {};
	}

	update_context() {
		this.context = this.canvas_elem.getContext('2d');
	}

	get width() {
		return this.canvas_elem.width;
	}

	get height() {
		return this.canvas_elem.height;
	}

	set width(w) {
		this.canvas_elem.width = w;
		this.update_context();
	}

	set height(h) {
		this.canvas_elem.height = h;
		this.update_context();
	}

	dimensions(w, h) {
		this.canvas_elem.width = w;
		this.canvas_elem.height = h;
		this.update_context();
	}

	color(point, other = null) {
		if (!other) {
			return Color(...this.context.getImageData(point.x, point.y, 1, 1).data);
		}
		const img_d = this.context.createImageData(1, 1);
		const d = img_d.data;
		[d[0], d[1], d[2], d[3]] = other.rgba;
		this.context.putImageData(img_d, point.x, point.y);
		return other;
	}

	point(point, color = this.stroke) {
		return this.color(point, color);
	}

	shape(name, construction) {
		if (!name) {
			name = `ImplicitShape${Object.keys(this.shapes).length}`;
		}
		this.shapes[name] = {
			construction,
			shape: new Shape(name, this)
		};
		construction(this.shapes[name].shape);
		return this.shapes[name].shape;
	}

	background(c = this.fill) {
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.fillStyle = c.toString();
		this.context.fillRect(0, 0, this.width, this.height);
	}

	update_frame(canvas) {
		canvas.shapes = {};
		(canvas.update)();
		window.requestAnimationFrame(t => {
			canvas.update_frame(canvas);
		});
	}

	loop(update) {
		this.shapes = {};
		this.update = update;
		window.requestAnimationFrame(t => {
			this.update_frame(this);
		});
	}
}

export const canvas = elem => {
	return new Canvas(elem);
};

export const canvas_id = id => {
	return canvas(document.getElementById(id));
};
