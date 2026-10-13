/* js/nminus.js - مدرّب أسئلة (n−1)d
   الجزء الأول : دروس على شكل شرائح (زي البوربوينت) - كل ضغطة تظهر الخطوة التالية من الشرح
   الجزء الثاني: تدريب 50 سؤال على 5 جولات، كل جولة 10 أسئلة ولها درجة */
window.TOOLS = window.TOOLS || {};
(() => {
  /* ---------- أدوات صغيرة ---------- */
  const ltr = s => `<bdi dir="ltr" class="nm-ltr">${s}</bdi>`;
  const B = (en, ar) => bi({ en, ar });
  const hl = (c, s) => `<span class="hl-${c}">${s}</span>`;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const num = x => ltr(String(x));

  /* ---------- لبنات الشرائح ---------- */
  const par = h => `<p class="nm-p">${h}</p>`;
  const rule = h => `<div class="nm-rule">${h}</div>`;
  const ex = h => `<div class="nm-ex">${h}</div>`;
  const note = h => `<div class="nm-note">${h}</div>`;
  const warn = (t, h) => `<div class="nm-warn"><b>${t}</b><span>${h}</span></div>`;
  const calc = rows => `<div class="nm-calc">${rows.map(r => `<div>${r}</div>`).join("")}</div>`;
  const big = h => `<div class="nm-big">${h}</div>`;
  const ok = s => `<span class="nm-tag ok">${s}</span>`;
  const no = s => `<span class="nm-tag no">${s}</span>`;
  const tbl = (head, rows) => `<div class="nm-tw"><table class="nm-tbl"><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => {
    const c = Array.isArray(r) ? r : r.c, k = Array.isArray(r) ? "" : r.k;
    return `<tr class="${k}">${c.map(x => `<td>${x}</td>`).join("")}</tr>`;
  }).join("")}</tbody></table></div>`;
  const cols12 = `<div class="nm-cols">${Array.from({ length: 12 }, (_, i) => `<i class="${i < 2 ? "s" : "d"}"></i>`).join("")}</div>
    <div class="nm-cols lab"><span style="grid-column:span 2">s = 2</span><span style="grid-column:span 10">d = 10</span></div>`;

  /* ============================================================
     شريحة طريقة الاستخدام (أول شريحة في كل درس)
     ============================================================ */
  const HOW = {
    t: { en: "How to use these slides", ar: "إزاي تستخدم الشرايح دي" },
    steps: [
      par(B("These lessons work like a PowerPoint presentation. Each slide shows its explanation one step at a time, so you can read at your own speed.",
        "الدروس دي شغالة زي البوربوينت بالظبط. كل شريحة بتظهر الشرح خطوة خطوة، فتقدر تقرا بالسرعة اللي تناسبك.")) +
      rule(`<b>${B("Click anywhere on this slide now.", "دوس دلوقتي في أي مكان على الشريحة دي.")}</b> ${B("The next part of the explanation will appear.", "هيظهر الجزء اللي بعده من الشرح.")}`),
      par(B("Good. Every click on the slide shows the next part of the explanation. The part you are reading now is marked with a colored line on its side.",
        "تمام. كل ضغطة على الشريحة بتظهر الجزء اللي بعده. الجزء اللي بتقراه حاليًا عليه خط ملون على جنبه.")),
      tbl([B("What you do", "تعمل إيه"), B("What happens", "إيه اللي بيحصل")], [
        [B("Click the slide, press Next, or press Space", "دوس على الشريحة أو زر التالي أو مسافة الكيبورد"), B("Shows the next part of the explanation", "بيظهر الجزء اللي بعده من الشرح")],
        [B("Click again after everything is shown", "دوس تاني بعد ما الشرح يكمل"), B("Moves to the next slide", "بتنتقل للشريحة اللي بعدها")],
        [B("Back button", "زر السابق"), B("Returns to the previous slide", "بيرجعك للشريحة اللي قبلها")],
        [B("Show all button", "زر إظهار الكل"), B("Displays the whole slide at once", "بيظهر الشريحة كلها مرة واحدة")],
        [B("Dots under the slide", "النقط تحت الشريحة"), B("Jump to any slide", "بتروح لأي شريحة")],
        [B("Swipe left or right on the phone", "اسحب يمين أو شمال في الموبايل"), B("Previous or next slide", "الشريحة اللي قبلها أو اللي بعدها")]
      ]),
      par(B("At the end of each lesson a button takes you to the practice: 50 questions in 5 rounds of 10 questions. After each round you see your score and a review of your mistakes.",
        "في آخر كل درس هتلاقي زرار بيوديك للتدريب: 50 سؤال في 5 جولات، كل جولة 10 أسئلة. بعد كل جولة بتشوف درجتك ومراجعة لأخطائك.")),
      note(B("Tip: after each step, try to say it in your own words before you click.", "نصيحة: بعد كل خطوة حاول تقولها بكلامك قبل ما تدوس للي بعدها."))
    ]
  };

  /* ============================================================
     الدرس 1 : رتبة ودورة سلسلة (n−1)d
     ============================================================ */
  const SER = [[3, 4, 1], [4, 5, 2], [5, 6, 3], [6, 7, 4]]; // [d , period , rank]
  const Q1TXT = (a, b, c) => B(
    `The transition series in which ${a ? ltr(hl("a", "(n−1)d")) : "(n−1)d"} sublevel is being filled has ${b ? hl("b", "rank") : "rank"} ........ and lies in ${c ? hl("c", "period") : "period"} ........ (rank , period)`,
    `السلسلة الانتقالية التي يتتابع فيها امتلاء المستوى الفرعي ${a ? ltr(hl("a", "(n−1)d")) : "(n−1)d"} ${b ? hl("b", "رتبتها") : "رتبتها"} ........ ، وتقع في ${c ? hl("c", "الدورة") : "الدورة"} ........ (الرتبة ، الدورة)`);

  const L1 = {
    id: "rank", no: "01",
    title: { en: "Rank and period of the (n−1)d series", ar: "رتبة ودورة سلسلة (n−1)d" },
    desc: { en: "Question type: the series in which (n−1)d is filled has rank ... and period ...", ar: "نوع السؤال: السلسلة اللي بيتملى فيها (n−1)d رتبتها ... ودورتها ..." },
    slides: [
      HOW,
      { t: { en: "Read the question", ar: "اقرا السؤال صح" }, steps: [
        ex(Q1TXT(1, 1, 1)),
        par(B("The question asks for two things, in this exact order:", "السؤال بيطلب حاجتين، وبالترتيب ده بالظبط:")) +
        tbl([B("Blank", "الفراغ"), B("What it asks", "بيسأل عن إيه"), B("What you must decide", "لازم تحدد إيه")], [
          ["1", hl("b", B("Rank", "الرتبة")), B("Is it the 1st, 2nd, 3rd or 4th transition series?", "هي السلسلة الانتقالية الأولى ولا التانية ولا التالتة ولا الرابعة؟")],
          ["2", hl("c", B("Period", "الدورة")), B("In which horizontal row of the periodic table does it lie?", "في أنهي صف أفقي من الجدول الدوري بتقع؟")]
        ]),
        warn(B("Careful with the order", "خد بالك من الترتيب"), B("The options are written as (rank , period). The rank is always first. An option such as (n , n−3) has the order reversed, so it is wrong.", "الاختيارات مكتوبة (الرتبة ، الدورة). الرتبة دايمًا الأول. اختيار زي (n , n−3) الترتيب فيه معكوس، فهو غلط.")),
        par(B("Goal of this lesson: get both blanks from one letter, n, using two simple rules. No memorizing of options is needed.", "هدف الدرس: تجيب الفراغين من حرف واحد هو n باستخدام قاعدتين بسيطتين. من غير ما تحفظ الاختيارات."))
      ] },
      { t: { en: "Where is the d sublevel filled?", ar: "فين بيتملى المستوى d؟" }, steps: [
        par(B("Periods are the horizontal rows of the periodic table. The period number equals the number of the outer principal level that is being filled in that row.",
          "الدورات هي الصفوف الأفقية في الجدول الدوري. رقم الدورة هو رقم المستوى الرئيسي الخارجي اللي بيتملى في الصف ده.")),
        par(B("The d sublevel does not exist in periods 1, 2 and 3. It is filled for the first time in period 4, right after 4s is filled.",
          "المستوى الفرعي d مش موجود في الدورات 1 و 2 و 3. بيتملى لأول مرة في الدورة 4 بعد ما 4s بيتملى.")),
        par(B("The elements whose d sublevel is being filled are the transition elements. They form rows called series. Here are the four series:",
          "العناصر اللي بيتملى فيها المستوى d هي العناصر الانتقالية. بتكوّن صفوف اسمها سلاسل. دي السلاسل الأربعة:")) +
        tbl([B("Rank of series", "رتبة السلسلة"), B("Sublevel being filled", "المستوى اللي بيتملى"), B("Period", "الدورة")], [
          [B("1st (first series)", "الأولى"), ltr("3d"), "4"], [B("2nd", "التانية"), ltr("4d"), "5"], [B("3rd", "التالتة"), ltr("5d"), "6"],
          [B("4th (not yet complete)", "الرابعة (لسه ما اتكملتش)"), ltr("6d"), "7"]
        ]),
        note(B("Look at the table: in every row the number before d is one less than the period. 3d is in period 4, 4d in period 5, 5d in period 6, 6d in period 7. This difference of 1 is exactly what (n−1) means.",
          "بص على الجدول: في كل صف الرقم اللي قبل d أقل من رقم الدورة بواحد. 3d في الدورة 4، و 4d في الدورة 5، و 5d في الدورة 6، و 6d في الدورة 7. الفرق ده (واحد) هو بالظبط معنى (n−1)."))
      ] },
      { t: { en: "What does (n−1)d mean? Rule 1: period", ar: "يعني إيه (n−1)d؟ القاعدة 1: الدورة" }, steps: [
        big(ltr(hl("a", "(n−1)d"))),
        par(B("This is a way to write any d sublevel using one letter. The letter n is the number of the outer principal level of the element, which is the period number.",
          "دي طريقة بنكتب بيها أي مستوى d بحرف واحد. الحرف n هو رقم المستوى الرئيسي الخارجي للعنصر، وده هو رقم الدورة.")),
        par(B("The d electrons enter the level just before the outer one. That is why we write (n−1): one level below n.",
          "إلكترونات d بتدخل في المستوى اللي قبل الخارجي بواحد. علشان كده بنكتب (n−1): أقل من n بواحد.")),
        ex(`<b>${B("Example: the first series", "مثال: السلسلة الأولى")}</b>` + calc([
          B("The first series fills 3d", "السلسلة الأولى بتملّي 3d"),
          ltr(`(n − 1) = 3`),
          B("Add 1 to both sides", "ضيف 1 للطرفين"),
          ltr(`n = 3 + 1 = ${hl("c", "4")}`)
        ])),
        par(B("Do the same for every series:", "اعمل نفس الحاجة لكل سلسلة:")) +
        tbl([B("Sublevel", "المستوى"), ltr("n − 1"), ltr("n = " + "period")], SER.map(([d, p]) => [ltr(d + "d"), ltr(String(d)), ltr(String(p))])),
        rule(`<b>${B("Rule 1", "القاعدة 1")}</b> ${B("Period = n = (the number before d) + 1. This answers the second blank.", "الدورة = n = (الرقم اللي قبل d) + 1. وكده جاوبنا على الفراغ التاني.")}`)
      ] },
      { t: { en: "Rule 2: the rank", ar: "القاعدة 2: الرتبة" }, steps: [
        par(B("Rank tells us whether it is the first, second, third or fourth transition series.", "الرتبة بتقولنا هي السلسلة الانتقالية الأولى ولا التانية ولا التالتة ولا الرابعة.")),
        par(B("The first series is the 3d series, in period 4. Periods 1, 2 and 3 contain no transition series at all.", "السلسلة الأولى هي سلسلة 3d في الدورة 4. والدورات 1 و 2 و 3 مفيهاش سلاسل انتقالية خالص.")),
        tbl([B("Period", "الدورة"), B("Transition series?", "فيها سلسلة انتقالية؟"), B("Rank", "الرتبة")], [1, 2, 3, 4, 5, 6, 7].map(p =>
          p < 4 ? { k: "dim", c: [String(p), B("None", "مفيش"), "-"] } : { c: [String(p), B("Yes", "أيوه"), String(p - 3)] })),
        par(B("So we have to skip 3 periods before the series begin. The rank is the period number minus 3.", "يعني لازم نتخطى 3 دورات قبل ما السلاسل تبدأ. الرتبة = رقم الدورة − 3.")),
        rule(`<b>${B("Rule 2", "القاعدة 2")}</b> ${B("Rank = n − 3. This answers the first blank.", "الرتبة = n − 3. وده بيجاوب على الفراغ الأول.")}`),
        calc([ltr("n = 4  →  4 − 3 = 1"), ltr("n = 5  →  5 − 3 = 2"), ltr("n = 6  →  6 − 3 = 3"), ltr("n = 7  →  7 − 3 = 4")]),
        note(B("Second way to remember it: rank = (n−1) − 2, because the d numbering starts at 3, and 3 − 2 = 1. Both ways give n − 3.", "طريقة تانية تفتكرها: الرتبة = (n−1) − 2، لأن ترقيم d بيبدأ من 3، و 3 − 2 = 1. الطريقتين بيدّوا n − 3."))
      ] },
      { t: { en: "Solve the question step by step", ar: "حل السؤال خطوة بخطوة" }, steps: [
        ex(Q1TXT(0, 0, 0)),
        par(`<b>${B("Step 1.", "الخطوة 1.")}</b> ${B("Pick the easiest real series: the first one, 3d. Then (n−1) = 3, so n = 4.", "اختار أسهل سلسلة حقيقية: الأولى، 3d. يبقى (n−1) = 3 و n = 4.")}`),
        par(`<b>${B("Step 2.", "الخطوة 2.")}</b> ${B("Use the two rules for n = 4:", "طبّق القاعدتين على n = 4:")}`) + calc([
          B("Period = n = 4", "الدورة = n = 4"), B("Rank = n − 3 = 4 − 3 = 1", "الرتبة = n − 3 = 4 − 3 = 1"),
          B(`The target answer is (rank , period) = ${ltr("(1 , 4)")}`, `يبقى الناتج المطلوب (الرتبة ، الدورة) = ${ltr("(1 , 4)")}`)
        ]),
        par(`<b>${B("Step 3.", "الخطوة 3.")}</b> ${B("Substitute n = 4 in every option and see which one gives (1 , 4) in the right order:", "عوّض بـ n = 4 في كل اختيار وشوف أنهي واحد بيدّي (1 , 4) بنفس الترتيب:")}`) +
        tbl([B("Option", "الاختيار"), B("Value when n = 4", "قيمته لما n = 4"), B("Result", "النتيجة")], [
          [ltr("(n−1) , n"), ltr("3 , 4"), no(B("Wrong", "غلط"))],
          [ltr("(n−2) , n"), ltr("2 , 4"), no(B("Wrong", "غلط"))],
          { k: "good", c: [ltr("(n−3) , n"), ltr("1 , 4"), ok(B("Correct", "صح"))] },
          [ltr("n , (n−3)"), ltr("4 , 1"), no(B("Wrong: order reversed", "غلط: الترتيب معكوس"))]
        ]),
        rule(`<b>${B("Answer:", "الإجابة:")}</b> ${ltr("(n−3) , n")}`)
      ] },
      { t: { en: "Common mistakes", ar: "أخطاء شائعة" }, steps: [
        warn(B("Mistake 1: choosing (n−1) , n", "الغلطة 1: اختيار (n−1) , n"), B("You see (n−1) in the question, so it looks right. But (n−1) is the number written before d, not the rank. For the first series it equals 3, while the rank is 1.", "بتشوف (n−1) في السؤال فبتحس إنه صح. لكن (n−1) هو الرقم اللي قبل d مش الرتبة. في السلسلة الأولى قيمته 3 لكن الرتبة 1.")),
        warn(B("Mistake 2: swapping rank and period", "الغلطة 2: عكس الرتبة والدورة"), B("Always write rank first, then period. If an option puts n first, it gives the period as the rank, which is wrong.", "اكتب الرتبة الأول وبعدين الدورة. أي اختيار بيبدأ بـ n بيعتبر الدورة هي الرتبة وده غلط.")),
        warn(B("Mistake 3: thinking the period is (n−1)", "الغلطة 3: تفتكر إن الدورة هي (n−1)"), B("The d level is one level behind the period. The period is n, not n−1. The first series is in period 4, not 3.", "المستوى d متأخر عن الدورة بواحد. الدورة هي n مش n−1. السلسلة الأولى في الدورة 4 مش 3.")),
        warn(B("Mistake 4: counting rank from period 1", "الغلطة 4: تعد الرتبة من الدورة 1"), B("Periods 1, 2 and 3 have no transition series, so the rank starts counting at period 4. Rank = n − 3.", "الدورات 1 و 2 و 3 مفيهاش سلاسل انتقالية، فالرتبة بتبدأ من الدورة 4. الرتبة = n − 3."))
      ] },
      { t: { en: "Summary", ar: "الملخص" }, steps: [
        rule(`<b>1.</b> ${B("(n−1) is the number written before d. So n = that number + 1.", "(n−1) هو الرقم اللي قبل d. يبقى n = الرقم ده + 1.")}`),
        rule(`<b>2.</b> ${B("Period = n.", "الدورة = n.")}`),
        rule(`<b>3.</b> ${B("Rank = n − 3.", "الرتبة = n − 3.")}`),
        tbl([B("Sublevel", "المستوى"), B("Rank", "الرتبة"), B("Period", "الدورة")], SER.map(([d, p, r]) => [ltr(d + "d"), String(r), String(p)])),
        note(B("Exam shortcut: put n = 4 in each option. The correct option must give (rank , period) = (1 , 4).", "اختصار للامتحان: عوّض بـ n = 4 في كل اختيار. الاختيار الصح لازم يدّي (الرتبة ، الدورة) = (1 , 4).")),
        par(`<b>${B("You are ready. Press the button below to start the practice rounds.", "كده جاهز. دوس على الزرار اللي تحت وابدأ جولات التدريب.")}</b>`)
      ] }
    ]
  };

  /* ============================================================
     الدرس 2 : الدورة والمجموعة من المستويات والأوربيتالات
     ============================================================ */
  const Q2TXT = (a, b, c) => B(
    `A transition element whose electrons are spread over ${a ? hl("a", "a number of principal levels equal to the number of main transition series") : "a number of principal levels equal to the number of main transition series"}, and whose ${b ? hl("b", "occupied orbitals equal the number of columns of the s and d blocks") : "occupied orbitals equal the number of columns of the s and d blocks"}, lies in ${c ? hl("c", "........") : "........"} of the periodic table.`,
    `عنصر انتقالي ${a ? hl("a", "بتتوزع إلكتروناته في عدد من المستويات الرئيسية يساوي عدد السلاسل الانتقالية الرئيسية") : "بتتوزع إلكتروناته في عدد من المستويات الرئيسية يساوي عدد السلاسل الانتقالية الرئيسية"}، و${b ? hl("b", "عدد الأوربيتالات المشغولة بالإلكترونات يساوي مجموع عدد أعمدة الفئتين s , d") : "عدد الأوربيتالات المشغولة بالإلكترونات يساوي مجموع عدد أعمدة الفئتين s , d"}، فإنه يقع في ${c ? hl("c", "........") : "........"} من الجدول الدوري.`);

  const L2 = {
    id: "pg", no: "02",
    title: { en: "Period and group from levels and orbitals", ar: "الدورة والمجموعة من المستويات والأوربيتالات" },
    desc: { en: "Question type: levels = number of main series, orbitals = columns of s and d", ar: "نوع السؤال: المستويات = عدد السلاسل الرئيسية، والأوربيتالات = أعمدة s و d" },
    slides: [
      HOW,
      { t: { en: "Split the question into clues", ar: "قسّم السؤال لدلائل" }, steps: [
        ex(Q2TXT(1, 1, 1) + `<div class="nm-opl">${tbl([B("Option", "الاختيار"), B("Period", "الدورة"), B("Group", "المجموعة")], [["a", "4", ltr("IVB")], ["b", "4", ltr("VIB")], ["c", "5", ltr("IVB")], ["d", "5", ltr("VIB")]])}</div>`),
        par(B("The question is long, but it is easy once you split it into clues. It gives two clues and asks for two things.", "السؤال طويل لكنه سهل لما تقسمه لدلائل. هو بيدّيك دليلين وبيطلب حاجتين.")) +
        tbl([B("Part of the question", "جزء السؤال"), B("What it gives you", "بيديك إيه")], [
          [hl("a", B("Electrons spread over levels = number of main transition series", "الإلكترونات موزعة على مستويات = عدد السلاسل الانتقالية الرئيسية")), hl("c", B("the PERIOD", "الدورة"))],
          [hl("b", B("Occupied orbitals = number of columns of s and d", "الأوربيتالات المشغولة = عدد أعمدة s و d")), hl("c", B("the GROUP", "المجموعة"))]
        ]),
        note(B("In the exam, underline each clue and write next to it what it gives. Do this before calculating anything.", "في الامتحان حط خط تحت كل دليل واكتب جنبه بيديك إيه. اعمل كده قبل ما تحسب أي حاجة."))
      ] },
      { t: { en: "Clue A: find the period", ar: "الدليل أ: هات الدورة" }, steps: [
        par(B("The electrons of the element are spread over some principal levels. The question says this number equals the number of main transition series.", "إلكترونات العنصر موزعة على عدد من المستويات الرئيسية. والسؤال بيقول إن العدد ده يساوي عدد السلاسل الانتقالية الرئيسية.")),
        par(B("How many main transition series are there?", "كام سلسلة انتقالية رئيسية عندنا؟")) +
        `<div class="nm-chips">${["3d", "4d", "5d", "6d"].map(s => `<span class="nm-chip a">${ltr(s)}</span>`).join("")}</div>` +
        calc([B("3d, 4d, 5d, 6d  =  4 main series", "3d و 4d و 5d و 6d  =  4 سلاسل رئيسية")]),
        note(B("The 6d series is not complete yet, but it is still counted as one of the main series. So the number is 4, not 3.", "سلسلة 6d لسه ما اتكملتش لكنها بتتحسب ضمن السلاسل الرئيسية. يبقى العدد 4 مش 3.")),
        par(B("So the electrons are spread over 4 principal levels: 1, 2, 3 and 4. The last occupied level is level 4.", "يبقى الإلكترونات موزعة على 4 مستويات رئيسية: 1 و 2 و 3 و 4. وآخر مستوى مشغول هو المستوى 4.")),
        rule(`<b>${B("Result", "النتيجة")}</b> ${B("The last occupied level equals the period number, so the element is in period 4.", "آخر مستوى مشغول = رقم الدورة، يبقى العنصر في الدورة 4.")}`)
      ] },
      { t: { en: "Clue B: the number of orbitals", ar: "الدليل ب: عدد الأوربيتالات" }, steps: [
        par(B("The second clue gives the number of orbitals that hold electrons. To get the number, count the columns of the two blocks.", "الدليل التاني بيدّيك عدد الأوربيتالات اللي فيها إلكترونات. علشان تعرف العدد، عد أعمدة الفئتين.")),
        par(B("The s block has 2 columns (groups IA and IIA). The d block has 10 columns.", "فئة s فيها عمودين (المجموعتين IA و IIA). وفئة d فيها 10 أعمدة.")) + cols12,
        calc([ltr("2 + 10 = " + hl("b", "12"))]),
        rule(`<b>${B("Result", "النتيجة")}</b> ${B("The atom has 12 orbitals occupied by electrons.", "الذرة فيها 12 أوربيتال مشغول بالإلكترونات.")}`),
        par(B("Next question: how do 12 occupied orbitals tell us the group? We count the orbitals one sublevel at a time.", "السؤال اللي بعده: إزاي 12 أوربيتال بيحددوا المجموعة؟ هنعد الأوربيتالات مستوى فرعي مستوى فرعي."))
      ] },
      { t: { en: "Count the occupied orbitals", ar: "عد الأوربيتالات المشغولة" }, steps: [
        par(B("In period 4, electrons fill the sublevels in this order:", "في الدورة 4 الإلكترونات بتملى المستويات الفرعية بالترتيب ده:")) +
        `<div class="nm-chips">${["1s", "2s", "2p", "3s", "3p", "4s", "3d"].map((s, i) => `<span class="nm-chip ${i === 6 ? "b" : ""}">${ltr(s)}</span>`).join("")}</div>`,
        par(B("Every sublevel has a known number of orbitals: s has 1, p has 3, d has 5. Count them with a running total:", "كل مستوى فرعي له عدد معروف من الأوربيتالات: s فيه 1، و p فيه 3، و d فيه 5. عدّهم بمجموع تراكمي:")) +
        tbl([B("Sublevel", "المستوى الفرعي"), B("Orbitals", "عدد الأوربيتالات"), B("Running total", "المجموع لحد دلوقتي")], [
          [ltr("1s"), "1", "1"], [ltr("2s"), "1", "2"], [ltr("2p"), "3", "5"], [ltr("3s"), "1", "6"], [ltr("3p"), "3", "9"], { k: "good", c: [ltr("4s"), "1", "10"] }
        ]),
        par(B("After 4s there are 10 fully counted orbitals, and 3d comes next. The question says the total is 12.", "بعد 4s يبقى معانا 10 أوربيتالات اتعدّوا، وبعدهم جاي 3d. والسؤال قال إن المجموع 12.")) +
        calc([ltr(`12 − 10 = ${hl("b", "2")}`), B("So two orbitals of 3d are occupied.", "يبقى أوربيتالين من 3d مشغولين.")]),
        par(B("Hund's rule: electrons first occupy separate orbitals of the same sublevel and pair up only later. So 2 occupied orbitals in 3d means 2 electrons: 3d².", "قاعدة هوند: الإلكترونات بتدخل أوربيتالات منفصلة في نفس المستوى الفرعي الأول وبعدين بتتزاوج. يعني أوربيتالين مشغولين في 3d معناها إلكترونين: 3d².")),
        rule(`<b>${B("Result", "النتيجة")}</b> ${ltr("4s² 3d²")} ${B("which is the element titanium (Ti).", "وده عنصر التيتانيوم (Ti).")}`)
      ] },
      { t: { en: "Find the group", ar: "هات المجموعة" }, steps: [
        big(ltr("4s² 3d²")),
        par(B("The group of a main transition element is decided by its valence electrons: the electrons of 4s plus the electrons of 3d.", "مجموعة العنصر الانتقالي الرئيسي بتتحدد من إلكترونات التكافؤ: إلكترونات 4s زائد إلكترونات 3d.")),
        calc([ltr("2 + 2 = " + hl("b", "4")), B(`4 valence electrons  →  group ${ltr(hl("c", "IVB"))}`, `4 إلكترونات تكافؤ  →  المجموعة ${ltr(hl("c", "IVB"))}`)]),
        note(B("For groups IIIB to VIIB, the Roman number equals the number of valence electrons.", "في المجموعات من IIIB لحد VIIB الرقم الروماني = عدد إلكترونات التكافؤ.")),
        par(`<b>${B("Shortcut and why it works.", "الاختصار وليه بيشتغل.")}</b> ${B("Before 3d there are 10 counted orbitals, and 4s holds 2 electrons. So the d electrons = total orbitals − 10, and group = 2 + (total − 10) = total − 8.", "قبل 3d فيه 10 أوربيتالات معدودة، و 4s فيه إلكترونين. يبقى إلكترونات d = المجموع − 10، والمجموعة = 2 + (المجموع − 10) = المجموع − 8.")}`),
        rule(`<b>${B("Shortcut", "الاختصار")}</b> ${B("Group number = occupied orbitals − 8 (for Sc, Ti and V).", "رقم المجموعة = الأوربيتالات المشغولة − 8 (للعناصر Sc و Ti و V).")}`),
        tbl([B("Element", "العنصر"), B("Occupied orbitals", "الأوربيتالات المشغولة"), B("Group", "المجموعة")], [
          ["Sc", "11", ltr("3  →  IIIB")], { k: "good", c: ["Ti", "12", ltr("4  →  IVB")] }, ["V", "13", ltr("5  →  VB")]
        ]),
        warn(B("When the shortcut does not work", "لما الاختصار ميشتغلش"), B("Starting from Cr, all five 3d orbitals are occupied, so the total is 15 for the rest of the series. Then you must use the valence electrons, not the shortcut.", "من الكروم Cr وما بعده كل أوربيتالات 3d الخمسة بتبقى مشغولة، فالمجموع 15 لباقي السلسلة. وقتها استخدم إلكترونات التكافؤ مش الاختصار."))
      ] },
      { t: { en: "Check the options", ar: "راجع الاختيارات" }, steps: [
        par(B("We found: period 4 and group IVB. Now compare with each option:", "إحنا طلعنا: الدورة 4 والمجموعة IVB. دلوقتي قارن بكل اختيار:")) +
        tbl([B("Option", "الاختيار"), B("Verdict", "الحكم"), B("Reason", "السبب")], [
          { k: "good", c: [B("Period 4 and group IVB", "الدورة 4 والمجموعة IVB"), ok(B("Correct", "صح")), B("Matches both clues", "مطابق للدليلين")] },
          [B("Period 5 and group IVB", "الدورة 5 والمجموعة IVB"), no(B("Wrong", "غلط")), B("There are 4 levels, not 5", "المستويات 4 مش 5")],
          [B("Period 4 and group VIB", "الدورة 4 والمجموعة VIB"), no(B("Wrong", "غلط")), B("VIB has 6 valence electrons (Cr), which has 15 occupied orbitals, not 12", "VIB معناها 6 إلكترونات تكافؤ (Cr) وده فيه 15 أوربيتال مشغول مش 12")],
          [B("Period 5 and group VIB", "الدورة 5 والمجموعة VIB"), no(B("Wrong", "غلط")), B("Wrong period and wrong group", "الدورة غلط والمجموعة غلط")]
        ]),
        rule(`<b>${B("Answer:", "الإجابة:")}</b> ${B("Period 4 and group IVB", "الدورة 4 والمجموعة IVB")}`)
      ] },
      { t: { en: "Common mistakes", ar: "أخطاء شائعة" }, steps: [
        warn(B("Mistake 1: counting 3 main series", "الغلطة 1: تعد 3 سلاسل رئيسية"), B("The main series are 3d, 4d, 5d and 6d, so there are 4. This gives period 4.", "السلاسل الرئيسية 3d و 4d و 5d و 6d يعني 4. وده بيدّي الدورة 4.")),
        warn(B("Mistake 2: mixing the two clues", "الغلطة 2: خلط الدليلين"), B("Clue A (levels) gives only the period. Clue B (orbitals) gives only the group. Do not use the number 12 as a period.", "الدليل أ (المستويات) بيدّي الدورة بس. والدليل ب (الأوربيتالات) بيدّي المجموعة بس. ماتستخدمش الرقم 12 كدورة.")),
        warn(B("Mistake 3: counting electrons instead of orbitals", "الغلطة 3: تعد إلكترونات بدل أوربيتالات"), B("The question gives the number of orbitals. An orbital holds up to 2 electrons, so the numbers are different.", "السؤال بيدّي عدد الأوربيتالات. الأوربيتال بيشيل لحد إلكترونين، فالأرقام مختلفة.")),
        warn(B("Mistake 4: subtracting 10 instead of 8 for the group", "الغلطة 4: تطرح 10 بدل 8 للمجموعة"), B("10 gives the number of d electrons, not the group. The group also includes the 2 electrons of 4s, so subtract 8.", "الرقم 10 بيدّي عدد إلكترونات d مش المجموعة. المجموعة بتشمل كمان إلكترونين 4s، فاطرح 8."))
      ] },
      { t: { en: "Summary", ar: "الملخص" }, steps: [
        rule(`<b>1.</b> ${B("Split the question: levels give the period, orbitals give the group.", "قسّم السؤال: المستويات بتدّي الدورة، والأوربيتالات بتدّي المجموعة.")}`),
        rule(`<b>2.</b> ${B("Main transition series are 4, so there are 4 levels and the period is 4.", "السلاسل الرئيسية 4، يبقى 4 مستويات والدورة 4.")}`),
        rule(`<b>3.</b> ${B("s columns + d columns = 2 + 10 = 12 occupied orbitals.", "أعمدة s + أعمدة d = 2 + 10 = 12 أوربيتال مشغول.")}`),
        rule(`<b>4.</b> ${B("12 − 8 = 4, so the group is IVB (titanium, 4s² 3d²).", "12 − 8 = 4، يبقى المجموعة IVB (التيتانيوم، 4s² 3d²).")}`),
        note(B("If the question gives 11 or 13 orbitals instead: 11 − 8 = 3 (IIIB) and 13 − 8 = 5 (VB).", "لو السؤال إدّاك 11 أو 13 أوربيتال بدل 12: 11 − 8 = 3 (IIIB) و 13 − 8 = 5 (VB).")),
        par(`<b>${B("You are ready. Press the button below to start the practice rounds.", "كده جاهز. دوس على الزرار اللي تحت وابدأ جولات التدريب.")}</b>`)
      ] }
    ]
  };
  const LESSONS = [L1, L2];

  /* ============================================================
     بنك الأسئلة : 50 سؤال (25 للدرس 1 + 25 للدرس 2)
     ============================================================ */
  const mc = (stem, correct, wrong, why) => ({ stem, correct, wrong, why });
  const bank1 = [], bank2 = [];

  /* ---- الدرس 1 ---- */
  bank1.push(mc(Q1TXT(0, 0, 0), ltr("(n−3) , n"), [ltr("(n−1) , n"), ltr("(n−2) , n"), ltr("n , (n−3)")],
    B("Put n = 4 (the 3d series): rank 1, period 4. Only (n−3) , n gives (1 , 4) in the order (rank , period).", "عوّض بـ n = 4 (سلسلة 3d): الرتبة 1 والدورة 4. (n−3) , n بس هي اللي بتدّي (1 , 4) بترتيب (الرتبة ، الدورة).")));
  const pairShow = o => B(`rank ${o[0]} , period ${o[1]}`, `الرتبة ${o[0]} ، الدورة ${o[1]}`);
  SER.forEach(([d, p, r]) => bank1.push(mc(
    B(`The series in which the ${d}d sublevel is being filled has (rank , period) = ?`, `السلسلة اللي بيتملى فيها المستوى ${ltr(d + "d")} رتبتها ودورتها (الرتبة ، الدورة) = ؟`),
    pairShow([r, p]), [[p, r], [d, p], [r, d]].map(pairShow),
    B(`(n−1) = ${d}, so n = ${p}. Period = ${p}, rank = ${p} − 3 = ${r}.`, `(n−1) = ${d} يعني n = ${p}. الدورة = ${p}، والرتبة = ${p} − 3 = ${r}.`))));
  SER.forEach(([d, p, r]) => bank1.push(mc(
    B(`The transition series in which ${d}d is being filled has rank = ?`, `رتبة السلسلة الانتقالية اللي بيتملى فيها ${ltr(d + "d")} = ؟`),
    num(r), [p, d, d - 1].map(num),
    B(`n = ${d} + 1 = ${p}, then rank = n − 3 = ${r}.`, `n = ${d} + 1 = ${p}، وبعدين الرتبة = n − 3 = ${r}.`))));
  SER.forEach(([d, p, r]) => bank1.push(mc(
    B(`The transition series in which ${d}d is being filled lies in period = ?`, `السلسلة الانتقالية اللي بيتملى فيها ${ltr(d + "d")} بتقع في الدورة رقم = ؟`),
    num(p), [r, d, d - 1].map(num),
    B(`The period equals n, and n = (n−1) + 1 = ${d} + 1 = ${p}.`, `الدورة = n، و n = (n−1) + 1 = ${d} + 1 = ${p}.`))));
  SER.forEach(([d, p, r]) => bank1.push(mc(
    B(`The transition series of rank ${r} lies in period = ?`, `السلسلة الانتقالية رتبتها ${r} بتقع في الدورة رقم = ؟`),
    num(p), [r, p - 1, p + 1].map(num),
    B(`Rank = n − 3, so n = ${r} + 3 = ${p}, and the period equals n.`, `الرتبة = n − 3، يعني n = ${r} + 3 = ${p}، والدورة = n.`))));
  SER.forEach(([d, p, r]) => bank1.push(mc(
    B(`The transition series that lies in period ${p} fills the sublevel:`, `السلسلة الانتقالية اللي في الدورة ${p} بيتملى فيها المستوى:`),
    ltr(d + "d"), SER.filter(x => x[0] !== d).map(x => ltr(x[0] + "d")),
    B(`n = ${p}, so (n−1) = ${d}, which is the ${d}d sublevel.`, `n = ${p}، يعني (n−1) = ${d}، وده المستوى ${ltr(d + "d")}.`))));
  bank1.push(mc(
    B("The rank of a transition series in terms of the period number n is:", "رتبة السلسلة الانتقالية بدلالة رقم الدورة n هي:"),
    ltr("n − 3"), [ltr("n − 2"), ltr("n − 1"), ltr("n")],
    B("Periods 1, 2 and 3 have no transition series, so we subtract 3. Check: period 4 gives rank 1.", "الدورات 1 و 2 و 3 مفيهاش سلاسل انتقالية، فبنطرح 3. اتأكد: الدورة 4 بتدّي الرتبة 1.")));
  bank1.push(mc(
    B("In the expression (n−1)d, the letter n represents:", "في التعبير (n−1)d الحرف n بيمثل:"),
    B("the period number", "رقم الدورة"), [B("the rank of the series", "رتبة السلسلة"), B("the group number", "رقم المجموعة"), B("the number of d electrons", "عدد إلكترونات d")],
    B("n is the outer principal level, which is the period number.", "n هو المستوى الرئيسي الخارجي، وده هو رقم الدورة.")));
  bank1.push(mc(
    B("The first period that contains transition elements is period:", "أول دورة فيها عناصر انتقالية هي الدورة رقم:"),
    num(4), [3, 5, 2].map(num),
    B("The d sublevel first appears in period 4 (3d, after 4s).", "المستوى d بيظهر لأول مرة في الدورة 4 (3d بعد 4s).")));
  bank1.push(mc(
    B("The number of periods that contain no transition elements is:", "عدد الدورات اللي مفيهاش عناصر انتقالية هو:"),
    num(3), [2, 4, 1].map(num),
    B("Periods 1, 2 and 3 have no d sublevel, so they have no transition elements.", "الدورات 1 و 2 و 3 مفيهاش المستوى d، فمفيهاش عناصر انتقالية.")));

  /* ---- الدرس 2 ---- */
  const GRP = ["IIIB", "IVB", "VB", "VIB", "VIIB"];
  const grpOpts = (right, pool) => pool.filter(g => g !== right).slice(0, 3).map(ltr);
  bank2.push(mc(Q2TXT(0, 0, 0), B("Period 4 and group IVB", "الدورة 4 والمجموعة IVB"),
    [B("Period 4 and group VIB", "الدورة 4 والمجموعة VIB"), B("Period 5 and group IVB", "الدورة 5 والمجموعة IVB"), B("Period 5 and group VIB", "الدورة 5 والمجموعة VIB")],
    B("4 main series, so period 4. 12 occupied orbitals, so 12 − 8 = 4, which is group IVB (Ti).", "4 سلاسل رئيسية يعني الدورة 4. و 12 أوربيتال مشغول يعني 12 − 8 = 4 وده المجموعة IVB (Ti).")));
  [[11, 0], [13, 2]].forEach(([k, gi]) => bank2.push(mc(
    B(`A transition element in period 4 has ${k} orbitals occupied by electrons. It lies in group:`, `عنصر انتقالي في الدورة 4 فيه ${k} أوربيتال مشغول بالإلكترونات. بيقع في المجموعة:`),
    ltr(GRP[gi]), grpOpts(GRP[gi], ["IIIB", "IVB", "VB", "VIB"]),
    B(`${k} − 8 = ${k - 8}, so the group is ${GRP[gi]}.`, `${k} − 8 = ${k - 8}، يبقى المجموعة ${ltr(GRP[gi])}.`))));
  [[12, 2], [11, 1], [13, 3]].forEach(([k, e]) => bank2.push(mc(
    B(`A period 4 transition element with ${k} occupied orbitals has ........ electrons in its 3d sublevel.`, `عنصر انتقالي في الدورة 4 فيه ${k} أوربيتال مشغول، عدد إلكترونات المستوى ${ltr("3d")} فيه = ........`),
    num(e), [1, 2, 3, 4].filter(x => x !== e).map(num),
    B(`10 orbitals are counted up to 4s, so ${k} − 10 = ${e} orbitals in 3d. By Hund's rule, ${e} orbitals hold ${e} electron${e > 1 ? "s" : ""}.`, `10 أوربيتالات اتعدّوا لحد 4s، يبقى ${k} − 10 = ${e} أوربيتال في 3d. وبقاعدة هوند ${e} أوربيتال = ${e} إلكترون.`))));
  [[12, "Ti", ["Sc", "V", "Cr"]], [11, "Sc", ["Ti", "V", "Cr"]], [13, "V", ["Sc", "Ti", "Cr"]]].forEach(([k, el, w]) => bank2.push(mc(
    B(`Which period 4 element has ${k} occupied orbitals?`, `أنهي عنصر في الدورة 4 فيه ${k} أوربيتال مشغول؟`),
    ltr(el), w.map(ltr),
    B(`${k} − 10 = ${k - 10} orbitals in 3d, so the configuration is 4s² 3d${k - 10}, which is ${el}.`, `${k} − 10 = ${k - 10} في 3d، يبقى التوزيع 4s² 3d${k - 10} وده العنصر ${el}.`))));
  [["Ti", 12, [10, 11, 13], "4s² 3d²"], ["Sc", 11, [10, 12, 13], "4s² 3d¹"], ["V", 13, [11, 12, 15], "4s² 3d³"], ["Cr", 15, [13, 14, 16], "4s¹ 3d⁵"], ["Zn", 15, [12, 13, 16], "4s² 3d¹⁰"]].forEach(([el, t, w, cf]) => bank2.push(mc(
    B(`The number of occupied orbitals in an atom of ${el} is:`, `عدد الأوربيتالات المشغولة بالإلكترونات في ذرة ${el} هو:`),
    num(t), w.map(num),
    B(`Up to 3p there are 9 orbitals. Configuration ${cf}: 9 + 1 (4s) + ${t - 10} (3d) = ${t}.`, `لحد 3p فيه 9 أوربيتالات. التوزيع ${ltr(cf)}: 9 + 1 (4s) + ${t - 10} (3d) = ${t}.`))));
  bank2.push(mc(
    B("In a period 4 transition element, the number of orbitals counted from 1s to 4s, before 3d starts to fill, is:", "في العنصر الانتقالي من الدورة 4، عدد الأوربيتالات من 1s لحد 4s قبل ما 3d يبدأ يتملى هو:"),
    num(10), [8, 9, 12].map(num),
    B("1s(1) + 2s(1) + 2p(3) + 3s(1) + 3p(3) + 4s(1) = 10.", "1s(1) + 2s(1) + 2p(3) + 3s(1) + 3p(3) + 4s(1) = 10.")));
  bank2.push(mc(
    B("The number of orbitals from 1s to 3p is:", "عدد الأوربيتالات من 1s لحد 3p هو:"),
    num(9), [8, 10, 18].map(num),
    B("1 + 1 + 3 + 1 + 3 = 9 orbitals. (18 is the number of electrons, not orbitals.)", "1 + 1 + 3 + 1 + 3 = 9 أوربيتالات. (الرقم 18 ده عدد إلكترونات مش أوربيتالات.)")));
  bank2.push(mc(
    B("The sum of the number of columns of the s block and the d block is:", "مجموع عدد أعمدة الفئتين s و d هو:"),
    num(12), [10, 14, 8].map(num),
    B("s block = 2 columns, d block = 10 columns, so 2 + 10 = 12.", "فئة s = عمودين، وفئة d = 10 أعمدة، يعني 2 + 10 = 12.")));
  bank2.push(mc(
    B("For Sc, Ti and V, the group number = the number of occupied orbitals − ........", "للعناصر Sc و Ti و V رقم المجموعة = عدد الأوربيتالات المشغولة − ........"),
    num(8), [6, 10, 12].map(num),
    B("Group = 2 (4s) + d electrons = 2 + (orbitals − 10) = orbitals − 8.", "المجموعة = 2 (4s) + إلكترونات d = 2 + (الأوربيتالات − 10) = الأوربيتالات − 8.")));
  bank2.push(mc(
    B("The electrons of a period 4 transition element are spread over ........ principal levels.", "إلكترونات العنصر الانتقالي في الدورة 4 موزعة على ........ مستويات رئيسية."),
    num(4), [3, 5, 6].map(num),
    B("The period number equals the number of the last occupied principal level.", "رقم الدورة = رقم آخر مستوى رئيسي مشغول.")));
  bank2.push(mc(
    B("An element's electrons are spread over principal levels equal to the number of main transition series. It lies in period:", "عنصر إلكتروناته موزعة على مستويات رئيسية عددها يساوي عدد السلاسل الانتقالية الرئيسية. بيقع في الدورة:"),
    num(4), [3, 5, 6].map(num),
    B("There are 4 main series (3d, 4d, 5d, 6d), so 4 levels and period 4.", "فيه 4 سلاسل رئيسية (3d و 4d و 5d و 6d) يعني 4 مستويات والدورة 4.")));
  bank2.push(mc(
    B("The group of the chromium atom (4s¹ 3d⁵) is:", "مجموعة ذرة الكروم (4s¹ 3d⁵) هي:"),
    ltr("VIB"), ["IVB", "VB", "VIIB"].map(ltr),
    B("1 + 5 = 6 valence electrons, so group VIB. The shortcut (orbitals − 8) cannot be used here.", "1 + 5 = 6 إلكترونات تكافؤ، يبقى المجموعة VIB. والاختصار (الأوربيتالات − 8) مينفعش هنا.")));
  bank2.push(mc(
    B("Which of these elements has all five 3d orbitals occupied (15 occupied orbitals in total)?", "أنهي من العناصر دي كل أوربيتالات 3d الخمسة فيه مشغولة (المجموع 15 أوربيتال)؟"),
    ltr("Cr"), ["Sc", "Ti", "V"].map(ltr),
    B("Cr has 3d⁵, one electron in each of the five 3d orbitals. Sc, Ti and V have only 1, 2 and 3 occupied 3d orbitals.", "الكروم فيه 3d⁵ يعني إلكترون في كل أوربيتال من الخمسة. أما Sc و Ti و V فيهم 1 و 2 و 3 أوربيتال بس في 3d.")));
  [["IIIB", 11, [10, 12, 13]], ["VB", 13, [11, 12, 15]]].forEach(([g, t, w]) => bank2.push(mc(
    B(`A period 4 transition element in group ${g} has ........ occupied orbitals.`, `عنصر انتقالي في الدورة 4 في المجموعة ${ltr(g)} عدد الأوربيتالات المشغولة فيه = ........`),
    num(t), w.map(num),
    B(`Orbitals = group + 8 = ${t - 8} + 8 = ${t}.`, `الأوربيتالات = المجموعة + 8 = ${t - 8} + 8 = ${t}.`))));
  bank2.push(mc(
    B("The number of main transition series is:", "عدد السلاسل الانتقالية الرئيسية هو:"),
    num(4), [3, 5, 6].map(num),
    B("The 3d, 4d, 5d and 6d series. The 6d series is incomplete but still counted.", "سلاسل 3d و 4d و 5d و 6d. سلسلة 6d لسه ما اتكملتش لكنها بتتعد.")));

  /* توزيع الأسئلة: كل جولة فيها 5 أسئلة من كل درس (متنوعة) */
  const ROUNDS = Array.from({ length: 5 }, (_, r) => bank1.filter((_, j) => j % 5 === r).concat(bank2.filter((_, j) => j % 5 === r)));
  const inst = q => { const o = shuffle([{ h: q.correct, ok: 1 }].concat(q.wrong.map(h => ({ h, ok: 0 })))); return { q, opts: o, ans: o.findIndex(x => x.ok) }; };

  /* ============ CSS ============ */
  const CSS = `
.nm-wrap{max-width:1000px;margin:6px auto 44px;padding:0 14px;font-family:Inter,Cairo,sans-serif;color:#1f2d3a;--navy:#12355b;--teal:#0f766e;--line:#d6e2ec;--mut:#5b6b7b;--soft:#f4f7fa;--a:#0e7490;--b:#b45309;--c:#6d28d9;--ok:#15803d;--no:#b91c1c}
.nm-ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}
.nm-sec{margin:26px 0 10px;font-size:1.15em;color:var(--navy);display:flex;align-items:center;gap:10px}
.nm-sec::after{content:"";flex:1;height:1px;background:var(--line)}
.nm-how{background:#fff;border:1px solid var(--line);border-inline-start:5px solid var(--navy);border-radius:10px;padding:16px 20px}
.nm-how h4{margin:0 0 10px;color:var(--navy);font-size:1.05em}
.nm-how ol{margin:0;padding-inline-start:22px;line-height:2.1}
.nm-lessons{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(290px,1fr))}
.nm-lesson{position:relative;text-align:start;background:#fff;border:1px solid var(--line);border-radius:10px;padding:18px 20px;cursor:pointer;font-family:inherit;color:inherit;transition:.2s;display:flex;flex-direction:column;gap:6px}
.nm-lesson:hover{border-color:var(--navy);box-shadow:0 6px 18px rgba(18,53,91,.12);transform:translateY(-2px)}
.nm-lesson .no{font:800 1.6em Inter,sans-serif;color:var(--navy);letter-spacing:1px}
.nm-lesson h3{margin:0;font-size:1.05em;line-height:1.7}.nm-lesson p{margin:0;color:var(--mut);line-height:1.8;font-size:.92em}
.nm-lesson .st{margin-top:6px;font-size:.82em;color:var(--mut)}
.nm-pill{display:inline-block;border-radius:99px;padding:2px 12px;font-size:.78em;font-weight:800;background:#e8eef4;color:var(--navy)}
.nm-pill.ok{background:#dcfce7;color:#166534}
.nm-tot{background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px 18px;display:flex;flex-direction:column;gap:8px}
.nm-tot b{color:var(--navy)}
.nm-bar{height:8px;background:#e6edf3;border-radius:99px;overflow:hidden}.nm-bar i{display:block;height:100%;background:var(--teal);transition:width .4s}
.nm-rounds{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin-top:12px}
.nm-round{text-align:start;background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px 16px;cursor:pointer;font-family:inherit;color:inherit;display:flex;flex-direction:column;gap:4px;transition:.2s}
.nm-round:hover{border-color:var(--teal);box-shadow:0 6px 16px rgba(15,118,110,.14);transform:translateY(-2px)}
.nm-round b{color:var(--navy);font-size:1.02em}.nm-round span{color:var(--mut);font-size:.86em}.nm-round em{font-style:normal;font-weight:800;font-size:.95em}
.nm-top{display:flex;align-items:center;gap:12px;margin:6px 0 12px}.nm-top h3{margin:0;flex:1;font-size:1em;color:var(--navy)}
.nm-ghost,.nm-btn{border-radius:8px;padding:9px 18px;font:700 .9em Inter,Cairo,sans-serif;cursor:pointer;transition:.18s;border:1px solid var(--line);background:#fff;color:var(--navy)}
.nm-ghost:hover,.nm-btn:hover:not([disabled]){border-color:var(--navy);background:#f1f5f9}
.nm-btn.pri{background:var(--navy);border-color:var(--navy);color:#fff}.nm-btn.pri:hover:not([disabled]){background:#0c2744}
.nm-btn[disabled]{opacity:.4;cursor:default}
.nm-stage{background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden;box-shadow:0 8px 28px rgba(18,53,91,.1);display:flex;flex-direction:column;height:clamp(470px,calc(100vh - 250px),720px);cursor:pointer;user-select:text}
.nm-head{background:var(--navy);color:#fff;padding:12px 22px;display:flex;align-items:center;justify-content:space-between;gap:14px}
.nm-head small{opacity:.7;font-size:.78em;display:block;letter-spacing:.5px}.nm-head h4{margin:2px 0 0;font-size:1.1em;line-height:1.5}
.nm-hc{font-size:.82em;opacity:.9;white-space:nowrap;background:rgba(255,255,255,.14);border-radius:99px;padding:3px 12px}
.nm-body{flex:1;overflow:auto;padding:20px 26px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth}
.nm-step{display:none;border-inline-start:4px solid transparent;padding-inline-start:14px}
.nm-step.on{display:block;animation:nm-in .45s ease both}.nm-step.cur{border-inline-start-color:var(--teal)}
@keyframes nm-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.nm-foot{border-top:1px solid var(--line);background:var(--soft);padding:9px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:.88em;color:var(--mut)}
.nm-hint{display:flex;align-items:center;gap:8px;font-weight:700;color:var(--navy)}
.nm-hint::before{content:"";width:9px;height:9px;border-radius:50%;background:var(--teal);animation:nm-pulse 1.4s infinite}
.nm-hint.end::before{background:#94a3b8;animation:none}
@keyframes nm-pulse{50%{box-shadow:0 0 0 7px rgba(15,118,110,.18)}}
.nm-segs{display:flex;gap:4px}.nm-segs i{width:22px;height:5px;border-radius:3px;background:#cbd5e1}.nm-segs i.on{background:var(--teal)}
.nm-p{margin:0;line-height:2.05;font-size:1.04em}
.nm-ex{background:var(--soft);border:1px solid var(--line);border-radius:8px;padding:14px 18px;line-height:2.1;font-weight:600;font-size:1.02em}
.nm-note{background:#fffbeb;border:1px solid #f3dca0;border-radius:8px;padding:11px 16px;line-height:2;font-size:.98em}
.nm-rule{background:#eef4fa;border:1px solid #b9cde2;border-inline-start:5px solid var(--navy);border-radius:8px;padding:11px 16px;line-height:2;font-size:1.02em}
.nm-warn{display:flex;flex-direction:column;gap:2px;background:#fef2f2;border:1px solid #f4c4c4;border-inline-start:5px solid var(--no);border-radius:8px;padding:11px 16px;line-height:2}
.nm-warn b{color:var(--no)}
.nm-calc{background:#0f2237;color:#e7eef6;border-radius:8px;padding:12px 18px;line-height:2.1;font-weight:700;font-size:1.02em}
.nm-calc .hl-b,.nm-calc .hl-c,.nm-calc .hl-a{background:none}
.nm-big{font:800 2.2em Inter,monospace;text-align:center;direction:ltr;color:var(--navy);padding:4px}
.hl-a,.hl-b,.hl-c{font-weight:800;border-radius:4px;padding:0 4px}
.hl-a{color:var(--a);background:#e0f2f7}.hl-b{color:var(--b);background:#fef0d8}.hl-c{color:var(--c);background:#ede7fb}
.nm-calc .hl-a{color:#67e8f9}.nm-calc .hl-b{color:#fcd34d}.nm-calc .hl-c{color:#c4b5fd}
.nm-tw{overflow-x:auto}
.nm-tbl{width:100%;border-collapse:collapse;font-size:.96em;background:#fff}
.nm-tbl th{background:var(--navy);color:#fff;padding:8px 12px;font-weight:700;text-align:center}
.nm-tbl td{border:1px solid var(--line);padding:8px 12px;text-align:center;line-height:1.8}
.nm-tbl tr.good td{background:#ecfdf3}.nm-tbl tr.dim td{color:#94a3b8;background:var(--soft)}
.nm-tag{display:inline-block;border-radius:6px;padding:1px 10px;font-size:.85em;font-weight:800}
.nm-tag.ok{background:#dcfce7;color:#166534}.nm-tag.no{background:#fee2e2;color:#991b1b}
.nm-chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.nm-chip{border:1.5px solid var(--navy);border-radius:8px;padding:5px 16px;font:800 1em Inter,sans-serif;color:var(--navy);background:#fff}
.nm-chip.a{border-color:var(--a);color:var(--a);background:#e0f2f7}.nm-chip.b{border-color:var(--b);color:var(--b);background:#fef0d8}
.nm-cols{display:grid;grid-template-columns:repeat(12,1fr);gap:5px;direction:ltr;margin-top:8px}
.nm-cols i{height:38px;border-radius:5px}.nm-cols i.s{background:var(--a)}.nm-cols i.d{background:#d97706}
.nm-cols.lab{margin-top:4px}.nm-cols.lab span{text-align:center;font-weight:800;font-size:.85em;border-top:2px solid var(--line);padding-top:3px}
.nm-opl{margin-top:10px;font-weight:500}
.nm-nav{display:flex;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap}
.nm-dots{flex:1;display:flex;gap:7px;justify-content:center;min-width:120px}
.nm-dot{width:10px;height:10px;border-radius:99px;border:0;background:#cbd5e1;cursor:pointer;padding:0;transition:.25s}
.nm-dot.on{width:30px;background:var(--navy)}.nm-dot.done{background:var(--teal)}
.nm-qcard{background:#fff;border:1px solid var(--line);border-radius:10px;padding:18px 22px;box-shadow:0 8px 28px rgba(18,53,91,.08)}
.nm-qhead{display:flex;justify-content:space-between;font-weight:700;color:var(--navy);margin-bottom:8px;font-size:.95em}
.nm-qs{margin:16px 0;font-size:1.08em;line-height:2.1;font-weight:600}
.nm-opts{display:grid;gap:9px}
.nm-opt{display:flex;align-items:center;gap:12px;text-align:start;border:1.5px solid var(--line);background:#fff;border-radius:8px;padding:10px 14px;font:600 1em Inter,Cairo,sans-serif;color:inherit;cursor:pointer;transition:.15s}
.nm-opt:hover:not([disabled]){border-color:var(--navy);background:#f1f5f9}
.nm-opt .l{flex:none;width:28px;height:28px;border-radius:50%;background:#e8eef4;color:var(--navy);display:flex;align-items:center;justify-content:center;font:800 .85em Inter,sans-serif}
.nm-opt.right{border-color:var(--ok);background:#ecfdf3}.nm-opt.right .l{background:var(--ok);color:#fff}
.nm-opt.wrong{border-color:var(--no);background:#fef2f2}.nm-opt.wrong .l{background:var(--no);color:#fff}
.nm-opt[disabled]{cursor:default}
.nm-why{margin-top:14px;border-radius:8px;padding:12px 16px;line-height:2}
.nm-why.ok{background:#ecfdf3;border:1px solid #b7e4c7}.nm-why.no{background:#fef2f2;border:1px solid #f4c4c4}
.nm-pn{display:flex;justify-content:flex-end;margin-top:14px}
.nm-res{text-align:center;padding:10px 0 4px}
.nm-score{font:800 3.4em Inter,sans-serif;color:var(--navy);direction:ltr;line-height:1.2}
.nm-score small{font-size:.4em;color:var(--mut)}
.nm-grade{font-weight:800;font-size:1.1em;margin:4px 0 14px}
.nm-rev{margin-top:18px;border-top:1px solid var(--line);padding-top:12px}
.nm-rev h4{margin:0 0 10px;color:var(--navy)}
.nm-ri{border:1px solid var(--line);border-inline-start:5px solid var(--no);border-radius:8px;padding:12px 16px;margin-bottom:10px;line-height:2}
.nm-ri .y{color:var(--no);font-weight:700}.nm-ri .c{color:var(--ok);font-weight:700}
.nm-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px}
@media(max-width:560px){.nm-body{padding:16px 14px}.nm-head{padding:10px 14px}.nm-big{font-size:1.7em}.nm-qcard{padding:14px}}
@media(prefers-reduced-motion:reduce){.nm-step.on{animation:none}.nm-hint::before{animation:none}}
`;

  const T = {
    id: "nminus",
    icon: '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font:800 26px Inter,sans-serif;color:#fff;direction:ltr">n−3</div>',
    title: { en: "Solve the (n−1)d questions", ar: "حل أسئلة (n−1)d" },
    desc: { en: "Step-by-step slides that explain each question type, then 50 practice questions with scores.", ar: "شرايح بتشرح كل نوع سؤال خطوة بخطوة، وبعدها 50 سؤال تدريب بدرجات." }
  };

  /* ============ الواجهة ============ */
  function render(box) {
    if (!document.getElementById("nmcss")) { const s = document.createElement("style"); s.id = "nmcss"; s.textContent = CSS; document.head.append(s); }
    box.innerHTML = `<div class="pagehead"><h2>${bi(T.title)}</h2><p>${bi(T.desc)}</p></div><div class="nm-wrap" id="nmroot"></div>`;
    menu(box.querySelector("#nmroot"));
  }

  const best = r => Store.get("nm:r" + r, null);

  function menu(root) {
    const done = Store.get("nm:done", []);
    const total = [0, 1, 2, 3, 4].reduce((a, r) => a + (best(r) || 0), 0), tried = [0, 1, 2, 3, 4].filter(r => best(r) != null).length;
    root.onclick = e => {
      const l = e.target.closest(".nm-lesson"); if (l) return player(root, LESSONS.find(x => x.id === l.dataset.id));
      const r = e.target.closest(".nm-round"); if (r) return practice(root, +r.dataset.r);
    };
    root.ontouchstart = root.ontouchend = null;
    root.innerHTML = `
      <div class="nm-how"><h4>${B("How this tool works", "الأداة دي شغالة إزاي")}</h4><ol>
        <li>${B("Start with Lesson 1, then Lesson 2. Each lesson is a set of slides, like a PowerPoint.", "ابدأ بالدرس الأول وبعده التاني. كل درس عبارة عن شرايح زي البوربوينت.")}</li>
        <li><b>${B("Click on the slide", "دوس على الشريحة")}</b> ${B("(or press the Next button or the Space key) to show the next step of the explanation. Keep clicking until the slide is complete, then click again to go to the next slide.", "(أو زر التالي أو مسافة الكيبورد) علشان تظهر الخطوة اللي بعدها من الشرح. كمّل دوس لحد ما الشريحة تكمل، وبعدها دوس تاني علشان تروح للشريحة اللي بعدها.")}</li>
        <li>${B("After the lessons, solve the practice: 50 questions in 5 rounds of 10. After every round you get your score and a review of your mistakes.", "بعد الدروس حل التدريب: 50 سؤال في 5 جولات، كل جولة 10 أسئلة. بعد كل جولة بتاخد درجتك ومراجعة لأخطائك.")}</li>
      </ol></div>
      <div class="nm-sec">${B("Lessons", "الدروس")}</div>
      <div class="nm-lessons">${LESSONS.map(l => `<button class="nm-lesson" data-id="${l.id}">
        <span class="no">${l.no}</span><h3>${bi(l.title)}</h3><p>${bi(l.desc)}</p>
        <span class="st">${l.slides.length} ${B("slides", "شريحة")} ${done.includes(l.id) ? `<span class="nm-pill ok">${B("Completed", "تم")}</span>` : ""}</span></button>`).join("")}</div>
      <div class="nm-sec">${B("Practice: 50 questions", "التدريب: 50 سؤال")}</div>
      <div class="nm-tot"><div><b>${B("Total of your best scores", "مجموع أفضل درجاتك")}:</b> ${total} / 50 &nbsp;(${Math.round(total * 2)}%)</div>
        <div class="nm-bar"><i style="width:${total * 2}%"></i></div>
        <div style="color:var(--mut);font-size:.88em">${B(`${tried} of 5 rounds attempted. Each round has 10 questions from both lessons.`, `جربت ${tried} من 5 جولات. كل جولة فيها 10 أسئلة من الدرسين.`)}</div></div>
      <div class="nm-rounds">${[0, 1, 2, 3, 4].map(r => { const b = best(r); return `<button class="nm-round" data-r="${r}"><b>${B(`Round ${r + 1}`, `الجولة ${r + 1}`)}</b>
        <span>${B("10 questions", "10 أسئلة")}</span><em>${b == null ? `<span>${B("Not attempted", "لسه ما جربتهاش")}</span>` : B(`Best: ${b} / 10`, `أفضل درجة: ${b} / 10`)}</em></button>`; }).join("")}</div>`;
  }

  /* ---------- مشغّل الشرائح ---------- */
  function player(root, L) {
    let i = 0, k = 1, tx = 0;
    const n = L.slides.length, last = n - 1;
    const stepsOf = () => L.slides[i].steps;

    const hintText = () => {
      const m = stepsOf().length;
      if (k < m) return B("Click the slide to show the next step", "دوس على الشريحة علشان تظهر الخطوة اللي بعدها");
      return i < last ? B("Slide complete. Click to go to the next slide", "الشريحة كملت. دوس علشان تروح للشريحة اللي بعدها") : B("Lesson complete. Start the practice rounds", "الدرس خلص. ابدأ جولات التدريب");
    };
    const nextLabel = () => stepsOf().length > k ? B("Next step", "الخطوة التالية") : i < last ? B("Next slide", "الشريحة التالية") : B("Go to practice", "روح للتدريب");

    const refresh = () => {
      const m = stepsOf().length, st = root.querySelectorAll(".nm-step");
      st.forEach((s, x) => { s.classList.toggle("on", x < k); s.classList.toggle("cur", x === k - 1 && m > 1); });
      const hint = root.querySelector(".nm-hint"); hint.innerHTML = hintText(); hint.classList.toggle("end", k >= m && i === last);
      root.querySelector(".nm-hc").innerHTML = B(`Step ${k} / ${m}`, `الخطوة ${k} / ${m}`);
      root.querySelector(".nm-segs").innerHTML = Array.from({ length: m }, (_, x) => `<i class="${x < k ? "on" : ""}"></i>`).join("");
      const nb = root.querySelector(".nm-next"); nb.innerHTML = nextLabel(); nb.classList.toggle("pri", k >= m && i === last);
      const cur = st[k - 1]; if (cur) { const bd = root.querySelector(".nm-body"); bd.scrollTop = Math.max(0, cur.offsetTop - bd.offsetTop - 12); }
    };

    const draw = () => {
      const sl = L.slides[i], seen = Store.get("nm:done", []).includes(L.id);
      root.innerHTML = `<div class="nm-top"><button class="nm-ghost nm-back">${B("Back to menu", "رجوع للقائمة")}</button><h3>${bi(L.title)}</h3></div>
        <div class="nm-stage"><div class="nm-head"><div><small>${B(`Slide ${i + 1} of${n}`, `شريحة ${i + 1} من ${n}`)}</small><h4>${bi(sl.t)}</h4></div><div class="nm-hc"></div></div>
          <div class="nm-body">${sl.steps.map(s => `<div class="nm-step">${s}</div>`).join("")}</div>
          <div class="nm-foot"><span class="nm-hint"></span><span class="nm-segs"></span></div></div>
        <div class="nm-nav"><button class="nm-btn nm-prev" ${i === 0 ? "disabled" : ""}>${B("Back", "السابق")}</button>
          <div class="nm-dots">${L.slides.map((_, x) => `<button class="nm-dot ${x === i ? "on" : x < i || seen ? "done" : ""}" data-i="${x}" aria-label="${x + 1}"></button>`).join("")}</div>
          <button class="nm-btn nm-all">${B("Show all", "إظهار الكل")}</button><button class="nm-btn nm-replay">${B("Restart slide", "إعادة الشريحة")}</button>
          <button class="nm-btn nm-next"></button></div>`;
      refresh();
      if (i === last) { const d = Store.get("nm:done", []); if (!d.includes(L.id)) Store.set("nm:done", d.concat(L.id)); }
    };
    const go = (x, full) => { if (x < 0 || x >= n) return; i = x; k = full ? stepsOf().length : 1; draw(); };
    const advance = () => {
      if (k < stepsOf().length) { k++; return refresh(); }
      if (i < last) return go(i + 1);
      const first = [0, 1, 2, 3, 4].find(r => best(r) == null); practice(root, first == null ? 0 : first);
    };

    root.onclick = e => {
      if (e.target.closest(".nm-back")) return menu(root);
      if (e.target.closest(".nm-next")) return advance();
      if (e.target.closest(".nm-prev")) return go(i - 1, true);
      if (e.target.closest(".nm-all")) { k = stepsOf().length; return refresh(); }
      if (e.target.closest(".nm-replay")) { k = 1; return refresh(); }
      const dt = e.target.closest(".nm-dot"); if (dt) return go(+dt.dataset.i);
      if (e.target.closest(".nm-stage") && !(window.getSelection && String(window.getSelection()))) return advance();
    };
    root.ontouchstart = e => { tx = e.changedTouches[0].clientX; };
    root.ontouchend = e => {
      const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) < 70) return;
      const rtl = getComputedStyle(root).direction === "rtl"; go(i + ((dx < 0) !== rtl ? 1 : -1), true);
    };
    if (window.__nmKey) document.removeEventListener("keydown", window.__nmKey);
    window.__nmKey = e => {
      if (!root.isConnected || !root.querySelector(".nm-stage")) return;
      const rtl = getComputedStyle(root).direction === "rtl";
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); advance(); }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(i - 1, true); }
      else if (e.key === "ArrowRight") go(i + (rtl ? -1 : 1), true);
      else if (e.key === "ArrowLeft") go(i + (rtl ? 1 : -1), true);
    };
    document.addEventListener("keydown", window.__nmKey);
    draw();
  }

  /* ---------- جولات التدريب ---------- */
  function practice(root, r) {
    if (window.__nmKey) { document.removeEventListener("keydown", window.__nmKey); window.__nmKey = null; }
    root.ontouchstart = root.ontouchend = null;
    const qs = shuffle(ROUNDS[r]).map(inst), N = qs.length;
    const st = { i: 0, picked: -1, score: 0, miss: [] };

    const drawQ = () => {
      const x = qs[st.i], answered = st.picked > -1, right = st.picked === x.ans, doneN = st.i + (answered ? 1 : 0);
      root.innerHTML = `<div class="nm-top"><button class="nm-ghost nm-back">${B("Exit round", "خروج من الجولة")}</button><h3>${B(`Practice - Round ${r + 1} of 5`, `التدريب - الجولة ${r + 1} من 5`)}</h3></div>
        <div class="nm-qcard"><div class="nm-qhead"><span>${B(`Question ${st.i + 1} of${N}`, `سؤال ${st.i + 1} من ${N}`)}</span><span>${B("Score", "الدرجة")}: ${st.score} / ${doneN}</span></div>
          <div class="nm-bar"><i style="width:${doneN / N * 100}%"></i></div>
          <div class="nm-qs">${x.q.stem}</div>
          <div class="nm-opts">${x.opts.map((o, j) => `<button class="nm-opt ${answered ? (j === x.ans ? "right" : j === st.picked ? "wrong" : "") : ""}" data-i="${j}" ${answered ? "disabled" : ""}><span class="l">${"ABCD"[j]}</span><span>${o.h}</span></button>`).join("")}</div>
          ${answered ? `<div class="nm-why ${right ? "ok" : "no"}"><b>${right ? B("Correct.", "إجابة صحيحة.") : B("Not correct.", "إجابة غير صحيحة.")}</b> ${x.q.why}</div>
            <div class="nm-pn"><button class="nm-btn pri nm-pnext">${st.i === N - 1 ? B("Finish and see score", "إنهاء وعرض الدرجة") : B("Next question", "السؤال التالي")}</button></div>` : ""}</div>`;
    };

    const drawR = () => {
      const pct = Math.round(st.score / N * 100), prev = best(r);
      if (prev == null || st.score > prev) Store.set("nm:r" + r, st.score);
      const total = [0, 1, 2, 3, 4].reduce((a, q) => a + (best(q) || 0), 0), tried = [0, 1, 2, 3, 4].filter(q => best(q) != null).length;
      const grade = pct >= 90 ? B("Excellent work.", "ممتاز.") : pct >= 70 ? B("Good. Review the mistakes below.", "كويس. راجع الأخطاء اللي تحت.") : pct >= 50 ? B("Fair. Re-read the lessons, then retry this round.", "مقبول. اقرا الدروس تاني وبعدين أعد الجولة.") : B("Go back to the lessons, then try again.", "ارجع للدروس وبعدين جرب تاني.");
      root.innerHTML = `<div class="nm-top"><button class="nm-ghost nm-back">${B("Back to menu", "رجوع للقائمة")}</button><h3>${B(`Round ${r + 1} result`, `نتيجة الجولة ${r + 1}`)}</h3></div>
        <div class="nm-qcard"><div class="nm-res"><div class="nm-score">${st.score}<small> / ${N}</small></div><div>${pct}%</div><div class="nm-grade">${grade}</div>
          <div class="nm-tot"><div><b>${B("Total of your best scores", "مجموع أفضل درجاتك")}:</b> ${total} / 50 &nbsp;(${Math.round(total * 2)}%) &nbsp;-&nbsp; ${B(`${tried} of 5 rounds attempted`, `جربت ${tried} من 5 جولات`)}</div><div class="nm-bar"><i style="width:${total * 2}%"></i></div></div></div>
          <div class="nm-acts">${r < 4 ? `<button class="nm-btn pri" data-a="next">${B(`Start Round ${r + 2}`, `ابدأ الجولة ${r + 2}`)}</button>` : ""}
            <button class="nm-btn" data-a="retry">${B("Retry this round", "أعد الجولة دي")}</button>
            <button class="nm-btn" data-a="lessons">${B("Review the lessons", "راجع الدروس")}</button></div>
          ${st.miss.length ? `<div class="nm-rev"><h4>${B(`Review your mistakes (${st.miss.length})`, `راجع أخطاءك (${st.miss.length})`)}</h4>${st.miss.map(m => `<div class="nm-ri">${m.x.q.stem}
            <div><span class="y">${B("Your answer", "إجابتك")}:</span> ${m.x.opts[m.p].h}</div><div><span class="c">${B("Correct answer", "الإجابة الصحيحة")}:</span> ${m.x.opts[m.x.ans].h}</div><div>${m.x.q.why}</div></div>`).join("")}</div>`
            : `<p style="text-align:center;margin-top:14px">${B("No mistakes in this round.", "مفيش أخطاء في الجولة دي.")}</p>`}</div>`;
    };

    root.onclick = e => {
      if (e.target.closest(".nm-back")) return menu(root);
      const a = e.target.closest("[data-a]");
      if (a) { if (a.dataset.a === "next") return practice(root, r + 1); if (a.dataset.a === "retry") return practice(root, r); return menu(root); }
      if (e.target.closest(".nm-pnext")) { if (st.i === N - 1) return drawR(); st.i++; st.picked = -1; return drawQ(); }
      const o = e.target.closest(".nm-opt");
      if (o && st.picked < 0) { const x = qs[st.i]; st.picked = +o.dataset.i; if (st.picked === x.ans) st.score++; else st.miss.push({ x, p: st.picked }); drawQ(); }
    };
    drawQ();
  }

  T.render = render;
  T._test = { ROUNDS, bank1, bank2, LESSONS };
  TOOLS.nminus = T;
})();