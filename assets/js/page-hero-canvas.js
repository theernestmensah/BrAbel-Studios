/**
 * BRABEL — page-hero-canvas.js
 * One file drives unique canvas backgrounds for every sub-page hero.
 * Each page gets its own visual identity via 2D canvas API.
 */

'use strict';

(function () {

    /* ─── Shared canvas setup ─────────────────────────────────────── */
    function makeHeroCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');
        let W, H;
        function resize() {
            const r = canvas.parentElement.getBoundingClientRect();
            W = canvas.width = Math.round(r.width);
            H = canvas.height = Math.round(r.height);
        }
        requestAnimationFrame(() => { resize(); });
        window.addEventListener('resize', resize);
        return { canvas, ctx, getW: () => W, getH: () => H };
    }

    /* ═══════════════════════════════════════════════════════════════
       ABOUT — Soft Aurora / Nebula blobs
       Technique: Several large radial gradients drifting in sine paths.
       Palette: deep navy base, indigo, violet, teal highlights.
    ═══════════════════════════════════════════════════════════════ */
    const aboutHero = makeHeroCanvas('aboutHeroCanvas');
    if (aboutHero) {
        const { ctx, getW, getH } = aboutHero;
        const blobs = [
            { r: 0.62, g: 0.08, b: 0.55, ax: 0.38, ay: 0.35, rx: 0.55, ry: 0.45, sp: 0.00018, ph: 0.0 },
            { r: 0.00, g: 0.60, b: 0.75, ax: 0.60, ay: 0.55, rx: 0.35, ry: 0.40, sp: 0.00022, ph: 2.1 },
            { r: 0.38, g: 0.10, b: 0.88, ax: 0.30, ay: 0.65, rx: 0.50, ry: 0.35, sp: 0.00015, ph: 4.3 },
            { r: 0.00, g: 0.35, b: 0.55, ax: 0.70, ay: 0.30, rx: 0.40, ry: 0.50, sp: 0.00020, ph: 1.4 },
        ];
        let t = 0;
        function drawAbout() {
            const W = getW(), H = getH();
            if (!W) { requestAnimationFrame(drawAbout); return; }
            // Dark base
            ctx.fillStyle = '#05071e';
            ctx.fillRect(0, 0, W, H);
            // Blobs
            blobs.forEach(b => {
                const cx = (b.ax + Math.sin(t * b.sp * 1700 + b.ph) * b.rx * 0.5) * W;
                const cy = (b.ay + Math.cos(t * b.sp * 1300 + b.ph) * b.ry * 0.5) * H;
                const rad = Math.min(W, H) * 0.52;
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
                grad.addColorStop(0, `rgba(${Math.round(b.r * 255)},${Math.round(b.g * 255)},${Math.round(b.b * 255)},0.38)`);
                grad.addColorStop(0.5, `rgba(${Math.round(b.r * 255)},${Math.round(b.g * 255)},${Math.round(b.b * 255)},0.12)`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, W, H);
            });
            // Subtle scanline overlay
            const scan = ctx.createLinearGradient(0, 0, 0, H);
            scan.addColorStop(0, 'rgba(0,0,0,0.18)');
            scan.addColorStop(0.5, 'rgba(0,0,0,0)');
            scan.addColorStop(1, 'rgba(0,0,0,0.28)');
            ctx.fillStyle = scan;
            ctx.fillRect(0, 0, W, H);
            t++;
            requestAnimationFrame(drawAbout);
        }
        requestAnimationFrame(drawAbout);
    }

    /* ═══════════════════════════════════════════════════════════════
       SERVICES — Animated circuit / hex grid
       Technique: Grid of small hexagons, some "lit" pulsing in sequence.
       Palette: deep navy, electric cyan, orange accent nodes.
    ═══════════════════════════════════════════════════════════════ */
    const servicesHero = makeHeroCanvas('servicesHeroCanvas');
    if (servicesHero) {
        const { ctx, getW, getH } = servicesHero;
        let t = 0;
        const HEX_R = 26;           // hex circumradius
        const HX = HEX_R * 1.732;  // horizontal spacing
        const HY = HEX_R * 1.5;    // vertical spacing

        function hexPath(cx, cy, r) {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const a = Math.PI / 180 * (60 * i - 30);
                i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
                    : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
            }
            ctx.closePath();
        }

        function drawServices() {
            const W = getW(), H = getH();
            if (!W) { requestAnimationFrame(drawServices); return; }
            ctx.fillStyle = '#030b1a';
            ctx.fillRect(0, 0, W, H);

            const cols = Math.ceil(W / HX) + 2;
            const rows = Math.ceil(H / HY) + 2;

            for (let row = -1; row < rows; row++) {
                for (let col = -1; col < cols; col++) {
                    const cx = col * HX + (row % 2 === 0 ? 0 : HX / 2);
                    const cy = row * HY;
                    const d = Math.sqrt((cx - W * 0.5) ** 2 + (cy - H * 0.5) ** 2);
                    const pulse = (Math.sin(t * 0.012 - d * 0.018) + 1) * 0.5;
                    const alpha = 0.06 + pulse * 0.22;

                    hexPath(cx, cy, HEX_R - 2);
                    ctx.strokeStyle = `rgba(0,230,255,${alpha})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();

                    // Occasionally put an accent node
                    const nodeChance = Math.sin(col * 7.3 + row * 3.1) * 0.5 + 0.5;
                    if (nodeChance > 0.88) {
                        const np = (Math.sin(t * 0.009 + col + row) + 1) * 0.5;
                        ctx.beginPath();
                        ctx.arc(cx, cy, 3 + np * 3, 0, Math.PI * 2);
                        const isOrange = nodeChance > 0.94;
                        ctx.fillStyle = isOrange
                            ? `rgba(255,140,30,${0.5 + np * 0.5})`
                            : `rgba(0,230,255,${0.4 + np * 0.6})`;
                        ctx.fill();
                    }
                }
            }

            // Vignette
            const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.85);
            vg.addColorStop(0, 'rgba(3,11,26,0)');
            vg.addColorStop(1, 'rgba(3,11,26,0.72)');
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);

            t++;
            requestAnimationFrame(drawServices);
        }
        requestAnimationFrame(drawServices);
    }

    /* ═══════════════════════════════════════════════════════════════
       PORTFOLIO — Bokeh light particles
       Technique: Dozens of glowing circles drifting upward slowly.
       Palette: warm gold, rose/coral on very dark charcoal.
    ═══════════════════════════════════════════════════════════════ */
    const portfolioHero = makeHeroCanvas('portfolioHeroCanvas');
    if (portfolioHero) {
        const { canvas, ctx, getW, getH } = portfolioHero;
        const PARTICLE_COUNT = 60;
        let particles = [];

        function mkParticle(W, H) {
            const hue = Math.random() > 0.5 ? 38 + Math.random() * 20 : 340 + Math.random() * 25;
            return {
                x: Math.random() * W,
                y: H + Math.random() * H * 0.3,
                r: 6 + Math.random() * 22,
                speed: 0.25 + Math.random() * 0.6,
                drift: (Math.random() - 0.5) * 0.4,
                alpha: 0.1 + Math.random() * 0.28,
                hue,
            };
        }

        function initParticles(W, H) {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const p = mkParticle(W, H);
                p.y = Math.random() * H; // spread vertically on init
                particles.push(p);
            }
        }

        let inited = false;
        function drawPortfolio() {
            const W = getW(), H = getH();
            if (!W) { requestAnimationFrame(drawPortfolio); return; }
            if (!inited) { initParticles(W, H); inited = true; }

            // Fade trail
            ctx.fillStyle = 'rgba(8,6,14,0.18)';
            ctx.fillRect(0, 0, W, H);

            particles.forEach((p, i) => {
                p.y -= p.speed;
                p.x += p.drift;
                p.alpha += (Math.random() - 0.5) * 0.005;
                p.alpha = Math.max(0.05, Math.min(0.35, p.alpha));

                if (p.y + p.r < 0) {
                    particles[i] = mkParticle(W, H);
                }

                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                grad.addColorStop(0, `hsla(${p.hue},95%,75%,${p.alpha})`);
                grad.addColorStop(0.4, `hsla(${p.hue},80%,55%,${p.alpha * 0.5})`);
                grad.addColorStop(1, 'hsla(0,0%,0%,0)');
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            });

            // Vignette
            const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.05, W / 2, H / 2, H * 0.8);
            vg.addColorStop(0, 'rgba(8,6,14,0)');
            vg.addColorStop(1, 'rgba(8,6,14,0.75)');
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);

            requestAnimationFrame(drawPortfolio);
        }
        requestAnimationFrame(drawPortfolio);
    }

    /* ═══════════════════════════════════════════════════════════════
       PROCESS — Flowing data streams (vertical lines of particles)
       Technique: Columns of small dots cascade downward at varied speeds,
                  like falling code/data — green/teal on dark blue.
    ═══════════════════════════════════════════════════════════════ */
    const processHero = makeHeroCanvas('processHeroCanvas');
    if (processHero) {
        const { ctx, getW, getH } = processHero;
        const COL_W = 28;
        let cols = [];
        let inited = false;

        function initCols(W, H) {
            cols = [];
            const n = Math.ceil(W / COL_W);
            for (let i = 0; i < n; i++) {
                cols.push({
                    x: i * COL_W + COL_W / 2,
                    y: (Math.random() - 0.5) * H,
                    speed: 0.8 + Math.random() * 2.2,
                    len: 6 + Math.floor(Math.random() * 14),
                    gap: 18 + Math.floor(Math.random() * 18),
                    hue: Math.random() > 0.75 ? 30 : (144 + Math.random() * 40),
                    alpha: 0.15 + Math.random() * 0.5,
                });
            }
        }

        function drawProcess() {
            const W = getW(), H = getH();
            if (!W) { requestAnimationFrame(drawProcess); return; }
            if (!inited) { initCols(W, H); inited = true; }

            ctx.fillStyle = 'rgba(4, 8, 22, 0.22)';
            ctx.fillRect(0, 0, W, H);

            cols.forEach(c => {
                c.y += c.speed;
                if (c.y - c.len * c.gap > H) {
                    c.y = -c.len * c.gap * 0.5;
                    c.speed = 0.8 + Math.random() * 2.2;
                }
                for (let j = 0; j < c.len; j++) {
                    const py = c.y - j * c.gap;
                    if (py < 0 || py > H) continue;
                    const fade = 1 - j / c.len;
                    ctx.beginPath();
                    ctx.arc(c.x, py, j === 0 ? 3.5 : 1.8, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${c.hue},90%,${j === 0 ? 88 : 58}%,${c.alpha * fade})`;
                    ctx.fill();
                    // glow on head dot
                    if (j === 0) {
                        const g = ctx.createRadialGradient(c.x, py, 0, c.x, py, 14);
                        g.addColorStop(0, `hsla(${c.hue},100%,80%,${c.alpha * 0.4})`);
                        g.addColorStop(1, 'hsla(0,0%,0%,0)');
                        ctx.fillStyle = g;
                        ctx.beginPath();
                        ctx.arc(c.x, py, 14, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            });

            // Vignette
            const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.05, W / 2, H / 2, H * 0.9);
            vg.addColorStop(0, 'rgba(4,8,22,0)');
            vg.addColorStop(1, 'rgba(4,8,22,0.8)');
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);

            requestAnimationFrame(drawProcess);
        }
        requestAnimationFrame(drawProcess);
    }

    /* ═══════════════════════════════════════════════════════════════
       PRICING — Synthwave horizon grid + floating gem diamonds
       Technique: Perspective vanishing-point grid with scanlines and
                  slowly rotating/drifting diamond shapes.
       Palette: dark indigo base, neon magenta, electric purple, amber.
    ═══════════════════════════════════════════════════════════════ */
    const pricingHero = makeHeroCanvas('pricingHeroCanvas');
    if (pricingHero) {
        const { ctx, getW, getH } = pricingHero;
        let t = 0;

        /* ── Floating gem diamonds ───────────────────────────────── */
        const GEMS = Array.from({ length: 14 }, (_, i) => ({
            x: 0.08 + Math.random() * 0.84,
            y: 0.1 + Math.random() * 0.8,
            size: 10 + Math.random() * 22,
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.003,
            vx: (Math.random() - 0.5) * 0.00015,
            vy: (Math.random() - 0.5) * 0.00012,
            hue: [300, 270, 330, 30, 280][i % 5],  // pink, purple, magenta, amber, violet
            alpha: 0.18 + Math.random() * 0.28,
            pulse: Math.random() * Math.PI * 2,
        }));

        function drawDiamond(cx, cy, size, rot, hue, alpha) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rot);
            // outer diamond
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(size * 0.55, 0);
            ctx.lineTo(0, size);
            ctx.lineTo(-size * 0.55, 0);
            ctx.closePath();
            const fill = ctx.createLinearGradient(0, -size, 0, size);
            fill.addColorStop(0, `hsla(${hue},100%,80%,${alpha})`);
            fill.addColorStop(0.5, `hsla(${hue},90%,60%,${alpha * 0.6})`);
            fill.addColorStop(1, `hsla(${hue + 30},80%,45%,${alpha * 0.3})`);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = `hsla(${hue},100%,88%,${alpha * 0.9})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            // inner facet line
            ctx.beginPath();
            ctx.moveTo(0, -size * 0.5);
            ctx.lineTo(size * 0.28, 0);
            ctx.lineTo(0, size * 0.5);
            ctx.lineTo(-size * 0.28, 0);
            ctx.closePath();
            ctx.strokeStyle = `hsla(${hue},100%,95%,${alpha * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.restore();
        }

        function drawPricing() {
            const W = getW(), H = getH();
            if (!W) { requestAnimationFrame(drawPricing); return; }

            /* ── Background gradient ── */
            const bg = ctx.createLinearGradient(0, 0, 0, H);
            bg.addColorStop(0, '#0d0520');
            bg.addColorStop(0.55, '#140830');
            bg.addColorStop(1, '#1e0418');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            /* ── Horizon glow ── */
            const hy = H * 0.52;  // horizon Y position
            const hg = ctx.createRadialGradient(W * 0.5, hy, 0, W * 0.5, hy, W * 0.7);
            hg.addColorStop(0, 'rgba(220, 40, 180, 0.22)');
            hg.addColorStop(0.3, 'rgba(140,  0, 220, 0.10)');
            hg.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = hg;
            ctx.fillRect(0, 0, W, H);

            /* ── Perspective grid ── */
            const vp = { x: W * 0.5, y: hy };  // vanishing point
            const VCOLS = 22;
            const HROWS = 12;
            const gridSpeed = t * 0.0004;  // slow scroll feel

            ctx.save();
            ctx.beginPath();
            ctx.rect(0, hy, W, H - hy);  // clip to below horizon
            ctx.clip();

            // Vertical lines converging to vanishing point
            for (let i = 0; i <= VCOLS; i++) {
                const bx = (i / VCOLS) * W;
                const alpha = 0.08 + Math.abs(Math.sin(i * 0.4 + t * 0.01)) * 0.12;
                ctx.beginPath();
                ctx.moveTo(vp.x, vp.y);
                ctx.lineTo(bx, H);
                const lg = ctx.createLinearGradient(vp.x, vp.y, bx, H);
                lg.addColorStop(0, `rgba(240,60,200,0)`);
                lg.addColorStop(0.4, `rgba(240,60,200,${alpha * 0.5})`);
                lg.addColorStop(1, `rgba(240,60,200,${alpha})`);
                ctx.strokeStyle = lg;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }

            // Horizontal lines — perspective scaled, scrolling toward viewer
            for (let j = 0; j < HROWS; j++) {
                const frac = Math.pow((j + (gridSpeed % 1)) / HROWS, 2.2);  // perspective warp
                const ly = hy + (H - hy) * frac;
                const horizW = (W * 0.5) * frac;
                const alpha = 0.06 + frac * 0.28;
                const hue = 295 + frac * 40;  // magenta → orange near the bottom
                ctx.beginPath();
                ctx.moveTo(vp.x - horizW, ly);
                ctx.lineTo(vp.x + horizW, ly);
                ctx.strokeStyle = `hsla(${hue},100%,68%,${alpha})`;
                ctx.lineWidth = 0.6 + frac * 1.2;
                ctx.stroke();
            }

            // Floor glow
            const fg = ctx.createLinearGradient(0, hy, 0, H);
            fg.addColorStop(0, 'rgba(180,0,180,0.04)');
            fg.addColorStop(1, 'rgba(255,80,180,0.08)');
            ctx.fillStyle = fg;
            ctx.fillRect(0, hy, W, H - hy);

            ctx.restore();

            /* ── Horizon line ── */
            const hl = ctx.createLinearGradient(0, 0, W, 0);
            hl.addColorStop(0, 'rgba(220,50,200,0)');
            hl.addColorStop(0.3, 'rgba(255,80,220,0.75)');
            hl.addColorStop(0.5, 'rgba(255,120,240,0.95)');
            hl.addColorStop(0.7, 'rgba(255,80,220,0.75)');
            hl.addColorStop(1, 'rgba(220,50,200,0)');
            ctx.beginPath();
            ctx.moveTo(0, hy);
            ctx.lineTo(W, hy);
            ctx.strokeStyle = hl;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // secondary thicker glow band
            const hl2 = ctx.createLinearGradient(0, 0, W, 0);
            hl2.addColorStop(0, 'rgba(255,100,220,0)');
            hl2.addColorStop(0.5, 'rgba(255,100,220,0.15)');
            hl2.addColorStop(1, 'rgba(255,100,220,0)');
            ctx.beginPath();
            ctx.moveTo(0, hy);
            ctx.lineTo(W, hy);
            ctx.strokeStyle = hl2;
            ctx.lineWidth = 12;
            ctx.stroke();

            /* ── Floating gem diamonds ── */
            GEMS.forEach(g => {
                g.rot += g.vr;
                g.x += g.vx;
                g.y += g.vy;
                g.pulse += 0.025;
                if (g.x < -0.1) g.x = 1.1;
                if (g.x > 1.1) g.x = -0.1;
                if (g.y < -0.1) g.y = 1.1;
                if (g.y > 1.1) g.y = -0.1;
                const pa = g.alpha * (0.7 + 0.3 * Math.sin(g.pulse));
                drawDiamond(g.x * W, g.y * H, g.size, g.rot, g.hue, pa);
            });

            /* ── Top sky glow (above horizon) ── */
            const sky = ctx.createRadialGradient(W * 0.5, 0, 0, W * 0.5, 0, H * 0.7);
            sky.addColorStop(0, 'rgba(100, 0, 180, 0.15)');
            sky.addColorStop(0.5, 'rgba(60, 0, 120, 0.06)');
            sky.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, W, H);

            /* ── Slow scanlines ── */
            const scanY = (t * 1.2) % (H * 1.5);
            const sl = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
            sl.addColorStop(0, 'rgba(255,100,220,0)');
            sl.addColorStop(0.5, 'rgba(255,100,220,0.04)');
            sl.addColorStop(1, 'rgba(255,100,220,0)');
            ctx.fillStyle = sl;
            ctx.fillRect(0, 0, W, H);

            /* ── Edge + bottom vignette ── */
            const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.88);
            vg.addColorStop(0, 'rgba(13,5,32,0)');
            vg.addColorStop(1, 'rgba(13,5,32,0.78)');
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);

            t++;
            requestAnimationFrame(drawPricing);
        }
        requestAnimationFrame(drawPricing);
    }


})();
