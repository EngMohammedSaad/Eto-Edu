/* js/features_2.js - Eto.Edu
   1) زرار رجوع صغير ع الجنب
   2) صفحة التحميل أوفلاين   (#/offline)
   3) صفحة ملخصاتي           (#/notes)
   بيتحمّل بعد features_1.js وقبل app.js، وبيتربط من خلال window.EF */
(function () {
"use strict";
const W = window, D = document;
const q1 = (s, r) => (r || D).querySelector(s), qa = (s, r) => Array.from((r || D).querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const lang = () => D.body.getAttribute("data-l") || "ar";
const B = (en, ar) => { try { return bi({ en, ar }); } catch (e) { return esc(ar); } };
const R = v => { if (v == null) return ""; if (typeof v === "string") return esc(v); try { return bi(v); } catch (e) { return esc(v.ar || v.en || ""); } };
const plain = v => v == null ? "" : typeof v === "string" ? v : (lang() === "en" ? (v.en || v.ar || "") : (v.ar || v.en || ""));
const S = { get: (k, d) => { try { return Store.get(k, d); } catch (e) { return d; } }, set: (k, v) => { try { Store.set(k, v); } catch (e) { } } };
const nav = h => { if (typeof go === "function") go(h); else location.hash = "#" + h; };
const norm = s => String(s == null ? "" : s).toLowerCase().replace(/[\u064B-\u065F\u0670]/g, "").replace(/[إأآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");

const P = {
  back: '<path d="M15 6l-6 6 6 6"/>',
  download: '<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  ext: '<path d="M14 4h6v6M10 14L20 4M20 14v6H4V4h6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  thumb: '<path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.3 20H7"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  offline: '<path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M4 17v3h16v-3"/>'
};
const svg = (n, s) => `<svg width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;

let toastT = null;
function toast(msg) {
  let t = q1(".ef-toast"); if (!t) { t = D.createElement("div"); t.className = "ef-toast"; D.body.appendChild(t); }
  t.innerHTML = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2800);
}

const subjectsList = () => { const r = []; (W.SITE ? SITE.tracks : []).forEach(t => t.subjects.forEach(s => { if (!s.soon) r.push({ s, t }); })); return r; };
const lecsOf = sid => Object.values(W.LECTURES || {}).filter(l => l.subject === sid).sort((a, b) => a.number - b.number);

/* ================= 1) زرار الرجوع ================= */
let depth = 0, backing = false;
function parentOf() {
  const p = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  try {
    if (p[0] === "l") return "/s/" + p[1];
    if (p[0] === "s") { const f = findSubject(p[1]); return f ? "/t/" + f.t.id : "/"; }
    if (p[0] === "tool") return "/s/" + p[1];
    if (p[0] === "notes" && p[1]) return p[3] === "me" ? "/me" : "/notes";
    if ((p[0] === "cards" || p[0] === "night" || p[0] === "review") && p[1] && p[2]) return "/l/" + p[1] + "/" + p[2];
    if ((p[0] === "cards" || p[0] === "review") && p[1]) return "/s/" + p[1];
  } catch (e) { }
  return "/";
}
function initBack() {
  if (q1("#etoBack")) return;
  const b = D.createElement("button");
  b.id = "etoBack"; b.type = "button"; b.hidden = true; b.setAttribute("aria-label", "رجوع / Back");
  b.innerHTML = svg("back", 22);
  D.body.appendChild(b);
  const sync = () => { const h = location.hash; b.hidden = !h || h === "#" || h === "#/"; };
  b.addEventListener("click", () => { if (depth > 0) { backing = true; history.back(); } else nav(parentOf()); });
  addEventListener("hashchange", () => { if (backing) { depth = Math.max(0, depth - 1); backing = false; } else depth++; sync(); });
  sync();
}

/* ================= 2) تحميل أوفلاين ================= */
/* اسم الكاش ما يبدأش بـ etoedu- عشان الـ service worker ما يمسحوش لما ينزل إصدار جديد */
const OFF = "offline-lectures-v1";
const hasCache = () => "caches" in W;
const toAbs = u => { try { return new URL(u, location.href).href; } catch (e) { return null; } };
const fileList = s => (s.files || []).map(f => toAbs(typeof f === "string" ? f : (f && (f.src || f.url)))).filter(Boolean);
const examList = s => (s.exams || []).map(toAbs).filter(Boolean);
const imgList = L => { const im = L.images, a = Array.isArray(im) ? im : Object.values(im || {}); return Array.from(new Set(a.filter(x => typeof x === "string" && x).map(toAbs).filter(Boolean))); };
async function loadAllSubjects() { for (const { s } of subjectsList()) { try { await loadScripts(s.files); } catch (e) { } } }
async function isDone(cache, L) {
  if (!S.get("off:" + L.id, false)) return false;
  for (const u of imgList(L)) if (!(await cache.match(u))) return false;
  return true;
}
async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const it = items[i++]; await fn(it); } }));
}
async function download(targets, onTick) {
  const cache = await caches.open(OFF);
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { }
  const bySub = new Map();
  targets.forEach(t => { if (!bySub.has(t.s.id)) bySub.set(t.s.id, { s: t.s, ls: [] }); bySub.get(t.s.id).ls.push(t.L); });
  const jobs = [], seen = new Set(), ok = new Map();
  const add = (u, force) => { if (!seen.has(u)) { seen.add(u); jobs.push({ u, force }); } };
  bySub.forEach(({ s, ls }) => { fileList(s).forEach(u => add(u, true)); examList(s).forEach(u => add(u, false)); ls.forEach(L => imgList(L).forEach(u => add(u, false))); });
  let done = 0; onTick(0, jobs.length);
  await pool(jobs, 4, async j => {
    let good = false;
    try {
      if (!j.force && await cache.match(j.u)) good = true;
      else { const r = await fetch(j.u, { cache: "reload" }); if (r.ok) { await cache.put(j.u, r); good = true; } }
    } catch (e) { }
    ok.set(j.u, good); onTick(++done, jobs.length);
  });
  let fails = 0; ok.forEach(g => { if (!g) fails++; });
  bySub.forEach(({ s, ls }) => { const filesOk = fileList(s).every(u => ok.get(u)); ls.forEach(L => { if (filesOk && imgList(L).every(u => ok.get(u))) S.set("off:" + L.id, true); }); });
  return fails;
}
async function removeLecs(ls) {
  const cache = await caches.open(OFF);
  for (const L of ls) { for (const u of imgList(L)) await cache.delete(u); S.set("off:" + L.id, false); }
}

async function pageOffline() {
  const v = D.getElementById("view");
  const root = D.createElement("div"); root.className = "of-root";
  v.innerHTML = ""; v.appendChild(root);
  root.innerHTML = `<div class="crumb"><a data-go="/">${B("Home", "الرئيسية")}</a><span>/</span><span>${B("Offline download", "تحميل أوفلاين")}</span></div>
    <div class="pagehead"><h2>${B("Offline download", "تحميل أوفلاين")}</h2><p>${B("Save lectures on your phone so they open without internet.", "نزّل المحاضرات على موبايلك عشان تفتحها من غير نت.")}</p></div>
    <div class="of-wrap" id="ofBox"><div class="empty">Loading...</div></div>`;
  const box = q1("#ofBox", root);
  if (!hasCache()) { box.innerHTML = `<div class="of-note">${B("This browser does not support offline saving (the site must run on HTTPS).", "المتصفح ده مش بيدعم الحفظ أوفلاين (والموقع لازم يكون على HTTPS).")}</div>`; return; }
  await loadAllSubjects();
  const cache = await caches.open(OFF);
  let busy = false;

  async function draw() {
    const groups = [];
    for (const { s } of subjectsList()) {
      const ls = lecsOf(s.id); if (!ls.length) continue;
      const rows = []; for (const L of ls) rows.push({ L, done: await isDone(cache, L) });
      groups.push({ s, rows });
    }
    const total = groups.reduce((a, g) => a + g.rows.length, 0), got = groups.reduce((a, g) => a + g.rows.filter(r => r.done).length, 0);
    const pending = total - got;
    box.innerHTML = `<div class="of-top">
        <div class="of-sum"><b>${got} / ${total}</b><span>${B("lectures downloaded", "محاضرة محمّلة")}</span><small id="ofStore"></small></div>
        <div class="of-acts">
          <button class="btn main" data-a="all" ${pending ? "" : "disabled"}>${svg("download", 18)} ${pending ? B("Download all (" + pending + ")", "تحميل المحاضرات كلها (" + pending + ")") : B("Everything is downloaded", "كله محمّل")}</button>
          <button class="btn" data-a="rmall" ${got ? "" : "disabled"}>${svg("trash", 18)} ${B("Remove all", "حذف الكل")}</button>
        </div>
        ${navigator.onLine === false ? `<div class="of-note">${B("You are offline now. Connect to the internet to download.", "انت أوفلاين دلوقتي. اتصل بالنت عشان تنزّل.")}</div>` : ""}
        <div class="of-prog" id="ofProg" hidden><i></i><span></span></div>
      </div>` + (groups.length ? groups.map(g => {
        const gd = g.rows.filter(r => r.done).length;
        return `<div class="of-grp"><div class="of-gh"><h3>${R(g.s.title)}</h3><span class="of-cnt">${gd} / ${g.rows.length}</span>
          <button class="btn" data-a="sub" data-sid="${esc(g.s.id)}" ${gd === g.rows.length ? "disabled" : ""}>${svg("download", 16)} ${B("Download subject", "تحميل المادة")}</button></div>
          ${g.rows.map(r => `<div class="of-row"><div class="of-i"><b>${B("Lecture " + r.L.number, "المحاضرة " + r.L.number)}</b><span>${R(r.L.title)}</span></div>
            <span class="of-chip ${r.done ? "ok" : "no"}">${r.done ? svg("check", 14) + " " + B("Downloaded", "محمّلة") : B("Not downloaded", "غير محمّلة")}</span>
            <button class="btn ${r.done ? "" : "main"}" data-a="${r.done ? "rm" : "dl"}" data-sid="${esc(g.s.id)}" data-lid="${esc(r.L.id)}">${r.done ? svg("trash", 16) + " " + B("Remove", "حذف") : svg("download", 16) + " " + B("Download", "تحميل")}</button></div>`).join("")}</div>`;
      }).join("") : `<div class="of-note">${B("No lectures found yet.", "مفيش محاضرات لسه.")}</div>`);
    try {
      navigator.storage && navigator.storage.estimate && navigator.storage.estimate().then(e => {
        const el = q1("#ofStore", box); if (el && e && e.usage != null) el.textContent = plain({ en: "Storage used", ar: "المساحة المستخدمة" }) + ": " + Math.round(e.usage / 1048576) + " MB";
      });
    } catch (e) { }
  }

  const tick = (n, t) => {
    const p = q1("#ofProg", box); if (!p) return;
    p.hidden = false; p.firstElementChild.style.width = (t ? n / t * 100 : 100) + "%";
    p.lastElementChild.textContent = n + " / " + t;
  };
  async function run(targets) {
    if (busy) return; if (!targets.length) return;
    if (navigator.onLine === false) return toast(B("No internet connection.", "مفيش اتصال بالنت."));
    busy = true; root.classList.add("of-busy");
    let fails = 0;
    try { fails = await download(targets, tick); } catch (e) { fails = 1; }
    busy = false; root.classList.remove("of-busy");
    await draw();
    toast(fails ? B("Some files failed. Try again.", "في ملفات ما اتحملتش. جرّب تاني.") : B("Downloaded. Available offline now.", "اتحمّل. متاح أوفلاين دلوقتي."));
  }
  const allTargets = async onlySid => {
    const t = [];
    for (const { s } of subjectsList()) { if (onlySid && s.id !== onlySid) continue; for (const L of lecsOf(s.id)) if (!(await isDone(cache, L))) t.push({ s, L }); }
    return t;
  };
  root.addEventListener("click", async e => {
    const b = e.target.closest("[data-a]"); if (!b || b.disabled || busy) return;
    const a = b.dataset.a;
    if (a === "all") return run(await allTargets());
    if (a === "sub") return run(await allTargets(b.dataset.sid));
    if (a === "dl") { const f = findSubject(b.dataset.sid), L = (W.LECTURES || {})[b.dataset.lid]; if (f && L) return run([{ s: f.s, L }]); }
    if (a === "rm") { const L = (W.LECTURES || {})[b.dataset.lid]; if (L) { await removeLecs([L]); await draw(); } }
    if (a === "rmall") {
      if (!confirm(plain({ en: "Remove all downloaded lectures?", ar: "تحذف كل المحاضرات المحمّلة؟" }))) return;
      const all = []; subjectsList().forEach(({ s }) => lecsOf(s.id).forEach(L => all.push(L)));
      await removeLecs(all); await draw();
    }
  });
  await draw();
}

/* ================= 3) ملخصاتي ================= */
/* Realtime Database بتاع مشروع eto-account (نفس رابط accounts.js).
   الكتابة والقراءة بتتم بتوكن حساب المستخدم، فلازم يكون مسجّل دخول. */
const NOTES_DB_DEFAULT = "https://eto-account-default-rtdb.firebaseio.com";
const dbBase = () => {
  let u = W.ETO_DB_URL;
  try { if (!u && W.firebase && firebase.apps && firebase.apps[0]) u = firebase.apps[0].options.databaseURL; } catch (e) { }
  return String(u || NOTES_DB_DEFAULT).replace(/\/+$/, "");
};
const NOTES_CACHE = "notes:cache", NOTES_LAST = "notes:last";

function who() {
  const A = W.Accounts || {}, u = A.user, p = A.profile || {};
  if (!u) return { name: "", id: "", user: null };
  return { name: String(p.name || u.displayName || ""), id: String(u.uid || ""), user: u };
}
async function authQS() {
  const u = (W.Accounts || {}).user;
  if (!u || typeof u.getIdToken !== "function") return "";
  try { return "?auth=" + encodeURIComponent(await u.getIdToken()); } catch (e) { return ""; }
}

function driveInfo(raw) {
  let url; try { url = new URL(String(raw || "").trim()); } catch (e) { return null; }
  if (url.protocol !== "https:") return null;
  const h = url.hostname; if (h !== "drive.google.com" && h !== "docs.google.com") return null;
  let m = url.pathname.match(/\/(document|spreadsheets|presentation)\/d\/([\w-]{10,})/);
  if (m) {
    const k = m[1], id = m[2];
    return { id, kind: k, dl: `https://docs.google.com/${k}/d/${id}/export?format=pdf`, open: url.href, embed: k === "presentation" ? `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false` : `https://docs.google.com/${k}/d/${id}/preview` };
  }
  m = url.pathname.match(/\/folders\/([\w-]{10,})/);
  if (m) return { id: m[1], open: url.href, embed: `https://drive.google.com/embeddedfolderview?id=${m[1]}#list` };
  m = url.pathname.match(/\/file\/d\/([\w-]{10,})/);
  const id = m ? m[1] : url.searchParams.get("id");
  if (id && /^[\w-]{10,}$/.test(id)) return { id, kind: "file", dl: `https://drive.google.com/uc?export=download&id=${id}`, open: url.href, embed: `https://drive.google.com/file/d/${id}/preview` };
  return null;
}

async function fetchNotes() {
  const r = await fetch(dbBase() + "/summaries.json" + await authQS(), { cache: "no-store" });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const j = await r.json();
  const arr = j ? Object.entries(j).filter(([, x]) => x && typeof x === "object").map(([id, x]) => Object.assign({ id }, x)) : [];
  arr.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  try { localStorage.setItem(NOTES_CACHE, JSON.stringify(arr.slice(0, 300))); } catch (e) { }
  return arr;
}
async function postNote(n) {
  const qs = await authQS(); if (!qs) throw new Error("login");
  const r = await fetch(dbBase() + "/summaries.json" + qs, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(n) });
  if (!r.ok) throw new Error("HTTP " + r.status);
}
async function deleteNote(id) {
  const qs = await authQS(); if (!qs) throw new Error("login");
  const r = await fetch(dbBase() + "/summaries/" + encodeURIComponent(id) + ".json" + qs, { method: "DELETE" });
  if (!r.ok) throw new Error("HTTP " + r.status);
}

/* --- إحصائيات الملخصات: stats/<noteId>/<uid> = { o:1 (فتح الملخص), u:1 (مفيد) }
   كل طالب ليه خانة واحدة بس، فالعدّاد = عدد الطلبة (مفيش غش بالتكرار) --- */
const STATS_CACHE = "notes:stats";
let STATS = (() => { try { return JSON.parse(localStorage.getItem(STATS_CACHE) || "{}"); } catch (e) { return {}; } })();
const stat = id => STATS[id] || { o: 0, u: 0, m: null };
const saveStats = () => { try { localStorage.setItem(STATS_CACHE, JSON.stringify(STATS)); } catch (e) { } };
async function fetchStats() {
  const uid = who().id;
  const r = await fetch(dbBase() + "/stats.json" + await authQS(), { cache: "no-store" });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const j = (await r.json()) || {}, out = {};
  Object.keys(j).forEach(id => {
    const us = j[id] || {}; let o = 0, u = 0, m = null;
    Object.keys(us).forEach(k => { const v = us[k]; if (v && v.o === 1) { o++; if (v.u === 1) u++; if (k === uid) m = { o: 1, u: v.u === 1 ? 1 : 0 }; } });
    out[id] = { o, u, m };
  });
  STATS = out; saveStats();
  return out;
}
async function patchStat(id, body) {
  const qs = await authQS(), uid = who().id; if (!qs || !uid) throw new Error("login");
  const r = await fetch(dbBase() + "/stats/" + encodeURIComponent(id) + "/" + encodeURIComponent(uid) + ".json" + qs, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error("HTTP " + r.status);
}
function noteOpened(n) {
  const acc = who(); if (!acc.user || !n || !n.id || n.uid === acc.id) return;
  const s = stat(n.id); if (s.m && s.m.o) return;
  STATS[n.id] = { o: s.o + 1, u: s.u, m: { o: 1, u: 0 } }; saveStats();
  patchStat(n.id, { o: 1 }).catch(() => { STATS[n.id] = s; saveStats(); });
}
async function toggleUseful(n) {
  const acc = who();
  if (!acc.user) { toast(B("Log in first.", "سجّل دخول الأول.")); return false; }
  const s = stat(n.id), on = !(s.m && s.m.u);
  try { await patchStat(n.id, on ? { o: 1, u: 1 } : { o: 1, u: null }); }
  catch (e) { toast(B("Could not save. Check your connection.", "ما اتحفظش. اتأكد من النت.")); return false; }
  STATS[n.id] = { o: (s.m && s.m.o) ? s.o : s.o + 1, u: Math.max(0, s.u + (on ? 1 : -1)), m: { o: 1, u: on ? 1 : 0 } }; saveStats();
  return true;
}
const statsHTML = id => { const s = stat(id); return `<span class="nt-st"><span title="${esc(plain({ en: "Students who opened it", ar: "طلبة فتحوه" }))}">${svg("eye", 14)} ${s.o}</span><span title="${esc(plain({ en: "Marked useful", ar: "مفيد" }))}">${svg("thumb", 14)} ${s.u}</span></span>`; };
const NT_SORT = "etoedu-notes-sort-v1";
const lastSort = () => { try { const v = localStorage.getItem(NT_SORT); return ["new", "used", "useful"].includes(v) ? v : "new"; } catch (e) { return "new"; } };
const byTs = (a, b) => (b.ts || 0) - (a.ts || 0);
const SORTS = {
  new: byTs,
  used: (a, b) => stat(b.id).o - stat(a.id).o || byTs(a, b),
  useful: (a, b) => stat(b.id).u - stat(a.id).u || stat(b.id).o - stat(a.id).o || byTs(a, b)
};

function openViewer(n) {
  try { noteOpened(n); } catch (e) { }
  const info = driveInfo(n.link); if (!info) return toast(B("Invalid link.", "اللينك مش صالح."));
  const proxy = String((window.SITE && window.SITE.pdfProxy) || "").replace(/\/+$/, "");
  /* لو الـ proxy متظبط: افتح الملخص في قارئ PDF (كتابة/رسم/هايلايت/ترجمة/ويكيبيديا) */
  if (proxy && info.kind && typeof loadScripts === "function") {
    const src = proxy + "/?id=" + encodeURIComponent(info.id) + (info.kind !== "file" ? "&k=" + info.kind : "");
    loadScripts(["js/pdfreader.js"])
      .then(() => PdfReader.open({ url: src, key: "drive:" + info.id, title: n.title, download: info.dl, onFail: () => openIframeViewer(n) }))
      .catch(() => openIframeViewer(n));
    return;
  }
  openIframeViewer(n);
}
function openIframeViewer(n) {
  const info = driveInfo(n.link); if (!info) return toast(B("Invalid link.", "اللينك مش صالح."));
  closeViewer();
  const d = D.createElement("div"); d.id = "ntViewer";
  d.innerHTML = `<div class="nt-vh"><b>${esc(n.title)}</b>
      <button class="btn" data-v="dl">${B("Download", "تحميل")}</button>
      <button class="btn" data-v="drive">${svg("ext", 16)} ${B("Open in Drive", "فتح في Drive")}</button>
      <button class="btn main" data-v="close" aria-label="Close">${svg("x", 18)}</button></div>
    <div class="nt-vhint">${B("If the file does not open, make sure its sharing is set to Anyone with the link.", "لو الملف مش بيفتح اتأكد إن المشاركة \"أي شخص معاه الرابط\".")}</div>
    <iframe src="${esc(info.embed)}" allow="fullscreen" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" title="${esc(n.title)}"></iframe>`;
  D.body.appendChild(d); D.body.classList.add("ef-lock");
  d.addEventListener("click", e => {
    const b = e.target.closest("[data-v]"); if (!b) return;
    if (b.dataset.v === "close") closeViewer();
    else if (b.dataset.v === "dl") W.open(info.dl || info.open, "_blank", "noopener,noreferrer");
    else W.open(info.open, "_blank", "noopener,noreferrer");
  });
}
function closeViewer() { const d = q1("#ntViewer"); if (d) d.remove(); D.body.classList.remove("ef-lock"); }
addEventListener("keydown", e => { if (e.key === "Escape") closeViewer(); });
addEventListener("hashchange", closeViewer);

const subsList = tid => subjectsList().filter(({ t }) => !tid || t.id === tid).map(({ s, t }) => ({ id: s.id, title: plain(s.title), track: t.id }));
const subTitle = id => { const x = subsList().find(s => s.id === id); return x ? x.title : ""; };
const subOpts = (sel, tid) => subsList(tid).map(s => `<option value="${esc(s.id)}"${s.id === sel ? " selected" : ""}>${esc(s.title)}</option>`).join("");
/* المسار (علوم / ثانوي) بيتحدد من المادة نفسها، فمش محتاجين حقل جديد في قاعدة البيانات */
const tracksList = () => (W.SITE ? SITE.tracks : []);
const trackOf = sid => { const x = subjectsList().find(({ s }) => s.id === sid); return x ? x.t : null; };
const TRACK_SHORT = { science: { en: "Science", ar: "علوم" }, secondary: { en: "Secondary", ar: "ثانوي" } };
const trackShort = t => plain(TRACK_SHORT[t.id] || t.title);
const lecChip = n => n && n.lecNo ? " &middot; " + (lang() === "en" ? "Lec " : "م ") + esc(n.lecNo) : "";
const chipFor = n => { const t = trackOf(n.subject); return subTitle(n.subject) ? `<span class="of-chip no">${esc(subTitle(n.subject))}${t ? " &middot; " + esc(trackShort(t)) : ""}${lecChip(n)}</span>` : ""; };
const NT_TRACK = "etoedu-notes-track-v1";
const lastTrack = () => { try { return localStorage.getItem(NT_TRACK) || ""; } catch (e) { return ""; } };
const saveTrack = v => { try { localStorage.setItem(NT_TRACK, v || ""); } catch (e) { } };
const fmtD = ts => { try { return new Date(ts).toLocaleDateString(lang() === "en" ? "en-GB" : "ar-EG", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return ""; } };
const crumbHTML = items => `<div class="crumb">${items.map((c, i) => i < items.length - 1 ? `<a data-go="${c[1]}">${c[0]}</a><span>/</span>` : `<span>${c[0]}</span>`).join("")}</div>`;
const cachedNotes = () => { try { return JSON.parse(localStorage.getItem(NOTES_CACHE) || "[]"); } catch (e) { return []; } };

async function fetchOne(id) {
  const r = await fetch(dbBase() + "/summaries/" + encodeURIComponent(id) + ".json" + await authQS(), { cache: "no-store" });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const j = await r.json(); return j ? Object.assign({ id }, j) : null;
}
async function patchNote(id, body) {
  const qs = await authQS(); if (!qs) throw new Error("login");
  const r = await fetch(dbBase() + "/summaries/" + encodeURIComponent(id) + ".json" + qs, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error("HTTP " + r.status);
}
async function confirmDelete(n) {
  if (!confirm(plain({ en: "Delete this summary?", ar: "تحذف الملخص ده؟" }))) return false;
  try { await deleteNote(n.id); toast(B("Deleted.", "اتحذف.")); return true; }
  catch (e) { toast(B("Could not delete.", "ما اتحذفش.")); return false; }
}
const mountRoot = () => { const v = D.getElementById("view"); const root = D.createElement("div"); root.className = "of-root"; v.innerHTML = ""; v.appendChild(root); return root; };

/* --- صفحة تصفّح الملخصات (#/notes) --- */
async function pageNotes() {
  const root = mountRoot();
  root.innerHTML = crumbHTML([[B("Home", "الرئيسية"), "/"], [B("My summaries", "ملخصاتي"), ""]]) +
    `<div class="pagehead nt-head"><div><h2>${B("My summaries", "ملخصاتي")}</h2><p>${B("Summaries shared by students. Tap one to read it here.", "ملخصات الطلبة. دوس على أي واحد وافتحه هنا.")}</p></div>
      <button class="btn main nt-add" type="button" data-go="/notes/new">${svg("plus", 16)} ${B("Add summary", "ضيف ملخص")}</button></div>
    <div class="of-wrap">
      <div class="seg" id="ntT" style="margin-bottom:10px;flex-wrap:wrap"><button type="button" data-tk="">${B("All", "الكل")}</button>${tracksList().map(t => `<button type="button" data-tk="${esc(t.id)}">${B(t.title.en, t.title.ar)}</button>`).join("")}</div>
      <div class="nt-bar"><input id="ntQ" type="search" placeholder="${esc(plain({ en: "Search summaries...", ar: "دوّر في الملخصات..." }))}">
        <select id="ntF"></select>
        <select id="ntS"><option value="new">${esc(plain({ en: "Newest", ar: "الأحدث" }))}</option><option value="used">${esc(plain({ en: "Most used", ar: "الأكثر استخدامًا" }))}</option><option value="useful">${esc(plain({ en: "Most useful", ar: "الأكثر فائدة" }))}</option></select></div>
      <div id="ntList"><div class="empty">Loading...</div></div></div>`;
  let all = [], stale = false, tk = lastTrack(), sortBy = lastSort();
  q1("#ntS", root).value = sortBy;
  if (tk && !tracksList().some(t => t.id === tk)) tk = "";
  function fillSubjects() {
    q1("#ntF", root).innerHTML = `<option value="">${esc(plain({ en: "All subjects", ar: "كل المواد" }))}</option>` + subOpts("", tk);
    root.querySelectorAll("#ntT [data-tk]").forEach(x => x.classList.toggle("on", x.dataset.tk === tk));
  }
  function paint() {
    const q = norm(q1("#ntQ", root).value), f = q1("#ntF", root).value, uid = who().id;
    const rows = all.filter(n => (!tk || (trackOf(n.subject) || {}).id === tk) && (!f || n.subject === f) && (!q || norm([n.title, n.name, subTitle(n.subject)].join(" ")).includes(q)));
    rows.sort(SORTS[sortBy] || byTs);
    const box = q1("#ntList", root);
    if (!rows.length) { box.innerHTML = `<div class="of-note">${all.length ? B("No results.", "مفيش نتايج.") : B("No summaries yet. Be the first to add one.", "مفيش ملخصات لسه. كن أول واحد يضيف.")}</div>`; return; }
    box.innerHTML = (stale ? `<div class="of-note">${B("Showing saved summaries (no connection).", "بنعرض ملخصات محفوظة (مفيش اتصال).")}</div>` : "") +
      `<div class="nt-grid">${rows.map(n => `<div class="nt-card"><div class="nt-top"><span class="nt-ic">${svg("file", 22)}</span><div><h3>${esc(n.title)}</h3>${chipFor(n)}</div></div>
        <div class="nt-by">${B("By", "بواسطة")} <b>${esc(n.name)}</b>${n.ts ? " &middot; " + esc(fmtD(n.ts)) : ""} ${statsHTML(n.id)}</div>
        <div class="nt-act"><button class="btn main" data-a="open" data-id="${esc(n.id)}">${B("Open", "فتح")}</button>${n.uid && n.uid === uid ? "" : `<button class="btn nt-use${stat(n.id).m && stat(n.id).m.u ? " on" : ""}" data-a="use" data-id="${esc(n.id)}">${svg("thumb", 16)} ${B("Useful", "مفيد")}</button>`}<button class="btn" data-a="drive" data-id="${esc(n.id)}">${svg("ext", 16)} Drive</button></div>
        ${n.uid && n.uid === uid ? `<div class="nt-own"><button class="btn" data-go="/notes/edit/${esc(n.id)}">${B("Edit", "تعديل")}</button><button class="btn" data-a="del" data-id="${esc(n.id)}">${svg("trash", 16)} ${B("Delete", "حذف")}</button></div>` : ""}</div>`).join("")}</div>`;
  }
  async function load() {
    const [a] = await Promise.allSettled([fetchNotes(), fetchStats()]);
    if (a.status === "fulfilled") { all = a.value; stale = false; } else { stale = true; all = cachedNotes(); }
    paint();
  }
  root.addEventListener("click", async e => {
    const b = e.target.closest("[data-a]"); if (!b) return;
    const n = all.find(x => x.id === b.dataset.id); if (!n) return;
    if (b.dataset.a === "del") { if (await confirmDelete(n)) { all = all.filter(x => x.id !== n.id); paint(); } return; }
    if (b.dataset.a === "use") { if (await toggleUseful(n)) paint(); return; }
    if (b.dataset.a === "open") { openViewer(n); setTimeout(paint, 600); } else { const i = driveInfo(n.link); if (i) W.open(i.open, "_blank", "noopener,noreferrer"); }
  });
  fillSubjects();
  q1("#ntT", root).addEventListener("click", e => {
    const x = e.target.closest("[data-tk]"); if (!x) return;
    tk = x.dataset.tk; saveTrack(tk); fillSubjects(); paint();
  });
  q1("#ntQ", root).addEventListener("input", paint);
  q1("#ntF", root).addEventListener("change", paint);
  q1("#ntS", root).addEventListener("change", e => { sortBy = e.target.value; try { localStorage.setItem(NT_SORT, sortBy); } catch (x) { } paint(); });
  const onAcc = () => { if (!root.isConnected) return removeEventListener("accounts:change", onAcc); load(); };
  addEventListener("accounts:change", onAcc);
  await load();
}

/* --- صفحة النشر والتعديل (#/notes/new  و  #/notes/edit/<id>) --- */
async function pageNoteForm(mode, id, ret, pre) {
  pre = pre || {};
  const root = mountRoot(), edit = mode === "edit";
  const title = edit ? B("Edit summary", "تعديل الملخص") : B("Add a summary", "ضيف ملخص");
  root.innerHTML = crumbHTML([[B("Home", "الرئيسية"), "/"], [B("My summaries", "ملخصاتي"), "/notes"], [title, ""]]) +
    `<div class="pagehead"><h2>${title}</h2></div><div class="of-wrap" id="ntBox"><div class="empty">Loading...</div></div>`;
  const box = q1("#ntBox", root);
  const acc = who();
  if (!acc.user) {
    box.innerHTML = `<div class="of-note">${B("Log in first to publish a summary.", "سجّل دخول الأول عشان تنشر ملخص.")}</div>`;
    const h = () => { removeEventListener("accounts:change", h); if (root.isConnected) pageNoteForm(mode, id, ret, pre); };
    addEventListener("accounts:change", h);
    return;
  }
  let note = null;
  if (edit) {
    try { note = await fetchOne(id); } catch (e) { }
    if (!note || note.uid !== acc.id) { box.innerHTML = `<div class="of-note">${B("Summary not found, or it is not yours.", "الملخص مش موجود أو مش بتاعك.")}</div>`; return; }
  }
  const val = k => esc(note ? note[k] || "" : "");
  const noteTrack = (note && trackOf(note.subject)) || (pre.subject && trackOf(pre.subject));
  const curTrack = noteTrack ? noteTrack.id : (lastTrack() || ((tracksList()[0] || {}).id || ""));
  box.innerHTML = `<form class="nt-form" id="ntForm" autocomplete="off" novalidate>
      <label>${B("Your name", "اسمك")}<input id="ntName" maxlength="60" value="${edit ? val("name") : esc(acc.name)}"></label>
      <label>${B("Summary title", "عنوان الملخص")}<input id="ntTitle" maxlength="120" value="${val("title")}" placeholder="${esc(plain({ en: "e.g. Chapter 1 summary", ar: "مثال: ملخص الفصل الأول" }))}"></label>
      <label>${B("Section", "القسم")}<select id="ntTrk">${tracksList().map(t => `<option value="${esc(t.id)}"${t.id === curTrack ? " selected" : ""}>${esc(plain(t.title))}</option>`).join("")}</select></label>
      <label>${B("Subject", "المادة")}<select id="ntSub"></select></label>
      <label>${B("Lecture (optional)", "المحاضرة (اختياري)")}<select id="ntLec"></select></label>
      <p class="nt-help">${B("Link it to a lecture and it will show inside that lecture's page.", "اربطه بمحاضرة وهيظهر جوه صفحة المحاضرة دي.")}</p>
      <label>${B("Google Drive link", "لينك Google Drive")}<input id="ntLink" type="url" inputmode="url" dir="ltr" value="${val("link")}" placeholder="https://drive.google.com/file/d/..."></label>
      <p class="nt-help">${B("In Drive: Share, then General access, then Anyone with the link. Copy the link and paste it here.", "في Drive: مشاركة، بعدين الوصول العام، اختار \"أي شخص معاه الرابط\". انسخ اللينك وحطه هنا.")}</p>
      <div class="nt-err" id="ntErr" hidden></div>
      <div class="nt-fa"><button class="btn main nt-add" type="submit" id="ntGo">${edit ? B("Save changes", "حفظ التعديل") : B("Publish", "نشر")}</button>
      <button class="btn nt-add" type="button" data-go="${ret}">${B("Cancel", "إلغاء")}</button></div></form>`;
  const fillSub = (sel) => { q1("#ntSub", root).innerHTML = `<option value="">${esc(plain({ en: "Choose a subject", ar: "اختار المادة" }))}</option>` + subOpts(sel, q1("#ntTrk", root).value); };
  const fillLec = async (sid, sel) => {
    const el = q1("#ntLec", root); if (!el) return;
    const none = `<option value="">${esc(plain({ en: "Not linked to a lecture", ar: "من غير ربط بمحاضرة" }))}</option>`;
    if (!sid) { el.innerHTML = none; return; }
    el.innerHTML = none;
    const f = typeof findSubject === "function" ? findSubject(sid) : null;
    try { if (f && !f.s.soon) await loadScripts(f.s.files); } catch (e) { }
    if (!el.isConnected || q1("#ntSub", root).value !== sid) return;      /* المادة اتغيّرت وإحنا بنحمّل */
    el.innerHTML = none + lecsOf(sid).map(L => `<option value="${esc(L.id)}" data-n="${esc(L.number)}"${L.id === sel ? " selected" : ""}>${esc(plain({ en: "Lecture " + L.number, ar: "المحاضرة " + L.number }) + " - " + plain(L.title))}</option>`).join("");
  };
  fillSub(note ? note.subject : (pre.subject || ""));
  fillLec(note ? note.subject : (pre.subject || ""), note ? note.lecture : (pre.lecture || ""));
  q1("#ntTrk", root).addEventListener("change", () => { saveTrack(q1("#ntTrk", root).value); fillSub(""); fillLec("", ""); });
  q1("#ntSub", root).addEventListener("change", () => fillLec(q1("#ntSub", root).value, ""));
  const err = m => { const e = q1("#ntErr", root); e.hidden = !m; e.innerHTML = m || ""; };
  q1("#ntForm", root).addEventListener("submit", async e => {
    e.preventDefault(); err("");
    const name = q1("#ntName", root).value.trim(), ttl = q1("#ntTitle", root).value.trim(), subject = q1("#ntSub", root).value, link = q1("#ntLink", root).value.trim();
    const lecEl = q1("#ntLec", root), lec = lecEl ? lecEl.value : "", lecNo = lec && lecEl.selectedOptions[0] ? +lecEl.selectedOptions[0].dataset.n || 0 : 0;
    if (!name) return err(B("Write your name.", "اكتب اسمك."));
    if (!ttl) return err(B("Write a title for the summary.", "اكتب عنوان للملخص."));
    if (!subject) return err(B("Choose the subject.", "اختار المادة."));
    const info = driveInfo(link);
    if (!info) return err(B("Paste a valid Google Drive link (drive.google.com or docs.google.com).", "حط لينك Google Drive صحيح (drive.google.com أو docs.google.com)."));
    const btn = q1("#ntGo", root); btn.disabled = true;
    try {
      if (edit) {
        await patchNote(id, { name: name.slice(0, 60), title: ttl.slice(0, 120), subject: subject || "", lecture: lec, lecNo, link: info.open.slice(0, 400), editedAt: Date.now() });
      } else {
        const last = +localStorage.getItem(NOTES_LAST) || 0;
        if (Date.now() - last < 30000) { btn.disabled = false; return err(B("Wait a few seconds before adding another one.", "استنى كام ثانية قبل ما تضيف واحد تاني.")); }
        let list = []; try { list = await fetchNotes(); } catch (x) { list = cachedNotes(); }
        if (list.some(n => n.link === info.open)) { btn.disabled = false; return err(B("This link was already added.", "اللينك ده اتضاف قبل كده.")); }
        await postNote({ name: name.slice(0, 60), uid: acc.id, title: ttl.slice(0, 120), subject: subject || "", lecture: lec, lecNo, link: info.open.slice(0, 400), ts: Date.now() });
        try { localStorage.setItem(NOTES_LAST, String(Date.now())); } catch (x) { }
      }
      toast(edit ? B("Saved.", "اتحفظ.") : B("Published. Thank you.", "اتنشر. شكراً ليك."));
      nav(ret);
    } catch (x) {
      btn.disabled = false;
      err(B("Could not save. Check your connection and the database rules.", "ما اتحفظش. اتأكد من النت ومن قواعد قاعدة البيانات."));
    }
  });
}

/* --- قسم "ملخصاتي" جوه صفحة حسابي (#/me) --- */
let meList = null;
function paintMeNotes() {
  const me = q1(".me"); if (!me || q1("#meNotes", me)) return;
  const acc = who(); if (!acc.user) return;
  const hd = D.createElement("div"); hd.className = "meH"; hd.id = "meNotesH"; hd.textContent = "ملخصاتي";
  const box = D.createElement("div"); box.id = "meNotes";
  me.appendChild(hd); me.appendChild(box);
  const render = () => {
    const mine = (meList || []).filter(n => n.uid === acc.id);
    box.innerHTML = `<div class="nt-meadd"><button class="meBtn nt-add" type="button" data-na="add">${svg("plus", 14)} ضيف ملخص</button></div>` +
      (mine.length ? mine.map(n => `<div class="nt-merow"><div class="nt-mei"><b>${esc(n.title)}</b><small>${chipFor(n)} ${n.ts ? esc(fmtD(n.ts)) : ""}</small></div>
        <div class="nt-mea"><button class="meBtn" data-na="open" data-id="${esc(n.id)}">فتح</button><button class="meBtn" data-na="edit" data-id="${esc(n.id)}">تعديل</button><button class="meBtn" data-na="del" data-id="${esc(n.id)}">حذف</button></div></div>`).join("")
        : '<div class="meSm">لسه ما رفعتش ملخصات.</div>');
  };
  box.addEventListener("click", async e => {
    const b = e.target.closest("[data-na]"); if (!b) return;
    const a = b.dataset.na, n = (meList || []).find(x => x.id === b.dataset.id);
    if (a === "add") return nav("/notes/new");
    if (!n) return;
    if (a === "edit") return nav("/notes/edit/" + n.id + "/me");
    if (a === "open") return openViewer(n);
    if (a === "del" && await confirmDelete(n)) { meList = meList.filter(x => x.id !== n.id); render(); }
  });
  if (meList) render(); else box.innerHTML = '<div class="meSm">...</div>';
  fetchNotes().then(l => { meList = l; }).catch(() => { meList = meList || cachedNotes(); }).then(() => { if (box.isConnected) render(); });
}
function initMeNotes() {
  const v = D.getElementById("view"); if (!v) return;
  new MutationObserver(() => { if (q1(".me") && !q1("#meNotes")) paintMeNotes(); }).observe(v, { childList: true, subtree: true });
}

/* ================= الربط مع EF + الصفحة الرئيسية ================= */
function homeCards() {
  const tr = q1(".tracks"); if (!tr || q1(".of-homerow")) return;
  const row = D.createElement("div"); row.className = "tracks of-homerow"; row.style.margin = "-40px auto 40px";
  const card = (go, ic, t, d, k) => `<div class="tcard" data-go="${go}" style="animation-delay:${k}s"><div class="ti">${svg(ic, 30)}</div><h3>${t}</h3><p>${d}</p></div>`;
  row.innerHTML = card("/notes", "file", B("My summaries", "ملخصاتي"), B("Browse and share summaries from other students.", "شوف وشارك ملخصات الطلبة."), .1) +
    card("/offline", "offline", B("Offline download", "تحميل أوفلاين"), B("Save lectures on your phone and study without internet.", "نزّل المحاضرات وذاكر من غير نت."), .2);
  tr.insertAdjacentElement("afterend", row);
}

/* --- ملخصات الطلبة جوه صفحة المحاضرة --- */
function lectureNotes(L, s) {
  const go = q1(".go"); if (!go || q1(".nt-lec")) return;
  const box = D.createElement("div"); box.className = "nt-lec";
  go.parentNode.insertBefore(box, go);
  const mine = list => (list || []).filter(n => n && n.lecture === L.id);
  const draw = (list, stale) => {
    if (!box.isConnected) return;
    const rows = mine(list).sort(SORTS.useful);
    box.innerHTML = `<div class="nt-lech"><h3>${B("Student summaries for this lecture", "ملخصات الطلبة للمحاضرة دي")}</h3>
      <button class="btn nt-add" type="button" data-go="/notes/new/${esc(s.id)}/${esc(L.id)}">${svg("plus", 16)} ${B("Add a summary", "ضيف ملخص")}</button></div>` +
      (stale ? `<div class="nt-help">${B("Showing saved summaries (no connection).", "بنعرض ملخصات محفوظة (مفيش اتصال).")}</div>` : "") +
      (rows.length ? rows.map(n => `<div class="nt-lecr"><div class="nt-mei"><b>${esc(n.title)}</b><small>${B("By", "بواسطة")} ${esc(n.name)}${n.ts ? " &middot; " + esc(fmtD(n.ts)) : ""} ${statsHTML(n.id)}</small></div>
        <button class="btn main" type="button" data-nid="${esc(n.id)}">${B("Open", "فتح")}</button></div>`).join("")
        : `<div class="nt-help" style="margin-top:8px">${B("No summaries linked to this lecture yet.", "مفيش ملخصات مربوطة بالمحاضرة دي لسه.")}</div>`);
  };
  let cur = cachedNotes();
  draw(cur, false);
  box.addEventListener("click", e => {
    const b = e.target.closest("[data-nid]"); if (!b) return;
    const n = cur.find(x => x.id === b.dataset.nid); if (n) openViewer(n);
  });
  Promise.allSettled([fetchNotes(), fetchStats()]).then(([a]) => { if (a.status === "fulfilled") { cur = a.value; draw(cur, false); } else { draw(cur, !!cur.length); } });
}

function patchEF() {
  const EF = W.EF; if (!EF || EF.__f2) return; EF.__f2 = true;
  const h0 = EF.handles, r0 = EF.render, home0 = EF.home;
  EF.handles = p => p === "offline" || p === "notes" || h0(p);
  EF.render = async function (p) {
    if (p[0] === "offline") { try { return await pageOffline(); } catch (e) { D.getElementById("view").innerHTML = `<div class="empty"><h3>Something went wrong</h3><p>${esc(e.message)}</p><button class="btn" data-go="/">Home</button></div>`; return; } }
    if (p[0] === "notes") {
      try {
        if (p[1] === "new") return await pageNoteForm("new", null, p[3] ? "/l/" + p[2] + "/" + p[3] : "/notes", p[2] ? { subject: p[2], lecture: p[3] || "" } : null);
        if (p[1] === "edit" && p[2]) return await pageNoteForm("edit", p[2], p[3] === "me" ? "/me" : "/notes");
        return await pageNotes();
      } catch (e) { D.getElementById("view").innerHTML = `<div class="empty"><h3>Something went wrong</h3><p>${esc(e.message)}</p><button class="btn" data-go="/">Home</button></div>`; return; }
    }
    return r0.call(EF, p);
  };
  EF.home = function () { const r = home0.apply(EF, arguments); try { homeCards(); } catch (e) { } return r; };
  const lec0 = EF.lecture;
  if (typeof lec0 === "function") EF.lecture = function (L, s) { const r = lec0.apply(EF, arguments); try { lectureNotes(L, s); } catch (e) { } return r; };
}

const css = `
#etoBack{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:28;width:30px;height:56px;padding:0;border:0;border-radius:0 16px 16px 0;background:rgba(18,53,91,.82);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25);opacity:.9;-webkit-tap-highlight-color:transparent;padding-left:env(safe-area-inset-left,0px);box-sizing:content-box}
#etoBack:active{opacity:1;background:#12355b}
#etoBack[hidden]{display:none}
@media print{#etoBack{display:none!important}}
.of-wrap{max-width:1100px;margin:0 auto;padding:0 18px 60px}
.of-top{background:#fff;border:1px solid var(--bd,#e1e7ed);border-radius:18px;padding:18px;margin:18px 0;box-shadow:0 1px 2px rgba(18,53,91,.06),0 4px 14px rgba(18,53,91,.05)}
.of-sum{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}.of-sum b{font-size:1.6rem;color:var(--navy,#12355b)}.of-sum small{color:var(--mu,#5a6b78);margin-inline-start:auto}
.of-acts{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.of-acts .btn,.of-gh .btn,.of-row .btn,.nt-act .btn{display:inline-flex;align-items:center;gap:6px;justify-content:center}
.of-note{margin:14px 0;padding:12px 14px;border-radius:12px;background:#fff7e6;border:1px solid #f5d28a;color:#7a4b00}
.of-prog{position:relative;height:30px;margin-top:14px;border-radius:99px;background:#e6edf3;overflow:hidden}
.of-prog i{display:block;height:100%;width:0;background:var(--teal,#0e8a8a);transition:width .2s}
.of-prog span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;color:#12232e}
.of-grp{background:#fff;border:1px solid var(--bd,#e1e7ed);border-radius:18px;padding:6px 16px 10px;margin:16px 0}
.of-gh{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 0;border-bottom:1px solid var(--bd,#e1e7ed)}.of-gh h3{margin:0;color:var(--navy,#12355b);font-size:1.2rem}.of-cnt{color:var(--mu,#5a6b78);font-weight:700}.of-gh .btn{margin-inline-start:auto}
.of-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--bd,#e1e7ed)}.of-row:last-child{border-bottom:0}
.of-i{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.of-i span{color:var(--mu,#5a6b78);font-size:.92rem;overflow-wrap:anywhere}
.of-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:.8rem;font-weight:700;white-space:nowrap}
.of-chip.ok{background:#e3f6ea;color:#15803d}.of-chip.no{background:#eef2f6;color:#5a6b78}
.of-busy .btn{opacity:.5;pointer-events:none}
@media(max-width:560px){.of-row{flex-wrap:wrap}.of-i{flex-basis:100%}.of-row .btn{flex:1}}
.nt-form{background:#fff;border:1px solid var(--bd,#e1e7ed);border-radius:18px;padding:18px;margin:18px 0;display:grid;gap:12px;box-shadow:0 1px 2px rgba(18,53,91,.06),0 4px 14px rgba(18,53,91,.05)}
.nt-form h3{margin:0;color:var(--navy,#12355b);display:flex;align-items:center;gap:8px}
.nt-form label{display:grid;gap:6px;font-weight:700;font-size:.92rem}
.nt-form input,.nt-form select,.nt-bar input,.nt-bar select{font:inherit;font-size:16px;padding:11px 12px;border:1.5px solid var(--bd,#d6dee6);border-radius:12px;background:#fff;color:inherit;min-width:0;width:100%;box-sizing:border-box}
.nt-form input:focus,.nt-form select:focus,.nt-bar input:focus,.nt-bar select:focus{outline:3px solid rgba(14,138,138,.25);border-color:var(--teal,#0e8a8a)}
.nt-help{margin:0;color:var(--mu,#5a6b78);font-size:.88rem;line-height:1.7}
.nt-err{padding:10px 12px;border-radius:10px;background:#fdecec;color:#b91c1c;border:1px solid #f5b5b5;font-weight:700}
.nt-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}
.nt-add{display:inline-flex;align-items:center;gap:6px;width:auto;min-height:40px;padding:8px 16px;border-radius:99px;font-size:.92rem}
.nt-form .btn,.nt-fa .btn{width:auto;justify-self:start}
.nt-fa{display:flex;gap:10px;flex-wrap:wrap}
.nt-own{display:flex;gap:8px;padding-top:10px;border-top:1px solid var(--bd,#e1e7ed)}.nt-own .btn{flex:1;min-height:38px;font-size:.88rem}
.nt-meadd{margin:8px 0}
.nt-merow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 0;border-bottom:1px solid var(--bd,#e1e7ed)}
.nt-mei{flex:1;min-width:180px;display:flex;flex-direction:column;gap:4px}.nt-mei b{overflow-wrap:anywhere}.nt-mei small{color:var(--mu,#5a6b78)}
.nt-mea{display:flex;gap:6px}
.nt-bar{display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;margin:8px 0 16px}
@media(max-width:560px){.nt-bar{grid-template-columns:1fr}}
.nt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr));gap:16px}
.nt-card{background:#fff;border:1px solid var(--bd,#e1e7ed);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:10px;box-shadow:0 1px 2px rgba(18,53,91,.06),0 4px 14px rgba(18,53,91,.05)}
.nt-top{display:flex;gap:12px;align-items:flex-start}.nt-top h3{margin:0 0 6px;font-size:1.05rem;color:var(--navy,#12355b);overflow-wrap:anywhere}
.nt-ic{flex:none;width:44px;height:44px;border-radius:12px;background:var(--navy,#12355b);color:#fff;display:flex;align-items:center;justify-content:center}
.nt-by{color:var(--mu,#5a6b78);font-size:.9rem}.nt-by b{color:var(--ink,#12232e)}
.nt-act{display:flex;gap:8px;margin-top:auto}.nt-act .btn{flex:1}
#ntViewer{position:fixed;inset:0;z-index:1500;background:#fff;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
.nt-vh{display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--navy,#12355b);color:#fff}.nt-vh b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nt-vh .btn{min-height:40px;padding:6px 12px}
.nt-vhint{padding:6px 12px;font-size:.8rem;background:#f3f6f9;color:var(--mu,#5a6b78)}
#ntViewer iframe{flex:1;width:100%;border:0;background:#fff}
.nt-st{display:inline-flex;gap:12px;margin-inline-start:8px;color:var(--mu,#5a6b78);font-size:.85rem;vertical-align:middle}.nt-st>span{display:inline-flex;align-items:center;gap:4px}
.nt-use.on{background:var(--teal,#0e8a8a);border-color:var(--teal,#0e8a8a);color:#fff}
.nt-lec{margin:26px 0 8px;background:var(--card,#fff);border:1px solid var(--bd,#e1e7ed);border-radius:18px;padding:16px 18px;box-shadow:0 1px 2px rgba(18,53,91,.06),0 4px 14px rgba(18,53,91,.05)}
.nt-lech{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px}.nt-lech h3{margin:0;color:var(--navy,#12355b);font-size:1.1rem}
.nt-lecr{display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid var(--bd,#e1e7ed)}.nt-lecr .btn{flex:none;min-height:38px;padding:6px 18px}
`;
const st = D.createElement("style"); st.textContent = css; D.head.appendChild(st);

patchEF();
initMeNotes();
if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", initBack); else initBack();
})();
