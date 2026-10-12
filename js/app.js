/* js/app.js - الصفحات والتنقل
   #/                  الرئيسية (اختيار: كلية علوم / ثانوية عامة)
   #/t/<track>         مواد التراك
   #/s/<subject>       محاضرات المادة
   #/l/<subject>/<id>  صفحة المحاضرة + الامتحان               */
const view = $("#view");
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
}
async function toolView(sid, tid) {
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
    <main><div class="tip">${bi({ en: "Tip: press and hold any underlined English word to see its Arabic meaning.", ar: "نصيحة: دوس مطوّل على أي كلمة إنجليزي تحتها خط وهتشوف معناها بالعربي." })}</div>
    ${L.sections.map((x, i) => sectionHTML(x, i, L)).join("")}
    <div class="go"><p>${bi({ en: "Ready to test yourself?", ar: "جاهز تختبر نفسك؟" })}</p><small id="bestl"></small>
      ${q >= 100 ? `<div class="exam-cards">${Array.from({ length: 3 }, (_, i) => {
        const base = Math.floor(q / 3), rem = q % 3;
        const start = i * base + Math.min(i, rem), size = base + (i < rem ? 1 : 0);
        const names = [{ en: "Exam 1", ar: "الامتحان الأول" }, { en: "Exam 2", ar: "الامتحان الثاني" }, { en: "Exam 3", ar: "الامتحان الثالث" }];
        return `<button class="exam-card" data-exam="${i}"><strong>${bi(names[i])}</strong><span>${bi({ en: `${size} questions`, ar: `${size} سؤال` })}</span><small>${bi({ en: `Questions ${start + 1}–${start + size}`, ar: `الأسئلة ${start + 1}–${start + size}` })}</small></button>`;
      }).join("")}</div>` : `<button class="btn main" id="start">${bi({ en: `Start the ${q}-Question Exam`, ar: `ابدأ امتحان ${q} سؤال` })}</button>`}</div></main>`;
  $$(".toc button").forEach(b => b.onclick = () => document.getElementById(b.dataset.g).scrollIntoView({ behavior: "smooth", block: "start" }));
  $$(".done").forEach(b => b.onclick = () => {
    let d = Store.get("done:" + L.id, []); d = d.includes(b.dataset.s) ? d.filter(x => x != b.dataset.s) : d.concat(b.dataset.s);
    Store.set("done:" + L.id, d); lecUI(L);
  });
  if ($("#start")) $("#start").onclick = () => Exam.start(L, () => lecUI(L));
  $$(".exam-card").forEach(b => b.onclick = () => Exam.start(L, () => lecUI(L), +b.dataset.exam));
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .06 });
  $$("section").forEach(x => io.observe(x));
  Tr.set(L.glossary); Tr.wrap(view); lecUI(L);
}

async function route() {
  const p = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  document.body.classList.toggle("lecv", p[0] === "l");
  $("#rp").style.width = "0"; Tr.hide(); scrollTo(0, 0);
  try {
    if (p[0] === "t") return trackView(p[1]);
    if (p[0] === "s") return await subjectView(p[1]);
    if (p[0] === "tool") return await toolView(p[1], p[2]);
    if (p[0] === "l") return await lectureView(p[1], p[2]);
    home();
  } catch (e) { view.innerHTML = `<div class="empty"><h3>Something went wrong</h3><p>${e.message}</p><button class="btn" data-go="/">Home</button></div>`; }
}

/* ---------- تشغيل ---------- */
UI.init(); Tr.init(); Exam.init();
document.addEventListener("click", e => { const g = e.target.closest("[data-go]"); if (g) go(g.dataset.go); });
addEventListener("hashchange", route);
addEventListener("scroll", () => {
  const h = document.documentElement, m = h.scrollHeight - innerHeight;
  $("#rp").style.width = (document.body.classList.contains("lecv") && m > 0 ? scrollY / m * 100 : 0) + "%";
  $("#up").style.display = scrollY > 700 ? "block" : "none";
});
$("#up").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
route();
