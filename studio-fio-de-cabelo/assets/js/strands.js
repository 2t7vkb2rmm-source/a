/* =========================================================
   Strands — fios de cabelo desenhados em canvas.
   progress 0 → fios escuros e soltos
   progress 1 → fios dourados, alinhados como uma onda
   Se existir assets/frames/frames.json, usa a sequência de
   frames (vídeo) no lugar da animação desenhada.
   ========================================================= */
(function () {
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

  const DARK_A = hex("#24160f"), DARK_B = hex("#5c3a25");
  const GOLD_A = hex("#b98638"), GOLD_B = hex("#fff1d2");
  const BG_DARK = hex("#120c09"), BG_WARM = hex("#1d130c");

  function rand(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  function create(canvas, opts = {}) {
    const ctx = canvas.getContext("2d");
    const small = matchMedia("(max-width: 760px)").matches;
    const count = opts.count || (small ? 70 : 140);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = rand(opts.seed || 7);
    let W = 0, H = 0, dpr = 1;
    let target = opts.progress ?? 0, current = target;
    let frames = null, raf = 0, visible = true;

    const strands = Array.from({ length: count }, (_, i) => ({
      y0: r(),                                  // posição no caos
      band: (i / count - .5) * (small ? .5 : .38), // posição na onda
      ph: r() * Math.PI * 2,
      f1: 1.5 + r() * 3.5,
      f2: 4 + r() * 6,
      a1: .5 + r(),
      w: .5 + r() * 1.3,
      tone: r(),
      speed: .5 + r(),
    }));

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawFrames(p) {
      const idx = Math.round(p * (frames.length - 1));
      const img = frames[idx];
      if (!img || !img.complete) return;
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    }

    function drawStrands(p, time) {
      const e = ease(p);
      // fundo: escuro → com brilho dourado no centro
      const bg = mix(BG_DARK, BG_WARM, e);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = rgba(bg, 1);
      ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(W * .5, H * .5, 0, W * .5, H * .5, Math.max(W, H) * .65);
      glow.addColorStop(0, `rgba(217,171,95,${.05 + .22 * e})`);
      glow.addColorStop(1, "rgba(217,171,95,0)");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "lighter";
      const steps = small ? 26 : 40;
      const t = time * .00025;
      const sweep = lerp(-.3, 1.3, e);          // faixa de brilho que "pinta" o loiro
      for (const s of strands) {
        const shade = clamp(e * 1.25 - s.tone * .25);
        const col = mix(mix(DARK_A, DARK_B, s.tone), mix(GOLD_A, GOLD_B, s.tone), shade);
        ctx.lineWidth = s.w * lerp(1, 1.25, e);
        ctx.beginPath();
        let px = 0, py = 0;
        for (let k = 0; k <= steps; k++) {
          const u = k / steps;
          const x = lerp(-.1, 1.1, u) * W;
          const chaos = s.y0 * H
            + Math.sin(u * s.f1 * 3 + s.ph + t * s.speed * 3) * H * .12 * s.a1
            + Math.sin(u * s.f2 * 2 - s.ph + t * 2) * H * .03;
          const order = H * (.5 + s.band)
            + Math.sin(u * Math.PI * 2.2 + t * 2.4 + s.band * 2) * H * .13
            + Math.sin(u * Math.PI * 7 + s.ph) * H * .006;
          const y = lerp(chaos, order, e);
          if (k === 0) { ctx.moveTo(x, y); }
          else { ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2); }
          px = x; py = y;
        }
        ctx.lineTo(px, py);
        const near = Math.abs((s.tone * .4 + .3) - sweep);
        const boost = e > .02 && e < .98 ? Math.max(0, .25 - near) * 1.6 : 0;
        ctx.strokeStyle = rgba(col, clamp(.16 + .32 * s.tone + .25 * e + boost, 0, .95));
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function frame(time) {
      current += (target - current) * (reduce ? 1 : .085);
      if (frames) drawFrames(current); else drawStrands(current, reduce ? 0 : time);
      raf = visible ? requestAnimationFrame(frame) : 0;
    }

    resize();
    addEventListener("resize", resize);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);

    return {
      set progress(v) { target = clamp(v); },
      useFrames(list) { frames = list; },
    };
  }

  /* Procura uma sequência de frames gerada a partir de vídeo.
     Formato esperado de assets/frames/frames.json:
     { "count": 240, "pattern": "frame_{n}.webp", "pad": 4 } */
  async function loadFrames(base, onProgress) {
    try {
      const res = await fetch(base + "frames.json", { cache: "no-store" });
      if (!res.ok) return null;
      const cfg = await res.json();
      const pad = cfg.pad || 4, list = [];
      let done = 0;
      await Promise.all(Array.from({ length: cfg.count }, (_, i) => new Promise(ok => {
        const img = new Image();
        img.onload = img.onerror = () => { done++; onProgress && onProgress(done / cfg.count); ok(); };
        img.src = base + cfg.pattern.replace("{n}", String(i + (cfg.start ?? 1)).padStart(pad, "0"));
        list[i] = img;
      })));
      return list.filter(im => im.naturalWidth);
    } catch (e) { return null; }
  }

  window.Strands = { create, loadFrames };
})();