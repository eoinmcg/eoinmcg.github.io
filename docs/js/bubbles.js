(() => {
	// state
	let c, ctx, W, H;
	let bubbles = [];
	let touches = [];
	let particles = [];

	const MAX_BUBBLES = 20;
	const TARGET_DT = 16.67; // baseline: 60fps frame in ms

	let now = 0;
	let prev = 0;
	let dt = 0;
	let pageName = '';
	let animating = false;

	// init
	document.addEventListener('DOMContentLoaded', () => {
		pageName = getPageName();

		c = document.createElement('canvas');
		c.classList.add('bg-canvas');
		ctx = c.getContext('2d');
		document.body.appendChild(c);

		handleResize();

		if (pageName === '404') {
			activate();
		}
		if (pageName === 'home') {
			window.setTimeout(() => {
				activate();
			}, 10000);

		}
	});

	window.addEventListener('resize', handleResize, false);
	window.addEventListener('mousedown', handlePointer, false);
	window.addEventListener('touchstart', (e) => {
		const t = e.touches[0];
		handlePointer({ clientX: t.clientX, clientY: t.clientY });
	}, { passive: true });

	// helpers
	function getPageName() {
		let name = '';
		document.body.classList.forEach((cls) => {
			if (cls.startsWith('page--')) {
				name = cls.slice('page--'.length);
			}
		});
		return name;
	}

	function handleResize() {
		W = window.innerWidth;
		H = window.innerHeight;
		c.width = W;
		c.height = H;
		c.style.width = W + 'px';
		c.style.height = H + 'px';
	}

	function handlePointer(e) {
		if (!animating) return;
		touches.push(new Touch({ x: e.clientX, y: e.clientY }));
	}


	function activate() {
		scheduleNextBubble();
		startLoop();
	}

	function normalise(dt) {
		return dt / TARGET_DT;
	}

	const Draw = {
		circle(x, y, r, col, strokeCol = null, strokeWidth = 3) {
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
			ctx.clearRect(0, 0, W, H);
		},
	};

	// main loop
	function startLoop() {
		if (animating) return;
		animating = true;
		prev = window.performance.now();
		window.requestAnimationFrame(loop);
	}

	function loop(timestamp) {
		now = timestamp;
		dt = now - prev;

		// Guard against huge dt spikes (tab blur, etc.)
		const safeDt = Math.min(dt, 100);

		Draw.clear();

		for (const bubble of bubbles) {
			bubble.update(safeDt);
			for (const touch of touches) {
				if (collides(touch, bubble)) {
					touch.hit = true;
					explode(bubble.x, bubble.y);
					bubble.reset();
				}
			}
		}

		touches = touches.filter((touch) => {
			touch.update(safeDt);
			return touch.ttl > 0;
		});

		particles = particles.filter((p) => {
			p.update(safeDt);
			return !p.remove;
		});

		prev = now;
		window.requestAnimationFrame(loop);
	}

	function collides(a, b) {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		return dx * dx + dy * dy < (a.r + b.r) * (a.r + b.r);
	}

	class Touch {
		constructor({ x, y }) {
			this.x = x;
			this.y = y;
			this.r = 10;
			this.hit = false;
			this.ttl = 1000;
		}

		update(dt) {
			this.ttl -= dt * 2.5;
			const alpha = Math.max(0, this.ttl / 1000);
			const r = this.r * alpha; // shrink as it fades
			Draw.circle(this.x, this.y, r, `rgba(200, 0, 0, ${alpha})`);
		}
	}

	class Bubble {
		constructor() {
			this.counter = 0;
			this.reset();
		}

		reset() {
			this.counter = 0;
			this.r = Math.random() * 10 + 10;
			this.x = Math.random() * W;
			this.xBase = this.x;
			this.y = H + this.r * 2;
			this.v = (Math.random() + 0.5) / 10;
		}

		update(dt) {
			const n = normalise(dt);
			this.counter += dt * 0.002;

			if (this.y < -this.r * 2) {
				this.reset();
				return;
			}

			this.y -= this.v * dt * n;
			this.x = this.r * 1.7 * Math.sin(this.counter) + this.xBase;

			const opacity = Math.max(0, Math.min(1, this.y / H));
			Draw.circle(
				this.x,
				this.y,
				this.r,
				`rgba(255, 255, 255, ${opacity / 24})`,
				`rgba(255, 255, 255, ${opacity / 16})`
			);
		}
	}

	class Particle {
		constructor(x, y, r = 3) {
			this.x = x;
			this.y = y;
			this.r = r;
			this.remove = false;

			const dir = Math.random() < 0.5 ? 1 : -1;
			this.vx = ~~(Math.random() * 4) * dir;
			this.vy = ~~(Math.random() * 7);
		}

		update(dt) {
			const n = normalise(dt);
			this.x += this.vx * n;
			this.y += this.vy * n;

			this.vx *= Math.pow(0.99, n);
			this.vy *= Math.pow(0.99, n);
			this.vy -= 0.25 * n;

			Draw.circle(this.x, this.y, this.r, 'rgba(255, 255, 255, 0.2)');

			if (this.y < 0) this.remove = true;
		}
	}

	// factories
	function explode(x, y, num = 5) {
		for (let i = 0; i < num; i++) {
			particles.push(new Particle(x, y));
		}
	}

	function scheduleNextBubble() {
		const delay = Math.random() * 5000;
		window.setTimeout(() => {
			if (bubbles.length < MAX_BUBBLES) {
				bubbles.push(new Bubble());
			}
			scheduleNextBubble();
		}, delay);
	}

})();
