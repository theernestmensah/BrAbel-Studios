/**
 * BRABEL — contact-canvas.js
 * Hero canvas for the Get a Quote page.
 *
 * Effect: "Digital Mesh" — an interconnected node network
 * with glowing orange/amber nodes and soft connecting lines,
 * over a deep dark background with a radial brand-colour glow.
 */

'use strict';

(function contactHeroCanvas() {
    const canvas = document.getElementById('contactHeroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const TAU = Math.PI * 2;


    /* ── Node setup ─────────────────────────────────────── */
    const NODE_COUNT = 55;
    const CONNECT_DIST = 160;
    let nodes = [];

    function buildNodes() {
        const W = canvas.width, H = canvas.height;
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 2.5 + 1.2,
                // Each node is either brand orange, amber, or dim white
                type: Math.random() < 0.25 ? 'orange'
                    : Math.random() < 0.45 ? 'amber'
                        : 'dim',
                pulseOffset: Math.random() * TAU
            });
        }
    }

    /* ── Draw loop ───────────────────────────────────────── */
    let t = 0;

    function draw() {
        requestAnimationFrame(draw);
        t += 0.014;

        const W = canvas.width, H = canvas.height;

        /* ── Background ── */
        ctx.fillStyle = '#07091a';
        ctx.fillRect(0, 0, W, H);

        /* ── Centre brand glow blob ── */
        const cg = ctx.createRadialGradient(W * 0.5, H * 0.55, 0, W * 0.5, H * 0.55, W * 0.6);
        cg.addColorStop(0, 'hsla(20,90%,50%,.07)');
        cg.addColorStop(0.4, 'hsla(240,70%,45%,.05)');
        cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.fillRect(0, 0, W, H);

        /* ── Second accent blob (right side) ── */
        const rg = ctx.createRadialGradient(W * 0.85, H * 0.3, 0, W * 0.85, H * 0.3, W * 0.35);
        rg.addColorStop(0, 'hsla(32,95%,50%,.08)');
        rg.addColorStop(1, 'transparent');
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, W, H);

        /* ── Move nodes (wrap edges) ── */
        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0) n.x = W;
            if (n.x > W) n.x = 0;
            if (n.y < 0) n.y = H;
            if (n.y > H) n.y = 0;
        });

        /* ── Draw connections ── */
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > CONNECT_DIST) continue;

                const alpha = (1 - dist / CONNECT_DIST) * 0.28;

                /* Colour of line matches node a's type */
                const lineColor = a.type === 'orange' ? `hsla(20,90%,55%,${alpha})`
                    : a.type === 'amber' ? `hsla(32,95%,55%,${alpha})`
                        : `rgba(160,170,220,${alpha * 0.5})`;

                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }

        /* ── Draw nodes ── */
        nodes.forEach(n => {
            const pulse = 0.65 + 0.35 * Math.sin(t * 1.8 + n.pulseOffset);

            let coreColor, glowColor, glowAlpha;
            if (n.type === 'orange') {
                coreColor = `hsla(20,90%,60%,${0.85 * pulse})`;
                glowColor = '20,90%,55%';
                glowAlpha = 0.22 * pulse;
            } else if (n.type === 'amber') {
                coreColor = `hsla(32,95%,58%,${0.8 * pulse})`;
                glowColor = '32,95%,55%';
                glowAlpha = 0.18 * pulse;
            } else {
                coreColor = `rgba(180,188,230,${0.25 * pulse})`;
                glowColor = null;
                glowAlpha = 0;
            }

            /* Outer glow for orange/amber nodes */
            if (glowColor) {
                const gGr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 7);
                gGr.addColorStop(0, `hsla(${glowColor},${glowAlpha})`);
                gGr.addColorStop(1, 'transparent');
                ctx.fillStyle = gGr;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r * 7, 0, TAU);
                ctx.fill();
            }

            /* Core dot */
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, TAU);
            ctx.fillStyle = coreColor;
            ctx.fill();
        });

        /* ── Decorative horizontal scan-line ── */
        const scanY = ((t * 28) % (H + 60)) - 30;
        const sg = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
        sg.addColorStop(0, 'transparent');
        sg.addColorStop(0.5, 'hsla(20,90%,50%,.04)');
        sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg;
        ctx.fillRect(0, scanY - 30, W, 60);

        /* ── Bottom fade so content section transitions cleanly ── */
        const bf = ctx.createLinearGradient(0, H * 0.72, 0, H);
        bf.addColorStop(0, 'transparent');
        bf.addColorStop(1, '#07091a');
        ctx.fillStyle = bf;
        ctx.fillRect(0, H * 0.72, W, H * 0.28);
    }

    /* ── Resize ─────────────────────────────────────────── */
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = Math.round(rect.width);
        canvas.height = Math.round(rect.height);
        buildNodes();
    }

    /* ── Boot: wait one frame so layout is painted ─────── */
    requestAnimationFrame(() => {
        resize();
        draw();
    });

    window.addEventListener('resize', resize);
})();
