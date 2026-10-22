/* data/Phys/converter.js - أداة "محوّل الوحدات": اختار النوع ← الوحدة والرقم ← الوحدة المطلوبة ← جاري الحساب ← النتيجة */
(function () {
  const u = (en, ar, sym, k) => ({ en, ar, sym, k });
  /* بادئات SI من فيمتو (10^-15) لبيتا (10^15) */
  const PF = [
    ["femto", "فيمتو", "f", 1e-15], ["pico", "بيكو", "p", 1e-12], ["nano", "نانو", "n", 1e-9],
    ["micro", "ميكرو", "µ", 1e-6], ["milli", "مللي", "m", 1e-3], ["centi", "سنتي", "c", 1e-2],
    ["deci", "ديسي", "d", 1e-1], ["", "", "", 1], ["deca", "ديكا", "da", 10], ["hecto", "هكتو", "h", 100],
    ["kilo", "كيلو", "k", 1e3], ["mega", "ميجا", "M", 1e6], ["giga", "جيجا", "G", 1e9], ["tera", "تيرا", "T", 1e12],
    ["peta", "بيتا", "P", 1e15]
  ];
  /* يولّد الوحدة بكل البادئات: mk("meter","متر","m",1) ← fm … Tm ، ومن/إلى بادئة معينة عن طريق lo / hi */
  const mk = (en, ar, sym, k, lo = 0, hi = PF.length - 1) =>
    PF.slice(lo, hi + 1).map(([pe, pa, ps, f]) =>
      u(pe + en, pa ? pa + " " + ar : ar, ps + sym, k * f));

  const CATS = [
    { id: "pref", sy: "c m k", en: "SI Prefixes", ar: "بادئات SI (سنتي، ميلي...)", units:
      PF.map(([pe, pa, ps, f]) => u(pe || "base unit", pa || "الوحدة الأساسية", ps || "unit", f)) },
    { id: "pow", sy: "10<sup>n</sup>", en: "Powers of ten", ar: "قوى العشرة (10⁻¹⁵ → 10¹⁵)", units:
      Array.from({ length: 31 }, (_, i) => {
        const n = i - 15, p = PF.find(x => Math.round(Math.log10(x[3])) === n);
        return u(p && p[0] ? p[0] : "10^" + n, p && p[1] ? p[1] : "10 أس " + n,
          "10<sup>" + n + "</sup>", Math.pow(10, n));
      }) },
    { id: "len", sy: "m", en: "Length", ar: "الطول", units: [
      ...mk("meter", "متر", "m", 1),
      u("angstrom", "أنجستروم", "Å", 1e-10), u("inch", "بوصة", "in", 0.0254),
      u("foot", "قدم", "ft", 0.3048), u("mile", "ميل", "mi", 1609.344),
      u("light-year", "سنة ضوئية", "ly", 9.4607304725808e15)] },
    { id: "mass", sy: "kg", en: "Mass", ar: "الكتلة", units: [
      ...mk("gram", "جرام", "g", 1e-3),
      u("tonne", "طن", "t", 1e3), u("atomic mass unit", "وحدة كتل ذرية", "u", 1.66053906660e-27),
      u("pound", "رطل", "lb", 0.45359237), u("ounce", "أونصة", "oz", 0.028349523125)] },
    { id: "time", sy: "s", en: "Time", ar: "الزمن", units: [
      ...mk("second", "ثانية", "s", 1, 0, 7),
      u("minute", "دقيقة", "min", 60), u("hour", "ساعة", "h", 3600),
      u("day", "يوم", "day", 86400), u("year", "سنة", "yr", 31557600)] },
    { id: "speed", sy: "m/s", en: "Speed", ar: "السرعة", units: [
      u("meter / second", "متر / ثانية", "m/s", 1), u("kilometer / hour", "كيلو متر / ساعة", "km/h", 1000 / 3600),
      u("centimeter / second", "سنتي متر / ثانية", "cm/s", 1e-2), u("millimeter / second", "مللي متر / ثانية", "mm/s", 1e-3),
      u("foot / second", "قدم / ثانية", "ft/s", 0.3048), u("mile / hour", "ميل / ساعة", "mph", 0.44704),
      u("knot", "عقدة", "kn", 1852 / 3600), u("speed of light", "سرعة الضوء", "c", 299792458)] },
    { id: "force", sy: "N", en: "Force", ar: "القوة", units: [
      ...mk("newton", "نيوتن", "N", 1),
      u("dyne", "داين", "dyne", 1e-5), u("kilogram-force", "كيلو جرام قوة", "kgf", 9.80665),
      u("pound-force", "رطل قوة", "lbf", 4.4482216152605)] },
    { id: "press", sy: "Pa", en: "Pressure", ar: "الضغط", units: [
      ...mk("pascal", "باسكال", "Pa", 1),
      u("bar", "بار", "bar", 1e5), u("atmosphere", "ضغط جوي", "atm", 101325),
      u("mmHg", "مم زئبق", "mmHg", 133.322387415), u("psi", "رطل / بوصة²", "psi", 6894.757293168)] },
    { id: "energy", sy: "J", en: "Energy", ar: "الطاقة والشغل", units: [
      ...mk("joule", "جول", "J", 1),
      u("electronvolt", "إلكترون فولت", "eV", 1.602176634e-19),
      ...mk("electronvolt", "إلكترون فولت", "eV", 1.602176634e-19, 10, 13),
      u("erg", "إرج", "erg", 1e-7), u("calorie", "سعر حراري", "cal", 4.184),
      u("kilocalorie", "كيلو سعر", "kcal", 4184), u("kilowatt-hour", "كيلو وات ساعة", "kWh", 3.6e6)] },
    { id: "power", sy: "W", en: "Power", ar: "القدرة", units: [
      ...mk("watt", "وات", "W", 1),
      u("horsepower", "حصان", "hp", 745.69987158227)] },
    { id: "angle", sy: "°", en: "Angle", ar: "الزاوية", units: [
      u("degree", "درجة", "°", Math.PI / 180), u("radian", "راديان", "rad", 1),
      u("milliradian", "مللي راديان", "mrad", 1e-3), u("arcminute", "دقيقة قوسية", "′", Math.PI / 10800),
      u("arcsecond", "ثانية قوسية", "″", Math.PI / 648000), u("revolution", "دورة", "rev", 2 * Math.PI)] },
    { id: "temp", sy: "°C", en: "Temperature", ar: "درجة الحرارة", units: [
      { en: "Celsius", ar: "سيلزيوس", sym: "°C", t: v => v + 273.15, b: k => k - 273.15 },
      { en: "Kelvin", ar: "كلفن", sym: "K", t: v => v, b: k => k },
      { en: "Fahrenheit", ar: "فهرنهايت", sym: "°F", t: v => (v - 32) * 5 / 9 + 273.15, b: k => (k - 273.15) * 9 / 5 + 32 }] }
  ];

  const convert = (v, a, b) => {
    const base = a.t ? a.t(v) : v * a.k;
    return b.b ? b.b(base) : base / b.k;
  };
  const fmt = x => {
    if (x === 0) return "0";
    const a = Math.abs(x);
    if (a >= 1e-4 && a < 1e9) return String(parseFloat(x.toPrecision(10)));
    const [m, e] = x.toExponential(6).split("e");
    return parseFloat(m) + " × 10<sup>" + parseInt(e, 10) + "</sup>";
  };
  const plain = h => h.replace(/<sup>(.*?)<\/sup>/g, "^$1").replace(/<[^>]+>/g, "");
  const parseNum = s => {
    const t = String(s).trim()
      .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
      .replace(/[٫,]/g, ".").replace(/[−–]/g, "-");
    if (!t || !/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return NaN;
    return Number(t);
  };
  const CHK = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';

  const CSS = `
.cv-wrap{max-width:1000px;margin:10px auto 44px;padding:0 16px;--navy:#12355b;--teal:#0e8a8a;--amb:#f59e0b;--bd:#e1e7ed;--mu:#5a6b78;--soft:#f3f6f9}
.cv-wrap .en,.cv-wrap .ar{text-align:inherit;direction:inherit;font-size:1em;line-height:inherit;margin:0}
.cv-wrap .ar{direction:rtl;font-family:Cairo,Tahoma,sans-serif}
.cv-wrap .cv-ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}
.cv-wrap .cv-steps{display:flex;align-items:center;justify-content:center;gap:8px;margin:10px 0 24px;flex-wrap:wrap;line-height:1.4}
.cv-wrap .cv-dot{display:flex;align-items:center;gap:8px;color:var(--mu);font-size:.8em;font-weight:600}
.cv-wrap .cv-dot>span{display:block}
.cv-wrap .cv-dot i{width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font:700 .9em Inter,sans-serif;font-style:normal;background:#fff;border:2px solid var(--bd);color:var(--mu);transition:.3s;flex:none}
.cv-wrap .cv-dot.cur{color:var(--navy)}.cv-wrap .cv-dot.cur i{background:var(--navy);border-color:var(--navy);color:#fff}
.cv-wrap .cv-dot.fin i{background:var(--teal);border-color:var(--teal);color:#fff}
.cv-wrap .cv-line{width:24px;height:2px;background:var(--bd);flex:none}
.cv-wrap .cv-pane{animation:up .4s both}
.cv-wrap .cv-q{font-size:1.1em;font-weight:800;color:var(--navy);text-align:center;margin:0 0 18px;line-height:1.6}
.cv-wrap .cv-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px}
.cv-wrap .cv-chip{display:inline-flex;gap:8px;align-items:center;padding:3px 16px;border-radius:99px;background:#eaf3f3;color:#0b6666;font-size:.8em;font-weight:700;line-height:1.7}
.cv-wrap .cv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(140px,100%),1fr));gap:14px}
.cv-wrap .cv-card{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:96px;padding:14px 8px;text-align:center;
  background:#fff;color:var(--ink,#12232e);border:1.5px solid var(--bd);border-top:4px solid var(--teal);border-radius:16px;cursor:pointer;font-family:inherit;line-height:1.5;
  box-shadow:0 8px 22px rgba(18,53,91,.08);animation:up .5s both;animation-delay:calc(var(--i) * 35ms);transition:transform .2s,box-shadow .2s,background .2s,border-color .2s}
.cv-wrap .cv-card:hover{transform:translateY(-4px);box-shadow:0 14px 28px rgba(18,53,91,.14)}
.cv-wrap .cv-card .sy{font:800 1.35em/1.3 Inter,sans-serif;color:var(--navy)}
.cv-wrap .cv-card .nm{font-size:.78em;color:var(--mu);display:block;width:100%}
.cv-wrap .cv-card.sel{background:var(--navy);border-color:var(--navy);border-top-color:var(--amb)}
.cv-wrap .cv-card.sel .sy,.cv-wrap .cv-card.sel .nm,.cv-wrap .cv-card.sel .ar{color:#fff}
.cv-wrap .cv-card.dim{opacity:.35;pointer-events:none;box-shadow:none}
.cv-wrap .cv-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;margin-top:22px}
.cv-wrap .cv-row input{flex:1 1 220px;max-width:340px;padding:12px 18px;border-radius:14px;border:2px solid var(--bd);background:#fff;color:var(--ink,#12232e);
  font:800 1.2em Inter,sans-serif;text-align:center;direction:ltr;transition:.2s}
.cv-wrap .cv-row input:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 4px rgba(14,138,138,.15)}
.cv-wrap .cv-row input.bad{border-color:#c0262d}
.cv-wrap .cv-btn:disabled{opacity:.4;cursor:default;transform:none;box-shadow:none}
.cv-wrap .cv-btn .en,.cv-wrap .cv-btn .ar{display:inline}
body[data-l=ar] .cv-wrap .cv-btn .en,body[data-l=en] .cv-wrap .cv-btn .ar{display:none}
.cv-wrap .cv-calc{text-align:center;padding:36px 10px;background:#fff;border:1.5px solid var(--bd);border-top:4px solid var(--teal);border-radius:16px;box-shadow:0 8px 22px rgba(18,53,91,.08)}
.cv-wrap .cv-ring{width:56px;height:56px;margin:0 auto 16px;border-radius:50%;border:5px solid var(--bd);border-top-color:var(--teal);animation:cvSpin .8s linear infinite}
@keyframes cvSpin{to{transform:rotate(360deg)}}
.cv-wrap .cv-calc h3{margin:0;color:var(--navy);font-size:1.15em}
.cv-wrap .cv-calc h3 .en,.cv-wrap .cv-calc h3 .ar{display:inline}
body[data-l=ar] .cv-wrap .cv-calc h3 .en,body[data-l=en] .cv-wrap .cv-calc h3 .ar{display:none}
.cv-wrap .cv-dots span{display:inline-block;animation:cvDot 1.2s infinite}
.cv-wrap .cv-dots span:nth-child(2){animation-delay:.2s}.cv-wrap .cv-dots span:nth-child(3){animation-delay:.4s}
@keyframes cvDot{0%,80%,100%{opacity:.25}40%{opacity:1}}
.cv-wrap .cv-bar{height:8px;max-width:300px;margin:18px auto 0;border-radius:9px;background:var(--bd);overflow:hidden}
.cv-wrap .cv-bar i{display:block;height:100%;width:100%;background:linear-gradient(90deg,var(--teal),var(--amb));border-radius:9px;transform-origin:left;animation:cvBar 1.4s ease-in-out both}
@keyframes cvBar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.cv-wrap .cv-res{text-align:center;padding:28px 14px;background:#fff;border:1.5px solid var(--bd);border-top:5px solid var(--teal);border-radius:18px;box-shadow:0 8px 28px rgba(18,53,91,.1);animation:up .5s both}
.cv-wrap .cv-tick{width:46px;height:46px;border-radius:50%;background:var(--teal);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.3em;margin:0 auto 12px}
.cv-wrap .cv-eq{color:var(--mu);font-size:1.05em}
.cv-wrap .cv-big{font:800 2em/1.4 Inter,sans-serif;color:var(--navy);margin:8px 0;word-break:break-all}
.cv-wrap .cv-note{color:var(--mu);font-size:.88em}`;

  window.TOOLS = window.TOOLS || {};
  TOOLS.converter = {
    id: "converter", icon: "SI",
    title: { en: "Unit Converter", ar: "محوّل الوحدات" },
    desc: { en: "Pick a unit, type a number, choose the target.", ar: "اختار الوحدة، اكتب الرقم، واختار الوحدة المطلوبة." },
    render(box) {
      if (!document.getElementById("cv-style")) {
        const st = document.createElement("style"); st.id = "cv-style"; st.textContent = CSS; document.head.append(st);
      }
      const S = { cat: null, from: null, to: null, val: "" };
      let tk = 0;
      box.innerHTML = `<div class="pagehead"><h2>${bi(this.title)}</h2><p>${bi(this.desc)}</p></div>
        <div class="cv-wrap"><div class="cv-steps" id="cvs"></div><div id="cvb"></div></div>`;
      const labels = [{ en: "Type", ar: "النوع" }, { en: "From", ar: "من" }, { en: "To", ar: "إلى" }, { en: "Result", ar: "النتيجة" }];
      const shell = (n, html) => {
        tk++;
        $("#cvs").innerHTML = labels.map((l, i) =>
          (i ? '<span class="cv-line"></span>' : "") +
          `<div class="cv-dot ${i === n ? "cur" : i < n ? "fin" : ""}"><i>${i < n ? CHK : i + 1}</i><span>${bi(l)}</span></div>`).join("");
        $("#cvb").innerHTML = `<div class="cv-pane">${html}</div>`;
      };
      const chips = () => {
        let h = "";
        if (S.cat) h += `<span class="cv-chip">${bi(S.cat)}</span>`;
        if (S.from != null) h += `<span class="cv-chip"><span class="cv-ltr">${S.val} ${S.cat.units[S.from].sym}</span></span>`;
        return h ? `<div class="cv-chips">${h}</div>` : "";
      };
      const unitCards = skip => S.cat.units.map((x, i) =>
        `<button type="button" class="cv-card ${i === skip ? "dim" : ""}" style="--i:${Math.min(i, 18)}" data-i="${i}"><span class="sy cv-ltr">${x.sym}</span><span class="nm">${bi(x)}</span></button>`).join("");

      const stepCat = () => {
        Object.assign(S, { cat: null, from: null, to: null, val: "" });
        shell(0, `<div class="cv-q">${bi({ en: "What do you want to convert?", ar: "عايز تحوّل إيه؟" })}</div>
          <div class="cv-grid">${CATS.map((c, i) => `<button type="button" class="cv-card" style="--i:${Math.min(i, 18)}" data-i="${i}"><span class="sy cv-ltr">${c.sy}</span><span class="nm">${bi(c)}</span></button>`).join("")}</div>`);
        $$("#cvb .cv-card").forEach(b => b.onclick = () => {
          S.cat = CATS[+b.dataset.i]; b.classList.add("sel");
          setTimeout(stepFrom, 260);
        });
      };

      const stepFrom = () => {
        S.from = null;
        shell(1, `${chips()}<div class="cv-q">${bi({ en: "Choose your unit, then type the amount", ar: "اختار الوحدة اللي معاك، واكتب الكمية" })}</div>
          <div class="cv-grid">${unitCards(-1)}</div>
          <div class="cv-row"><input id="cvv" inputmode="decimal" autocomplete="off" placeholder="0" value="${S.val}">
            <button type="button" class="btn cv-btn" id="cvback">${bi({ en: "Back", ar: "رجوع" })}</button>
            <button type="button" class="btn main cv-btn" id="cvnext" disabled>${bi({ en: "Next", ar: "التالي" })}</button></div>`);
        const inp = $("#cvv"), nx = $("#cvnext");
        const check = () => { nx.disabled = !(S.from != null && !isNaN(parseNum(inp.value))); inp.classList.remove("bad"); };
        $$("#cvb .cv-card").forEach(b => b.onclick = () => {
          S.from = +b.dataset.i;
          $$("#cvb .cv-card").forEach(x => x.classList.toggle("sel", x === b));
          check(); inp.focus();
        });
        inp.oninput = check;
        inp.onkeydown = e => { if (e.key === "Enter") nx.click(); };
        $("#cvback").onclick = stepCat;
        nx.onclick = () => {
          const v = parseNum(inp.value);
          if (isNaN(v)) { inp.classList.add("bad"); return; }
          S.val = String(inp.value).trim(); stepTo();
        };
      };

      const stepTo = () => {
        shell(2, `${chips()}<div class="cv-q">${bi({ en: "Convert it to", ar: "عايز تحوّلها لإيه؟" })}</div>
          <div class="cv-grid">${unitCards(S.from)}</div>
          <div class="cv-row"><button type="button" class="btn cv-btn" id="cvback">${bi({ en: "Back", ar: "رجوع" })}</button></div>`);
        $$("#cvb .cv-card").forEach(b => b.onclick = () => {
          S.to = +b.dataset.i; b.classList.add("sel");
          setTimeout(stepCalc, 260);
        });
        $("#cvback").onclick = stepFrom;
      };

      const stepCalc = () => {
        shell(3, `${chips()}<div class="cv-calc"><div class="cv-ring"></div>
          <h3>${bi({ en: "Calculating", ar: "جاري الحساب" })}<span class="cv-dots"><span>.</span><span>.</span><span>.</span></span></h3>
          <div class="cv-bar"><i></i></div></div>`);
        const my = tk;
        setTimeout(() => { if (my === tk) stepResult(); }, 1500);
      };

      const stepResult = () => {
        const a = S.cat.units[S.from], b = S.cat.units[S.to], v = parseNum(S.val);
        const r = convert(v, a, b), rs = fmt(r), vs = fmt(v);
        const one = fmt(convert(1, a, b));
        shell(3, `<div class="cv-res"><div class="cv-tick">${CHK}</div>
          <div class="cv-eq cv-ltr">${vs} ${a.sym} =</div>
          <div class="cv-big cv-ltr">${rs} ${b.sym}</div>
          <div class="cv-note cv-ltr">1 ${a.sym} = ${one} ${b.sym}</div></div>
          <div class="cv-row">
            <button type="button" class="btn cv-btn" id="cvsw">${bi({ en: "Swap", ar: "اعكس" })}</button>
            <button type="button" class="btn cv-btn" id="cvcp">${bi({ en: "Copy", ar: "نسخ" })}</button>
            <button type="button" class="btn main cv-btn" id="cvagain">${bi({ en: "New conversion", ar: "تحويل جديد" })}</button></div>`);
        const txt = plain(rs).replace(" × 10^", "e");
        $("#cvagain").onclick = stepCat;
        $("#cvsw").onclick = () => { const t = S.from; S.from = S.to; S.to = t; S.val = txt; stepCalc(); };
        $("#cvcp").onclick = e => {
          navigator.clipboard && navigator.clipboard.writeText(txt);
          e.currentTarget.innerHTML = bi({ en: "Copied", ar: "تم النسخ" });
        };
      };

      stepCat();
    }
  };
})();
