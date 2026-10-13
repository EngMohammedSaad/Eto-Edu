/* ==========================================================
   data/Chem/lecture2.js
   General Chemistry (Chem101) - Lecture 2
   Electronic Structure of Atoms (Part 2): Dual Nature, Line Spectra, Bohr Model, Uncertainty
   ========================================================== */
window.LECTURES = window.LECTURES || {};

window.LECTURES["chem-2"] = {
  id: "chem-2",
  subject: "chem",
  track: "science",
  number: 2,
  title: { en: "Dual Nature, Line Spectra and the Bohr Model", ar: "الطبيعة المزدوجة، أطياف الخطوط ونموذج بور" },
  description: {
    en: "Matter properties of light, de Broglie, hydrogen line spectrum, Rutherford and Bohr models, Heisenberg's uncertainty principle.",
    ar: "الخواص المادية للضوء، دي برولي، طيف الخطوط للهيدروجين، نموذجا رذرفورد وبور، ومبدأ عدم اليقين لهايزنبرج."
  },
  cover: "bohr",

  sections: [
    {
      id: "s1",
      title: { en: "Dual Nature of Light and de Broglie", ar: "الطبيعة المزدوجة للضوء ودي برولي" },
      figures: [
        { img: "dual", caption: { en: "Light and matter behave as both waves and particles", ar: "الضوء والمادة بيتصرفوا كموجة وكجسيم" } }
      ],
      points: [
        {
          en: "Energy has mass: <b>m = E / c<sup>2</sup></b>.",
          ar: "الطاقة ليها كتلة: <b>m = E / c<sup>2</sup></b>."
        },
        {
          en: "Mass of a photon: m = E/c<sup>2</sup> = (hc/λ)/c<sup>2</sup> = <b>h / (c λ)</b>.",
          ar: "كتلة الفوتون: m = E/c<sup>2</sup> = (hc/λ)/c<sup>2</sup> = <b>h / (c λ)</b>."
        },
        {
          en: "Light has wave properties <b>and</b> matter properties: this is the <b>dual nature of light</b>.",
          ar: "الضوء ليه خواص موجية <b>و</b> خواص مادية: ودي <b>الطبيعة المزدوجة للضوء</b>."
        },
        {
          en: "<b>de Broglie:</b> particles also show wave properties. For a particle of mass m and velocity v: <b>λ = h / (m v)</b>.",
          ar: "<b>دي برولي:</b> الجسيمات كمان ليها خواص موجية. لجسيم كتلته m وسرعته v: <b>λ = h / (m v)</b>."
        },
        {
          en: "<b>Baseball</b> (0.146 kg, 44.1 m/s): λ = 6.6 × 10<sup>-34</sup> / (0.146 × 44.1) = <b>1.03 × 10<sup>-34</sup> m</b> → too tiny to detect.",
          ar: "<b>كورة بيسبول</b> (0.146 كجم، 44.1 م/ث): λ = 6.6 × 10<sup>-34</sup> / (0.146 × 44.1) = <b>1.03 × 10<sup>-34</sup> م</b> ← صغير جدًا مفيش جهاز يكتشفه."
        },
        {
          en: "<b>Electron</b> (9.11 × 10<sup>-31</sup> kg, 2.19 × 10<sup>6</sup> m/s): λ = <b>0.332 nm</b> → in the X-ray region, so the wave nature matters for electrons.",
          ar: "<b>إلكترون</b> (9.11 × 10<sup>-31</sup> كجم، 2.19 × 10<sup>6</sup> م/ث): λ = <b>0.332 نانومتر</b> ← في منطقة الأشعة السينية، يعني الطبيعة الموجية مهمة للإلكترونات."
        }
      ],
      examFocus: [
        { en: "de Broglie equation λ = h/mv and when it matters (tiny particles only)", ar: "معادلة دي برولي λ = h/mv ومتى بتفرق (للجسيمات الصغيرة بس)" },
        { en: "Dual nature of light: wave + particle", ar: "الطبيعة المزدوجة للضوء: موجة + جسيم" }
      ],
      key: {
        en: "<b>Careful:</b> convert mass to kg (1 g = 10<sup>-3</sup> kg) and use 1 J·s = kg·m<sup>2</sup>/s.",
        ar: "<b>خد بالك:</b> حوّل الكتلة لكيلوجرام (1 جم = 10<sup>-3</sup> كجم) واستخدم 1 جول·ث = كجم·م<sup>2</sup>/ث."
      }
    },
    {
      id: "s2",
      title: { en: "Line Spectra and the Hydrogen Spectrum", ar: "أطياف الخطوط وطيف الهيدروجين" },
      figures: [
        { img: "lines", caption: { en: "Continuous spectrum vs hydrogen line spectrum", ar: "الطيف المتصل مقابل طيف الخطوط للهيدروجين" } }
      ],
      points: [
        {
          en: "<b>Monochromatic</b> radiation has only one wavelength.",
          ar: "الإشعاع <b>أحادي اللون</b> ليه طول موجي واحد بس."
        },
        {
          en: "<b>Continuous spectrum:</b> white light through a prism gives a rainbow containing all visible wavelengths.",
          ar: "<b>الطيف المتصل:</b> الضوء الأبيض لما يعدي في منشور بيدي قوس قزح فيه كل الأطوال الموجية المرئية."
        },
        {
          en: "<b>Line spectrum:</b> only certain wavelengths appear as separate lines. Each element has its own bright-line pattern (Li, Na, K, H, He, Ne …).",
          ar: "<b>طيف الخطوط:</b> أطوال موجية معينة بس بتظهر كخطوط منفصلة. وكل عنصر ليه نمط خطوط مميز (Li, Na, K, H, He, Ne …)."
        },
        {
          en: "When H<sub>2</sub> gas gets a high-energy spark, atoms become <b>excited</b> and release the extra energy as light: the <b>emission spectrum</b> of hydrogen.",
          ar: "لما غاز H<sub>2</sub> ياخد شرارة عالية الطاقة، الذرات بتتثار وتطلق الطاقة الزايدة كضوء: ده <b>طيف الانبعاث</b> للهيدروجين."
        },
        {
          en: "The H emission spectrum is a <b>line spectrum</b> → only certain energies are allowed → the electron's energy is <b>quantized</b>.",
          ar: "طيف انبعاث H هو <b>طيف خطوط</b> ← طاقات معينة بس مسموحة ← طاقة الإلكترون <b>مكمّاة</b>."
        },
        {
          en: "Colors of excited gases arise because electrons move between energy states. Energy gap: <b>ΔE = hν = hc/λ</b>.",
          ar: "ألوان الغازات المثارة سببها حركة الإلكترونات بين مستويات الطاقة. فرق الطاقة: <b>ΔE = hν = hc/λ</b>."
        }
      ],
      examFocus: [
        { en: "Continuous vs line spectrum", ar: "الفرق بين الطيف المتصل وطيف الخطوط" },
        { en: "Why H gives a line spectrum (quantized energy levels)", ar: "ليه الهيدروجين بيدي طيف خطوط (مستويات طاقة مكمّاة)" }
      ]
    },
    {
      id: "s3",
      title: { en: "Rutherford and Bohr Models", ar: "نموذجا رذرفورد وبور" },
      figures: [
        { img: "bohr", caption: { en: "Bohr model: the electron moves only in allowed circular orbits", ar: "نموذج بور: الإلكترون بيتحرك في مدارات دائرية مسموحة بس" } }
      ],
      points: [
        {
          en: "<b>Rutherford:</b> electrons orbit the nucleus like planets around the sun.",
          ar: "<b>رذرفورد:</b> الإلكترونات بتدور حوالين النواة زي الكواكب حوالين الشمس."
        },
        {
          en: "<b>Problem:</b> a charged particle moving in a circle should lose energy, so the atom should be unstable.",
          ar: "<b>المشكلة:</b> الجسيم المشحون اللي بيتحرك في دايرة المفروض يفقد طاقة، يعني الذرة تبقى غير مستقرة."
        },
        {
          en: "<b>Bohr</b> noticed line spectra and assumed electrons are confined to specific energy states called <b>orbits</b>.",
          ar: "<b>بور</b> لاحظ أطياف الخطوط وافترض إن الإلكترونات محصورة في حالات طاقة محددة اسمها <b>مدارات</b>."
        },
        {
          en: "Bohr's quantum model of hydrogen: a positive nucleus and an electron moving only in certain <b>allowed circular orbits</b> (nucleus attraction keeps it in the circle).",
          ar: "نموذج بور الكمّي للهيدروجين: نواة موجبة وإلكترون بيتحرك في <b>مدارات دائرية مسموحة</b> بس (جذب النواة بيخليه في الدايرة)."
        },
        {
          en: "<b>Angular momentum is quantized:</b> m v r = n (h / 2π), n = 1, 2, 3 …",
          ar: "<b>كمية الحركة الزاوية مكمّاة:</b> m v r = n (h / 2π)، و n = 1، 2، 3 …"
        },
        {
          en: "<b>n = 1</b> is closest to the nucleus with the lowest (most negative) energy; <b>n → ∞</b> corresponds to zero energy.",
          ar: "<b>n = 1</b> أقرب مدار للنواة وطاقته الأقل (الأكثر سالبية)؛ و<b>n → ∞</b> طاقته صفر."
        },
        {
          en: "An electron moves between orbits only by absorbing or emitting energy in quanta (hν): <b>ΔE = E<sub>f</sub> − E<sub>i</sub> = hν</b>.",
          ar: "الإلكترون بينتقل بين المدارات بس لما يمتص أو يطلق طاقة على شكل كمّات (hν): <b>ΔE = E<sub>f</sub> − E<sub>i</sub> = hν</b>."
        }
      ],
      examFocus: [
        { en: "Why Rutherford's model fails and what Bohr assumed", ar: "ليه نموذج رذرفورد بيفشل وإيه افتراضات بور" },
        { en: "mvr = n(h/2π) and meaning of n", ar: "العلاقة mvr = n(h/2π) ومعنى n" }
      ]
    },
    {
      id: "s4",
      title: { en: "Bohr Energy Equation and Hydrogen Series", ar: "معادلة طاقة بور وسلاسل الهيدروجين" },
      figures: [
        { img: "series", caption: { en: "Electron falling to a lower level emits a photon", ar: "الإلكترون لما بينزل لمستوى أقل بيطلق فوتون" } }
      ],
      points: [
        {
          en: "<b>ΔE = hν = hc/λ = (−2.18 × 10<sup>-18</sup> J)(1/n<sub>f</sub><sup>2</sup> − 1/n<sub>i</sub><sup>2</sup>)</b>, where n = principal quantum number (1, 2, 3 …).",
          ar: "<b>ΔE = hν = hc/λ = (−2.18 × 10<sup>-18</sup> J)(1/n<sub>f</sub><sup>2</sup> − 1/n<sub>i</sub><sup>2</sup>)</b>، حيث n هو عدد الكم الرئيسي (1، 2، 3 …)."
        },
        {
          en: "Energy of level n: E<sub>n</sub> = −2.18 × 10<sup>-18</sup> / n<sup>2</sup> J (also written with R<sub>H</sub>).",
          ar: "طاقة المستوى n: E<sub>n</sub> = −2.18 × 10<sup>-18</sup> / n<sup>2</sup> جول (وبتتكتب كمان بـ R<sub>H</sub>)."
        },
        {
          en: "<b>n<sub>i</sub> &gt; n<sub>f</sub></b> → energy is <b>emitted</b>. &nbsp;<b>n<sub>f</sub> &gt; n<sub>i</sub></b> → energy is <b>absorbed</b>.",
          ar: "<b>n<sub>i</sub> &gt; n<sub>f</sub></b> ← الطاقة <b>بتنبعث</b>. &nbsp;<b>n<sub>f</sub> &gt; n<sub>i</sub></b> ← الطاقة <b>بتتمتص</b>."
        },
        {
          en: "<b>Hydrogen series:</b> Lyman (n<sub>f</sub> = 1, ultraviolet) | Balmer (n<sub>f</sub> = 2, visible + UV) | Paschen (n<sub>f</sub> = 3, infrared) | Brackett (n<sub>f</sub> = 4, infrared).",
          ar: "<b>سلاسل الهيدروجين:</b> ليمان (n<sub>f</sub> = 1، فوق بنفسجي) | بالمر (n<sub>f</sub> = 2، مرئي + UV) | باشن (n<sub>f</sub> = 3، تحت حمراء) | براكيت (n<sub>f</sub> = 4، تحت حمراء)."
        },
        {
          en: "<b>Example:</b> electron falls from n = 6 to n = 1.<br>E<sub>6</sub> = −6.05 × 10<sup>-20</sup> J, E<sub>1</sub> = −2.178 × 10<sup>-18</sup> J<br>ΔE = E<sub>1</sub> − E<sub>6</sub> = <b>−2.117 × 10<sup>-18</sup> J</b> (negative: energy lost, atom more stable).<br>λ = hc/ΔE = (6.62 × 10<sup>-34</sup>)(3 × 10<sup>8</sup>) / (2.117 × 10<sup>-18</sup>) ≈ <b>9.38 × 10<sup>-8</sup> m</b>.",
          ar: "<b>مثال:</b> إلكترون نزل من n = 6 إلى n = 1.<br>E<sub>6</sub> = −6.05 × 10<sup>-20</sup> جول، E<sub>1</sub> = −2.178 × 10<sup>-18</sup> جول<br>ΔE = E<sub>1</sub> − E<sub>6</sub> = <b>−2.117 × 10<sup>-18</sup> جول</b> (سالبة: فقد طاقة والذرة بقت أكثر استقرارًا).<br>λ = hc/ΔE = (6.62 × 10<sup>-34</sup>)(3 × 10<sup>8</sup>) / (2.117 × 10<sup>-18</sup>) ≈ <b>9.38 × 10<sup>-8</sup> م</b>."
        }
      ],
      examFocus: [
        { en: "Calculate ΔE and λ for a transition between two levels", ar: "حساب ΔE و λ لانتقال بين مستويين" },
        { en: "Emission vs absorption and the four hydrogen series", ar: "الانبعاث مقابل الامتصاص وسلاسل الهيدروجين الأربعة" }
      ],
      key: {
        en: "<b>Tip:</b> the sign of ΔE tells emitted (−) or absorbed (+); use its absolute value when finding λ.",
        ar: "<b>نصيحة:</b> إشارة ΔE بتقول انبعاث (−) أو امتصاص (+)؛ وخد القيمة المطلقة وإنت بتحسب λ."
      }
    },
    {
      id: "s5",
      title: { en: "Limits of Bohr and Heisenberg's Uncertainty Principle", ar: "حدود نموذج بور ومبدأ عدم اليقين لهايزنبرج" },
      figures: [
        { img: "uncert", caption: { en: "The more we know the position, the less we know the momentum", ar: "كل ما عرفنا المكان أدق، عرفنا كمية الحركة أقل" } }
      ],
      points: [
        {
          en: "<b>Limitations of Bohr:</b> explains only the line spectrum of hydrogen; does not work for other atoms; electrons are not completely described as small particles.",
          ar: "<b>عيوب نموذج بور:</b> بيفسر طيف الخطوط للهيدروجين بس؛ ومبيشتغلش مع باقي الذرات؛ والإلكترونات مش بتتوصف بالكامل كجسيمات صغيرة."
        },
        {
          en: "<b>Heisenberg:</b> for atomic-size particles we cannot determine exactly the <b>position and momentum (speed and direction) at the same time</b>.",
          ar: "<b>هايزنبرج:</b> للجسيمات الذرية مينفعش نحدد بدقة <b>المكان وكمية الحركة (السرعة والاتجاه) في نفس الوقت</b>."
        },
        {
          en: "<b>Δx · Δ(mv) ≥ h / 4π</b>. The more accurately we know the position, the less accurately we know the momentum, and vice versa.",
          ar: "<b>Δx · Δ(mv) ≥ h / 4π</b>. كل ما عرفنا المكان بدقة أكبر، قلت دقة معرفتنا بكمية الحركة، والعكس."
        },
        {
          en: "<b>Example:</b> position known within 1.0 × 10<sup>-11</sup> m. Δv ≥ h/(4π m Δx) = 5.28 × 10<sup>-35</sup> / (m Δx).",
          ar: "<b>مثال:</b> المكان معروف في حدود 1.0 × 10<sup>-11</sup> م. Δv ≥ h/(4π m Δx) = 5.28 × 10<sup>-35</sup> / (m Δx)."
        },
        {
          en: "(a) Baseball, 0.146 kg: Δv ≥ <b>3.62 × 10<sup>-23</sup> m/s</b> (negligible).",
          ar: "(أ) كورة بيسبول 0.146 كجم: Δv ≥ <b>3.62 × 10<sup>-23</sup> م/ث</b> (مهملة)."
        },
        {
          en: "(b) Electron, 9.11 × 10<sup>-31</sup> kg: Δv ≥ <b>5.8 × 10<sup>6</sup> m/s</b> (huge). The principle matters only for tiny particles.",
          ar: "(ب) إلكترون 9.11 × 10<sup>-31</sup> كجم: Δv ≥ <b>5.8 × 10<sup>6</sup> م/ث</b> (ضخمة). يعني المبدأ بيفرق مع الجسيمات الصغيرة بس."
        }
      ],
      examFocus: [
        { en: "State Heisenberg's principle and its equation", ar: "اكتب مبدأ هايزنبرج ومعادلته" },
        { en: "Three limitations of Bohr's model", ar: "ثلاثة عيوب في نموذج بور" }
      ],
      key: {
        en: "<b>Compare:</b> baseball Δv ≈ 10<sup>-23</sup> m/s (ignore) vs electron Δv ≈ 10<sup>6</sup> m/s (huge).",
        ar: "<b>قارن:</b> الكورة Δv ≈ 10<sup>-23</sup> م/ث (تتجاهل) والإلكترون Δv ≈ 10<sup>6</sup> م/ث (ضخمة)."
      }
    }
  ],

  glossary: [
    ["dual nature", "طبيعة مزدوجة (موجة وجسيم)"],
    ["de broglie", "دي برولي"],
    ["monochromatic", "أحادي اللون (طول موجي واحد)"],
    ["continuous spectrum", "الطيف المتصل"],
    ["line spectrum", "طيف الخطوط"],
    ["emission spectrum", "طيف الانبعاث"],
    ["excited atom", "ذرة مثارة"],
    ["prism", "منشور"],
    ["orbit", "مدار"],
    ["principal quantum number", "عدد الكم الرئيسي"],
    ["angular momentum", "كمية الحركة الزاوية"],
    ["energy level", "مستوى الطاقة"],
    ["emitted", "منبعث"],
    ["absorbed", "ممتص"],
    ["lyman series", "سلسلة ليمان (UV)"],
    ["balmer series", "سلسلة بالمر (مرئي)"],
    ["paschen series", "سلسلة باشن (IR)"],
    ["rutherford model", "نموذج رذرفورد"],
    ["bohr model", "نموذج بور"],
    ["uncertainty principle", "مبدأ عدم اليقين"],
    ["momentum", "كمية الحركة"],
    ["position", "المكان / الموضع"]
  ],

  images: {
    "dual": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><defs><clipPath id='c'><rect x='10' y='90' width='170' height='120'/></clipPath></defs><rect width='100%' height='100%' fill='%2312355b'/><text x='200' y='45' fill='%23ffffff' font-family='sans-serif' font-size='18' text-anchor='middle'>Dual Nature</text><g clip-path='url(%23c)'><g><animateTransform attributeName='transform' type='translate' from='0 0' to='-100 0' dur='2.5s' repeatCount='indefinite'/><path d='M -70 150 Q -45 100 -20 150 T 30 150 T 80 150 T 130 150 T 180 150 T 230 150 T 280 150' fill='none' stroke='%2338bdf8' stroke-width='4'/></g></g><text x='200' y='160' fill='%23ffffff' font-family='sans-serif' font-size='34' text-anchor='middle'>+</text><circle cx='260' cy='150' r='20' fill='%23f59e0b'><animate attributeName='cx' values='260;340;260' dur='3s' repeatCount='indefinite'/></circle><text x='95' y='235' fill='%23ffffff' font-family='sans-serif' font-size='14' text-anchor='middle'>Wave</text><text x='300' y='235' fill='%23ffffff' font-family='sans-serif' font-size='14' text-anchor='middle'>Particle</text><text x='200' y='275' fill='%23fbbf24' font-family='sans-serif' font-size='14' text-anchor='middle'>λ = h / mv</text></svg>",
    "lines": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><defs><linearGradient id='g'><stop offset='0' stop-color='%23581c87'/><stop offset='0.25' stop-color='%232563eb'/><stop offset='0.5' stop-color='%2316a34a'/><stop offset='0.75' stop-color='%23eab308'/><stop offset='1' stop-color='%23dc2626'/></linearGradient></defs><rect width='100%' height='100%' fill='%2312355b'/><text x='200' y='38' fill='%23ffffff' font-family='sans-serif' font-size='17' text-anchor='middle'>Continuous vs Line Spectrum</text><text x='30' y='78' fill='%23fbbf24' font-family='sans-serif' font-size='12'>Continuous (white light)</text><rect x='30' y='88' width='340' height='40' fill='url(%23g)'/><text x='30' y='168' fill='%23fbbf24' font-family='sans-serif' font-size='12'>Hydrogen line spectrum</text><rect x='30' y='178' width='340' height='40' fill='%23000000'/><g><rect x='39.5' y='178' width='3' height='40' fill='%23a855f7'/><rect x='77.5' y='178' width='3' height='40' fill='%233b82f6'/><rect x='136.5' y='178' width='3' height='40' fill='%2306b6d4'/><rect x='328.5' y='178' width='3' height='40' fill='%23ef4444'/><animate attributeName='opacity' values='1;0.55;1' dur='3s' repeatCount='indefinite'/></g><text x='30' y='238' fill='%23ffffff' font-family='sans-serif' font-size='11'>400 nm</text><text x='370' y='238' fill='%23ffffff' font-family='sans-serif' font-size='11' text-anchor='end'>700 nm</text><text x='200' y='272' fill='%23ffffff' font-family='sans-serif' font-size='13' text-anchor='middle'>only certain wavelengths = quantized energy</text></svg>",
    "bohr": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%2312355b'/><circle cx='200' cy='150' r='40' fill='none' stroke='%2338bdf8' stroke-opacity='0.7' stroke-width='2'/><circle cx='200' cy='150' r='75' fill='none' stroke='%2338bdf8' stroke-opacity='0.7' stroke-width='2'/><circle cx='200' cy='150' r='110' fill='none' stroke='%2338bdf8' stroke-opacity='0.7' stroke-width='2'/><circle cx='200' cy='150' r='14' fill='%23db2777'/><text x='200' y='155' fill='%23ffffff' font-family='sans-serif' font-size='14' text-anchor='middle'>+</text><circle cx='275' cy='150' r='7' fill='%23f59e0b'><animateTransform attributeName='transform' type='rotate' from='0 200 150' to='360 200 150' dur='4s' repeatCount='indefinite'/></circle><text x='200' y='104' fill='%23ffffff' font-family='sans-serif' font-size='11' text-anchor='middle'>n=1</text><text x='200' y='69' fill='%23ffffff' font-family='sans-serif' font-size='11' text-anchor='middle'>n=2</text><text x='200' y='34' fill='%23ffffff' font-family='sans-serif' font-size='11' text-anchor='middle'>n=3</text><text x='200' y='290' fill='%23fbbf24' font-family='sans-serif' font-size='13' text-anchor='middle'>Bohr model: electron in fixed orbits</text></svg>",
    "series": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%234c1d95'/><text x='200' y='30' fill='%23ffffff' font-family='sans-serif' font-size='16' text-anchor='middle'>Hydrogen Energy Levels</text><g stroke='%23ffffff' stroke-width='2'><line x1='70' y1='240' x2='330' y2='240'/><line x1='70' y1='170' x2='330' y2='170'/><line x1='70' y1='135' x2='330' y2='135'/><line x1='70' y1='118' x2='330' y2='118'/><line x1='70' y1='108' x2='330' y2='108'/></g><g fill='%23ffffff' font-family='sans-serif' font-size='11'><text x='38' y='244'>n=1</text><text x='38' y='174'>n=2</text><text x='38' y='139'>n=3</text><text x='38' y='122'>n=4</text><text x='38' y='108'>n=5</text></g><line x1='110' y1='108' x2='110' y2='232' stroke='%23c4b5fd' stroke-width='3'/><polygon points='104,230 116,230 110,240' fill='%23c4b5fd'/><line x1='190' y1='108' x2='190' y2='162' stroke='%23f472b6' stroke-width='3'/><polygon points='184,160 196,160 190,170' fill='%23f472b6'/><line x1='270' y1='108' x2='270' y2='127' stroke='%23fbbf24' stroke-width='3'/><polygon points='264,125 276,125 270,135' fill='%23fbbf24'/><circle cx='110' r='5' fill='%23ffffff'><animate attributeName='cy' values='108;238' dur='2.5s' repeatCount='indefinite'/></circle><circle cx='190' r='5' fill='%23ffffff'><animate attributeName='cy' values='108;168' dur='2.5s' repeatCount='indefinite'/></circle><g fill='%23ffffff' font-family='sans-serif' font-size='11' text-anchor='middle'><text x='110' y='75'>Lyman</text><text x='110' y='89'>UV</text><text x='190' y='75'>Balmer</text><text x='190' y='89'>Visible+UV</text><text x='270' y='75'>Paschen</text><text x='270' y='89'>IR</text></g><text x='200' y='275' fill='%23fbbf24' font-family='sans-serif' font-size='13' text-anchor='middle'>falls to lower n = photon emitted</text></svg>",
    "uncert": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%234c1d95'/><text x='200' y='60' fill='%23ffffff' font-family='sans-serif' font-size='22' text-anchor='middle'>Δx · Δ(mv) ≥ h / 4π</text><circle cx='200' cy='170' r='45' fill='%2338bdf8' fill-opacity='0.25'><animate attributeName='r' values='35;65;35' dur='3s' repeatCount='indefinite'/></circle><circle cx='200' cy='170' r='8' fill='%23f59e0b'/><text x='200' y='270' fill='%23fbbf24' font-family='sans-serif' font-size='13' text-anchor='middle'>sure about position = unsure about momentum</text></svg>"
  }
};
