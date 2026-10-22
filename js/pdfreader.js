/* js/pdfreader.js - قارئ PDF للمذاكرة
   كتابة نص، رسم بألوان، هايلايت، ممحاة، تراجع، ترجمة بضغطة على أي كلمة إنجليزي،
   وبحث في ويكيبيديا (إنجليزي / عربي) مع عرض الملخص.
   الاستخدام:  PdfReader.open({ url: "data/x.pdf", title: { en: "...", ar: "..." } }) */
const PdfReader = (() => {
  "use strict";

  const CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  const COLORS = ["#facc15", "#22c55e", "#ec4899", "#3b82f6", "#f97316", "#8b5cf6", "#ef4444", "#111827"];
  const SIZES = [0.0015, 0.003, 0.0065];            /* سمك القلم كنسبة من عرض الصفحة */
  const KEY = "etoedu-pdfann-v1:";
  const POS = "etoedu-pdfpos-v1:";                 /* آخر صفحة ومكان ووقت التكبير لكل ملف */
  const ZMIN = 0.5, ZMAX = 3;
  const T = (ar, en) => (document.body.dataset.l === "en" ? en : ar);
  const pick = t => (t && typeof t === "object") ? (document.body.dataset.l === "en" ? (t.en || t.ar) : (t.ar || t.en)) : String(t || "");
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };

  let S = null;            /* حالة القارئ الحالية (null = مقفول) */
  const cache = new Map(); /* كاش الترجمة */

  /* ---------------- تحميل مكتبة PDF.js ---------------- */
  function addScript(src) {
    return new Promise((ok, no) => {
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = () => no(new Error("load " + src));
      document.head.append(s);
    });
  }
  async function loadLib() {
    if (window.pdfjsLib) return;
    await addScript(CDN + "pdf.min.js");
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = CDN + "pdf.worker.min.js";
  }

  /* ---------------- الستايل ---------------- */
  function injectStyle() {
    if (document.getElementById("prStyle")) return;
    const st = document.createElement("style");
    st.id = "prStyle";
    st.textContent = `
body.pr-lock{overflow:hidden}
#pdfr [hidden]{display:none!important}
#pdfr{position:fixed;inset:0;z-index:10050;display:flex;flex-direction:column;background:#d9dee5;color:#12355b;font:15px/1.5 Cairo,Inter,system-ui,sans-serif}
#pdfr button{font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
#pdfr .pr-top{display:flex;align-items:center;gap:6px;padding:calc(6px + env(safe-area-inset-top,0px)) 8px 6px;background:#12355b;color:#fff}
#pdfr .pr-title{flex:1;min-width:0;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#pdfr .pr-pg{font-size:13px;opacity:.85;white-space:nowrap;direction:ltr}
#pdfr .pr-b{min-width:40px;height:40px;border:0;border-radius:10px;background:rgba(255,255,255,.14);color:#fff;font-size:18px;font-weight:700}
#pdfr .pr-tools{display:flex;gap:10px;align-items:center;overflow-x:auto;padding:6px 8px;background:#fff;border-bottom:1px solid #cbd5e1;scrollbar-width:none}
#pdfr .pr-tools::-webkit-scrollbar{display:none}
#pdfr .pr-grp{display:flex;gap:4px;align-items:center;flex:none;padding-inline-end:10px;border-inline-end:1px solid #e2e8f0}
#pdfr .pr-grp:last-child{border:0}
#pdfr .pr-tools button{min-height:38px;padding:0 10px;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc;white-space:nowrap}
#pdfr .pr-tools button.on{background:#12355b;color:#fff;border-color:#12355b}
#pdfr .pr-tools .pr-c{width:30px;min-width:30px;height:30px;min-height:30px;padding:0;border-radius:50%;background:var(--c);border:2px solid #fff;box-shadow:0 0 0 1px #94a3b8}
#pdfr .pr-tools .pr-c.on{box-shadow:0 0 0 3px #12355b}
#pdfr .pr-body{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;position:relative;touch-action:pan-x pan-y}
#pdfr .pr-pages{width:max-content;min-width:100%;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 8px 120px;direction:ltr}
#pdfr .pr-page{position:relative;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.22);isolation:isolate;flex:none}
#pdfr .pr-page canvas.pv{position:absolute;left:0;top:0;z-index:1}
#pdfr .hl{position:absolute;inset:0;z-index:2;pointer-events:none}
#pdfr .hl i{position:absolute;opacity:.4;mix-blend-mode:multiply;border-radius:2px}
#pdfr .dc{position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none}
#pdfr[data-mode=pen] .dc,#pdfr[data-mode=erase] .dc{pointer-events:auto;z-index:6;touch-action:none;cursor:crosshair}
#pdfr .pr-tl{position:absolute;inset:0;overflow:hidden;line-height:1;z-index:4;-webkit-touch-callout:none;-webkit-user-select:text;user-select:text}
#pdfr .pr-tl span,#pdfr .pr-tl br{position:absolute;white-space:pre;color:transparent;cursor:text;transform-origin:0 0}
#pdfr .pr-tl .endOfContent{display:none}
#pdfr .pr-tl ::selection{background:rgba(59,130,246,.38)}
#pdfr[data-mode=pen] .pr-tl,#pdfr[data-mode=erase] .pr-tl{-webkit-user-select:none;user-select:none}
#pdfr[data-mode=text] .pr-tl{pointer-events:none}
#pdfr[data-mode=text] .pr-page{cursor:text}
#pdfr .nt{position:absolute;inset:0;z-index:5;pointer-events:none}
#pdfr .note{position:absolute;pointer-events:auto;min-width:40px;max-width:80%;display:flex;align-items:flex-start;gap:2px;transform:translateY(-2px)}
#pdfr .note .nx{outline:0;min-width:30px;padding:1px 4px;border:1px dashed rgba(0,0,0,.35);border-radius:4px;background:rgba(255,255,255,.55);white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.35;font-family:Cairo,Inter,system-ui,sans-serif;font-weight:600}
#pdfr .note .nh,#pdfr .note .nd{flex:none;width:20px;height:20px;border-radius:50%;background:#12355b;color:#fff;font-size:12px;line-height:20px;text-align:center;cursor:pointer;opacity:.8;user-select:none;font-family:system-ui,sans-serif}
#pdfr .note .nh{cursor:grab;touch-action:none}
#pdfr[data-mode=pen] .note,#pdfr[data-mode=erase] .note{pointer-events:none}
#pdfr .pr-load{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;pointer-events:none;font-weight:700}
#pdfr .pr-load a{pointer-events:auto;color:#12355b}
#pdfr .pr-sheet{position:fixed;left:0;right:0;bottom:0;z-index:10060;max-width:680px;margin:0 auto;max-height:60vh;overflow:auto;background:#fff;color:#0f172a;border-radius:18px 18px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.28);padding:12px 14px calc(14px + env(safe-area-inset-bottom,0px))}
#pdfr .pr-sheet[hidden]{display:none}
#pdfr .sh-h{display:flex;align-items:center;gap:6px}
#pdfr .sh-w{flex:1;min-width:0;font-size:1.15em;overflow-wrap:anywhere;direction:ltr;text-align:start}
#pdfr .sh-h button{width:38px;height:38px;border:0;border-radius:10px;background:#f1f5f9}
#pdfr .sh-tr{margin:8px 0 2px;font-size:1.3em;font-weight:700;color:#12355b;direction:rtl;text-align:start;overflow-wrap:anywhere}
#pdfr .sh-alt{color:#475569;font-size:.9em;direction:rtl;margin-bottom:4px}
#pdfr .sh-act{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
#pdfr .sh-act button,#pdfr .sh-wiki .wbtn{min-height:38px;padding:0 12px;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc}
#pdfr .sh-hl{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px}
#pdfr .sh-hl .pr-c{width:30px;height:30px;border-radius:50%;border:2px solid #fff;background:var(--c);box-shadow:0 0 0 1px #94a3b8;padding:0}
#pdfr .sh-wiki{margin-top:8px;padding-top:8px;border-top:1px solid #e2e8f0}
#pdfr .sh-wiki h4{margin:0 0 4px;font-size:1.05em;direction:ltr;text-align:start}
#pdfr .sh-wiki p{margin:6px 0;line-height:1.7;white-space:pre-wrap}
#pdfr .sh-wiki img{float:right;max-width:110px;max-height:110px;margin:0 0 6px 10px;border-radius:8px;object-fit:cover}
#pdfr .sh-wiki .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;clear:both}
#pdfr .sh-wiki .chips button{padding:2px 10px;min-height:30px;border:1px solid #cbd5e1;border-radius:99px;background:#fff;font-size:.85em}
#pdfr .sh-wiki .wtr{direction:rtl;background:#f1f5f9;border-radius:8px;padding:8px 10px}
#pdfr .sh-wiki a.wbtn{display:inline-flex;align-items:center;text-decoration:none;color:inherit}
`;
    document.head.appendChild(st);
  }

  /* ---------------- التعليقات (بيانات) ---------------- */
  const annOf = n => S.ann[n] || (S.ann[n] = { s: [], h: [], t: [] });
  function save() {
    clearTimeout(S.sv);
    const key = S.key, data = S.ann;
    S.sv = setTimeout(() => store.set(KEY + key, data), 350);
  }
  function pushUndo(op, k, n, it, i) { S.undo.push({ op, k, n, it, i, g: S.g }); }

  function pageOf(n) { return S.pages[n - 1]; }
  function repaint(p) { redrawStrokes(p); paintHL(p); paintNotes(p); }

  function undo() {
    if (!S.undo.length) return;
    const g = S.undo[S.undo.length - 1].g, touched = new Set();
    while (S.undo.length && S.undo[S.undo.length - 1].g === g) {
      const u = S.undo.pop(), list = annOf(u.n)[u.k];
      if (u.op === "add") { const i = list.indexOf(u.it); if (i > -1) list.splice(i, 1); }
      else list.splice(Math.min(u.i, list.length), 0, u.it);
      touched.add(u.n);
    }
    touched.forEach(n => repaint(pageOf(n)));
    save();
  }

  function clearAll() {
    if (!confirm(T("تمسح كل الكتابة والرسم والهايلايت في الملف ده؟", "Delete all notes, drawings and highlights in this file?"))) return;
    S.ann = {}; S.undo = [];
    S.pages.forEach(repaint);
    save();
  }

  /* ---------------- الهايلايت ---------------- */
  function paintHL(p) {
    p.el.querySelector(".hl").innerHTML = annOf(p.n).h.map(h =>
      `<i style="left:${h.r[0] * 100}%;top:${h.r[1] * 100}%;width:${h.r[2] * 100}%;height:${h.r[3] * 100}%;background:${h.c}"></i>`).join("");
  }

  function rectsFromRange(range) {
    const raw = [];
    for (const r of range.getClientRects()) {
      if (r.width < 1.5 || r.height < 3) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const p = S.pages.find(pp => { const b = pp.el.getBoundingClientRect(); return cx >= b.left && cx <= b.right && cy >= b.top && cy <= b.bottom; });
      if (!p) continue;
      const b = p.el.getBoundingClientRect();
      if (r.width > b.width * .97 && r.height > b.height * .6) continue;
      raw.push({ n: p.n, l: r.left, t: r.top, r: r.right, b: r.bottom, B: b });
    }
    /* شيل المستطيلات اللي جوه مستطيلات تانية عشان اللون ما يتكررش */
    const keep = raw.filter((a, i) => !raw.some((c, j) => j !== i && c.n === a.n &&
      c.l <= a.l + 1 && c.t <= a.t + 1 && c.r >= a.r - 1 && c.b >= a.b - 1 &&
      (c.r - c.l) * (c.b - c.t) > (a.r - a.l) * (a.b - a.t) + 1) &&
      !raw.slice(0, i).some(c => c.n === a.n && Math.abs(c.l - a.l) < 1 && Math.abs(c.t - a.t) < 1 && Math.abs(c.r - a.r) < 1 && Math.abs(c.b - a.b) < 1));
    return keep.map(a => ({ n: a.n, r: [(a.l - a.B.left) / a.B.width, (a.t - a.B.top) / a.B.height, (a.r - a.l) / a.B.width, (a.b - a.t) / a.B.height] }));
  }

  function addHL(rects, color) {
    if (!rects || !rects.length) return;
    S.g++;
    const touched = new Set();
    rects.forEach(x => { const it = { c: color, r: x.r }; annOf(x.n).h.push(it); pushUndo("add", "h", x.n, it); touched.add(x.n); });
    touched.forEach(n => paintHL(pageOf(n)));
    save();
  }

  /* ---------------- الرسم ---------------- */
  function sizeDraw(p) {
    const cv = p.el.querySelector(".dc"), ratio = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(p.w * ratio); cv.height = Math.round(p.h * ratio);
    redrawStrokes(p);
  }
  function strokePath(ctx, s, W, H) {
    ctx.strokeStyle = s.c; ctx.fillStyle = s.c; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(1, s.w * W);
    const q = s.p;
    if (q.length === 1) { ctx.beginPath(); ctx.arc(q[0][0] * W, q[0][1] * H, ctx.lineWidth / 2, 0, Math.PI * 2); ctx.fill(); return; }
    ctx.beginPath(); ctx.moveTo(q[0][0] * W, q[0][1] * H);
    for (let i = 1; i < q.length; i++) ctx.lineTo(q[i][0] * W, q[i][1] * H);
    ctx.stroke();
  }
  function redrawStrokes(p) {
    const cv = p.el.querySelector(".dc"), ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, cv.width, cv.height);
    annOf(p.n).s.forEach(s => strokePath(ctx, s, cv.width, cv.height));
  }
  const dseg = (px, py, ax, ay, bx, by) => {
    const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
    let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  };
  function eraseAt(p, x, y, W, H) {
    const a = annOf(p.n), rad = 14, px = x * W, py = y * H;
    let hit = false;
    for (let i = a.s.length - 1; i >= 0; i--) {
      const s = a.s[i], q = s.p, lim = rad + s.w * W / 2;
      let near = q.length === 1 && Math.hypot(q[0][0] * W - px, q[0][1] * H - py) < lim;
      for (let j = 1; j < q.length && !near; j++) near = dseg(px, py, q[j - 1][0] * W, q[j - 1][1] * H, q[j][0] * W, q[j][1] * H) < lim;
      if (near) { S.g = S.eg; a.s.splice(i, 1); pushUndo("del", "s", p.n, s, i); hit = true; }
    }
    for (let i = a.h.length - 1; i >= 0; i--) {
      const r = a.h[i].r;
      if (x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3]) { S.g = S.eg; const h = a.h.splice(i, 1)[0]; pushUndo("del", "h", p.n, h, i); hit = true; }
    }
    if (hit) { redrawStrokes(p); paintHL(p); save(); }
  }

  function bindDrawing() {
    let cur = null, erasing = false;
    const pos = (e, dc) => { const r = dc.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, r]; };
    S.pagesEl.addEventListener("pointerdown", e => {
      const dc = e.target.closest && e.target.closest(".dc");
      if (!dc || (S.mode !== "pen" && S.mode !== "erase")) return;
      const p = S.pages[+dc.parentElement.dataset.n - 1];
      e.preventDefault(); dc.setPointerCapture(e.pointerId);
      const [x, y, r] = pos(e, dc);
      if (S.mode === "erase") { erasing = true; S.eg = ++S.g; eraseAt(p, x, y, r.width, r.height); return; }
      cur = { p, dc, s: { c: S.color, w: SIZES[S.size], p: [[x, y]] }, last: [e.clientX, e.clientY] };
      const ctx = dc.getContext("2d"); strokePath(ctx, cur.s, dc.width, dc.height);
    });
    S.pagesEl.addEventListener("pointermove", e => {
      if (erasing) {
        const dc = e.target.closest && e.target.closest(".dc"); if (!dc) return;
        const [x, y, r] = pos(e, dc); eraseAt(S.pages[+dc.parentElement.dataset.n - 1], x, y, r.width, r.height); return;
      }
      if (!cur) return;
      const dx = e.clientX - cur.last[0], dy = e.clientY - cur.last[1];
      if (dx * dx + dy * dy < 1.5) return;
      cur.last = [e.clientX, e.clientY];
      const [x, y] = pos(e, cur.dc), q = cur.s.p, prev = q[q.length - 1];
      q.push([x, y]);
      const ctx = cur.dc.getContext("2d"), W = cur.dc.width, H = cur.dc.height;
      ctx.strokeStyle = cur.s.c; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = Math.max(1, cur.s.w * W);
      ctx.beginPath(); ctx.moveTo(prev[0] * W, prev[1] * H); ctx.lineTo(x * W, y * H); ctx.stroke();
    });
    const end = () => {
      erasing = false;
      if (!cur) return;
      S.g++;
      annOf(cur.p.n).s.push(cur.s); pushUndo("add", "s", cur.p.n, cur.s);
      cur = null; save();
    };
    S.pagesEl.addEventListener("pointerup", end);
    S.pagesEl.addEventListener("pointercancel", end);
  }

  /* ---------------- ملاحظات نصية ---------------- */
  function paintNotes(p) {
    const L = p.el.querySelector(".nt"); L.innerHTML = "";
    annOf(p.n).t.forEach(t => L.append(mkNote(p, t)));
  }
  function mkNote(p, t) {
    const d = document.createElement("div");
    d.className = "note";
    d.style.left = t.x * 100 + "%"; d.style.top = t.y * 100 + "%";
    d.style.color = t.c; d.style.fontSize = Math.max(9, t.fs * p.w) + "px";
    d.innerHTML = '<span class="nh" title="move">✥</span><div class="nx" contenteditable="true" dir="auto" spellcheck="false"></div><span class="nd" title="delete">×</span>';
    const x = d.querySelector(".nx");
    x.textContent = t.txt || "";
    x.addEventListener("input", () => { t.txt = x.textContent; save(); });
    x.addEventListener("paste", e => { e.preventDefault(); document.execCommand("insertText", false, (e.clipboardData || window.clipboardData).getData("text")); });
    x.addEventListener("blur", () => { if (!x.textContent.trim()) removeNote(p, t, false); });
    d.querySelector(".nd").addEventListener("click", () => removeNote(p, t, true));
    const h = d.querySelector(".nh");
    h.addEventListener("pointerdown", e => {
      e.preventDefault(); h.setPointerCapture(e.pointerId);
      const mv = ev => {
        const b = p.el.getBoundingClientRect();
        t.x = Math.min(.98, Math.max(0, (ev.clientX - b.left) / b.width - 0.02));
        t.y = Math.min(.98, Math.max(0, (ev.clientY - b.top) / b.height - 0.01));
        d.style.left = t.x * 100 + "%"; d.style.top = t.y * 100 + "%";
      };
      const up = () => { h.removeEventListener("pointermove", mv); h.removeEventListener("pointerup", up); h.removeEventListener("pointercancel", up); save(); };
      h.addEventListener("pointermove", mv); h.addEventListener("pointerup", up); h.addEventListener("pointercancel", up);
    });
    return d;
  }
  function removeNote(p, t, withUndo) {
    const list = annOf(p.n).t, i = list.indexOf(t);
    if (i < 0) return;
    list.splice(i, 1);
    if (withUndo && (t.txt || "").trim()) { S.g++; pushUndo("del", "t", p.n, t, i); }
    else S.undo = S.undo.filter(u => u.it !== t);
    paintNotes(p); save();
  }
  function addNoteAt(e) {
    const el = e.target.closest(".pr-page"); if (!el || e.target.closest(".note")) return;
    const p = S.pages[+el.dataset.n - 1], b = el.getBoundingClientRect();
    const t = { x: Math.max(0, (e.clientX - b.left) / b.width), y: Math.max(0, (e.clientY - b.top) / b.height - 0.012), c: S.color, txt: "", fs: 17 / p.w };
    S.g++; annOf(p.n).t.push(t); pushUndo("add", "t", p.n, t);
    paintNotes(p);
    const nodes = p.el.querySelectorAll(".note .nx");
    if (nodes.length) nodes[nodes.length - 1].focus();
    save();
  }

  /* ---------------- ترجمة ---------------- */
  async function translate(text) {
    text = String(text || "").trim().slice(0, 500);
    const key = text.toLowerCase();
    if (!text) return null;
    if (cache.has(key)) return cache.get(key);
    const ar = /[\u0600-\u06FF]/.test(text), sl = ar ? "ar" : "en", tl = ar ? "en" : "ar";
    let out = null;
    /* 1) glossary بتاع المحاضرة (لو الكلمة موجودة فيه) */
    if (!ar && !/\s/.test(text) && typeof Tr !== "undefined" && Tr.map) {
      const g = Tr.map[key] || Tr.map[key.replace(/(?:es|s)$/, "")];
      if (g) out = { main: g, alts: [], src: "glossary" };
    }
    /* 2) ترجمة جوجل (مع معاني بديلة للكلمة المفردة) */
    if (!out) {
      try {
        const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&dt=bd&q=${encodeURIComponent(text)}`);
        if (r.ok) {
          const j = await r.json();
          const main = (j[0] || []).map(x => (x && x[0]) || "").join("").trim();
          const alts = [];
          (j[1] || []).forEach(g => (g[1] || []).slice(0, 4).forEach(w => { if (w && w !== main && !alts.includes(w)) alts.push(w); }));
          if (main) out = { main, alts: alts.slice(0, 6) };
        }
      } catch (e) { }
    }
    /* 3) MyMemory كاحتياطي */
    if (!out) {
      try {
        const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(sl + "|" + tl)}`);
        if (r.ok) {
          const j = await r.json(), main = j && j.responseData && j.responseData.translatedText;
          if (main) out = { main: String(main), alts: [] };
        }
      } catch (e) { }
    }
    if (out) cache.set(key, out);
    return out;
  }

  /* ---------------- ويكيبيديا ---------------- */
  async function wikiLookup(q, lang, title) {
    const base = `https://${lang}.wikipedia.org`;
    const sr = await (await fetch(`${base}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srlimit=5&format=json&origin=*`)).json();
    const hits = ((sr.query && sr.query.search) || []).map(x => x.title);
    if (!hits.length) return null;
    const tt = title || hits[0];
    const r = await fetch(`${base}/api/rest_v1/page/summary/${encodeURIComponent(tt.replace(/ /g, "_"))}`);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const s = await r.json();
    return {
      title: s.title || tt, desc: s.description || "", extract: s.extract || "",
      thumb: s.thumbnail && s.thumbnail.source, hits, lang,
      url: (s.content_urls && s.content_urls.desktop && s.content_urls.desktop.page) || `${base}/wiki/${encodeURIComponent(tt.replace(/ /g, "_"))}`
    };
  }

  async function showWiki(lang, title) {
    const ctx = S.cur; if (!ctx) return;
    const box = S.sheet.querySelector("#shWiki");
    box.hidden = false; box.textContent = T("بدور في ويكيبيديا...", "Searching Wikipedia...");
    let q = ctx.text.slice(0, 100);
    if (lang === "ar" && !/[\u0600-\u06FF]/.test(q)) { const tr = await translate(ctx.text); if (tr) q = tr.main; }
    let res = null, failed = false;
    try { res = await wikiLookup(q, lang, title); } catch (e) { failed = true; }
    if (S.cur !== ctx) return;
    box.textContent = "";
    if (failed) { box.textContent = T("ما قدرتش أوصل لويكيبيديا. اتأكد من النت.", "Could not reach Wikipedia. Check your connection."); return; }
    if (!res) { box.textContent = T("مفيش نتيجة في ويكيبيديا للكلمة دي.", "No Wikipedia result."); return; }
    const h = document.createElement("h4"); h.textContent = res.title + (res.desc ? " - " + res.desc : "");
    box.append(h);
    if (res.thumb) { const im = document.createElement("img"); im.src = res.thumb; im.alt = ""; im.referrerPolicy = "no-referrer"; box.append(im); }
    const p = document.createElement("p"); p.dir = res.lang === "ar" ? "rtl" : "ltr";
    p.textContent = res.extract || T("(مفيش ملخص للصفحة دي)", "(No summary available)");
    box.append(p);
    const row = document.createElement("div"); row.className = "chips"; row.style.clear = "both";
    const a = document.createElement("a"); a.className = "wbtn"; a.href = res.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.textContent = T("فتح في ويكيبيديا ↗", "Open in Wikipedia ↗");
    row.append(a);
    if (res.lang === "en" && res.extract) {
      const b = document.createElement("button"); b.type = "button"; b.className = "wbtn";
      b.textContent = T("ترجم الملخص للعربي", "Translate summary");
      const out = document.createElement("div"); out.className = "wtr"; out.hidden = true;
      b.onclick = async () => {
        b.disabled = true; out.hidden = false; out.textContent = "...";
        const tr = await translate(res.extract.slice(0, 480));
        out.textContent = tr ? tr.main : T("فشلت الترجمة.", "Translation failed.");
        b.disabled = false;
      };
      row.append(b); box.append(row, out);
    } else box.append(row);
    const others = res.hits.filter(x => x !== res.title);
    if (others.length) {
      const chips = document.createElement("div"); chips.className = "chips";
      others.forEach(x => { const c = document.createElement("button"); c.type = "button"; c.textContent = x; c.onclick = () => showWiki(lang, x); chips.append(c); });
      box.append(chips);
    }
  }

  /* ---------------- النافذة السفلية (ترجمة + ويكيبيديا + هايلايت) ---------------- */
  function openSheet(ctx) {
    S.cur = ctx;
    const sh = S.sheet; sh.hidden = false;
    sh.innerHTML = `<div class="sh-h"><b class="sh-w" dir="auto"></b>
      <button type="button" data-sh="speak" aria-label="Listen">🔊</button><button type="button" data-sh="copy" aria-label="Copy">📋</button><button type="button" data-sh="x" aria-label="Close">✕</button></div>
      <div class="sh-tr">${T("جارٍ الترجمة...", "Translating...")}</div><div class="sh-alt" hidden></div>
      <div class="sh-act"><button type="button" data-sh="wen">📖 Wikipedia</button><button type="button" data-sh="war">📖 ${T("ويكيبيديا عربي", "Arabic Wikipedia")}</button></div>
      <div class="sh-hl"><span>${T("هايلايت:", "Highlight:")}</span>${COLORS.slice(0, 6).map(c => `<button type="button" class="pr-c" data-hc="${c}" style="--c:${c}" aria-label="${c}"></button>`).join("")}</div>
      <div class="sh-wiki" id="shWiki" hidden></div>`;
    sh.querySelector(".sh-w").textContent = ctx.text;
    sh.scrollTop = 0;
    if (ctx.anchor) {
      const over = ctx.anchor.bottom - (window.innerHeight - sh.offsetHeight - 12);
      if (over > 0) S.body.scrollBy({ top: over + 12, behavior: "smooth" });
    }
    translate(ctx.text).then(tr => {
      if (S.cur !== ctx) return;
      const el = sh.querySelector(".sh-tr"), alt = sh.querySelector(".sh-alt");
      if (!tr) { el.textContent = T("ما قدرتش أترجم (اتأكد من النت).", "Could not translate (check connection)."); return; }
      el.textContent = tr.main;
      if (tr.alts && tr.alts.length) { alt.hidden = false; alt.textContent = tr.alts.join(" · "); }
    });
  }
  function closeSheet() {
    if (!S) return;
    S.cur = null; S.sheet.hidden = true;
    const sel = window.getSelection(); if (sel) sel.removeAllRanges();
  }

  /* ---------------- تحديد كلمة بالضغط ---------------- */
  function wordAt(x, y) {
    let node, off;
    if (document.caretPositionFromPoint) { const c = document.caretPositionFromPoint(x, y); if (!c) return null; node = c.offsetNode; off = c.offset; }
    else if (document.caretRangeFromPoint) { const r = document.caretRangeFromPoint(x, y); if (!r) return null; node = r.startContainer; off = r.startOffset; }
    else return null;
    if (!node || node.nodeType !== 3 || !node.parentElement || !node.parentElement.closest(".pr-tl")) return null;
    const s = node.data, isW = ch => /[\p{L}\p{M}'’\-]/u.test(ch);
    let a = Math.min(off, s.length), b = a;
    while (a > 0 && isW(s[a - 1])) a--;
    while (b < s.length && isW(s[b])) b++;
    while (a < b && /['’\-]/.test(s[a])) a++;
    while (b > a && /['’\-]/.test(s[b - 1])) b--;
    if (b <= a || !/\p{L}/u.test(s.slice(a, b))) return null;
    const range = document.createRange(); range.setStart(node, a); range.setEnd(node, b);
    /* لازم الضغطة تكون فعلاً على الكلمة مش على فراغ جنبها */
    const hit = [...range.getClientRects()].some(r => x >= r.left - 4 && x <= r.right + 4 && y >= r.top - 4 && y <= r.bottom + 4);
    if (!hit) return null;
    const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
    return { text: s.slice(a, b), rects: rectsFromRange(range), anchor: range.getBoundingClientRect() };
  }

  function handleSelection() {
    if (!S || S.down) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (!S.pagesEl.contains(range.commonAncestorContainer)) return;
    const text = sel.toString().replace(/\s+/g, " ").trim();
    if (!text) return;
    if (S.cur && S.cur.text === text) return;
    const rects = rectsFromRange(range);
    if (S.mode === "hl") { addHL(rects, S.color); sel.removeAllRanges(); return; }
    if (S.mode === "read") openSheet({ text: text.slice(0, 500), rects, anchor: range.getBoundingClientRect() });
  }

  /* ---------------- رسم الصفحات (lazy) ---------------- */
  async function render(p) {
    if (!S || p.rendered === p.scale || p.busy) return;
    p.busy = true;
    const sc = p.scale;
    try {
      const vp = p.page.getViewport({ scale: sc });
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const cv = p.el.querySelector(".pv");
      cv.width = Math.floor(vp.width * ratio); cv.height = Math.floor(vp.height * ratio);
      cv.style.width = vp.width + "px"; cv.style.height = vp.height + "px";
      p.task = p.page.render({ canvasContext: cv.getContext("2d"), viewport: vp, transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined });
      await p.task.promise;
      const tl = p.el.querySelector(".pr-tl");
      tl.innerHTML = ""; tl.style.setProperty("--scale-factor", String(sc));
      const tc = await p.page.getTextContent();
      await window.pdfjsLib.renderTextLayer({ textContentSource: tc, container: tl, viewport: vp, textDivs: [] }).promise;
      p.rendered = sc;
      sizeDraw(p); paintHL(p); paintNotes(p);
    } catch (e) {
      if (!(e && e.name === "RenderingCancelledException")) console.warn("PDF page render failed", e);
    } finally {
      p.busy = false;
      if (S && p.rendered !== p.scale) setTimeout(updateVisible, 30);
    }
  }

  function updateVisible() {
    if (!S) return;
    const br = S.body.getBoundingClientRect(), H = br.height;
    let best = null, bestD = 1e9;
    S.pages.forEach(p => {
      const r = p.el.getBoundingClientRect();
      const near = r.bottom > br.top - H * 1.2 && r.top < br.bottom + H * 1.2;
      const far = r.bottom < br.top - H * 4 || r.top > br.bottom + H * 4;
      if (near) render(p);
      else if (far && p.rendered && !p.busy) {   /* فك الصفحات البعيدة عشان الذاكرة */
        p.rendered = 0; const cv = p.el.querySelector(".pv"); cv.width = cv.height = 0;
        p.el.querySelector(".pr-tl").innerHTML = "";
      }
      const d = Math.abs((r.top + r.bottom) / 2 - (br.top + br.bottom) / 2);
      if (d < bestD) { bestD = d; best = p; }
    });
    if (best) S.pgEl.textContent = best.n + " / " + S.pages.length;
  }

  /* ---------------- آخر صفحة + التكبير بإصبعين ---------------- */
  function savePos() {
    if (!S || !S.posReady || !S.pages.length) return;
    const br = S.body.getBoundingClientRect();
    let pg = S.pages[0], off = 0;
    for (const p of S.pages) {
      const r = p.el.getBoundingClientRect();
      if (r.bottom > br.top + 8) { pg = p; off = r.height ? Math.max(0, Math.min(1, (br.top - r.top) / r.height)) : 0; break; }
    }
    store.set(POS + S.key, { page: pg.n, off: +off.toFixed(3), zoom: +S.zoom.toFixed(2) });
  }
  function goTo(n, off) {
    const p = S.pages[Math.min(Math.max(1, n | 0), S.pages.length) - 1]; if (!p) return;
    const br = S.body.getBoundingClientRect(), r = p.el.getBoundingClientRect();
    S.body.scrollTop += (r.top - br.top) + (off || 0) * r.height;
  }
  const clampZ = z => Math.min(ZMAX, Math.max(ZMIN, z));

  function bindPinch() {
    const body = S.body;
    let g = null;
    const dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const canPinch = () => S && S.mode !== "pen" && S.mode !== "erase";   /* وضع الرسم بيستخدم الإصبع للرسم */
    body.addEventListener("touchstart", e => {
      if (e.touches.length !== 2 || !canPinch()) return;
      const pr = S.pagesEl.getBoundingClientRect();
      const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2, my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      g = { d: dist(e.touches), r: 1, cx: mx, cy: my };
      S.pagesEl.style.transformOrigin = (mx - pr.left) + "px " + (my - pr.top) + "px";
      S.pagesEl.style.willChange = "transform";
      S.down = true;
    }, { passive: true });
    body.addEventListener("touchmove", e => {
      if (!g || e.touches.length !== 2) return;
      e.preventDefault();
      g.r = Math.min(ZMAX / S.zoom, Math.max(ZMIN / S.zoom, dist(e.touches) / g.d));
      S.pagesEl.style.transform = "scale(" + g.r + ")";
    }, { passive: false });
    const end = e => {
      if (!g || e.touches.length >= 2) return;
      const k = g; g = null;
      S.pagesEl.style.transform = ""; S.pagesEl.style.transformOrigin = ""; S.pagesEl.style.willChange = "";
      S.down = false;
      if (Math.abs(k.r - 1) < 0.02) return;
      const br = body.getBoundingClientRect(), cx = k.cx - br.left, cy = k.cy - br.top;
      const px = body.scrollLeft + cx, py = body.scrollTop + cy;
      S.zoom = clampZ(S.zoom * k.r);
      layout();
      body.scrollLeft = px * k.r - cx; body.scrollTop = py * k.r - cy;   /* النقطة بين الإصبعين تفضل مكانها */
      updateVisible(); clearTimeout(S.pt); S.pt = setTimeout(savePos, 500);
    };
    body.addEventListener("touchend", end, { passive: true });
    body.addEventListener("touchcancel", end, { passive: true });
    ["gesturestart", "gesturechange"].forEach(n => body.addEventListener(n, e => e.preventDefault()));   /* iOS */
  }

  function layout() {
    if (!S) return;
    const avail = Math.max(260, S.body.clientWidth - 16);
    const ratio = S.body.scrollHeight ? S.body.scrollTop / S.body.scrollHeight : 0;
    S.pages.forEach(p => {
      if (p.task) { try { p.task.cancel(); } catch (e) { } }
      p.scale = avail / p.base.width * S.zoom;
      p.w = p.base.width * p.scale; p.h = p.base.height * p.scale;
      p.el.style.width = p.w + "px"; p.el.style.height = p.h + "px";
      p.rendered = 0;
    });
    S.body.scrollTop = ratio * S.body.scrollHeight;
    updateVisible();
  }

  /* ---------------- الواجهة ---------------- */
  function setMode(m) {
    S.mode = m; S.root.dataset.mode = m;
    S.root.querySelectorAll("[data-m]").forEach(b => b.classList.toggle("on", b.dataset.m === m));
    closeSheet();
    S.root.querySelectorAll(".pr-b-size").forEach(b => b.hidden = m !== "pen");
  }
  function setColor(c) {
    S.color = c;
    S.root.querySelectorAll(".pr-tools .pr-c").forEach(b => b.classList.toggle("on", b.dataset.c === c));
  }
  function setSize(i) {
    S.size = i;
    S.root.querySelectorAll("[data-s]").forEach(b => b.classList.toggle("on", +b.dataset.s === i));
  }

  function buildUI(title) {
    injectStyle();
    const root = document.createElement("div");
    root.id = "pdfr"; root.dir = document.body.dataset.l === "en" ? "ltr" : "rtl";
    root.dataset.mode = "read";
    root.innerHTML = `
<div class="pr-top">
  <button type="button" class="pr-b" data-a="close" aria-label="Close">✕</button>
  <div class="pr-title"></div>
  <span class="pr-pg">-</span>
  <button type="button" class="pr-b" data-a="dl" aria-label="Download" title="${T("تحميل", "Download")}">⬇</button>
  <button type="button" class="pr-b" data-a="zout" aria-label="Zoom out">−</button>
  <button type="button" class="pr-b" data-a="zin" aria-label="Zoom in">+</button>
</div>
<div class="pr-tools">
  <div class="pr-grp">
    <button type="button" data-m="read">👆 ${T("قراءة وترجمة", "Read / translate")}</button>
    <button type="button" data-m="hl">🖍 ${T("هايلايت", "Highlight")}</button>
    <button type="button" data-m="pen">✏️ ${T("قلم", "Pen")}</button>
    <button type="button" data-m="text">T ${T("كتابة", "Text")}</button>
    <button type="button" data-m="erase">🧽 ${T("ممحاة", "Eraser")}</button>
  </div>
  <div class="pr-grp">${COLORS.map(c => `<button type="button" class="pr-c" data-c="${c}" style="--c:${c}" aria-label="${c}"></button>`).join("")}</div>
  <div class="pr-grp pr-b-size">
    <button type="button" data-s="0">${T("رفيع", "Thin")}</button><button type="button" data-s="1">${T("وسط", "Med")}</button><button type="button" data-s="2">${T("تخين", "Thick")}</button>
  </div>
  <div class="pr-grp">
    <button type="button" data-a="undo">↶ ${T("تراجع", "Undo")}</button>
    <button type="button" data-a="clear">🗑 ${T("مسح الكل", "Clear all")}</button>
  </div>
</div>
<div class="pr-body"><div class="pr-pages"></div><div class="pr-load">${T("جارٍ تحميل الملف...", "Loading PDF...")}</div></div>
<div class="pr-sheet" hidden></div>`;
    root.querySelector(".pr-title").textContent = title;
    document.body.append(root);
    document.body.classList.add("pr-lock");
    return root;
  }

  async function open(opts) {
    if (S || document.getElementById("pdfr")) return;
    const url = String(opts && opts.url || "");
    if (!url) return;
    const title = pick(opts.title) || "PDF";
    const root = buildUI(title);
    S = {
      url, title, root, mode: "read", color: COLORS[0], size: 1, zoom: 1, g: 0, eg: 0, down: false, undo: [], pages: [], cur: null,
      body: root.querySelector(".pr-body"), pagesEl: root.querySelector(".pr-pages"), pgEl: root.querySelector(".pr-pg"),
      sheet: root.querySelector(".pr-sheet"), key: String(opts.key || url), dl: String(opts.download || url), ann: store.get(KEY + String(opts.key || url))
    };
    const load = root.querySelector(".pr-load");

    /* ازرار الشريط */
    root.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b || !root.contains(b)) return;
      if (b.dataset.m) return setMode(b.dataset.m);
      if (b.dataset.c) { setColor(b.dataset.c); return; }
      if (b.dataset.s) return setSize(+b.dataset.s);
      if (b.dataset.hc && S.cur) { setColor(b.dataset.hc); addHL(S.cur.rects, b.dataset.hc); closeSheet(); return; }
      const a = b.dataset.a;
      if (a === "close") return close();
      if (a === "zin") { S.zoom = clampZ(S.zoom * 1.25); layout(); savePos(); return; }
      if (a === "zout") { S.zoom = clampZ(S.zoom / 1.25); layout(); savePos(); return; }
      if (a === "dl") { window.open(S.dl, "_blank", "noopener,noreferrer"); return; }
      if (a === "undo") return undo();
      if (a === "clear") return clearAll();
      const sh = b.dataset.sh;
      if (sh === "x") return closeSheet();
      if (sh === "speak" && S.cur && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(S.cur.text); u.lang = /[\u0600-\u06FF]/.test(S.cur.text) ? "ar-EG" : "en-US";
        speechSynthesis.cancel(); speechSynthesis.speak(u); return;
      }
      if (sh === "copy" && S.cur) { try { navigator.clipboard.writeText(S.cur.text); } catch (x) { } return; }
      if (sh === "wen") return showWiki("en");
      if (sh === "war") return showWiki("ar");
    });
    setMode("read"); setColor(S.color); setSize(S.size);

    /* تفاعل الصفحات */
    S.pagesEl.addEventListener("pointerdown", e => {
      S.down = true;
      if (S.cur && !S.sheet.contains(e.target)) closeSheet();
    });
    const up = () => { S.down = false; };
    S.onUp = up; window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    S.pagesEl.addEventListener("click", e => {
      if (S.mode === "text") return addNoteAt(e);
      if (S.mode !== "read") return;
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) return;
      if (!e.target.closest(".pr-tl")) return;
      const w = wordAt(e.clientX, e.clientY);
      if (w) openSheet(w);
    });
    S.onSel = () => { clearTimeout(S.selT); S.selT = setTimeout(handleSelection, 650); };
    document.addEventListener("selectionchange", S.onSel);
    S.onKey = e => { if (e.key === "Escape") closeSheet(); };
    document.addEventListener("keydown", S.onKey);
    S.onScroll = () => { clearTimeout(S.pt); S.pt = setTimeout(savePos, 500); if (S.raf) return; S.raf = requestAnimationFrame(() => { S.raf = 0; updateVisible(); }); };
    S.body.addEventListener("scroll", S.onScroll, { passive: true });
    S.onResize = () => { clearTimeout(S.rt); S.rt = setTimeout(layout, 200); };
    window.addEventListener("resize", S.onResize);
    S.onPop = () => { if (S) close(true); };
    window.addEventListener("popstate", S.onPop);
    try { history.pushState({ pdfr: 1 }, ""); S.pushed = true; } catch (e) { }
    bindDrawing();
    bindPinch();

    /* تحميل الملف */
    try {
      await loadLib();
      /* PDF بيتحفظ في الكاش أول ما يتفتح، فيفتح تاني من غير نت (ملخصات Drive وامتحانات PDF) */
      const buf = await fetchPdfCached(url);
      const task = window.pdfjsLib.getDocument(buf ? { data: buf } : { url, disableRange: true, disableStream: true });
      task.onProgress = o => { if (S && o && o.total) load.textContent = T("جارٍ تحميل الملف... ", "Loading PDF... ") + Math.round(o.loaded / o.total * 100) + "%"; };
      const doc = await task.promise;
      if (!S) { doc.destroy(); return; }
      S.doc = doc;
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        if (!S) return;
        const el = document.createElement("div");
        el.className = "pr-page"; el.dataset.n = i;
        el.innerHTML = '<canvas class="pv"></canvas><div class="hl"></div><canvas class="dc"></canvas><div class="pr-tl textLayer"></div><div class="nt"></div>';
        S.pagesEl.append(el);
        S.pages.push({ n: i, el, page, base: page.getViewport({ scale: 1 }), scale: 1, w: 0, h: 0, rendered: 0, busy: false });
      }
      load.remove();
      const pos = store.get(POS + S.key);
      if (pos.zoom) S.zoom = clampZ(+pos.zoom || 1);
      layout();
      if (pos.page > 1 || pos.off > 0.01) goTo(pos.page, pos.off);
      updateVisible();
      S.posReady = true;
    } catch (e) {
      console.warn("PDF load failed", e);
      if (!S) return;
      if (typeof opts.onFail === "function") { close(); opts.onFail(); return; }
      load.innerHTML = "";
      load.append(T("ما قدرتش أفتح الملف هنا. ", "Could not open the file here. "));
      const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = T("افتحه في نافذة جديدة", "Open in a new tab");
      load.append(a);
    }
  }

  /* كاش الـ PDF: نفس كاش صفحة "تحميل أوفلاين" (الـ service worker مابيمسحوش) */
  const PDF_CACHE = "offline-lectures-v1";
  async function fetchPdfCached(url) {
    if (!("caches" in window)) return null;
    try {
      const abs = new URL(url, location.href).href;
      const cache = await caches.open(PDF_CACHE);
      let r = await cache.match(abs);
      if (!r) {
        r = await fetch(abs);
        if (!r.ok) return null;
        if (!/html/i.test(r.headers.get("content-type") || "")) { try { await cache.put(abs, r.clone()); } catch (_) { } }
      }
      return await r.arrayBuffer();
    } catch (_) { return null; }
  }

  function close(fromPop) {
    if (!S) return;
    savePos();
    const s = S; S = null;
    clearTimeout(s.pt);
    clearTimeout(s.sv); clearTimeout(s.selT); clearTimeout(s.rt);
    try { store.set(KEY + s.key, s.ann); } catch (e) { }
    window.removeEventListener("pointerup", s.onUp); window.removeEventListener("pointercancel", s.onUp);
    window.removeEventListener("resize", s.onResize); window.removeEventListener("popstate", s.onPop);
    document.removeEventListener("selectionchange", s.onSel); document.removeEventListener("keydown", s.onKey);
    s.pages.forEach(p => { if (p.task) { try { p.task.cancel(); } catch (e) { } } });
    if (s.doc) { try { s.doc.destroy(); } catch (e) { } }
    s.root.remove();
    document.body.classList.remove("pr-lock");
    const sel = window.getSelection(); if (sel) sel.removeAllRanges();
    if (!fromPop && s.pushed && history.state && history.state.pdfr) history.back();
  }

  return { open, close };
})();
