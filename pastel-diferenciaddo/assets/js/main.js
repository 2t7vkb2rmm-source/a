/* =========================================================
   Pastel Diferenciaddo · interações
   Todos os dados do negócio ficam em CONFIG: quando o cardápio
   real e as fotos chegarem, basta atualizar aqui.
   ========================================================= */
(function () {
  "use strict";

  const CONFIG = {
    nome: "Pastel Diferenciaddo",
    whatsapp: "5517996196383",
    telefone: "(17) 99619-6383",
    endereco: "R. Miguel Jodas, 122, Residencial Quinta da Colina, Olímpia - SP, 15407-858",
    // 0 = domingo ... 6 = sábado · [abre, fecha] em minutos desde 0h
    horarios: { 0: null, 1: null, 2: [1140, 1380], 3: [1140, 1380], 4: [1140, 1380], 5: [1140, 1380], 6: [1140, 1410] },
    mensagens: {
      padrao: "Olá, Pastel Diferenciaddo! Vi a prévia do site e gostaria de fazer um pedido. Podem me enviar o cardápio e informar os valores e a disponibilidade?",
      salgados: "Olá, Pastel Diferenciaddo! Vi o destaque do pastel salgado bem recheado na prévia. Quais sabores estão disponíveis e quais são os valores?",
      doce: "Olá, Pastel Diferenciaddo! Fiquei com vontade de provar o pastel doce de brigadeiro artesanal. Ele está disponível? Qual é o valor?",
      suco: "Olá, Pastel Diferenciaddo! Vi o suco de pitaya citrus na prévia. Ele está disponível? Qual é o valor?",
      local: "Olá, Pastel Diferenciaddo! Vi a prévia do site e gostaria de confirmar o horário de atendimento para planejar uma visita.",
      rodape: "Olá, Pastel Diferenciaddo! Vi a prévia do site e gostaria de tirar uma dúvida."
    },
    itens: [
      { id: "salgado", nome: "Pastel salgado bem recheado", desc: "O destaque é o recheio generoso. Consulte os sabores disponíveis.", tipo: "real", img: "https://images.pexels.com/photos/6054485/pexels-photo-6054485.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", fundo: "gold", nota: "confirmar os sabores disponíveis" },
      { id: "doce", nome: "Pastel doce de brigadeiro artesanal", desc: "Um dos diferenciais citados pelos clientes.", tipo: "real", img: "https://images.pexels.com/photos/34122624/pexels-photo-34122624.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", fundo: "choco" },
      { id: "suco", nome: "Suco de pitaya citrus", desc: "Uma opção citada nas avaliações para acompanhar.", tipo: "real", img: "https://images.pexels.com/photos/2097500/pexels-photo-2097500.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", fundo: "pink" },
      { id: "queijo", nome: "Queijo", desc: "Sugestão de sabor para demonstrar a seleção da prévia.", tipo: "ilustrativo", img: "https://images.pexels.com/photos/14699209/pexels-photo-14699209.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", fundo: "cream" },
      { id: "carne", nome: "Carne", desc: "Sugestão de sabor para demonstrar a seleção da prévia.", tipo: "ilustrativo", img: "https://images.pexels.com/photos/14699211/pexels-photo-14699211.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", fundo: "cream" },
      { id: "frango", nome: "Frango", desc: "Sugestão de sabor para demonstrar a seleção da prévia.", tipo: "ilustrativo", img: "https://images.pexels.com/photos/14699210/pexels-photo-14699210.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", fundo: "cream" },
      { id: "pizza", nome: "Pizza", desc: "Sugestão de sabor para demonstrar a seleção da prévia.", tipo: "ilustrativo", img: "https://images.pexels.com/photos/9637877/pexels-photo-9637877.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", fundo: "cream" }
    ],
    avaliacoes: [
      "Ambiente super tranquilo, limpo e organizado. Pastéis sequinhos, quentinhos e saborosos. Os pastéis doces com brigadeiro artesanal e o suco de pitaya citrus são um diferencial.",
      "Não era aquele pouco de recheio no pastel, era um pastel recheado e delicioso. Parabéns pelo ambiente, organização e todos envolvidos!",
      "Ambiente muito aconchegante, pessoal muito gentil e atencioso e o pastel nem se fala, muito bom mesmo, tanto doce quanto salgado.",
      "Atendimento nota 10! Equipe muito simpática e atenciosa. E o pastel? Simplesmente delicioso, crocante por fora e recheado com muito sabor!",
      "Tudo maravilhoso, pastel delicioso, ambiente agradável e muito limpo, fomos bem atendidos! Voltaremos novamente em breve."
    ]
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wa = msg => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const desktop = window.matchMedia ? matchMedia("(min-width: 1024px)") : { matches: false };
  // Cada parte roda isolada: se algo falhar num navegador, o resto continua funcionando
  const safe = (nome, fn) => { try { fn(); } catch (e) { if (window.console) console.warn("[site] " + nome, e); } };
  const on = (el, ev, fn, opt) => { if (typeof el === "string") el = $(el); if (el) el.addEventListener(ev, fn, opt); };
  document.documentElement.classList.add("js");

  /* ---------- Links de WhatsApp e mapa ---------- */
  $$("[data-wa]").forEach(a => {
    a.href = wa(CONFIG.mensagens[a.dataset.wa] || CONFIG.mensagens.padrao);
    a.target = "_blank"; a.rel = "noopener";
  });
  const mapsLinks = {
    mapa: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.endereco),
    rota: "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(CONFIG.endereco)
  };
  $$("[data-maps]").forEach(a => a.href = mapsLinks[a.dataset.maps]);

  /* ---------- Cabeçalho e menu ---------- */
  const header = $("#header"), burger = $("#burger"), nav = $("#nav");
  const setMenu = open => {
    header.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    if (open) document.documentElement.style.setProperty("--nav-top", header.getBoundingClientRect().bottom + "px");
  };
  on(burger, "click", e => { e.stopPropagation(); setMenu(!header.classList.contains("open")); });
  if (nav) $$("a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("click", e => { if (header && header.classList.contains("open") && !header.contains(e.target)) setMenu(false); });
  addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("scrolled", scrollY > 30);
    if (header.classList.contains("open")) document.documentElement.style.setProperty("--nav-top", header.getBoundingClientRect().bottom + "px");
  }, { passive: true });

  /* ---------- Entrada e revelação ---------- */
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("loaded")));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: .05 });
    $$(".rv").forEach(el => io.observe(el));
  } else $$(".rv").forEach(el => el.classList.add("in"));
  setTimeout(() => $$(".rv").forEach(el => el.classList.add("in")), 6000); // conteúdo nunca fica escondido

  /* ---------- Funcionamento (horário de Olímpia) ---------- */
  const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const fmt = m => { const h = Math.floor(m / 60), mm = m % 60; return mm ? `${h}h${String(mm).padStart(2, "0")}` : `${h}h`; };
  let isOpen = false;
  function nowOlimpia() {
    try { return nowIntl(); } catch (e) {
      // Plano B: Olímpia segue o horário de Brasília (UTC−3, sem horário de verão desde 2019)
      const t = new Date(Date.now() - 3 * 3600000);
      return { d: t.getUTCDay(), m: t.getUTCHours() * 60 + t.getUTCMinutes() };
    }
  }
  function nowIntl() {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
    const g = t => parts.find(p => p.type === t).value;
    const d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday"));
    if (d < 0) throw new Error("dia");
    return { d, m: (+g("hour") % 24) * 60 + +g("minute") };
  }
  function computeStatus() {
    const { d, m } = nowOlimpia(), H = CONFIG.horarios, t = H[d];
    const next = () => {
      let nd = d, i = 0;
      do { nd = (nd + 1) % 7; i++; } while (!H[nd] && i < 7);
      return `Abre ${i === 1 ? "amanhã" : DIAS[nd]} às ${fmt(H[nd][0])}`;
    };
    if (t && m >= t[0] && m < t[1]) return { cls: "is-open", open: true, main: "Aberto agora", sub: `Hoje até ${fmt(t[1])}`, d };
    if (t && m < t[0]) return { cls: "is-soon", open: false, main: `Abre hoje às ${fmt(t[0])}`, sub: `Hoje das ${fmt(t[0])} às ${fmt(t[1])}`, d };
    if (t) return { cls: "", open: false, main: "Fechado agora", sub: next(), d };
    return { cls: "", open: false, main: "Fechado hoje", sub: next(), d };
  }
  function updateStatus() {
    let s;
    try { s = computeStatus(); } catch (e) { s = { cls: "", open: false, main: "Atendimento à noite", sub: "confira os horários", d: -1 }; }
    isOpen = s.open;
    $$("[data-status]").forEach(el => {
      el.classList.remove("is-open", "is-soon"); if (s.cls) el.classList.add(s.cls);
      const a = $(".status-main", el), b = $(".status-sub", el);
      if (a) a.textContent = s.main; if (b) b.textContent = s.sub;
    });
    $$(".hours tr").forEach(tr => tr.classList.toggle("today", (tr.dataset.days || "").split(",").map(Number).indexOf(s.d) > -1));
    const cn = $("#closed-note"); if (cn) cn.hidden = s.open || s.d === -1;
    safe("refreshSend", refreshSend);
  }
  setInterval(updateStatus, 60000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) updateStatus(); });

  /* ---------- Seleção ---------- */
  const store = (() => {
    let mem = [];
    const KEY = "pd-selecao";
    return {
      get() { try { const v = JSON.parse(sessionStorage.getItem(KEY)); return Array.isArray(v) ? v : mem; } catch (e) { return mem; } },
      set(v) { mem = v; try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { } }
    };
  })();
  let sel = store.get().filter(x => CONFIG.itens.some(i => i.id === x.id) && x.q > 0); // [{id,q}] na ordem de inclusão
  const byId = id => CONFIG.itens.find(i => i.id === id);
  const qtyOf = id => (sel.find(x => x.id === id) || {}).q || 0;
  const total = () => sel.reduce((a, x) => a + x.q, 0);
  const countTxt = n => n === 1 ? "1 item selecionado" : `${n} itens selecionados`;

  const list = $("#items");
  function renderItems() {
    if (!list) return;
    if ($(".item", list)) { $$(".item", list).forEach(paintCtl); return; } // já vem pronto no HTML
    const groups = [["real", "Destaques citados pelos clientes"], ["ilustrativo", "Salgados ilustrativos"]];
    list.innerHTML = groups.map(([tipo, titulo]) =>
      `<li class="group-title" data-group="${tipo}">${titulo}</li>` +
      CONFIG.itens.filter(i => i.tipo === tipo).map(i => `
      <li class="item" data-id="${i.id}" data-tipo="${i.tipo}">
        <div class="item-thumb item-thumb--${i.fundo} ph"><img src="${i.img}" alt="" loading="lazy" width="200" height="200"></div>
        <div class="item-top"><span class="item-name">${esc(i.nome)}</span>${i.tipo === "real" ? '<span class="badge badge--real">Citado pelos clientes</span>' : '<span class="badge badge--ilus">Ilustrativo</span>'}</div>
        <p class="item-desc">${esc(i.desc)}</p>
        <div class="item-ctl"></div>
      </li>`).join("")).join("");
    $$(".item", list).forEach(paintCtl);
  }
  function paintCtl(li) {
    const id = li.dataset.id, q = qtyOf(id), it = byId(id), ctl = $(".item-ctl", li);
    li.classList.toggle("has-qty", q > 0);
    ctl.innerHTML = q > 0
      ? `<div class="qty" role="group" aria-label="Quantidade de ${esc(it.nome)}">
           <button type="button" data-act="dec" aria-label="Diminuir ${esc(it.nome)}"><svg><use href="#i-minus"/></svg></button>
           <output aria-live="polite">${q}</output>
           <button type="button" data-act="inc" aria-label="Aumentar ${esc(it.nome)}" ${q >= 99 ? "disabled" : ""}><svg><use href="#i-plus"/></svg></button>
         </div>`
      : `<button type="button" class="add" data-act="inc"><svg><use href="#i-plus"/></svg> Adicionar à seleção</button>`;
  }
  function change(id, delta, announce) {
    const cur = sel.find(x => x.id === id);
    if (cur) { cur.q = Math.min(99, cur.q + delta); if (cur.q <= 0) sel = sel.filter(x => x !== cur); }
    else if (delta > 0) sel.push({ id, q: 1 });
    store.set(sel);
    const li = $(`.item[data-id="${id}"]`, list); if (li) paintCtl(li);
    renderSummary();
    if (announce) toast(`${byId(id).nome} adicionado à seleção.`);
  }
  on(list, "click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const id = b.closest(".item").dataset.id;
    const wasZero = qtyOf(id) === 0;
    change(id, b.dataset.act === "inc" ? 1 : -1, b.dataset.act === "inc" && wasZero);
    if (wasZero) { const nb = $(`.item[data-id="${id}"] [data-act="inc"]`, list); nb && nb.focus(); }
  });

  // filtros
  $$(".chip").forEach(c => c.addEventListener("click", () => {
    $$(".chip").forEach(x => x.setAttribute("aria-pressed", x === c));
    const f = c.dataset.filter;
    $$(".item, .group-title", list).forEach(li => { const t = li.dataset.tipo || li.dataset.group; li.hidden = f !== "todos" && t !== f; });
  }));

  // resumo
  const sumList = $("#sum-list"), sumCount = $("#sum-count"), obs = $("#obs"), send = $("#send");
  function buildMessage() {
    const reais = sel.filter(x => byId(x.id).tipo === "real"), ilus = sel.filter(x => byId(x.id).tipo === "ilustrativo");
    const L = [`Olá, ${CONFIG.nome}! Montei esta seleção na prévia do site e gostaria de consultar:`];
    if (reais.length) {
      L.push("", "DESTAQUES CITADOS PELOS CLIENTES");
      reais.forEach(x => { const i = byId(x.id); L.push(`${x.q} × ${i.nome}${i.nota ? " — " + i.nota : ""}`); });
    }
    if (ilus.length) {
      L.push("", "SABORES ILUSTRATIVOS — CONSULTAR SE FAZEM PARTE DO CARDÁPIO");
      ilus.forEach(x => L.push(`${x.q} × ${byId(x.id).nome} (ilustrativo)`));
    }
    const o = obs ? obs.value.trim() : "";
    if (o) L.push("", `Observações: ${o}`);
    L.push("", "Podem confirmar os sabores, a disponibilidade e os valores?" + (ilus.length ? " Sei que os sabores ilustrativos são exemplos da prévia e podem não fazer parte do cardápio." : ""));
    if (!isOpen) L.push("Vi que está fora do horário de funcionamento. Podem responder quando houver atendimento.");
    return L.join("\n");
  }
  function refreshSend() {
    if (!send) return;
    const empty = sel.length === 0;
    send.setAttribute("aria-disabled", empty);
    send.href = empty ? "#" : wa(buildMessage());
    if (!empty) { send.target = "_blank"; send.rel = "noopener"; } else send.removeAttribute("target");
    const cp = $("#copy"); if (cp) cp.disabled = empty;
  }
  function renderSummary() {
    const n = total();
    if (!sumList || !sumCount) return;
    sumCount.textContent = n ? countTxt(n) : "Sua seleção está vazia. Escolha um item para começar.";
    sumList.innerHTML = sel.map(x => {
      const i = byId(x.id);
      return `<li><span class="sum-q">${x.q}×</span><span class="sum-n">${esc(i.nome)}${i.tipo === "ilustrativo" ? "<small>Sabor ilustrativo</small>" : ""}</span><button type="button" class="sum-rm" data-rm="${i.id}">Remover</button></li>`;
    }).join("");
    const cl = $("#clear"), cf = $("#confirm"), bi = $(".bar-idle"), bs = $(".bar-sel"), bc = $("#bar-count");
    if (cl) cl.hidden = n === 0;
    if (cf && n === 0) cf.hidden = true;
    if (bi) bi.hidden = n > 0; if (bs) bs.hidden = n === 0;
    if (bc) bc.textContent = countTxt(n);
    refreshSend();
  }
  on(sumList, "click", e => {
    const b = e.target.closest("[data-rm]"); if (!b) return;
    sel = sel.filter(x => x.id !== b.dataset.rm); store.set(sel);
    const li = $(`.item[data-id="${b.dataset.rm}"]`, list); if (li) paintCtl(li);
    renderSummary();
  });
  on(send, "click", e => { if (sel.length === 0) e.preventDefault(); else send.href = wa(buildMessage()); });
  on(obs, "input", () => { $("#obs-n").textContent = `${obs.value.length}/300`; refreshSend(); });

  // limpar
  on("#clear", "click", () => { $("#confirm").hidden = false; $("#keep").focus(); });
  on("#keep", "click", () => { $("#confirm").hidden = true; $("#clear").focus(); });
  on("#do-clear", "click", () => {
    sel = []; store.set(sel); $("#confirm").hidden = true;
    $$(".item", list).forEach(paintCtl); renderSummary();
  });

  // copiar mensagem
  on("#copy", "click", async () => {
    const msg = buildMessage(), st = $("#copy-status"), fb = $("#copy-fallback");
    try { if (!navigator.clipboard) throw 0; await navigator.clipboard.writeText(msg); st.textContent = "Mensagem copiada."; fb.hidden = true; }
    catch (e) { st.textContent = "Não foi possível copiar automaticamente. Selecione e copie o texto abaixo."; fb.value = msg; fb.hidden = false; fb.select(); }
  });

  // painel inferior (celular)
  const summary = $("#summary"), sheet = $(".summary-in"), review = $("#review");
  let lastFocus = null;
  function openSheet() {
    if (!summary || !sheet) return;
    if (desktop.matches) { summary.scrollIntoView(); return; }
    safe("status", updateStatus);
    lastFocus = document.activeElement;
    summary.classList.add("open"); document.body.classList.add("sheet-open");
    sheet.setAttribute("aria-modal", "true");
    setTimeout(() => { try { sheet.focus({ preventScroll: true }); } catch (e) { } }, 50);
  }
  function closeSheet() {
    if (!summary || !summary.classList.contains("open")) return;
    summary.classList.remove("open"); document.body.classList.remove("sheet-open");
    sheet.setAttribute("aria-modal", "false");
    try { (lastFocus || review).focus({ preventScroll: true }); } catch (e) { }
  }
  on(review, "click", openSheet);
  $$("[data-close-sheet]").forEach(b => b.addEventListener("click", closeSheet));
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (summary && summary.classList.contains("open")) closeSheet();
    else if (header.classList.contains("open")) { setMenu(false); burger.focus(); }
  });
  const onMq = () => { if (desktop.matches) closeSheet(); };
  if (desktop.addEventListener) desktop.addEventListener("change", onMq); else if (desktop.addListener) desktop.addListener(onMq);

  // aviso rápido
  let tt;
  function toast(t) { const el = $("#toast"); if (!el) return; el.textContent = t; el.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("show"), 2200); }

  /* ---------- Avaliações ---------- */
  const revList = $("#rev-list"), revMore = $("#rev-more");
  const tones = ["", "quote--wine", "", "quote--gold", ""];
  if (revList && !$(".quote", revList)) revList.innerHTML = CONFIG.avaliacoes.map((t, i) => `
    <figure class="quote ${tones[i]} ${i > 1 ? "is-hidden" : ""}">
      <blockquote>${esc(t)}</blockquote>
      <figcaption><span aria-hidden="true">★★★★★</span> Avaliação de cliente no Google</figcaption>
    </figure>`).join("");
  on(revMore, "click", () => {
    const open = revMore.getAttribute("aria-expanded") === "true";
    $$(".quote", revList).forEach((q, i) => { if (i > 1) q.classList.toggle("is-hidden", open); });
    revMore.setAttribute("aria-expanded", !open);
    revMore.textContent = open ? "Ler mais 3 avaliações" : "Mostrar menos avaliações";

  });

  /* ---------- Mapa sob demanda ---------- */
  on("#map-load", "click", () => {
    const ph = $("#map-ph"), f = document.createElement("iframe");
    f.title = "Mapa: localização do Pastel Diferenciaddo";
    f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
    f.src = "https://www.google.com/maps?q=" + encodeURIComponent(CONFIG.endereco) + "&output=embed";
    let ok = false;
    f.addEventListener("load", () => { ok = true; ph.remove(); });
    setTimeout(() => { if (!ok) { $("#map-err").hidden = false; f.remove(); } }, 12000);
    $("#map-load").textContent = "Carregando…";
    $("#map").appendChild(f);
  });

  /* ---------- Fotos: se uma não carregar, fica um fundo elegante no lugar ---------- */
  function watchImg(img) {
    const box = img.closest(".ph"); if (!box) return;
    img.addEventListener("error", () => box.classList.add("ph-fail"));
    img.addEventListener("load", () => box.classList.remove("ph-fail"));
    if (img.complete && img.currentSrc && img.naturalWidth === 0 && img.loading !== "lazy") box.classList.add("ph-fail");
  }
  $$(".ph img").forEach(watchImg);
  if (window.MutationObserver) new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.querySelectorAll && n.querySelectorAll(".ph img").forEach(watchImg)))).observe(document.body, { childList: true, subtree: true });

  /* ---------- Início ---------- */
  safe("itens", renderItems); safe("resumo", renderSummary); safe("status", updateStatus);
})();
