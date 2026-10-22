/* js/utils.js - أدوات مشتركة: اختصارات DOM، التخزين، اللغة، حجم الخط، تحميل الملفات */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* تخزين في المتصفح (الدرجات والتقدم واللغة) */
const Store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* نص ثنائي اللغة {en, ar} */
const bi = o => `<span class="en">${o.en}</span><span class="ar">${o.ar}</span>`;
const biStudy = o => `<span class="study-bi"><span class="en">${o.en}</span><i aria-hidden="true"></i><span class="ar">${o.ar}</span></span>`;

/* اللغة وحجم الخط */
const UI = {
  fs: 18,
  lang(l) {
    document.body.dataset.l = l;
    $$("#lg button").forEach(b => b.classList.toggle("on", b.dataset.l === l));
    Store.set("lang", l);
  },
  font(d) {
    this.fs = Math.min(23, Math.max(15, this.fs + d));
    document.documentElement.style.setProperty("--fs", this.fs + "px");
    Store.set("fs", this.fs);
  },
  /* الوضع الداكن: القيمة المحفوظة "dark" أو "light"، ولو مفيش بنتبع إعداد الجهاز */
  theme: {
    isDark() { return document.documentElement.dataset.theme === "dark"; },
    apply(d) {
      document.documentElement.dataset.theme = d ? "dark" : "light";
      const m = $('meta[name="theme-color"]'); if (m) m.content = d ? "#0e1621" : "#12355b";
      const b = $("#themeToggle"); if (b) b.setAttribute("aria-pressed", d ? "true" : "false");
    },
    init() {
      this.apply(this.isDark());
      const b = $("#themeToggle");
      if (b) b.onclick = () => { const d = !this.isDark(); this.apply(d); Store.set("theme", d ? "dark" : "light"); };
      try {
        matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
          if (Store.get("theme", null) == null) this.apply(e.matches);
        });
      } catch (e) {}
    }
  },
  init() {
    this.theme.init();
    this.fs = Store.get("fs", 18); this.font(0);
    const savedLang = Store.get("lang", null);
    const langVersion = Store.get("lang-mode-version", 0);
    this.lang(langVersion >= 2 && ["en", "ar", "both"].includes(savedLang) ? savedLang : "ar");
    Store.set("lang-mode-version", 2);
    $$("#lg button").forEach(b => b.onclick = () => this.lang(b.dataset.l));
    $$("#fz button").forEach(b => b.onclick = () => this.font(+b.dataset.d));
  }
};

/* تحميل ملفات JS بالاسم (مرة واحدة بس لكل ملف) */
const _loaded = {};
function loadScripts(files) {
  return Promise.all((files || []).map(f => _loaded[f] || (_loaded[f] = new Promise((ok, no) => {
    const s = document.createElement("script");
    s.src = f; s.onload = ok; s.onerror = () => no(new Error("Cannot load " + f));
    document.head.append(s);
  }))));
}
