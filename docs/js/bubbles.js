let c,
	ctx,
	W,
	H,
	bubbles = [],
	maxBubbles = 20,
	mpos = { x: 0, y: 0 },
	touches = [],
	particles = [];
let now = 0,
	prev = 0,
	dt = 0;
let pageName = '';

document.addEventListener("DOMContentLoaded", () => {
	pageClass = document.body.classList.forEach((c) => {
		if (c.indexOf('page--') != -1) {
			pageName = c.split('--').pop();
		}
	});
	c = document.createElement("canvas");
	c.classList.add("bg-canvas");
	ctx = c.getContext("2d");
	document.body.appendChild(c);
	handleResize();
	if (pageName === '404') {
		addNextBubble();
		loop();
	}
	loadIcons();
});

window.addEventListener("resize", handleResize, false);
window.addEventListener("mousedown", handleClick, false);

function handleResize() {
	W = window.innerWidth;
	H = window.innerHeight;
	c.width = W;
	c.height = H;
	c.style.width = W;
	c.style.height = H;
}

function handleClick(e) {
	if (pageName !== '404') return;
	let x = e.clientX,
		y = e.clientY;
	if (!touches.length) {
		touches.push(new Touch({ x, y }));
	}
}

const Draw = {
	circle(x, y, r, col, strokeCol = false, strokeWidth = 3) {
		ctx.beginPath();
		ctx.arc(~~x, ~~y, ~~r, 0, 2 * Math.PI, false);
		ctx.fillStyle = col;
		ctx.fill();
		if (strokeCol) {
			ctx.lineWidth = strokeWidth;
			ctx.strokeStyle = strokeCol;
			ctx.stroke();
		}
	},
	clear() {
		if (!ctx) return;
		ctx.clearRect(0, 0, W, H);
	},
};

const loop = () => {
	now = window.performance.now();
	dt = now - prev;
	Draw.clear();
	bubbles.forEach((bubble) => {
		bubble.update(dt);
		touches.forEach((t) => {
			if (collides(t, bubble)) {
				t.hit = true;
				explode(bubble.x, bubble.y);
				bubble.reset();
			}
		});
	});
	touches.forEach((touch, i) => {
		touch.update(dt);
		if (touch.ttl < 0) {
			touches.splice(i, 1);
		}
	});
	particles.forEach((p, i) => {
		p.update(dt);
		if (p.remove) {
			particles.splice(i, 1);
		}
	});
	prev = now;
	window.requestAnimationFrame(loop);
};

function collides(a, b) {
	const dSq = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);

	const rSq = (a.r + b.r) * (a.r + b.r);

	return dSq < rSq;
}

class Touch {
	constructor(o) {
		this.x = o.x;
		this.y = o.y;
		this.r = 10;
		this.hit = false;
		this.ttl = 1000;
	}

	update(dt) {
		this.ttl -= dt * 2.5;
		let col = `rgba(200, 0, 0, ${this.ttl / 1000})`;
		Draw.circle(this.x, this.y, this.r, col);
	}
}

class Bubble {
	constructor(o) {
		this.reset(o);
	}

	reset(o) {
		this.counter = 0;
		this.r = Math.random() * 10 + 10;
		this.x = Math.random() * window.innerWidth;
		this.xBase = this.x;
		this.y = H + this.r * 2;
		this.v = (Math.random() + 0.5) / 10;
		this.col = "rgba(255, 255, 255, 0.15)";
		this.strokeCol = "rgba(255, 255, 255, 0.2)";
	}

	update(dt) {
		this.counter += dt * 0.002;
		if (this.y < -this.r * 2) this.reset();
		const opacity = ~~((this.y / H) * 100) / 100;

		this.y -= this.v * dt;
		this.x = this.r * 1.7 * Math.sin(this.counter) + this.xBase;

		const col = `rgba(255, 255, 255, ${opacity / 24})`;
		const strokeCol = `rgba(255, 255, 255, ${opacity / 16})`;
		Draw.circle(this.x, this.y, this.r, col, strokeCol);
	}
}

class Particle {
	constructor(x, y, r = 3) {
		this.x = x;
		this.y = y;
		this.r = r;

		this.col = `rgba(255, 255, 255, 0.2)`;
		this.remove = false;

		this.dir = ~~(Math.random() * 2);
		this.dir = this.dir ? 1 : -1;

		this.vx = ~~(Math.random() * 4) * this.dir;
		this.vy = ~~(Math.random() * 7) * 1;
	}

	update(dt) {
		this.x += this.vx;
		this.y += this.vy;

		this.vx *= 0.99;
		this.vy *= 0.99;

		this.vy -= 0.25;

		Draw.circle(this.x, this.y, this.r, this.col);

		if (this.y < 0) {
			this.remove = true;
		}
	}
}

function explode(x, y, num = 5) {
	while (num--) {
		particles.push(new Particle(x, y));
	}
}

function loadIcons() {
	document.querySelectorAll('ul.onthewebs li').forEach((el) => {
		const a = el.querySelector('a')	;
		const svg = document.querySelector('#svgs .'+el.className).innerHTML;
		a.innerHTML = svg;
	});
}

function addNextBubble() {
	let rnd = Math.random() * 5000;
	window.setTimeout(() => {
		let min = 10;
		let max = window.innerWidth - 10;
		bubbles.push(new Bubble());
		addNextBubble();
	}, rnd);
}
