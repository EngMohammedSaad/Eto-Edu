/* js/features.js - Eto.Edu "Study Boost"
   1) أخطائي (Mistakes review)      2) Flashcards للمصطلحات      3) بحث شامل
   4) ليلة الامتحان (Night before)  5) لوحة التقدم + Streak      6) امتحان مؤقّت
   7) نسخ احتياطي / استرجاع      8) تدريب ذكي + سجل نتائج + ربط الامتحانات (exam.js) بالأخطاء
   بيتحمّل قبل app.js، وكل حاجة بتتربط من خلال window.EF                        */
(function () {
"use strict";
const W = window, D = document;
const q1 = (s, r) => (r || D).querySelector(s), qa = (s, r) => Array.from((r || D).querySelectorAll(s));

/* ================= helpers ================= */
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const strip = h => { const d = D.createElement("div"); d.innerHTML = String(h == null ? "" : h); return (d.textContent || "").replace(/\s+/g, " ").trim(); };
const flat = v => v == null ? "" : typeof v === "string" ? v : typeof v === "number" ? String(v) : Array.isArray(v) ? v.map(flat).join(" ") : typeof v === "object" ? Object.values(v).map(flat).join(" ") : "";
const B = (en, ar) => { try { return bi({ en, ar }); } catch (e) { return esc(en); } };
const lang = () => D.body.getAttribute("data-l") || "ar";
const T = (en, ar) => lang() === "en" ? en : ar;
const R = v => v == null ? "" : typeof v === "string" ? v : typeof v === "number" ? String(v) : (typeof bi === "function" ? bi(v) : flat(v));
const rich = v => { try { return typeof biStudy === "function" ? biStudy(v) : R(v); } catch (e) { return R(v); } };
const S = { get: (k, d) => { try { return Store.get(k, d); } catch (e) { return d; } }, set: (k, v) => { try { Store.set(k, v); } catch (e) { } } };
const norm = s => String(s == null ? "" : s).toLowerCase().replace(/[\u064B-\u065F\u0670]/g, "").replace(/[إأآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const nav = h => { if (typeof go === "function") go(h); else location.hash = "#" + h; };
const col = p => p >= 80 ? "#22c55e" : p >= 50 ? "#f59e0b" : "#ef4444";
const fmt = s => { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };

const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  cards: '<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  flame: '<path d="M12 2s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z"/>',
  download: '<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/>',
  upload: '<path d="M12 15V3m0 0L8 7m4-4l4 4M4 21h16"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  speaker: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  bolt: '<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>',
  shuffle: '<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  swap: '<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>'
};
const I = (n, s) => `<svg class="ef-i" width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;

const ring = (pct, size, stroke, color, label) => {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r, c = size / 2;
  return `<div class="ef-ringw" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="rgba(127,127,127,.22)" stroke-width="${stroke}"/><circle class="ef-rg" cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-to="${C * (1 - Math.min(100, pct) / 100)}" transform="rotate(-90 ${c} ${c})"/></svg><span>${label}</span></div>`;
};
const animRings = root => requestAnimationFrame(() => requestAnimationFrame(() => qa(".ef-rg", root).forEach(c => c.style.strokeDashoffset = c.dataset.to)));

let toastT = null;
function toast(msg) {
  let t = q1(".ef-toast"); if (!t) { t = D.createElement("div"); t.className = "ef-toast"; D.body.appendChild(t); }
  t.innerHTML = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2800);
}

const cleanups = [];
const addCleanup = f => cleanups.push(f);
const runCleanups = () => { while (cleanups.length) { try { cleanups.pop()(); } catch (e) { } } };

/* ================= نشاط + Streak ================= */
const dkey = d => { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const ACT = "ef:act";
function touch(n) { const a = S.get(ACT, {}) || {}, k = dkey(); a[k] = (a[k] || 0) + (n || 1); S.set(ACT, a); }
function streaks() {
  const a = S.get(ACT, {}) || {}; let cur = 0; const d = new Date();
  if (!a[dkey(d)]) d.setDate(d.getDate() - 1);
  while (a[dkey(d)]) { cur++; d.setDate(d.getDate() - 1); }
  let best = 0, run = 0, prev = null;
  Object.keys(a).filter(k => a[k] > 0).sort().forEach(k => { const t = new Date(k + "T00:00:00"); run = prev && Math.round((t - prev) / 864e5) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = t; });
  return { cur, best, today: a[dkey()] || 0, a };
}

/* ================= بيانات المواد ================= */
const allSubjects = () => { const r = []; (W.SITE ? SITE.tracks : []).forEach(t => t.subjects.forEach(s => { if (!s.soon) r.push({ s, t }); })); return r; };
const lecsOf = sid => Object.values(W.LECTURES || {}).filter(l => l.subject === sid).sort((a, b) => a.number - b.number);
const loaded = new Set();
async function ensure(s) { if (!loaded.has(s.id)) { await loadScripts(s.files); loaded.add(s.id); } }

/* أسئلة: نطبّع أي شكل للـ schema */
const QC = {};
function normQ(q, i, lid) {
  if (!q || typeof q !== "object") return null;
  /* شكل بنك الأسئلة بتاع exam.js: { q, a (الصح), w:[3 غلط], qAr, aAr, wAr } - الاختيارات بتتخلط وقت التشغيل (shuf) */
  if (Array.isArray(q.w) && q.a !== undefined && q.a !== null && !(q.options || q.choices || q.opts || q.o || q.answers || q.c)) {
    const pair = (v, ar) => {
      if (v && typeof v === "object") return { en: v.en ?? "", ar: v.ar ?? v.en ?? "" };
      const en = String(v ?? ""); return ar && ar !== en ? { en, ar } : en;
    };
    const qt = pair(q.q, q.qAr); if (!strip(flat(qt))) return null;
    const opts = [pair(q.a, q.aAr)].concat(q.w.map((x, k) => pair(x, (q.wAr || [])[k])));
    return { lid, idx: i, text: qt, opts, ci: 0, shuf: true, exp: q.explain ?? q.explanation ?? q.exp ?? q.e ?? "" };
  }
  const text = q.q ?? q.question ?? q.text ?? q.prompt ?? q.stem ?? q.title;
  let opts = q.options ?? q.choices ?? q.opts ?? q.o ?? q.answers ?? q.c ?? [];
  if (!Array.isArray(opts)) opts = Object.values(opts || {});
  let ci = -1;
  const objCorrect = opts.findIndex(o => o && typeof o === "object" && (o.correct === true || o.ok === true));
  opts = opts.map(o => (o && typeof o === "object" && !Array.isArray(o)) ? (o.text ?? o.en ?? flat(o)) : o);
  if (objCorrect >= 0) ci = objCorrect;
  else {
    const c = q.answer ?? q.correct ?? q.a ?? q.ans ?? q.right ?? q.correctIndex ?? q.ci ?? q.k;
    if (typeof c === "number") ci = c;
    else if (typeof c === "string") {
      const t = c.trim();
      if (/^[A-Ha-h]$/.test(t)) ci = "abcdefgh".indexOf(t.toLowerCase());
      else if (/^\d+$/.test(t)) ci = +t;
      else ci = opts.findIndex(o => strip(flat(o)) === strip(c));
    }
    if (ci >= opts.length && ci - 1 < opts.length && ci - 1 >= 0) ci = ci - 1;
  }
  if (!text || opts.length < 2 || ci < 0 || ci >= opts.length) return null;
  return { lid, idx: i, text, opts, ci, exp: q.explain ?? q.explanation ?? q.exp ?? q.why ?? q.e ?? "" };
}
const qs = lid => { if (!QC[lid]) QC[lid] = ((W.QUESTIONS || {})[lid] || []).map((x, i) => normQ(x, i, lid)).filter(Boolean); return QC[lid]; };
const pool = arg => arg.indexOf("s:") === 0 ? lecsOf(arg.slice(2)).flatMap(l => qs(l.id)) : qs(arg);
const titleHTML = arg => {
  if (arg.indexOf("s:") === 0) { const f = findSubject(arg.slice(2)); return f ? bi(f.s.title) : ""; }
  const L = (W.LECTURES || {})[arg]; return L ? bi({ en: "Lecture " + L.number + ": " + (L.title.en || ""), ar: "المحاضرة " + L.number + ": " + (L.title.ar || "") }) : "";
};

/* أخطاء */
const wk = l => "ef:wrong:" + l;
const wrongs = l => S.get(wk(l), []) || [];
const addWrong = (l, i) => { const w = wrongs(l); if (w.indexOf(i) < 0) { w.push(i); S.set(wk(l), w); } };
const delWrong = (l, i) => S.set(wk(l), wrongs(l).filter(x => x !== i));
const revItems = arg => {
  const lids = arg.indexOf("s:") === 0 ? lecsOf(arg.slice(2)).map(l => l.id) : [arg];
  return lids.flatMap(l => wrongs(l).map(i => qs(l).find(x => x.idx === i)).filter(Boolean));
};

/* ===== ربط الأسئلة والامتحانات: إحصائية كل سؤال + سجل النتائج + تدريب ذكي ===== */
const QS = "ef:qstat:", HIST = "ef:hist";
const qstat = l => S.get(QS + l, {}) || {};                       // { idx: [صح, إجمالي, آخر مرة, صح ورا بعض] }
function answer(lid, idx, ok, clearOnRight) {
  if (lid == null || idx == null) return;
  const m = qstat(lid), o = m[idx] || [0, 0, 0, 0];
  o[1]++; o[2] = Date.now(); if (ok) { o[0]++; o[3] = (o[3] || 0) + 1; } else o[3] = 0;
  m[idx] = o; S.set(QS + lid, m);
  if (!ok) addWrong(lid, idx);
  else if (clearOnRight || o[3] >= 2) delWrong(lid, idx);      // المراجعة بتشيله فورًا، والامتحان بعد إجابتين صح ورا بعض
}
function logRun(o) {
  if (!o || o.kind === "single") return;
  const h = S.get(HIST, []) || []; h.push(Object.assign({ t: Date.now() }, o)); S.set(HIST, h.slice(-120));
}
const accOf = lid => { let r = 0, t = 0; Object.values(qstat(lid)).forEach(o => { r += o[0]; t += o[1]; }); return t ? Math.round(r / t * 100) : null; };
function smartPick(items, n) {
  const cache = {}, st = l => cache[l] || (cache[l] = qstat(l)), now = Date.now();
  const score = it => {
    const o = st(it.lid)[it.idx], w = wrongs(it.lid).indexOf(it.idx) >= 0;
    if (!o) return 2 + Math.random();                                // لسه ما اتحلّش
    return (w ? 4 : 0) + (1 - o[0] / o[1]) * 3 + Math.min(2, (now - o[2]) / 864e5 / 7) + Math.random() * .5;
  };
  return items.map(it => ({ it, s: score(it) })).sort((a, b) => b.s - a.s).slice(0, n).map(x => x.it);
}

/* مصطلحات */
function terms(L) {
  const g = L && L.glossary; if (!g) return []; const out = [];
  if (Array.isArray(g)) g.forEach(x => {
    if (Array.isArray(x)) out.push({ w: strip(flat(x[0])), m: strip(flat(x[1])) });
    else if (x && typeof x === "object") out.push({ w: strip(flat(x.en ?? x.word ?? x.term ?? x.w ?? x.k)), m: strip(flat(x.ar ?? x.meaning ?? x.m ?? x.v ?? x.def)) });
  });
  else if (typeof g === "object") Object.keys(g).forEach(k => out.push({ w: k, m: strip(flat(g[k])) }));
  return out.filter(t => t.w && t.m);
}

/* ================= الامتحان (مؤقّت / مراجعة) ================= */
const Quiz = {
  el: null, sh: null, tm: null, kd: null,
  close() {
    clearInterval(this.tm); this.tm = null;
    if (this.kd) { D.removeEventListener("keydown", this.kd, true); this.kd = null; }
    if (this.el) { this.el.remove(); this.el = null; }
    D.body.classList.remove("ef-lock"); refreshHub();
  },
  open() {
    clearInterval(this.tm); if (this.kd) { D.removeEventListener("keydown", this.kd, true); this.kd = null; }
    if (!this.el) { const el = D.createElement("div"); el.className = "ef-ov"; el.innerHTML = '<div class="ef-sheet"></div>'; D.body.appendChild(el); D.body.classList.add("ef-lock"); this.el = el; this.sh = el.firstChild; }
    return this.sh;
  },
  setup(arg) {
    const all = pool(arg), n = all.length;
    if (!n) { toast(B("No questions found here.", "مفيش أسئلة هنا.")); return; }
    const sh = this.open(), title = titleHTML(arg);
    const counts = Array.from(new Set([10, 20, 30, 40].filter(c => c < n).concat([n])));
    const c = { count: n <= 30 ? n : 20, mode: "perq", speed: 30 };
    const draw = () => {
      const total = c.mode === "total" ? Math.ceil(c.count * c.speed / 60) : 0;
      sh.innerHTML = `<div class="ef-qh"><button class="ef-x" data-x aria-label="Close">${I("x", 18)}</button><div class="ef-qt">${title}</div></div>
      <div class="ef-setup"><div class="ef-bigic">${I("timer", 34)}</div><h2>${B("Timed Exam", "امتحان مؤقّت")}</h2>
      <p class="ef-mut">${B("Pick how you want to practice. Wrong answers are saved to My Mistakes automatically.", "اختار طريقة التدريب. الأسئلة اللي هتغلط فيها بتتحفظ تلقائي في «أخطائي».")}</p>
      <h4>${B("Questions", "عدد الأسئلة")}</h4><div class="ef-chs">${counts.map(x => `<button class="ef-ch ${x === c.count ? "on" : ""}" data-c="${x}">${x === n ? B("All", "الكل") + " (" + n + ")" : x}</button>`).join("")}</div>
      <h4>${B("Mode", "النظام")}</h4><div class="ef-modes">
        <button class="ef-mode ${c.mode === "relaxed" ? "on" : ""}" data-m="relaxed"><b>${B("Relaxed", "براحتك")}</b><small>${B("No timer", "من غير وقت")}</small></button>
        <button class="ef-mode ${c.mode === "perq" ? "on" : ""}" data-m="perq"><b>${B("Per question", "وقت لكل سؤال")}</b><small>${B("Timer resets each question", "العدّاد بيبدأ من جديد")}</small></button>
        <button class="ef-mode ${c.mode === "total" ? "on" : ""}" data-m="total"><b>${B("Whole exam", "وقت كلي")}</b><small>${B("One countdown", "عدّاد واحد للامتحان")}</small></button></div>
      ${c.mode !== "relaxed" ? `<h4>${B("Speed", "السرعة")}</h4><div class="ef-chs">${[20, 30, 45, 60].map(x => `<button class="ef-ch ${x === c.speed ? "on" : ""}" data-s="${x}">${x}s</button>`).join("")}</div>
      <p class="ef-mut">${c.mode === "perq" ? B(c.speed + " seconds for each question", c.speed + " ثانية لكل سؤال") : B("Total time: " + total + " min", "الوقت الكلي: " + total + " دقيقة")}</p>` : ""}
      <button class="ef-btn big" data-go-quiz>${B("Start", "ابدأ")}</button></div>`;
    };
    sh.onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-x")) return this.close();
      if (b.dataset.c) c.count = +b.dataset.c; else if (b.dataset.m) c.mode = b.dataset.m; else if (b.dataset.s) c.speed = +b.dataset.s;
      else if (b.hasAttribute("data-go-quiz")) return this.run({ items: shuffle(all).slice(0, c.count), title, mode: c.mode, speed: c.speed, review: false, arg, lid: arg.indexOf("s:") === 0 ? null : arg });
      draw();
    };
    draw();
  },
  run(c) {
    const mix = it => { if (!it.shuf) return it; const ord = shuffle(it.opts.map((_, k) => k)); return Object.assign({}, it, { opts: ord.map(k => it.opts[k]), ci: ord.indexOf(it.ci), shuf: false }); };
    const sh = this.open(), items = c.items.map(mix), n = items.length; let i = 0, locked = false, qStart = 0, deadline = 0, finished = false;
    const ans = [], t0 = Date.now(), totalEnd = t0 + (c.mode === "total" ? n * c.speed * 1000 : 0);
    const fin = () => { if (finished) return; finished = true; clearInterval(this.tm); this.result(c, ans, n, Date.now() - t0); };
    const tick = () => {
      if (c.mode === "relaxed") return;
      const left = c.mode === "total" ? totalEnd - Date.now() : deadline - Date.now(), s = Math.max(0, Math.ceil(left / 1000));
      const e = q1("#efct", sh), w = q1("#efc", sh); if (e) e.textContent = fmt(s); if (w) w.classList.toggle("warn", s <= 10);
      if (left <= 0) { if (c.mode === "total") fin(); else if (!locked) pick(-1); }
    };
    const pick = k => {
      if (locked || finished) return; locked = true;
      const it = items[i], ok = k === it.ci; ans.push({ it, k, ok, ms: Date.now() - qStart }); touch();
      answer(it.lid, it.idx, ok, c.review);
      qa(".ef-opt", sh).forEach((b, x) => { b.disabled = true; b.classList.add(x === it.ci ? "ok" : x === k ? "bad" : "dim"); });
      q1("#efFb", sh).innerHTML = `<div class="ef-fbx ${ok ? "ok" : "bad"}"><strong>${ok ? I("check", 16) + " " + B("Correct", "صح") : k < 0 ? B("Time's up", "الوقت خلص") : I("x", 16) + " " + B("Not quite", "غلط")}</strong>${it.exp ? `<p>${R(it.exp)}</p>` : ""}</div>`;
      const nx = q1("#efNext", sh); nx.disabled = false; nx.innerHTML = i === n - 1 ? B("Finish", "إنهاء") : B("Next", "التالي"); nx.focus();
    };
    const draw = () => {
      const it = items[i]; locked = false; qStart = Date.now(); deadline = qStart + c.speed * 1000;
      sh.innerHTML = `<div class="ef-qh"><button class="ef-x" data-x aria-label="Close">${I("x", 18)}</button><div class="ef-qt">${c.title}</div>${c.mode !== "relaxed" ? `<div class="ef-clock" id="efc">${I("timer", 16)}<span id="efct"></span></div>` : ""}</div>
      <div class="ef-pb"><i style="width:${i / n * 100}%"></i></div>
      <div class="ef-qn">${B("Question", "سؤال")} ${i + 1} / ${n}</div>
      <div class="ef-qtext">${R(it.text)}</div>
      <div class="ef-opts">${it.opts.map((x, k) => `<button class="ef-opt" data-k="${k}"><b>${"ABCDEFGH"[k] || k + 1}</b><span>${R(x)}</span></button>`).join("")}</div>
      <div id="efFb"></div><div class="ef-qf"><button class="ef-btn" id="efNext" disabled>${B("Next", "التالي")}</button></div>`;
      tick();
    };
    sh.onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-x")) { if (ans.length && !confirm(T("Leave the exam? Your answers so far are saved.", "تخرج من الامتحان؟ إجاباتك لحد دلوقتي اتحفظت."))) return; return this.close(); }
      if (b.classList.contains("ef-opt")) return pick(+b.dataset.k);
      if (b.id === "efNext") { if (i === n - 1) fin(); else { i++; draw(); } }
    };
    this.kd = e => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (ans.length && !confirm(T("Leave this exam? Missed questions are saved in My Mistakes.", "تخرج من الامتحان؟ الأسئلة اللي غلطت فيها محفوظة في «أخطائي». "))) return;
        this.close();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return; const k = e.key.toLowerCase();
      if (/^[1-8]$/.test(k) || /^[a-h]$/.test(k)) { const x = /\d/.test(k) ? +k - 1 : "abcdefgh".indexOf(k); if (items[i] && x < items[i].opts.length) { pick(x); e.preventDefault(); } }
      else if ((k === "enter" || k === " ") && locked && !finished) { e.preventDefault(); const nx = q1("#efNext", sh); if (nx) nx.click(); }
    };
    D.addEventListener("keydown", this.kd, true);
    if (c.mode !== "relaxed") this.tm = setInterval(tick, 250);
    draw();
  },
  result(c, ans, n, ms) {
    const sh = this.open(), ok = ans.filter(a => a.ok).length, wrong = ans.filter(a => !a.ok), un = n - ans.length;
    const pct = Math.round(ok / n * 100), avg = ans.length ? Math.round(ans.reduce((s, a) => s + a.ms, 0) / ans.length / 100) / 10 : 0;
    const slow = ans.filter(a => a.k >= 0).sort((a, b) => b.ms - a.ms).slice(0, 3);
    logRun({ lid: c.lid || null, arg: c.arg || null, kind: c.kind || (c.review ? "review" : c.mode === "relaxed" ? "practice" : "timed"), pct, ok, n });
    let best = null;
    if (c.mode !== "relaxed" && !c.review && c.lid) { const k = "ef:tbest:" + c.lid; best = S.get(k, null); if (best == null || pct > best) { S.set(k, pct); best = pct; } }
    const tier = pct >= 90 ? B("Excellent performance", "أداء ممتاز") : pct >= 75 ? B("Very good performance", "أداء جيد جدًا") : pct >= 50 ? B("Good progress", "تقدّم كويس، كمّل") : B("Review your mistakes and try again", "راجع أخطاءك وحاول تاني");
    sh.innerHTML = `<div class="ef-qh"><button class="ef-x" data-x aria-label="Close">${I("x", 18)}</button><div class="ef-qt">${c.title}</div></div>
    <div class="ef-res0">${ring(pct, 150, 12, col(pct), pct + "%")}<h2>${tier}</h2>
    <div class="ef-stats"><div><b>${ok}</b><small>${B("Correct", "صح")}</small></div><div><b>${wrong.length}</b><small>${B("Wrong", "غلط")}</small></div>${un ? `<div><b>${un}</b><small>${B("Unanswered", "من غير إجابة")}</small></div>` : ""}<div><b>${avg}s</b><small>${B("Avg / question", "متوسط السؤال")}</small></div><div><b>${fmt(ms / 1000)}</b><small>${B("Total time", "الوقت الكلي")}</small></div></div>
    ${best != null ? `<div class="ef-badge">${I("trophy", 16)} ${B("Best timed score", "أفضل نتيجة مؤقّتة")}: ${best}%</div>` : ""}</div>
    ${slow.length >= 2 ? `<h4 class="ef-h4">${B("Questions that took longest", "أسئلة خدت وقت طويل")}</h4><div class="ef-slow">${slow.map(a => `<div><span class="ef-s">${Math.round(a.ms / 100) / 10}s</span><span class="ef-sq">${esc(strip(flat(a.it.text)).slice(0, 110))}</span>${a.ok ? "" : `<em>${B("wrong", "غلط")}</em>`}</div>`).join("")}</div>` : ""}
    ${wrong.length ? `<h4 class="ef-h4">${B("What you missed", "اللي غلطت فيه")}</h4>${wrong.map(a => `<details class="ef-wr"><summary>${R(a.it.text)}</summary><p><b>${B("Your answer", "إجابتك")}:</b> ${a.k < 0 ? B("(no answer)", "(من غير إجابة)") : R(a.it.opts[a.k])}</p><p class="g"><b>${B("Correct", "الصح")}:</b> ${R(a.it.opts[a.it.ci])}</p>${a.it.exp ? `<p class="mut">${R(a.it.exp)}</p>` : ""}</details>`).join("")}` : ""}
    <div class="ef-qf end">${wrong.length ? `<button class="ef-btn" data-r="rev">${B("Review " + wrong.length + " mistakes", "راجع " + wrong.length + " غلطة")}</button>` : ""}<button class="ef-btn ghost" data-r="again">${B("Try again", "حاول تاني")}</button><button class="ef-btn ghost" data-r="done">${B("Done", "تمام")}</button></div>`;
    animRings(sh);
    sh.onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-x") || b.dataset.r === "done") return this.close();
      if (b.dataset.r === "again") return c.kind === "smart" ? ACTS.smart(c.arg) : c.arg ? this.setup(c.arg) : this.close();
      if (b.dataset.r === "rev") return this.run({ items: wrong.map(a => a.it), title: B("Mistakes review", "مراجعة الأخطاء"), mode: "relaxed", speed: 0, review: true, arg: c.arg, lid: c.lid });
    };
  }
};

/* ================= بحث شامل ================= */
const Search = {
  idx: null, building: false, el: null, sh: null,
  async build() {
    if (this.idx || this.building) return; this.building = true; const out = [], subs = allSubjects(); let n = 0;
    for (const { s } of subs) {
      n++; const st = q1("#efSt"); if (st) st.textContent = T("Indexing ", "بجهّز الفهرس ") + n + "/" + subs.length + "...";
      try { await ensure(s); } catch (e) { continue; }
      lecsOf(s.id).forEach(L => {
        const meta = (s.code || "") + " - " + T("Lecture ", "محاضرة ") + L.number;
        L.sections.forEach((x, si) => {
          const title = strip(flat(x.title)), body = strip(flat([x.points, x.key, x.examFocus]));
          out.push({ k: "sec", sid: s.id, lid: L.id, si, title, body, meta, tn: norm(title), hay: norm(title + " " + body) });
        });
        terms(L).forEach(t => out.push({ k: "term", sid: s.id, lid: L.id, title: t.w, body: t.m, meta, tn: norm(t.w), hay: norm(t.w + " " + t.m) }));
        qs(L.id).forEach(z => { const title = strip(flat(z.text)); out.push({ k: "q", sid: s.id, lid: L.id, z, title, body: "", meta, tn: norm(title), hay: norm(title + " " + z.opts.map(o => strip(flat(o))).join(" ")) }); });
      });
    }
    this.idx = out; this.building = false; if (this.el) this.run(q1("#efSi").value);
  },
  open() {
    if (this.el) { q1("#efSi").focus(); return; }
    const el = D.createElement("div"); el.className = "ef-ov"; el.innerHTML = `<div class="ef-sheet ef-ssheet"><div class="ef-sbox">${I("search", 20)}<input id="efSi" type="search" autocomplete="off" placeholder="${esc(T("Search lectures, terms, questions...", "دوّر في المحاضرات والمصطلحات والأسئلة..."))}"><button class="ef-x" data-x aria-label="Close">${I("x", 18)}</button></div><div class="ef-mut ef-sst" id="efSt"></div><div id="efSr" class="ef-sr"></div></div>`;
    D.body.appendChild(el); D.body.classList.add("ef-lock"); this.el = el;
    el.addEventListener("click", e => {
      if (e.target === el || e.target.closest("[data-x]")) return this.close();
      const r = e.target.closest("[data-i]"); if (r) this.pick(this.hits[+r.dataset.i]);
      const c = e.target.closest("[data-rq]"); if (c) { q1("#efSi").value = c.dataset.rq; this.run(c.dataset.rq); }
    });
    let t = null; const inp = q1("#efSi"); inp.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => this.run(inp.value), 120); });
    this.kd = e => { if (e.key === "Escape") this.close(); }; D.addEventListener("keydown", this.kd);
    inp.focus(); this.run(""); this.build();
  },
  close() { if (!this.el) return; this.el.remove(); this.el = null; D.removeEventListener("keydown", this.kd); if (!Quiz.el) D.body.classList.remove("ef-lock"); },
  run(qv) {
    const box = q1("#efSr"), st = q1("#efSt"); if (!box) return; const raw = qv.trim();
    if (st) st.textContent = this.idx ? "" : T("Indexing...", "بجهّز الفهرس...");
    if (!raw) {
      const rec = S.get("ef:recent", []) || [];
      box.innerHTML = `<div class="ef-sempty">${I("search", 30)}<p>${B("Type a word to search every lecture.", "اكتب أي كلمة وهدوّر لك في كل المحاضرات.")}</p>${rec.length ? `<div class="ef-chs">${rec.map(r => `<button class="ef-ch" data-rq="${esc(r)}">${esc(r)}</button>`).join("")}</div>` : ""}</div>`; this.hits = []; return;
    }
    if (!this.idx) { box.innerHTML = ""; return; }
    const toks = norm(raw).split(/\s+/).filter(Boolean), rtoks = raw.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = []; this.idx.forEach(it => {
      if (!toks.every(t => it.hay.indexOf(t) >= 0)) return;
      let sc = it.k === "term" ? 3 : it.k === "sec" ? 2 : 0; toks.forEach(t => { if (it.tn.indexOf(t) >= 0) sc += 5; if (it.tn.indexOf(t) === 0) sc += 3; sc += 1; }); hits.push({ it, sc });
    });
    hits.sort((a, b) => b.sc - a.sc); this.hits = hits.slice(0, 40).map(h => h.it);
    const re = new RegExp("(" + rtoks.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
    const hl = s => esc(s).replace(re, "<mark>$1</mark>");
    const snip = it => { if (it.k === "q") return ""; const b = it.body; let p = 0; for (const t of rtoks) { const x = b.toLowerCase().indexOf(t); if (x >= 0) { p = x; break; } } const a = Math.max(0, p - 40); return (a > 0 ? "..." : "") + b.slice(a, a + 150) + (a + 150 < b.length ? "..." : ""); };
    const kind = { sec: B("Slide", "سلايد"), term: B("Term", "مصطلح"), q: B("Question", "سؤال") };
    box.innerHTML = this.hits.length ? this.hits.map((it, i) => `<button class="ef-res" data-i="${i}"><span class="ef-kind k-${it.k}">${kind[it.k]}</span><div><strong>${hl(it.title.slice(0, 140))}</strong><small>${esc(it.meta)}</small>${snip(it) ? `<p>${hl(snip(it))}</p>` : ""}</div></button>`).join("")
      : `<div class="ef-sempty">${I("search", 30)}<p>${B("No results. Try a shorter word.", "مفيش نتايج. جرّب كلمة أقصر.")}</p></div>`;
    if (this.hits.length) { const rec = (S.get("ef:recent", []) || []).filter(x => x !== raw); rec.unshift(raw); S.set("ef:recent", rec.slice(0, 6)); }
  },
  pick(it) {
    if (!it) return; this.close();
    if (it.k === "sec") { S.set("slide:" + it.lid, it.si); nav("/l/" + it.sid + "/" + it.lid); }
    else if (it.k === "term") nav("/cards/" + it.sid + "/" + it.lid);
    else { Quiz.run({ items: [it.z], title: B("Question", "سؤال"), mode: "relaxed", speed: 0, review: false, arg: it.lid, lid: it.lid, kind: "single" }); }
  }
};

/* ================= نسخ احتياطي ================= */
function exportData() {
  S.set("ef:lastbackup", Date.now());
  const data = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); data[k] = localStorage.getItem(k); }
  const blob = new Blob([JSON.stringify({ app: "Eto.Edu", version: 1, exportedAt: new Date().toISOString(), data }, null, 1)], { type: "application/json" });
  const a = D.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "etoedu-backup-" + dkey() + ".json"; D.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast(I("check", 16) + " " + B("Backup downloaded", "النسخة الاحتياطية اتحمّلت"));
}
function importData(file) {
  const fr = new FileReader();
  fr.onload = () => {
    try {
      const o = JSON.parse(fr.result); if (!o || o.app !== "Eto.Edu" || !o.data) throw 0;
      const keys = Object.keys(o.data);
      if (!confirm(T("Restore " + keys.length + " saved items? Matching data on this device will be replaced.", "هترجّع " + keys.length + " عنصر محفوظ؟ البيانات المطابقة على الجهاز ده هتتبدّل."))) return;
      keys.forEach(k => { try { localStorage.setItem(k, o.data[k]); } catch (e) { } });
      toast(I("check", 16) + " " + B("Restored - reloading...", "اترجّعت - بعمل ريفريش...")); setTimeout(() => location.reload(), 900);
    } catch (e) { toast(B("This is not a valid backup file.", "الملف ده مش نسخة احتياطية صحيحة.")); }
  };
  fr.readAsText(file);
}

/* ================= صفحات ================= */
const loadingHTML = t => `<div class="ef-page"><div class="ef-load"><i></i><i></i><i></i><p>${t || B("Loading...", "بحمّل...")}</p></div></div>`;
const cr = (items) => (typeof crumb === "function" && typeof HOME !== "undefined") ? crumb([HOME].concat(items)) : "";
const wtrans = (v, L) => { try { if (L) Tr.set(L.glossary); Tr.wrap(v); } catch (e) { } };

/* ---- كارت آخر النتائج (امتحانات + مؤقّت + تدريب ذكي) ---- */
function histHTML() {
  const h = (S.get(HIST, []) || []).slice(-30); if (!h.length) return "";
  const last = h.slice(-12), W2 = 260, H2 = 60, X = k => last.length > 1 ? k / (last.length - 1) * W2 : W2 / 2, Y = p => H2 - 6 - p / 100 * (H2 - 12);
  const pts = last.map((x, k) => X(k).toFixed(1) + "," + Y(x.pct).toFixed(1)).join(" ");
  const avg = a => a.length ? Math.round(a.reduce((s, x) => s + x.pct, 0) / a.length) : null;
  const a1 = avg(h.slice(-5)), a0 = avg(h.slice(-10, -5)), tr = a0 == null ? "" : a1 > a0 ? " &#8593;" : a1 < a0 ? " &#8595;" : "";
  const kind = { exam: B("Exam", "امتحان"), timed: B("Timed", "مؤقّت"), review: B("Review", "مراجعة"), smart: B("Smart", "ذكي"), practice: B("Practice", "تدريب") };
  const rows = h.slice(-6).reverse().map(x => {
    const L = (W.LECTURES || {})[x.lid], f = L ? findSubject(L.subject) : null;
    const name = L ? esc((f && f.s.code ? f.s.code + " " : "") + T("Lecture ", "محاضرة ") + L.number) : B("Mixed", "مختلط");
    return `<div class="ef-hrow"><span class="ef-hk">${kind[x.kind] || ""}${x.part ? " " + x.part : ""}</span><span>${name}<small> ${esc(new Date(x.t).toLocaleDateString())}</small></span><span class="sc" style="color:${col(x.pct)}">${x.ok}/${x.n} - ${x.pct}%</span></div>`;
  }).join("");
  return `<div class="ef-card ef-hist"><h4>${I("chart", 16)} ${B("Recent results", "آخر النتائج")}${a1 != null ? ` - ${B("last 5 avg", "متوسط آخر 5")}: <b style="color:${col(a1)}">${a1}%${tr}</b>` : ""}</h4><div class="ef-hgrid"><svg class="ef-spark" viewBox="0 0 ${W2} ${H2}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}"/>${last.map((x, k) => `<circle cx="${X(k).toFixed(1)}" cy="${Y(x.pct).toFixed(1)}" r="3"/>`).join("")}</svg><div>${rows}</div></div></div>`;
}

/* ---- لوحة التقدم ---- */
async function pageDash(v) {
  v.innerHTML = loadingHTML(); const subs = allSubjects();
  for (let k = 0; k < subs.length; k++) { v.querySelector("p").textContent = T("Loading data ", "بحمّل البيانات ") + (k + 1) + "/" + subs.length; try { await ensure(subs[k].s); } catch (e) { } }
  let tDone = 0, tSec = 0, tWrong = 0, bests = [], rows = [], weakest = null, mostWrong = null;
  const subHTML = subs.map(({ s }) => {
    const ls = lecsOf(s.id); if (!ls.length) return "";
    let d = 0, n = 0, bs = [];
    const lr = ls.map(L => {
      const sc = L.sections.length, dn = Math.min(sc, (S.get("done:" + L.id, []) || []).length), b = S.get("best:" + L.id, null), tb = S.get("ef:tbest:" + L.id, null), wr = wrongs(L.id).length, pc = sc ? dn / sc * 100 : 0;
      d += dn; n += sc; tWrong += wr; if (b != null) { bs.push(b); bests.push(b); }
      const row = { s, L, b, wr, pc }; rows.push(row);
      if (b != null && (!weakest || b < weakest.b)) weakest = row; if (wr && (!mostWrong || wr > mostWrong.wr)) mostWrong = row;
      return `<div class="ef-lrow"><a data-go="/l/${s.id}/${L.id}">${T("Lecture ", "محاضرة ") + L.number}<small>${esc(strip(flat(L.title.en || L.title)).slice(0, 38))}</small></a><div class="ef-bar"><i style="width:${pc}%"></i></div><span class="ef-dn">${dn}/${sc}</span><span class="ef-score" style="--c:${b == null ? "#94a3b8" : col(b)}">${b == null ? "-" : b + "%"}</span>${tb != null ? `<span class="ef-tb" title="Timed">${I("timer", 12)}${tb}%</span>` : ""}${wr ? `<button class="ef-pill bad" data-go="/review/${s.id}/${L.id}">${wr}</button>` : ""}</div>`;
    }).join("");
    tDone += d; tSec += n; const pc = n ? Math.round(d / n * 100) : 0, c = s.colors || ["#2563eb", "#38bdf8"];
    return `<div class="ef-sub"><div class="ef-subhd" style="background:linear-gradient(135deg,${c[0]},${c[1]})"><span class="ef-code">${esc(s.code || "")}</span><div><h3>${bi(s.title)}</h3><small>${ls.length} ${B("lectures", "محاضرة")} - ${bs.length ? B("avg score ", "متوسط الدرجات ") + Math.round(bs.reduce((a, b) => a + b, 0) / bs.length) + "%" : B("no exams yet", "لسه مفيش امتحانات")}</small></div><div class="ef-pct">${pc}%</div></div><div class="ef-lrows">${lr}</div><div class="ef-subft"><button class="ef-pillbtn" data-go="/review/${s.id}">${I("target", 14)} ${B("My mistakes", "أخطائي")}</button><button class="ef-pillbtn" data-go="/cards/${s.id}">${I("cards", 14)} ${B("Flashcards", "كروت")}</button><button class="ef-pillbtn" data-ef="setup|s:${s.id}">${I("timer", 14)} ${B("Mixed timed exam", "امتحان مؤقّت مختلط")}</button></div></div>`;
  }).join("");
  const st = streaks(), overall = tSec ? Math.round(tDone / tSec * 100) : 0, avg = bests.length ? Math.round(bests.reduce((a, b) => a + b, 0) / bests.length) : null;
  const week = []; for (let k = 6; k >= 0; k--) { const d = new Date(); d.setDate(d.getDate() - k); week.push({ n: st.a[dkey(d)] || 0, l: d.toLocaleDateString("en", { weekday: "narrow" }), now: k === 0 }); }
  const mx = Math.max(1, ...week.map(w => w.n));
  let focus;
  if (mostWrong) focus = { ic: "target", t: B("Clear your mistakes", "صفّي أخطاءك"), sub: B(tWrong + " questions are waiting for review", tWrong + " سؤال مستنيين مراجعة"), btn: B("Start review", "ابدأ المراجعة"), act: `data-ef="revq|${mostWrong.L.id}"`, cls: "red" };
  else if (weakest && weakest.b < 85) focus = { ic: "bolt", t: B("Weakest spot", "أضعف نقطة عندك"), sub: bi({ en: "Lecture " + weakest.L.number + " - best score " + weakest.b + "%", ar: "محاضرة " + weakest.L.number + " - أفضل درجة " + weakest.b + "%" }), btn: B("Timed practice", "تدريب مؤقّت"), act: `data-ef="setup|${weakest.L.id}"`, cls: "amber" };
  else { const un = rows.filter(r => r.pc < 100).sort((a, b) => a.pc - b.pc)[0]; focus = un ? { ic: "bolt", t: B("Keep studying", "كمّل مذاكرة"), sub: bi({ en: "Lecture " + un.L.number + " is " + Math.round(un.pc) + "% studied", ar: "محاضرة " + un.L.number + " اتذاكرت " + Math.round(un.pc) + "%" }), btn: B("Open lecture", "افتح المحاضرة"), act: `data-go="/l/${un.s.id}/${un.L.id}"`, cls: "blue" } : { ic: "trophy", t: B("You're all caught up", "خلّصت كل حاجة"), sub: B("Nothing pending. Great work!", "مفيش حاجة معلّقة. برافو!"), btn: "", act: "", cls: "green" }; }
  const lb = S.get("ef:lastbackup", null), stale = tDone > 0 && (!lb || Date.now() - lb > 7 * 864e5);
  v.innerHTML = `<div class="ef-page">${cr([[{ en: "Dashboard", ar: "لوحة التقدم" }, "/dash"]])}
  <div class="ef-hero"><div><h1>${B("Your progress", "تقدّمك")}</h1><p>${B("Everything you studied, in one place.", "كل اللي ذاكرته في مكان واحد.")}</p></div><div class="ef-hbtns"><button class="ef-pillbtn light" data-ef="search">${I("search", 15)} ${B("Search", "بحث")}</button></div></div>
  <div class="ef-kpis">
   <div class="ef-card ef-k"><h4>${B("Overall", "الإجمالي")}</h4>${ring(overall, 112, 10, "#38bdf8", overall + "%")}<small>${tDone}/${tSec} ${B("sections studied", "قسم اتذاكر")}</small></div>
   <div class="ef-card ef-k ef-flame"><h4>${B("Study streak", "أيام المذاكرة")}</h4><div class="ef-fl">${I("flame", 40)}</div><b class="ef-big">${st.cur}</b><small>${B("days in a row", "يوم ورا بعض")} - ${B("best", "أفضل")} ${st.best}</small></div>
   <div class="ef-card ef-k"><h4>${B("Average score", "متوسط الدرجات")}</h4>${ring(avg == null ? 0 : avg, 112, 10, avg == null ? "#94a3b8" : col(avg), avg == null ? "-" : avg + "%")}<small>${bests.length} ${B("exams taken", "امتحان")}</small></div>
   <div class="ef-card ef-k"><h4>${B("Pending mistakes", "أخطاء معلّقة")}</h4><b class="ef-big" style="color:${tWrong ? "#ef4444" : "#22c55e"}">${tWrong}</b><small>${tWrong ? B("questions to review", "سؤال للمراجعة") : B("all clear", "مفيش حاجة")}</small></div></div>
  <div class="ef-two"><div class="ef-card"><h4>${B("Last 7 days", "آخر 7 أيام")}</h4><div class="ef-week">${week.map(w => `<div class="${w.now ? "now" : ""}"><i style="height:${Math.max(6, w.n / mx * 100)}%" title="${w.n}"></i><span>${w.l}</span></div>`).join("")}</div><small>${B("Today: ", "النهاردة: ")}${st.today} ${B("actions", "نشاط")}</small></div>
   <div class="ef-card ef-focus ${focus.cls}"><div class="ef-fic">${I(focus.ic, 26)}</div><h3>${focus.t}</h3><p>${focus.sub}</p>${focus.btn ? `<button class="ef-btn light" ${focus.act}>${focus.btn}</button>` : ""}</div></div>
  ${histHTML()}<h2 class="ef-h2">${B("Subjects", "المواد")}</h2><div class="ef-subs">${subHTML || `<div class="ef-card">${B("No lectures yet.", "مفيش محاضرات لسه.")}</div>`}</div>
  <div class="ef-card ef-backup"><div><h3>${I("download", 20)} ${B("Backup & restore", "نسخة احتياطية واسترجاع")}</h3><p>${B("Your progress is stored only in this browser. Export a backup file to keep it safe or move it to another phone.", "تقدّمك محفوظ في المتصفح ده بس. صدّر ملف نسخة احتياطية عشان تحميه أو تنقله لموبايل تاني.")}</p><small>${lb ? B("Last backup: ", "آخر نسخة: ") + new Date(lb).toLocaleDateString() : B("No backup yet", "لسه ما عملتش نسخة")}</small>${stale ? `<span class="ef-pill bad" style="margin-inline-start:8px">${B("backup recommended", "يُفضّل تعمل نسخة")}</span>` : ""}</div>
   <div class="ef-row"><button class="ef-btn" data-ef="export">${I("download", 16)} ${B("Export", "تصدير")}</button><button class="ef-btn ghost" data-ef="import">${I("upload", 16)} ${B("Import", "استيراد")}</button><input type="file" id="efFile" accept=".json,application/json" hidden></div></div></div>`;
  animRings(v);
}

/* ---- أخطائي ---- */
async function pageReview(v, sid, lid) {
  const f = findSubject(sid); if (!f || f.s.soon) return nav("/");
  v.innerHTML = loadingHTML(); await ensure(f.s);
  const ls = lid ? [(W.LECTURES || {})[lid]].filter(Boolean) : lecsOf(sid), arg = lid || "s:" + sid;
  const groups = ls.map(L => ({ L, items: revItems(L.id) })).filter(g => g.items.length), total = groups.reduce((a, g) => a + g.items.length, 0);
  const crumbs = [[f.t.title, "/t/" + f.t.id], [f.s.title, "/s/" + f.s.id], [{ en: "My mistakes", ar: "أخطائي" }, "/review/" + sid + (lid ? "/" + lid : "")]];
  v.innerHTML = `<div class="ef-page">${cr(crumbs)}
  <div class="ef-hero red"><div><h1>${B("My mistakes", "أخطائي")}</h1><p>${total ? B("Answer them correctly in review and they disappear.", "جاوبهم صح في المراجعة وهيختفوا.") : B("Nothing here yet.", "لسه مفيش حاجة هنا.")}</p></div><div class="ef-hbtns"><b class="ef-bignum">${total}</b></div></div>
  ${total ? `<div class="ef-row" style="margin:14px 0"><button class="ef-btn" data-ef="revq|${arg}">${I("target", 16)} ${B("Start review", "ابدأ المراجعة")} (${total})</button><button class="ef-btn ghost" data-ef="setup|${arg}">${I("timer", 16)} ${B("Timed exam", "امتحان مؤقّت")}</button></div>` : `<div class="ef-empty">${I("trophy", 46)}<h3>${B("No mistakes saved", "مفيش أخطاء محفوظة")}</h3><p>${B("Take a timed exam - any question you miss will be saved here for review.", "اعمل امتحان مؤقّت - أي سؤال هتغلط فيه هيتحفظ هنا للمراجعة.")}</p><button class="ef-btn" data-ef="setup|${arg}">${B("Start a timed exam", "ابدأ امتحان مؤقّت")}</button></div>`}
  ${groups.map(g => `<div class="ef-card ef-grp"><div class="ef-gh"><h3>${bi({ en: "Lecture " + g.L.number + ": " + (g.L.title.en || ""), ar: "المحاضرة " + g.L.number + ": " + (g.L.title.ar || "") })}</h3><button class="ef-pillbtn" data-ef="revq|${g.L.id}">${I("target", 14)} ${B("Review", "راجع")} ${g.items.length}</button></div>
   ${g.items.map((it, k) => `<details class="ef-qi"><summary><span class="ef-n">${k + 1}</span><span class="ef-qs">${R(it.text)}</span></summary><div class="ef-qb"><ul>${it.opts.map((o, x) => `<li class="${x === it.ci ? "ok" : ""}"><b>${"ABCDEFGH"[x] || x + 1}</b> ${R(o)}</li>`).join("")}</ul>${it.exp ? `<p class="ef-mut">${R(it.exp)}</p>` : ""}<button class="ef-pillbtn" data-ef="forget|${it.lid}|${it.idx}|${sid}|${lid || ""}">${I("check", 14)} ${B("I know this now", "عرفتها دلوقتي")}</button></div></details>`).join("")}</div>`).join("")}</div>`;
  wtrans(v);
}

/* ---- Flashcards ---- */
async function pageCards(v, sid, lid) {
  const f = findSubject(sid); if (!f || f.s.soon) return nav("/");
  v.innerHTML = loadingHTML(); await ensure(f.s);
  const ls = lid ? [(W.LECTURES || {})[lid]].filter(Boolean) : lecsOf(sid), seen = new Set(), deck = [];
  ls.forEach(L => terms(L).forEach(t => { const id = L.id + "|" + t.w; if (!seen.has(id)) { seen.add(id); deck.push({ id, w: t.w, m: t.m, lid: L.id }); } }));
  const crumbs = [[f.t.title, "/t/" + f.t.id], [f.s.title, "/s/" + f.s.id], [{ en: "Flashcards", ar: "كروت المصطلحات" }, "/cards/" + sid + (lid ? "/" + lid : "")]];
  if (!deck.length) { v.innerHTML = `<div class="ef-page">${cr(crumbs)}<div class="ef-empty">${I("cards", 46)}<h3>${B("No terms in this lecture yet", "مفيش مصطلحات في المحاضرة دي لسه")}</h3><button class="ef-btn" data-go="/s/${sid}">${B("Back", "رجوع")}</button></div></div>`; return; }
  const BOX = "ef:cards"; let st = S.get(BOX, {}) || {}, rev = false, all = false, queue = [], known = 0, missed = 0, cur = null, flipped = false;
  const bx = c => (st[c.id] && st[c.id].b) || 0;
  const build = () => { const l = deck.filter(c => all || bx(c) < 3); queue = shuffle(l).sort((a, b) => bx(a) - bx(b)); known = 0; missed = 0; };
  const stats = () => { let nw = 0, lr = 0, ms = 0; deck.forEach(c => { if (!st[c.id]) nw++; else if (st[c.id].b >= 3) ms++; else lr++; }); return { nw, lr, ms }; };
  v.innerHTML = `<div class="ef-page">${cr(crumbs)}<div class="ef-hero teal"><div><h1>${B("Flashcards", "كروت المصطلحات")}</h1><p>${B("Tap the card to flip. Swipe or use the buttons.", "دوس على الكارت يتقلب. اسحب أو استخدم الأزرار.")}</p></div></div><div id="efDeck"></div></div>`;
  const root = q1("#efDeck", v);
  const draw = () => {
    const s = stats(), pctM = Math.round(s.ms / deck.length * 100);
    if (!queue.length) {
      root.innerHTML = `<div class="ef-deckhd">${chips(s)}</div><div class="ef-empty">${I("trophy", 46)}<h3>${B("Session complete", "خلّصت الجلسة")}</h3><p>${B("You knew " + known + " and missed " + missed + ".", "عرفت " + known + " وغلطت في " + missed + ".")}</p><div class="ef-row" style="justify-content:center"><button class="ef-btn" data-k="again">${B("Study again", "ذاكر تاني")}</button><button class="ef-btn ghost" data-k="all">${B("Include mastered", "حتى اللي اتقنتها")}</button></div></div>`; return;
    }
    cur = queue[0]; flipped = false; const fr = rev ? cur.m : cur.w, bk = rev ? cur.w : cur.m;
    root.innerHTML = `<div class="ef-deckhd">${chips(s)}<div class="ef-bar big"><i style="width:${pctM}%"></i></div></div>
    <div class="ef-stage" id="efStage"><div class="ef-swipe" id="efSw"><div class="ef-card3d" id="efC"><div class="ef-face front"><span class="ef-tag">${rev ? "عربي" : "English"}</span><div class="ef-term" dir="auto">${esc(fr)}</div>${rev ? "" : `<button class="ef-spk" data-k="spk" aria-label="Pronounce">${I("speaker", 18)}</button>`}<small>${B("tap to flip", "دوس عشان تقلب")}</small></div><div class="ef-face back"><span class="ef-tag">${rev ? "English" : "عربي"}</span><div class="ef-mean" dir="auto">${esc(bk)}</div></div></div><div class="ef-hint no">${B("Again", "تاني")}</div><div class="ef-hint yes">${B("Got it", "عرفتها")}</div></div></div>
    <div class="ef-rate"><button class="ef-btn no" data-k="no">${I("x", 18)} ${B("Don't know", "مش عارفها")}</button><button class="ef-btn ghost" data-k="flip">${B("Flip", "اقلب")}</button><button class="ef-btn yes" data-k="yes">${I("check", 18)} ${B("I know it", "عرفتها")}</button></div>
    <div class="ef-ctools"><button class="ef-pillbtn" data-k="shuffle">${I("shuffle", 14)} ${B("Shuffle", "اخلط")}</button><button class="ef-pillbtn" data-k="rev">${I("swap", 14)} ${B("Reverse", "اعكس")}</button><button class="ef-pillbtn ${all ? "on" : ""}" data-k="all">${B("Include mastered", "مع المتقنة")}</button><span class="ef-mut">${queue.length} ${B("left", "فاضل")}</span></div>`;
    bindSwipe();
  };
  const chips = s => `<div class="ef-cchips"><span class="n">${I("bolt", 13)} ${B("New", "جديدة")} ${s.nw}</span><span class="l">${B("Learning", "بتتعلم")} ${s.lr}</span><span class="m">${I("check", 13)} ${B("Mastered", "متقنة")} ${s.ms}</span></div>`;
  const flip = () => { const c = q1("#efC", root); if (c) { flipped = !flipped; c.classList.toggle("on", flipped); } };
  const rate = ok => {
    if (!cur) return; const sw = q1("#efSw", root), c = cur; touch();
    const fin = () => { queue.shift(); const o = st[c.id] || { b: 0 };
      if (ok) { o.b = Math.min(3, (o.b || 0) + 1); known++; } else { o.b = 0; missed++; queue.splice(Math.min(3, queue.length), 0, c); }
      o.t = Date.now(); st[c.id] = o; S.set(BOX, st); draw(); };
    if (sw) { sw.style.transition = "transform .28s ease,opacity .28s"; sw.style.transform = `translateX(${ok ? 130 : -130}%) rotate(${ok ? 18 : -18}deg)`; sw.style.opacity = "0"; setTimeout(fin, 240); } else fin();
  };
  const bindSwipe = () => {
    const stg = q1("#efStage", root), sw = q1("#efSw", root); let x0 = null, dx = 0;
    stg.addEventListener("pointerdown", e => { if (e.target.closest("[data-k]")) return; x0 = e.clientX; dx = 0; sw.style.transition = "none"; stg.setPointerCapture(e.pointerId); });
    stg.addEventListener("pointermove", e => { if (x0 == null) return; dx = e.clientX - x0; sw.style.transform = `translateX(${dx}px) rotate(${dx / 22}deg)`; sw.classList.toggle("go-yes", dx > 40); sw.classList.toggle("go-no", dx < -40); });
    const end = () => { if (x0 == null) return; const d = dx; x0 = null; sw.classList.remove("go-yes", "go-no"); if (Math.abs(d) > 100) rate(d > 0); else { sw.style.transition = "transform .25s"; sw.style.transform = ""; if (Math.abs(d) < 8) flip(); } };
    stg.addEventListener("pointerup", end); stg.addEventListener("pointercancel", end);
  };
  root.addEventListener("click", e => {
    const b = e.target.closest("[data-k]"); if (!b) return; const k = b.dataset.k;
    if (k === "flip") flip(); else if (k === "yes") rate(true); else if (k === "no") rate(false);
    else if (k === "spk") { try { const u = new SpeechSynthesisUtterance(cur.w); u.lang = "en-US"; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (er) { } }
    else if (k === "shuffle") { queue = shuffle(queue); draw(); } else if (k === "rev") { rev = !rev; draw(); }
    else if (k === "all") { all = !all; build(); draw(); } else if (k === "again") { build(); draw(); }
  });
  const kd = e => { if (!q1("#efDeck")) return; if (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); flip(); } else if (e.key === "ArrowRight") rate(true); else if (e.key === "ArrowLeft") rate(false); };
  D.addEventListener("keydown", kd); addCleanup(() => D.removeEventListener("keydown", kd));
  build(); draw();
}

/* ---- ليلة الامتحان ---- */
async function pageNight(v, sid, lid) {
  const f = findSubject(sid); if (!f || f.s.soon) return nav("/");
  v.innerHTML = loadingHTML(); await ensure(f.s);
  const L = (W.LECTURES || {})[lid]; if (!L) return nav("/s/" + sid);
  const key = "ef:night:" + lid; let got = S.get(key, []) || [];
  const cards = L.sections.map((x, i) => {
    const tmp = D.createElement("div"); tmp.innerHTML = (x.points || []).map(p => "<div>" + rich(p) + "</div>").join("");
    const seen = new Set(), fx = [];
    qa(".eqb", tmp).concat(qa(".fx", tmp).filter(e => !e.closest(".eqb"))).forEach(e => { const t = e.textContent.replace(/\s+/g, " ").trim(); if (t && !seen.has(t)) { seen.add(t); fx.push(e.outerHTML); } });
    const items = (x.examFocus && x.examFocus.length) ? x.examFocus : (x.points || []).slice(0, 2);
    return `<article class="ef-nc ${got.indexOf(x.id) >= 0 ? "got" : ""}" data-sec="${esc(x.id)}"><header><span class="ef-nnum">${i + 1}</span><h3>${rich(x.title)}</h3><button class="ef-ck" data-n="${esc(x.id)}" aria-label="Got it">${I("check", 16)}</button></header>${x.key ? `<div class="ef-nkey">${rich(x.key)}</div>` : ""}${fx.length ? `<div class="ef-nfx"><span class="ef-nl">${B("Formulas", "المعادلات")}</span>${fx.join("")}</div>` : ""}${items.length ? `<ul>${items.map(p => `<li>${rich(p)}</li>`).join("")}</ul>` : ""}</article>`;
  }).join("");
  const crumbs = [[f.t.title, "/t/" + f.t.id], [f.s.title, "/s/" + f.s.id], [{ en: "Night before", ar: "ليلة الامتحان" }, "/night/" + sid + "/" + lid]];
  v.innerHTML = `<div class="ef-page">${cr(crumbs)}<div class="ef-hero night"><div><h1>${I("moon", 28)} ${B("Night before the exam", "ليلة الامتحان")}</h1><p>${bi({ en: "Lecture " + L.number + ": " + (L.title.en || ""), ar: "المحاضرة " + L.number + ": " + (L.title.ar || "") })}</p></div></div>
  <div class="ef-nbar" id="efNb"><div class="ef-nprog"><span id="efNp"></span><div class="ef-bar big"><i id="efNpi"></i></div></div><div class="ef-ntimer"><div class="ef-chs" id="efNch"><span class="ef-mut">${B("Focus timer", "مؤقّت التركيز")}</span>${[15, 30, 45, 60].map(m => `<button class="ef-ch" data-m="${m}">${m}m</button>`).join("")}</div><div class="ef-run" id="efRun" hidden>${I("timer", 16)}<b id="efTl">00:00</b><button class="ef-pillbtn" data-m="0">${B("Stop", "إيقاف")}</button></div></div></div>
  <div class="ef-ngrid">${cards}</div>
  <div class="ef-card ef-ncta"><h3>${B("Ready? Test yourself.", "جاهز؟ اختبر نفسك.")}</h3><div class="ef-row"><button class="ef-btn" data-ef="setup|${lid}">${I("timer", 16)} ${B("Timed exam", "امتحان مؤقّت")}</button><button class="ef-btn ghost" data-go="/cards/${sid}/${lid}">${I("cards", 16)} ${B("Flashcards", "كروت")}</button></div></div></div>`;
  wtrans(v, L);
  const total = L.sections.length, prog = () => { const n = got.filter(g => L.sections.some(s => s.id === g)).length; q1("#efNp").textContent = n + " / " + total + " " + T("reviewed", "اتراجعت"); q1("#efNpi").style.width = n / total * 100 + "%"; }; prog();
  v.addEventListener("click", e => { const b = e.target.closest(".ef-ck"); if (!b) return; const id = b.dataset.n, a = b.closest(".ef-nc"); got = got.indexOf(id) >= 0 ? got.filter(x => x !== id) : got.concat(id); S.set(key, got); a.classList.toggle("got", got.indexOf(id) >= 0); touch(); prog(); });
  let tmr = null, end = 0; addCleanup(() => clearInterval(tmr));
  const run = q1("#efRun"), chs = q1("#efNch");
  const tick = () => { const left = Math.max(0, Math.ceil((end - Date.now()) / 1000)); q1("#efTl").textContent = fmt(left); if (left <= 0) { clearInterval(tmr); run.hidden = true; chs.hidden = false; try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) { } toast(I("timer", 16) + " " + B("Time is up! Now test yourself.", "الوقت خلص! دلوقتي اختبر نفسك.")); } };
  q1("#efNb").addEventListener("click", e => { const b = e.target.closest("[data-m]"); if (!b) return; const m = +b.dataset.m; clearInterval(tmr); if (!m) { run.hidden = true; chs.hidden = false; return; } end = Date.now() + m * 60000; run.hidden = false; chs.hidden = true; tick(); tmr = setInterval(tick, 500); });
}

/* ================= دمج مع الصفحات الحالية ================= */
function hubHTML(L, s) {
  const wr = wrongs(L.id).length, nq = qs(L.id).length, nt = terms(L).length, tb = S.get("ef:tbest:" + L.id, null), seen = Object.keys(qstat(L.id)).length, ac = accOf(L.id);
  const tile = (cls, ic, t, sub, attr, badge) => `<button class="ef-tile ${cls}" ${attr}><span class="ef-tic">${I(ic, 24)}</span><b>${t}</b><small>${sub}</small>${badge ? `<span class="ef-badge2">${badge}</span>` : ""}</button>`;
  return `<div class="ef-hubhd">${I("bolt", 20)}<h3>${B("Smart study tools", "أدوات المذاكرة الذكية")}</h3>${tb != null ? `<span class="ef-pill">${I("trophy", 13)} ${tb}%</span>` : ""}</div><div class="ef-tiles">
  ${nq ? tile("t1", "timer", B("Timed exam", "امتحان مؤقّت"), B("Practice under time limits", "تدرّب بوقت محدد"), `data-ef="setup|${L.id}"`) : ""}
  ${tile("t2", "target", B("My mistakes", "أخطائي"), wr ? B(wr + " to review", wr + " للمراجعة") : B("All clear", "مفيش أخطاء"), `data-go="/review/${s.id}/${L.id}"`, wr || "")}
  ${nt ? tile("t3", "cards", B("Flashcards", "كروت المصطلحات"), nt + " " + B("terms", "مصطلح"), `data-go="/cards/${s.id}/${L.id}"`) : ""}
  ${nq ? tile("t5", "bolt", B("Smart practice", "تدريب ذكي"), ac == null ? B("10 questions picked for you", "10 أسئلة مختارة ليك") : B(seen + "/" + nq + " solved - " + ac + "% right", seen + "/" + nq + " اتحلّت - " + ac + "% صح"), `data-ef="smart|${L.id}"`) : ""}
  ${tile("t4", "moon", B("Night before", "ليلة الامتحان"), B("Quick summary", "ملخص سريع"), `data-go="/night/${s.id}/${L.id}"`)}</div>`;
}
function refreshHub() { const h = q1(".ef-hub"); if (!h) return; const L = (W.LECTURES || {})[h.dataset.lid], f = findSubject(h.dataset.sid); if (L && f) h.innerHTML = hubHTML(L, f.s); }

const ACTS = {
  setup: a => Quiz.setup(a),
  revq: a => { const it = revItems(a); if (!it.length) return toast(B("No mistakes to review", "مفيش أخطاء للمراجعة")); Quiz.run({ items: shuffle(it), title: B("Mistakes review", "مراجعة الأخطاء"), mode: "relaxed", speed: 0, review: true, arg: a, lid: a.indexOf("s:") === 0 ? null : a }); },
  smart: a => {
    const all = pool(a); if (!all.length) return toast(B("No questions found here.", "مفيش أسئلة هنا."));
    Quiz.run({ items: smartPick(all, 10), title: B("Smart practice", "تدريب ذكي") + " - " + titleHTML(a), mode: "relaxed", speed: 0, review: false, arg: a, lid: a.indexOf("s:") === 0 ? null : a, kind: "smart" });
  },
  export: () => exportData(),
  import: () => { const f = q1("#efFile"); if (f) f.click(); },
  search: () => Search.open(),
  forget: (lid, idx, sid, l) => { delWrong(lid, +idx); touch(); const v = D.getElementById("view"); pageReview(v, sid, l || undefined); }
};

const EF = {
  handles: p => p === "dash" || p === "cards" || p === "night" || p === "review",
  async render(p) {
    runCleanups(); const v = D.getElementById("view");
    try {
      if (p[0] === "dash") return await pageDash(v);
      if (p[0] === "cards") return await pageCards(v, p[1], p[2]);
      if (p[0] === "night") return await pageNight(v, p[1], p[2]);
      if (p[0] === "review") return await pageReview(v, p[1], p[2]);
    } catch (e) { v.innerHTML = `<div class="empty"><h3>Something went wrong</h3><p>${esc(e.message)}</p><button class="btn" data-go="/">Home</button></div>`; }
  },
  lecture(L, s) {
    S.set("ef:last", { sid: s.id, lid: L.id, t: { en: "Lecture " + L.number + ": " + (L.title.en || ""), ar: "المحاضرة " + L.number + ": " + (L.title.ar || "") } }); touch();
    const go0 = q1(".go"); if (!go0 || q1(".ef-hub")) return;
    const h = D.createElement("section"); h.className = "ef-hub"; h.dataset.lid = L.id; h.dataset.sid = s.id; h.innerHTML = hubHTML(L, s); go0.insertAdjacentElement("beforebegin", h);
  },
  subject(s) {
    const ls = lecsOf(s.id), wr = ls.reduce((a, l) => a + wrongs(l.id).length, 0), nt = ls.reduce((a, l) => a + terms(l).length, 0), nq = ls.reduce((a, l) => a + qs(l.id).length, 0), seen = ls.reduce((a, l) => a + Object.keys(qstat(l.id)).length, 0);
    const tile = (cls, ic, t, sub, attr, badge) => `<button class="ef-tile ${cls}" ${attr}><span class="ef-tic">${I(ic, 24)}</span><b>${t}</b><small>${sub}</small>${badge ? `<span class="ef-badge2">${badge}</span>` : ""}</button>`;
    const el = D.createElement("div"); el.className = "ef-subhub";
    el.innerHTML = `<div class="sechd"><h2>${B("Smart review", "مراجعة ذكية")}</h2></div><div class="ef-tiles">
    ${nq ? tile("t1", "timer", B("Mixed timed exam", "امتحان مؤقّت مختلط"), nq + " " + B("questions", "سؤال"), `data-ef="setup|s:${s.id}"`) : ""}
    ${tile("t2", "target", B("My mistakes", "أخطائي"), wr ? B(wr + " to review", wr + " للمراجعة") : B("All clear", "مفيش أخطاء"), `data-go="/review/${s.id}"`, wr || "")}
    ${nt ? tile("t3", "cards", B("Flashcards", "كروت المصطلحات"), nt + " " + B("terms", "مصطلح"), `data-go="/cards/${s.id}"`) : ""}
    ${nq ? tile("t5", "bolt", B("Smart practice", "تدريب ذكي"), seen ? B(seen + "/" + nq + " solved", seen + "/" + nq + " اتحلّت") : B("10 questions picked for you", "10 أسئلة مختارة ليك"), `data-ef="smart|s:${s.id}"`) : ""}
    ${tile("t4", "chart", B("Dashboard", "لوحة التقدم"), B("Your progress", "تقدّمك"), `data-go="/dash"`)}</div>`;
    const hds = qa(".sechd", D.getElementById("view")), tools = hds[1];
    if (tools) tools.insertAdjacentElement("beforebegin", el); else D.getElementById("view").appendChild(el);
  },

  home() {
    const h = q1(".hhero");
    const tracks = q1(".tracks");
    if (!h || !tracks || q1(".ef-strip")) return;

    const st = streaks();
    const last = S.get("ef:last", null);
    const el = D.createElement("div");
    el.className = "ef-strip";

    el.innerHTML = `<div class="ef-pillrow"><span class="ef-streak">${I("flame", 18)} <b>${st.cur}</b> ${B("day streak", "يوم متتالي")}</span><button class="ef-pillbtn" data-go="/dash">${I("chart", 16)} ${B("Dashboard", "لوحة التقدم")}</button><button class="ef-pillbtn" data-ef="search">${I("search", 16)} ${B("Search", "بحث")}</button></div>`;

    if (last && last.sid && last.lid) {
      const sl = S.get("slide:" + last.lid, 0);
      const resume = D.createElement("button");

      resume.type = "button";
      resume.className = "ef-cont";
      resume.dataset.go = `/l/${last.sid}/${last.lid}`;

      resume.innerHTML = `<span class="ef-cl">${B("Continue studying", "كمّل مذاكرتك")}</span><strong>${bi(last.t)}</strong><small>${B("Slide", "سلايد")} ${(+sl || 0) + 1}</small><span class="ef-ar" aria-hidden="true">&#8594;</span>`;

      el.appendChild(resume);
    }

    tracks.insertAdjacentElement("afterend", el);
  },
  touch, recordWrong: addWrong, openSearch: () => Search.open(),
  /* بيتندهّ من exam.js لما امتحان الاختيار من متعدد يخلص: res = [{idx, ok}] (ok = null لو السؤال ماتجاوبش) */
  examDone(lid, res, meta) {
    if (!lid || !Array.isArray(res) || !res.length) return;
    let ok = 0; res.forEach(r => { if (r.ok) ok++; if (r.ok !== null && r.idx != null) answer(lid, r.idx, !!r.ok, false); });
    logRun({ lid, kind: "exam", pct: Math.round(ok / res.length * 100), ok, n: res.length, part: (meta && meta.part) || null });
    touch(res.length);
  },
  openMistakes: lid => ACTS.revq(lid),
  openSmart: a => ACTS.smart(a),
  accuracy: accOf
};

W.EF = EF;

/* ================= CSS ================= */
const css = `
:root{--efa:#1d4ed8;--efb:#38bdf8;--efok:#15803d;--efbad:#b91c1c;--efamb:#b45309}
body.ef-lock{overflow:hidden}
.ef-i{flex:none;vertical-align:middle}
.ef-ib{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:12px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.12);color:inherit;cursor:pointer;transition:.2s}
.ef-ib:hover{background:rgba(255,255,255,.25);transform:translateY(-1px)}
.ef-toast{position:fixed;left:50%;bottom:26px;transform:translate(-50%,30px);opacity:0;z-index:2000;background:#0f2a4a;color:#fff;border:1px solid rgba(255,255,255,.18);padding:11px 18px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:.3s;pointer-events:none;display:flex;gap:8px;align-items:center;max-width:90vw}
.ef-toast.on{opacity:1;transform:translate(-50%,0)}
/* overlay + sheet */
.ef-ov{position:fixed;inset:0;z-index:1000;display:flex;align-items:flex-start;justify-content:center;background:rgba(5,12,26,.8);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);overflow:auto;padding:max(14px,env(safe-area-inset-top)) 12px max(24px,env(safe-area-inset-bottom));animation:efFade .25s}
@keyframes efFade{from{opacity:0}to{opacity:1}}@keyframes efPop{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}
.ef-sheet{width:100%;max-width:760px;margin:auto;background:linear-gradient(160deg,#12315a,#0a1a30);color:#eaf2ff;border:1px solid rgba(255,255,255,.12);border-radius:26px;padding:20px;box-shadow:0 30px 80px rgba(0,0,0,.5);animation:efPop .35s cubic-bezier(.2,.8,.2,1)}
.ef-sheet h2{margin:.2em 0;font-size:1.5rem}.ef-sheet h4{margin:18px 0 8px;opacity:.75;font-size:.82rem;letter-spacing:.06em;text-transform:uppercase}
.ef-mut{opacity:.7;font-size:.9rem}
.ef-qh{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.ef-qt{flex:1;font-weight:700;opacity:.9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ef-x{width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.ef-x:hover{background:rgba(255,255,255,.2)}
.ef-clock{display:inline-flex;gap:6px;align-items:center;font-weight:800;font-variant-numeric:tabular-nums;background:rgba(56,189,248,.16);border:1px solid rgba(56,189,248,.4);color:#7dd3fc;padding:6px 12px;border-radius:999px;transition:.3s}
.ef-clock.warn{background:rgba(239,68,68,.2);border-color:#ef4444;color:#fecaca;animation:efPulse .9s infinite}
@keyframes efPulse{50%{transform:scale(1.07)}}
.ef-pb{height:6px;border-radius:6px;background:rgba(255,255,255,.12);overflow:hidden}.ef-pb i{display:block;height:100%;background:linear-gradient(90deg,var(--efa),var(--efb));transition:width .4s}
.ef-qn{margin:14px 0 6px;font-size:.82rem;opacity:.7;font-weight:600}
.ef-qtext{font-size:1.18rem;font-weight:700;line-height:1.6;margin-bottom:14px}
.ef-opts{display:grid;gap:10px}
.ef-opt{display:flex;gap:12px;align-items:flex-start;text-align:start;width:100%;padding:13px 14px;border-radius:16px;border:1.5px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:inherit;font:inherit;cursor:pointer;transition:.18s}
.ef-opt:hover:not(:disabled){background:rgba(255,255,255,.13);transform:translateX(3px);border-color:rgba(56,189,248,.6)}
.ef-opt b{flex:none;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.14);display:inline-flex;align-items:center;justify-content:center;font-size:.85rem}
.ef-opt span{padding-top:2px;line-height:1.55}
.ef-opt.ok{background:linear-gradient(135deg,rgba(34,197,94,.3),rgba(34,197,94,.14));border-color:#22c55e}.ef-opt.ok b{background:#22c55e;color:#04210f}
.ef-opt.bad{background:linear-gradient(135deg,rgba(239,68,68,.3),rgba(239,68,68,.12));border-color:#ef4444;animation:efShake .4s}.ef-opt.bad b{background:#ef4444}
.ef-opt.dim{opacity:.5}
@keyframes efShake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.ef-fbx{margin-top:14px;padding:12px 14px;border-radius:14px;line-height:1.6;animation:efFade .3s}
.ef-fbx.ok{background:rgba(34,197,94,.14);border:1px solid rgba(34,197,94,.45)}.ef-fbx.bad{background:rgba(239,68,68,.13);border:1px solid rgba(239,68,68,.45)}
.ef-fbx strong{display:inline-flex;gap:6px;align-items:center}.ef-fbx p{margin:.4em 0 0;opacity:.9}
.ef-qf{display:flex;gap:10px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}.ef-qf.end{justify-content:center}
.ef-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:14px;padding:12px 22px;font:inherit;font-weight:800;color:#fff;cursor:pointer;background:linear-gradient(135deg,var(--efa),#0ea5e9);box-shadow:0 8px 22px rgba(37,99,235,.35);transition:.2s}
.ef-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 28px rgba(37,99,235,.45)}.ef-btn:disabled{opacity:.35;cursor:default;box-shadow:none}
.ef-btn.ghost{background:rgba(127,127,127,.14);color:inherit;box-shadow:none;border:1px solid rgba(127,127,127,.3)}
.ef-btn.big{width:100%;margin-top:22px;padding:15px;font-size:1.05rem}
.ef-btn.light{background:rgba(255,255,255,.95);color:#12355b;box-shadow:none}
.ef-btn.no{background:linear-gradient(135deg,#ef4444,#f97316);box-shadow:0 8px 22px rgba(239,68,68,.3)}.ef-btn.yes{background:linear-gradient(135deg,#16a34a,#22c55e);box-shadow:0 8px 22px rgba(34,197,94,.3)}
.ef-setup{text-align:center}.ef-setup h4{text-align:start}.ef-bigic{display:inline-flex;width:70px;height:70px;align-items:center;justify-content:center;border-radius:22px;background:linear-gradient(135deg,var(--efa),var(--efb));margin-bottom:6px;box-shadow:0 12px 30px rgba(37,99,235,.5)}
.ef-chs{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.ef-ch{padding:8px 16px;border-radius:999px;border:1.5px solid rgba(127,127,127,.35);background:rgba(127,127,127,.1);color:inherit;font:inherit;font-weight:700;cursor:pointer;transition:.18s}
.ef-ch:hover{border-color:var(--efb)}.ef-ch.on{background:linear-gradient(135deg,var(--efa),#0ea5e9);border-color:transparent;color:#fff}
.ef-modes{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.ef-mode{display:flex;flex-direction:column;gap:4px;text-align:start;padding:13px;border-radius:16px;border:1.5px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:inherit;font:inherit;cursor:pointer;transition:.18s}
.ef-mode small{opacity:.65}.ef-mode:hover{border-color:var(--efb)}.ef-mode.on{border-color:var(--efb);background:rgba(56,189,248,.16);box-shadow:0 0 0 3px rgba(56,189,248,.18)}
/* results */
.ef-res0{text-align:center;padding:6px 0}.ef-ringw{position:relative;display:inline-flex;align-items:center;justify-content:center}.ef-ringw span{position:absolute;font-weight:800;font-size:1.45rem}
.ef-rg{transition:stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)}
.ef-stats{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px}.ef-stats div{min-width:90px;padding:10px 14px;border-radius:16px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1)}
.ef-stats b{display:block;font-size:1.3rem}.ef-stats small{opacity:.65}
.ef-badge{display:inline-flex;gap:6px;align-items:center;margin-top:12px;padding:6px 14px;border-radius:999px;background:rgba(245,158,11,.18);border:1px solid rgba(245,158,11,.5);color:#fcd34d;font-weight:700}
.ef-h4{margin:20px 0 8px;opacity:.8}.ef-slow{display:grid;gap:8px}.ef-slow div{display:flex;gap:10px;align-items:center;padding:9px 12px;border-radius:12px;background:rgba(255,255,255,.06)}
.ef-s{font-weight:800;color:#fbbf24;min-width:48px}.ef-sq{flex:1;font-size:.9rem;opacity:.9}.ef-slow em{font-style:normal;font-size:.75rem;color:#fca5a5}
.ef-wr{margin:8px 0;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);overflow:hidden}.ef-wr summary{padding:12px 14px;cursor:pointer;font-weight:600;line-height:1.55}
.ef-wr p{margin:0;padding:4px 14px 10px}.ef-wr .g{color:#86efac}.ef-wr .mut{opacity:.7}
/* search */
.ef-ssheet{max-width:680px}.ef-sbox{display:flex;align-items:center;gap:10px;padding:6px 8px 6px 14px;border-radius:16px;background:rgba(255,255,255,.1);border:1.5px solid rgba(56,189,248,.5)}
.ef-sbox input{flex:1;background:none;border:0;outline:0;color:inherit;font:inherit;font-size:1.05rem;padding:10px 4px;min-width:0}.ef-sbox input::placeholder{color:rgba(255,255,255,.5)}
.ef-sst{min-height:20px;margin:6px 4px}.ef-sr{display:grid;gap:8px;max-height:62vh;overflow:auto;padding:2px}
.ef-res{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:start;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:inherit;font:inherit;cursor:pointer;transition:.18s}
.ef-res:hover{background:rgba(255,255,255,.13);transform:translateY(-1px)}.ef-res strong{display:block;line-height:1.4}.ef-res small{opacity:.6;display:block;margin:2px 0}.ef-res p{margin:4px 0 0;font-size:.88rem;opacity:.8;line-height:1.55}
.ef-res mark{background:rgba(250,204,21,.4);color:inherit;border-radius:4px;padding:0 2px}
.ef-kind{flex:none;font-size:.7rem;font-weight:800;padding:4px 9px;border-radius:999px;margin-top:2px}.k-sec{background:rgba(56,189,248,.2);color:#7dd3fc}.k-term{background:rgba(34,197,94,.2);color:#86efac}.k-q{background:rgba(245,158,11,.2);color:#fcd34d}
.ef-sempty{text-align:center;padding:30px 10px;opacity:.85}.ef-sempty .ef-chs{justify-content:center;margin-top:10px}
/* pages */
.ef-page{max-width:1000px;margin:0 auto;padding:0 12px 60px;animation:efFade .35s}
.ef-hero{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin:14px 0 18px;padding:26px;border-radius:26px;color:#fff;background:linear-gradient(135deg,#1d4ed8,#0ea5e9);box-shadow:0 16px 40px rgba(37,99,235,.28);position:relative;overflow:hidden}
.ef-hero:after{content:"";position:absolute;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.1);right:-70px;top:-90px}
.ef-hero h1{margin:0;font-size:1.7rem;display:flex;gap:10px;align-items:center}.ef-hero p{margin:6px 0 0;opacity:.9}.ef-hero.red{background:linear-gradient(135deg,#be123c,#f97316)}.ef-hero.teal{background:linear-gradient(135deg,#0f766e,#14b8a6)}.ef-hero.night{background:linear-gradient(135deg,#312e81,#6d28d9 60%,#2563eb)}
.ef-bignum{font-size:3.2rem;line-height:1;position:relative;z-index:1}.ef-hbtns{position:relative;z-index:1}
.ef-card{background:rgba(127,127,127,.09);border:1px solid rgba(127,127,127,.22);border-radius:22px;padding:18px;backdrop-filter:blur(6px)}
.ef-card h4{margin:0 0 10px;opacity:.7;font-size:.8rem;text-transform:uppercase;letter-spacing:.06em}
.ef-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin-bottom:14px}
.ef-k{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;transition:.2s}.ef-k:hover{transform:translateY(-3px)}.ef-k small{opacity:.7}
.ef-big{font-size:3rem;line-height:1.1}.ef-flame{background:linear-gradient(160deg,rgba(249,115,22,.22),rgba(239,68,68,.1))}.ef-fl{color:#f97316;animation:efFlame 1.6s ease-in-out infinite}@keyframes efFlame{50%{transform:scale(1.15) rotate(-4deg)}}
.ef-two{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-bottom:6px}
.ef-week{display:flex;align-items:flex-end;gap:10px;height:120px;margin:6px 0 10px}.ef-week div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:6px}
.ef-week i{width:100%;max-width:34px;border-radius:8px 8px 4px 4px;background:rgba(56,189,248,.45);transition:height .6s}.ef-week .now i{background:linear-gradient(180deg,var(--efb),var(--efa))}.ef-week span{font-size:.72rem;opacity:.7}
.ef-focus{color:#fff;display:flex;flex-direction:column;gap:6px;border:0}.ef-focus h3{margin:4px 0 0}.ef-focus p{margin:0 0 8px;opacity:.92}.ef-focus .ef-btn{align-self:flex-start}
.ef-focus.red{background:linear-gradient(135deg,#be123c,#f97316)}.ef-focus.amber{background:linear-gradient(135deg,#d97706,#f59e0b)}.ef-focus.blue{background:linear-gradient(135deg,#1d4ed8,#0ea5e9)}.ef-focus.green{background:linear-gradient(135deg,#15803d,#22c55e)}
.ef-fic{width:46px;height:46px;border-radius:14px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center}
.ef-h2{margin:26px 0 12px}.ef-subs{display:grid;gap:16px}
.ef-sub{border-radius:22px;overflow:hidden;border:1px solid rgba(127,127,127,.22);background:rgba(127,127,127,.07)}
.ef-subhd{display:flex;align-items:center;gap:14px;padding:16px 18px;color:#fff}.ef-subhd h3{margin:0}.ef-subhd small{opacity:.9}.ef-subhd>div:nth-child(2){flex:1}
.ef-code{width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.85rem}.ef-pct{font-size:1.5rem;font-weight:800}
.ef-lrows{padding:6px 12px}.ef-lrow{display:flex;align-items:center;gap:10px;padding:9px 6px;border-bottom:1px dashed rgba(127,127,127,.25);flex-wrap:wrap}.ef-lrow:last-child{border:0}
.ef-lrow a{flex:1 1 150px;cursor:pointer;font-weight:700;color:inherit;text-decoration:none}.ef-lrow a small{display:block;font-weight:400;opacity:.65}
.ef-bar{flex:1 1 90px;height:8px;border-radius:8px;background:rgba(127,127,127,.22);overflow:hidden;min-width:70px}.ef-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--efa),var(--efb));border-radius:8px;transition:width .5s}.ef-bar.big{height:10px;margin-top:10px}
.ef-dn{font-size:.82rem;opacity:.7;min-width:34px;text-align:center}.ef-score{min-width:46px;text-align:center;font-weight:800;font-size:.85rem;padding:3px 8px;border-radius:999px;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c)}
.ef-tb{display:inline-flex;gap:3px;align-items:center;font-size:.75rem;opacity:.8}
.ef-pill{display:inline-flex;gap:5px;align-items:center;font-size:.75rem;font-weight:800;padding:3px 10px;border-radius:999px;background:rgba(245,158,11,.2);color:#d97706;border:0}.ef-pill.bad{background:rgba(239,68,68,.18);color:#ef4444;cursor:pointer}
.ef-subft{display:flex;gap:8px;flex-wrap:wrap;padding:10px 14px 14px}
.ef-pillbtn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;border:1px solid rgba(127,127,127,.32);background:rgba(127,127,127,.12);color:inherit;font:inherit;font-weight:700;font-size:.85rem;cursor:pointer;transition:.18s}
.ef-pillbtn:hover{transform:translateY(-2px);border-color:var(--efb)}.ef-pillbtn.light{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.5);color:#fff}.ef-pillbtn.on{background:var(--efa);color:#fff;border-color:transparent}
.ef-backup{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-top:22px}.ef-backup h3{margin:0 0 6px;display:flex;gap:8px;align-items:center}.ef-backup p{margin:0 0 6px;max-width:520px;opacity:.85}
.ef-row{display:flex;gap:10px;flex-wrap:wrap}
.ef-empty{text-align:center;padding:40px 16px;opacity:.95}.ef-empty h3{margin:10px 0 4px}.ef-empty p{max-width:420px;margin:0 auto 16px;opacity:.75}
.ef-load{text-align:center;padding:60px 0;opacity:.8}.ef-load i{display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--efb);margin:0 4px;animation:efDot 1s infinite}.ef-load i:nth-child(2){animation-delay:.15s}.ef-load i:nth-child(3){animation-delay:.3s}@keyframes efDot{50%{transform:translateY(-10px);opacity:.4}}
/* mistakes page */
.ef-grp{margin-bottom:14px}.ef-gh{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:8px}.ef-gh h3{margin:0;font-size:1.05rem}
.ef-qi{border-radius:14px;border:1px solid rgba(127,127,127,.22);margin:8px 0;background:rgba(127,127,127,.06);overflow:hidden}.ef-qi summary{display:flex;gap:10px;align-items:flex-start;padding:12px;cursor:pointer;font-weight:600;line-height:1.55;list-style:none}.ef-qi summary::-webkit-details-marker{display:none}
.ef-n{flex:none;width:26px;height:26px;border-radius:50%;background:rgba(239,68,68,.18);color:#ef4444;display:inline-flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:800}
.ef-qb{padding:0 14px 14px}.ef-qb ul{list-style:none;padding:0;margin:0 0 8px;display:grid;gap:6px}.ef-qb li{padding:8px 12px;border-radius:10px;background:rgba(127,127,127,.1)}.ef-qb li.ok{background:rgba(34,197,94,.18);border:1px solid rgba(34,197,94,.5)}.ef-qb li b{opacity:.6;margin-inline-end:6px}
/* flashcards */
.ef-deckhd{margin:6px 0 14px}.ef-cchips{display:flex;gap:8px;flex-wrap:wrap}.ef-cchips span{display:inline-flex;gap:5px;align-items:center;padding:5px 12px;border-radius:999px;font-size:.8rem;font-weight:800}
.ef-cchips .n{background:rgba(56,189,248,.2);color:#0ea5e9}.ef-cchips .l{background:rgba(245,158,11,.2);color:#d97706}.ef-cchips .m{background:rgba(34,197,94,.2);color:#16a34a}
.ef-stage{perspective:1200px;max-width:460px;height:300px;margin:18px auto;touch-action:pan-y;user-select:none}
.ef-swipe{position:relative;width:100%;height:100%;cursor:grab}
.ef-card3d{position:relative;width:100%;height:100%;transition:transform .6s cubic-bezier(.2,.8,.2,1);transform-style:preserve-3d}.ef-card3d.on{transform:rotateY(180deg)}
.ef-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:28px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:26px;text-align:center;color:#fff;box-shadow:0 20px 50px rgba(0,0,0,.28)}
.ef-face.front{background:linear-gradient(145deg,#1d4ed8,#0ea5e9)}.ef-face.back{background:linear-gradient(145deg,#0f766e,#14b8a6);transform:rotateY(180deg)}
.ef-face:before{content:"";position:absolute;inset:0;border-radius:28px;background:radial-gradient(circle at 20% 15%,rgba(255,255,255,.22),transparent 55%)}
.ef-tag{position:absolute;top:16px;inset-inline-start:18px;font-size:.72rem;font-weight:800;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.2)}
.ef-term{font-size:2rem;font-weight:800;line-height:1.3;word-break:break-word;position:relative}.ef-mean{font-size:1.7rem;font-weight:700;line-height:1.6;position:relative;word-break:break-word}.ef-face small{position:absolute;bottom:14px;opacity:.7}
.ef-spk{position:absolute;top:12px;inset-inline-end:14px;width:38px;height:38px;border-radius:12px;border:0;background:rgba(255,255,255,.22);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}
.ef-hint{position:absolute;top:18px;padding:6px 14px;border-radius:10px;font-weight:800;opacity:0;transition:.15s;border:2px solid;pointer-events:none;z-index:3}.ef-hint.no{left:14px;color:#fecaca;border-color:#ef4444;background:rgba(239,68,68,.35);transform:rotate(-8deg)}.ef-hint.yes{right:14px;color:#bbf7d0;border-color:#22c55e;background:rgba(34,197,94,.35);transform:rotate(8deg)}
.ef-swipe.go-no .ef-hint.no,.ef-swipe.go-yes .ef-hint.yes{opacity:1}
.ef-rate{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.ef-ctools{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center;margin-top:16px}
/* night */
.ef-nbar{position:sticky;top:6px;z-index:30;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:16px;padding:12px 16px;border-radius:18px;background:rgba(20,30,60,.92);color:#fff;backdrop-filter:blur(10px);box-shadow:0 10px 30px rgba(0,0,0,.25)}
.ef-nprog{flex:1 1 200px}.ef-nprog span{font-size:.85rem;font-weight:700}.ef-nbar .ef-ch{padding:5px 12px;color:#fff}.ef-nbar .ef-mut{color:#fff}
.ef-run{display:flex;gap:8px;align-items:center}.ef-run b{font-size:1.2rem;font-variant-numeric:tabular-nums;color:#7dd3fc}.ef-nbar .ef-pillbtn{color:#fff}
.ef-ngrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}
.ef-nc{position:relative;padding:16px;border-radius:22px;background:rgba(127,127,127,.09);border:1.5px solid rgba(127,127,127,.22);transition:.25s}.ef-nc.got{opacity:.6;border-color:#22c55e;background:rgba(34,197,94,.1)}
.ef-nc header{display:flex;gap:10px;align-items:flex-start;margin-bottom:8px}.ef-nc h3{flex:1;margin:0;font-size:1.02rem;line-height:1.5}
.ef-nnum{flex:none;width:30px;height:30px;border-radius:10px;background:linear-gradient(135deg,#6d28d9,#2563eb);color:#fff;font-weight:800;display:inline-flex;align-items:center;justify-content:center;font-size:.85rem}
.ef-ck{flex:none;width:34px;height:34px;border-radius:50%;border:2px solid rgba(127,127,127,.4);background:none;color:transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:.2s}.ef-nc.got .ef-ck{background:#22c55e;border-color:#22c55e;color:#fff;transform:scale(1.08)}
.ef-nkey{padding:10px 12px;border-radius:12px;background:rgba(245,158,11,.14);border-inline-start:4px solid #f59e0b;margin-bottom:8px;line-height:1.6}
.ef-nfx{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px}.ef-nl{font-size:.72rem;font-weight:800;opacity:.65;text-transform:uppercase}
.ef-nc ul{margin:0;padding-inline-start:20px;line-height:1.7}.ef-ncta{margin-top:18px;text-align:center}.ef-ncta .ef-row{justify-content:center}
/* hubs + tiles */
.ef-hub,.ef-subhub{max-width:860px;margin:22px auto}.ef-subhub{max-width:none}
.ef-hubhd{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--efa)}.ef-hubhd h3{margin:0;flex:1}
.ef-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
.ef-tile{position:relative;display:flex;flex-direction:column;gap:4px;align-items:flex-start;text-align:start;padding:16px;border-radius:20px;border:0;color:#fff;font:inherit;cursor:pointer;overflow:hidden;transition:.25s;box-shadow:0 10px 26px rgba(0,0,0,.18)}
.ef-tile:hover{transform:translateY(-4px) scale(1.01)}.ef-tile:after{content:"";position:absolute;width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.14);right:-30px;bottom:-40px}
.ef-tile b{font-size:1.02rem}.ef-tile small{opacity:.9}.ef-tic{width:42px;height:42px;border-radius:13px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;margin-bottom:6px}
.ef-tile.t1{background:linear-gradient(135deg,#2563eb,#0ea5e9)}.ef-tile.t2{background:linear-gradient(135deg,#e11d48,#f97316)}.ef-tile.t3{background:linear-gradient(135deg,#0f766e,#22c55e)}.ef-tile.t4{background:linear-gradient(135deg,#4338ca,#8b5cf6)}
.ef-badge2{position:absolute;top:12px;inset-inline-end:12px;min-width:26px;height:26px;padding:0 8px;border-radius:999px;background:#fff;color:#be123c;font-weight:800;font-size:.8rem;display:flex;align-items:center;justify-content:center;z-index:1}
/* home strip */
.ef-strip{max-width:980px;margin:18px auto 0;padding:0 14px;display:grid;gap:12px}.ef-pillrow{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.ef-streak{display:inline-flex;gap:6px;align-items:center;padding:8px 16px;border-radius:999px;font-weight:700;color:#fff;background:linear-gradient(135deg,#f97316,#ef4444);box-shadow:0 8px 20px rgba(239,68,68,.3)}
.ef-cont{position:relative;display:flex;flex-direction:column;gap:2px;align-items:flex-start;text-align:start;padding:16px 20px;border-radius:20px;border:1px solid rgba(127,127,127,.28);background:linear-gradient(135deg,rgba(37,99,235,.18),rgba(14,165,233,.1));color:inherit;font:inherit;cursor:pointer;transition:.2s}
.ef-cont:hover{transform:translateY(-2px);border-color:var(--efb)}.ef-cl{font-size:.75rem;font-weight:800;color:var(--efa);text-transform:uppercase;letter-spacing:.06em}.ef-cont small{opacity:.7}.ef-ar{position:absolute;inset-inline-end:20px;top:50%;transform:translateY(-50%);font-size:1.6rem;color:var(--efa)}
/* Professional interface improvements */
.ef-page{max-width:1120px;padding-inline:clamp(14px,2vw,24px)}

.ef-hero{border-radius:22px;box-shadow:0 14px 36px rgba(15,23,42,.16);isolation:isolate}
.ef-hero:after{pointer-events:none}

.ef-card,.ef-sub,.ef-nc,.ef-qi{border-color:rgba(127,127,127,.18);box-shadow:0 8px 24px rgba(15,23,42,.045)}

.ef-tiles{grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:14px}
.ef-tile{min-height:156px;padding:18px;border-radius:18px;box-shadow:0 8px 20px rgba(15,23,42,.14)}
.ef-tile:hover{transform:translateY(-3px);box-shadow:0 14px 26px rgba(15,23,42,.2)}

.ef-tile.t1{background:linear-gradient(135deg,#1d4ed8,#2563eb)}
.ef-tile.t2{background:linear-gradient(135deg,#9f1239,#e11d48)}
.ef-tile.t3{background:linear-gradient(135deg,#115e59,#0f766e)}
.ef-tile.t4{background:linear-gradient(135deg,#3730a3,#4f46e5)}

.ef-tile:after{pointer-events:none}

.ef-page button:focus-visible,
.ef-ov button:focus-visible,
.ef-page a:focus-visible,
.ef-ov input:focus-visible{outline:3px solid var(--efb);outline-offset:3px}

.ef-sheet{border-color:rgba(148,163,184,.24);box-shadow:0 28px 80px rgba(2,6,23,.48)}

.ef-btn,.ef-pillbtn,.ef-ch,.ef-mode,.ef-opt,.ef-tile,.ef-ib,.ef-x{outline-offset:3px}

@media(max-width:600px){
.ef-tiles{grid-template-columns:1fr}
.ef-tile{min-height:132px}
.ef-card{padding:15px}
.ef-ngrid{grid-template-columns:1fr}
.ef-hero{gap:12px}
}

@media(prefers-reduced-motion:reduce){
.ef-page,.ef-ov,.ef-sheet,.ef-btn,.ef-pillbtn,.ef-ch,.ef-mode,.ef-opt,.ef-tile,.ef-card,.ef-sub,.ef-nc{animation:none!important;transition:none!important;scroll-behavior:auto!important}
}
@media(max-width:600px){.ef-hero{padding:20px}.ef-hero h1{font-size:1.35rem}.ef-term{font-size:1.65rem}.ef-stage{height:270px}.ef-sheet{padding:16px;border-radius:22px}.ef-ib{width:34px;height:34px}}
@media(prefers-reduced-motion:reduce){.ef-fl,.ef-clock.warn,.ef-opt.bad{animation:none}}
/* smart practice + recent results */
.ef-tile.t5{background:linear-gradient(135deg,#b45309,#f59e0b)}
.ef-hist{margin:14px 0}.ef-hist h4{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:0 0 12px}
.ef-hgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:18px;align-items:center}
.ef-spark{width:100%;height:70px;overflow:visible}.ef-spark polyline{fill:none;stroke:#38bdf8;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}.ef-spark circle{fill:#38bdf8}
.ef-hrow{display:flex;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid rgba(127,127,127,.15);font-size:.9rem}.ef-hrow:last-child{border:0}
.ef-hk{font-size:.7rem;font-weight:800;padding:2px 9px;border-radius:999px;background:rgba(127,127,127,.18);white-space:nowrap}.ef-hrow small{opacity:.6}.ef-hrow .sc{margin-inline-start:auto;font-weight:800;white-space:nowrap}
@media(max-width:600px){.ef-hgrid{grid-template-columns:1fr}}
`;
const st = D.createElement("style"); st.textContent = css; D.head.appendChild(st);

/* ================= init ================= */
const tools = q1(".top .tools");
if (tools && !q1("#efSearchBtn")) {
  tools.insertAdjacentHTML("afterbegin", `<button class="ef-ib" id="efSearchBtn" data-ef="search" aria-label="Search" title="Ctrl+K">${I("search", 18)}</button><button class="ef-ib" id="efDashBtn" data-go="/dash" aria-label="Dashboard">${I("chart", 18)}</button>`);
}
D.addEventListener("click", e => {
  const a = e.target.closest("[data-ef]");
  if (a) { const p = a.dataset.ef.split("|"), fn = ACTS[p[0]]; if (fn) { e.preventDefault(); fn.apply(null, p.slice(1)); } return; }
  if (e.target.closest(".done,#snext,#sprev")) touch();
});
D.addEventListener("change", e => { if (e.target.id === "efFile" && e.target.files[0]) { importData(e.target.files[0]); e.target.value = ""; } });
D.addEventListener("keydown", e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test((e.target.tagName || "")) || e.target.isContentEditable;
  if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing && !Quiz.el)) { e.preventDefault(); Search.open(); }
});
addEventListener("hashchange", () => { runCleanups(); Quiz.close(); Search.close(); });
})();
