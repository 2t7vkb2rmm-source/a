/* =========================================================
   Studio Fio de Cabelo · interações e cenas
   ========================================================= */
(function () {
  const CONFIG = {
    whatsapp: "5516993700576",
    mensagem: "Olá, Roseny! Vi o site do Studio Fio de Cabelo e gostaria de agendar um horário.",
    horario: { 0: null, 1: null, 2: [8, 18.5], 3: [8, 18.5], 4: [8, 18.5], 5: [8, 18.5], 6: [8, 18.5] }
  };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const mobile = matchMedia("(max-width: 760px)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- WhatsApp ---------- */
  $$(".wa").forEach(a => {
    a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(a.dataset.msg || CONFIG.mensagem)}`;
    a.target = "_blank"; a.rel = "noopener";
  });

  /* ---------- Fotos: pasta local primeiro, depois ilustrativa ---------- */
  $$("img[data-src]").forEach(img => {
    img.addEventListener("load", () => { if (img.naturalWidth) img.classList.add("ok"); });
    img.addEventListener("error", () => { if (img.dataset.web && !img.src.includes(img.dataset.web)) img.src = img.dataset.web; });
    img.src = img.dataset.src;
  });

  /* ---------- Aviso de prévia / menu ---------- */
  $("#close-preview").addEventListener("click", () => $("#preview").hidden = true);
  const header = $("#header"), burger = $("#burger");
  const setMenu = o => { header.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu"); };
  burger.addEventListener("click", () => setMenu(!header.classList.contains("open")));
  $$(".nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

  /* ---------- Separar palavras (revelação por rolagem) ---------- */
  function splitWords(el, goldWords = []) {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part.trim()) { frag.append(part); return; }
            const s = document.createElement("span"); s.className = "w"; s.textContent = part;
            if (goldWords.some(g => part.toLowerCase().includes(g))) s.classList.add("gold");
            frag.append(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains("w")) walk(n);
      });
    };
    walk(el);
    return $$(".w", el);
  }
  const s2Words = $$(".s2-title .w");
  const readWords = splitWords($(".read-text"), ["30", "anos.", "roseny,", "amei."]);

  /* ---------- Player de frames (vídeo controlado pela rolagem) ---------- */
  function framePlayer(canvas) {
    const ctx = canvas.getContext("2d");
    let list = null, last = -1;
    const size = () => { const d = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.max(1, canvas.clientWidth * d); canvas.height = Math.max(1, canvas.clientHeight * d); last = -1; };
    size(); addEventListener("resize", size);
    return {
      set frames(l) { list = l; size(); },
      draw(p) {
        if (!list) return;
        const i = Math.round(clamp(p) * (list.length - 1));
        if (i === last) return; last = i;
        const img = list[i], W = canvas.width, H = canvas.height;
        const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
        const w = img.naturalWidth * s, h = img.naturalHeight * s;
        ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
      }
    };
  }

  /* ---------- Cenas ---------- */
  const s1 = $(".scn-1"), s2 = $(".scn-2"), s3 = $(".scn-3"), read = $("#read");
  const strands = window.Strands.create($("#c1"), { seed: 11 });
  const p2 = framePlayer($("#c2")), p3 = framePlayer($("#c3"));
  const caps = $$(".scn-1 .cap");
  const prog = el => clamp((scrollY - el.offsetTop) / (el.offsetHeight - innerHeight));

  /* ---------- UI: cor do header, pontos, barra ---------- */
  const lightSecs = [s2, $(".numbers"), $(".services"), $(".visit")];
  const dots = $("#dots"), dotLinks = $$("a", dots);
  const dotTargets = dotLinks.map(a => $(a.getAttribute("href")));
  const cards = $$(".card");
  const topBar = $("#progress-top"), fab = $(".fab");
  let lastY = scrollY;

  function onScroll() {
    const y = scrollY, vh = innerHeight;

    // Cena 1
    const a = prog(s1);
    s1.style.setProperty("--p", a);
    $(".pin", s1).style.setProperty("--p", a);
    strands.progress = a;
    caps.forEach(c => c.classList.toggle("on", a >= +c.dataset.in && a < +c.dataset.out));

    // Cena 2
    const b = prog(s2), b2 = clamp((b - .12) / .7);
    $(".pin", s2).style.setProperty("--p", b);
    $(".pin", s2).style.setProperty("--p2", b2);
    s2Words.forEach((w, i) => w.classList.toggle("on", b > i / s2Words.length * .6 + .02));
    p2.draw(b);

    // Cena 3
    const c = prog(s3);
    $(".pin", s3).style.setProperty("--p", c);
    $(".pin", s3).style.setProperty("--p3", clamp(c * 1.6));
    p3.draw(c);

    // Texto que acende
    const r = clamp((y - read.offsetTop + vh * .2) / (read.offsetHeight - vh * .6));
    readWords.forEach((w, i) => w.classList.toggle("on", r > i / readWords.length));

    // Cartões empilhados
    if (!reduce) cards.forEach((card, i) => {
      const next = cards[i + 1]; if (!next) return;
      const ct = card.getBoundingClientRect(), nt = next.getBoundingClientRect();
      const ov = clamp(1 - (nt.top - ct.top) / ct.height);
      card.style.setProperty("--s", 1 - ov * .06);
    });

    // Header claro/escuro + pontos
    const probe = y + 40, mid = y + vh / 2;
    const onLight = s => s.offsetTop <= probe && s.offsetTop + s.offsetHeight > probe;
    const light = lightSecs.some(onLight);
    header.classList.toggle("on-light", light && !header.classList.contains("open"));
    const midLight = lightSecs.some(s => s.offsetTop <= mid && s.offsetTop + s.offsetHeight > mid);
    dots.classList.toggle("on-light", midLight);
    let active = 0;
    dotTargets.forEach((t, i) => { if (t && t.offsetTop <= mid) active = i; });
    dotLinks.forEach((l, i) => l.classList.toggle("active", i === active));

    // Esconde header ao descer, mostra ao subir
    const deep = y > s1.offsetTop + s1.offsetHeight - vh;
    if (y > lastY + 6 && deep && !header.classList.contains("open")) header.classList.add("hide");
    else if (y < lastY - 6 || !deep) header.classList.remove("hide");
    lastY = y;

    fab.classList.toggle("show", deep);
    topBar.style.width = (y / (document.documentElement.scrollHeight - vh) * 100) + "%";
  }

  /* ---------- Final ---------- */
  window.Strands.create($("#c-final"), { seed: 3, progress: 1, count: mobile ? 50 : 90 });

  /* ---------- Status ao vivo + relógio ---------- */
  function nowSP() {
    try {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
      const g = t => parts.find(x => x.type === t).value;
      return { d: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday")), hh: +g("hour") % 24, mm: +g("minute") };
    } catch (e) { const n = new Date(); return { d: n.getDay(), hh: n.getHours(), mm: n.getMinutes() }; }
  }
  const fmt = v => (v % 1 ? `${Math.floor(v)}h${String(Math.round(v % 1 * 60)).padStart(2, "0")}` : `${v}h`);
  function status() {
    const { d, hh, mm } = nowSP(), h = hh + mm / 60, H = CONFIG.horario, t = H[d];
    $("#clock").textContent = `Ituverava · ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    $$("#hours tr").forEach(r => r.classList.toggle("today", +r.dataset.d === d));
    const txt = $("#status-text"), dot = $("#dot");
    if (t && h >= t[0] && h < t[1]) { dot.classList.add("on"); txt.textContent = `Aberto agora · até ${fmt(t[1])}`; return; }
    dot.classList.remove("on");
    let open;
    if (t && h < t[0]) open = `hoje às ${fmt(t[0])}`;
    else { let nd = d, i = 0; do { nd = (nd + 1) % 7; i++; } while (!H[nd] && i < 7); open = `${i === 1 ? "amanhã" : ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"][nd]} às ${fmt(H[nd][0])}`; }
    txt.textContent = `Fechado · abre ${open}`;
  }
  status(); setInterval(status, 30000);

  /* ---------- Revelar + contadores ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    $$("[data-count]", en.target).forEach(countUp);
    io.unobserve(en.target);
  }), { rootMargin: "0px 0px -10% 0px", threshold: .08 });
  $$(".rv").forEach(el => io.observe(el));
  $$(".swatch span").forEach((s, i) => s.style.animationDelay = (i * 70) + "ms");
  function countUp(el) {
    if (reduce) return;
    const end = +el.dataset.count, t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ---------- Loader + frames de vídeo (opcionais) ---------- */
  const device = mobile ? "celular" : "computador";
  const num = $("#loader-num"), bar = $("#loader-bar");
  let shown = 0, real = 0, ended = false;
  const anim = setInterval(() => {
    const goal = ended ? 100 : Math.min(92, Math.max(real * 100, shown + 2));
    shown += (goal - shown) * .25 + .4; shown = Math.min(shown, goal);
    num.textContent = Math.round(shown); bar.style.width = shown + "%";
    if (ended && shown >= 99.5) { clearInterval(anim); open(); }
  }, 40);
  function open() {
    $("#loader").classList.add("done");
    document.body.classList.remove("is-loading");
    setTimeout(() => document.body.classList.add("ready"), 150);
  }
  // A abertura carrega antes de abrir o site; as outras cenas carregam em segundo plano.
  window.Strands.loadFrames(`assets/frames/abertura/${device}/`, v => real = Math.max(real, v))
    .then(l => { if (l && l.length > 10) { strands.useFrames(l); s1.classList.add("has-frames"); } })
    .finally(() => {
      ended = true; onScroll();
      window.Strands.loadFrames(`assets/frames/salao/${device}/`).then(l => { if (l && l.length > 10) { p2.frames = l; s2.classList.add("has-frames"); onScroll(); } });
      window.Strands.loadFrames(`assets/frames/maos/${device}/`).then(l => { if (l && l.length > 10) { p3.frames = l; s3.classList.add("has-frames"); onScroll(); } });
    });
  setTimeout(() => ended = true, 9000); // nunca prende o visitante

  /* ---------- Início ---------- */
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
})();