/* js/accounts.js - حسابات المستخدمين (Firebase Auth + Realtime Database)
   - أول ما الموقع يفتح: شاشة تسجيل دخول / حساب جديد (اسم + باسورد + المرحلة + صورة اختيارية)
   - الدايرة اللي في الشريط العلوي = دايرة حساب المستخدم (صورته أو أول حرف من اسمه)
   - الداتا: users/<uid> = { name, stage, photo, createdAt, progress{}, favs{}, notes{}, days{} }
   - التقدم (done:/best:) بيتزامن تلقائي مع Store، والمفضلة والملاحظات من أزرار ثابتة في صفحة المحاضرة
   - صفحة الحساب: #/me
   - الباسورد بيتحفظ عند Firebase Auth مشفّر، ومش بنكتبه في الداتابيز أبداً
   - window.Accounts.profile  /  event: "accounts:change"                              */
(function () {
  "use strict";

  const FB = "https://www.gstatic.com/firebasejs/10.14.1/";
  const CFG = {
    apiKey: "AIzaSyC5NZw1P-YWglpBu9SJ6-agmesofIhr4ao",
    authDomain: "eto-edu-accounts.firebaseapp.com",
    databaseURL: "https://eto-edu-accounts-default-rtdb.firebaseio.com", // لو الداتابيز في ريجن تاني انسخ الرابط من صفحة Realtime Database
    projectId: "eto-edu-accounts",
    storageBucket: "eto-edu-accounts.firebasestorage.app",
    messagingSenderId: "945070167285",
    appId: "1:945070167285:web:f55fa058b2a4cb700a21bc",
    measurementId: "G-CZGZ3VW4ES"
  };

  const OLD_CIRCLE_SELECTOR = "";
  const STAGE_TRACKS = { thanawya: ["secondary"], science: ["science"] };
  const EMAIL_DOMAIN = "eto-edu.app"; 
  const STAGES = { thanawya: "ثانوية عامة", science: "كلية العلوم" };
  let auth, db, sdk = {}, user = null, profile = null, pending = null, origSet = null, meShown = false;
  let D = { progress: {}, favs: {}, notes: {}, days: {} };
  const timers = {};
  const $id = i => document.getElementById(i);
  const pk = id => String(id).replace(/[.#$\[\]\/]/g, "_");
  const T = o => (typeof bi === "function" && o && typeof o === "object" && o.en != null && o.ar != null) ? bi(o) : esc(o && typeof o === "object" ? (o.ar || o.en) : o);
  const clean = o => JSON.parse(JSON.stringify(o));
  const NONE = {};
  const dayKey = (d = new Date()) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  let ALL_TRACKS = null;
  function guessStage(t) {
    for (const k in STAGE_TRACKS) if (STAGE_TRACKS[k].includes(t.id)) return k;
    const txt = JSON.stringify([t.id, t.code, t.title]).toLowerCase();
    if (/thanw|thanaw|secondary|high ?school|ثانو/.test(txt)) return "thanawya";
    if (/scien|faculty|college|univ|علوم|كلية|كليه/.test(txt)) return "science";
    return null; 
  }
  function applyStage() {
    if (typeof SITE === "undefined" || !SITE.tracks) return;
    if (!ALL_TRACKS) ALL_TRACKS = SITE.tracks.slice();
    const st = profile && profile.stage;
    const keep = ALL_TRACKS.filter(t => !st || !guessStage(t) || guessStage(t) === st);
    SITE.tracks.splice(0, SITE.tracks.length, ...keep);
    if (typeof route === "function") route();
  }
  const visibleRec = r => !r.subject || (typeof findSubject !== "function") || !!findSubject(r.subject);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const normName = n => String(n).normalize("NFC").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/\s+/g, " ").trim().toLowerCase();
  async function nameToEmail(name) {
    const bytes = new TextEncoder().encode(normName(name));
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 40);
    return "u" + hex + "@" + EMAIL_DOMAIN;
  }
  function resizeImage(file, size = 256) {
    return new Promise((resolve, reject) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const c = document.createElement("canvas"); c.width = c.height = size;
        const s = Math.min(img.width, img.height);
        c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("img")); };
      img.src = url;
    });
  }
  function errMsg(e) {
    const c = (e && e.code) || "";
    if (c === "auth/email-already-in-use") return "الاسم ده مستخدم قبل كده، زوّد اسم الأب أو الجد.";
    if (["auth/invalid-credential", "auth/user-not-found", "auth/wrong-password", "auth/invalid-email"].includes(c)) return "الاسم أو الباسورد غلط.";
    if (c === "auth/weak-password") return "الباسورد لازم يكون 6 حروف أو أرقام على الأقل.";
    if (c === "auth/network-request-failed") return "مفيش اتصال بالنت.";
    if (c === "auth/too-many-requests") return "محاولات كتير، استنى شوية وجرّب تاني.";
    if (c === "auth/operation-not-allowed") return "فعّل Email/Password من Authentication في Firebase.";
    if (c === "PERMISSION_DENIED" || /permission/i.test((e && e.message) || "")) return "قواعد الداتابيز مش مسموحة، راجع Rules.";
    return "حصلت مشكلة، جرّب تاني.";
  }
  const st = document.createElement("style");
  st.textContent = `
#acBtn{width:40px;height:40px;border-radius:50%;border:2px solid rgba(255,255,255,.55);padding:0;cursor:pointer;background:#2563eb center/cover no-repeat;color:#fff;font:700 1.05rem Cairo,Inter,sans-serif;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;overflow:hidden}
#acBtn:hover{border-color:#fff}
#acOv{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;background:linear-gradient(135deg,#12355b,#0b1f36);overflow:auto;direction:rtl;font-family:Cairo,Inter,sans-serif}
.acCard{width:100%;max-width:400px;background:#fff;color:#14213d;border-radius:20px;padding:24px 22px;box-shadow:0 20px 60px rgba(0,0,0,.4)}
.acCard h2{margin:0 0 4px;text-align:center;font-size:1.35rem}
.acCard p.sub{margin:0 0 16px;text-align:center;color:#64748b;font-size:.9rem}
.acTabs{display:flex;background:#eef2f7;border-radius:12px;padding:4px;margin-bottom:16px}
.acTabs button{flex:1;border:0;background:none;padding:9px;border-radius:9px;font:700 .95rem inherit;font-family:inherit;cursor:pointer;color:#475569}
.acTabs button.on{background:#fff;color:#12355b;box-shadow:0 1px 4px rgba(0,0,0,.12)}
.acF label{display:block;font-size:.85rem;font-weight:600;margin:12px 0 5px;color:#334155}
.acF input[type=text],.acF input[type=password]{width:100%;box-sizing:border-box;padding:12px 14px;border:1.5px solid #cbd5e1;border-radius:12px;font:inherit;font-size:1rem;background:#fff;color:#14213d}
.acF input:focus{outline:0;border-color:#2563eb}
.acSt{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.acSt button{border:1.5px solid #cbd5e1;background:#fff;border-radius:12px;padding:12px 6px;font:700 .95rem inherit;font-family:inherit;cursor:pointer;color:#334155}
.acSt button.on{border-color:#2563eb;background:#eff6ff;color:#1d4ed8}
.acGo{width:100%;margin-top:18px;border:0;border-radius:12px;padding:13px;font:700 1rem inherit;font-family:inherit;background:#2563eb;color:#fff;cursor:pointer}
.acGo:disabled{opacity:.6;cursor:default}
.acErr{margin-top:12px;color:#dc2626;font-size:.88rem;text-align:center;min-height:1.2em}
.acPh{display:block;margin:0 auto 4px;width:92px;height:92px;border-radius:50%;border:2px dashed #94a3b8;background:#f1f5f9 center/cover no-repeat;cursor:pointer;color:#64748b;font-size:.75rem;font-weight:600;padding:0;overflow:hidden}
.acPhT{text-align:center;font-size:.78rem;color:#64748b}
.acSpin{width:38px;height:38px;border-radius:50%;border:4px solid rgba(255,255,255,.25);border-top-color:#fff;animation:acs .8s linear infinite}
@keyframes acs{to{transform:rotate(360deg)}}
#acMenu{position:fixed;z-index:99998;min-width:230px;background:#fff;color:#14213d;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.3);padding:14px;direction:rtl;font-family:Cairo,Inter,sans-serif}
#acMenu .who{display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid #e2e8f0;margin-bottom:10px}
#acMenu .av{width:46px;height:46px;border-radius:50%;background:#2563eb center/cover no-repeat;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex:0 0 auto}
#acMenu .nm{font-weight:700;font-size:.95rem;line-height:1.3;word-break:break-word}
#acMenu .sg{font-size:.78rem;color:#64748b}
#acMenu .it{display:block;width:100%;text-align:start;border:0;background:none;padding:9px 6px;border-radius:9px;font:600 .9rem inherit;font-family:inherit;cursor:pointer;color:#14213d}
#acMenu .it:hover{background:#f1f5f9}
#acMenu .it.out{color:#dc2626}
#acMenu .acSt{margin:4px 0 8px}
#acMenu .acSt button{padding:8px 4px;font-size:.82rem}
#acLec{position:fixed;left:12px;bottom:92px;z-index:90;display:flex;flex-direction:column;gap:8px}
#acLec button{width:44px;height:44px;border-radius:50%;border:0;background:rgba(20,30,45,.9);color:#fff;font-size:1.25rem;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3)}
#acLec button.on{background:#f59e0b}
#acNote{position:fixed;inset:0;z-index:99997;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px;direction:rtl;font-family:Cairo,Inter,sans-serif}
#acNote textarea,.meNote textarea{width:100%;box-sizing:border-box;min-height:150px;padding:12px;border:1.5px solid #cbd5e1;border-radius:12px;font:inherit;resize:vertical;background:#fff;color:#14213d;direction:rtl}
.me{max-width:860px;margin:18px auto;padding:0 14px 40px;direction:rtl}
.meHead{display:flex;gap:16px;align-items:center;margin-bottom:8px}
.meAv{width:84px;height:84px;border-radius:50%;background:#2563eb center/cover no-repeat;color:#fff;font:700 2rem Cairo,sans-serif;display:flex;align-items:center;justify-content:center;flex:0 0 auto}
.me h2{margin:0 0 2px}
.meH{font-weight:800;font-size:1.1rem;margin:24px 0 10px}
.meGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
.meTile{background:rgba(127,127,127,.1);border:1px solid rgba(127,127,127,.25);border-radius:14px;padding:12px;text-align:center}
.meTile b{display:block;font-size:1.25rem}.meTile span,.meSm{font-size:.82rem;opacity:.75}
.meSub{font-weight:700;margin:14px 0 6px;color:#2563eb}
.meRow{background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.22);border-radius:12px;padding:10px 12px;margin-bottom:8px;display:flex;flex-direction:column;gap:6px}
.meLink{cursor:pointer;color:inherit;text-decoration:none}
.meBar{height:6px;border-radius:6px;background:rgba(127,127,127,.25);overflow:hidden}.meBar i{display:block;height:100%;background:#38bdf8}
.meBtn{border:0;border-radius:9px;padding:7px 14px;margin:6px 0 0 6px;font:700 .85rem inherit;font-family:inherit;background:#2563eb;color:#fff;cursor:pointer}
.meNote{margin-bottom:12px}.meNote textarea{min-height:90px;margin-top:6px}
` + (OLD_CIRCLE_SELECTOR ? OLD_CIRCLE_SELECTOR + "{display:none!important}" : "");
  document.head.appendChild(st);
  const btn = document.createElement("button");
  btn.id = "acBtn"; btn.type = "button"; btn.setAttribute("aria-label", "حسابي"); btn.hidden = true;
  function mountBtn() {
    const host = document.querySelector(".top .tools") || document.querySelector(".top");
    if (host && !btn.isConnected) host.appendChild(btn);
  }
  function paintAvatar(el, p) {
    if (p && p.photo) { el.style.backgroundImage = "url(" + p.photo + ")"; el.textContent = ""; }
    else { el.style.backgroundImage = ""; el.textContent = p && p.name ? [...p.name.trim()][0] : "؟"; }
  }
  function refreshUI() {
    mountBtn();
    btn.hidden = !user;
    if (user) paintAvatar(btn, profile);
    window.dispatchEvent(new CustomEvent("accounts:change", { detail: { user, profile } }));
    if (meShown && user && profile && /^#\/me/.test(location.hash)) renderMe();
  }
  let ov = null;
  function showOverlay(html) {
    if (!ov) { ov = document.createElement("div"); ov.id = "acOv"; document.body.appendChild(ov); document.body.style.overflow = "hidden"; }
    ov.innerHTML = html;
    return ov;
  }
  function hideOverlay() { if (ov) { ov.remove(); ov = null; document.body.style.overflow = ""; } }
  const spinner = () => showOverlay('<div class="acSpin"></div>');
  function stagePicker(sel) {
    return '<div class="acSt">' + Object.entries(STAGES).map(([k, v]) => '<button type="button" data-st="' + k + '"' + (k === sel ? ' class="on"' : "") + ">" + v + "</button>").join("") + "</div>";
  }
  function bindStagePicker(root, onPick) {
    root.querySelectorAll("[data-st]").forEach(b => b.onclick = () => {
      root.querySelectorAll("[data-st]").forEach(x => x.classList.toggle("on", x === b));
      onPick(b.dataset.st);
    });
  }
  function authScreen(mode) {
    let stage = "", photo = "";
    const signup = mode === "signup";
    const o = showOverlay(`<div class="acCard acF">
      <h2>ETO.Edu</h2><p class="sub">${signup ? "اعمل حسابك في دقيقة" : "سجّل دخولك عشان تكمّل"}</p>
      <div class="acTabs"><button data-m="login" class="${signup ? "" : "on"}">دخول</button><button data-m="signup" class="${signup ? "on" : ""}">حساب جديد</button></div>
      ${signup ? '<button type="button" class="acPh" id="acPh">+ صورة</button><div class="acPhT">الصورة اختيارية</div><input type="file" id="acFile" accept="image/*" hidden>' : ""}
      <label>${signup ? "الاسم بالتفصيل (ثلاثي أو رباعي)" : "الاسم"}</label>
      <input type="text" id="acName" autocomplete="username" placeholder="مثال: أحمد محمد علي حسن">
      <label>الباسورد</label>
      <input type="password" id="acPass" autocomplete="${signup ? "new-password" : "current-password"}" placeholder="6 حروف أو أرقام على الأقل">
      ${signup ? "<label>أنت في أنهي مرحلة؟</label>" + stagePicker("") : ""}
      <div class="acErr" id="acErr"></div>
      <button class="acGo" id="acGo">${signup ? "إنشاء الحساب" : "دخول"}</button>
    </div>`);
    o.querySelectorAll("[data-m]").forEach(b => b.onclick = () => authScreen(b.dataset.m));
    const err = o.querySelector("#acErr"), go = o.querySelector("#acGo");
    if (signup) {
      bindStagePicker(o, s => (stage = s));
      const f = o.querySelector("#acFile"), ph = o.querySelector("#acPh");
      ph.onclick = () => f.click();
      f.onchange = async () => {
        if (!f.files[0]) return;
        try { photo = await resizeImage(f.files[0]); ph.style.backgroundImage = "url(" + photo + ")"; ph.textContent = ""; }
        catch (_) { err.textContent = "الصورة دي مش شغالة، جرّب غيرها."; }
      };
    }
    const submit = async () => {
      const name = o.querySelector("#acName").value.replace(/\s+/g, " ").trim(), pass = o.querySelector("#acPass").value;
      err.textContent = "";
      if (name.length < 3) return (err.textContent = "اكتب اسمك بالتفصيل.");
      if (pass.length < 6) return (err.textContent = "الباسورد لازم يكون 6 على الأقل.");
      if (signup && !stage) return (err.textContent = "اختار المرحلة.");
      go.disabled = true;
      try {
        const email = await nameToEmail(name);
        if (signup) {
          const data = { name, stage, photo, createdAt: Date.now() };
          pending = data;
          const cred = await sdk.auth.createUserWithEmailAndPassword(auth, email, pass);
          try { await sdk.db.set(sdk.db.ref(db, "users/" + cred.user.uid), data); } finally { pending = null; }
        } else {
          await sdk.auth.signInWithEmailAndPassword(auth, email, pass);
        }
      } catch (e) { pending = null; err.textContent = errMsg(e); go.disabled = false; }
    };
    go.onclick = submit;
    o.querySelectorAll("input[type=text],input[type=password]").forEach(i => i.onkeydown = e => { if (e.key === "Enter") submit(); });
  }

  function stageOnlyScreen() {
    let stage = "";
    const o = showOverlay(`<div class="acCard acF"><h2>أهلاً ${esc(profile && profile.name)}</h2><p class="sub">أنت في أنهي مرحلة؟</p>${stagePicker("")}<div class="acErr" id="acErr"></div><button class="acGo" id="acGo">تمام</button></div>`);
    bindStagePicker(o, s => (stage = s));
    o.querySelector("#acGo").onclick = async () => {
      if (!stage) return (o.querySelector("#acErr").textContent = "اختار المرحلة.");
      await saveProfile({ stage });
      hideOverlay();
      applyStage();
    };
  }
  async function saveProfile(patch) {
    profile = Object.assign({}, profile, patch);
    refreshUI();
    try { await sdk.db.update(sdk.db.ref(db, "users/" + user.uid), patch); } catch (e) { console.warn("accounts:", e); }
  }
  async function loadProfile() {
    let v = null;
    try {
      const snap = await sdk.db.get(sdk.db.ref(db, "users/" + user.uid));
      v = snap.exists() ? snap.val() : null;
    } catch (e) { console.warn("accounts:", e); }
    v = v || {};
    profile = { name: v.name || user.displayName || "", stage: v.stage || "", photo: v.photo || "", createdAt: v.createdAt };
    D = { progress: v.progress || {}, favs: v.favs || {}, notes: v.notes || {}, days: v.days || {} };
  }
  function w(path, val) {
    if (!user) return;
    sdk.db.set(sdk.db.ref(db, "users/" + user.uid + "/" + path), val === null ? null : clean(val)).catch(e => console.warn("accounts:", e));
  }
  function markDay() {
    const d = dayKey();
    if (!D.days[d]) { D.days[d] = 1; w("days/" + d, 1); }
  }
  function lectureMeta(id) {
    const L = (window.LECTURES || {})[id], m = {};
    if (L) {
      if (L.title) m.title = L.title;
      if (L.subject) m.subject = L.subject;
      if (L.sections) m.n = L.sections.length;
      if (L.number != null) m.num = L.number;
      const q = ((window.QUESTIONS || {})[id] || []).length;
      if (q) m.q = q;
    }
    return m;
  }
  function pushProgress(id) {
    const k = pk(id);
    clearTimeout(timers[k]);
    timers[k] = setTimeout(() => w("progress/" + k, D.progress[k]), 500);
  }
  function hookStore() {
    if (typeof Store === "undefined" || typeof Store.set !== "function" || Store.__ac) return;
    origSet = Store.set.bind(Store);
    Store.set = function () {
      const r = origSet.apply(Store, arguments);
      try { onStoreSet(arguments[0], arguments[1]); } catch (e) { console.warn("accounts:", e); }
      return r;
    };
    Store.__ac = 1;
  }
  function onStoreSet(key, val) {
    const m = /^(done|best):(.+)$/.exec(String(key));
    if (!m || !user) return;
    const id = m[2], k = pk(id), rec = D.progress[k] || { id };
    if (m[1] === "done") rec.done = Array.isArray(val) ? val.map(String) : [];
    else if (typeof val === "number") rec.best = val; else return;
    Object.assign(rec, lectureMeta(id));
    rec.at = Date.now();
    D.progress[k] = rec;
    markDay(); pushProgress(id);
  }
  function localEntries() {
    const out = [];
    if (typeof Store === "undefined") return out;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i), m = /(?:^|[^A-Za-z])(done|best):([^:]+)$/.exec(k || "");
      if (m && Store.get(m[1] + ":" + m[2], NONE) !== NONE) out.push({ k, kind: m[1], id: m[2] });
    }
    return out;
  }
  function syncLocal() {
    if (typeof Store === "undefined" || !origSet) return;
    const entries = localEntries(), last = localStorage.getItem("acUid");
    if (last && last !== user.uid) entries.splice(0).forEach(e => localStorage.removeItem(e.k)); // حساب تاني على نفس المتصفح
    localStorage.setItem("acUid", user.uid);
    const loc = {};
    entries.forEach(e => { (loc[e.id] = loc[e.id] || {})[e.kind] = Store.get(e.kind + ":" + e.id, null); });
    const ids = new Set([...Object.values(D.progress).map(r => r.id).filter(Boolean), ...Object.keys(loc)]);
    ids.forEach(id => {
      const k = pk(id), c = D.progress[k] || { id }, l = loc[id] || {}, before = JSON.stringify(c);
      const ld = Array.isArray(l.done) ? l.done.map(String) : [];
      const done = [...new Set([...(c.done || []).map(String), ...ld])];
      const bests = [c.best, l.best].filter(x => typeof x === "number");
      const best = bests.length ? Math.max(...bests) : null;
      if (!done.length && best == null) return;
      const rec = Object.assign({}, c, { id, done });
      if (best != null) rec.best = best;
      if (!rec.at) rec.at = Date.now();
      D.progress[k] = rec;
      if (JSON.stringify(ld) !== JSON.stringify(done)) origSet("done:" + id, done);
      if (best != null && l.best !== best) origSet("best:" + id, best);
      if (JSON.stringify(rec) !== before) pushProgress(id);
    });
  }
  function toggleFav(id, sid) {
    const k = pk(id);
    if (D.favs[k]) { delete D.favs[k]; w("favs/" + k, null); }
    else { D.favs[k] = Object.assign({ id, subject: sid || "", at: Date.now() }, lectureMeta(id)); w("favs/" + k, D.favs[k]); }
    markDay(); mountLecBar(); if (meShown) renderMe();
  }
  function saveNote(id, text, sid) {
    const k = pk(id); text = String(text || "").slice(0, 4000);
    if (!text.trim()) { delete D.notes[k]; w("notes/" + k, null); }
    else { D.notes[k] = Object.assign({ id, subject: sid || "", text, at: Date.now() }, lectureMeta(id)); w("notes/" + k, D.notes[k]); markDay(); }
    mountLecBar(); if (meShown) renderMe();
  }
  function noteModal(id, sid) {
    const k = pk(id), cur = D.notes[k], m = lectureMeta(id);
    const o = document.createElement("div"); o.id = "acNote";
    o.innerHTML = `<div class="acCard acF" style="max-width:480px"><h2>ملاحظاتي</h2><p class="sub">${m.title ? T(m.title) : esc(id)}</p>
      <textarea id="acTa" maxlength="4000" placeholder="اكتب ملاحظاتك على المحاضرة دي...">${esc(cur ? cur.text : "")}</textarea>
      <button class="acGo" id="acSv">حفظ</button><button class="acGo" id="acCl" style="background:#64748b;margin-top:8px">إغلاق</button></div>`;
    document.body.appendChild(o);
    o.onclick = e => { if (e.target === o) o.remove(); };
    o.querySelector("#acCl").onclick = () => o.remove();
    o.querySelector("#acSv").onclick = () => { saveNote(id, o.querySelector("#acTa").value, sid); o.remove(); };
    o.querySelector("#acTa").focus();
  }
  function mountLecBar() {
    const m = /^#\/l\/([^/]+)\/([^/]+)/.exec(location.hash);
    let bar = $id("acLec");
    if (!user || !m) { if (bar) bar.remove(); return; }
    const sid = m[1], id = m[2], k = pk(id);
    if (!bar) { bar = document.createElement("div"); bar.id = "acLec"; document.body.appendChild(bar); }
    bar.innerHTML = `<button type="button" id="acFav" class="${D.favs[k] ? "on" : ""}" aria-label="مفضلة">${D.favs[k] ? "&#9733;" : "&#9734;"}</button><button type="button" id="acNt" class="${D.notes[k] ? "on" : ""}" aria-label="ملاحظات">&#9998;</button>`;
    bar.querySelector("#acFav").onclick = () => toggleFav(id, sid);
    bar.querySelector("#acNt").onclick = () => noteModal(id, sid);
  }
  addEventListener("hashchange", () => { setTimeout(mountLecBar, 60); meShown = /^#\/me/.test(location.hash); });
  function computeStats() {
    const P = Object.values(D.progress).filter(visibleRec), started = P.filter(r => (r.done || []).length || typeof r.best === "number");
    const secs = started.reduce((a, r) => a + (r.done || []).length, 0), total = started.reduce((a, r) => a + (r.n || 0), 0);
    const exams = P.filter(r => typeof r.best === "number");
    const avg = exams.length ? Math.round(exams.reduce((a, r) => a + r.best, 0) / exams.length) : null;
    const last = P.reduce((a, r) => Math.max(a, r.at || 0), 0);
    let streak = 0; const d = new Date();
    if (!D.days[dayKey(d)]) d.setDate(d.getDate() - 1);
    while (D.days[dayKey(d)]) { streak++; d.setDate(d.getDate() - 1); }
    return {
      started: started.length, secs, total,
      completed: started.filter(r => r.n && (r.done || []).length >= r.n).length,
      avg, exams: exams.length, qs: exams.reduce((a, r) => a + (r.q || 0), 0),
      subjects: new Set(started.map(r => r.subject).filter(Boolean)).size, streak, last
    };
  }
  const fmtDate = t => t ? new Date(t).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" }) : "-";
  function subjTitle(sid) { try { const f = findSubject(sid); return f ? T(f.s.title) : esc(sid || "مواد تانية"); } catch (_) { return esc(sid || "مواد تانية"); } }

  function lecRow(r, extra) {
    const n = r.n || 0, d = (r.done || []).length, pct = n ? Math.round(d / n * 100) : 0;
    const link = r.subject ? '<a class="meLink" data-go="/l/' + esc(r.subject) + "/" + esc(r.id) + '">' : "<span>";
    return `<div class="meRow">${link}<b>${r.title ? T(r.title) : esc(r.id)}</b></${r.subject ? "a" : "span"}>
      ${extra || `<div class="meBar"><i style="width:${pct}%"></i></div><div class="meSm">${d}${n ? " / " + n : ""} قسم${typeof r.best === "number" ? " &middot; أفضل نتيجة " + r.best + "%" : ""}</div>`}</div>`;
  }
  function renderMe() {
    meShown = true;
    const view = $id("view"); if (!view) return;
    if (!user || !profile) { view.innerHTML = '<div class="empty">Loading...</div>'; return; }
    const S = computeStats(), P = Object.values(D.progress).filter(visibleRec).filter(r => (r.done || []).length || typeof r.best === "number");
    const bySub = {};
    P.forEach(r => (bySub[r.subject || ""] = bySub[r.subject || ""] || []).push(r));
    const favs = Object.values(D.favs).filter(visibleRec).sort((a, b) => b.at - a.at), notes = Object.values(D.notes).filter(visibleRec).sort((a, b) => b.at - a.at);
    const tile = (v, l) => `<div class="meTile"><b>${v}</b><span>${l}</span></div>`;
    view.innerHTML = `<div class="me">
      <div class="meHead"><div class="meAv" id="meAv"></div><div><h2>${esc(profile.name)}</h2><div class="meSm">${esc(STAGES[profile.stage] || "")} &middot; عضو من ${fmtDate(profile.createdAt)}</div>
      <button class="meBtn" data-a="photo">تغيير الصورة</button><button class="meBtn" data-a="out">تسجيل الخروج</button><input type="file" id="meF" accept="image/*" hidden></div></div>
      <div class="meH">إحصائياتي</div><div class="meGrid">
        ${tile(S.started, "محاضرات بدأتها")}${tile(S.secs + (S.total ? " / " + S.total : ""), "أقسام ذاكرتها")}${tile(S.completed, "محاضرات خلّصتها")}
        ${tile(S.avg == null ? "-" : S.avg + "%", "متوسط أفضل نتايجك")}${tile(S.exams, "امتحانات دخلتها")}${tile(S.qs, "أسئلة في امتحاناتك")}
        ${tile(S.subjects, "مواد")}${tile(S.streak + " يوم", "أيام متتالية")}${tile(fmtDate(S.last), "آخر نشاط")}</div>
      <div class="meH">تقدّمي في المحاضرات</div>
      ${P.length ? Object.keys(bySub).map(sid => `<div class="meSub">${subjTitle(sid)}</div>` + bySub[sid].sort((a, b) => (a.num || 0) - (b.num || 0)).map(r => lecRow(r)).join("")).join("") : '<div class="meSm">لسه ما بدأتش أي محاضرة.</div>'}
      <div class="meH">&#9733; المفضلة</div>
      ${favs.length ? favs.map(r => lecRow(r, `<button class="meBtn" data-a="unfav" data-id="${esc(r.id)}">شيل</button>`)).join("") : '<div class="meSm">دوس على النجمة جوه أي محاضرة عشان تضيفها هنا.</div>'}
      <div class="meH">&#9998; ملاحظاتي</div>
      ${notes.length ? notes.map(r => `<div class="meNote">${lecRow(r, "")}<textarea data-id="${esc(r.id)}" maxlength="4000">${esc(r.text)}</textarea><div><button class="meBtn" data-a="svnote" data-id="${esc(r.id)}" data-s="${esc(r.subject)}">حفظ</button><button class="meBtn" data-a="delnote" data-id="${esc(r.id)}">مسح</button></div></div>`).join("") : '<div class="meSm">دوس على زر القلم جوه أي محاضرة عشان تكتب ملاحظة.</div>'}
    </div>`;
    paintAvatar($id("meAv"), profile);
    const f = $id("meF");
    f.onchange = async () => { if (f.files[0]) { try { await saveProfile({ photo: await resizeImage(f.files[0]) }); } catch (_) {} } };
    view.querySelector(".me").onclick = e => {
      const b = e.target.closest("[data-a]"); if (!b) return;
      const a = b.dataset.a, id = b.dataset.id;
      if (a === "photo") f.click();
      else if (a === "out") sdk.auth.signOut(auth);
      else if (a === "unfav") toggleFav(id);
      else if (a === "delnote") saveNote(id, "");
      else if (a === "svnote") { const ta = [...view.querySelectorAll("textarea[data-id]")].find(t => t.dataset.id === id); if (ta) saveNote(id, ta.value, b.dataset.s); }
    };
  }
  function closeMenu() { const m = document.getElementById("acMenu"); if (m) m.remove(); }
  function openMenu() {
    if (document.getElementById("acMenu")) return closeMenu();
    if (!user || !profile) return;
    const m = document.createElement("div"); m.id = "acMenu";
    m.innerHTML = `<div class="who"><div class="av"></div><div><div class="nm">${esc(profile.name)}</div><div class="sg">${esc(STAGES[profile.stage] || "")}</div></div></div>
      <button class="it" data-a="me">صفحتي (تقدمي والمفضلة والملاحظات)</button>
      <button class="it" data-a="photo">تغيير الصورة</button>
      <div style="font-size:.78rem;color:#64748b;padding:6px 6px 2px">المرحلة</div>${stagePicker(profile.stage)}
      <button class="it out" data-a="out">تسجيل الخروج</button>
      <input type="file" accept="image/*" hidden id="acF2">`;
    document.body.appendChild(m);
    paintAvatar(m.querySelector(".av"), profile);
    const r = btn.getBoundingClientRect();
    m.style.top = r.bottom + 8 + "px";
    m.style.left = Math.max(8, Math.min(r.left, innerWidth - m.offsetWidth - 8)) + "px";
    const f = m.querySelector("#acF2");
    f.onchange = async () => {
      if (!f.files[0]) return;
      try { await saveProfile({ photo: await resizeImage(f.files[0]) }); } catch (_) {}
      closeMenu();
    };
    bindStagePicker(m, async s => { await saveProfile({ stage: s }); m.querySelector(".sg").textContent = STAGES[s]; applyStage(); });
    m.querySelector('[data-a="photo"]').onclick = () => f.click();
    m.querySelector('[data-a="me"]').onclick = () => { closeMenu(); location.hash = "#/me"; };
    m.querySelector('[data-a="out"]').onclick = async () => { closeMenu(); await sdk.auth.signOut(auth); };
  }
  btn.onclick = e => { e.stopPropagation(); openMenu(); };
  document.addEventListener("click", e => { if (!e.target.closest("#acMenu") && e.target !== btn) closeMenu(); });
  addEventListener("scroll", closeMenu, { passive: true });
  async function boot() {
    spinner();
    try {
      const [A, Au, FDB] = await Promise.all([import(FB + "firebase-app.js"), import(FB + "firebase-auth.js"), import(FB + "firebase-database.js")]);
      const app = A.initializeApp(CFG);
      auth = Au.getAuth(app); db = FDB.getDatabase(app);
      sdk.auth = Au; sdk.db = FDB;
      import(FB + "firebase-analytics.js").then(m => m.getAnalytics(app)).catch(() => {});
      Au.onAuthStateChanged(auth, async u => {
        user = u;
        if (!u) { profile = null; D = { progress: {}, favs: {}, notes: {}, days: {} }; refreshUI(); mountLecBar(); closeMenu(); return authScreen("login"); }
        if (pending) { profile = pending; D = { progress: {}, favs: {}, notes: {}, days: {} }; } else await loadProfile();
        hookStore(); syncLocal();
        refreshUI(); mountLecBar();
        if (!profile.stage) return stageOnlyScreen();
        hideOverlay();
        applyStage();
      });
    } catch (e) {
      console.warn("accounts: firebase failed to load", e);
      showOverlay('<div class="acCard"><h2>مفيش اتصال</h2><p class="sub">اتأكد من النت وحدّث الصفحة.</p><button class="acGo" onclick="location.reload()">تحديث</button></div>');
    }
  }
  window.Accounts = {
    get user() { return user; },
    get profile() { return profile; },
    get stage() { return profile && profile.stage; },
    get data() { return D; },
    render: renderMe,
    signOut: () => sdk.auth && sdk.auth.signOut(auth)
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
