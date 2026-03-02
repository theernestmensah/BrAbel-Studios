/**
 * BRABEL — home.js  (Canvas Edition)
 *
 * Canvas 1: heroCanvas     — full-screen aurora mesh gradient
 * Canvas 2: svcCanvas      — geometric hexagon grid
 * Canvas 3: mockupCanvas   — browser UI mockup painting
 * Canvas 4: pfCanvas1/2    — portfolio project illustrations
 * Canvas 5: ctaCanvas      — animated sine-wave layers
 */

'use strict';

/* ── helpers ─────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const PI2 = Math.PI * 2;

/* ═══════════════════════════════════════════════════════
   1.  HERO AURORA CANVAS
   Soft gradient blobs (radial) that drift slowly,
   blended with 'lighter' to create a luminous aurora glow.
   ═══════════════════════════════════════════════════════ */
(function heroAurora() {
    const canvas = $('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* Define blobs */
    const blobs = [
        { x: .15, y: .35, r: .45, hue: 20, sat: 90, lit: 50, speed: .00018, phase: 0 },
        { x: .75, y: .25, r: .50, hue: 30, sat: 95, lit: 48, speed: .00013, phase: 1.2 },
        { x: .55, y: .75, r: .42, hue: 16, sat: 85, lit: 55, speed: .00021, phase: 2.5 },
        { x: .30, y: .70, r: .38, hue: 240, sat: 70, lit: 35, speed: .00015, phase: 0.8 },
        { x: .85, y: .60, r: .40, hue: 260, sat: 65, lit: 38, speed: .00017, phase: 3.1 },
        { x: .50, y: .15, r: .35, hue: 25, sat: 88, lit: 52, speed: .00019, phase: 1.9 },
    ];

    let t = 0;

    function draw() {
        t += 1;
        const W = canvas.width, H = canvas.height;

        /* Dark base */
        ctx.fillStyle = '#060810';
        ctx.fillRect(0, 0, W, H);

        /* Draw each blob */
        ctx.globalCompositeOperation = 'lighter';

        blobs.forEach(b => {
            const angle = t * b.speed * PI2 + b.phase;
            const cx = (b.x + Math.sin(angle) * .12) * W;
            const cy = (b.y + Math.cos(angle * 1.3) * .10) * H;
            const rad = b.r * Math.min(W, H);

            const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
            gr.addColorStop(0, `hsla(${b.hue},${b.sat}%,${b.lit}%,.32)`);
            gr.addColorStop(.45, `hsla(${b.hue},${b.sat}%,${b.lit}%,.12)`);
            gr.addColorStop(1, `hsla(${b.hue},${b.sat}%,${b.lit}%,0)`);

            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rad, rad * .7, angle * .3, 0, PI2);
            ctx.fill();
        });

        ctx.globalCompositeOperation = 'source-over';

        /* Subtle grid overlay (1px lines) */
        ctx.strokeStyle = 'rgba(255,255,255,.03)';
        ctx.lineWidth = 1;
        const spacing = 60;
        for (let x = 0; x < W; x += spacing) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += spacing) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        /* Vignette */
        const vig = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * .7);
        vig.addColorStop(0, 'rgba(6,8,16,0)');
        vig.addColorStop(.65, 'rgba(6,8,16,0)');
        vig.addColorStop(1, 'rgba(6,8,16,.8)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, W, H);

        requestAnimationFrame(draw);
    }

    draw();
})();


/* ═══════════════════════════════════════════════════════
   2.  SERVICES CANVAS — Geometric hex/dot grid
   A clean animated dot-grid with glowing orange accents.
   ═══════════════════════════════════════════════════════ */
(function svcGeoCanvas() {
    const canvas = $('svcCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* Pre-choose "accent" dot positions */
    let accentDots = [];

    function buildAccents(W, H) {
        accentDots = [];
        const cols = Math.ceil(W / 70);
        const rows = Math.ceil(H / 60);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.random() < .06) {   // 6 % are glowing orange
                    accentDots.push({ c, r, phase: Math.random() * PI2 });
                }
            }
        }
    }

    let W = 0, H = 0;
    let t = 0;

    function draw() {
        t += 1;
        const nW = canvas.width, nH = canvas.height;
        if (nW !== W || nH !== H) { W = nW; H = nH; buildAccents(W, H); }

        /* Dark base matching section bg */
        ctx.fillStyle = '#060810';
        ctx.fillRect(0, 0, W, H);

        const spacingX = 70, spacingY = 60;
        const cols = Math.ceil(W / spacingX) + 1;
        const rows = Math.ceil(H / spacingY) + 1;

        /* Regular dots */
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const stagger = (r % 2) * spacingX * .5;
                const x = c * spacingX + stagger;
                const y = r * spacingY;
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, PI2);
                ctx.fillStyle = 'rgba(255,255,255,.08)';
                ctx.fill();
            }
        }

        /* Accent glowing dots */
        accentDots.forEach(d => {
            const stagger = (d.r % 2) * spacingX * .5;
            const x = d.c * spacingX + stagger;
            const y = d.r * spacingY;
            const pulse = .5 + .5 * Math.sin(t * .04 + d.phase);

            /* Outer glow */
            const gr = ctx.createRadialGradient(x, y, 0, x, y, 20);
            gr.addColorStop(0, `hsla(20,90%,50%,${.18 * pulse})`);
            gr.addColorStop(1, 'transparent');
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, PI2);
            ctx.fill();

            /* Core dot */
            ctx.beginPath();
            ctx.arc(x, y, 2.2, 0, PI2);
            ctx.fillStyle = `hsla(20,90%,55%,${.55 + .45 * pulse})`;
            ctx.fill();
        });

        /* Soft orange gradient at top-center to hint section header */
        const hdr = ctx.createRadialGradient(W * .5, 0, 0, W * .5, 0, W * .5);
        hdr.addColorStop(0, 'hsla(20,90%,50%,.06)');
        hdr.addColorStop(.6, 'hsla(20,90%,50%,.02)');
        hdr.addColorStop(1, 'transparent');
        ctx.fillStyle = hdr;
        ctx.fillRect(0, 0, W, H);

        requestAnimationFrame(draw);
    }

    draw();
})();


/* ═══════════════════════════════════════════════════════
   3.  HERO MOCKUP CANVAS
   Paints a convincing dark-UI browser mockup with
   simulated content — nav, hero block, cards, etc.
   ═══════════════════════════════════════════════════════ */
(function paintMockup() {
    const canvas = $('mockupCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        paint();
    }

    function rr(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function pill(x, y, w, h, fill) {
        rr(x, y, w, h, h / 2);
        ctx.fillStyle = fill;
        ctx.fill();
    }

    function block(x, y, w, h, fill, radius = 5) {
        rr(x, y, w, h, radius);
        ctx.fillStyle = fill;
        ctx.fill();
    }

    function paint() {
        const W = canvas.offsetWidth, H = canvas.offsetHeight;
        ctx.clearRect(0, 0, W, H);

        /* ── Background ── */
        block(0, 0, W, H, '#0a0d1a', 0);

        /* ── Browser chrome ── */
        // Title bar
        block(0, 0, W, 34, '#111527', 0);
        // Traffic lights
        ctx.beginPath(); ctx.arc(18, 17, 5, 0, PI2);
        ctx.fillStyle = '#ff5f57'; ctx.fill();
        ctx.beginPath(); ctx.arc(34, 17, 5, 0, PI2);
        ctx.fillStyle = '#febc2e'; ctx.fill();
        ctx.beginPath(); ctx.arc(50, 17, 5, 0, PI2);
        ctx.fillStyle = '#28c840'; ctx.fill();
        // Address bar
        block(70, 9, W - 100, 16, '#1e2338', 8);
        // Fake URL text dots
        for (let i = 0; i < 5; i++) {
            ctx.beginPath(); ctx.arc(84 + i * 10, 17, 2, 0, PI2);
            ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fill();
        }

        const yOff = 38;  // content starts after chrome
        const cH = H - yOff;

        /* ── Site Nav ── */
        block(0, yOff, W, 28, '#0f1225', 0);
        // Logo blob
        block(10, yOff + 8, 36, 12, 'hsl(20,90%,50%)', 6);
        // Nav links
        [70, 100, 132, 164].forEach(x => {
            block(x, yOff + 10, 22, 8, 'rgba(255,255,255,.12)', 4);
        });
        // CTA button
        const gr1 = ctx.createLinearGradient(W - 52, 0, W - 10, 0);
        gr1.addColorStop(0, 'hsl(20,90%,50%)');
        gr1.addColorStop(1, 'hsl(32,95%,50%)');
        block(W - 56, yOff + 7, 46, 14, gr1, 7);

        /* ── Hero block ── */
        const hy = yOff + 32;
        // Big headline bars
        for (let i = 0; i < 3; i++) {
            const w = i === 0 ? W * .55 : i === 1 ? W * .45 : W * .35;
            block(10, hy + i * 14, w, 9, i === 0 ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,.2)', 4);
        }
        // Accent gradient word
        const gr2 = ctx.createLinearGradient(10, 0, 10 + W * .45, 0);
        gr2.addColorStop(0, 'hsl(20,90%,50%)');
        gr2.addColorStop(1, 'hsl(32,95%,50%)');
        block(10, hy + 14, W * .45, 9, gr2, 4);

        // Sub-text lines
        [hy + 48, hy + 60, hy + 72].forEach((ly, i) => {
            block(10, ly, i === 2 ? W * .38 : W * .52, 5, 'rgba(255,255,255,.1)', 3);
        });
        // Buttons
        const gr3 = ctx.createLinearGradient(10, 0, 80, 0);
        gr3.addColorStop(0, 'hsl(20,90%,50%)');
        gr3.addColorStop(1, 'hsl(32,95%,50%)');
        block(10, hy + 86, 70, 16, gr3, 8);
        block(88, hy + 86, 60, 16, 'rgba(255,255,255,.08)', 8);

        /* ── Card row ── */
        const cy2 = yOff + 180;
        const cardW = (W - 40) / 3;
        const colors = ['hsl(260,60%,35%)', 'hsl(20,70%,28%)', 'hsl(200,60%,30%)'];
        for (let i = 0; i < 3; i++) {
            const cx = 10 + i * (cardW + 5);
            // Card body
            block(cx, cy2, cardW, cH - 185, 'rgba(255,255,255,.05)', 8);
            // Coloured top
            block(cx, cy2, cardW, 30, colors[i], 8);
            // Content lines
            block(cx + 6, cy2 + 36, cardW - 18, 5, 'rgba(255,255,255,.18)', 3);
            block(cx + 6, cy2 + 46, cardW - 30, 4, 'rgba(255,255,255,.10)', 3);
            block(cx + 6, cy2 + 55, cardW - 22, 4, 'rgba(255,255,255,.10)', 3);
        }

        /* ── Bottom gradient fade ── */
        const fade = ctx.createLinearGradient(0, H * .75, 0, H);
        fade.addColorStop(0, 'transparent');
        fade.addColorStop(1, '#0a0d1a');
        ctx.fillStyle = fade;
        ctx.fillRect(0, H * .75, W, H * .25);
    }

    resize();
    window.addEventListener('resize', resize);
})();


/* ═══════════════════════════════════════════════════════
   4.  PORTFOLIO CANVASES
   Rich painted visuals: abstract UI illustrations
   for each project card.
   ═══════════════════════════════════════════════════════ */
(function paintPortfolio() {

    function paintProject(id, paletteFn) {
        const canvas = $(id);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            draw();
        }

        function draw() {
            const W = canvas.offsetWidth, H = canvas.offsetHeight;
            paletteFn(ctx, W, H);
        }

        resize();
        window.addEventListener('resize', resize);
    }

    /* Project 1 — GreatKey (educational, blue/teal tones) */
    paintProject('pfCanvas1', (ctx, W, H) => {
        /* BG gradient */
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#0e1f4a');
        bg.addColorStop(1, '#0a2a34');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        /* Decorative circles */
        [[W * .8, H * .2, 90, 'rgba(59,130,246,.22)'],
        [W * .15, H * .75, 70, 'rgba(20,184,166,.18)'],
        [W * .55, H * .55, 55, 'rgba(99,102,241,.15)']].forEach(([cx, cy, r, c]) => {
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            g.addColorStop(0, c); g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, PI2); ctx.fill();
        });

        /* Mockup UI lines */
        ctx.fillStyle = 'rgba(255,255,255,.06)';
        [[20, 20, W - 40, 28, 6], [20, 58, W * .7, 8, 4], [20, 72, W * .55, 8, 4],
        [20, 92, 50, 20, 10], [80, 92, 50, 20, 10], [140, 92, 50, 20, 10]].forEach(([x, y, w, h, r]) => {
            ctx.beginPath();
            ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath(); ctx.fill();
        });

        /* Blue accent header bar */
        const hg = ctx.createLinearGradient(0, 0, W, 0);
        hg.addColorStop(0, 'rgba(37,99,235,.6)'); hg.addColorStop(1, 'rgba(20,184,166,.4)');
        ctx.fillStyle = hg;
        ctx.fillRect(20, 20, W - 40, 28);

        /* "200%" tag */
        ctx.fillStyle = 'rgba(59,130,246,.8)';
        ctx.beginPath(); ctx.roundRect(W - 70, H - 38, 55, 24, 6); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Inter,sans-serif';
        ctx.fillText('200%', W - 56, H - 22);

        /* Bottom gradient */
        const fd = ctx.createLinearGradient(0, H * .6, 0, H);
        fd.addColorStop(0, 'transparent'); fd.addColorStop(1, '#0e1f4a');
        ctx.fillStyle = fd; ctx.fillRect(0, H * .6, W, H * .4);
    });

    /* Project 2 — BGBrand (fashion, rose/purple tones) */
    paintProject('pfCanvas2', (ctx, W, H) => {
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#2d0a2e');
        bg.addColorStop(.5, '#1a0524');
        bg.addColorStop(1, '#0f0018');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        /* Glow orbs */
        [[W * .75, H * .25, 100, 'rgba(244,114,182,.2)'],
        [W * .2, H * .7, 80, 'rgba(168,85,247,.18)'],
        [W * .5, H * .5, 60, 'rgba(251,113,133,.12)']].forEach(([cx, cy, r, c]) => {
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            g.addColorStop(0, c); g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, PI2); ctx.fill();
        });

        /* Fashion grid lines */
        ctx.strokeStyle = 'rgba(244,114,182,.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        /* Product card mockups */
        const cw = 80, ch = 110;
        [[W * .15 - cw / 2, H * .35], [W * .5 - cw / 2, H * .22], [W * .82 - cw / 2, H * .38]].forEach(([cx, cy], i) => {
            ctx.fillStyle = `rgba(255,255,255,${.04 + i * .02})`;
            ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, 8); ctx.fill();
            ctx.strokeStyle = 'rgba(244,114,182,.2)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, 8); ctx.stroke();

            /* Image area */
            const ig = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch * .6);
            ig.addColorStop(0, `hsla(${290 + i * 20},60%,30%,.6)`);
            ig.addColorStop(1, `hsla(${340 + i * 20},60%,20%,.4)`);
            ctx.fillStyle = ig;
            ctx.beginPath(); ctx.roundRect(cx + 5, cy + 5, cw - 10, ch * .55, 5); ctx.fill();

            /* Lines */
            ctx.fillStyle = 'rgba(255,255,255,.15)';
            [[cx + 8, cy + ch * .62, cw * .7, 4], [cx + 8, cy + ch * .72, cw * .5, 3]].forEach(([lx, ly, lw, lh]) => {
                ctx.beginPath(); ctx.roundRect(lx, ly, lw, lh, 2); ctx.fill();
            });
        });

        /* "3x" tag */
        const gt = ctx.createLinearGradient(W - 70, 0, W - 15, 0);
        gt.addColorStop(0, 'hsl(310,80%,55%)'); gt.addColorStop(1, 'hsl(280,75%,55%)');
        ctx.fillStyle = gt;
        ctx.beginPath(); ctx.roundRect(W - 68, H - 36, 54, 22, 6); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Inter,sans-serif';
        ctx.fillText('3x Growth', W - 62, H - 21);

        const fd = ctx.createLinearGradient(0, H * .55, 0, H);
        fd.addColorStop(0, 'transparent'); fd.addColorStop(1, '#0f0018');
        ctx.fillStyle = fd; ctx.fillRect(0, H * .55, W, H * .45);
    });
})();


/* ═══════════════════════════════════════════════════════
   5.  CTA CANVAS — Sine Wave Layers
   Multiple layered sine waves in brand colours,
   creating a vibrant, flowing ribbon effect.
   ═══════════════════════════════════════════════════════ */
(function ctaWaves() {
    const canvas = $('ctaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* Wave definitions */
    const WAVES = [
        { amp: .06, freq: .016, speed: .012, phase: 0, color: 'hsla(20,90%,50%,.18)', y: .45 },
        { amp: .05, freq: .020, speed: .010, phase: 1.0, color: 'hsla(32,95%,50%,.15)', y: .52 },
        { amp: .07, freq: .013, speed: .008, phase: 2.1, color: 'hsla(240,70%,50%,.10)', y: .60 },
        { amp: .04, freq: .022, speed: .014, phase: 0.5, color: 'hsla(16,90%,55%,.12)', y: .38 },
        { amp: .05, freq: .018, speed: .009, phase: 3.2, color: 'hsla(260,65%,50%,.09)', y: .68 },
    ];

    let t = 0;

    function draw() {
        t += 1;
        const W = canvas.width, H = canvas.height;

        /* Deep dark base */
        ctx.fillStyle = '#060810';
        ctx.fillRect(0, 0, W, H);

        /* Centre glow blob */
        const cg = ctx.createRadialGradient(W * .5, H * .5, 0, W * .5, H * .5, W * .55);
        cg.addColorStop(0, 'hsla(20,90%,50%,.06)');
        cg.addColorStop(.5, 'hsla(240,70%,50%,.04)');
        cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.fillRect(0, 0, W, H);

        /* Draw waves from back to front */
        WAVES.forEach(w => {
            ctx.beginPath();
            ctx.moveTo(0, H * w.y);

            for (let x = 0; x <= W; x += 2) {
                const y = H * w.y
                    + Math.sin(x * w.freq + t * w.speed + w.phase) * H * w.amp
                    + Math.sin(x * w.freq * .5 + t * w.speed * .7) * H * w.amp * .4;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(W, H);
            ctx.lineTo(0, H);
            ctx.closePath();
            ctx.fillStyle = w.color;
            ctx.fill();
        });

        /* Top-fade overlay */
        const tf = ctx.createLinearGradient(0, 0, 0, H * .4);
        tf.addColorStop(0, '#060810');
        tf.addColorStop(1, 'transparent');
        ctx.fillStyle = tf;
        ctx.fillRect(0, 0, W, H * .4);

        /* Bottom-fade overlay */
        const bf = ctx.createLinearGradient(0, H * .65, 0, H);
        bf.addColorStop(0, 'transparent');
        bf.addColorStop(1, '#060810');
        ctx.fillStyle = bf;
        ctx.fillRect(0, H * .65, W, H * .35);

        requestAnimationFrame(draw);
    }

    draw();
})();


/* ═══════════════════════════════════════════════════════
   6.  MOBILE NAVIGATION
   ═══════════════════════════════════════════════════════ */
(function nav() {
    const toggle = $('mobileToggle');
    const menu = $('navMenu');
    const navbar = $('navbar');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('active');
        const s = toggle.querySelectorAll('span');
        s[0].style.transform = open ? 'rotate(45deg) translateY(7px)' : '';
        s[1].style.opacity = open ? '0' : '';
        s[2].style.transform = open ? 'rotate(-45deg) translateY(-7px)' : '';
    });

    document.querySelectorAll('.nl,.nl-cta').forEach(l => {
        l.addEventListener('click', () => {
            if (window.innerWidth <= 991) {
                menu.classList.remove('active');
                toggle.querySelectorAll('span').forEach(s => {
                    s.style.transform = '';
                    s.style.opacity = '';
                });
            }
        });
    });

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* Active link */
    const cur = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nl').forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === cur);
    });
})();


/* ═══════════════════════════════════════════════════════
   7.  FOOTER YEAR
   ═══════════════════════════════════════════════════════ */
document.querySelectorAll('.bfooter-bottom p').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/\d{4}/, new Date().getFullYear());
});

console.log('%cBrAbel ✦', 'font-size:22px;font-weight:900;color:#f97316;font-family:Outfit,sans-serif');
console.log('%cCanvas Edition — handcrafted with JS.', 'font-size:12px;color:#6b7280');
