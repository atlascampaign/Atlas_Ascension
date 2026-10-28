// Campo di stelle animato (scintillio, deriva lenta con parallasse, stelle cadenti) dietro la pagina principale.
(function () {
    var container = document.getElementById('container');
    if (!container) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'bg-stars';
    container.insertBefore(canvas, container.firstChild);
    var ctx = canvas.getContext('2d');

    var stars = [];
    var shooting = null;
    var nextShot = performance.now() + 4000;
    var w, h, dpr;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        var count = Math.round(w * h / 6000);
        stars = [];
        for (var i = 0; i < count; i++) {
            var depth = Math.random(); // 0 = lontana, 1 = vicina
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: 0.3 + depth * 1.3,
                speed: 1.5 + depth * 6, // px al secondo
                phase: Math.random() * Math.PI * 2,
                twinkle: 0.6 + Math.random() * 1.8,
                hue: Math.random() < 0.3 ? 300 + Math.random() * 40 : 220 + Math.random() * 40
            });
        }
    }

    function spawnShootingStar(now) {
        var fromLeft = Math.random() < 0.5;
        shooting = {
            x: fromLeft ? Math.random() * w * 0.5 : w * 0.5 + Math.random() * w * 0.5,
            y: Math.random() * h * 0.4,
            vx: (fromLeft ? 1 : -1) * (500 + Math.random() * 300),
            vy: 250 + Math.random() * 200,
            life: 0,
            max: 0.9 + Math.random() * 0.4
        };
        nextShot = now + 6000 + Math.random() * 9000;
    }

    var last = performance.now();
    function frame(now) {
        var dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        ctx.clearRect(0, 0, w, h);

        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.x -= s.speed * dt;
            if (s.x < -2) { s.x = w + 2; s.y = Math.random() * h; }
            var a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(now / 1000 * s.twinkle + s.phase));
            ctx.beginPath();
            ctx.fillStyle = 'hsla(' + s.hue + ', 80%, 85%, ' + a.toFixed(3) + ')';
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        if (!shooting && now > nextShot) spawnShootingStar(now);
        if (shooting) {
            shooting.life += dt;
            shooting.x += shooting.vx * dt;
            shooting.y += shooting.vy * dt;
            var t = shooting.life / shooting.max;
            if (t >= 1) {
                shooting = null;
            } else {
                var alpha = Math.sin(Math.PI * t);
                var len = 0.08;
                var grad = ctx.createLinearGradient(
                    shooting.x, shooting.y,
                    shooting.x - shooting.vx * len, shooting.y - shooting.vy * len);
                grad.addColorStop(0, 'rgba(255, 240, 255, ' + alpha + ')');
                grad.addColorStop(1, 'rgba(200, 120, 255, 0)');
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(shooting.x, shooting.y);
                ctx.lineTo(shooting.x - shooting.vx * len, shooting.y - shooting.vy * len);
                ctx.stroke();
            }
        }
        requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
})();
