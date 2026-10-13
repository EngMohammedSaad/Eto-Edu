/* js/trans.js - Transition Elements Trainer
   احفظ + تدرّب + حلّل عنصر: السلاسل الانتقالية، الدورة، المجموعة، الأوربيتالات */
window.TOOLS = window.TOOLS || {};
(() => {
  /* ================= محرك الكيمياء ================= */
  const SUPD = "⁰¹²³⁴⁵⁶⁷⁸⁹", sup = n => String(n).replace(/\d/g, d => SUPD[d]);
  const ORB = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"];
  const CAP = { s: 2, p: 6, d: 10, f: 14 };
  // استثناءات التوزيع: [من, إلى, عدد]
  const EXC = { 24: ["4s", "3d"], 29: ["4s", "3d"], 41: ["5s", "4d"], 42: ["5s", "4d"], 44: ["5s", "4d"], 45: ["5s", "4d"], 46: ["5s", "4d", 2], 47: ["5s", "4d"], 78: ["6s", "5d"], 79: ["6s", "5d"] };
  const CORES = [[86, "Rn"], [54, "Xe"], [36, "Kr"], [18, "Ar"], [10, "Ne"], [2, "He"]];
  const ROM = { 3: "IIIB", 4: "IVB", 5: "VB", 6: "VIB", 7: "VIIB", 8: "VIIIB", 9: "VIIIB", 10: "VIIIB", 11: "IB", 12: "IIB" };
  const GROUPS = ["IIIB", "IVB", "VB", "VIB", "VIIB", "VIIIB", "IB", "IIB"];

  const fill = (z, exc = true) => {
    let left = z; const c = {};
    ORB.forEach(o => { const n = Math.min(CAP[o[1]], left); if (n > 0) c[o] = n; left -= n; });
    if (exc && EXC[z]) { const [a, b, k = 1] = EXC[z]; c[a] -= k; if (!c[a]) delete c[a]; c[b] = (c[b] || 0) + k; }
    return c;
  };
  const coreOf = z => CORES.find(([n]) => z > n);
  const val = z => {                       // المستويات الخارجية (بعد القلب)
    const c = fill(z), core = coreOf(z), skip = core ? fill(core[0], false) : {};
    return Object.keys(c).filter(o => !(o in skip)).sort((a, b) => ORB.indexOf(a) - ORB.indexOf(b)).map(o => [o, c[o]]);
  };
  const fmt = (list, rev) => (rev ? list.slice().sort((a, b) => +b[0][0] - +a[0][0]) : list).map(([o, k]) => o + sup(k)).join(rev ? " , " : " ");
  const occ = c => Object.entries(c).reduce((s, [o, k]) => s + Math.min(k, CAP[o[1]] / 2), 0);
  const unp = c => Object.entries(c).reduce((s, [o, k]) => { const h = CAP[o[1]] / 2; return s + (k <= h ? k : 2 * h - k); }, 0);
  const grp = list => list.filter(([o]) => o[1] === "s" || o[1] === "d").reduce((s, [, k]) => s + k, 0);
  const per = list => Math.max(...list.filter(([o]) => o[1] === "s").map(([o]) => +o[0]));
  const lastOrb = list => list.reduce((m, x) => ORB.indexOf(x[0]) > ORB.indexOf(m[0]) ? x : m)[0];
  const boxes = (k, o) => { const a = Array(o).fill(0); for (let i = 0; i < Math.min(k, o); i++) a[i] = 1; for (let i = 0; i < k - o; i++) a[i] = 2; return a.map(x => x === 2 ? "↑↓" : x === 1 ? "↑" : "_").join(" "); };

  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const ltr = s => `<bdi dir="ltr" class="tr-ltr">${s}</bdi>`;

  const SER = {
    d1: { en: "First main transition series (3d)", ar: "السلسلة الانتقالية الرئيسية الأولى (3d)" },
    d2: { en: "Second main transition series (4d)", ar: "السلسلة الانتقالية الرئيسية الثانية (4d)" },
    d3: { en: "Third main transition series (5d)", ar: "السلسلة الانتقالية الرئيسية الثالثة (5d)" },
    lan: { en: "Lanthanides (4f)", ar: "اللانثانيدات (4f)" },
    act: { en: "Actinides (5f)", ar: "الأكتينيدات (5f)" }
  };

  const E = (z, sym, en, ar, s, exc) => ({ z, sym, en, ar, s, exc: !!exc });
  const EL = [
    E(21, "Sc", "Scandium", "سكانديوم", "d1"), E(22, "Ti", "Titanium", "تيتانيوم", "d1"), E(23, "V", "Vanadium", "فاناديوم", "d1"),
    E(24, "Cr", "Chromium", "كروم", "d1"), E(25, "Mn", "Manganese", "منجنيز", "d1"), E(26, "Fe", "Iron", "حديد", "d1"),
    E(27, "Co", "Cobalt", "كوبالت", "d1"), E(28, "Ni", "Nickel", "نيكل", "d1"), E(29, "Cu", "Copper", "نحاس", "d1"), E(30, "Zn", "Zinc", "خارصين", "d1"),
    E(39, "Y", "Yttrium", "إتريوم", "d2"), E(40, "Zr", "Zirconium", "زركونيوم", "d2"), E(41, "Nb", "Niobium", "نيوبيوم", "d2", 1),
    E(42, "Mo", "Molybdenum", "موليبدنوم", "d2", 1), E(43, "Tc", "Technetium", "تكنيشيوم", "d2"), E(44, "Ru", "Ruthenium", "روثينيوم", "d2", 1),
    E(45, "Rh", "Rhodium", "روديوم", "d2", 1), E(46, "Pd", "Palladium", "بالاديوم", "d2", 1), E(47, "Ag", "Silver", "فضة", "d2", 1), E(48, "Cd", "Cadmium", "كادميوم", "d2"),
    E(72, "Hf", "Hafnium", "هافنيوم", "d3"), E(73, "Ta", "Tantalum", "تانتالوم", "d3"), E(74, "W", "Tungsten", "تنجستن", "d3"),
    E(75, "Re", "Rhenium", "رينيوم", "d3"), E(76, "Os", "Osmium", "أوزميوم", "d3"), E(77, "Ir", "Iridium", "إيريديوم", "d3"),
    E(78, "Pt", "Platinum", "بلاتين", "d3", 1), E(79, "Au", "Gold", "ذهب", "d3", 1), E(80, "Hg", "Mercury", "زئبق", "d3"),
    E(60, "Nd", "Neodymium", "نيوديميوم", "lan"), E(62, "Sm", "Samarium", "ساماريوم", "lan"), E(63, "Eu", "Europium", "يوروبيوم", "lan"), E(70, "Yb", "Ytterbium", "إيتربيوم", "lan"),
    E(94, "Pu", "Plutonium", "بلوتونيوم", "act"), E(95, "Am", "Americium", "أمريسيوم", "act"), E(100, "Fm", "Fermium", "فيرميوم", "act"), E(102, "No", "Nobelium", "نوبليوم", "act")
  ];
  const bySym = s => EL.find(e => e.sym === s);
  const D_OK = EL.filter(e => e.s[0] === "d" && !e.exc);   // عناصر آمنة للتدريب
  const ALL_OK = EL.filter(e => !e.exc);

  /* ================= مولّدات الأسئلة ================= */
  const GEN = {
    /* 1) السلسلة من التوزيع (زي سؤال 9) */
    series() {
      const e = rnd(ALL_OK), list = val(e.z), last = lastOrb(list), isD = last[1] === "d";
      const keys = ["d1", "d2", "d3", "lan", "act"];
      const opts = shuffle([e.s, ...shuffle(keys.filter(k => k !== e.s)).slice(0, 3)]);
      const order = list.map(x => x[0]).join(" → ");
      const steps = [
        { en: `Order of filling is by energy, not by how it is written: ${ltr(order)}. The last sublevel filled is ${ltr(last)}.`, ar: `الملء بيمشي بالطاقة مش بترتيب الكتابة: ${ltr(order)}. آخر مستوى اتملى هو ${ltr(last)}.` },
        isD
          ? { en: `It is a d sublevel, so this is a main transition element. Period = (${last[0]}) + 1 = ${+last[0] + 1}, series rank = ${+last[0] + 1} − 3 = ${+last[0] - 2}.`, ar: `ده مستوى d يبقى عنصر انتقالي رئيسي. الدورة = ${last[0]} + 1 = ${+last[0] + 1}، ورتبة السلسلة = ${+last[0] + 1} − 3 = ${+last[0] - 2}.` }
          : { en: `It is an f sublevel, so this is an inner transition element: 4f = lanthanides (period 6), 5f = actinides (period 7).`, ar: `ده مستوى f يبقى انتقالي داخلي: 4f = لانثانيدات (الدورة 6)، 5f = أكتينيدات (الدورة 7).` },
        { en: `Answer: ${bi(SER[e.s])}`, ar: `الإجابة: ${bi(SER[e.s])}` }
      ];
      return {
        stem: { en: "The element whose electronic configuration ends with the following belongs to:", ar: "العنصر اللي توزيعه الإلكتروني بينتهي بـ:  بينتمي إلى:" },
        cfg: ltr(fmt(list, Math.random() < .6)), opts: opts.map(k => bi(SER[k])), ans: opts.indexOf(e.s), steps
      };
    },
    /* 2) قاعدة n-3 (زي سؤال 1) */
    formula() {
      const isD = Math.random() < .65, p = x => x === "n" ? "n" : `(${x})`, show = ([a, b]) => ltr(`${p(a)} , ${p(b)}`);
      const right = isD ? ["n−3", "n"] : ["n−5", "n"];
      const wrongs = isD
        ? [["n", "n−3"], ["n−2", "n"], ["n−3", "n−1"], ["n−1", "n"], ["n", "n−1"], ["n−3", "n−2"], ["n−2", "n−1"]]
        : [["n", "n−5"], ["n−3", "n"], ["n−4", "n"], ["n−5", "n−1"], ["n−2", "n"], ["n−5", "n−2"]];
      const all = shuffle([right, ...shuffle(wrongs).slice(0, 3)]);
      const steps = isD ? [
        { en: "Take a real example: 3d is the first series and it sits in period 4. Here (n−1)d = 3d, so n = 4.", ar: "خد مثال حقيقي: 3d هي السلسلة الأولى وفي الدورة 4. يعني (n−1)d = 3d و n = 4." },
        { en: "Period = n = 4. Rank = 1 = n − 3.", ar: "الدورة = n = 4. والرتبة = 1 = n − 3." },
        { en: `Answer: rank ${ltr("(n−3)")} , period ${ltr("n")}.`, ar: `الإجابة: الرتبة ${ltr("(n−3)")} ، والدورة ${ltr("n")}.` }
      ] : [
        { en: "Take a real example: 4f = lanthanides, the first inner series, in period 6. Here (n−2)f = 4f, so n = 6.", ar: "خد مثال حقيقي: 4f = اللانثانيدات، أول سلسلة داخلية، وفي الدورة 6. يعني (n−2)f = 4f و n = 6." },
        { en: "Period = n = 6. Rank = 1 = n − 5 (and actinides: n = 7, rank 2 = 7 − 5).", ar: "الدورة = n = 6. والرتبة = 1 = n − 5 (والأكتينيدات: n = 7، الرتبة 2 = 7 − 5)." },
        { en: `Answer: rank ${ltr("(n−5)")} , period ${ltr("n")}.`, ar: `الإجابة: الرتبة ${ltr("(n−5)")} ، والدورة ${ltr("n")}.` }
      ];
      return {
        stem: isD
          ? { en: "The transition series in which the (n−1)d sublevel is being filled has rank ........ and lies in period ........ (rank , period)", ar: "السلسلة الانتقالية اللي بيتتابع فيها امتلاء المستوى الفرعي (n−1)d رتبتها ........ وبتقع في الدورة ........ (الرتبة ، الدورة)" }
          : { en: "The inner transition series in which the (n−2)f sublevel is being filled has rank ........ and lies in period ........ (rank , period)", ar: "السلسلة الانتقالية الداخلية اللي بيتتابع فيها امتلاء المستوى الفرعي (n−2)f رتبتها ........ وبتقع في الدورة ........ (الرتبة ، الدورة)" },
        opts: all.map(show), ans: all.indexOf(right), steps
      };
    },
    /* 3) الدورة والمجموعة من التوزيع */
    pg() {
      const e = rnd(D_OK), list = val(e.z), P = per(list), g = grp(list), lab = ROM[g];
      const mk = (P2, l2) => ({ P: P2, l: l2, html: bi({ en: `Period ${P2}, group ${l2}`, ar: `الدورة ${P2} ، المجموعة ${ltr(l2)}` }) });
      const right = mk(P, lab), pool = [];
      [4, 5, 6].forEach(p2 => GROUPS.forEach(l2 => { if (!(p2 === P && l2 === lab)) pool.push(mk(p2, l2)); }));
      const opts = shuffle([right, ...shuffle(pool).slice(0, 3)]);
      const sd = list.filter(([o]) => o[1] === "s" || o[1] === "d");
      const sum = sd.map(([o, k]) => `${o}${sup(k)}`).join(" + ");
      return {
        stem: { en: "The element whose outer configuration is the following lies in:", ar: "العنصر اللي توزيعه الخارجي كده بيقع في:" },
        cfg: ltr(fmt(list, Math.random() < .5)), opts: opts.map(o => o.html), ans: opts.indexOf(right),
        steps: [
          { en: `Period = the highest principal level = ${P}.`, ar: `الدورة = أعلى مستوى رئيسي = ${P}.` },
          { en: `Group number comes from adding the electrons of s and (n−1)d: ${ltr(sum)} = ${g}.`, ar: `رقم المجموعة بنجمع إلكترونات s و (n−1)d: ${ltr(sum)} = ${g}.` },
          { en: `${g} electrons ⇒ group ${lab} (3→IIIB … 7→VIIB, 8-9-10→VIIIB, 11→IB, 12→IIB). The 4f¹⁴ is just a filled inner sublevel, it is not counted.`, ar: `${g} إلكترون ⇒ المجموعة ${ltr(lab)} (3→IIIB … 7→VIIB، و 8-9-10→VIIIB، و 11→IB، و 12→IIB). و 4f¹⁴ مستوى داخلي ممتلئ مش بنعدّه.` }
        ]
      };
    },
    /* 4) الأوربيتالات المشغولة (زي سؤال 7) */
    orb() {
      if (Math.random() < .5) {
        const e = bySym(rnd(["Sc", "Ti", "V"])), g = e.z - 18, k = 10 + g;     // 9 قلب + 4s + عدد إلكترونات 3d
        const gl = ROM[g], right = gl, opts = GROUPS.slice(0, 4);
        return {
          stem: { en: `A transition element in period 4 has ${k} orbitals occupied by electrons. It lies in group:`, ar: `عنصر انتقالي في الدورة 4 عدد الأوربيتالات المشغولة بالإلكترونات فيه ${k}. بيقع في المجموعة:` },
          opts: opts.map(ltr), ans: opts.indexOf(right),
          steps: [
            { en: "The argon core 1s 2s 2p(3) 3s 3p(3) occupies 1+1+3+1+3 = 9 orbitals.", ar: "قلب الأرجون 1s 2s 2p(3) 3s 3p(3) بيشغل 1+1+3+1+3 = 9 أوربيتال." },
            { en: `4s adds 1 more, so the 3d holds ${k} − 10 = ${k - 10} occupied orbital(s). Electrons spread singly first (Hund), so 3d has ${k - 10} electron(s).`, ar: `الـ 4s بيزود 1، يبقى 3d فيه ${k} − 10 = ${k - 10} أوربيتال مشغول. والإلكترونات بتتوزع فرادى الأول (هوند)، يبقى في 3d ${k - 10} إلكترون.` },
            { en: `Outer electrons = 2 + ${k - 10} = ${g} ⇒ group ${gl} (${e.sym}). Shortcut: group number = occupied orbitals − 8.`, ar: `الإلكترونات الخارجية = 2 + ${k - 10} = ${g} ⇒ المجموعة ${ltr(gl)} (${e.sym}). اختصار: رقم المجموعة = الأوربيتالات المشغولة − 8.` }
          ]
        };
      }
      const e = bySym(rnd(["Sc", "Ti", "V", "Cr", "Mn", "Fe", "Zn"])), c = fill(e.z), n = occ(c);
      const opts = shuffle([n, ...shuffle([10, 11, 12, 13, 14, 15, 16].filter(x => x !== n)).slice(0, 3)]);
      const parts = Object.entries(c).map(([o, k]) => `${o}${sup(k)}→${Math.min(k, CAP[o[1]] / 2)}`).join(" , ");
      return {
        stem: { en: `How many orbitals are occupied by electrons in the atom of ${e.en} (${e.sym})?`, ar: `كام أوربيتال مشغول بالإلكترونات في ذرة ${e.ar} (${e.sym})؟` },
        opts: opts.map(x => ltr(x)), ans: opts.indexOf(n),
        steps: [
          { en: `Count orbitals sublevel by sublevel (an orbital counts once even if it holds 2 electrons): ${ltr(parts)}.`, ar: `بنعدّ الأوربيتالات مستوى مستوى (الأوربيتال بيتعدّ مرة واحدة حتى لو فيه إلكترونين): ${ltr(parts)}.` },
          { en: `Total = ${n}. Note: from Cr to Zn the 3d orbitals are all occupied, so the total is always 15.`, ar: `المجموع = ${n}. ولاحظ: من Cr لـ Zn أوربيتالات 3d كلها مشغولة فالمجموع دايمًا 15.` }
        ]
      };
    },
    /* 5) الإلكترونات المفردة */
    unp() {
      const e = rnd(EL.filter(x => x.s === "d1")), c = fill(e.z), n = unp(c);
      const opts = shuffle([n, ...shuffle([0, 1, 2, 3, 4, 5, 6].filter(x => x !== n)).slice(0, 3)]);
      const sv = c["4s"] || 0, dv = c["3d"] || 0;
      return {
        stem: { en: `How many unpaired electrons are in the ground-state atom of ${e.en} (${e.sym})?`, ar: `كام إلكترون مفرد في ذرة ${e.ar} (${e.sym}) في الحالة المستقرة؟` },
        opts: opts.map(x => ltr(x)), ans: opts.indexOf(n),
        steps: [
          { en: `Configuration: ${ltr(fmt(val(e.z)))}.`, ar: `التوزيع: ${ltr(fmt(val(e.z)))}.` },
          { en: `Boxes: 4s ${ltr(boxes(sv, 1))} | 3d ${ltr(boxes(dv, 5))}. Fill each 3d box with one arrow before pairing.`, ar: `المربعات: 4s ${ltr(boxes(sv, 1))} | 3d ${ltr(boxes(dv, 5))}. املى كل مربع في 3d بسهم الأول قبل ما تزوّج.` },
          { en: `Unpaired = ${n} ⇒ ${n ? "paramagnetic" : "diamagnetic"}.`, ar: `المفرد = ${n} ⇒ ${n ? "بارامغناطيسي" : "دايامغناطيسي"}.` }
        ]
      };
    },
    /* 6) الاستثناءات Cr و Cu */
    exc() {
      const isCr = Math.random() < .5, right = isCr ? "Cr" : "Cu", cfg = isCr ? "4s¹ 3d⁵" : "4s¹ 3d¹⁰";
      const pool = isCr ? ["V", "Mn", "Fe", "Ti"] : ["Ni", "Zn", "Co", "Fe"];
      const opts = shuffle([right, ...shuffle(pool).slice(0, 3)]);
      return {
        stem: { en: "Which first-series element has the outer configuration below?", ar: "أنهي عنصر من السلسلة الأولى توزيعه الخارجي كده؟" },
        cfg: ltr(cfg), opts: opts.map(s => { const e = bySym(s); return bi({ en: `${e.en} (${s})`, ar: `${e.ar} (${s})` }); }), ans: opts.indexOf(right),
        steps: [
          { en: isCr ? "Expected 4s² 3d⁴, but one 4s electron moves to 3d to make it exactly half-filled (3d⁵), which is more stable." : "Expected 4s² 3d⁹, but one 4s electron moves to 3d to make it completely filled (3d¹⁰), which is more stable.", ar: isCr ? "المفروض 4s² 3d⁴، بس إلكترون من 4s بينتقل لـ 3d عشان يبقى نص ممتلئ (3d⁵) وده أثبت." : "المفروض 4s² 3d⁹، بس إلكترون من 4s بينتقل لـ 3d عشان يبقى ممتلئ تمامًا (3d¹⁰) وده أثبت." },
          { en: `Answer: ${right}. Only Cr and Cu break the rule in the first series.`, ar: `الإجابة: ${right}. وبس Cr و Cu اللي بيكسروا القاعدة في السلسلة الأولى.` }
        ]
      };
    }
  };
  const TYPES = {
    series: { en: "Series from configuration", ar: "السلسلة من التوزيع" },
    formula: { en: "The n−3 rule", ar: "قاعدة n−3" },
    pg: { en: "Period and group", ar: "الدورة والمجموعة" },
    orb: { en: "Occupied orbitals", ar: "الأوربيتالات المشغولة" },
    unp: { en: "Unpaired electrons", ar: "الإلكترونات المفردة" },
    exc: { en: "Cr and Cu exceptions", ar: "استثناءا Cr و Cu" }
  };

  /* ================= كروت الحفظ ================= */
  const tbl = (head, rows) => `<div class="tr-tw"><table class="tr-t"><thead><tr>${head.map(h => `<th>${bi(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${typeof c === "object" ? bi(c) : c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const L = (en, ar) => `<p>${bi({ en, ar })}</p>`;
  const LEARN = [
    {
      id: "series", title: { en: "1. The four main transition series", ar: "1. السلاسل الانتقالية الرئيسية الأربعة" },
      body: tbl([{ en: "Series", ar: "السلسلة" }, { en: "Sublevel", ar: "المستوى" }, { en: "Period", ar: "الدورة" }, { en: "Elements", ar: "العناصر" }], [
        [{ en: "First", ar: "الأولى" }, ltr("3d"), "4", ltr("Sc → Zn")],
        [{ en: "Second", ar: "الثانية" }, ltr("4d"), "5", ltr("Y → Cd")],
        [{ en: "Third", ar: "الثالثة" }, ltr("5d"), "6", ltr("Hf → Hg")],
        [{ en: "Fourth (incomplete)", ar: "الرابعة (لسه ما اتكملتش)" }, ltr("6d"), "7", ltr("Rf → ...")]
      ]) + L("Memorize: the d number is always one less than the period number.", "احفظ: رقم المستوى d دايمًا أقل من رقم الدورة بواحد.") +
        L("There are 4 main transition series, so 'the number of main transition series' = 4.", "السلاسل الانتقالية الرئيسية 4، يعني لو السؤال قال «عدد السلاسل الانتقالية الرئيسية» يبقى = 4.")
    },
    {
      id: "formula", title: { en: "2. Rank and period formulas", ar: "2. قوانين الرتبة والدورة" },
      body: `<div class="tr-big">${ltr("(n−1)d")} ⇒ ${bi({ en: "period", ar: "الدورة" })} ${ltr("n")} , ${bi({ en: "rank", ar: "الرتبة" })} ${ltr("n−3")}</div>
        <div class="tr-big">${ltr("(n−2)f")} ⇒ ${bi({ en: "period", ar: "الدورة" })} ${ltr("n")} , ${bi({ en: "rank", ar: "الرتبة" })} ${ltr("n−5")}</div>` +
        L("Check with numbers: 3d → period 4, rank 4−3 = 1. 4f → period 6, rank 6−5 = 1 (lanthanides). 5f → period 7, rank 2 (actinides).", "جرّب بالأرقام: 3d → الدورة 4، الرتبة 4−3 = 1. و 4f → الدورة 6، الرتبة 6−5 = 1 (اللانثانيدات). و 5f → الدورة 7، الرتبة 2 (الأكتينيدات).")
    },
    {
      id: "last", title: { en: "3. Which sublevel is filled last?", ar: "3. إزاي أعرف آخر مستوى اتملى؟" },
      body: `<div class="tr-big">${ltr("5s → 4d → 5p → 6s → 4f → 5d → 6p → 7s → 5f → 6d")}</div>` +
        L("If the configuration is written backwards, like 6s² 5d³ 4f¹⁴, do not panic: follow the energy order, not the writing. 4f comes BEFORE 5d.", "لو التوزيع مكتوب بالمقلوب زي 6s² 5d³ 4f¹⁴ ما تتلخبطش: امشي بترتيب الطاقة مش بترتيب الكتابة. و 4f بتيجي قبل 5d.") +
        L("4f full (14) and electrons in 5d ⇒ the last electron entered d ⇒ third main transition series.", "لو 4f ممتلئة (14) وفي إلكترونات في 5d ⇒ آخر إلكترون دخل d ⇒ السلسلة الانتقالية الثالثة.") +
        L("4f is the one being filled (like 4f⁷ 6s²) ⇒ lanthanides. 5f ⇒ actinides.", "ولو 4f هي اللي بتتملى (زي 4f⁷ 6s²) ⇒ لانثانيدات. و 5f ⇒ أكتينيدات.")
    },
    {
      id: "group", title: { en: "4. Group number", ar: "4. رقم المجموعة" },
      body: L("Add the electrons of ns and (n−1)d:", "اجمع إلكترونات ns و (n−1)d:") +
        tbl([{ en: "Total", ar: "المجموع" }, { en: "Group", ar: "المجموعة" }], [
          ["3", ltr("IIIB")], ["4", ltr("IVB")], ["5", ltr("VB")], ["6", ltr("VIB")], ["7", ltr("VIIB")], ["8 , 9 , 10", ltr("VIIIB")], ["11", ltr("IB")], ["12", ltr("IIB")]
        ]) + L("Example: Ti 4s² 3d² → 2 + 2 = 4 → IVB, period 4.", "مثال: Ti ‏4s² 3d² → 2 + 2 = 4 → IVB والدورة 4.")
    },
    {
      id: "orb", title: { en: "5. Counting occupied orbitals", ar: "5. عدّ الأوربيتالات المشغولة" },
      body: L("Orbitals per sublevel: s = 1, p = 3, d = 5, f = 7. An orbital counts once even if it holds two electrons. Electrons fill orbitals one by one first (Hund).", "الأوربيتالات في كل مستوى: s = 1 و p = 3 و d = 5 و f = 7. الأوربيتال بيتعدّ مرة واحدة حتى لو فيه إلكترونين. والإلكترونات بتتوزع فرادى الأول (قاعدة هوند).") +
        `<div class="tr-big">${bi({ en: "Argon core = 9 orbitals", ar: "قلب الأرجون = 9 أوربيتالات" })}</div>` +
        L("Period-4 element: occupied orbitals = 9 + 1 (for 4s) + number of 3d electrons (up to 5). So group number = occupied orbitals − 8 (for Sc, Ti, V).", "عنصر في الدورة 4: الأوربيتالات المشغولة = 9 + 1 (لـ 4s) + عدد إلكترونات 3d (لحد 5). يعني رقم المجموعة = الأوربيتالات المشغولة − 8 (لـ Sc و Ti و V).") +
        L("From Cr to Zn all five 3d orbitals are occupied, so the total is 15.", "من Cr لـ Zn أوربيتالات 3d الخمسة كلها مشغولة فالمجموع 15.")
    },
    {
      id: "exc", title: { en: "6. The two exceptions", ar: "6. الاستثناءان" },
      body: `<div class="tr-big">${ltr("Cr : 4s¹ 3d⁵")}</div><div class="tr-big">${ltr("Cu : 4s¹ 3d¹⁰")}</div>` +
        L("Reason: a half-filled (d⁵) or completely filled (d¹⁰) sublevel is extra stable, so one 4s electron moves into 3d.", "السبب: المستوى النص ممتلئ (d⁵) أو الممتلئ تمامًا (d¹⁰) بيبقى أثبت، فإلكترون من 4s بينتقل لـ 3d.")
    },
    {
      id: "ex", title: { en: "7. Worked examples of the exam questions", ar: "7. حل نماذج من أسئلة الامتحان" },
      body: `<h4>${bi({ en: "Series that fills (n−1)d: rank , period", ar: "السلسلة اللي بتملى (n−1)d: الرتبة ، الدورة" })}</h4>` +
        L("Take 3d: (n−1) = 3 so n = 4. Period = n, rank = n − 3. Answer: (n−3) , n.", "خد 3d: (n−1) = 3 يعني n = 4. الدورة = n، والرتبة = n − 3. الإجابة: (n−3) ، n.") +
        `<h4>${bi({ en: "Ends with 6s² 5d³ 4f¹⁴", ar: "بينتهي بـ 6s² 5d³ 4f¹⁴" })}</h4>` +
        L("Energy order: 6s → 4f → 5d. Last = 5d³, a d sublevel in period 6 ⇒ third transition series (Ta).", "ترتيب الطاقة: 6s ← 4f ← 5d. الأخير = 5d³ وده d في الدورة 6 ⇒ السلسلة الانتقالية الثالثة (Ta).") +
        `<h4>${bi({ en: "Levels = number of main series, orbitals = s + d columns", ar: "المستويات = عدد السلاسل الرئيسية، والأوربيتالات = أعمدة s و d" })}</h4>` +
        L("Main series = 4 ⇒ 4 principal levels ⇒ period 4. Columns of s + d = 2 + 10 = 12 occupied orbitals ⇒ 12 − 8 = 4 ⇒ group IVB. Answer: period 4, group IVB (Ti).", "السلاسل الرئيسية = 4 ⇒ 4 مستويات رئيسية ⇒ الدورة 4. وأعمدة s + d = 2 + 10 = 12 أوربيتال مشغول ⇒ 12 − 8 = 4 ⇒ المجموعة IVB. الإجابة: الدورة 4 والمجموعة IVB (Ti).")
    }
  ];

  /* ================= CSS ================= */
  const CSS = `
.tr-wrap{max-width:980px;margin:10px auto 70px;padding:0 16px;font-family:Inter,Cairo,sans-serif;color:var(--ink)}
.tr-ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}
.tr-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 18px}
.tr-tab,.tr-chip,.tr-next,.tr-el{border:1.5px solid var(--bd);background:#fff;color:var(--ink);border-radius:99px;padding:9px 18px;font:700 14px Inter,Cairo,sans-serif;cursor:pointer;transition:.2s}
.tr-tab:hover,.tr-chip:hover,.tr-el:hover{transform:translateY(-2px)}
.tr-tab.on,.tr-chip.on,.tr-el.on{background:var(--navy);color:#fff;border-color:var(--navy)}
.tr-card{background:#fff;border:1.5px solid var(--bd);border-radius:18px;padding:18px 20px;margin-bottom:14px;box-shadow:0 4px 18px rgba(18,53,91,.06)}
.tr-card.ok{border-color:#16a34a;background:#f0fdf4}
.tr-card h3{margin:0 0 10px;font-size:18px;color:var(--navy)}.tr-card h4{margin:14px 0 4px;font-size:15px;color:var(--teal)}
.tr-card p{margin:8px 0;line-height:1.9}
.tr-big{background:#eef6fb;border-radius:12px;padding:12px 14px;margin:8px 0;font:700 17px Inter,Cairo,sans-serif;text-align:center}
.tr-tw{overflow-x:auto}.tr-t{border-collapse:collapse;width:100%;margin:8px 0}
.tr-t th,.tr-t td{border:1px solid var(--bd);padding:8px 12px;text-align:center}.tr-t th{background:#eef6fb;color:var(--navy)}
.tr-mem{margin-top:10px;border:1.5px solid var(--bd);background:#fff;border-radius:99px;padding:7px 16px;font:700 13px Inter,Cairo,sans-serif;cursor:pointer}
.tr-card.ok .tr-mem{background:#16a34a;color:#fff;border-color:#16a34a}
.tr-prog{height:8px;background:#e5eef5;border-radius:99px;overflow:hidden;margin:6px 0 16px}.tr-prog i{display:block;height:100%;background:linear-gradient(90deg,var(--teal),var(--navy));transition:.4s}
.tr-chips{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px}.tr-chip{padding:6px 13px;font-size:12.5px}
.tr-chip small{opacity:.7;margin-inline-start:5px}
.tr-score{display:flex;gap:16px;flex-wrap:wrap;font-weight:700;margin-bottom:12px;color:var(--mu)}
.tr-stem{font-size:18px;line-height:1.9;font-weight:700;margin-bottom:10px}
.tr-cfg{background:#12232e;color:#fde68a;border-radius:12px;padding:12px;text-align:center;font:700 20px Inter,monospace;margin:10px 0 14px;direction:ltr}
.tr-opts{display:grid;gap:9px}
.tr-opt{text-align:start;border:1.5px solid var(--bd);background:#fff;color:var(--ink);border-radius:14px;padding:12px 16px;font:600 15.5px Inter,Cairo,sans-serif;cursor:pointer;transition:.15s}
.tr-opt:hover:not([disabled]){border-color:var(--teal);transform:translateX(3px)}
.tr-opt.right{background:#dcfce7;border-color:#16a34a}.tr-opt.wrong{background:#fee2e2;border-color:#dc2626}
.tr-why{margin-top:14px;background:#f8fafc;border-radius:14px;padding:12px 18px;border-inline-start:5px solid var(--teal)}
.tr-why ol{margin:6px 0;padding-inline-start:20px;line-height:1.9}
.tr-next{background:var(--teal);color:#fff;border-color:var(--teal);margin-top:12px}
.tr-els{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 14px}.tr-el{padding:6px 12px;font-size:13px;border-radius:10px}
.tr-el.x{border-style:dashed;opacity:.8}
.tr-row{display:flex;justify-content:space-between;gap:14px;padding:9px 0;border-bottom:1px solid #edf2f7}.tr-row:last-child{border:0}
.tr-row span{color:var(--mu)}.tr-row b{text-align:end}
.tr-sol-h{display:flex;align-items:center;gap:14px;margin-bottom:8px}.tr-sym{width:70px;height:70px;border-radius:16px;background:linear-gradient(135deg,var(--teal),var(--navy));color:#fff;display:flex;align-items:center;justify-content:center;font:800 28px Inter,sans-serif}
.tr-note{margin-top:10px;background:#fef9c3;border-radius:12px;padding:10px 14px;line-height:1.8}
`;

  const T = {
    id: "trans",
    icon: '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font:800 30px Inter,sans-serif;color:#fff;letter-spacing:1px;direction:ltr">3d⁵</div>',
    title: { en: "Transition Elements Trainer", ar: "مدرّب العناصر الانتقالية" },
    desc: { en: "Memorize the rules, then practice endless questions on series, period, group and orbitals.", ar: "احفظ القواعد وبعدين اتدرب على أسئلة مالهاش آخر عن السلاسل والدورة والمجموعة والأوربيتالات." }
  };

  /* ================= الواجهة ================= */
  function render(box) {
    if (!document.getElementById("trcss")) { const s = document.createElement("style"); s.id = "trcss"; s.textContent = CSS; document.head.append(s); }
    box.innerHTML = `<div class="pagehead"><h2>${bi(T.title)}</h2><p>${bi(T.desc)}</p></div>
      <div class="tr-wrap"><div class="tr-tabs" id="trtabs">
        <button class="tr-tab on" data-k="learn">${bi({ en: "Memorize", ar: "احفظ" })}</button>
        <button class="tr-tab" data-k="practice">${bi({ en: "Practice", ar: "تدريب" })}</button>
        <button class="tr-tab" data-k="solver">${bi({ en: "Analyze an element", ar: "حلّل عنصر" })}</button></div><div id="trbody"></div></div>`;
    const body = box.querySelector("#trbody"), tabs = box.querySelector("#trtabs");
    const views = { learn, practice, solver };
    const open = k => { tabs.querySelectorAll(".tr-tab").forEach(b => b.classList.toggle("on", b.dataset.k === k)); body.innerHTML = ""; views[k](body); };
    tabs.addEventListener("click", e => { const b = e.target.closest(".tr-tab"); if (b) open(b.dataset.k); });
    open("learn");
  }

  /* ---- تاب الحفظ ---- */
  function learn(el) {
    const key = "trn:learn";
    const draw = () => {
      const done = Store.get(key, []), n = LEARN.length, d = LEARN.filter(c => done.includes(c.id)).length;
      el.innerHTML = `<div class="tr-score"><span>${bi({ en: "Memorized", ar: "اتحفظ" })}: ${d} / ${n}</span></div><div class="tr-prog"><i style="width:${d / n * 100}%"></i></div>` +
        LEARN.map(c => `<div class="tr-card ${done.includes(c.id) ? "ok" : ""}"><h3>${bi(c.title)}</h3>${c.body}
          <button class="tr-mem" data-id="${c.id}">${done.includes(c.id) ? bi({ en: "Memorized ✓ (tap to undo)", ar: "حفظتها ✓ (دوس للتراجع)" }) : bi({ en: "I memorized this", ar: "حفظت الكارت ده" })}</button></div>`).join("");
    };
    el.onclick = e => {
      const b = e.target.closest(".tr-mem"); if (!b) return;
      let d = Store.get(key, []); d = d.includes(b.dataset.id) ? d.filter(x => x !== b.dataset.id) : d.concat(b.dataset.id);
      Store.set(key, d); const y = scrollY; draw(); scrollTo(0, y);
    };
    draw();
  }

  /* ---- تاب التدريب ---- */
  function practice(el) {
    let type = "all", q = null, done = false, picked = -1, score = 0, total = 0, streak = 0;
    const stats = () => Store.get("trn:stats", {});
    const acc = t => { const s = stats()[t] || { c: 0, w: 0 }; return { s, a: (s.c + 1) / (s.c + s.w + 2) }; };
    const pick = () => {                                   // الأضعف يظهر أكتر
      const ks = Object.keys(GEN), w = ks.map(k => 1 + (1 - acc(k).a) * 3), r = Math.random() * w.reduce((a, b) => a + b, 0);
      let x = 0; for (let i = 0; i < ks.length; i++) { x += w[i]; if (r <= x) return ks[i]; } return ks[0];
    };
    const next = () => { const t = type === "all" ? pick() : type; q = GEN[t](); q.type = t; done = false; picked = -1; draw(); };
    const draw = () => {
      const st = stats();
      const chips = [["all", { en: "Mixed (weak spots first)", ar: "مختلط (الأضعف الأول)" }, ""]].concat(Object.keys(TYPES).map(k => {
        const s = st[k]; return [k, TYPES[k], s && (s.c + s.w) ? Math.round(s.c / (s.c + s.w) * 100) + "%" : ""];
      })).map(([k, l, a]) => `<button class="tr-chip ${type === k ? "on" : ""}" data-t="${k}">${bi(l)}${a ? `<small>${a}</small>` : ""}</button>`).join("");
      el.innerHTML = `<div class="tr-chips">${chips}</div>
        <div class="tr-score"><span>${bi({ en: "Score", ar: "النتيجة" })}: ${score} / ${total}</span><span>${bi({ en: "Streak", ar: "متتالية" })}: ${streak}</span></div>
        <div class="tr-card"><div class="tr-stem">${bi(q.stem)}</div>${q.cfg ? `<div class="tr-cfg">${q.cfg}</div>` : ""}
        <div class="tr-opts">${q.opts.map((o, i) => `<button class="tr-opt ${done ? (i === q.ans ? "right" : i === picked ? "wrong" : "") : ""}" data-i="${i}" ${done ? "disabled" : ""}>${o}</button>`).join("")}</div>
        ${done ? `<div class="tr-why"><b>${bi(picked === q.ans ? { en: "Correct!", ar: "صح، برافو!" } : { en: "Not quite. Here is how to solve it:", ar: "لأ، بص إزاي بتتحل:" })}</b>
          <ol>${q.steps.map(s => `<li>${bi(s)}</li>`).join("")}</ol></div><button class="tr-next" data-n="1">${bi({ en: "Next question", ar: "السؤال اللي بعده" })}</button>` : ""}</div>`;
    };
    el.onclick = e => {
      const t = e.target.closest(".tr-chip"); if (t) { type = t.dataset.t; return next(); }
      if (e.target.closest(".tr-next")) return next();
      const o = e.target.closest(".tr-opt"); if (!o || done) return;
      picked = +o.dataset.i; done = true; total++;
      const ok = picked === q.ans; ok ? (score++, streak++) : (streak = 0);
      const st = stats(); st[q.type] = st[q.type] || { c: 0, w: 0 }; st[q.type][ok ? "c" : "w"]++; Store.set("trn:stats", st);
      draw();
    };
    next();
  }

  /* ---- تاب تحليل عنصر ---- */
  function solver(el) {
    let z = 22;
    const draw = () => {
      const e = EL.find(x => x.z === z), list = val(z), c = fill(z), core = coreOf(z), last = lastOrb(list);
      const isD = e.s[0] === "d", P = per(list), g = grp(list), n = unp(c);
      const exNote = EXC[z] ? (z === 24 || z === 29
        ? { en: "Exception: one 4s electron moves to 3d (half/full d is more stable).", ar: "استثناء: إلكترون من 4s بينتقل لـ 3d (الـ d النص أو الكامل أثبت)." }
        : { en: "This is an exception to the filling order, usually outside the school syllabus.", ar: "ده استثناء في ترتيب الملء، وغالبًا برّه المنهج." }) : null;
      const rows = [
        [{ en: "Configuration", ar: "التوزيع الإلكتروني" }, ltr((core ? `[${core[1]}] ` : "") + fmt(list))],
        [{ en: "Last sublevel filled", ar: "آخر مستوى اتملى" }, ltr(last)],
        [{ en: "Type", ar: "النوع" }, bi(SER[e.s])],
        [{ en: "Period", ar: "الدورة" }, P],
        isD ? [{ en: "Group", ar: "المجموعة" }, ltr(ROM[g]) + ` (${ltr(g)})`] : null,
        isD ? [{ en: "Series rank", ar: "رتبة السلسلة" }, P - 3] : [{ en: "Series rank", ar: "رتبة السلسلة" }, P - 5],
        [{ en: "Occupied orbitals", ar: "الأوربيتالات المشغولة" }, occ(c)],
        [{ en: "Unpaired electrons", ar: "الإلكترونات المفردة" }, n + " ⇒ " + bi(n ? { en: "paramagnetic", ar: "بارامغناطيسي" } : { en: "diamagnetic", ar: "دايامغناطيسي" })]
      ].filter(Boolean);
      const grpBtn = (s, label) => `<div class="tr-sol-lab"><b>${bi(label)}</b></div><div class="tr-els">${EL.filter(x => x.s === s).map(x => `<button class="tr-el ${x.z === z ? "on" : ""} ${x.exc ? "x" : ""}" data-z="${x.z}">${x.sym}</button>`).join("")}</div>`;
      el.innerHTML = `<div class="tr-card">${["d1", "d2", "d3", "lan", "act"].map(s => grpBtn(s, SER[s])).join("")}
        <div class="tr-note">${bi({ en: "Dashed buttons are exceptions to the filling order.", ar: "الأزرار المتقطعة دي عناصر استثناء في ترتيب الملء." })}</div></div>
        <div class="tr-card"><div class="tr-sol-h"><div class="tr-sym">${e.sym}</div><div><h3 style="margin:0">${bi({ en: e.en, ar: e.ar })}</h3><span style="color:var(--mu)">Z = ${e.z}</span></div></div>
        ${rows.map(([l, v]) => `<div class="tr-row"><span>${bi(l)}</span><b>${v}</b></div>`).join("")}
        ${exNote ? `<div class="tr-note">${bi(exNote)}</div>` : ""}</div>`;
    };
    el.onclick = e => { const b = e.target.closest(".tr-el"); if (b) { z = +b.dataset.z; draw(); } };
    draw();
  }

  T.render = render;
  TOOLS.trans = T;
})();
