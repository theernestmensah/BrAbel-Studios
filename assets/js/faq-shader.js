/**
 * BRABEL — faq-shader.js
 * WebGL fluid-lava shader for the FAQ section background.
 *
 * Technique: Fragment-shader-only single quad covering the canvas.
 * Effect: Smooth, slowly-morphing "liquid marble" / "plasma lava"
 *         in deep navy, dark orange, amber and indigo — like heated
 *         glass. Entirely GPU-side, near-zero CPU cost.
 */

'use strict';

(function faqShader() {
    const canvas = document.getElementById('faqShaderCanvas');
    if (!canvas) return;

    /* ── WebGL context ───────────────────────────────────── */
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        // Graceful fallback: just leave the dark CSS background
        canvas.style.display = 'none';
        return;
    }

    /* ── Vertex shader — full-screen quad ───────────────── */
    const VS = `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

    /* ── Fragment shader — fluid plasma ─────────────────── */
    const FS = `
    precision highp float;
    uniform float u_time;
    uniform vec2  u_res;

    /* ---- Classic smooth noise helpers ---- */
    vec2 hash2(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)),
               dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = dot(hash2(i + vec2(0,0)), f - vec2(0,0));
      float b = dot(hash2(i + vec2(1,0)), f - vec2(1,0));
      float c = dot(hash2(i + vec2(0,1)), f - vec2(0,1));
      float d = dot(hash2(i + vec2(1,1)), f - vec2(1,1));
      return mix(mix(a,b,u.x), mix(c,d,u.x), u.y) * 0.5 + 0.5;
    }

    /* ---- Fractal brownian motion ---- */
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 6; i++) {
        v += a * noise(p);
        p  = p * 2.1 + vec2(1.7, 9.2);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      float t  = u_time * 0.09;

      /* Domain-warped fbm — gives the flowing / lava look */
      vec2 p = uv * 3.0;

      vec2 q = vec2(fbm(p + vec2(0.0,  0.0)),
                    fbm(p + vec2(5.2,  1.3)));

      vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7 + t * 0.15, 9.2)),
                    fbm(p + 4.0 * q + vec2(8.3 + t * 0.12, 2.8)));

      float f = fbm(p + 4.0 * r + t * 0.08);

      /* Palette — deep navy → indigo → dark orange → amber */
      vec3 col = mix(
        mix(
          vec3(0.03, 0.04, 0.14),    /* deep navy */
          vec3(0.12, 0.07, 0.32),    /* indigo purple */
          clamp(f * 2.0, 0.0, 1.0)
        ),
        mix(
          vec3(0.48, 0.16, 0.02),    /* burnt orange */
          vec3(0.72, 0.38, 0.01),    /* amber gold */
          clamp(f * 2.0 - 1.0, 0.0, 1.0)
        ),
        clamp(f * f * 2.8, 0.0, 1.0)
      );

      /* Subtle vignette to keep edges dark */
      vec2 vd  = uv - 0.5;
      float vig = 1.0 - dot(vd, vd) * 1.6;
      col *= vig;

      /* Overall darkening — we want it moody, not neon */
      col *= 0.82;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

    /* ── Compile helper ─────────────────────────────────── */
    function compile(type, src) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            console.warn('[faq-shader] shader error:', gl.getShaderInfoLog(sh));
            return null;
        }
        return sh;
    }

    const vs = compile(gl.VERTEX_SHADER, VS);
    const fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { canvas.style.display = 'none'; return; }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    /* ── Full-screen quad ───────────────────────────────── */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');

    /* ── Resize ─────────────────────────────────────────── */
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = Math.round(rect.width);
        canvas.height = Math.round(rect.height);
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    /* ── Render loop ─────────────────────────────────────── */
    let start = null;
    function frame(ts) {
        if (!start) start = ts;
        const t = (ts - start) * 0.001;
        gl.uniform1f(uTime, t);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(frame);
    }

    /* ── Boot ────────────────────────────────────────────── */
    requestAnimationFrame(() => {
        resize();
        requestAnimationFrame(frame);
    });

    window.addEventListener('resize', resize);

    /* ── Accordion interaction ───────────────────────────── */
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-a');
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Close all
            document.querySelectorAll('.faq-item').forEach(el => {
                el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
                el.querySelector('.faq-a').style.maxHeight = '0';
                el.classList.remove('faq-open');
            });

            // Open clicked if it was closed
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                item.classList.add('faq-open');
            }
        });
    });
})();
