/* js/mytools.js - صفحة "أدواتي" (#/tools) + أول أداة: قارئ PDF ذكي (#/tools/pdf)
   - رفع ملف PDF من الجهاز (مابيتبعتش لأي سيرفر)
   - ترجمة الملف كله (عربي / English / Français / Español / Deutsch / Türkçe) صفحة صفحة براحتك
   - ظلّل أي كلمة أو جملة بالماوس أو بالإصبع ← زرارين: "ترجمة" و "فهمني"
   - "فهمني" ← "عايز تفهم دي؟" ← أيوه ← صفحة فيها شرح ويكيبيديا + الصور باللغة اللي اخترتها
   بيتحمّل بعد features_2.js وقبل app.js، وبيتربط من خلال window.EF زي باقي الصفحات. */
(() => {
"use strict";
const W = window, D = document;
const CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
const LANGS = [["ar", "العربية"], ["en", "English"], ["fr", "Français"], ["es", "Español"], ["de", "Deutsch"], ["tr", "Türkçe"]];
const LKEY = "etoedu-mytools-lang";
const MAX_MB = 80;

const q1 = (s, r = D) => r.querySelector(s);
const T = (ar, en) => (D.body.dataset.l === "en" ? en : ar);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const dirOf = l => (l === "ar" ? "rtl" : "ltr");
const isAr = s => /[\u0600-\u06FF]/.test(s);
const getLang = () => { try { return localStorage.getItem(LKEY) || "ar"; } catch (e) { return "ar"; } };
const setLang = l => { try { localStorage.setItem(LKEY, l); } catch (e) { } };
const langOpts = sel => LANGS.map(([c, n]) => `<option value="${c}"${c === sel ? " selected" : ""}>${n}</option>`).join("");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const B = (en, ar) => (typeof bi === "function" ? bi({ en, ar }) : ar);

/* ================= الترجمة (نفس خدمة القارئ القديم، بدون مفتاح) ================= */
const trCache = new Map();
async function gtx(text, tl, sl) {
  sl = sl || "auto";
  const key = sl + ">" + tl + ">" + text;
  if (trCache.has(key)) return trCache.get(key);
  let err;
  for (let i = 0; i < 2; i++) {
    try {
      const r = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&sl=" + sl + "&tl=" + tl + "&q=" + encodeURIComponent(text));
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      const main = (j[0] || []).map(x => (x && x[0]) || "").join("").trim();
      if (!main) throw new Error("empty");
      const alts = [];
      (j[1] || []).forEach(g => (g[1] || []).slice(0, 4).forEach(w => { if (w && w !== main && !alts.includes(w)) alts.push(w); }));
      const out = { main, alts: alts.slice(0, 6), src: j[2] || "" };
      trCache.set(key, out); return out;
    } catch (e) { err = e; await sleep(400); }
  }
  throw err;
}
const enc = s => encodeURIComponent(s).length;
function splitSentences(p, lim) {
  const sents = p.match(/[^.!?؟۔]+[.!?؟۔]*\s*/g) || [p], out = []; let cur = "";
  sents.forEach(s => { if (cur && enc(cur + s) > lim) { out.push(cur.trim()); cur = ""; } cur += s; });
  if (cur.trim()) out.push(cur.trim());
  return out.flatMap(s => { if (enc(s) <= lim) return [s]; const r = [], step = Math.floor(lim / 6); for (let i = 0; i < s.length; i += step) r.push(s.slice(i, i + step)); return r; });
}
function chunkParas(paras, lim) {
  lim = lim || 1800;
  const out = []; let cur = [], len = 0;
  const push = () => { if (cur.length) out.push(cur); cur = []; len = 0; };
  paras.forEach(p => { (enc(p) > lim ? splitSentences(p, lim) : [p]).forEach(s => { const l = enc(s) + 3; if (len + l > lim) push(); cur.push(s); len += l; }); });
  push(); return out;
}
async function translateParas(paras, tl, sl) {
  const res = [];
  for (const ch of chunkParas(paras)) {
    const r = await gtx(ch.join("\n"), tl, sl);
    res.push(...r.main.split(/\n+/).map(s => s.trim()).filter(Boolean));
    await sleep(120);
  }
  return res;
}

/* ================= ويكيبيديا (endpoints عامة بدون API key، مع كاش) ================= */
const wcache = new Map();
const wapi = (lang, p) => "https://" + lang + ".wikipedia.org/w/api.php?" + new URLSearchParams(Object.assign({ format: "json", formatversion: "2", origin: "*" }, p));
async function wj(url) {
  if (wcache.has(url)) return wcache.get(url);
  const r = await fetch(url); if (!r.ok) throw new Error("HTTP " + r.status);
  const j = await r.json(); wcache.set(url, j); return j;
}
async function wikiSearch(q, lang) {
  const j = await wj(wapi(lang, { action: "query", generator: "search", gsrsearch: q, gsrlimit: "6", gsrnamespace: "0", prop: "pageimages|description", piprop: "thumbnail", pithumbsize: "120" }));
  return ((j.query && j.query.pages) || []).sort((a, b) => a.index - b.index).map(p => ({ title: p.title, desc: p.description || "", thumb: p.thumbnail && p.thumbnail.source }));
}
async function wikiPage(lang, title, tl) {
  const o = { action: "query", titles: title, redirects: "1", prop: "extracts|pageimages|description|info|pageprops", exintro: "1", explaintext: "1", exsectionformat: "plain", piprop: "thumbnail|original", pithumbsize: "900", inprop: "url", ppprop: "disambiguation" };
  if (tl && tl !== lang) { o.prop += "|langlinks"; o.lllang = tl; }
  const j = await wj(wapi(lang, o));
  const p = ((j.query && j.query.pages) || [])[0];
  if (!p || p.missing || p.invalid) return null;
  return {
    lang, title: p.title, desc: p.description || "", extract: (p.extract || "").trim(),
    thumb: (p.thumbnail && p.thumbnail.source) || (p.original && p.original.source) || "", full: (p.original && p.original.source) || "",
    url: p.fullurl || ("https://" + lang + ".wikipedia.org/wiki/" + encodeURIComponent(p.title.replace(/ /g, "_"))),
    disamb: !!(p.pageprops && "disambiguation" in p.pageprops),
    ll: p.langlinks && p.langlinks[0] && p.langlinks[0].title
  };
}
async function wikiGallery(lang, title) {
  const j = await wj(wapi(lang, { action: "query", generator: "images", titles: title, gimlimit: "40", prop: "imageinfo", iiprop: "url|mime", iiurlwidth: "800" }));
  const bad = /(logo|icon|flag|symbol|commons-|wiki|button|question|edit|ambox|portal|stub|folder|oojs|pog|nuvola|crystal|sound|speaker|increase|decrease|steady|arrow|padlock|disambig|merge|search)/i;
  return ((j.query && j.query.pages) || []).filter(p => { const ii = p.imageinfo && p.imageinfo[0]; return ii && /^image\/(jpeg|png|webp)$/.test(ii.mime) && !bad.test(p.title); })
    .slice(0, 14).map(p => { const ii = p.imageinfo[0]; return { src: ii.thumburl || ii.url, full: ii.url, page: ii.descriptionurl || ii.url, cap: String(p.title).replace(/^[^:]+:/, "").replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " ") }; });
}
const clean = s => String(s).replace(/[|<>\[\]{}#]/g, " ").replace(/\s+/g, " ").trim();

/* بيدور على الصفحة بلغة النص الأصلي، وبعدين بياخد نسختها باللغة المطلوبة (langlinks) */
async function findSource(text, tl) {
  const q = clean(text).slice(0, 90); if (!q) return null;
  const words = q.split(" ").length;
  const attempt = async (term, langs) => {
    for (const lg of langs) {
      const [exact, cands] = await Promise.all([
        words <= 5 ? wikiPage(lg, term, tl).catch(() => null) : null,
        wikiSearch(term, lg).catch(() => [])
      ]);
      if (exact && !exact.disamb && exact.extract) return { page: exact, cands: cands.filter(c => c.title !== exact.title) };
      for (const c of cands.slice(0, 3)) {
        const p = await wikiPage(lg, c.title, tl).catch(() => null);
        if (p && !p.disamb && p.extract) return { page: p, cands: cands.filter(x => x.title !== p.title) };
      }
    }
    return null;
  };
  let r = await attempt(q, isAr(q) ? ["ar", "en"] : ["en"]);
  if (!r) { try { const t = await gtx(q, "en"); if (t.main && t.main.toLowerCase() !== q.toLowerCase()) r = await attempt(clean(t.main), ["en"]); } catch (e) { } }
  if (!r && !isAr(q) && tl !== "en") r = await attempt(q, [tl]);
  return r;
}
async function explain(text, tl, forced) {
  let found;
  if (forced) { const p = await wikiPage(forced.lang, forced.title, tl); found = p ? { page: p, cands: forced.cands || [] } : null; }
  else found = await findSource(text, tl);
  if (!found) return null;
  const src = found.page; let shown = src, machine = false;
  if (src.lang !== tl) {
    if (src.ll) { const t = await wikiPage(tl, src.ll, null).catch(() => null); if (t && t.extract) shown = t; }
    if (shown === src) {
      machine = true;
      const paras = src.extract.split(/\n+/).filter(Boolean).slice(0, 8);
      const [body, title] = await Promise.all([translateParas(paras, tl, src.lang).catch(() => null), gtx(src.title, tl, src.lang).catch(() => null)]);
      shown = Object.assign({}, src, { extract: body ? body.join("\n") : src.extract, title: title ? title.main : src.title, failed: !body });
    }
  }
  const gal = await wikiGallery(src.lang, src.title).catch(() => []);
  return { shown, src, machine, cands: found.cands, gal };
}

/* ================= pdf.js ================= */
let libP = null;
function loadLib() {
  const ready = () => { const g = W.pdfjsLib.GlobalWorkerOptions; if (!g.workerSrc) g.workerSrc = CDN + "pdf.worker.min.js"; };
  if (W.pdfjsLib) { ready(); return Promise.resolve(); }
  return libP || (libP = new Promise((ok, no) => {
    const s = D.createElement("script"); s.src = CDN + "pdf.min.js";
    s.onload = () => { ready(); ok(); }; s.onerror = () => { libP = null; no(new Error("pdf.js")); };
    D.head.append(s);
  }));
}

/* ================= الستايل ================= */
function injectStyle() {
  if (D.getElementById("mtStyle")) return;
  const st = D.createElement("style"); st.id = "mtStyle";
  st.textContent = `
#mtR,#mtX,#mtLB,#mtSel,.mt-up,.mw,.pow{--g1:#0e8a8a;--g2:#12355b;--g3:#38bdf8;--amb2:#f59e0b;--grad:linear-gradient(135deg,var(--g1),var(--g2));--sh1:0 1px 2px rgba(15,40,70,.07),0 8px 24px rgba(15,40,70,.08);--sh2:0 16px 48px rgba(15,40,70,.22)}
@keyframes mtrise{from{opacity:0;transform:translateY(16px)}}
@keyframes mtfloat{50%{transform:translateY(-6px)}}
@keyframes mtpop{from{opacity:0;transform:translateY(6px) scale(.96)}}
@keyframes mtsk{to{background-position:-200% 0}}

/* ================= صفحة الرفع ================= */
.mt-up{max-width:840px;margin:22px auto 90px;padding:0 16px;animation:mtrise .5s both}
.mt-drop{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:62px 22px;border:2px dashed transparent;border-radius:30px;cursor:pointer;transition:transform .25s,box-shadow .25s;background:linear-gradient(var(--card,#fff),var(--card,#fff)) padding-box,linear-gradient(135deg,var(--g1),var(--g3),var(--g2)) border-box;box-shadow:var(--sh1)}
.mt-drop::before{content:"";position:absolute;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(14,138,138,.2),transparent 65%);top:-180px;inset-inline-end:-100px;pointer-events:none;transition:transform .6s}
.mt-drop:hover,.mt-drop.over,.mt-drop:focus-visible{transform:translateY(-3px);box-shadow:var(--sh2);outline:0}
.mt-drop:hover::before,.mt-drop.over::before{transform:scale(1.3)}
.mt-dic{position:relative;width:88px;height:88px;border-radius:28px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:40px;background:var(--grad);box-shadow:0 14px 30px rgba(14,138,138,.42);animation:mtfloat 3.2s ease-in-out infinite}
.mt-drop b{position:relative;font-size:1.35rem;color:var(--ink,#12232e)}
.mt-drop span{position:relative;color:var(--mu,#5a6b78);font-size:.96rem}
.mt-opts{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:18px 2px 4px;color:var(--mu,#5a6b78);font-weight:600}
.mt-opts select{min-height:44px;padding:6px 14px;border:1.5px solid var(--bd,#e1e7ed);border-radius:14px;background:var(--card,#fff);color:var(--ink,#12232e);font:700 15px Cairo,Inter,sans-serif;box-shadow:var(--sh1)}
.mt-feat{list-style:none;margin:22px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}
.mt-feat li{position:relative;background:var(--card,#fff);border:1px solid var(--bd,#e1e7ed);border-radius:20px;padding:16px 18px;font-size:.93rem;line-height:1.8;color:var(--mu,#5a6b78);box-shadow:var(--sh1);transition:transform .2s,box-shadow .2s}
.mt-feat li:hover{transform:translateY(-3px);box-shadow:var(--sh2)}
.mt-feat b{display:block;color:var(--ink,#12232e);margin-bottom:3px;font-size:1rem}
.mt-priv{margin:18px 4px 0;color:var(--mu,#5a6b78);font-size:.85rem;line-height:1.9}
.mt-err{margin-top:14px;padding:12px 16px;border-radius:14px;background:#fdecec;color:#b42318;border:1px solid #f5c2c0;font-weight:600}
html[data-theme="dark"] .mt-err{background:#321618;color:#fca5a5;border-color:#6b2a2d}

/* ================= القارئ ================= */
body.mt-lock{overflow:hidden}
#mtR{--mt-bg:linear-gradient(180deg,#dde5ee,#c9d3df);position:fixed;inset:0;z-index:10050;display:flex;flex-direction:column;background:var(--mt-bg);color:var(--ink,#12232e);font:15px/1.5 Cairo,Inter,system-ui,sans-serif;animation:mtrise .25s both}
html[data-theme="dark"] #mtR{--mt-bg:linear-gradient(180deg,#0d1626,#080d18)}
#mtR [hidden]{display:none!important}
#mtR button,#mtR select{font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mt-top{display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top,0px)) 10px 8px;background:linear-gradient(135deg,#12355b,#0e6f7a);color:#fff;box-shadow:0 4px 18px rgba(0,0,0,.18);position:relative;z-index:6}
.mt-title{flex:1;min-width:0;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mt-pg{font-size:13px;font-weight:700;padding:4px 12px;border-radius:99px;background:rgba(255,255,255,.16);white-space:nowrap;direction:ltr}
.mt-b{min-width:40px;height:40px;border:0;border-radius:12px;background:rgba(255,255,255,.15);color:#fff;font-size:18px;font-weight:700;transition:background .15s,transform .15s}
.mt-b:hover{background:rgba(255,255,255,.28)}.mt-b:active{transform:scale(.93)}
.mt-lang{height:40px;border:0;border-radius:12px;background:rgba(255,255,255,.16);color:#fff;padding:0 10px;max-width:116px;font-weight:700}
.mt-lang option{color:#12232e}
.mt-tabs{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--card,#fff);border-bottom:1px solid var(--bd,#e1e7ed);overflow-x:auto;scrollbar-width:none;position:relative;z-index:5}
.mt-tabs::-webkit-scrollbar{display:none}
.mt-tabs button{flex:none;min-height:40px;padding:0 18px;border:1px solid var(--bd,#cbd5e1);border-radius:99px;background:transparent;color:var(--ink,#12232e);font-weight:700;transition:all .2s}
.mt-tabs button:hover{border-color:var(--g1)}
.mt-tabs button.on{background:var(--grad);color:#fff;border-color:transparent;box-shadow:0 6px 16px rgba(14,138,138,.35)}
.mt-hint{flex:none;margin-inline-start:auto;font-size:.82rem;color:var(--mu,#5a6b78);white-space:nowrap}
.mt-body{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;position:relative}
.mt-pages{width:max-content;min-width:100%;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:16px;padding:16px 10px 120px;direction:ltr}
.mt-page{position:relative;background:#fff;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,.12),0 14px 36px rgba(0,0,0,.2);isolation:isolate;flex:none}
.mt-page canvas{position:absolute;left:0;top:0;z-index:1;border-radius:6px}
html[data-theme="dark"] .mt-page canvas{filter:brightness(.9)}

/* طبقة النص (التحديد) */
.mt-tl{position:absolute;inset:0;overflow:hidden;line-height:1;z-index:4;opacity:1;text-align:initial;text-size-adjust:none;-webkit-text-size-adjust:none;forced-color-adjust:none;-webkit-user-select:text;user-select:text;-webkit-touch-callout:none}
.mt-tl span,.mt-tl br{position:absolute;white-space:pre;color:transparent;cursor:text;transform-origin:0 0;-webkit-user-select:text;user-select:text}
.mt-tl span::selection{color:transparent;background:rgba(14,138,138,.4)}
.mt-tl .endOfContent{display:block;position:absolute;inset:100% 0 0;z-index:-1;cursor:default;-webkit-user-select:none;user-select:none}
.mt-tl .endOfContent.active{inset:0}
.mt-load{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;font-weight:700;color:var(--mu,#5a6b78);pointer-events:none}

/* ================= ترجمة الملف كله ================= */
.mt-trv{max-width:1080px;margin:0 auto;padding:14px 12px 120px}
.mt-trh{position:sticky;top:8px;z-index:5;background:var(--card,#fff);border:1px solid var(--bd,#e1e7ed);border-radius:20px;padding:14px 16px;margin-bottom:16px;box-shadow:var(--sh2);backdrop-filter:blur(10px)}
.mt-trbar{height:8px;border-radius:9px;background:var(--bd,#e1e7ed);overflow:hidden}
.mt-trbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--g1),var(--g3));border-radius:9px;transition:width .4s}
.mt-trrow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px}
.mt-trst{flex:1;min-width:140px;font-size:.88rem;font-weight:600;color:var(--mu,#5a6b78)}
.mt-trrow button,.mt-trp button{min-height:38px;padding:0 15px;border:1px solid var(--bd,#cbd5e1);border-radius:12px;background:var(--card-2,#f4f7fa);color:var(--ink,#12232e);font-weight:700;transition:all .15s}
.mt-trrow button:hover,.mt-trp button:hover{border-color:var(--g1);transform:translateY(-1px)}
.mt-trrow button.main{background:var(--grad);color:#fff;border-color:transparent;box-shadow:0 6px 16px rgba(14,138,138,.32)}
.mt-trrow button.off{opacity:.55}
.mt-trp{background:var(--card,#fff);border:1px solid var(--bd,#e1e7ed);border-radius:22px;padding:16px 18px 20px;margin:0 0 16px;box-shadow:var(--sh1);transition:box-shadow .25s}
.mt-trp:hover{box-shadow:var(--sh2)}
.mt-trp header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;color:var(--mu,#5a6b78);font-size:.85rem}
.mt-trp header b{display:inline-flex;align-items:center;padding:3px 14px;border-radius:99px;background:rgba(14,138,138,.13);color:var(--g1);font-size:.85rem}
.mt-trpg{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:20px;align-items:start;direction:ltr}
.mt-noimg .mt-trpg{grid-template-columns:minmax(0,1fr)}
.mt-noimg .mt-pic{display:none}
.mt-pic{position:sticky;top:120px;width:100%;border-radius:12px;overflow:hidden;background:linear-gradient(90deg,var(--bd,#e1e7ed),var(--card-2,#f3f6f9),var(--bd,#e1e7ed));background-size:200% 100%;animation:mtsk 1.4s linear infinite;box-shadow:0 2px 6px rgba(0,0,0,.12),0 10px 26px rgba(0,0,0,.14);display:flex;align-items:center;justify-content:center;color:var(--mu,#5a6b78);font-size:.85rem}
.mt-pic.ok{animation:none;background:#fff;cursor:zoom-in}
.mt-pic img{display:block;width:100%;height:auto;transition:transform .35s}
.mt-pic.ok:hover img{transform:scale(1.02)}
.mt-trc p{margin:0 0 .85em;line-height:2.05;font-size:1.04rem;overflow-wrap:anywhere}
.mt-trc .st{color:var(--mu,#5a6b78);padding:8px 0}
@media(max-width:760px){.mt-trpg{grid-template-columns:minmax(0,1fr)}.mt-pic{position:static;max-width:420px;margin:0 auto}.mt-hint{display:none}}

/* ================= شريط ترجمة / فهمني ================= */
#mtSel{position:fixed;z-index:10070;max-width:min(340px,calc(100vw - 16px));min-width:160px;background:var(--card,#fff);color:var(--ink,#12232e);border:1px solid var(--bd,#e1e7ed);border-radius:20px;box-shadow:0 18px 50px rgba(0,0,0,.32);padding:9px;font:15px/1.6 Cairo,Inter,system-ui,sans-serif;animation:mtpop .16s both;backdrop-filter:blur(12px)}
#mtSel [hidden]{display:none!important}
#mtSel .sb-row{display:flex;gap:7px}
#mtSel button{flex:1;min-height:44px;border:0;border-radius:13px;font:700 15px Cairo,Inter,sans-serif;cursor:pointer;color:var(--ink,#12232e);background:var(--card-2,#eef2f6);padding:0 12px;transition:transform .12s,filter .12s;-webkit-tap-highlight-color:transparent}
#mtSel button:hover{filter:brightness(.96)}#mtSel button:active{transform:scale(.95)}
#mtSel button.sb-t{background:var(--grad);color:#fff}
#mtSel button.sb-x,#mtSel button.sb-y{background:linear-gradient(135deg,#fbbf24,var(--amb2));color:#12232e}
#mtSel button.sb-i{flex:0 0 44px;padding:0}
#mtSel .sb-h{display:flex;align-items:center;gap:8px;margin:0 2px 6px}
#mtSel .sb-w{flex:1;min-width:0;font-size:.85rem;color:var(--mu,#5a6b78);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:auto}
#mtSel .sb-c{flex:0 0 32px;min-height:32px;height:32px;padding:0;border-radius:10px}
#mtSel .sb-m{font-size:1.25rem;font-weight:700;color:var(--ink,#12232e);padding:2px 4px 6px;overflow-wrap:anywhere;max-height:34vh;overflow:auto;line-height:1.7}
#mtSel .sb-a{padding:0 4px 8px;color:var(--mu,#5a6b78);font-size:.88rem}
#mtSel .sb-q{padding:4px 6px 10px;font-weight:700;line-height:1.7}

/* ================= مشاهد الصور (لايت بوكس) ================= */
#mtLB{position:fixed;inset:0;z-index:10090;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(5,9,16,.88);backdrop-filter:blur(8px);animation:mtrise .2s both;cursor:zoom-out}
#mtLB img{max-width:100%;max-height:100%;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.6);background:#fff}
#mtLB button{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));inset-inline-end:14px;width:44px;height:44px;border:0;border-radius:14px;background:rgba(255,255,255,.18);color:#fff;font-size:20px;cursor:pointer}

/* ================= فهمني / ويكيبيديا (مشترك بين الصفحة المنبثقة والأداة) ================= */
#mtX{position:fixed;inset:0;z-index:10080;display:flex;flex-direction:column;background:var(--bg,#f3f6f9);color:var(--ink,#12232e);font:16px/1.7 Cairo,Inter,system-ui,sans-serif;animation:mtrise .24s both}
html[data-theme="dark"] #mtX{background:#0a111d}
#mtX [hidden]{display:none!important}
#mtX .mx-top{display:flex;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 12px 10px;background:linear-gradient(135deg,#12355b,#0e6f7a);color:#fff;box-shadow:0 4px 18px rgba(0,0,0,.18)}
#mtX .mx-top button,#mtX .mx-top select{height:42px;border:0;border-radius:12px;background:rgba(255,255,255,.16);color:#fff;font:700 15px Cairo,Inter,sans-serif;padding:0 14px;cursor:pointer;transition:background .15s}
#mtX .mx-top button:hover{background:rgba(255,255,255,.28)}
#mtX .mx-top select option{color:#12232e}
#mtX .mx-top form{flex:1;min-width:0;display:flex;gap:6px}
#mtX .mx-top input{flex:1;min-width:0;height:42px;border:0;border-radius:12px;background:rgba(255,255,255,.96);color:#12232e;padding:0 14px;font:600 15px Cairo,Inter,sans-serif;outline:0}
#mtX .mx-top input:focus{box-shadow:0 0 0 3px rgba(56,189,248,.55)}
#mtX .mx-scroll{flex:1;overflow:auto;-webkit-overflow-scrolling:touch}

.mxr .mx-wrap{direction:ltr;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr);gap:28px;max-width:1160px;margin:0 auto;padding:28px 18px 80px;align-items:start}
.mxr .mx-text{background:var(--card,#fff);border:1px solid var(--bd,#e1e7ed);border-radius:28px;padding:32px 36px 34px;box-shadow:var(--sh1),0 18px 50px rgba(15,40,70,.08);animation:mtrise .4s both}
.mxr .mx-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,rgba(14,138,138,.16),rgba(56,189,248,.16));color:var(--g1);border-radius:99px;padding:3px 14px;font-size:.78rem;font-weight:700;margin-bottom:10px}
html[data-theme="dark"] .mxr .mx-badge{color:#6ee7d8}
.mxr h1{margin:0;font-size:clamp(1.7rem,4.2vw,2.5rem);line-height:1.3;font-weight:800;color:var(--ink,#12232e)}
.mxr .mx-desc{margin:6px 0 18px;color:var(--mu,#5a6b78);font-size:1rem}
.mxr .mx-body p{margin:0 0 1.05em;font-size:1.07rem;line-height:2.1}
.mxr .mx-body p:first-child::first-line{font-weight:700}
.mxr .mx-note{margin:6px 0 16px;padding:12px 16px;border-radius:14px;background:rgba(245,158,11,.13);border:1px solid rgba(245,158,11,.45);font-size:.88rem;line-height:1.85}
.mxr .mx-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.mxr .mx-acts a{display:inline-flex;align-items:center;min-height:44px;padding:0 22px;border-radius:99px;background:var(--grad);color:#fff;text-decoration:none;font-weight:700;font-size:.95rem;box-shadow:0 8px 20px rgba(14,138,138,.32);transition:transform .15s}
.mxr .mx-acts a:hover{transform:translateY(-2px)}
.mxr .mx-lic{margin-top:16px;font-size:.78rem;color:var(--mu,#5a6b78);line-height:1.9}
.mxr .mx-more{margin-top:24px;padding-top:18px;border-top:1px solid var(--bd,#e1e7ed)}
.mxr .mx-more h4{margin:0 0 10px;font-size:.95rem;color:var(--mu,#5a6b78)}
.mxr .mx-chips{display:flex;flex-wrap:wrap;gap:8px}
.mxr .mx-chips button{display:flex;align-items:center;gap:10px;max-width:100%;padding:7px 16px 7px 8px;border:1px solid var(--bd,#e1e7ed);border-radius:16px;background:var(--card-2,#f6f8fa);color:var(--ink,#12232e);font:700 .88rem Cairo,Inter,sans-serif;cursor:pointer;text-align:start;transition:all .15s}
.mxr .mx-chips button:hover{border-color:var(--g1);transform:translateY(-2px);box-shadow:var(--sh1)}
.mxr .mx-chips img{width:38px;height:38px;border-radius:10px;object-fit:cover;flex:none}
.mxr .mx-chips small{display:block;color:var(--mu,#5a6b78);font-weight:400;font-size:.75rem}

/* كرت الصورة جوه النص */
.mxr .mx-imgslot:empty{display:none}
.mxr .mx-imgcard{direction:ltr;margin:0 0 22px;border-radius:22px;overflow:hidden;background:#0a101b;color:#fff;box-shadow:var(--sh2);animation:mtrise .3s both}
.mxr .ic-img{display:flex;justify-content:center;align-items:center;min-height:160px;background:radial-gradient(circle at 50% 30%,#1a2740,#05080f)}
.mxr .ic-img img{display:block;max-width:100%;max-height:60vh;object-fit:contain}
.mxr .ic-img{cursor:zoom-in}
.mxr .ic-bar{display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(255,255,255,.07)}
.mxr .ic-cap{flex:1;min-width:0;font-size:.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:auto}
.mxr .ic-bar button,.mxr .ic-bar a{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:38px;border:0;border-radius:11px;background:rgba(255,255,255,.14);color:#fff;font-size:16px;font-weight:700;text-decoration:none;cursor:pointer;transition:background .15s}
.mxr .ic-bar button:hover,.mxr .ic-bar a:hover{background:rgba(255,255,255,.28)}

.mxr .mx-media{position:sticky;top:16px}
.mxr .mx-hero{position:relative;margin:0;border-radius:26px;overflow:hidden;background:var(--card,#fff);border:1px solid var(--bd,#e1e7ed);box-shadow:var(--sh2)}
.mxr .mx-hero button.mx-im{display:block;width:100%;padding:0;border:0;background:#dfe6ec;cursor:zoom-in}
.mxr .mx-hero img{display:block;width:100%;max-height:60vh;object-fit:cover;transition:transform .5s}
.mxr .mx-hero:hover img{transform:scale(1.04)}
.mxr .mx-hero figcaption{position:absolute;inset:auto 0 0 0;padding:34px 16px 12px;font-size:.82rem;font-weight:700;color:#fff;background:linear-gradient(transparent,rgba(5,10,20,.78));direction:auto}
.mxr .mx-ph{height:250px;display:flex;align-items:center;justify-content:center;font-size:5.5rem;font-weight:800;color:#fff;background:var(--grad)}
.mxr .mx-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;margin-top:12px}
.mxr .mx-gal button{position:relative;display:block;padding:0;border:2px solid transparent;border-radius:16px;overflow:hidden;aspect-ratio:1;background:#dfe6ec;cursor:zoom-in;transition:transform .2s,border-color .2s,box-shadow .2s}
.mxr .mx-gal button:hover{transform:translateY(-3px);box-shadow:var(--sh1)}
.mxr .mx-gal button.on,.mxr .mx-hero.on{border-color:var(--g1);box-shadow:0 0 0 3px rgba(14,138,138,.35)}
.mxr .mx-gal img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s}
.mxr .mx-gal button:hover img{transform:scale(1.1)}
.mxr .mx-sk div{height:16px;border-radius:8px;margin:12px 0;background:linear-gradient(90deg,var(--bd,#e1e7ed),var(--card-2,#f3f6f9),var(--bd,#e1e7ed));background-size:200% 100%;animation:mtsk 1.2s linear infinite}
.mxr .mx-empty{max-width:560px;margin:60px auto;text-align:center;padding:0 18px}
.mxr .mx-empty h2{font-size:3rem;margin:0}
@media(max-width:820px){
  .mxr .mx-wrap{grid-template-columns:minmax(0,1fr);padding:14px 12px 60px;gap:18px}
  .mxr .mx-media{order:-1;position:static}
  .mxr .mx-text{padding:22px 18px 24px;border-radius:22px}
  .mxr .mx-hero img{max-height:42vh}
}

/* ================= أداة ويكيبيديا ================= */
.mw{max-width:1180px;margin:16px auto 90px;padding:0 14px;animation:mtrise .45s both}
.mw-hero{position:relative;overflow:hidden;border-radius:30px;padding:38px 24px 30px;text-align:center;color:#fff;background:linear-gradient(135deg,#12355b,#0e6f7a 60%,#0e8a8a);box-shadow:var(--sh2)}
.mw-hero::before,.mw-hero::after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.08);pointer-events:none}
.mw-hero::before{width:260px;height:260px;top:-110px;inset-inline-start:-60px}
.mw-hero::after{width:180px;height:180px;bottom:-80px;inset-inline-end:6%}
.mw-hero h2{position:relative;margin:0 0 4px;font-size:clamp(1.6rem,4vw,2.3rem);font-weight:800;color:#fff}
.mw-hero p{position:relative;margin:0 0 20px;opacity:.88}
.mw-form{position:relative;display:flex;gap:8px;max-width:680px;margin:0 auto;flex-wrap:wrap;justify-content:center}
.mw-form input{flex:1 1 280px;min-width:0;height:52px;border:0;border-radius:16px;padding:0 18px;font:600 16px Cairo,Inter,sans-serif;background:rgba(255,255,255,.97);color:#12232e;outline:0;box-shadow:0 8px 22px rgba(0,0,0,.18)}
.mw-form input:focus{box-shadow:0 0 0 4px rgba(56,189,248,.5)}
.mw-form select{height:52px;border:0;border-radius:16px;padding:0 14px;font:700 15px Cairo,Inter,sans-serif;background:rgba(255,255,255,.18);color:#fff;cursor:pointer}
.mw-form select option{color:#12232e}
.mw-form button{height:52px;border:0;border-radius:16px;padding:0 26px;font:800 16px Cairo,Inter,sans-serif;cursor:pointer;color:#12232e;background:linear-gradient(135deg,#fbbf24,var(--amb2));box-shadow:0 8px 22px rgba(245,158,11,.4);transition:transform .15s}
.mw-form button:hover{transform:translateY(-2px)}
.mw-sug{position:relative;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:16px}
.mw-sug button{border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.12);color:#fff;border-radius:99px;padding:6px 16px;font:700 .85rem Cairo,Inter,sans-serif;cursor:pointer;transition:background .15s}
.mw-sug button:hover{background:rgba(255,255,255,.26)}
.mw-out{margin-top:6px}
.mw-out .mx-wrap{padding-inline:0}
.mw-start{text-align:center;color:var(--mu,#5a6b78);padding:60px 10px;line-height:2}
.mw-start .big{font-size:3.4rem}
@media print{#mtR,#mtX,#mtSel,#mtLB{display:none!important}}
`;
  D.head.appendChild(st);
}

/* ================= الحالة ================= */
let R = null;              /* القارئ */
let X = null;              /* صفحة فهمني */
const BAR = { text: "", rect: null, view: "act", res: null, hold: 0, vis: false };
let skipPop = 0;
W.addEventListener("popstate", () => { if (skipPop > 0) { skipPop--; return; } if (X) closeExplain(true); else if (R) closeReader(true); });

/* ================= استخراج نص الصفحة ================= */
async function pageParas(n) {
  if (R.txt[n]) return R.txt[n];
  const tc = await R.pages[n - 1].page.getTextContent();
  const lines = []; let cur = null;
  for (const it of tc.items) {
    if (typeof it.str !== "string") continue;
    const y = it.transform[5], h = Math.abs(it.transform[3]) || 10;
    if (cur && Math.abs(y - cur.y) < h * 0.5) cur.t += it.str;
    else { cur = { t: it.str, y, h }; lines.push(cur); }
  }
  const paras = []; let p = "", prev = null;
  for (const l of lines) {
    const t = l.t.replace(/\s+/g, " ").trim(); if (!t) continue;
    if (prev && Math.abs(prev.y - l.y) > prev.h * 1.9 && p) { paras.push(p); p = ""; }
    p = !p ? t : (p.endsWith("-") ? p.slice(0, -1) + t : p + " " + t);
    prev = l;
  }
  if (p) paras.push(p);
  return (R.txt[n] = paras.filter(s => /[\p{L}\p{N}]/u.test(s)));
}

/* ================= رسم الصفحات (lazy) ================= */
async function renderPage(p) {
  if (!R || p.rendered === p.scale || p.busy) return;
  p.busy = true; const sc = p.scale;
  try {
    const vp = p.page.getViewport({ scale: sc }), ratio = Math.min(W.devicePixelRatio || 1, 2);
    const cv = p.el.querySelector("canvas");
    cv.width = Math.floor(vp.width * ratio); cv.height = Math.floor(vp.height * ratio);
    cv.style.width = vp.width + "px"; cv.style.height = vp.height + "px";
    p.task = p.page.render({ canvasContext: cv.getContext("2d"), viewport: vp, transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined });
    await p.task.promise;
    const tl = p.el.querySelector(".mt-tl"); tl.innerHTML = ""; tl.style.setProperty("--scale-factor", String(sc));
    const tc = await p.page.getTextContent();
    await W.pdfjsLib.renderTextLayer({ textContentSource: tc, container: tl, viewport: vp, textDivs: [] }).promise;
    const eoc = D.createElement("div"); eoc.className = "endOfContent"; tl.append(eoc);
    p.rendered = sc;
  } catch (e) {
    if (!(e && e.name === "RenderingCancelledException")) console.warn("PDF page render failed", e);
  } finally {
    p.busy = false;
    if (R && p.rendered !== p.scale) setTimeout(updateVisible, 30);
  }
}
function updateVisible() {
  if (!R || R.mode !== "orig") return;
  const br = R.body.getBoundingClientRect(), H = br.height; let best = null, bd = 1e9;
  R.pages.forEach(p => {
    const r = p.el.getBoundingClientRect();
    const near = r.bottom > br.top - H * 1.2 && r.top < br.bottom + H * 1.2;
    const far = r.bottom < br.top - H * 4 || r.top > br.bottom + H * 4;
    if (near) renderPage(p);
    else if (far && p.rendered && !p.busy) { p.rendered = 0; const cv = p.el.querySelector("canvas"); cv.width = cv.height = 0; p.el.querySelector(".mt-tl").innerHTML = ""; }
    const d = Math.abs((r.top + r.bottom) / 2 - (br.top + br.bottom) / 2);
    if (d < bd) { bd = d; best = p; }
  });
  if (best) R.pgEl.textContent = best.n + " / " + R.pages.length;
}
function layout() {
  if (!R) return;
  const avail = Math.max(260, R.body.clientWidth - 16);
  const ratio = R.body.scrollHeight ? R.body.scrollTop / R.body.scrollHeight : 0;
  R.pages.forEach(p => {
    if (p.task) { try { p.task.cancel(); } catch (e) { } }
    p.scale = avail / p.base.width * R.zoom;
    p.el.style.width = p.base.width * p.scale + "px"; p.el.style.height = p.base.height * p.scale + "px";
    p.rendered = 0;
  });
  if (R.mode === "orig") { R.body.scrollTop = ratio * R.body.scrollHeight; updateVisible(); }
}

/* ================= تحديد الكلمات + شريط (ترجمة / فهمني) ================= */
function wordAt(x, y) {
  let node, off;
  if (D.caretPositionFromPoint) { const c = D.caretPositionFromPoint(x, y); if (!c) return false; node = c.offsetNode; off = c.offset; }
  else if (D.caretRangeFromPoint) { const r = D.caretRangeFromPoint(x, y); if (!r) return false; node = r.startContainer; off = r.startOffset; }
  else return false;
  if (!node || node.nodeType !== 3 || !node.parentElement || !node.parentElement.closest(".mt-tl")) return false;
  const s = node.data, isW = ch => /[\p{L}\p{M}'’\-]/u.test(ch);
  let a = Math.min(off, s.length), b = a;
  while (a > 0 && isW(s[a - 1])) a--;
  while (b < s.length && isW(s[b])) b++;
  while (a < b && /['’\-]/.test(s[a])) a++;
  while (b > a && /['’\-]/.test(s[b - 1])) b--;
  if (b <= a || !/\p{L}/u.test(s.slice(a, b))) return false;
  const range = D.createRange(); range.setStart(node, a); range.setEnd(node, b);
  if (![...range.getClientRects()].some(r => x >= r.left - 4 && x <= r.right + 4 && y >= r.top - 4 && y <= r.bottom + 4)) return false;
  const sel = W.getSelection(); sel.removeAllRanges(); sel.addRange(range);
  return true;
}
function ensureBar() {
  let b = D.getElementById("mtSel");
  if (b) return b;
  b = D.createElement("div"); b.id = "mtSel"; b.hidden = true; b.dir = "rtl"; D.body.append(b);
  b.addEventListener("mousedown", e => e.preventDefault());        /* ماتضيّعش التظليل لما تدوس */
  b.addEventListener("touchstart", () => { BAR.hold = Date.now(); }, { passive: true });
  b.addEventListener("click", onBarClick);
  return b;
}
function hideBar() { const b = D.getElementById("mtSel"); if (b) b.hidden = true; BAR.vis = false; }
function selRect() {
  const s = W.getSelection();
  if (s && !s.isCollapsed && s.rangeCount && s.toString().replace(/\s+/g, " ").trim() === BAR.text) {
    const r = s.getRangeAt(0).getBoundingClientRect(); if (r.width || r.height) BAR.rect = r;
  }
  return BAR.rect;
}
function placeBar() {
  const b = ensureBar(), r = selRect(); if (!r) return;
  b.style.visibility = "hidden"; b.hidden = false;
  const w = b.offsetWidth, h = b.offsetHeight, top0 = R ? R.body.getBoundingClientRect().top + 4 : 8;
  let left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), W.innerWidth - w - 8);
  let top = r.top - h - 10;
  if (top < top0) top = r.bottom + 10;
  if (top + h > W.innerHeight - 8) top = Math.max(top0, W.innerHeight - h - 8);
  b.style.left = left + "px"; b.style.top = top + "px"; b.style.visibility = ""; BAR.vis = true;
}
function renderBar() {
  const b = ensureBar(), t = BAR.text, short = t.length > 40 ? t.slice(0, 40) + "…" : t;
  if (BAR.view === "act") {
    b.innerHTML = `<div class="sb-row"><button type="button" class="sb-t" data-b="tr">🌐 ${T("ترجمة", "Translate")}</button><button type="button" class="sb-x" data-b="ex">💡 ${T("فهمني", "Explain")}</button></div>`;
  } else if (BAR.view === "ask") {
    b.innerHTML = `<div class="sb-q">${T("عايز تفهم «" + esc(short) + "»؟", "Do you want to understand “" + esc(short) + "”?")}</div><div class="sb-row"><button type="button" class="sb-y" data-b="yes">${T("أيوه", "Yes")}</button><button type="button" data-b="no">${T("لا", "No")}</button></div>`;
  } else {
    const r = BAR.res, ok = r && r.main;
    b.innerHTML = `<div class="sb-h"><span class="sb-w">${esc(short)}</span><button type="button" class="sb-c" data-b="no" aria-label="close">✕</button></div>
      <div class="sb-m" dir="${dirOf(R ? R.lang : "ar")}">${r === null ? T("جارٍ الترجمة...", "Translating...") : ok ? esc(r.main) : T("ما قدرتش أترجم. اتأكد من النت.", "Could not translate. Check your connection.")}</div>
      ${ok && r.alts.length ? `<div class="sb-a" dir="${dirOf(R ? R.lang : "ar")}">${esc(r.alts.join(" · "))}</div>` : ""}
      <div class="sb-row"><button type="button" class="sb-i" data-b="say" aria-label="listen">🔊</button><button type="button" class="sb-i" data-b="copy" aria-label="copy">📋</button><button type="button" class="sb-x" data-b="ask">💡 ${T("فهمني", "Explain")}</button></div>`;
  }
  placeBar();
}
function showBar(text, rect) {
  BAR.text = text; BAR.rect = rect; BAR.view = "act"; BAR.res = null; renderBar();
}
async function doTranslate() {
  const text = BAR.text.slice(0, 500), lang = R.lang;
  BAR.view = "tr"; BAR.res = null; renderBar();
  let res = { main: "", alts: [], src: "" };
  try { res = await gtx(text, lang, "auto"); } catch (e) { }
  if (BAR.text.slice(0, 500) !== text || BAR.view !== "tr") return;
  BAR.res = res; renderBar();
}
function onBarClick(e) {
  const btn = e.target.closest("[data-b]"); if (!btn) return;
  const a = btn.dataset.b;
  if (a === "tr") return doTranslate();
  if (a === "ex" || a === "ask") { BAR.view = "ask"; return renderBar(); }
  if (a === "yes") { const t = BAR.text; hideBar(); return openExplain(t); }
  if (a === "no") return hideBar();
  if (a === "copy") { try { navigator.clipboard.writeText(BAR.res && BAR.res.main ? BAR.res.main : BAR.text); } catch (x) { } return; }
  if (a === "say" && W.speechSynthesis) {
    const u = new SpeechSynthesisUtterance(BAR.text); u.lang = (BAR.res && BAR.res.src) || (isAr(BAR.text) ? "ar" : "en");
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }
}
function onSelection() {
  if (!R || R.down) return;
  clearTimeout(R.selT);
  R.selT = setTimeout(() => {
    if (!R || R.down || R.mode !== "orig") return;
    const s = W.getSelection();
    if (!s || s.isCollapsed || !s.rangeCount) return;
    const rg = s.getRangeAt(0);
    if (!R.pagesEl.contains(rg.commonAncestorContainer)) return;
    const text = s.toString().replace(/\s+/g, " ").trim().slice(0, 600);
    if (!text) return;
    if (BAR.vis && BAR.text === text) return;
    showBar(text, rg.getBoundingClientRect());
  }, 260);
}

/* ================= ترجمة الملف كله ================= */
function showMode(m) {
  if (R.mode === m) return;
  if (R.mode === "orig") R.origTop = R.body.scrollTop; else R.trTop = R.body.scrollTop;
  R.mode = m; hideBar();
  R.root.querySelectorAll("[data-mode]").forEach(b => b.classList.toggle("on", b.dataset.mode === m));
  R.pagesEl.hidden = m !== "orig"; R.trv.hidden = m !== "tr";
  if (m === "tr") { buildTrView(); R.body.scrollTop = R.trTop || 0; }
  else { R.body.scrollTop = R.origTop || 0; updateVisible(); }
}
function buildTrView() {
  const v = R.trv;
  if (v.dataset.lang === R.lang && v.firstChild) { observeCards(); return; }
  v.dataset.lang = R.lang;
  v.innerHTML = `<div class="mt-trh"><div class="mt-trbar"><i></i></div><div class="mt-trrow"><span class="mt-trst"></span>
    <button type="button" class="main" data-a="trall">${T("ترجم كل الصفحات", "Translate all pages")}</button><button type="button" data-a="trstop" hidden>${T("إيقاف", "Stop")}</button>
    <button type="button" data-a="trimg">🖼 ${T("صور الصفحات", "Page images")}</button><button type="button" data-a="trtxt">⬇ ${T("تحميل txt", "Download txt")}</button><button type="button" data-a="trcopy">📋 ${T("نسخ", "Copy")}</button></div></div>
    <div class="mt-trlist" dir="${dirOf(R.lang)}">${R.pages.map(p => `<section class="mt-trp" data-n="${p.n}"><header><b>${T("صفحة", "Page")} ${p.n}</b><button type="button" data-a="gopage" data-n="${p.n}">📄 ${T("الأصل", "Original")}</button></header><div class="mt-trpg"><div class="mt-pic" data-n="${p.n}" style="aspect-ratio:${p.base.width} / ${p.base.height}" title="${T("دوس للتكبير", "Tap to enlarge")}">🖼</div><div class="mt-trc" dir="${dirOf(R.lang)}"></div></div></section>`).join("")}</div>`;
  R.pages.forEach(p => paintCard(p.n));
  updateProgress(); observeCards();
}
function observeCards() {
  if (R.io) R.io.disconnect();
  R.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && R && R.mode === "tr") { enqueue(+e.target.dataset.n); snapPage(+e.target.dataset.n); } }), { root: R.body, rootMargin: "150px" });
  R.trv.querySelectorAll(".mt-trp").forEach(c => R.io.observe(c));
}
function snapPage(n) {
  const me = R, pic = R.trv.querySelector('.mt-pic[data-n="' + n + '"]'); if (!pic || pic.dataset.s) return;
  const done = url => { pic.innerHTML = '<img alt="" src="' + url + '">'; pic.classList.add("ok"); pic.dataset.src = url; };
  if (R.snaps[n]) { pic.dataset.s = "1"; return done(R.snaps[n]); }
  pic.dataset.s = "1";
  R.snapQ = (R.snapQ || Promise.resolve()).then(async () => {
    if (R !== me) return;
    try {
      const pg = me.pages[n - 1], ratio = Math.min(W.devicePixelRatio || 1, 2), sc = 640 / pg.base.width * ratio;
      const vp = pg.page.getViewport({ scale: sc }), cv = D.createElement("canvas");
      cv.width = Math.floor(vp.width); cv.height = Math.floor(vp.height);
      await pg.page.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise;
      const blob = await new Promise(r => cv.toBlob(r, "image/jpeg", 0.86)); cv.width = cv.height = 0;
      if (R !== me || !blob) return;
      const url = URL.createObjectURL(blob); me.urls.push(url); me.snaps[n] = url; done(url);
    } catch (e) { pic.dataset.s = ""; pic.textContent = "—"; }
  });
}
function closeLB() { const e = D.getElementById("mtLB"); if (!e) return; D.removeEventListener("keydown", e._k, true); e.remove(); }
function openLB(src) {
  closeLB();
  const el = D.createElement("div"); el.id = "mtLB";
  el.innerHTML = '<img alt="" referrerpolicy="no-referrer"><button type="button" aria-label="Close">✕</button>'; el.querySelector("img").src = src;
  el.addEventListener("click", closeLB);
  el._k = e => { if (e.key === "Escape") { e.stopPropagation(); e.preventDefault(); closeLB(); } };
  D.addEventListener("keydown", el._k, true); D.body.append(el);
}
function paintCard(n) {
  const el = R && R.trv.querySelector('.mt-trp[data-n="' + n + '"] .mt-trc'); if (!el) return;
  const st = R.tr[n] || { state: "idle" };
  if (st.state === "done") el.innerHTML = st.paras.map(p => `<p>${esc(p)}</p>`).join("");
  else if (st.state === "empty") el.innerHTML = `<div class="st">${T("الصفحة دي مفيهاش نص يتحدد (ممكن تكون صورة أو مسح ضوئي).", "No selectable text on this page (maybe a scanned image).")}</div>`;
  else if (st.state === "loading" || st.state === "queued") el.innerHTML = `<div class="st">${st.state === "loading" ? T("جارٍ الترجمة...", "Translating...") : T("في الانتظار...", "Queued...")}</div>`;
  else if (st.state === "error") el.innerHTML = `<div class="st">${T("فشلت الترجمة.", "Translation failed.")} <button type="button" data-a="retry" data-n="${n}">${T("جرّب تاني", "Retry")}</button></div>`;
  else el.innerHTML = `<div class="st"><button type="button" data-a="trone" data-n="${n}">🌐 ${T("ترجم الصفحة دي", "Translate this page")}</button></div>`;
}
function updateProgress() {
  if (!R || !R.trv.firstChild) return;
  const done = R.pages.filter(p => R.tr[p.n] && (R.tr[p.n].state === "done" || R.tr[p.n].state === "empty")).length, tot = R.pages.length;
  const i = R.trv.querySelector(".mt-trbar i"), s = R.trv.querySelector(".mt-trst");
  if (i) i.style.width = done / tot * 100 + "%";
  if (s) s.textContent = T("اتترجم " + done + " من " + tot + " صفحة · " + langName(R.lang), done + " of " + tot + " pages · " + langName(R.lang));
  const stop = R.trv.querySelector('[data-a="trstop"]'), all = R.trv.querySelector('[data-a="trall"]');
  if (stop) stop.hidden = !R.bulk; if (all) all.hidden = R.bulk || done === tot;
}
const langName = c => (LANGS.find(x => x[0] === c) || [])[1] || c;
function enqueue(n, front) {
  const st = R.tr[n]; if (st && ["done", "loading", "queued", "empty"].includes(st.state)) return;
  R.tr[n] = { state: "queued" }; paintCard(n);
  front ? R.queue.unshift(n) : R.queue.push(n); pump();
}
async function pump() {
  if (R.pumping) return; R.pumping = true;
  const me = R;
  while (R === me && R.queue.length) { const n = R.queue.shift(); await translatePage(n); }
  if (R === me) { R.pumping = false; if (!R.queue.length) R.bulk = false; updateProgress(); }
}
async function translatePage(n) {
  const me = R, lang = R.lang;
  R.tr[n] = { state: "loading" }; paintCard(n);
  try {
    const paras = await pageParas(n);
    if (R !== me || R.lang !== lang) return;
    if (!paras.length) { R.tr[n] = { state: "empty" }; paintCard(n); updateProgress(); return; }
    const out = await translateParas(paras, lang, "auto");
    if (R !== me || R.lang !== lang) return;
    R.tr[n] = { state: "done", paras: out };
  } catch (e) {
    if (R !== me || R.lang !== lang) return;
    R.tr[n] = { state: "error" }; R.bulk = false;
  }
  paintCard(n); updateProgress();
}
function trText() {
  return R.pages.filter(p => R.tr[p.n] && R.tr[p.n].state === "done").map(p => "--- " + T("صفحة", "Page") + " " + p.n + " ---\n" + R.tr[p.n].paras.join("\n\n")).join("\n\n");
}
function stopBulk() {
  R.bulk = false; R.queue = [];
  R.pages.forEach(p => { if (R.tr[p.n] && R.tr[p.n].state === "queued") { delete R.tr[p.n]; paintCard(p.n); } });
  updateProgress();
}
function changeLang(l) {
  R.lang = l; setLang(l); R.tr = {}; R.queue = []; R.bulk = false; hideBar();
  if (R.mode === "tr") { R.trv.dataset.lang = ""; buildTrView(); }
}

/* ================= القارئ ================= */
async function openReader(file) {
  if (R || D.getElementById("mtR")) return;
  injectStyle();
  const root = D.createElement("div"); root.id = "mtR"; root.dir = D.body.dataset.l === "en" ? "ltr" : "rtl";
  root.innerHTML = `<div class="mt-top"><button type="button" class="mt-b" data-a="close" aria-label="Close">✕</button><div class="mt-title"></div><span class="mt-pg">-</span>
    <select class="mt-lang" aria-label="${T("لغة الترجمة", "Translate to")}">${langOpts(getLang())}</select>
    <button type="button" class="mt-b" data-a="zout" aria-label="Zoom out">−</button><button type="button" class="mt-b" data-a="zin" aria-label="Zoom in">+</button></div>
    <div class="mt-tabs"><button type="button" class="on" data-mode="orig">📄 ${T("الملف الأصلي", "Original")}</button><button type="button" data-mode="tr">🌐 ${T("ترجمة الملف كله", "Translate whole file")}</button>
    <span class="mt-hint">${T("ظلّل أي كلمة أو جملة ← ترجمة / فهمني", "Select any text → Translate / Explain")}</span></div>
    <div class="mt-body"><div class="mt-pages"></div><div class="mt-trv" hidden></div><div class="mt-load">${T("جارٍ تحميل الملف...", "Loading PDF...")}</div></div>`;
  root.querySelector(".mt-title").textContent = file.name;
  D.body.append(root); D.body.classList.add("mt-lock"); ensureBar();
  R = { root, file, lang: getLang(), zoom: 1, snaps: {}, urls: [], mode: "orig", pages: [], txt: {}, tr: {}, queue: [], pumping: false, bulk: false, down: false, doc: null,
    body: root.querySelector(".mt-body"), pagesEl: root.querySelector(".mt-pages"), trv: root.querySelector(".mt-trv"), pgEl: root.querySelector(".mt-pg") };
  const load = root.querySelector(".mt-load");

  root.addEventListener("click", e => {
    const m = e.target.closest("[data-mode]"); if (m) return showMode(m.dataset.mode);
    const pic = e.target.closest(".mt-pic.ok"); if (pic) return openLB(pic.dataset.src);
    const b = e.target.closest("[data-a]"); if (!b) return;
    const a = b.dataset.a, n = +b.dataset.n;
    if (a === "close") return closeReader();
    if (a === "zin") { R.zoom = Math.min(3, R.zoom * 1.25); return layout(); }
    if (a === "zout") { R.zoom = Math.max(0.5, R.zoom / 1.25); return layout(); }
    if (a === "gopage") { showMode("orig"); setTimeout(() => { const p = R.pages[n - 1]; if (p) R.body.scrollTop += p.el.getBoundingClientRect().top - R.body.getBoundingClientRect().top; }, 30); return; }
    if (a === "trone" || a === "retry") { delete R.tr[n]; return enqueue(n, true); }
    if (a === "trall") { R.bulk = true; R.pages.forEach(p => enqueue(p.n)); return updateProgress(); }
    if (a === "trstop") return stopBulk();
    if (a === "trimg") { const off = R.trv.classList.toggle("mt-noimg"); b.classList.toggle("off", off); return; }
    if (a === "trtxt") {
      const t = trText(); if (!t) return;
      const url = URL.createObjectURL(new Blob(["\ufeff" + t], { type: "text/plain;charset=utf-8" }));
      const l = D.createElement("a"); l.href = url; l.download = R.file.name.replace(/\.pdf$/i, "") + "-" + R.lang + ".txt"; D.body.append(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); return;
    }
    if (a === "trcopy") { try { navigator.clipboard.writeText(trText()); } catch (x) { } return; }
  });
  root.querySelector(".mt-lang").addEventListener("change", e => changeLang(e.target.value));
  R.body.addEventListener("scroll", () => {
    if (R.raf) return;
    R.raf = requestAnimationFrame(() => { R.raf = 0; updateVisible(); if (BAR.vis) placeBar(); });
  }, { passive: true });
  R.pagesEl.addEventListener("pointerdown", e => { R.down = true; const t = e.target.closest && e.target.closest(".mt-tl"); const eo = t && t.querySelector(".endOfContent"); if (eo) eo.classList.add("active"); });
  R.onUp = () => { if (!R) return; R.down = false; R.pagesEl.querySelectorAll(".endOfContent.active").forEach(x => x.classList.remove("active")); onSelection(); };
  W.addEventListener("pointerup", R.onUp); W.addEventListener("pointercancel", R.onUp);
  R.onDown = e => { if (BAR.vis && !e.target.closest("#mtSel") && Date.now() - BAR.hold > 800) hideBar(); };
  D.addEventListener("pointerdown", R.onDown, true);
  R.onSel = () => onSelection(); D.addEventListener("selectionchange", R.onSel);
  R.pagesEl.addEventListener("click", e => {                 /* دوسة واحدة على كلمة = تظليلها */
    const s = W.getSelection(); if (s && !s.isCollapsed) return;
    if (!e.target.closest(".mt-tl")) return;
    wordAt(e.clientX, e.clientY);
  });
  R.onKey = e => { if (e.key === "Escape" && !X && !D.getElementById("mtLB")) { if (BAR.vis) hideBar(); else closeReader(); } };
  D.addEventListener("keydown", R.onKey);
  R.onResize = () => { clearTimeout(R.rt); R.rt = setTimeout(() => { layout(); if (BAR.vis) placeBar(); }, 200); };
  W.addEventListener("resize", R.onResize);
  try { history.pushState({ mtr: 1 }, ""); R.pushed = true; } catch (e) { }

  try {
    await loadLib();
    const buf = await file.arrayBuffer();
    const doc = await W.pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
    if (!R) { doc.destroy(); return; }
    R.doc = doc;
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i); if (!R) return;
      const el = D.createElement("div"); el.className = "mt-page"; el.dataset.n = i;
      el.innerHTML = '<canvas></canvas><div class="mt-tl textLayer"></div>';
      R.pagesEl.append(el);
      R.pages.push({ n: i, el, page, base: page.getViewport({ scale: 1 }), scale: 1, rendered: 0, busy: false });
      if (i % 20 === 0) load.textContent = T("جارٍ التجهيز... ", "Preparing... ") + i + " / " + doc.numPages;
    }
    load.remove(); layout(); updateVisible();
  } catch (e) {
    console.warn("PDF load failed", e);
    if (!R) return;
    load.textContent = e && e.name === "PasswordException" ? T("الملف ده محمي بباسورد ومش هقدر أفتحه.", "This PDF is password-protected.") : T("ما قدرتش أفتح الملف ده. اتأكد إنه PDF سليم.", "Could not open this file. Make sure it is a valid PDF.");
  }
}
function closeReader(fromPop) {
  if (!R) return;
  const s = R; if (X) closeExplain(true);
  R = null; hideBar();
  clearTimeout(s.selT); clearTimeout(s.rt);
  W.removeEventListener("pointerup", s.onUp); W.removeEventListener("pointercancel", s.onUp);
  D.removeEventListener("pointerdown", s.onDown, true); D.removeEventListener("selectionchange", s.onSel);
  D.removeEventListener("keydown", s.onKey); W.removeEventListener("resize", s.onResize);
  if (s.io) s.io.disconnect();
  s.pages.forEach(p => { if (p.task) { try { p.task.cancel(); } catch (e) { } } });
  if (s.doc) { try { s.doc.destroy(); } catch (e) { } }
  s.root.remove(); D.body.classList.remove("mt-lock"); closeLB(); (s.urls || []).forEach(u => { try { URL.revokeObjectURL(u); } catch (e) { } });
  const sel = W.getSelection(); if (sel) sel.removeAllRanges();
  if (!fromPop && s.pushed && history.state && history.state.mtr) { skipPop++; history.back(); }
}

/* ================= صفحة فهمني (ويكيبيديا: شرح على الشمال + الصورة على اليمين) ================= */
function openExplain(text) {
  if (X) return;
  const el = D.createElement("div"); el.id = "mtX"; el.dir = "rtl";
  el.innerHTML = `<div class="mx-top"><button type="button" data-x="back" aria-label="Back">✕</button>
    <form data-x="form"><input type="text" value="${esc(text.slice(0, 90))}" aria-label="${T("اللي عايز تفهمه", "What to explain")}"><button type="submit">🔎</button></form>
    <select data-x="lang" aria-label="${T("لغة الشرح", "Explanation language")}">${langOpts(getLang())}</select></div>
    <div class="mx-scroll mxr"></div>`;
  D.body.append(el);
  X = { el, text: text.slice(0, 90), tl: getLang(), forced: null, seq: 0, scroll: el.querySelector(".mx-scroll") };
  el.addEventListener("click", e => {
    const b = e.target.closest("[data-x]"); if (!b) return;
    if (b.dataset.x === "back") return closeExplain();
    if (imgAct(X.scroll, b)) return;
    if (b.dataset.x === "cand" && X.last) {
      const c = X.last.cands[+b.dataset.i]; if (!c) return;
      const old = X.last.src;
      X.forced = { lang: old.lang, title: c.title, cands: [{ title: old.title, desc: old.desc, thumb: old.thumb }].concat(X.last.cands.filter((_, k) => k !== +b.dataset.i)) };
      runExplain();
    }
  });
  el.querySelector('[data-x="form"]').addEventListener("submit", e => {
    e.preventDefault(); const v = el.querySelector("input").value.trim(); if (!v) return;
    X.text = v; X.forced = null; runExplain();
  });
  el.querySelector('[data-x="lang"]').addEventListener("change", e => { X.tl = e.target.value; setLang(X.tl); if (R) { const s = R.root.querySelector(".mt-lang"); if (s) { s.value = X.tl; changeLang(X.tl); } } runExplain(); });
  X.onKey = e => { if (e.key === "Escape" && !D.getElementById("mtLB")) { e.stopPropagation(); closeExplain(); } };
  D.addEventListener("keydown", X.onKey, true);
  try { history.pushState({ mtx: 1 }, ""); X.pushed = true; } catch (e) { }
  runExplain();
}
function closeExplain(fromPop) {
  if (!X) return;
  const s = X; X = null;
  D.removeEventListener("keydown", s.onKey, true); s.el.remove();
  if (!fromPop && s.pushed && history.state && history.state.mtx) { skipPop++; history.back(); }
}
async function runExplain() {
  const seq = ++X.seq, tl = X.tl;
  X.scroll.innerHTML = `<div class="mx-wrap"><div class="mx-text"><span class="mx-badge">${T("ويكيبيديا", "Wikipedia")} · ${langName(tl)}</span><div class="mx-sk"><div style="width:55%;height:30px"></div><div style="width:35%"></div><div></div><div></div><div style="width:90%"></div><div style="width:70%"></div></div></div><div class="mx-media"><div class="mx-hero"><div class="mx-ph">…</div></div></div></div>`;
  let res = null, failed = false;
  try { res = await explain(X.text, tl, X.forced); } catch (e) { failed = true; }
  if (!X || seq !== X.seq) return;
  X.last = res;
  if (failed) { X.scroll.innerHTML = `<div class="mx-empty"><h2>😕</h2><p>${T("ما قدرتش أوصل لويكيبيديا. اتأكد من النت وجرّب تاني.", "Could not reach Wikipedia. Check your connection and try again.")}</p></div>`; return; }
  if (!res) { X.scroll.innerHTML = `<div class="mx-empty"><h2>🔎</h2><p>${T("ما لقيتش صفحة في ويكيبيديا لـ «" + esc(X.text) + "».", "No Wikipedia page found for “" + esc(X.text) + "”.")}</p><p style="color:var(--mu)">${T("جرّب تكتب الكلمة بشكل تاني فوق وادوس بحث.", "Try another wording in the box above.")}</p></div>`; return; }
  paintExplain(X.scroll, res, tl);
}
function imgAct(host, b) {
  const a = b.dataset.x, imgs = host._imgs || [];
  if (!["img", "iprev", "inext", "iclose", "zoom"].includes(a) || !imgs.length) return false;
  const slot = host.querySelector(".mx-imgslot"); if (!slot) return false;
  if (a === "iclose") { slot.innerHTML = ""; host._cur = -1; host.querySelectorAll('[data-x="img"].on,.mx-hero.on').forEach(x => x.classList.remove("on")); return true; }
  if (a === "zoom") { const it = imgs[host._cur]; if (it) openLB(it.src); return true; }
  const n = imgs.length; let i = a === "img" ? +b.dataset.i : host._cur + (a === "inext" ? 1 : -1);
  i = (i % n + n) % n; host._cur = i;
  const it = imgs[i];
  slot.innerHTML = `<div class="mx-imgcard"><div class="ic-img" data-x="zoom"><img src="${esc(it.src)}" alt="${esc(it.cap || "")}" referrerpolicy="no-referrer"></div>
    <div class="ic-bar"><button type="button" data-x="iprev" aria-label="Previous">‹</button><span class="ic-cap">${esc(it.cap || "")} · ${i + 1}/${n}</span><button type="button" data-x="inext" aria-label="Next">›</button>
    <a href="${esc(it.page)}" target="_blank" rel="noopener noreferrer" title="${T("صفحة الصورة", "Image page")}">↗</a><button type="button" data-x="iclose" aria-label="Close">✕</button></div></div>`;
  host.querySelectorAll('[data-x="img"]').forEach(x => { const on = +x.dataset.i === i, h = x.closest(".mx-hero"); (h || x).classList.toggle("on", on); });
  slot.scrollIntoView({ behavior: "smooth", block: "nearest" });
  return true;
}
function paintExplain(host, res, tl) {
  host.classList.add("mxr");
  const s = res.shown, src = res.src, dir = dirOf(tl), gal = res.gal.slice();
  const hsrc = s.thumb || src.thumb || "";
  let heroItem = hsrc ? { src: hsrc, full: s.full || hsrc, page: s.url, cap: s.title } : (gal.length ? gal.shift() : null);
  const imgs = heroItem ? [heroItem].concat(gal) : [];
  host._imgs = imgs; host._cur = -1;
  const letter = esc((s.title || "?").trim().charAt(0).toUpperCase());
  const paras = s.extract.split(/\n+/).filter(Boolean);
  const note = res.machine
    ? `<div class="mx-note" dir="${dir}">${s.failed ? T("مفيش نسخة بالعربي ولا اتترجمت. دي النسخة الأصلية (" + langName(src.lang) + ").", "No translation available. Showing the original (" + langName(src.lang) + ").")
      : T("مفيش مقال بـ" + langName(tl) + " للموضوع ده، فالشرح ده ترجمة آلية من ويكيبيديا " + langName(src.lang) + ". الترجمة الآلية ممكن تغلط في المصطلحات.", "No " + langName(tl) + " article exists, so this is a machine translation of the " + langName(src.lang) + " Wikipedia article.")}</div>` : "";
  const cands = res.cands.length ? `<div class="mx-more"><h4>${T("ممكن تقصد حاجة تانية؟", "Did you mean something else?")}</h4><div class="mx-chips">${res.cands.map((c, i) => `<button type="button" data-x="cand" data-i="${i}">${c.thumb ? `<img src="${esc(c.thumb)}" alt="" referrerpolicy="no-referrer" loading="lazy">` : ""}<span>${esc(c.title)}${c.desc ? `<small>${esc(c.desc)}</small>` : ""}</span></button>`).join("")}</div></div>` : "";
  host.innerHTML = `<div class="mx-wrap">
    <article class="mx-text" dir="${dir}">
      <div class="mx-imgslot"></div>
      <span class="mx-badge">${T("ويكيبيديا", "Wikipedia")} · ${langName(res.machine ? src.lang : tl)}${res.machine ? " → " + langName(tl) : ""}</span>
      <h1>${esc(s.title)}</h1>${res.machine && s.title !== src.title ? `<div class="mx-desc" dir="ltr">${esc(src.title)}</div>` : ""}
      ${s.desc ? `<div class="mx-desc">${esc(s.desc)}</div>` : ""}${note}
      <div class="mx-body">${paras.map(p => `<p>${esc(p)}</p>`).join("")}</div>
      <div class="mx-acts"><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${T("اقرأ المقال كامل في ويكيبيديا ↗", "Read the full article on Wikipedia ↗")}</a></div>
      <div class="mx-lic" dir="${T("rtl", "ltr")}">${T("المصدر: ويكيبيديا، المحتوى مرخّص CC BY-SA 4.0. الصور من ويكيبيديا / ويكيميديا كومنز، وتراخيص كل صورة في صفحتها.", "Source: Wikipedia, text under CC BY-SA 4.0. Images from Wikipedia / Wikimedia Commons; see each file page for its license.")}</div>
      ${cands}
    </article>
    <aside class="mx-media">
      <figure class="mx-hero">${heroItem ? `<button type="button" class="mx-im" data-x="img" data-i="0" aria-label="${esc(s.title)}"><img src="${esc(heroItem.src)}" alt="${esc(s.title)}" referrerpolicy="no-referrer"></button>` : `<div class="mx-ph">${letter}</div>`}
        <figcaption dir="${T("rtl", "ltr")}">${esc(s.title)} · ${T("ويكيبيديا", "Wikipedia")}</figcaption></figure>
      ${imgs.length > 1 ? `<div class="mx-gal">${imgs.slice(1).map((g, k) => `<button type="button" data-x="img" data-i="${k + 1}" title="${esc(g.cap || "")}"><img src="${esc(g.src)}" alt="" referrerpolicy="no-referrer" loading="lazy"></button>`).join("")}</div>` : ""}
    </aside></div>`;
  host.scrollTop = 0;
}

/* ================= الصفحات: أدواتي + أداة PDF ================= */
const crumbHTML = items => (typeof crumb === "function" && typeof HOME !== "undefined") ? crumb([HOME].concat(items)) : "";
const TOOLS_C = [{ en: "My tools", ar: "أدواتي" }, "/tools"];

function pageTools() {
  injectStyle();
  const v = D.getElementById("view");
  v.innerHTML = crumbHTML([TOOLS_C]) + `<div class="pagehead"><h2>${B("My tools", "أدواتي")}</h2><p>${B("Smart tools that work on your own files.", "أدوات ذكية بتشتغل على ملفاتك انت.")}</p></div>
    <div class="grid" style="margin-top:22px"><div class="card" data-go="/tools/pdf"><div class="im" style="background:linear-gradient(135deg,#0e8a8a,#12355b)"><div class="subim">PDF</div></div>
      <div class="cb"><h3>${B("Smart PDF reader", "قارئ PDF ذكي")}</h3><p>${B("Upload a PDF, translate it, and tap any word to translate or understand it.", "ارفع ملف PDF، ترجمه، وظلّل أي كلمة عشان تترجمها أو تفهمها.")}</p></div></div>
      <div class="card" data-go="/tools/wiki"><div class="im" style="background:linear-gradient(135deg,#12355b,#0e8a8a)"><div class="subim">🌍</div></div><div class="cb"><h3>${B("Wikipedia explorer", "مستكشف ويكيبيديا")}</h3><p>${B("Search any topic and read it with images, in your language.", "دوّر على أي موضوع واقرأه مع صوره باللغة اللي تختارها.")}</p></div></div>
      <div class="card" data-go="/tools/pomodoro"><div class="im" style="background:linear-gradient(135deg,#ff4d6d,#2fa14f)"><div class="subim">🍅</div></div><div class="cb"><h3>${B("Pomodoro", "بومودورو")}</h3><p>${B("Focus timer with fruit plate, watermelon room and calm backgrounds.", "مؤقّت تركيز بثيمات طبق فاكهة وجوه بطيخة وخلفيات رايقة.")}</p></div></div>
      <div class="card soon"><div class="im">Coming soon</div><div class="cb"><h3>${B("More tools", "أدوات تانية")}</h3><p>${B("New tools will appear here.", "أدوات جديدة هتظهر هنا.")}</p></div></div></div>`;
}
function pagePdf() {
  injectStyle();
  const v = D.getElementById("view");
  v.innerHTML = crumbHTML([TOOLS_C, [{ en: "Smart PDF reader", ar: "قارئ PDF ذكي" }, "/tools/pdf"]]) + `<div class="pagehead"><h2>${B("Smart PDF reader", "قارئ PDF ذكي")}</h2></div>
    <div class="mt-up"><label class="mt-drop" id="mtDrop" tabindex="0"><input type="file" id="mtFile" accept="application/pdf,.pdf" hidden>
      <div class="mt-dic">📄</div><b>${T("ارفع ملف PDF", "Upload a PDF")}</b><span>${T("اسحب الملف هنا أو دوس عشان تختاره من جهازك", "Drop the file here or tap to choose it")}</span></label>
      <div class="mt-opts"><label for="mtLang">${T("ترجم لـ", "Translate to")}</label><select id="mtLang">${langOpts(getLang())}</select></div>
      <div id="mtErr"></div>
      <ul class="mt-feat">
        <li><b>🌐 ${T("ترجمة الملف كله", "Translate the whole file")}</b>${T("صفحة صفحة براحتك، وتقدر تحمّل الترجمة txt.", "Page by page at your pace; download as txt.")}</li>
        <li><b>🖱 ${T("ظلّل وترجم", "Select & translate")}</b>${T("ظلّل كلمة أو جملة تظهرلك ترجمتها فورًا.", "Select a word or sentence to see it translated.")}</li>
        <li><b>💡 ${T("فهمني", "Explain me")}</b>${T("شرح من ويكيبيديا مع الصور باللغة اللي تختارها.", "A Wikipedia explanation with images, in your language.")}</li></ul>
      <p class="mt-priv">${T("الملف بيتفتح على جهازك ومبيترفعش على أي سيرفر. النص اللي بتترجمه بس (كلمة أو صفحات) هو اللي بيتبعت لخدمة الترجمة، وكلمة «فهمني» بتتبعت لويكيبيديا.", "Your file opens on your device and is never uploaded. Only the text you translate is sent to the translation service, and «Explain» terms go to Wikipedia.")}</p></div>`;
  const drop = q1("#mtDrop"), inp = q1("#mtFile"), err = q1("#mtErr");
  q1("#mtLang").onchange = e => setLang(e.target.value);
  const take = f => {
    err.innerHTML = "";
    if (!f) return;
    if (!/pdf$/i.test(f.type) && !/\.pdf$/i.test(f.name)) { err.innerHTML = `<div class="mt-err">${T("الملف لازم يكون PDF.", "The file must be a PDF.")}</div>`; return; }
    if (f.size > MAX_MB * 1048576) { err.innerHTML = `<div class="mt-err">${T("الملف كبير (أكتر من " + MAX_MB + " ميجا).", "File is too large (over " + MAX_MB + " MB).")}</div>`; return; }
    openReader(f);
  };
  inp.onchange = () => { take(inp.files[0]); inp.value = ""; };
  drop.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inp.click(); } });
  ["dragenter", "dragover"].forEach(n => drop.addEventListener(n, e => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach(n => drop.addEventListener(n, e => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", e => take(e.dataTransfer.files[0]));
}

function skeletonHTML(tl) {
  return `<div class="mx-wrap"><div class="mx-text"><span class="mx-badge">${T("ويكيبيديا", "Wikipedia")} · ${langName(tl)}</span><div class="mx-sk"><div style="width:55%;height:30px"></div><div style="width:35%"></div><div></div><div></div><div style="width:90%"></div><div style="width:70%"></div></div></div><div class="mx-media"><div class="mx-hero"><div class="mx-ph">…</div></div></div></div>`;
}
function pageWiki() {
  injectStyle();
  const v = D.getElementById("view");
  const sugg = ["الخلية", "Photosynthesis", "الجدول الدوري", "DNA", "Pyramids of Giza", "الجهاز الدوري"];
  v.innerHTML = crumbHTML([TOOLS_C, [{ en: "Wikipedia explorer", ar: "مستكشف ويكيبيديا" }, "/tools/wiki"]]) + `<div class="mw"><div class="mw-hero"><h2>🌍 ${B("Wikipedia explorer", "مستكشف ويكيبيديا")}</h2>
    <p>${B("Search any topic and read it with images, in your language.", "دوّر على أي موضوع واقرأه مع صوره باللغة اللي تختارها.")}</p>
    <form class="mw-form"><input type="text" id="mwQ" placeholder="${T("اكتب أي موضوع... مثلاً: الخلية", "Type any topic...")}" autocomplete="off"><select id="mwL" aria-label="${T("لغة الشرح", "Language")}">${langOpts(getLang())}</select><button type="submit">🔎 ${T("بحث", "Search")}</button></form>
    <div class="mw-sug">${sugg.map(x => `<button type="button" data-q="${esc(x)}">${esc(x)}</button>`).join("")}</div></div>
    <div class="mw-out mxr"><div class="mw-start"><div class="big">📚</div>${T("اكتب موضوع فوق وابدأ.<br>هتلاقي الشرح والصور، ولما تدوس على أي صورة بتتفتح في كرت جوه النص.", "Type a topic above to start.<br>Tap any image to open it in a card inside the text.")}</div></div></div>`;
  const out = q1(".mw-out"), inp = q1("#mwQ"), sel = q1("#mwL"); let seq = 0, forced = null;
  const run = async () => {
    const text = inp.value.trim(); if (!text) return;
    const my = ++seq, tl = sel.value; setLang(tl);
    out.innerHTML = skeletonHTML(tl);
    let res = null, failed = false;
    try { res = await explain(text, tl, forced); } catch (e) { failed = true; }
    if (my !== seq) return;
    out._last = res; out._imgs = [];
    if (failed) { out.innerHTML = `<div class="mx-empty"><h2>😕</h2><p>${T("ما قدرتش أوصل لويكيبيديا. اتأكد من النت وجرّب تاني.", "Could not reach Wikipedia. Check your connection and try again.")}</p></div>`; return; }
    if (!res) { out.innerHTML = `<div class="mx-empty"><h2>🔎</h2><p>${T("ما لقيتش صفحة في ويكيبيديا لـ «" + esc(text) + "».", "No Wikipedia page found for “" + esc(text) + "”.")}</p><p style="color:var(--mu)">${T("جرّب تكتب الكلمة بشكل تاني.", "Try another wording.")}</p></div>`; return; }
    paintExplain(out, res, tl);
    W.scrollTo({ top: Math.max(0, out.getBoundingClientRect().top + W.scrollY - 76), behavior: "smooth" });
  };
  q1(".mw-form").addEventListener("submit", e => { e.preventDefault(); forced = null; run(); });
  sel.addEventListener("change", () => { setLang(sel.value); if (inp.value.trim()) run(); });
  q1(".mw-sug").addEventListener("click", e => { const b = e.target.closest("[data-q]"); if (!b) return; inp.value = b.dataset.q; forced = null; run(); });
  out.addEventListener("click", e => {
    const b = e.target.closest("[data-x]"); if (!b) return;
    if (imgAct(out, b)) return;
    if (b.dataset.x === "cand" && out._last) {
      const L = out._last, c = L.cands[+b.dataset.i]; if (!c) return;
      const old = L.src;
      forced = { lang: old.lang, title: c.title, cands: [{ title: old.title, desc: old.desc, thumb: old.thumb }].concat(L.cands.filter((_, k) => k !== +b.dataset.i)) };
      inp.value = c.title; run();
    }
  });
  setTimeout(() => { try { inp.focus({ preventScroll: true }); } catch (e) { } }, 60);
}

/* ================= بومودورو ================= */
const PK = "etoedu-pomo-v1";
const PD = { focus: 25, short: 5, long: 15, every: 4, auto: false, sound: true, notif: false, theme: "fruit", bg: "", dim: 30, blur: 0, favs: [], rot: false, key: "", tasks: [], cur: -1, amb: "off", vol: 40, stats: {} };
const PS = (() => { try { return Object.assign({}, PD, JSON.parse(localStorage.getItem(PK) || "{}")); } catch (e) { return Object.assign({}, PD); } })();
const poSave = () => { try { localStorage.setItem(PK, JSON.stringify(PS)); return true; } catch (e) { return false; } };
const RUN = { mode: "focus", left: PS.focus * 60, running: false, endAt: 0, iv: 0, cyc: 0 };
const PX = { q: "", hits: [], busy: false, err: "", msg: "" };
let PO_TAB = "themes";
const dkey = (d = new Date()) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const poDur = m => (m === "focus" ? PS.focus : m === "short" ? PS.short : PS.long) * 60;
const poFmt = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
const poRand = (a, b) => a + Math.random() * (b - a);
const MODES = { focus: ["🍅", "تركيز", "Focus"], short: ["☕", "راحة قصيرة", "Short break"], long: ["🌴", "راحة طويلة", "Long break"] };
const PTH = {
  fruit: { n: ["طبق فاكهة", "Fruit plate"], e: "🍓", fl: ["🍓", "🍊", "🍇", "🍋", "🍉", "🍑", "🍒", "🥝", "🍍", "🍎"], rw: ["🍓", "🍊", "🍇", "🍋", "🍉", "🍑", "🍒", "🥝"] },
  melon: { n: ["جوه بطيخة", "Inside a watermelon"], e: "🍉", fl: [], rw: ["🍉"] },
  forest: { n: ["غابة رايقة", "Calm forest"], e: "🌲", fl: ["🍃", "🍂", "🍃"], rw: ["🌲"] },
  sakura: { n: ["ساكورا", "Sakura"], e: "🌸", fl: ["🌸", "🌸", "🌺"], rw: ["🌸"] },
  night: { n: ["ليل ونجوم", "Starry night"], e: "🌙", fl: [], rw: ["⭐"] },
  beach: { n: ["غروب البحر", "Sunset beach"], e: "🌅", fl: ["🫧"], rw: ["🐚"] }
};
const PRESET_BG = ["css:linear-gradient(135deg,#ff9a9e,#fad0c4)", "css:linear-gradient(135deg,#a1c4fd,#c2e9fb)", "css:linear-gradient(135deg,#84fab0,#8fd3f4)", "css:linear-gradient(135deg,#fbc2eb,#a6c1ee)", "css:linear-gradient(135deg,#f6d365,#fda085)", "css:linear-gradient(135deg,#0f2027,#2c5364)", "css:linear-gradient(135deg,#667eea,#764ba2)", "css:radial-gradient(circle at 30% 20%,#ffe29f,#ffa99f,#ff719a)"];
const PX_CHIPS = ["nature", "forest", "rain window", "beach", "cozy cafe", "mountains", "flowers", "sunset", "night sky", "library", "fruit", "watermelon"];
const bgCss = v => !v ? "none" : v.startsWith("css:") ? v.slice(4) : 'url("' + v.replace(/"/g, "%22") + '")';

/* ---------- إحصائيات ---------- */
const poToday = () => PS.stats[dkey()] || { n: 0, m: 0 };
function poStreak() {
  let c = 0; const d = new Date();
  if (!(PS.stats[dkey(d)] || {}).n) d.setDate(d.getDate() - 1);
  while ((PS.stats[dkey(d)] || {}).n > 0) { c++; d.setDate(d.getDate() - 1); }
  return c;
}

/* ---------- صوت ---------- */
let AC = null, AMB = null;
function poAC() {
  if (!AC) { try { AC = new (W.AudioContext || W.webkitAudioContext)(); } catch (e) { } }
  if (AC && AC.state === "suspended") { try { AC.resume(); } catch (e) { } }
  return AC;
}
function poBeep() {
  if (!PS.sound) return; const a = poAC(); if (!a) return;
  [660, 880, 1100].forEach((f, i) => {
    const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + i * 0.22;
    o.type = "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.25, t + 0.03); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + 0.55);
  });
}
function poAmbientStop() {
  if (!AMB) return;
  try { AMB.src.stop(); } catch (e) { } try { if (AMB.o) AMB.o.stop(); } catch (e) { } try { AMB.g.disconnect(); } catch (e) { }
  AMB = null;
}
function poAmbient() {
  poAmbientStop(); const a = poAC(); if (!a || PS.amb === "off") return;
  const len = a.sampleRate * 4, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
  if (PS.amb === "brown") { let l = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; l = (l + 0.02 * w) / 1.02; d[i] = l * 3.5; } }
  else for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(); src.buffer = buf; src.loop = true;
  const g = a.createGain(); g.gain.value = PS.vol / 100 * (PS.amb === "brown" ? 1 : 0.55);
  let node = src, o = null;
  if (PS.amb === "rain") {
    const hp = a.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 900;
    const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 7000;
    src.connect(hp); hp.connect(lp); node = lp;
  } else if (PS.amb === "waves") {
    const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700; src.connect(lp); node = lp;
    o = a.createOscillator(); const og = a.createGain(); o.frequency.value = 0.1; og.gain.value = 0.35; o.connect(og); og.connect(g.gain); o.start();
  }
  node.connect(g); g.connect(a.destination); src.start(); AMB = { src, g, o };
}
function poNotify(was) {
  if (!PS.notif || !("Notification" in W) || Notification.permission !== "granted") return;
  try { new Notification(was === "focus" ? "🎉 خلصت جلسة التركيز" : "⏰ الراحة خلصت", { body: was === "focus" ? "خد استراحة تستاهلها." : "يلا نرجع نركّز." }); } catch (e) { }
}

/* ---------- المؤقت ---------- */
function poTick() {
  if (!RUN.running) return;
  RUN.left = Math.max(0, Math.round((RUN.endAt - Date.now()) / 1000));
  poPaint();
  if (RUN.left <= 0) poFinish();
}
function poStart() {
  if (RUN.running) return; poAC();
  if (RUN.left <= 0) RUN.left = poDur(RUN.mode);
  RUN.endAt = Date.now() + RUN.left * 1000; RUN.running = true;
  clearInterval(RUN.iv); RUN.iv = setInterval(poTick, 250);
  poAmbient(); poPaint(true);
}
function poPause() {
  RUN.running = false; clearInterval(RUN.iv); poAmbientStop(); D.title = "ETO.Edu"; poPaint(true);
}
function poSetMode(m) { poPause(); RUN.mode = m; RUN.left = poDur(m); poPaint(true); }
function poNext() { return RUN.mode === "focus" ? (RUN.cyc % PS.every === 0 && RUN.cyc > 0 ? "long" : "short") : "focus"; }
function poFinish() {
  clearInterval(RUN.iv); RUN.running = false; poAmbientStop();
  const was = RUN.mode;
  if (was === "focus") {
    const k = dkey(), s = PS.stats[k] || (PS.stats[k] = { n: 0, m: 0 }); s.n++; s.m += PS.focus; RUN.cyc++;
    const t = PS.tasks[PS.cur]; if (t) t.p = (t.p || 0) + 1;
    if (PS.rot && PS.favs.length) { const i = PS.favs.indexOf(PS.bg); PS.bg = PS.favs[(i + 1) % PS.favs.length]; }
    poSave();
  }
  poBeep(); poNotify(was);
  RUN.mode = poNext(); RUN.left = poDur(RUN.mode); D.title = "ETO.Edu";
  poPaint(true); poApplyBg(); if (D.getElementById("poPanel") && (PO_TAB === "stats" || PO_TAB === "tasks")) poPanel();
  if (PS.auto) setTimeout(poStart, 900);
}

/* ---------- رسم الواجهة ---------- */
function poPaint(full) {
  const root = D.getElementById("poRoot"); if (!root) return;
  const tot = poDur(RUN.mode) || 1, C = 2 * Math.PI * 120;
  const t = D.getElementById("poTime"), r = D.getElementById("poRing");
  if (t) t.textContent = poFmt(RUN.left);
  if (r) r.style.strokeDashoffset = String(C * (RUN.left / tot));
  if (RUN.running) D.title = poFmt(RUN.left) + " · " + MODES[RUN.mode][1];
  if (!full) return;
  root.dataset.mode = RUN.mode; root.classList.toggle("run", RUN.running);
  const lab = D.getElementById("poLabel"); if (lab) lab.textContent = MODES[RUN.mode][0] + " " + T(MODES[RUN.mode][1], MODES[RUN.mode][2]);
  root.querySelectorAll("[data-m]").forEach(b => b.classList.toggle("on", b.dataset.m === RUN.mode));
  const pl = D.getElementById("poPlay"); if (pl) { pl.textContent = RUN.running ? "⏸" : "▶"; pl.setAttribute("aria-label", RUN.running ? "Pause" : "Start"); }
  const dots = D.getElementById("poDots");
  if (dots) { const k = RUN.cyc % PS.every; dots.innerHTML = Array.from({ length: PS.every }, (_, i) => `<i class="${i < k ? "f" : ""}"></i>`).join(""); }
  const rw = D.getElementById("poEarn");
  if (rw) {
    const n = poToday().n, list = PTH[PS.theme].rw;
    rw.innerHTML = n ? Array.from({ length: Math.min(n, 14) }, (_, i) => `<span style="animation-delay:${i * 0.05}s">${list[i % list.length]}</span>`).join("") + (n > 14 ? `<b>+${n - 14}</b>` : "") : `<em>${T("كل جلسة تخلّصها بتضيف حاجة هنا ✨", "Every finished session adds something here ✨")}</em>`;
  }
  const tk = D.getElementById("poTask"), cur = PS.tasks[PS.cur];
  if (tk) tk.innerHTML = cur ? `🎯 ${esc(cur.t)}` : `<span>${T("اختار مهمة من تبويب المهام", "Pick a task from the Tasks tab")}</span>`;
}
function poApplyBg() {
  const root = D.getElementById("poRoot"); if (!root) return;
  const im = root.querySelector(".po-img"), v = PS.bg;
  root.classList.toggle("has-img", !!v);
  im.style.backgroundImage = bgCss(v);
  root.style.setProperty("--dm", String(PS.dim / 100)); root.style.setProperty("--bl", PS.blur + "px");
}
function poScene() {
  const root = D.getElementById("poRoot"); if (!root) return;
  const sc = root.querySelector(".po-scene"), th = PS.theme, fl = PTH[th].fl; let h = "";
  root.dataset.th = th;
  if (th === "melon") {
    for (let i = 0; i < 18; i++) h += `<i class="po-seed" style="left:${poRand(8, 92).toFixed(1)}%;top:${poRand(10, 78).toFixed(1)}%;--r:${poRand(-70, 70).toFixed(0)}deg;animation-delay:${-poRand(0, 6).toFixed(1)}s"></i>`;
    h += '<div class="po-furn po-sofa">🛋️</div><div class="po-furn po-plant">🪴</div><div class="po-furn po-lamp">🕯️</div><div class="po-furn po-pic">🖼️</div>';
  } else if (th === "night") {
    for (let i = 0; i < 55; i++) { const z = poRand(1, 3).toFixed(1); h += `<b class="po-star" style="left:${poRand(0, 100).toFixed(1)}%;top:${poRand(0, 85).toFixed(1)}%;width:${z}px;height:${z}px;animation-delay:${-poRand(0, 5).toFixed(1)}s"></b>`; }
    h += '<div class="po-moon"></div>';
  } else if (th === "beach") {
    h += '<div class="po-sun"></div><svg class="po-wave w1" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0 60 Q150 0 300 60 T600 60 T900 60 T1200 60 V120 H0Z"/></svg><svg class="po-wave w2" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0 70 Q150 20 300 70 T600 70 T900 70 T1200 70 V120 H0Z"/></svg>';
  } else if (th === "fruit") h += '<div class="po-grain"></div>';
  for (let i = 0; i < (th === "fruit" ? 12 : 14) && fl.length; i++) {
    const bob = th === "fruit";
    h += `<span class="po-fl ${bob ? "bob" : "fall"}" style="left:${poRand(2, 96).toFixed(1)}%;top:${bob ? poRand(3, 90).toFixed(1) + "%" : "-8%"};font-size:${poRand(18, 40).toFixed(0)}px;animation-duration:${poRand(9, 20).toFixed(1)}s;animation-delay:${-poRand(0, 18).toFixed(1)}s">${fl[i % fl.length]}</span>`;
  }
  sc.innerHTML = h;
}

/* ---------- اللوحات ---------- */
function poPanel() {
  const el = D.getElementById("poPanel"); if (!el) return;
  D.querySelectorAll("[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === PO_TAB));
  if (PO_TAB === "themes") {
    el.innerHTML = `<div class="po-themes">${Object.keys(PTH).map(k => `<button type="button" class="po-th ${PS.theme === k ? "on" : ""}" data-act="theme" data-k="${k}"><span class="pv pv-${k}">${PTH[k].e}</span><b>${T(PTH[k].n[0], PTH[k].n[1])}</b></button>`).join("")}</div>`;
  } else if (PO_TAB === "bgs") {
    const ok = !!PS.key;
    el.innerHTML = `<div class="po-sec"><h4>🖼 ${T("خلفيتك الحالية", "Current background")}</h4>
      <div class="po-row"><button type="button" class="po-pill" data-act="bgclear">${T("بدون صورة (شكل الثيم)", "No image (theme look)")}</button>
      <button type="button" class="po-pill" data-act="upload">📁 ${T("ارفع صورة من جهازك", "Upload your image")}</button>
      <form class="po-url" data-form="url"><input type="url" placeholder="${T("أو الصق رابط صورة...", "Or paste an image URL...")}"><button type="submit">${T("استخدم", "Use")}</button></form>
      <input type="file" id="poUp" accept="image/*" hidden></div>
      <div class="po-sl"><label>${T("تعتيم الخلفية", "Dim")}<input type="range" min="0" max="80" value="${PS.dim}" data-set="dim"></label><label>${T("طمس", "Blur")}<input type="range" min="0" max="14" value="${PS.blur}" data-set="blur"></label></div>
      <div class="po-pre">${PRESET_BG.map(g => `<button type="button" class="${PS.bg === g ? "on" : ""}" data-act="bgset" data-v="${esc(g)}" style="background:${g.slice(4)}" aria-label="gradient"></button>`).join("")}</div></div>
    <div class="po-sec"><h4>⭐ ${T("مفضلتك", "Favorites")} (${PS.favs.length}) <label class="po-chk"><input type="checkbox" data-set="rot" ${PS.rot ? "checked" : ""}> ${T("غيّر الخلفية مع كل جلسة", "Rotate every session")}</label></h4>
      ${PS.favs.length ? `<div class="po-fav">${PS.favs.map((v, i) => `<div class="po-ft ${PS.bg === v ? "on" : ""}" data-act="bgset" data-v="${esc(v)}" style="background-image:${bgCss(v)}"><button type="button" data-act="unfav" data-i="${i}" aria-label="remove">✕</button></div>`).join("")}</div>` : `<p class="po-mu">${T("دوس ☆ على أي صورة تعجبك تتحفظ هنا، وتقدر تعمل لها تدوير تلقائي.", "Tap ☆ on any image to save it here, then rotate through them.")}</p>`}
      ${PX.msg ? `<p class="po-mu">${esc(PX.msg)}</p>` : ""}</div>
    <div class="po-sec"><h4>🔎 ${T("صور من Pixabay", "Pixabay images")}</h4>
      ${ok ? "" : `<div class="po-note">${T("عشان تدوّر على صور Pixabay محتاج مفتاح API مجاني (دقيقة وتجيبه): سجّل في pixabay.com وافتح صفحة الـ API وانسخ المفتاح هنا. المفتاح بيتخزن على جهازك بس.", "Searching Pixabay needs a free API key: sign up at pixabay.com, open the API page and paste the key here. It stays on your device.")} <a href="https://pixabay.com/api/docs/" target="_blank" rel="noopener noreferrer">pixabay.com/api/docs ↗</a></div>`}
      <form class="po-key" data-form="key"><input type="password" value="${esc(PS.key)}" placeholder="Pixabay API key" autocomplete="off"><button type="submit">${ok ? T("تحديث المفتاح", "Update key") : T("حفظ المفتاح", "Save key")}</button></form>
      <form class="po-search" data-form="search"><input type="search" value="${esc(PX.q)}" placeholder="${T("دوّر: forest, rain, beach...", "Search: forest, rain, beach...")}"><button type="submit">🔎</button></form>
      <div class="po-chips">${PX_CHIPS.map(c => `<button type="button" data-act="chip" data-q="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      ${PX.busy ? `<p class="po-mu">${T("بدوّر...", "Searching...")}</p>` : PX.err === "key" ? `<p class="po-mu">${T("حط المفتاح الأول.", "Add your API key first.")}</p>` : PX.err === "none" ? `<p class="po-mu">${T("مفيش نتايج، جرّب كلمة تانية.", "No results, try another word.")}</p>` : PX.err === "fail" ? `<p class="po-mu">${T("فشل البحث. اتأكد من المفتاح ومن النت.", "Search failed. Check your key and connection.")}</p>` : ""}
      <div class="po-grid">${PX.hits.map((h, i) => `<div class="po-tile" data-act="pxset" data-i="${i}" style="background-image:url('${esc(h.previewURL)}')" title="${esc(h.tags || "")}"><button type="button" data-act="pxfav" data-i="${i}" aria-label="favorite">${PS.favs.includes(h.largeImageURL) ? "★" : "☆"}</button></div>`).join("")}</div>
      ${PX.hits.length ? `<p class="po-mu">${T("الصور من", "Images from")} <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer">Pixabay</a></p>` : ""}</div>`;
  } else if (PO_TAB === "tasks") {
    el.innerHTML = `<form class="po-add" data-form="task"><input type="text" maxlength="80" placeholder="${T("اكتب مهمة وادوس إضافة...", "Add a task...")}"><button type="submit">＋ ${T("إضافة", "Add")}</button></form>
      <ul class="po-tasks">${PS.tasks.length ? PS.tasks.map((t, i) => `<li class="${t.d ? "d" : ""} ${PS.cur === i ? "cur" : ""}"><button type="button" class="ck" data-act="tdone" data-i="${i}">${t.d ? "✔" : ""}</button><span class="tt">${esc(t.t)}</span><em>${t.p || 0} 🍅</em><button type="button" data-act="tcur" data-i="${i}" title="current">${PS.cur === i ? "🎯" : "▶"}</button><button type="button" data-act="tdel" data-i="${i}" aria-label="delete">🗑</button></li>`).join("") : `<li class="empty">${T("مفيش مهام لسه.", "No tasks yet.")}</li>`}</ul>`;
  } else if (PO_TAB === "stats") {
    const td = poToday(), all = Object.values(PS.stats), tn = all.reduce((a, s) => a + s.n, 0), tm = all.reduce((a, s) => a + s.m, 0);
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { d, s: PS.stats[dkey(d)] || { n: 0, m: 0 } }; });
    const mx = Math.max(1, ...days.map(x => x.s.n));
    el.innerHTML = `<div class="po-stats"><div><b>${td.n}</b><span>${T("جلسات النهارده", "Today")}</span></div><div><b>${td.m}</b><span>${T("دقيقة تركيز", "Focus min")}</span></div><div><b>${poStreak()} 🔥</b><span>${T("أيام متتالية", "Day streak")}</span></div><div><b>${tn}</b><span>${T("كل الجلسات", "All sessions")}</span></div><div><b>${(tm / 60).toFixed(1)}</b><span>${T("ساعة تركيز كلها", "Total hours")}</span></div></div>
      <div class="po-bars">${days.map(x => `<div><span class="v">${x.s.n}</span><i style="height:${Math.max(4, x.s.n / mx * 100)}%"></i><small>${x.d.toLocaleDateString(D.body.dataset.l === "en" ? "en" : "ar-EG", { weekday: "short" })}</small></div>`).join("")}</div>`;
  } else {
    const num = (k, l, mn, mx) => `<label class="po-num"><span>${l}</span><input type="number" min="${mn}" max="${mx}" value="${PS[k]}" data-set="${k}"></label>`;
    el.innerHTML = `<div class="po-set">${num("focus", T("دقايق التركيز", "Focus min"), 1, 120)}${num("short", T("راحة قصيرة", "Short break"), 1, 60)}${num("long", T("راحة طويلة", "Long break"), 1, 90)}${num("every", T("راحة طويلة كل", "Long break every"), 2, 10)}</div>
      <div class="po-tg"><label><input type="checkbox" data-set="auto" ${PS.auto ? "checked" : ""}> ${T("ابدأ الجلسة اللي بعدها لوحدها", "Auto-start next session")}</label>
      <label><input type="checkbox" data-set="sound" ${PS.sound ? "checked" : ""}> ${T("صوت لما الوقت يخلص", "Sound when finished")}</label>
      <label><input type="checkbox" data-set="notif" ${PS.notif ? "checked" : ""}> ${T("إشعار على الجهاز", "Notifications")}</label></div>
      <div class="po-amb"><label>🎧 ${T("صوت هادي أثناء التركيز", "Ambient sound")}<select data-set="amb">${[["off", T("بدون", "Off")], ["rain", T("مطر", "Rain")], ["waves", T("أمواج", "Waves")], ["brown", T("ضوضاء بنية", "Brown noise")]].map(([v, n]) => `<option value="${v}" ${PS.amb === v ? "selected" : ""}>${n}</option>`).join("")}</select></label>
      <label>${T("الصوت", "Volume")}<input type="range" min="5" max="100" value="${PS.vol}" data-set="vol"></label></div>
      <button type="button" class="po-danger" data-act="resetstats">${T("مسح كل الإحصائيات", "Clear all stats")}</button>`;
  }
}
async function poSearch(q) {
  PX.q = q;
  if (!PS.key) { PX.err = "key"; return poPanel(); }
  PX.busy = true; PX.err = ""; poPanel();
  try {
    const r = await fetch("https://pixabay.com/api/?" + new URLSearchParams({ key: PS.key, q, image_type: "photo", orientation: "horizontal", safesearch: "true", per_page: "30", order: "popular", min_width: "1280" }));
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json(); PX.hits = j.hits || []; if (!PX.hits.length) PX.err = "none";
  } catch (e) { PX.err = "fail"; PX.hits = []; }
  PX.busy = false; if (PO_TAB === "bgs") poPanel();
}
function poSetBg(v) { PS.bg = v; if (!poSave()) PX.msg = T("المساحة المحلية امتلت، الخلفية اتطبقت بس مش هتتحفظ.", "Storage is full; the background is applied but won't be saved."); poApplyBg(); if (PO_TAB === "bgs") poPanel(); }
function poFav(v) {
  const i = PS.favs.indexOf(v);
  if (i >= 0) PS.favs.splice(i, 1); else if (PS.favs.length < 40) PS.favs.push(v);
  PX.msg = poSave() ? "" : T("المساحة المحلية امتلت.", "Storage is full."); poPanel();
}
function poReadImg(file) {
  if (!file || !/^image\//.test(file.type)) return;
  const fr = new FileReader();
  fr.onload = () => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, 1600 / Math.max(im.width, im.height)), cv = D.createElement("canvas");
      cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
      cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
      const url = cv.toDataURL("image/jpeg", 0.8);
      if (!PS.favs.includes(url) && PS.favs.length < 40) PS.favs.push(url);
      poSetBg(url);
    };
    im.src = fr.result;
  };
  fr.readAsDataURL(file);
}
function pagePomo() {
  injectStyle(); injectPoStyle();
  const v = D.getElementById("view");
  const C = 2 * Math.PI * 120;
  v.innerHTML = crumbHTML([TOOLS_C, [{ en: "Pomodoro", ar: "بومودورو" }, "/tools/pomodoro"]]) + `<div class="pow">
    <div class="po" id="poRoot" data-th="${PS.theme}">
      <div class="po-bg"></div><div class="po-img"></div><div class="po-dim"></div><div class="po-scene"></div>
      <div class="po-main">
        <div class="po-top"><h2>🍅 ${T("بومودورو", "Pomodoro")}</h2><div><button type="button" data-act="shuffle" title="${T("غيّر المزاج", "Surprise me")}">🎲</button><button type="button" data-act="fs" title="${T("ملء الشاشة", "Fullscreen")}">⛶</button></div></div>
        <div class="po-modes">${Object.keys(MODES).map(m => `<button type="button" data-m="${m}">${MODES[m][0]} ${T(MODES[m][1], MODES[m][2])}</button>`).join("")}</div>
        <div class="po-face"><svg class="po-svg" viewBox="0 0 280 280" aria-hidden="true"><circle class="po-trk" cx="140" cy="140" r="120"/><circle class="po-prg" id="poRing" cx="140" cy="140" r="120" transform="rotate(-90 140 140)" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>
          <div class="po-in"><div class="po-lab" id="poLabel"></div><div class="po-time" id="poTime">${poFmt(RUN.left)}</div><div class="po-dots" id="poDots"></div></div></div>
        <div class="po-ctl"><button type="button" class="s" data-act="reset" aria-label="Reset">↺</button><button type="button" class="p" id="poPlay" data-act="play">▶</button><button type="button" class="s" data-act="skip" aria-label="Skip">⏭</button></div>
        <div class="po-task" id="poTask"></div>
        <div class="po-earn" id="poEarn"></div>
      </div>
    </div>
    <div class="po-tabs">${[["themes", "🎨", T("الثيمات", "Themes")], ["bgs", "🖼", T("الخلفيات", "Backgrounds")], ["tasks", "✅", T("المهام", "Tasks")], ["stats", "📊", T("إحصائيات", "Stats")], ["set", "⚙️", T("إعدادات", "Settings")]].map(([k, i, n]) => `<button type="button" data-tab="${k}">${i} ${n}</button>`).join("")}</div>
    <div class="po-panel" id="poPanel"></div></div>`;
  const wrap = q1(".pow"), root = q1("#poRoot");
  poScene(); poApplyBg(); poPaint(true); poPanel();
  wrap.addEventListener("click", e => {
    const tab = e.target.closest("[data-tab]"); if (tab) { PO_TAB = tab.dataset.tab; return poPanel(); }
    const m = e.target.closest("[data-m]"); if (m) return poSetMode(m.dataset.m);
    const b = e.target.closest("[data-act]"); if (!b) return;
    const a = b.dataset.act, i = +b.dataset.i;
    if (a === "play") return RUN.running ? poPause() : poStart();
    if (a === "reset") { poPause(); RUN.left = poDur(RUN.mode); return poPaint(true); }
    if (a === "skip") { poPause(); RUN.mode = RUN.mode === "focus" ? "short" : "focus"; RUN.left = poDur(RUN.mode); return poPaint(true); }
    if (a === "fs") { if (D.fullscreenElement) D.exitFullscreen(); else { const f = root.requestFullscreen || root.webkitRequestFullscreen; if (f) f.call(root); } return; }
    if (a === "shuffle") {
      if (PS.favs.length) poSetBg(PS.favs[Math.floor(Math.random() * PS.favs.length)]);
      const ks = Object.keys(PTH).filter(k => k !== PS.theme); PS.theme = ks[Math.floor(Math.random() * ks.length)]; poSave(); poScene(); poPaint(true); return poPanel();
    }
    if (a === "theme") { PS.theme = b.dataset.k; poSave(); poScene(); poPaint(true); return poPanel(); }
    if (a === "bgclear") return poSetBg("");
    if (a === "bgset") { if (e.target.closest('[data-act="unfav"]')) return; return poSetBg(b.dataset.v); }
    if (a === "unfav") { e.stopPropagation(); const v = PS.favs[i]; PS.favs.splice(i, 1); if (PS.bg === v) { /* تفضل مطبّقة */ } poSave(); return poPanel(); }
    if (a === "upload") return q1("#poUp").click();
    if (a === "chip") { q1(".po-search input").value = b.dataset.q; return poSearch(b.dataset.q); }
    if (a === "pxset") { if (e.target.closest('[data-act="pxfav"]')) return; const h = PX.hits[i]; return h && poSetBg(h.largeImageURL); }
    if (a === "pxfav") { e.stopPropagation(); const h = PX.hits[i]; return h && poFav(h.largeImageURL); }
    if (a === "tdone") { PS.tasks[i].d = !PS.tasks[i].d; poSave(); poPanel(); return; }
    if (a === "tcur") { PS.cur = PS.cur === i ? -1 : i; poSave(); poPaint(true); return poPanel(); }
    if (a === "tdel") { PS.tasks.splice(i, 1); if (PS.cur === i) PS.cur = -1; else if (PS.cur > i) PS.cur--; poSave(); poPaint(true); return poPanel(); }
    if (a === "resetstats") { if (confirm(T("متأكد؟ كل الإحصائيات هتتمسح.", "Sure? All stats will be cleared."))) { PS.stats = {}; RUN.cyc = 0; poSave(); poPaint(true); poPanel(); } return; }
  });
  wrap.addEventListener("submit", e => {
    const f = e.target.closest("[data-form]"); if (!f) return; e.preventDefault();
    const val = f.querySelector("input").value.trim(), k = f.dataset.form;
    if (k === "search") { if (val) poSearch(val); }
    else if (k === "key") { PS.key = val; poSave(); PX.err = ""; poPanel(); }
    else if (k === "url") { if (/^(https?:\/\/|data:image\/)/i.test(val)) { if (!PS.favs.includes(val) && PS.favs.length < 40) PS.favs.push(val); poSetBg(val); } }
    else if (k === "task") { if (val) { PS.tasks.push({ t: val, d: false, p: 0 }); if (PS.cur < 0) PS.cur = PS.tasks.length - 1; poSave(); poPaint(true); poPanel(); } }
  });
  wrap.addEventListener("change", e => {
    if (e.target.id === "poUp") { poReadImg(e.target.files[0]); e.target.value = ""; return; }
    const k = e.target.dataset.set; if (!k) return;
    const t = e.target;
    if (t.type === "checkbox") {
      PS[k] = t.checked;
      if (k === "notif" && t.checked && "Notification" in W && Notification.permission !== "granted") Notification.requestPermission().then(p => { if (p !== "granted") { PS.notif = false; poSave(); poPanel(); } });
    } else if (t.type === "number") {
      const n = Math.max(+t.min, Math.min(+t.max, Math.round(+t.value) || PD[k])); PS[k] = n; t.value = n;
      if (!RUN.running) { RUN.left = poDur(RUN.mode); poPaint(true); }
    } else if (t.tagName === "SELECT") { PS[k] = t.value; if (RUN.running) poAmbient(); }
    poSave();
  });
  wrap.addEventListener("input", e => {
    const k = e.target.dataset.set; if (!k || e.target.type !== "range") return;
    PS[k] = +e.target.value;
    if (k === "dim" || k === "blur") poApplyBg();
    if (k === "vol" && AMB) AMB.g.gain.value = PS.vol / 100 * (PS.amb === "brown" ? 1 : 0.55);
    clearTimeout(poSave._t); poSave._t = setTimeout(poSave, 300);
  });
  if (D.__poKey) D.removeEventListener("keydown", D.__poKey);
  D.__poKey = e => {
    if (!D.getElementById("poRoot") || e.code !== "Space" || /INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)) return;
    e.preventDefault(); RUN.running ? poPause() : poStart();
  };
  D.addEventListener("keydown", D.__poKey);
}
function injectPoStyle() {
  if (D.getElementById("mtPoStyle")) return;
  const st = D.createElement("style"); st.id = "mtPoStyle";
  st.textContent = `
@keyframes pofall{0%{transform:translate3d(0,-10vh,0) rotate(0)}50%{transform:translate3d(40px,50vh,0) rotate(180deg)}100%{transform:translate3d(-20px,112vh,0) rotate(360deg)}}
@keyframes pobob{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-20px) rotate(8deg)}}
@keyframes potw{0%,100%{opacity:.25;transform:scale(.7)}50%{opacity:1;transform:scale(1.3)}}
@keyframes powave{to{transform:translateX(-50%)}}
@keyframes popop{from{opacity:0;transform:scale(.2) translateY(10px)}}
@keyframes poseed{0%,100%{transform:rotate(var(--r)) translateY(0)}50%{transform:rotate(var(--r)) translateY(-8px)}}
@keyframes populse{0%,100%{box-shadow:0 0 0 0 var(--pa)}50%{box-shadow:0 0 0 14px transparent}}
.pow{max-width:1100px;margin:14px auto 90px;padding:0 12px;animation:mtrise .45s both}
.po{--pa:#ff7a3d;--pt:#4a2c14;--dm:.3;--bl:0px;position:relative;overflow:hidden;min-height:max(640px,82vh);border-radius:32px;display:flex;justify-content:center;box-shadow:0 24px 70px rgba(15,40,70,.32);isolation:isolate;color:var(--pt);font-family:Cairo,Inter,system-ui,sans-serif}
.po:fullscreen{border-radius:0;min-height:100vh}
.po-bg,.po-img,.po-dim,.po-scene{position:absolute;inset:0}
.po-bg{z-index:0;transition:opacity .6s}
.po-img{z-index:1;background-size:cover;background-position:center;filter:blur(var(--bl));transform:scale(1.06);transition:opacity .6s,background-image .6s;opacity:0}
.po.has-img .po-img{opacity:1}.po.has-img .po-bg{opacity:0}
.po-dim{z-index:2;background:rgba(0,0,0,var(--dm));opacity:0;transition:opacity .4s;pointer-events:none}
.po.has-img .po-dim{opacity:1}
.po-scene{z-index:3;pointer-events:none;overflow:hidden}
.po-main{position:relative;z-index:5;width:100%;display:flex;flex-direction:column;align-items:center;gap:18px;padding:18px 14px 26px}
.po-top{width:100%;max-width:760px;display:flex;align-items:center;justify-content:space-between}
.po-top h2{margin:0;font-size:1.3rem;font-weight:800;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.45)}
.po-top button{width:42px;height:42px;margin-inline-start:6px;border:0;border-radius:14px;background:rgba(255,255,255,.22);color:#fff;font-size:18px;cursor:pointer;backdrop-filter:blur(8px);transition:transform .15s,background .15s}
.po-top button:hover{background:rgba(255,255,255,.38);transform:translateY(-2px)}
.po-modes{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:6px;border-radius:99px;background:rgba(255,255,255,.2);backdrop-filter:blur(10px)}
.po-modes button{border:0;border-radius:99px;padding:9px 18px;font:700 .95rem Cairo,Inter,sans-serif;color:#fff;background:transparent;cursor:pointer;text-shadow:0 1px 6px rgba(0,0,0,.35);transition:all .2s}
.po-modes button.on{background:#fff;color:var(--pa);text-shadow:none;box-shadow:0 6px 18px rgba(0,0,0,.2)}
.po-face{position:relative;width:clamp(250px,68vw,330px);aspect-ratio:1;border-radius:50%;margin:20px 0 14px;display:flex;align-items:center;justify-content:center;transition:transform .4s}
.po.run .po-face{animation:pobob 6s ease-in-out infinite}
.po-svg{position:absolute;inset:0;width:100%;height:100%}
.po-trk{fill:none;stroke:rgba(0,0,0,.1);stroke-width:9}
.po-prg{fill:none;stroke:var(--pa);stroke-width:9;stroke-linecap:round;transition:stroke-dashoffset .3s linear,stroke .4s;filter:drop-shadow(0 0 6px var(--pa))}
.po-in{position:relative;text-align:center}
.po-lab{font-weight:800;font-size:1.05rem;opacity:.85}
.po-time{font-size:clamp(3rem,13vw,4.7rem);font-weight:800;line-height:1.05;font-variant-numeric:tabular-nums;direction:ltr;letter-spacing:1px}
.po-dots{display:flex;gap:7px;justify-content:center;margin-top:8px}
.po-dots i{width:11px;height:11px;border-radius:50%;background:rgba(0,0,0,.16);transition:all .3s}
.po-dots i.f{background:var(--pa);transform:scale(1.2)}
.po-ctl{display:flex;align-items:center;gap:18px}
.po-ctl button{border:0;cursor:pointer;color:#fff;transition:transform .15s}
.po-ctl button:active{transform:scale(.9)}
.po-ctl .s{width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.26);backdrop-filter:blur(8px);font-size:22px}
.po-ctl .s:hover{background:rgba(255,255,255,.42)}
.po-ctl .p{width:86px;height:86px;border-radius:50%;font-size:34px;background:var(--pa);box-shadow:0 14px 34px rgba(0,0,0,.34);animation:populse 2.4s infinite}
.po.run .po-ctl .p{animation:none}
.po-ctl .p:hover{transform:scale(1.07)}
.po[data-th=melon] .po-face{margin:38px 0 32px}
.po-task{min-height:36px;padding:6px 18px;border-radius:99px;background:rgba(255,255,255,.26);backdrop-filter:blur(8px);color:#fff;font-weight:700;text-shadow:0 1px 6px rgba(0,0,0,.35);max-width:90%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.po-task span{opacity:.8;font-weight:600}
.po-earn{display:flex;flex-wrap:wrap;justify-content:center;gap:2px;font-size:1.9rem;min-height:40px;max-width:520px}
.po-earn span{animation:popop .5s both;filter:drop-shadow(0 3px 4px rgba(0,0,0,.3))}
.po-earn b{align-self:center;color:#fff;font-size:1rem}
.po-earn em{font-size:.9rem;font-style:normal;color:#fff;opacity:.9;text-shadow:0 1px 6px rgba(0,0,0,.4)}
/* وجوه الثيمات */
.po[data-th=fruit]{--pa:#ff7a3d;--pt:#5a3a1e}
.po[data-th=fruit] .po-bg{background:radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.18),transparent 60%),linear-gradient(135deg,#d49a5c,#a86a35)}
.po-grain{position:absolute;inset:0;background:repeating-linear-gradient(95deg,rgba(90,50,10,.09) 0 3px,transparent 3px 22px),repeating-linear-gradient(88deg,rgba(255,255,255,.05) 0 2px,transparent 2px 31px)}
.po[data-th=fruit] .po-face{background:radial-gradient(circle at 35% 28%,#fff 0,#f7f2ea 55%,#e4dccf 100%);box-shadow:0 0 0 10px #fff,0 0 0 14px #eadfcd,0 34px 60px rgba(60,30,0,.5),inset 0 -12px 26px rgba(120,90,40,.2)}
.po[data-th=melon]{--pa:#e11d48;--pt:#7f1d1d}
.po[data-th=melon] .po-bg{background:radial-gradient(circle at 50% 46%,#ff7b92 0%,#ff4d6d 40%,#ff2e56 64%,#ff8fa3 74%,#fff5f5 77%,#b9e6a1 80%,#2fa14f 88%,#14672b 100%)}
.po[data-th=melon] .po-face{background:radial-gradient(circle at 50% 32%,#ffe4e9,#ffb3c1);box-shadow:0 0 0 12px #eaf8d9,0 0 0 26px #1f8a3b,0 0 0 31px #14672b,0 34px 60px rgba(0,0,0,.4)}
.po-seed{position:absolute;width:13px;height:21px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:linear-gradient(135deg,#3b2a24,#0e0908);transform:rotate(var(--r));animation:poseed 6s ease-in-out infinite;box-shadow:inset 2px 2px 3px rgba(255,255,255,.2)}
.po-furn{position:absolute;filter:drop-shadow(0 8px 8px rgba(0,0,0,.35))}
.po-sofa{font-size:68px;inset-inline-start:7%;bottom:7%}.po-plant{font-size:56px;inset-inline-end:8%;bottom:8%}.po-lamp{font-size:34px;inset-inline-end:24%;bottom:14%}.po-pic{font-size:40px;inset-inline-start:12%;top:16%}
.po[data-th=forest]{--pa:#34d399;--pt:#eafff4}
.po[data-th=forest] .po-bg{background:radial-gradient(circle at 70% 10%,rgba(255,244,170,.35),transparent 40%),linear-gradient(180deg,#0b2f25,#145c44 55%,#2e8b61)}
.po[data-th=sakura]{--pa:#ec4899;--pt:#5a1f3e}
.po[data-th=sakura] .po-bg{background:radial-gradient(circle at 20% 10%,#fff,transparent 45%),linear-gradient(180deg,#ffe3ee,#ffc3d9 60%,#f5a3c3)}
.po[data-th=night]{--pa:#a78bfa;--pt:#fff}
.po[data-th=night] .po-bg{background:linear-gradient(180deg,#050816,#14194a 55%,#3a2c7c)}
.po[data-th=beach]{--pa:#fb923c;--pt:#fff}
.po[data-th=beach] .po-bg{background:linear-gradient(180deg,#ffb36b 0%,#ff6f91 45%,#7b5fd1 100%)}
.po[data-th=forest] .po-face,.po[data-th=sakura] .po-face,.po[data-th=night] .po-face,.po[data-th=beach] .po-face{background:rgba(255,255,255,.14);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.38);box-shadow:0 26px 60px rgba(0,0,0,.3),inset 0 0 40px rgba(255,255,255,.1)}
.po[data-th=sakura] .po-face{background:rgba(255,255,255,.42)}
.po[data-th=night] .po-trk,.po[data-th=forest] .po-trk,.po[data-th=beach] .po-trk{stroke:rgba(255,255,255,.18)}
.po[data-th=night] .po-dots i,.po[data-th=forest] .po-dots i,.po[data-th=beach] .po-dots i{background:rgba(255,255,255,.25)}
.po.has-img[data-th=sakura]{--pt:#fff}
.po-star{position:absolute;border-radius:50%;background:#fff;animation:potw 4s ease-in-out infinite}
.po-moon{position:absolute;top:8%;inset-inline-end:10%;width:78px;height:78px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fffbe6,#f5e9a8);box-shadow:0 0 50px 14px rgba(255,244,180,.45)}
.po-sun{position:absolute;bottom:24%;left:50%;width:180px;height:180px;margin-left:-90px;border-radius:50%;background:radial-gradient(circle,#fff6c9,#ffd36b 55%,rgba(255,180,80,0) 72%)}
.po-wave{position:absolute;left:0;bottom:0;width:200%;height:110px}
.po-wave.w1{fill:rgba(255,255,255,.28);animation:powave 14s linear infinite}
.po-wave.w2{fill:rgba(20,40,110,.4);height:80px;animation:powave 9s linear infinite}
.po-fl{position:absolute;opacity:.9;will-change:transform;filter:drop-shadow(0 4px 5px rgba(0,0,0,.25))}
.po-fl.fall{animation:pofall linear infinite}.po-fl.bob{animation:pobob ease-in-out infinite;opacity:.85}
.po.has-img .po-seed,.po.has-img .po-grain{opacity:0}
/* التبويبات واللوحات */
.po-tabs{display:flex;gap:8px;overflow-x:auto;padding:16px 2px 6px;scrollbar-width:none}
.po-tabs::-webkit-scrollbar{display:none}
.po-tabs button{flex:none;min-height:44px;padding:0 20px;border:1px solid var(--bd,#d6dee6);border-radius:99px;background:var(--card,#fff);color:var(--ink,#12232e);font:700 .95rem Cairo,Inter,sans-serif;cursor:pointer;transition:all .2s;box-shadow:var(--sh1)}
.po-tabs button:hover{transform:translateY(-2px)}
.po-tabs button.on{background:var(--grad);color:#fff;border-color:transparent;box-shadow:0 8px 20px rgba(14,138,138,.35)}
.po-panel{margin-top:10px;background:var(--card,#fff);border:1px solid var(--bd,#e1e7ed);border-radius:26px;padding:20px;box-shadow:var(--sh1);color:var(--ink,#12232e);animation:mtrise .3s both}
.po-themes{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.po-th{border:2px solid transparent;border-radius:20px;padding:8px;background:var(--card-2,#f4f7fa);cursor:pointer;display:flex;flex-direction:column;gap:8px;align-items:stretch;font:700 .92rem Cairo,Inter,sans-serif;color:var(--ink,#12232e);transition:all .2s}
.po-th:hover{transform:translateY(-4px);box-shadow:var(--sh2)}
.po-th.on{border-color:var(--g1);box-shadow:0 0 0 3px rgba(14,138,138,.25)}
.po-th .pv{height:92px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:2.6rem}
.pv-fruit{background:linear-gradient(135deg,#d49a5c,#a86a35)}.pv-melon{background:radial-gradient(circle,#ff7b92 30%,#fff5f5 56%,#2fa14f 70%,#14672b)}.pv-forest{background:linear-gradient(180deg,#0b2f25,#2e8b61)}.pv-sakura{background:linear-gradient(180deg,#ffe3ee,#f5a3c3)}.pv-night{background:linear-gradient(180deg,#050816,#3a2c7c)}.pv-beach{background:linear-gradient(180deg,#ffb36b,#ff6f91 50%,#7b5fd1)}
.po-sec{margin-bottom:22px}.po-sec:last-child{margin-bottom:0}
.po-sec h4{margin:0 0 10px;font-size:1rem;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.po-chk{margin-inline-start:auto;font-size:.85rem;font-weight:600;color:var(--mu,#5a6b78)}
.po-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.po-pill,.po-url button,.po-key button,.po-search button,.po-add button{min-height:42px;padding:0 18px;border:0;border-radius:12px;background:var(--grad);color:#fff;font:700 .92rem Cairo,Inter,sans-serif;cursor:pointer}
.po-pill{background:var(--card-2,#eef2f6);color:var(--ink,#12232e);border:1px solid var(--bd,#d6dee6)}
.po-panel form{display:flex;gap:8px;margin:8px 0}
.po-panel input[type=text],.po-panel input[type=url],.po-panel input[type=password],.po-panel input[type=search],.po-panel input[type=number],.po-panel select{flex:1;min-width:0;min-height:42px;padding:0 14px;border:1.5px solid var(--bd,#d6dee6);border-radius:12px;background:var(--card-2,#f8fafc);color:var(--ink,#12232e);font:600 .95rem Cairo,Inter,sans-serif;outline:0}
.po-panel input:focus,.po-panel select:focus{border-color:var(--g1)}
.po-url{flex:1 1 260px;margin:0!important}
.po-sl{display:flex;gap:18px;flex-wrap:wrap;margin:12px 0;color:var(--mu,#5a6b78);font-weight:600;font-size:.9rem}
.po-sl label{display:flex;flex-direction:column;gap:4px;min-width:150px;flex:1}
.po-pre{display:flex;gap:8px;flex-wrap:wrap}
.po-pre button{width:56px;height:40px;border-radius:12px;border:2px solid transparent;cursor:pointer;transition:transform .15s}
.po-pre button:hover{transform:scale(1.08)}.po-pre button.on,.po-ft.on{border-color:var(--g1);box-shadow:0 0 0 3px rgba(14,138,138,.3)}
.po-fav,.po-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
.po-ft,.po-tile{position:relative;aspect-ratio:16/10;border-radius:14px;background-size:cover;background-position:center;background-color:var(--bd,#dfe6ec);cursor:pointer;border:2px solid transparent;transition:transform .2s,box-shadow .2s}
.po-ft:hover,.po-tile:hover{transform:translateY(-3px);box-shadow:var(--sh2)}
.po-ft button,.po-tile button{position:absolute;top:6px;inset-inline-end:6px;width:30px;height:30px;border:0;border-radius:10px;background:rgba(0,0,0,.55);color:#fff;font-size:15px;cursor:pointer}
.po-tile button{color:#fde047}
.po-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 12px}
.po-chips button{border:1px solid var(--bd,#d6dee6);background:var(--card-2,#f4f7fa);color:var(--ink,#12232e);border-radius:99px;padding:5px 14px;font:700 .82rem Cairo,Inter,sans-serif;cursor:pointer;transition:all .15s}
.po-chips button:hover{border-color:var(--g1);color:var(--g1)}
.po-mu{color:var(--mu,#5a6b78);font-size:.88rem;line-height:1.9;margin:8px 2px}
.po-note{padding:12px 16px;border-radius:14px;background:rgba(245,158,11,.13);border:1px solid rgba(245,158,11,.45);font-size:.88rem;line-height:1.9;margin-bottom:8px}
.po-add{margin:0 0 12px!important}
.po-tasks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.po-tasks li{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;background:var(--card-2,#f4f7fa);border:1.5px solid transparent;transition:all .2s}
.po-tasks li.cur{border-color:var(--g1);background:rgba(14,138,138,.08)}
.po-tasks li.d .tt{text-decoration:line-through;opacity:.5}
.po-tasks .tt{flex:1;min-width:0;font-weight:700;overflow-wrap:anywhere}
.po-tasks em{font-style:normal;font-size:.82rem;color:var(--mu,#5a6b78);white-space:nowrap}
.po-tasks button{border:0;background:transparent;font-size:17px;cursor:pointer;color:var(--ink,#12232e);padding:4px 6px;border-radius:8px}
.po-tasks button:hover{background:rgba(0,0,0,.07)}
.po-tasks .ck{width:28px;height:28px;border:2px solid var(--g1);border-radius:9px;color:var(--g1);font-weight:800;font-size:15px;padding:0}
.po-tasks .empty{justify-content:center;color:var(--mu,#5a6b78)}
.po-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px}
.po-stats div{padding:16px;border-radius:20px;background:linear-gradient(135deg,rgba(14,138,138,.12),rgba(56,189,248,.1));text-align:center;display:flex;flex-direction:column;gap:2px}
.po-stats b{font-size:1.9rem;font-weight:800;color:var(--g1)}.po-stats span{color:var(--mu,#5a6b78);font-size:.85rem;font-weight:600}
.po-bars{display:flex;gap:10px;align-items:flex-end;height:180px;margin-top:20px;padding:14px 8px 0;border-radius:20px;background:var(--card-2,#f4f7fa)}
.po-bars div{flex:1;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px}
.po-bars i{display:block;width:100%;max-width:44px;border-radius:10px 10px 4px 4px;background:var(--grad);transition:height .6s}
.po-bars .v{font-size:.8rem;font-weight:800}.po-bars small{color:var(--mu,#5a6b78);padding-bottom:6px}
.po-set{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:14px}
.po-num{display:flex;flex-direction:column;gap:4px;font-weight:700;font-size:.9rem;color:var(--mu,#5a6b78)}
.po-tg,.po-amb{display:flex;flex-direction:column;gap:10px;margin-bottom:16px;font-weight:600}
.po-amb label{display:flex;flex-direction:column;gap:4px;color:var(--mu,#5a6b78)}
.po-danger{min-height:42px;padding:0 18px;border:1px solid #f5c2c0;border-radius:12px;background:#fdecec;color:#b42318;font:700 .9rem Cairo,Inter,sans-serif;cursor:pointer}
html[data-theme="dark"] .po-danger{background:#321618;color:#fca5a5;border-color:#6b2a2d}
@media(max-width:600px){.po{border-radius:24px;min-height:max(600px,86vh)}.po-sofa{font-size:48px}.po-plant{font-size:42px}.po-pic,.po-lamp{display:none}}
@media(prefers-reduced-motion:reduce){.po *{animation:none!important}}
`;
  D.head.appendChild(st);
}

/* ================= الربط مع EF + كارت الصفحة الرئيسية ================= */
function homeCard() {
  if (q1(".mt-homecard")) return;
  const tr = q1(".tracks"); if (!tr) return;
  let row = q1(".of-homerow");
  if (!row) { row = D.createElement("div"); row.className = "tracks of-homerow"; row.style.margin = "-40px auto 40px"; tr.insertAdjacentElement("afterend", row); }
  row.insertAdjacentHTML("beforeend", `<div class="tcard mt-homecard" data-go="/tools" style="animation-delay:.3s"><div class="ti"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/></svg></div><h3>${B("My tools", "أدواتي")}</h3><p>${B("Translate PDFs and understand any word.", "ترجم ملفات PDF وافهم أي كلمة.")}</p></div>`);
}
function patchEF() {
  const EF = W.EF; if (!EF || EF.__mt) return; EF.__mt = true;
  const h0 = EF.handles, r0 = EF.render, home0 = EF.home;
  EF.handles = p => p === "tools" || h0(p);
  EF.render = async function (p) {
    if (p[0] === "tools") {
      try { return p[1] === "pdf" ? pagePdf() : p[1] === "wiki" ? pageWiki() : p[1] === "pomodoro" ? pagePomo() : pageTools(); }
      catch (e) { D.getElementById("view").innerHTML = `<div class="empty"><h3>Something went wrong</h3><p>${esc(e.message)}</p><button class="btn" data-go="/">Home</button></div>`; return; }
    }
    return r0.call(EF, p);
  };
  EF.home = function () { const r = home0.apply(EF, arguments); try { homeCard(); } catch (e) { } return r; };
}
patchEF();
})();
