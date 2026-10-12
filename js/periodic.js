/* js/periodic.js */
window.TOOLS = window.TOOLS || {};
(() => {
  const E = `H|Hydrogen|هيدروجين|1.008
He|Helium|هيليوم|4.0026
Li|Lithium|ليثيوم|6.94
Be|Beryllium|بريليوم|9.0122
B|Boron|بورون|10.81
C|Carbon|كربون|12.011
N|Nitrogen|نيتروجين|14.007
O|Oxygen|أكسجين|15.999
F|Fluorine|فلور|18.998
Ne|Neon|نيون|20.18
Na|Sodium|صوديوم|22.99
Mg|Magnesium|ماغنيسيوم|24.305
Al|Aluminium|ألومنيوم|26.982
Si|Silicon|سيليكون|28.085
P|Phosphorus|فوسفور|30.974
S|Sulfur|كبريت|32.06
Cl|Chlorine|كلور|35.45
Ar|Argon|أرجون|39.948
K|Potassium|بوتاسيوم|39.098
Ca|Calcium|كالسيوم|40.078
Sc|Scandium|سكانديوم|44.956
Ti|Titanium|تيتانيوم|47.867
V|Vanadium|فاناديوم|50.942
Cr|Chromium|كروم|51.996
Mn|Manganese|منجنيز|54.938
Fe|Iron|حديد|55.845
Co|Cobalt|كوبالت|58.933
Ni|Nickel|نيكل|58.693
Cu|Copper|نحاس|63.546
Zn|Zinc|خارصين|65.38
Ga|Gallium|جاليوم|69.723
Ge|Germanium|جرمانيوم|72.63
As|Arsenic|زرنيخ|74.922
Se|Selenium|سيلينيوم|78.971
Br|Bromine|بروم|79.904
Kr|Krypton|كريبتون|83.798
Rb|Rubidium|روبيديوم|85.468
Sr|Strontium|سترونشيوم|87.62
Y|Yttrium|إتريوم|88.906
Zr|Zirconium|زركونيوم|91.224
Nb|Niobium|نيوبيوم|92.906
Mo|Molybdenum|موليبدنوم|95.95
Tc|Technetium|تكنيشيوم|98
Ru|Ruthenium|روثينيوم|101.07
Rh|Rhodium|روديوم|102.91
Pd|Palladium|بالاديوم|106.42
Ag|Silver|فضة|107.87
Cd|Cadmium|كادميوم|112.41
In|Indium|إنديوم|114.82
Sn|Tin|قصدير|118.71
Sb|Antimony|أنتيمون|121.76
Te|Tellurium|تيلوريوم|127.6
I|Iodine|يود|126.9
Xe|Xenon|زينون|131.29
Cs|Caesium|سيزيوم|132.91
Ba|Barium|باريوم|137.33
La|Lanthanum|لانثانوم|138.91
Ce|Cerium|سيريوم|140.12
Pr|Praseodymium|براسيوديميوم|140.91
Nd|Neodymium|نيوديميوم|144.24
Pm|Promethium|بروميثيوم|145
Sm|Samarium|ساماريوم|150.36
Eu|Europium|يوروبيوم|151.96
Gd|Gadolinium|جادولينيوم|157.25
Tb|Terbium|تربيوم|158.93
Dy|Dysprosium|ديسبروسيوم|162.5
Ho|Holmium|هولميوم|164.93
Er|Erbium|إربيوم|167.26
Tm|Thulium|ثوليوم|168.93
Yb|Ytterbium|إيتربيوم|173.05
Lu|Lutetium|لوتيتيوم|174.97
Hf|Hafnium|هافنيوم|178.49
Ta|Tantalum|تانتالوم|180.95
W|Tungsten|تنجستن|183.84
Re|Rhenium|رينيوم|186.21
Os|Osmium|أوزميوم|190.23
Ir|Iridium|إيريديوم|192.22
Pt|Platinum|بلاتين|195.08
Au|Gold|ذهب|196.97
Hg|Mercury|زئبق|200.59
Tl|Thallium|ثاليوم|204.38
Pb|Lead|رصاص|207.2
Bi|Bismuth|بزموت|208.98
Po|Polonium|بولونيوم|209
At|Astatine|أستاتين|210
Rn|Radon|رادون|222
Fr|Francium|فرانسيوم|223
Ra|Radium|راديوم|226
Ac|Actinium|أكتينيوم|227
Th|Thorium|ثوريوم|232.04
Pa|Protactinium|بروتكتينيوم|231.04
U|Uranium|يورانيوم|238.03
Np|Neptunium|نبتونيوم|237
Pu|Plutonium|بلوتونيوم|244
Am|Americium|أمريسيوم|243
Cm|Curium|كوريوم|247
Bk|Berkelium|بركيليوم|247
Cf|Californium|كاليفورنيوم|251
Es|Einsteinium|أينشتينيوم|252
Fm|Fermium|فيرميوم|257
Md|Mendelevium|مندليفيوم|258
No|Nobelium|نوبليوم|259
Lr|Lawrencium|لورنسيوم|266
Rf|Rutherfordium|رذرفورديوم|267
Db|Dubnium|دوبنيوم|268
Sg|Seaborgium|سيبورجيوم|269
Bh|Bohrium|بوريوم|270
Hs|Hassium|هاسيوم|277
Mt|Meitnerium|مايتنريوم|278
Ds|Darmstadtium|دارمشتاتيوم|281
Rg|Roentgenium|رونتجينيوم|282
Cn|Copernicium|كوبرنيسيوم|285
Nh|Nihonium|نيهونيوم|286
Fl|Flerovium|فليروفيوم|289
Mc|Moscovium|موسكوفيوم|290
Lv|Livermorium|ليفرموريوم|293
Ts|Tennessine|تينيسين|294
Og|Oganesson|أوغانيسون|294`.split("\n").map((r, i) => { const [sym, en, ar, mass] = r.split("|"); return { z: i + 1, sym, en, ar, mass: +mass }; });

  const CAT = {
    alkali: { en: "Alkali metals", ar: "الفلزات القلوية" },
    alkaline: { en: "Alkaline earth metals", ar: "الفلزات القلوية الأرضية" },
    transition: { en: "Transition metals", ar: "العناصر الانتقالية" },
    post: { en: "Post-transition metals", ar: "فلزات ما بعد الانتقالية" },
    metalloid: { en: "Metalloids", ar: "أشباه الفلزات" },
    nonmetal: { en: "Nonmetals", ar: "اللافلزات" },
    halogen: { en: "Halogens", ar: "الهالوجينات" },
    noble: { en: "Noble gases", ar: "الغازات النبيلة" },
    lanth: { en: "Lanthanides", ar: "اللانثانيدات" },
    actin: { en: "Actinides", ar: "الأكتينيدات" }
  };
  const COL = { alkali: "#dc2626", alkaline: "#f97316", transition: "#2563eb", post: "#0891b2", metalloid: "#65a30d", nonmetal: "#059669", halogen: "#c026d3", noble: "#7c3aed", lanth: "#ca8a04", actin: "#9d174d" };
  const SET = {
    alkali: [3, 11, 19, 37, 55, 87], alkaline: [4, 12, 20, 38, 56, 88], metalloid: [5, 14, 32, 33, 51, 52],
    nonmetal: [1, 6, 7, 8, 15, 16, 34], halogen: [9, 17, 35, 53, 85, 117], noble: [2, 10, 18, 36, 54, 86, 118],
    post: [13, 31, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116]
  };
  const cat = z => {
    for (const k in SET) if (SET[k].includes(z)) return k;
    return z >= 57 && z <= 71 ? "lanth" : z >= 89 && z <= 103 ? "actin" : "transition";
  };
  const typeOf = k => ["nonmetal", "halogen", "noble"].includes(k) ? { en: "Nonmetal", ar: "لافلز" } : k === "metalloid" ? { en: "Metalloid", ar: "شبه فلز" } : { en: "Metal", ar: "فلز" };
  const stateOf = z => [1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86].includes(z) ? { en: "Gas", ar: "غاز" } : [35, 80].includes(z) ? { en: "Liquid", ar: "سائل" } : z >= 104 ? { en: "Unknown (synthetic)", ar: "غير معروفة (مصنّع)" } : { en: "Solid", ar: "صلب" };

  const pos = z => {
    if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
    if (z <= 4) return [2, z - 2]; if (z <= 10) return [2, z + 8];
    if (z <= 12) return [3, z - 10]; if (z <= 18) return [3, z];
    if (z <= 36) return [4, z - 18]; if (z <= 54) return [5, z - 36];
    if (z <= 56) return [6, z - 54]; if (z <= 71) return [9, z - 54];
    if (z <= 86) return [6, z - 68]; if (z <= 88) return [7, z - 86];
    if (z <= 103) return [10, z - 86]; return [7, z - 100];
  };

  const ORB = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"];
  const CAP = { s: 2, p: 6, d: 10, f: 14 };
  const X = (a, b, n = 1) => Array(n).fill([a, b]);
  const EXC = { 24: X("4s", "3d"), 29: X("4s", "3d"), 41: X("5s", "4d"), 42: X("5s", "4d"), 44: X("5s", "4d"), 45: X("5s", "4d"), 46: X("5s", "4d", 2), 47: X("5s", "4d"),
    57: X("4f", "5d"), 58: X("4f", "5d"), 64: X("4f", "5d"), 78: X("6s", "5d"), 79: X("6s", "5d"),
    89: X("5f", "6d"), 90: X("5f", "6d", 2), 91: X("5f", "6d"), 92: X("5f", "6d"), 93: X("5f", "6d"), 96: X("5f", "6d"), 103: X("6d", "7p") };
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", sup = n => String(n).replace(/\d/g, d => SUP[d]);
  const fill = (z, exc = true) => {
    let left = z; const c = {};
    ORB.forEach(o => { const n = Math.min(CAP[o[1]], left); if (n > 0) c[o] = n; left -= n; });
    if (exc) (EXC[z] || []).forEach(([a, b]) => { c[a]--; if (!c[a]) delete c[a]; c[b] = (c[b] || 0) + 1; });
    return c;
  };
  const cfg = z => {
    const c = fill(z), core = [[86, "Rn"], [54, "Xe"], [36, "Kr"], [18, "Ar"], [10, "Ne"], [2, "He"]].find(([n]) => z > n);
    const skip = core ? fill(core[0], false) : {}, key = o => o[0] * 10 + "spdf".indexOf(o[1]);
    return (core ? `[${core[1]}] ` : "") + Object.keys(c).filter(o => !(o in skip)).sort((a, b) => key(a) - key(b)).map(o => o + sup(c[o])).join(" ");
  };

  const CSS = `
.pt-wrap{max-width:1280px;margin:10px auto 70px;padding:0 16px}
.pt-bar{display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin:16px 0}
.pt-bar input{flex:1 1 240px;max-width:340px;padding:11px 18px;border-radius:99px;border:1.5px solid var(--bd);font:500 15px Inter,Cairo,sans-serif;background:#fff;color:var(--ink);outline:none;transition:.2s}
.pt-bar input:focus{border-color:var(--teal);box-shadow:0 0 0 4px rgba(14,138,138,.15)}
.pt-legend{display:flex;gap:7px;flex-wrap:wrap}
.pt-chip{display:inline-flex;align-items:center;gap:7px;border:1.5px solid var(--bd);background:#fff;color:var(--ink);border-radius:99px;padding:5px 12px;font:600 12.5px Inter,Cairo,sans-serif;cursor:pointer;transition:.2s}
.pt-chip i{width:11px;height:11px;border-radius:50%;background:var(--c);flex:none}
.pt-chip:hover{transform:translateY(-2px)}.pt-chip.on{background:var(--navy);color:#fff;border-color:var(--navy)}
.pt-chip .en,.pt-chip .ar{display:inline;color:inherit}
body[data-l=en] .pt-chip .ar,body[data-l=ar] .pt-chip .en{display:none}
.pt-swipe{display:none;color:var(--mu);font-size:.85rem;margin:0 0 8px}
@media(max-width:960px){.pt-swipe{display:block}}
.pt-scroll{overflow-x:auto;border-radius:22px;padding:16px;background:radial-gradient(circle at 20% 0%,#1d4e89,transparent 55%),linear-gradient(145deg,#0b2545,#12355b 60%,#0b3b45);box-shadow:0 18px 44px rgba(11,37,69,.28);-webkit-overflow-scrolling:touch}
.pt-grid{display:grid;grid-template-columns:repeat(18,minmax(46px,1fr));grid-template-rows:repeat(7,auto) 14px repeat(2,auto);gap:5px;min-width:900px;direction:ltr}
.pt-cell{--c:#2563eb;position:relative;border:0;border-radius:9px;padding:3px 2px 4px;aspect-ratio:1/1.08;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;cursor:pointer;background:linear-gradient(160deg,rgba(255,255,255,.28),rgba(0,0,0,.14)),var(--c);box-shadow:0 2px 6px rgba(0,0,0,.25);transition:transform .18s,box-shadow .18s,opacity .25s,filter .25s;animation:ptin .6s backwards;font-family:Inter,Cairo,sans-serif;text-align:center;min-width:0}
.pt-cell:hover,.pt-cell:focus-visible{transform:scale(1.22);z-index:5;box-shadow:0 12px 26px rgba(0,0,0,.45);outline:2px solid #fff}
.pt-cell.dim{opacity:.16;filter:grayscale(.8)}
.pt-z{position:absolute;top:3px;left:5px;font-size:.58rem;opacity:.85;font-weight:600}
.pt-s{font-size:clamp(15px,1.7vw,23px);line-height:1.1}
.pt-n{font-size:.5rem;max-width:100%;overflow:hidden}
.pt-n .en,.pt-n .ar{text-align:center;font-size:inherit;line-height:1.25;margin:0;color:#fff!important;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
body[data-l=both] .pt-n .ar{display:none}
.pt-mark{--c:#ca8a04;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.62rem;font-weight:700;color:#fff;background:var(--c);opacity:.7;aspect-ratio:1/1.08}
.pt-lab{grid-column:1/3;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;color:#9fd8d8;font-size:.62rem;font-weight:700}
.pt-lab .en,.pt-lab .ar{color:#9fd8d8!important;text-align:right;font-size:inherit;line-height:1.3}
.pt-hero{grid-area:1/3/4/13;display:flex;align-items:center;gap:18px;padding:6px 16px;color:#fff;min-width:0}
.pt-hs{--c:#2563eb;flex:none;width:86px;height:86px;border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:2.6rem;font-weight:800;background:linear-gradient(160deg,rgba(255,255,255,.3),rgba(0,0,0,.15)),var(--c);box-shadow:0 8px 22px rgba(0,0,0,.35)}
.pt-hi{min-width:0}.pt-hi h3{margin:0;color:#fff;font-size:1.35rem;line-height:1.3}.pt-hi p{margin:2px 0 6px;color:#9fd8d8;font-size:.9rem;line-height:1.5}
.pt-hi .en,.pt-hi .ar{text-align:left;color:inherit!important;font-size:inherit;line-height:inherit}
.pt-hm{display:flex;gap:12px;flex-wrap:wrap;font-size:.85rem;font-weight:600}.pt-hm span{background:rgba(255,255,255,.12);border-radius:99px;padding:1px 12px}
.pt-hi code{display:block;margin-top:6px;font:600 .95rem Inter,monospace;color:#ffd27a;direction:ltr;text-align:left}
.pt-hero.def .pt-hi h3{font-size:1.9rem}
#ptm{position:fixed;inset:0;z-index:50;background:rgba(8,20,38,.62);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:16px}
#ptm.on{display:flex}
.ptm-card{width:min(520px,100%);max-height:92vh;overflow-y:auto;background:#fff;border-radius:24px;box-shadow:0 30px 70px rgba(0,0,0,.4);animation:ptin .35s backwards}
.ptm-hd{--c:#2563eb;display:flex;gap:16px;align-items:center;padding:22px 56px 22px 22px;color:#fff;position:relative;background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(0,0,0,.2)),var(--c)}
.ptm-sym{flex:none;width:84px;height:84px;border-radius:20px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:800}
.ptm-hd h3{margin:0;font-size:1.4rem;line-height:1.3}.ptm-hd p{margin:2px 0 0;opacity:.92;font-size:.92rem}
.ptm-hd .en,.ptm-hd .ar{color:#fff!important;text-align:left;font-size:inherit;line-height:1.5}
.ptm-x{position:absolute;top:12px;right:14px;border:0;background:rgba(255,255,255,.25);color:#fff;width:34px;height:34px;border-radius:50%;font-size:17px;cursor:pointer}
.ptm-bd{padding:6px 22px 22px}
.ptm-r{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid var(--bd);font-size:.95rem}
.ptm-r>span{color:var(--mu)}.ptm-r b{text-align:right;color:var(--ink)}
.ptm-r .en,.ptm-r .ar{line-height:1.6;font-size:inherit}.ptm-r b .en,.ptm-r b .ar{text-align:right}
@keyframes ptin{from{opacity:0;transform:translateY(10px) scale(.92)}to{opacity:1;transform:none}}`;

  const T = {
    id: "periodic", icon: '<img src="js/img/periodic.png" style="width:100%;height:100%;object-fit:cover;" alt="Chemistry Icon">',
    title: { en: "Periodic Table", ar: "الجدول الدوري" },
    desc: { en: "Interactive table of all 118 elements with search, filters and details.", ar: "جدول تفاعلي لـ 118 عنصر مع بحث وفلترة وتفاصيل كل عنصر." }
  };

  const modal = () => {
    let m = document.getElementById("ptm");
    if (!m) {
      m = document.createElement("div"); m.id = "ptm";
      m.addEventListener("click", ev => { if (ev.target === m || ev.target.closest(".ptm-x")) m.classList.remove("on"); });
      document.addEventListener("keydown", ev => { if (ev.key === "Escape") m.classList.remove("on"); });
      addEventListener("hashchange", () => m.classList.remove("on"));
      document.body.append(m);
    }
    return m;
  };

  const openModal = e => {
    const m = modal(), k = cat(e.z), [r, c] = pos(e.z), f = r >= 9;
    const block = f ? "f" : e.z === 2 || c <= 2 ? "s" : c >= 13 ? "p" : "d";
    const rows = [
      [{ en: "Atomic number", ar: "العدد الذري" }, e.z],
      [{ en: "Atomic mass", ar: "الكتلة الذرية" }, e.mass],
      [{ en: "Protons / Electrons", ar: "بروتونات / إلكترونات" }, e.z + " / " + e.z],
      [{ en: "Neutrons (approx.)", ar: "نيوترونات (تقريبًا)" }, Math.round(e.mass) - e.z],
      [{ en: "Period", ar: "الدورة" }, f ? r - 3 : r],
      [{ en: "Group", ar: "المجموعة" }, f ? "—" : c],
      [{ en: "Block", ar: "الفئة" }, block],
      [{ en: "Type", ar: "النوع" }, typeOf(k)],
      [{ en: "State at 25°C", ar: "الحالة عند 25°م" }, stateOf(e.z)],
      [{ en: "Electron configuration", ar: "التوزيع الإلكتروني" }, cfg(e.z)]
    ];
    m.innerHTML = `<div class="ptm-card"><div class="ptm-hd" style="--c:${COL[k]}"><div class="ptm-sym">${e.sym}</div>
      <div><h3>${bi({ en: e.en, ar: e.ar })}</h3><p>${bi(CAT[k])}</p></div><button class="ptm-x" aria-label="Close">✕</button></div>
      <div class="ptm-bd">${rows.map(([l, v]) => `<div class="ptm-r"><span>${bi(l)}</span><b>${typeof v === "object" ? bi(v) : v}</b></div>`).join("")}</div></div>`;
    m.classList.add("on");
  };

  const heroHTML = e => `<div class="pt-hs" style="--c:${COL[cat(e.z)]}">${e.sym}</div><div class="pt-hi"><h3>${bi({ en: e.en, ar: e.ar })}</h3><p>${bi(CAT[cat(e.z)])}</p>
    <div class="pt-hm"><span>Z = ${e.z}</span><span>${e.mass}</span></div><code>${cfg(e.z)}</code></div>`;
  const heroDef = `<div class="pt-hi"><h3>${bi(T.title)}</h3><p>${bi({ en: "118 elements. Tap any element for details.", ar: "118 عنصر. اضغط على أي عنصر وشوف تفاصيله." })}</p></div>`;

  function render(box) {
    if (!document.getElementById("ptcss")) { const s = document.createElement("style"); s.id = "ptcss"; s.textContent = CSS; document.head.append(s); }
    const cells = E.map(e => {
      const [r, c] = pos(e.z);
      return `<button class="pt-cell" data-z="${e.z}" style="grid-row:${r};grid-column:${c};--c:${COL[cat(e.z)]};animation-delay:${(r * .05 + c * .02).toFixed(2)}s"><span class="pt-z">${e.z}</span><b class="pt-s">${e.sym}</b><span class="pt-n"><span class="en">${e.en}</span><span class="ar">${e.ar}</span></span></button>`;
    }).join("");
    box.innerHTML = `<div class="pagehead"><h2>${bi(T.title)}</h2><p>${bi(T.desc)}</p></div>
      <div class="pt-wrap"><div class="pt-bar"><input id="ptq" type="search" placeholder="Fe / iron / حديد / 26" autocomplete="off"><div class="pt-legend" id="ptl"></div></div>
      <div class="pt-swipe">${bi({ en: "Swipe sideways to see the whole table.", ar: "حرّك الجدول يمين وشمال عشان تشوفه كله." })}</div>
      <div class="pt-scroll"><div class="pt-grid" id="ptg"><div class="pt-hero def" id="pth">${heroDef}</div>${cells}
        <div class="pt-mark" style="grid-row:6;grid-column:3;--c:${COL.lanth}">57–71</div><div class="pt-mark" style="grid-row:7;grid-column:3;--c:${COL.actin}">89–103</div>
        <div class="pt-lab" style="grid-row:9">${bi(CAT.lanth)}</div><div class="pt-lab" style="grid-row:10">${bi(CAT.actin)}</div></div></div></div>`;
    const grid = box.querySelector("#ptg"), hero = box.querySelector("#pth"), q = box.querySelector("#ptq"), leg = box.querySelector("#ptl");
    const els = [...grid.querySelectorAll(".pt-cell")];
    let fc = null;
    const apply = () => {
      const s = q.value.trim().toLowerCase();
      els.forEach(c => {
        const e = E[c.dataset.z - 1];
        const hit = (!fc || cat(e.z) === fc) && (!s || e.sym.toLowerCase().startsWith(s) || e.en.toLowerCase().includes(s) || e.ar.includes(s) || String(e.z) === s);
        c.classList.toggle("dim", !hit);
      });
    };
    leg.innerHTML = Object.keys(CAT).map(k => `<button class="pt-chip" data-k="${k}" style="--c:${COL[k]}"><i></i>${bi(CAT[k])}</button>`).join("");
    leg.addEventListener("click", ev => {
      const b = ev.target.closest(".pt-chip"); if (!b) return;
      fc = fc === b.dataset.k ? null : b.dataset.k;
      leg.querySelectorAll(".pt-chip").forEach(x => x.classList.toggle("on", x.dataset.k === fc)); apply();
    });
    q.addEventListener("input", apply);
    grid.addEventListener("mouseover", ev => { const c = ev.target.closest(".pt-cell"); if (c) { hero.classList.remove("def"); hero.innerHTML = heroHTML(E[c.dataset.z - 1]); } });
    grid.addEventListener("click", ev => { const c = ev.target.closest(".pt-cell"); if (c) openModal(E[c.dataset.z - 1]); });
  }

  T.render = render;
  TOOLS.periodic = T;
})();