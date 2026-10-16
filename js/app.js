/* js/app.js - الصفحات والتنقل
   #/                  الرئيسية (اختيار: كلية علوم / ثانوية عامة)
   #/t/<track>         مواد التراك
   #/s/<subject>       محاضرات المادة
   #/l/<subject>/<id>  صفحة المحاضرة + الامتحان               */

/* ---- slides + formulas ---- */
(function(){const st=document.createElement("style");st.textContent=`
.stage{position:relative;max-width:860px;margin:18px auto 0}
.stage section{display:none;opacity:1!important;transform:none!important;min-height:55vh;animation:sl .35s ease}
.stage section.on{display:block}
@keyframes sl{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.snav{position:sticky;bottom:0;z-index:20;max-width:860px;margin:14px auto;padding:10px 12px;display:flex;align-items:center;gap:10px;background:rgba(20,30,45,.92);backdrop-filter:blur(8px);border-radius:14px;color:#fff}
.snav button{flex:0 0 auto;border:0;border-radius:10px;padding:10px 18px;font:inherit;font-weight:700;cursor:pointer;background:#2563eb;color:#fff}
.snav button:disabled{opacity:.35;cursor:default}
.snav .mid{flex:1;text-align:center;font-size:.85rem}
.sbar{height:5px;border-radius:5px;background:rgba(255,255,255,.2);margin-top:6px;overflow:hidden}
.sbar i{display:block;height:100%;width:0;background:#38bdf8;transition:width .3s}
.fx{display:inline-block;direction:ltr;unicode-bidi:isolate;font-family:"Cambria Math","STIX Two Math","Times New Roman",serif;font-size:1.08em;font-weight:600;padding:2px 10px;margin:2px 3px;border-radius:8px;background:rgba(37,99,235,.12);border:1px solid rgba(37,99,235,.28);line-height:1.7}
.eqb{margin:8px 0 2px;padding:8px 12px;border-radius:10px;background:rgba(127,127,127,.1);border-inline-start:4px solid #2563eb}
.eql{font-family:"Cambria Math","STIX Two Math","Times New Roman",serif;line-height:2;unicode-bidi:plaintext}
.eql:not(:last-child){border-bottom:1px dashed rgba(127,127,127,.25)}
.rt{display:inline-flex;align-items:flex-end;unicode-bidi:isolate;direction:ltr}.rt i{font-style:normal}.rt u{text-decoration:none;border-top:1.5px solid currentColor;padding:0 2px;margin-top:2px}
sub,sup{line-height:0;font-size:.72em}
.frc{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .18em;line-height:1.2;direction:ltr;unicode-bidi:isolate;font-size:.95em}
.frc>span:first-child{border-bottom:1.5px solid currentColor;padding:0 .35em .06em}
.frc>span:last-child{padding:.06em .35em 0}
.eql .fx{background:none;border:0;padding:0;margin:0;font-weight:inherit;display:inline}
.fx b{font-weight:800}
.fx .frc,.fx .rt{font-weight:inherit}
`;document.head.appendChild(st)})();
const view = $("#view");
const APP_STATE_KEY = "etoedu-app-state-v1";
let hasStartedRoute = false;
let appStateTimer = null;

function readAppState() {
  try {
    return JSON.parse(localStorage.getItem(APP_STATE_KEY) || "null");
  } catch (_) {
    return null;
  }
}

function saveAppState() {
  try {
    localStorage.setItem(APP_STATE_KEY, JSON.stringify({
      hash: location.hash || "#/",
      scrollY: Math.max(0, window.scrollY || 0),
      savedAt: Date.now()
    }));
  } catch (_) {}
}

function restoreLastRoute() {
  const state = readAppState();

  if (
    !location.hash &&
    state &&
    typeof state.hash === "string" &&
    state.hash.startsWith("#/") &&
    state.hash !== "#/"
  ) {
    history.replaceState(
      null,
      "",
      location.pathname + location.search + state.hash
    );
  }
}
const go = h => { if (location.hash === "#" + h) route(); else location.hash = h; };

const findTrack = id => SITE.tracks.find(t => t.id === id);
const findSubject = id => { for (const t of SITE.tracks) { const s = t.subjects.find(x => x.id === id); if (s) return { s, t }; } };

const crumb = items => `<div class="crumb">${items.map((c, i) => i < items.length - 1
  ? `<a data-go="${c[1]}">${bi(c[0])}</a><span>/</span>` : `<span>${bi(c[0])}</span>`).join("")}</div>`;
const HOME = [{ en: "Home", ar: "الرئيسية" }, "/"];

/* ---------- الرئيسية ---------- */
function home() {
  view.innerHTML = `<div class="hhero">
    <div class="orb" style="width:220px;height:220px;left:-60px;top:30px"></div><div class="orb" style="width:120px;height:120px;right:8%;top:50px;animation-delay:-3s"></div>
    <div class="orb" style="width:300px;height:300px;right:-100px;bottom:-120px;animation-delay:-5s"></div><div class="orb" style="width:70px;height:70px;left:22%;bottom:30px;animation-delay:-2s"></div>
    <h1>Eto.Edu</h1>
    <div class="sub">${bi({ en: "Choose your track to start studying.", ar: "اختار مرحلتك وابدأ المذاكرة." })}</div>
    <div class="stats"><span>Bilingual: English + Egyptian Arabic</span><span>Hold any word to translate</span><span>Exam after every lecture</span></div></div>
    <div class="tracks">${SITE.tracks.map((t, k) => `<div class="tcard" data-go="/t/${t.id}" style="animation-delay:${k * .12}s">
      <div class="ti">${t.code}</div><h3>${bi(t.title)}</h3><p>${bi(t.desc)}</p>
      <div class="chips"><span>${t.subjects.length} ${t.subjects.length > 1 ? "subjects" : "subject"}</span></div></div>`).join("")}</div>`;
}

/* ---------- مواد التراك ---------- */
function trackView(id) {
  const t = findTrack(id); if (!t) return home();
  view.innerHTML = crumb([HOME, [t.title, "/t/" + t.id]]) +
    `<div class="pagehead"><h2>${bi(t.title)}</h2><p>${bi(t.desc)}</p></div><div class="grid">` +
    t.subjects.map((s, k) => {
      const bg = `background:linear-gradient(135deg,${s.colors[0]},${s.colors[1]})`;
      return s.soon
        ? `<div class="card soon" style="animation-delay:${k * .07}s"><div class="im" style="${bg};opacity:.55"><div class="subim">${s.code}</div></div><div class="cb"><h3>${bi(s.title)}</h3><p>Coming soon</p></div></div>`
        : `<div class="card" data-go="/s/${s.id}" style="animation-delay:${k * .07}s"><div class="im" style="${bg}"><div class="subim">${s.code}</div></div><div class="cb"><h3>${bi(s.title)}</h3><p>${bi({ en: "Open lectures", ar: "افتح المحاضرات" })}</p></div></div>`;
    }).join("") + `</div>`;
}

/* ---------- محاضرات المادة ---------- */
async function subjectView(id) {
  const f = findSubject(id); if (!f || f.s.soon) return home();
  const { s, t } = f, head = crumb([HOME, [t.title, "/t/" + t.id], [s.title, "/s/" + s.id]]);
  view.innerHTML = head + `<div class="empty">Loading...</div>`;
  await loadScripts(s.files);
  const lecs = Object.values(window.LECTURES || {}).filter(l => l.subject === s.id).sort((a, b) => a.number - b.number);
  const cards = lecs.map(l => {
    const d = Store.get("done:" + l.id, []).length, n = l.sections.length, b = Store.get("best:" + l.id, null), q = ((window.QUESTIONS || {})[l.id] || []).length;
    return { n: l.number, html: `<div class="card" data-go="/l/${s.id}/${l.id}"><div class="im"><img src="${l.images[l.cover]}" alt=""><span class="num">Lecture ${String(l.number).padStart(2, "0")}</span></div>
      <div class="cb"><h3>${bi(l.title)}</h3><p>${bi(l.description)}</p><div class="chips"><span>${n} sections</span><span>${q} questions</span></div>
      <div class="pbar"><i style="width:${d / n * 100}%"></i></div><div class="meta"><span>${d} / ${n} studied</span><span>${b == null ? "No exam yet" : "Best score: " + b + "%"}</span></div></div></div>` };
  });
  (s.placeholders || []).forEach(p => cards.push({ n: p.number, html: `<div class="card soon"><div class="im">Coming soon</div><div class="cb"><h3>Lecture ${p.number}</h3><p>This lecture will appear here when it is added.</p></div></div>` }));
  cards.sort((x, y) => x.n - y.n);
  const last = cards.length ? cards[cards.length - 1].n : 0;
  cards.push({ n: last + 1, html: `<div class="card soon"><div class="im">Coming soon</div><div class="cb"><h3>Lecture ${last + 1}</h3><p>It will appear here when it is added.</p></div></div>` });
  const toolCards = (s.tools || []).map(k => TOOLS[k]).filter(Boolean).map((tl, k) =>
    `<div class="card" style="animation-delay:${k * .08}s" data-go="/tool/${s.id}/${tl.id}"><div class="im" style="background:linear-gradient(135deg,${s.colors[0]},${s.colors[1]})"><div class="subim">${tl.icon}</div></div><div class="cb"><h3>${bi(tl.title)}</h3><p>${bi(tl.desc)}</p></div></div>`);
  toolCards.push(`<div class="card soon"><div class="im">Coming soon</div><div class="cb"><h3>${bi({ en: "More tools", ar: "أدوات تانية" })}</h3><p>${bi({ en: "New study tools will appear here.", ar: "أدوات مذاكرة جديدة هتظهر هنا." })}</p></div></div>`);
  view.innerHTML = head + `<div class="pagehead"><h2>${bi(s.title)}</h2></div>
    <div class="sechd"><h2>${bi({ en: "Lectures", ar: "المحاضرات" })}</h2></div><div class="grid">` +
    cards.map((c, k) => c.html.replace("<div class=\"card", `<div style="animation-delay:${k * .08}s" class="card`)).join("") + `</div>
    <div class="sechd"><h2>${bi({ en: "Study tools", ar: "أدوات مساعدة" })}</h2></div><div class="grid">${toolCards.join("")}</div>`;
  if (window.EF) EF.subject(s);
}
async function toolView(sid, tid) {
  const f0 = findSubject(sid); if (f0 && !f0.s.soon) await loadScripts(f0.s.files);
  const f = findSubject(sid), tl = TOOLS[tid]; if (!f || f.s.soon || !tl) return home();
  const { s, t } = f;
  view.innerHTML = crumb([HOME, [t.title, "/t/" + t.id], [s.title, "/s/" + s.id], [tl.title, "/tool/" + s.id + "/" + tl.id]]) + `<div id="toolbox"></div>`;
  tl.render($("#toolbox"), s);
}
const figHTML = (f, L) => `<figure class="fig ${f.tall ? "tall" : ""}"><img src="${L.images[f.img]}" alt=""><figcaption class="cap">${biStudy(f.caption)}</figcaption></figure>`;
const figsHTML = (a, L, pair) => !a || !a.length ? "" : (pair || a.length > 1) ? `<div class="pair">${a.map(f => figHTML(f, L)).join("")}</div>` : figHTML(a[0], L);
const timelineHTML = t => !t ? "" : `<div class="tl">${t.eons.map(e => `<div style="width:${e.width};background:${e.color}${e.color === "#f59e0b" ? ";color:#12232e" : ""}">${e.name}</div>`).join("")}</div>${t.caption ? `<div class="cap">${biStudy(t.caption)}</div>` : ""}`;

function sectionHTML(s, i, L) {
  return `<section id="${s.id}" data-t="${s.title.en}"><h2><small>Section ${L.number}.${i + 1}</small>${biStudy(s.title)}</h2>
    ${figsHTML(s.figures, L, s.figuresLayout === "pair")}${timelineHTML(s.timeline)}
    <ul>${s.points.map(p => `<li>${biStudy(p)}</li>`).join("")}</ul>${figsHTML(s.figuresAfter, L)}
    ${s.key ? `<div class="key">${biStudy(s.key)}</div>` : ""}
    ${s.examFocus && s.examFocus.length ? `<div class="mem"><h3>${bi({ en: "Exam focus: memorize this", ar: "ركّز واحفظ ده" })}</h3><ul>${s.examFocus.map(p => `<li>${biStudy(p)}</li>`).join("")}</ul></div>` : ""}
    <button class="done" data-s="${s.id}"></button></section>`;
}

function lecUI(L) {
  const d = Store.get("done:" + L.id, []), n = L.sections.length;
  $$(".done").forEach(b => { const y = d.includes(b.dataset.s); b.classList.toggle("y", y); b.textContent = y ? "Studied - tap to undo" : "Mark this section as studied"; });
  $("#lp").textContent = d.length + " / " + n + " studied";
  const b = Store.get("best:" + L.id, null); $("#bestl").textContent = b == null ? "" : "Your best score: " + b + "%";
}

async function lectureView(sid, lid) {
  const f = findSubject(sid); if (!f || f.s.soon) return home();
  const { s, t } = f;
  view.innerHTML = `<div class="empty">Loading...</div>`;
  await loadScripts(s.files);
  const L = (window.LECTURES || {})[lid]; if (!L) return subjectView(sid);
  const q = ((window.QUESTIONS || {})[lid] || []).length;
  view.innerHTML = `<div class="lhero" style="background-image:linear-gradient(rgba(8,37,69,.74),rgba(8,37,69,.86)),url(${L.images[L.cover]})">
    <button class="back" data-go="/s/${s.id}">${bi({ en: "All lectures", ar: "كل المحاضرات" })}</button>
    <h1>${bi({ en: `Lecture ${L.number}: ${L.title.en}`, ar: `المحاضرة ${L.number}: ${L.title.ar}` })}</h1>
    <div class="chips"><span>${L.sections.length} sections</span><span>${q} exam questions</span><span id="lp"></span></div>
    <div class="toc">${L.sections.map((x, i) => `<button data-g="${x.id}">${i + 1}. ${x.title.en}</button>`).join("")}</div></div>
    <main><div class="tip">${bi({ en: "Tip: tap any underlined English word to see its Arabic meaning.", ar: "نصيحة: دوس على أي كلمة إنجليزي تحتها خط وهتشوف معناها بالعربي." })}</div>
    <div class="stage" id="stage">${L.sections.map((x, i) => sectionHTML(x, i, L)).join("")}</div>
    <div class="snav"><button id="sprev">&#8592; Previous</button><div class="mid"><span id="sct"></span><div class="sbar"><i id="sfill"></i></div></div><button id="snext">Next &#8594;</button></div>
    <div class="go"><p>${bi({ en: "Ready to test yourself?", ar: "جاهز تختبر نفسك؟" })}</p><small id="bestl"></small>
      ${q >= 100 ? `<div class="exam-cards">${Array.from({ length: 3 }, (_, i) => {
        const base = Math.floor(q / 3), rem = q % 3;
        const start = i * base + Math.min(i, rem), size = base + (i < rem ? 1 : 0);
        const names = [{ en: "Exam 1", ar: "الامتحان الأول" }, { en: "Exam 2", ar: "الامتحان الثاني" }, { en: "Exam 3", ar: "الامتحان الثالث" }];
        return `<button class="exam-card" data-exam="${i}"><strong>${bi(names[i])}</strong><span>${bi({ en: `${size} questions`, ar: `${size} سؤال` })}</span><small>${bi({ en: `Questions ${start + 1}–${start + size}`, ar: `الأسئلة ${start + 1}–${start + size}` })}</small></button>`;
      }).join("")}</div>` : `<button class="btn main" id="start">${bi({ en: `Start the ${q}-Question Exam`, ar: `ابدأ امتحان ${q} سؤال` })}</button>`}</div></main>`;
  const secs = $$("#stage section"), SK = "slide:" + L.id;
  let cur = Math.min(secs.length - 1, Math.max(0, +Store.get(SK, 0) || 0));
  const show = (i, sc) => {
    cur = Math.max(0, Math.min(secs.length - 1, i));
    secs.forEach((x, k) => { x.classList.toggle("on", k === cur); if (k === cur) x.classList.add("in"); });
    $("#sct").textContent = "Slide " + (cur + 1) + " / " + secs.length + " - " + secs[cur].dataset.t;
    $("#sfill").style.width = (cur + 1) / secs.length * 100 + "%";
    $("#sprev").disabled = cur === 0;
    $("#snext").innerHTML = cur === secs.length - 1 ? "Start exam &#8595;" : "Next &#8594;";
    Store.set(SK, cur);
    if (sc) $("#stage").scrollIntoView({ behavior: "smooth", block: "start" });
  };
  $$(".toc button").forEach(b => b.onclick = () => show(secs.findIndex(x => x.id === b.dataset.g), true));
  $("#sprev").onclick = () => show(cur - 1, true);
  $("#snext").onclick = () => { if (cur === secs.length - 1) $(".go").scrollIntoView({ behavior: "smooth" }); else show(cur + 1, true); };
  let tx = null;
  $("#stage").addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
  $("#stage").addEventListener("touchend", e => { if (tx == null) return; const d = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(d) > 70) show(cur + (d < 0 ? 1 : -1), true); });
  window.onkeydown = e => { if (!$("#stage") || /INPUT|TEXTAREA/.test(e.target.tagName)) return; if (e.key === "ArrowRight") show(cur + 1, true); if (e.key === "ArrowLeft") show(cur - 1, true); };
  show(cur, false);
  $$(".done").forEach(b => b.onclick = () => {
    let d = Store.get("done:" + L.id, []); d = d.includes(b.dataset.s) ? d.filter(x => x != b.dataset.s) : d.concat(b.dataset.s);
    Store.set("done:" + L.id, d); lecUI(L);
  });
  if ($("#start")) $("#start").onclick = () => Exam.start(L, () => lecUI(L));
  $$(".exam-card").forEach(b => b.onclick = () => Exam.start(L, () => lecUI(L), +b.dataset.exam));
  Tr.set(L.glossary); Tr.wrap(view); lecUI(L);
  Exam.restore(L, () => lecUI(L));
  if (window.EF) EF.lecture(L, s);
}

async function route() {
  const firstRoute = !hasStartedRoute;
  hasStartedRoute = true;

  const savedState = firstRoute ? readAppState() : null;
  const currentHash = location.hash || "#/";
  const restoreScroll = !!(
    savedState && savedState.hash === currentHash
  );

  const p = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);

  document.body.classList.toggle("lecv", p[0] === "l");
  $("#rp").style.width = "0";
  Tr.hide();

  if (!restoreScroll) scrollTo(0, 0);

  try {
    // صفحة حساب المستخدم (accounts.js)
    if (p[0] === "me") return window.Accounts ? Accounts.render() : (view.innerHTML = `<div class="empty">Loading...</div>`);

    // Study Boost routes (dashboard, flashcards, night-before, mistakes)
    if (window.EF && EF.handles(p[0])) return await EF.render(p);

    if (p[0] === "t") return trackView(p[1]);
    if (p[0] === "s") return await subjectView(p[1]);
    if (p[0] === "tool") return await toolView(p[1], p[2]);
    if (p[0] === "l") return await lectureView(p[1], p[2]);

    home();
    if (window.EF) EF.home();
  } catch (e) {
    view.innerHTML = `<div class="empty"><h3>Something went wrong</h3><p>${e.message}</p><button class="btn" data-go="/">Home</button></div>`;
  } finally {
    if (restoreScroll) {
      const y = Math.max(0, Number(savedState.scrollY) || 0);
      const restore = () => window.scrollTo(0, y);

      requestAnimationFrame(() => {
        restore();
        requestAnimationFrame(restore);
      });

      setTimeout(restore, 350);
      setTimeout(restore, 800);
    }

    saveAppState();
  }
}
UI.init(); Tr.init(); Exam.init();
restoreLastRoute();
document.addEventListener("click", e => { const g = e.target.closest("[data-go]"); if (g) go(g.dataset.go); });
addEventListener("hashchange", route);
addEventListener("scroll", () => {
  const h = document.documentElement, m = h.scrollHeight - innerHeight;
  $("#rp").style.width = (document.body.classList.contains("lecv") && m > 0 ? scrollY / m * 100 : 0) + "%";
  $("#up").style.display = scrollY > 700 ? "block" : "none";
  if (appStateTimer) clearTimeout(appStateTimer);
  appStateTimer = setTimeout(saveAppState, 180);
});
$("#up").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
route();
