/* js/ssp.js - مدرّب التوزيع الإلكتروني وطريقة (s s p s p...) وموسوعة العناصر وتطبيقاتها
   الجزء الأول : الشرايح التفاعلية لشرح حفظ وترتيب المستويات (الاس اس بس بس)
   الجزء الثاني: موسوعة البحث عن العناصر وتطبيقاتها في الحياة والتوزيع الإلكتروني
   الجزء الثالث: تدريبات وأسئلة تفاعلية */
window.TOOLS = window.TOOLS || {};
(() => {
  /* ---------- أدوات صغيرة ---------- */
  const ltr = s => `<bdi dir="ltr" class="ssp-ltr">${s}</bdi>`;
  const B = (en, ar) => bi({ en, ar });
  const hl = (c, s) => `<span class="hl-${c}">${s}</span>`;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const num = x => ltr(String(x));

  /* ---------- لبنات الشرائح ---------- */
  const par = h => `<p class="ssp-p">${h}</p>`;
  const rule = h => `<div class="ssp-rule">${h}</div>`;
  const ex = h => `<div class="ssp-ex">${h}</div>`;
  const note = h => `<div class="ssp-note">${h}</div>`;
  const warn = (t, h) => `<div class="ssp-warn"><b>${t}</b><span>${h}</span></div>`;
  const calc = rows => `<div class="ssp-calc">${rows.map(r => `<div>${r}</div>`).join("")}</div>`;
  const big = h => `<div class="ssp-big">${h}</div>`;
  const ok = s => `<span class="ssp-tag ok">${s}</span>`;
  const no = s => `<span class="ssp-tag no">${s}</span>`;
  const tbl = (head, rows) => `<div class="ssp-tw"><table class="ssp-tbl"><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => {
    const c = Array.isArray(r) ? r : r.c, k = Array.isArray(r) ? "" : r.k;
    return `<tr class="${k}">${c.map(x => `<td>${x}</td>`).join("")}</tr>`;
  }).join("")}</tbody></table></div>`;

  /* ============================================================
     شريحة طريقة الاستخدام
     ============================================================ */
  const HOW = {
    t: { en: "How to use these slides", ar: "إزاي تستخدم الشرايح دي" },
    steps: [
      par(B("These lessons work like a PowerPoint presentation. Each slide shows its explanation one step at a time.",
        "الدروس دي شغالة زي البوربوينت. كل شريحة بتظهر الشرح خطوة خطوة عشان تفهم بالراحة وبمزاجك.")) +
      rule(`<b>${B("Click anywhere on this slide now.", "دوس دلوقتي في أي مكان على الشريحة.")}</b> ${B("The next part will appear.", "هيظهر الجزء اللي بعده من الشرح.")}`),
      par(B("Every click shows the next step. The part you are reading now has a colored line on its side.",
        "كل ضغطة بتظهر خطوة جديدة، والجزء اللي بتقراه عليه خط ملون على جنبه.")),
      tbl([B("What you do", "تعمل إيه"), B("What happens", "إيه اللي بيحصل")], [
        [B("Click slide or press Space", "دوس على الشريحة أو مسافة الكيبورد"), B("Shows the next step", "بيظهر الخطوة التالية")],
        [B("At the end of the lesson", "في آخر الدرس"), B("Move to element explorer or practice", "انتقل لموسوعة العناصر أو التدريب")]
      ]),
      note(B("Tip: Try saying each rule out loud before clicking the next step.", "نصيحة بصوت عالي: قول القاعدة لنفسك قبل ما تدوس للخطوة اللي بعدها."))
    ]
  };

  /* ============================================================
     الدرس 1 : طريقة حفظ وترتيب (s s p s p...)
     ============================================================ */
  const L1 = {
    id: "seq", no: "01",
    title: { en: "Mastering the s s p s p sequence", ar: "سر حفظ وترتيب (s s p s p...)" },
    desc: { en: "Learn how to write the electronic configuration sequence easily without memorizing blindly.", ar: "اتعلم إزاي تكتب وترتب مستويات الطاقة الفرعية بطريقة سهلة وممتعة من غير حفظ أعمى." },
    slides: [
      HOW,
      { t: { en: "What is electronic configuration?", ar: "يعني إيه توزيع إلكتروني؟" }, steps: [
        par(B("Electrons inside an atom fill energy sublevels in a very specific order based on energy (Aufbau principle).",
          "الإلكترونات جوه الذرة بتتملى في مستويات الطاقة الفرعية بترتيب معين حسب الطاقة (مبدأ البناء التصاعدي).")),
        par(B("Instead of memorizing a huge confusing chart, chemists use a smart verbal sequence known as: s s p s p...",
          "بدل ما تحفظ جدول معقد، العلماء بيستخدموا جملة ترتيب موزونة وسهلة جداً بنسميها: اس اس بس بس...")),
        big(ltr("s  s  p  s  p  s  dp  s  dp  s  fdp  s  fdp"))
      ] },
      { t: { en: "Decoding the sequence: s s p s p", ar: "فك شفرة الجملة: س س / بس / بس" }, steps: [
        par(B("Let's break down the famous sequence into simple repeating blocks:", "تعال نقسّم الجملة الشهيرة لمقاطع متكررة بسيطة:")),
        tbl([B("Block", "المقطع"), B("What it means", "معناه بالعربي"), B("Sublevels", "المستويات")], [
          [ltr("s  s"), B("Two s sublevels", "مرتين (s)"), ltr("1s , 2s")],
          [ltr("p  s  p  s"), B("p then s, repeated twice (Bus Bus)", "بـس ، بـس (p س ، p س)"), ltr("2p 3s , 3p 4s")],
          [ltr("d  p  s"), B("d then p then s (Dabous Dabous)", "دبـس ، دبـس (d p s)"), ltr("3d 4p 5s , 4d 5p 6s")]
        ]),
        rule(B("The rule of repetition: s appears alone twice, then (p and s) twice, then (d, p, s) twice, then (f, d, p, s) twice.",
          "القاعدة باختصار: حرف s مرتين، بعدين مقطع (p و s) مرتين، بعدين مقطع (d و p و s) مرتين."))
      ] },
      { t: { en: "Adding principal quantum numbers (Numbers before letters)", ar: "إزاي نحط الأرقام الرئيسية (الأرقام اللي قبل الحروف)" }, steps: [
        par(B("1. For 's', start counting from 1 and increase by 1 each time: 1s, 2s, 3s, 4s, 5s, 6s, 7s.",
          "1. بالنسبة لحرف s: ابدأ العد من 1 وزود واحد كل مرة: 1s, 2s, 3s, 4s...")),
        par(B("2. For 'p', start counting from 2 and increase by 1 each time: 2p, 3p, 4p, 5p, 6p, 7p.",
          "2. بالنسبة لحرف p: ابدأ العد من 2 وزود واحد كل مرة: 2p, 3p, 4p, 5p...")),
        par(B("3. For 'd', start counting from 3 and increase by 1 each time: 3d, 4d, 5d, 6d.",
          "3. بالنسبة لحرف d: ابدأ العد من 3 وزود واحد كل مرة: 3d, 4d, 5d...")),
        note(B("Remember: d always lags behind s by 1 level (n-1), and f lags behind by 2 levels (n-2).",
          "تفتكر دايمًا: دايمًا الـ d أقل من الـ s برقم واحد (n-1)."))
      ] },
      { t: { en: "Summary of electronic sequence", ar: "الخلاصة والترتيب النهائي" }, steps: [
        calc([
          ltr("1s²  2s²  2p⁶  3s²  3p⁶"),
          ltr("4s²  3d¹⁰ 4p⁶"),
          ltr("5s²  4d¹⁰ 5p⁶"),
          ltr("6s²  4f¹⁴ 5d¹⁰ 6p⁶")
        ]),
        par(B("Maximum capacity of electrons: s holds 2, p holds 6, d holds 10, f holds 14.",
          "سعة الأوربيتالات من الإلكترونات: s بيشيل 2، p بيشيل 6، d بيشيل 10، f بيشيل 14."))
      ] }
    ]
  };

  const LESSONS = [L1];

  /* ============================================================
     موسوعة العناصر وتطبيقاتها في الحياة (Element Explorer Database)
     ============================================================ */
  const ELEMENTS = [
    { z: 1, sym: "H", nameEn: "Hydrogen", nameAr: "هيدروجين", conf: "1s¹", use: "وقود الصواريخ، صناعة النشادر، الخلايا وقود الهيدروجين." },
    { z: 2, sym: "He", nameEn: "Helium", nameAr: "هيليوم", conf: "1s²", use: "نفخ بالونات الاحتفالات، التبريد العميق (MRI)، الغطس في الأعماق." },
    { z: 6, sym: "C", nameEn: "Carbon", nameAr: "كربون", conf: "1s² 2s² 2p²", use: "أساس الكيمياء العضوية، الجرافيت في الأقلام، الألماس في الحلي." },
    { z: 7, sym: "N", nameEn: "Nitrogen", nameAr: "نيتروجين", conf: "1s² 2s² 2p³", use: "الأسمدة الزراعية، تبريد الأغذية، صناعة المتفجرات والأدوية." },
    { z: 8, sym: "O", nameEn: "Oxygen", nameAr: "أكسجين", conf: "1s² 2s² 2p⁴", use: "التنفس لجميع الكائنات الحية، عمليات الاحتراق، لحام القطع المعدنية." },
    { z: 11, sym: "Na", nameEn: "Sodium", nameAr: "صوديوم", conf: "1s² 2s² 2p⁶ 3s¹", use: "ملح الطعام (كلوريد الصوديوم)، إضاءة الشوارع بأضواء صفراء." },
    { z: 13, sym: "Al", nameEn: "Aluminum", nameAr: "ألومنيوم", conf: "1s² 2s² 2p⁶ 3s² 3p¹", use: "صناعة هياكل الطائرات، ورق احباط الطعام، أدوات المطبخ." },
    { z: 14, sym: "Si", nameEn: "Silicon", nameAr: "سيليكون", conf: "1s² 2s² 2p⁶ 3s² 3p²", use: "صناعة الشرائح الإلكترونية والكمبيوتر، الخلايا الشمسية، الزجاج." },
    { z: 17, sym: "Cl", nameEn: "Chlorine", nameAr: "كلور", conf: "1s² 2s² 2p⁶ 3s² 3p⁵", use: "تعقيم مياه الشرب وحمامات السباحة، صناعة المطهرات ومنظفات المنازل." },
    { z: 22, sym: "Ti", nameEn: "Titanium", nameAr: "تيتانيوم", conf: "[Ar] 4s² 3d²", use: "زراعة الأسنان والمفاصل الصناعية، هياكل الطائرات الحربية والمركبات الفضائية لصلابتها وخفتها." },
    { z: 26, sym: "Fe", nameEn: "Iron", nameAr: "حديد", conf: "[Ar] 4s² 3d⁶", use: "بناء ناطحات السحاب، قضبان السكك الحديدية، هياكل السيارات، نقل الهيموجلوبين في الدم." },
    { z: 29, sym: "Cu", nameEn: "Copper", nameAr: "نحاس", conf: "[Ar] 4s¹ 3d¹⁰", use: "الأسلاك الكهربائية لتوصيلها الممتاز، صناعة العملات المعدنية، الأنابيب." },
    { z: 30, sym: "Zn", nameEn: "Zinc", nameAr: "خارصين (زنك)", conf: "[Ar] 4s² 3d¹⁰", use: "جلفنة الحديد لمنع الصدأ، المراهم الطبية، صناعة البطاريات." },
    { z: 47, sym: "Ag", nameEn: "Silver", nameAr: "فضة", conf: "[Kr] 5s¹ 4d¹⁰", use: "صناعة الحلي والمجوهرات الفاخرة، المرايا العاكسة، الأجهزة الإلكترونية الطبية." },
    { z: 79, sym: "Au", nameEn: "Gold", nameAr: "ذهب", conf: "[Xe] 6s¹ 4f¹⁴ 5d¹⁰", use: "الاحتياطي النقدي والمجوهرات، الطلاءات المقاومة للصدأ في الأقمار الصناعية والأجهزة الدقيقة." }
  ];

  /* ============================================================
     بنك الأسئلة والتدريبات (Practice Quiz)
     ============================================================ */
  const bank = [
    {
      stem: B("What is the maximum number of electrons that the 'p' sublevel can hold?", "ما هو العدد الأقصى من الإلكترونات التي يتشبع بها المستوى الفرعي (p)؟"),
      correct: num(6), wrong: [2, 10, 14].map(num),
      why: B("p sublevel contains 3 orbitals, each holding 2 electrons, so 3 x 2 = 6 electrons.", "المستوى p يحتوي على 3 أوربيتالات، كل أوربيتال يشيل إلكترونين، إذن 3 × 2 = 6 إلكترونات.")
    },
    {
      stem: B("The electronic configuration of Sodium (Na = 11) ends with:", "التوزيع الإلكتروني لذرة الصوديوم (Na = 11) ينتهي بالمستوى الفرعي؟"),
      correct: ltr("3s¹"), 
      wrong: [ltr("3s²"), ltr("2p⁶"), ltr("3p¹")],
      why: B("1s² 2s² 2p⁶ 3s¹, total electrons = 2+2+6+1 = 11.", "التوزيع هو 1s² 2s² 2p⁶ 3s¹ والمجموع يعطي 11 إلكترون.")
    },
    {
      stem: B("In the transition series, the d sublevel always precedes the s sublevel of the outer shell by:", "في التوزيع، المستوى الفرعي d يتبع المستوى الرئيسي الأخير s بمقدار كم في رقم المستوى (n)؟"),
      correct: ltr("n - 1"), wrong: [ltr("n - 2"), ltr("n + 1"), ltr("n")].map(ltr),
      why: B("d sublevel is always written as (n-1)d because it lies one principal level below the valence shell s.", "المستوى d يقع دايمًا في المستوى الرئيسي الأقل برقم واحد عن سابقه أي (n-1).")
    },
    {
      stem: B("Which element has the electronic configuration ending with 4s² 3d⁶?", "ما هو العنصر الذي ينتهي توزيعه الإلكتروني بـ 4s² 3d⁶؟"),
      correct: ltr("Iron (Fe)"), wrong: [ltr("Titanium (Ti)"), ltr("Copper (Cu)"), ltr("Zinc (Zn)")].map(ltr),
      why: B("Iron atomic number is 26: [Ar] 4s² 3d⁶.", "العدد الذري للحديد 26، وتزيعه ينتهي بـ 4s² 3d⁶.")
    },
    {
      stem: B("What is the correct order of filling according to s s p s p rule after 3p?", "حسب قاعدة الترتيب (اس اس بس بس)، ما الذي يأتي مباشرة بعد المستوى 3p؟"),
      correct: ltr("4s"), wrong: [ltr("3d"), ltr("4p"), ltr("4s²")].map(ltr),
      why: B("The sequence goes 3s, 3p, then 4s before filling 3d due to energy levels.", "بعد 3p يأتي المستوى 4s نظرًا لطاقته الأقل مقارنة بـ 3d.")
    }
  ];

  /* ============ CSS ============ */
  const CSS = `
.ssp-wrap{max-width:1000px;margin:6px auto 44px;padding:0 14px;font-family:Inter,Cairo,sans-serif;color:#1f2d3a;--navy:#1b365d;--teal:#0d9488;--line:#cbd5e1;--mut:#475569;--soft:#f8fafc;--ok:#15803d;--no:#b91c1c}
.ssp-ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}
.ssp-sec{margin:26px 0 10px;font-size:1.15em;color:var(--navy);display:flex;align-items:center;gap:10px;font-weight:700}
.ssp-sec::after{content:"";flex:1;height:1px;background:var(--line)}
.ssp-how{background:#fff;border:1px solid var(--line);border-inline-start:5px solid var(--navy);border-radius:10px;padding:16px 20px}
.ssp-how h4{margin:0 0 10px;color:var(--navy);font-size:1.05em}
.ssp-how ol{margin:0;padding-inline-start:22px;line-height:2.1}
.ssp-lessons{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(290px,1fr))}
.ssp-lesson,.ssp-tab-btn{position:relative;text-align:start;background:#fff;border:1px solid var(--line);border-radius:10px;padding:18px 20px;cursor:pointer;font-family:inherit;color:inherit;transition:.2s;display:flex;flex-direction:column;gap:6px}
.ssp-lesson:hover{border-color:var(--navy);box-shadow:0 6px 18px rgba(27,54,93,.12);transform:translateY(-2px)}
.ssp-lesson .no{font:800 1.6em Inter,sans-serif;color:var(--navy);letter-spacing:1px}
.ssp-lesson h3{margin:0;font-size:1.05em;line-height:1.7}.ssp-lesson p{margin:0;color:var(--mut);line-height:1.8;font-size:.92em}
.ssp-tabs{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap}
.ssp-tab{padding:10px 20px;border-radius:8px;font-weight:700;border:1px solid var(--line);background:#fff;cursor:pointer;color:var(--navy);transition:.2s}
.ssp-tab.active{background:var(--navy);color:#fff;border-color:var(--navy)}
.ssp-search{width:100%;padding:12px 16px;border:1px solid var(--line);border-radius:8px;font-size:1em;font-family:inherit;margin-bottom:16px;outline:none}
.ssp-search:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(13,148,136,.1)}
.ssp-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.ssp-card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:8px;transition:.2s}
.ssp-card:hover{border-color:var(--teal);box-shadow:0 4px 14px rgba(0,0,0,.06)}
.ssp-card-header{display:flex;justify-content:space-between;align-items:center}
.ssp-sym{font:800 1.4em Inter,sans-serif;color:var(--navy);background:#e2e8f0;padding:2px 10px;border-radius:6px}
.ssp-z{font-size:.85em;color:var(--mut);font-weight:700}
.ssp-use{font-size:.9em;color:var(--mut);line-height:1.6}
.ssp-top{display:flex;align-items:center;gap:12px;margin:6px 0 12px}.ssp-top h3{margin:0;flex:1;font-size:1em;color:var(--navy)}
.ssp-ghost,.ssp-btn{border-radius:8px;padding:9px 18px;font:700 .9em Inter,Cairo,sans-serif;cursor:pointer;transition:.18s;border:1px solid var(--line);background:#fff;color:var(--navy)}
.ssp-ghost:hover,.ssp-btn:hover:not([disabled]){border-color:var(--navy);background:#f1f5f9}
.ssp-btn.pri{background:var(--navy);border-color:var(--navy);color:#fff}.ssp-btn.pri:hover:not([disabled]){background:#11223b}
.ssp-btn[disabled]{opacity:.4;cursor:default}
.ssp-stage{background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden;box-shadow:0 8px 28px rgba(27,54,93,.1);display:flex;flex-direction:column;height:clamp(450px,calc(100vh - 240px),700px);cursor:pointer}
.ssp-head{background:var(--navy);color:#fff;padding:12px 22px;display:flex;align-items:center;justify-content:space-between;gap:14px}
.ssp-head small{opacity:.7;font-size:.78em;display:block}.ssp-head h4{margin:2px 0 0;font-size:1.1em}
.ssp-hc{font-size:.82em;opacity:.9;background:rgba(255,255,255,.14);border-radius:99px;padding:3px 12px}
.ssp-body{flex:1;overflow:auto;padding:20px 26px;display:flex;flex-direction:column;gap:14px}
.ssp-step{display:none;border-inline-start:4px solid transparent;padding-inline-start:14px}
.ssp-step.on{display:block;animation:ssp-in .4s ease both}.ssp-step.cur{border-inline-start-color:var(--teal)}
@keyframes ssp-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.ssp-foot{border-top:1px solid var(--line);background:var(--soft);padding:9px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:.88em;color:var(--mut)}
.ssp-hint{display:flex;align-items:center;gap:8px;font-weight:700;color:var(--navy)}
.ssp-hint::before{content:"";width:9px;height:9px;border-radius:50%;background:var(--teal);animation:ssp-pulse 1.4s infinite}
@keyframes ssp-pulse{50%{box-shadow:0 0 0 7px rgba(13,148,136,.18)}}
.ssp-segs{display:flex;gap:4px}.ssp-segs i{width:22px;height:5px;border-radius:3px;background:#cbd5e1}.ssp-segs i.on{background:var(--teal)}
.ssp-p{margin:0;line-height:2.05;font-size:1.04em}
.ssp-ex{background:var(--soft);border:1px solid var(--line);border-radius:8px;padding:14px 18px;line-height:2.1;font-weight:600}
.ssp-note{background:#fffbeb;border:1px solid #f3dca0;border-radius:8px;padding:11px 16px;line-height:2}
.ssp-rule{background:#eef4fa;border:1px solid #b9cde2;border-inline-start:5px solid var(--navy);border-radius:8px;padding:11px 16px;line-height:2}
.ssp-calc{background:#0f2237;color:#e7eef6;border-radius:8px;padding:12px 18px;line-height:2.1;font-weight:700}
.ssp-big{font:800 2em Inter,monospace;text-align:center;direction:ltr;color:var(--navy);padding:10px}
.ssp-tw{overflow-x:auto}
.ssp-tbl{width:100%;border-collapse:collapse;font-size:.96em;background:#fff}
.ssp-tbl th{background:var(--navy);color:#fff;padding:8px 12px;text-align:center}
.ssp-tbl td{border:1px solid var(--line);padding:8px 12px;text-align:center;line-height:1.8}
.ssp-tag{display:inline-block;border-radius:6px;padding:1px 10px;font-size:.85em;font-weight:800}
.ssp-tag.ok{background:#dcfce7;color:#166534}.ssp-tag.no{background:#fee2e2;color:#991b1b}
.ssp-nav{display:flex;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap}
.ssp-dots{flex:1;display:flex;gap:7px;justify-content:center}
.ssp-dot{width:10px;height:10px;border-radius:99px;border:0;background:#cbd5e1;cursor:pointer;padding:0;transition:.25s}
.ssp-dot.on{width:30px;background:var(--navy)}.ssp-dot.done{background:var(--teal)}
.ssp-qcard{background:#fff;border:1px solid var(--line);border-radius:10px;padding:18px 22px;box-shadow:0 8px 28px rgba(0,0,0,.06)}
.ssp-qhead{display:flex;justify-content:space-between;font-weight:700;color:var(--navy);margin-bottom:8px}
.ssp-qs{margin:16px 0;font-size:1.08em;line-height:2.1;font-weight:600}
.ssp-opts{display:grid;gap:9px}
.ssp-opt{display:flex;align-items:center;gap:12px;text-align:start;border:1.5px solid var(--line);background:#fff;border-radius:8px;padding:10px 14px;font:600 1em Inter,Cairo,sans-serif;cursor:pointer;transition:.15s}
.ssp-opt:hover:not([disabled]){border-color:var(--navy);background:#f1f5f9}
.ssp-opt .l{flex:none;width:28px;height:28px;border-radius:50%;background:#e2e8f0;color:var(--navy);display:flex;align-items:center;justify-content:center;font:800 .85em}
.ssp-opt.right{border-color:var(--ok);background:#ecfdf3}.ssp-opt.right .l{background:var(--ok);color:#fff}
.ssp-opt.wrong{border-color:var(--no);background:#fef2f2}.ssp-opt.wrong .l{background:var(--no);color:#fff}
.ssp-why{margin-top:14px;border-radius:8px;padding:12px 16px;line-height:2}
.ssp-why.ok{background:#ecfdf3;border:1px solid #b7e4c7}.ssp-why.no{background:#fef2f2;border:1px solid #f4c4c4}
.ssp-pn{display:flex;justify-content:flex-end;margin-top:14px}
`;

  const T = {
    id: "ssp",
    icon: '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font:800 18px Inter,sans-serif;color:#fff;direction:ltr">s-p-d</div>',
    title: { en: "Electronic Configuration & Elements Explorer", ar: "التوزيع الإلكتروني وموسوعة العناصر" },
    desc: { en: "Learn the s s p s p sequence with interactive slides, explore elements in real life, and test your skills.", ar: "تعلم طريقة الاس اس بس بس بالشرايح، تصفح عناصر الجدول وتطبيقاتها في حياتنا اليومية، واختبر نفسك." }
  };

  function render(box) {
    if (!document.getElementById("sspcss")) { const s = document.createElement("style"); s.id = "sspcss"; s.textContent = CSS; document.head.append(s); }
    box.innerHTML = `<div class="pagehead"><h2>${bi(T.title)}</h2><p>${bi(T.desc)}</p></div><div class="ssp-wrap" id="ssproot"></div>`;
    home(box.querySelector("#ssproot"));
  }

  function home(root) {
    root.innerHTML = `
      <div class="ssp-tabs">
        <button class="ssp-tab active" data-tab="lessons">${B("1. Interactive Lessons", "1. الشرايح التفاعلية")}</button>
        <button class="ssp-tab" data-tab="explorer">${B("2. Elements & Life Uses", "2. موسوعة العناصر وتطبيقاتها")}</button>
        <button class="ssp-tab" data-tab="quiz">${B("3. Quick Quiz", "3. اختبار سريع")}</button>
      </div>
      <div id="sspTabContent"></div>`;
    
    const switchTab = tab => {
      root.querySelectorAll(".ssp-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
      const c = root.querySelector("#sspTabContent");
      if (tab === "lessons") renderLessons(c);
      else if (tab === "explorer") renderExplorer(c);
      else renderQuiz(c);
    };

    root.onclick = e => {
      const btn = e.target.closest(".ssp-tab");
      if (btn) switchTab(btn.dataset.tab);
      const l = e.target.closest(".ssp-lesson");
      if (l) player(root, LESSONS.find(x => x.id === l.dataset.id));
    };

    switchTab("lessons");
  }

  function renderLessons(c) {
    c.innerHTML = `
      <div class="ssp-sec">${B("Lessons", "الدروس التعليمية")}</div>
      <div class="ssp-lessons">${LESSONS.map(l => `<button class="ssp-lesson" data-id="${l.id}">
        <span class="no">${l.no}</span><h3>${bi(l.title)}</h3><p>${bi(l.desc)}</p>
        <span style="font-size:.82em;color:var(--mut);margin-top:6px">${l.slides.length}${B("slides", "شريحة تفاعلية")}</span></button>`).join("")}</div>`;
  }

  function renderExplorer(c) {
    c.innerHTML = `
      <div class="ssp-sec">${B("Elements in Real Life & Electronic Configuration", "العناصر وتطبيقاتها في الحياة والتوزيع الإلكتروني")}</div>
      <input type="text" class="ssp-search" id="sspSearch" placeholder="${B("Search by name, symbol, or use (e.g. Iron, Oxygen, Copper)...", "ابحث باسم العنصر، الرمز، أو الاستخدام (مثال: حديد، نحاس، أكسجين)...")}">
      <div class="ssp-grid" id="sspGrid"></div>`;
    
    const grid = c.querySelector("#sspGrid");
    const input = c.querySelector("#sspSearch");

    const renderCards = list => {
      grid.innerHTML = list.map(el => `
        <div class="ssp-card">
          <div class="ssp-card-header">
            <div><span class="ssp-sym">${el.sym}</span> <b style="margin-inline-start:8px;color:var(--navy);font-size:1.05em">${el.nameAr} (${el.nameEn})</b></div>
            <span class="ssp-z">Z = ${el.z}</span>
          </div>
          <div style="font-family:monospace;font-weight:700;color:var(--teal)">${ltr(el.conf)}</div>
          <div class="ssp-use"><b>${B("Life Use", "التطبيق في الحياة")}:</b> ${el.use}</div>
        </div>`).join("");
    };

    renderCards(ELEMENTS);
    input.oninput = () => {
      const q = input.value.trim().toLowerCase();
      const filtered = ELEMENTS.filter(e => e.nameAr.toLowerCase().includes(q) || e.nameEn.toLowerCase().includes(q) || e.sym.toLowerCase().includes(q) || e.use.toLowerCase().includes(q));
      renderCards(filtered);
    };
  }

  function renderQuiz(c) {
    let qidx = 0, score = 0, picked = -1;
    const q = bank;

    const draw = () => {
      const cur = q[qidx], answered = picked > -1, right = picked === cur.ans;
      c.innerHTML = `
        <div class="ssp-sec">${B("Quick Quiz", "اختبار سريع على التوزيع")}</div>
        <div class="ssp-qcard">
          <div class="ssp-qhead"><span>${B("Question", "سؤال")} ${qidx + 1} / ${q.length}</span><span>${B("Score", "الدرجة")}: ${score} / ${qidx + (answered ? 1 : 0)}</span></div>
          <div class="ssp-qs">${cur.stem}</div>
          <div class="ssp-opts">${cur.opts.map((o, j) => `<button class="ssp-opt ${answered ? (j === cur.ans ? "right" : j === picked ? "wrong" : "") : ""}" data-i="${j}" ${answered ? "disabled" : ""}><span class="l">${"ABCD"[j]}</span><span>${o.h}</span></button>`).join("")}</div>
          ${answered ? `<div class="ssp-why ${right ? "ok" : "no"}"><b>${right ? B("Correct!", "إجابة صحيحة!") : B("Incorrect.", "إجابة خاطئة.")}</b> ${cur.why}</div>
            <div class="ssp-pn"><button class="ssp-btn pri ssp-next">${qidx === q.length - 1 ? B("Finish", "إنهاء الاختبار") : B("Next Question", "السؤال التالي")}</button></div>` : ""}
        </div>`;
    };

    q.forEach(item => {
      const opts = shuffle([{ h: item.correct, ok: 1 }].concat(item.wrong.map(h => ({ h, ok: 0 }))));
      item.opts = opts;
      item.ans = opts.findIndex(x => x.ok);
    });

    c.onclick = e => {
      const opt = e.target.closest(".ssp-opt");
      if (opt && picked < 0) {
        picked = +opt.dataset.i;
        if (picked === q[qidx].ans) score++;
        draw();
      }
      if (e.target.closest(".ssp-next")) {
        if (qidx === q.length - 1) {
          c.innerHTML = `<div class="ssp-qcard" style="text-align:center;padding:30px"><h3>${B("Quiz Completed!", "انتهى الاختبار!")}</h3><div style="font-size:2.5em;font-weight:800;color:var(--navy);margin:10px 0">${score} / ${q.length}</div><button class="ssp-btn pri" id="sspRestart">${B("Try Again", "إعادة الاختبار")}</button></div>`;
          c.querySelector("#sspRestart").onclick = () => renderQuiz(c);
        } else {
          qidx++; picked = -1; draw();
        }
      }
    };

    draw();
  }

  /* ---------- مشغّل الشرائح ---------- */
  function player(root, L) {
    let i = 0, k = 1;
    const n = L.slides.length, last = n - 1;
    const stepsOf = () => L.slides[i].steps;

    const refresh = () => {
      const m = stepsOf().length, st = root.querySelectorAll(".ssp-step");
      st.forEach((s, x) => { s.classList.toggle("on", x < k); s.classList.toggle("cur", x === k - 1 && m > 1); });
      root.querySelector(".ssp-hc").innerHTML = `الخطوة ${k} / ${m}`;
      root.querySelector(".ssp-segs").innerHTML = Array.from({ length: m }, (_, x) => `<i class="${x < k ? "on" : ""}"></i>`).join("");
      const nb = root.querySelector(".ssp-next"); 
      nb.innerHTML = stepsOf().length > k ? B("Next step", "الخطوة التالية") : i < last ? B("Next slide", "الشريحة التالية") : B("Back to menu", "الرجوع للقائمة");
      if (k >= m && i === last) nb.classList.add("pri");
    };

    const draw = () => {
      const sl = L.slides[i];
      root.innerHTML = `<div class="ssp-top"><button class="ssp-ghost ssp-back">${B("Back to menu", "رجوع للقائمة")}</button><h3>${bi(L.title)}</h3></div>
        <div class="ssp-stage"><div class="ssp-head"><div><small>شريحة ${i + 1} من ${n}</small><h4>${bi(sl.t)}</h4></div><div class="ssp-hc"></div></div>
          <div class="ssp-body">${sl.steps.map(s => `<div class="ssp-step">${s}</div>`).join("")}</div>
          <div class="ssp-foot"><span class="ssp-hint">${B("Click slide for next step", "دوس على الشريحة للخطوة التالية")}</span><span class="ssp-segs"></span></div></div>
        <div class="ssp-nav"><button class="ssp-btn ssp-prev" ${i === 0 ? "disabled" : ""}>${B("Back", "السابق")}</button>
          <div class="ssp-dots">${L.slides.map((_, x) => `<button class="ssp-dot ${x === i ? "on" : ""}" data-i="${x}"></button>`).join("")}</div>
          <button class="ssp-btn ssp-next"></button></div>`;
      refresh();
    };

    const advance = () => {
      if (k < stepsOf().length) { k++; return refresh(); }
      if (i < last) { i++; k = 1; return draw(); }
      render(root.parentElement);
    };

    root.onclick = e => {
      if (e.target.closest(".ssp-back")) return render(root.parentElement);
      if (e.target.closest(".ssp-next")) return advance();
      if (e.target.closest(".ssp-prev")) { if (i > 0) { i--; k = 1; draw(); } }
      const dt = e.target.closest(".ssp-dot");
      if (dt) { i = +dt.dataset.i; k = 1; draw(); }
      if (e.target.closest(".ssp-stage")) advance();
    };

    draw();
  }

  T.render = render;
  window.TOOLS.ssp = T;
})();