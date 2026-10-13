/* ==========================================================
   data/Chem/lecture1.js
   General Chemistry (Chem101) - Lecture 1
   Electronic Structure of Atoms (Part 1): Wave Nature of Light & Quantized Energy
   ========================================================== */
window.LECTURES = window.LECTURES || {};

window.LECTURES["chem-1"] = {
  id: "chem-1",
  subject: "chem",
  track: "science",
  number: 1,
  title: { en: "Wave Nature of Light and Quantized Energy", ar: "الطبيعة الموجية للضوء وكمّية الطاقة" },
  description: {
    en: "Electromagnetic radiation, wave properties, c = νλ, the spectrum, Planck, Einstein and photons.",
    ar: "الإشعاع الكهرومغناطيسي، خواص الموجة، القانون c = νλ، الطيف، بلانك وأينشتاين والفوتونات."
  },
  cover: "wave",

  sections: [
    {
      id: "s1",
      title: { en: "Electromagnetic Radiation", ar: "الإشعاع الكهرومغناطيسي" },
      figures: [
        { img: "wave", caption: { en: "A wave: wavelength (λ) and amplitude (A)", ar: "الموجة: الطول الموجي (λ) والسعة (A)" } }
      ],
      points: [
        {
          en: "<b>Radiation:</b> emission and transmission of energy through space in the form of waves.",
          ar: "<b>الإشعاع:</b> انبعاث الطاقة وانتقالها في الفراغ على شكل موجات."
        },
        {
          en: "Electromagnetic radiation includes gamma rays, X-rays, UV, visible light, infrared, microwaves and radio waves.",
          ar: "الإشعاع الكهرومغناطيسي بيشمل أشعة جاما، الأشعة السينية، فوق البنفسجية، الضوء المرئي، تحت الحمراء، الميكروويف وموجات الراديو."
        },
        {
          en: "The different types differ from one another in <b>wavelength and frequency</b> only.",
          ar: "الأنواع دي بتختلف عن بعض في <b>الطول الموجي والتردد</b> بس."
        },
        {
          en: "Examples: the sun sends visible + ultraviolet; glowing coals send heat as <b>infrared</b>.",
          ar: "أمثلة: الشمس بتبعت ضوء مرئي + فوق بنفسجي، والفحم المتوهج بيبعت حرارة على شكل <b>تحت حمراء</b>."
        },
        {
          en: "In vacuum, all electromagnetic radiation travels at the speed of light: <b>c = 2.998 × 10<sup>8</sup> m/s</b> (≈ 3.00 × 10<sup>8</sup> in calculations).",
          ar: "في الفراغ كل الإشعاعات الكهرومغناطيسية بتتحرك بسرعة الضوء: <b>c = 2.998 × 10<sup>8</sup> م/ث</b> (بنأخدها 3.00 × 10<sup>8</sup> في الحسابات)."
        },
        {
          en: "Modern atomic theory studies the <b>interaction of radiation with matter</b>.",
          ar: "النظرية الذرية الحديثة بتدرس <b>تفاعل الإشعاع مع المادة</b>."
        }
      ],
      examFocus: [
        { en: "Definition of radiation + examples (sun = visible/UV, coals = IR)", ar: "تعريف الإشعاع مع أمثلة (الشمس = مرئي/فوق بنفسجي، الفحم = تحت حمراء)" },
        { en: "All EM waves have the same speed c; they differ in λ and ν", ar: "كل الموجات الكهرومغناطيسية ليها نفس السرعة c، وبتختلف في λ و ν" }
      ]
    },
    {
      id: "s2",
      title: { en: "Properties of Waves", ar: "خواص الموجات" },
      figures: [],
      points: [
        {
          en: "<b>Wavelength (λ):</b> distance between two consecutive peaks (or troughs). Units: m, nm.",
          ar: "<b>الطول الموجي (λ):</b> المسافة بين قمتين (أو قاعين) متتاليين. وحدته: م، نانومتر."
        },
        {
          en: "<b>Frequency (ν):</b> number of cycles (waves) passing a given point per second. Unit: hertz (Hz = cycle/s = s<sup>-1</sup>).",
          ar: "<b>التردد (ν):</b> عدد الموجات اللي بتعدي نقطة معينة في الثانية. وحدته: هرتز (Hz = دورة/ث = ث<sup>-1</sup>)."
        },
        {
          en: "<b>Amplitude (A):</b> the height of the wave from the middle line.",
          ar: "<b>السعة (A):</b> ارتفاع الموجة من الخط المنتصف."
        },
        {
          en: "<b>Speed:</b> v = ν λ. For light: <b>c = ν λ</b>, so λ ∝ 1/ν (inverse relation).",
          ar: "<b>السرعة:</b> v = ν λ. وللضوء: <b>c = ν λ</b>، يعني λ ∝ 1/ν (علاقة عكسية)."
        },
        {
          en: "<b>Short wavelength = high frequency = high energy.</b> So UV, X-rays and gamma rays are high-energy radiation.",
          ar: "<b>طول موجي قصير = تردد عالي = طاقة عالية.</b> علشان كده فوق البنفسجي والأشعة السينية وجاما طاقتها عالية."
        },
        {
          en: "From the slide figures: wavelength half as long means frequency twice as great; same frequency with smaller amplitude means a weaker wave.",
          ar: "من الرسومات: لو الطول الموجي اتنصف يبقى التردد اتضاعف؛ ولو التردد ثابت والسعة قلت تبقى الموجة أضعف."
        }
      ],
      examFocus: [
        { en: "Define λ, ν, amplitude and give units", ar: "عرّف λ و ν والسعة واذكر وحداتهم" },
        { en: "c = νλ and the inverse relation between λ and ν", ar: "القانون c = νλ والعلاقة العكسية بين λ و ν" }
      ],
      key: {
        en: "<b>Remember:</b> c = ν λ &nbsp;→&nbsp; ν = c / λ &nbsp;|&nbsp; λ = c / ν",
        ar: "<b>احفظ:</b> c = ν λ &nbsp;→&nbsp; ν = c / λ &nbsp;|&nbsp; λ = c / ν"
      }
    },
    {
      id: "s3",
      title: { en: "Electromagnetic Spectrum and Units", ar: "الطيف الكهرومغناطيسي والوحدات" },
      figures: [
        { img: "spectrum", caption: { en: "Electromagnetic spectrum: from gamma rays to radio waves", ar: "الطيف الكهرومغناطيسي: من أشعة جاما لموجات الراديو" } }
      ],
      points: [
        {
          en: "Order (high → low energy): <b>Gamma → X-ray → UV → Visible → Infrared → Microwave → Radio</b>.",
          ar: "الترتيب (من الأعلى للأقل طاقة): <b>جاما ← سينية ← فوق بنفسجي ← مرئي ← تحت حمراء ← ميكروويف ← راديو</b>."
        },
        {
          en: "<b>Visible light</b> is a narrow band: about <b>400 nm (violet) to 700 nm (red)</b>.",
          ar: "<b>الضوء المرئي</b> نطاق ضيق: تقريبًا من <b>400 نانومتر (بنفسجي) إلى 700 نانومتر (أحمر)</b>."
        },
        {
          en: "Uses: X-ray imaging; sun lamps (UV); heat lamps (IR); microwave ovens, radar and satellites; UHF TV and phones; FM/AM radio.",
          ar: "استخداماتها: تصوير الأشعة؛ لمبات الشمس (UV)؛ لمبات التدفئة (IR)؛ الميكروويف والرادار والأقمار الصناعية؛ التليفزيون والموبايل؛ راديو FM/AM."
        },
        {
          en: "<b>Units:</b> Å = 10<sup>-10</sup> m (X-ray) | nm = 10<sup>-9</sup> m (UV, visible) | μm = 10<sup>-6</sup> m (IR) | mm = 10<sup>-3</sup> m (IR) | cm = 10<sup>-2</sup> m (microwave) | m = 1 (TV, radio).",
          ar: "<b>الوحدات:</b> أنجستروم = 10<sup>-10</sup> م (سينية) | نانومتر = 10<sup>-9</sup> م (UV ومرئي) | ميكرومتر = 10<sup>-6</sup> م (IR) | مللي = 10<sup>-3</sup> م (IR) | سنتي = 10<sup>-2</sup> م (ميكروويف) | متر = 1 (تليفزيون وراديو)."
        }
      ],
      examFocus: [
        { en: "Order of the spectrum and the visible range (400-700 nm)", ar: "ترتيب الطيف ونطاق الضوء المرئي (400-700 نانومتر)" },
        { en: "Which unit goes with which radiation (nm = UV/visible)", ar: "كل وحدة مع أنهي إشعاع (نانومتر = UV/مرئي)" }
      ],
      key: {
        en: "<b>Tip:</b> always convert nm to m (× 10<sup>-9</sup>) before using c = νλ.",
        ar: "<b>نصيحة:</b> حوّل النانومتر لمتر (× 10<sup>-9</sup>) قبل ما تستخدم c = νλ."
      }
    },
    {
      id: "s4",
      title: { en: "Quantized Energy and Photons", ar: "الطاقة المكمّاة والفوتونات" },
      figures: [
        { img: "photo", caption: { en: "Photoelectric effect: light knocks electrons out of a metal", ar: "التأثير الكهروضوئي: الضوء بيطرد إلكترونات من سطح المعدن" } }
      ],
      points: [
        {
          en: "<b>Max Planck:</b> heated solids emit radiation over a wide range of wavelengths; energy can be absorbed or released by atoms <b>only in certain amounts called quanta</b>.",
          ar: "<b>ماكس بلانك:</b> المواد الصلبة المسخنة بتشع على مدى واسع من الأطوال الموجية؛ والذرات بتمتص أو تطلق الطاقة <b>بكميات محددة بس اسمها كمّات (quanta)</b>."
        },
        {
          en: "<b>E = n h ν</b>, where h = Planck's constant = <b>6.626 × 10<sup>-34</sup> J·s</b>, n = 1, 2, 3 …, ν = frequency.",
          ar: "<b>E = n h ν</b>، حيث h ثابت بلانك = <b>6.626 × 10<sup>-34</sup> جول·ث</b>، و n عدد صحيح (1، 2، 3 …)، و ν التردد."
        },
        {
          en: "The energy of matter is <b>quantized</b>: it occurs in discrete units of size <b>hν</b>, each called a quantum.",
          ar: "طاقة المادة <b>مكمّاة</b>: بتيجي في وحدات منفصلة حجمها <b>hν</b>، وكل وحدة اسمها كم."
        },
        {
          en: "<b>Albert Einstein:</b> light travels in energy packets called <b>photons</b>; radiation itself is quantized and acts like a stream of particles.",
          ar: "<b>ألبرت أينشتاين:</b> الضوء بيتحرك في حِزم طاقة اسمها <b>فوتونات</b>؛ والإشعاع نفسه مكمّى وبيتصرف كتيار من الجسيمات."
        },
        {
          en: "Energy of one photon: <b>E = hν = hc / λ</b>.",
          ar: "طاقة الفوتون الواحد: <b>E = hν = hc / λ</b>."
        },
        {
          en: "<b>Photoelectric effect:</b> radiant energy hitting a metal surface ejects electrons (measured as current).",
          ar: "<b>التأثير الكهروضوئي:</b> لما طاقة إشعاعية تضرب سطح معدن بتطرد منه إلكترونات (وبتتقاس كتيار كهربي)."
        }
      ],
      examFocus: [
        { en: "Planck: energy is absorbed/released in quanta, E = nhν", ar: "بلانك: الطاقة بتتمتص وتتطلق في كمّات، E = nhν" },
        { en: "Einstein: photons, E = hν = hc/λ; photoelectric effect", ar: "أينشتاين: الفوتونات، E = hν = hc/λ؛ والتأثير الكهروضوئي" }
      ],
      key: {
        en: "<b>Key idea:</b> higher frequency (shorter λ) = more energy per photon.",
        ar: "<b>الفكرة الأساسية:</b> تردد أعلى (طول موجي أقصر) = طاقة أكبر للفوتون."
      }
    },
    {
      id: "s5",
      title: { en: "Solved Examples", ar: "مسائل محلولة" },
      figures: [],
      points: [
        {
          en: "<b>Ex 1:</b> A photon has ν = 6.0 × 10<sup>4</sup> Hz. Find λ in nm. Is it visible?<br>λ = c/ν = (3.00 × 10<sup>8</sup>) / (6.0 × 10<sup>4</sup>) = 5.0 × 10<sup>3</sup> m = <b>5.0 × 10<sup>12</sup> nm</b> → <b>not visible</b>, it is a radio wave.",
          ar: "<b>مثال 1:</b> فوتون تردده 6.0 × 10<sup>4</sup> Hz. احسب λ بالنانومتر. هل مرئي؟<br>λ = c/ν = (3.00 × 10<sup>8</sup>) / (6.0 × 10<sup>4</sup>) = 5.0 × 10<sup>3</sup> م = <b>5.0 × 10<sup>12</sup> نانومتر</b> ← <b>مش مرئي</b>، دي موجة راديو."
        },
        {
          en: "<b>Ex 2:</b> A sodium lamp emits light of λ = 589 nm. Find ν.<br>ν = c/λ = (3 × 10<sup>8</sup>) / (589 × 10<sup>-9</sup>) = <b>5.09 × 10<sup>14</sup> s<sup>-1</sup></b>.",
          ar: "<b>مثال 2:</b> لمبة صوديوم بتطلع ضوء طوله الموجي 589 نانومتر. احسب التردد.<br>ν = c/λ = (3 × 10<sup>8</sup>) / (589 × 10<sup>-9</sup>) = <b>5.09 × 10<sup>14</sup> ث<sup>-1</sup></b>."
        },
        {
          en: "<b>Ex 3:</b> X-rays from copper have λ = 0.154 nm. Find the photon energy.<br>E = hc/λ = (6.63 × 10<sup>-34</sup>)(3.00 × 10<sup>8</sup>) / (0.154 × 10<sup>-9</sup>) = <b>1.29 × 10<sup>-15</sup> J</b>.",
          ar: "<b>مثال 3:</b> أشعة سينية من النحاس طولها الموجي 0.154 نانومتر. احسب طاقة الفوتون.<br>E = hc/λ = (6.63 × 10<sup>-34</sup>)(3.00 × 10<sup>8</sup>) / (0.154 × 10<sup>-9</sup>) = <b>1.29 × 10<sup>-15</sup> جول</b>."
        }
      ],
      examFocus: [
        { en: "Convert between λ and ν using c = νλ", ar: "التحويل بين λ و ν باستخدام c = νλ" },
        { en: "Photon energy from wavelength: E = hc/λ", ar: "طاقة الفوتون من الطول الموجي: E = hc/λ" }
      ],
      key: {
        en: "<b>Steps:</b> write the formula → convert units (nm → m) → substitute → check the unit of the answer.",
        ar: "<b>الخطوات:</b> اكتب القانون ← حوّل الوحدات (نانومتر ← متر) ← عوّض ← راجع وحدة الناتج."
      }
    }
  ],

  glossary: [
    ["electromagnetic radiation", "إشعاع كهرومغناطيسي"],
    ["radiation", "إشعاع"],
    ["wavelength", "الطول الموجي"],
    ["frequency", "التردد"],
    ["amplitude", "السعة"],
    ["hertz", "هرتز (دورة في الثانية)"],
    ["speed of light", "سرعة الضوء"],
    ["spectrum", "طيف"],
    ["visible light", "الضوء المرئي"],
    ["ultraviolet", "فوق بنفسجي"],
    ["infrared", "تحت حمراء"],
    ["x-ray", "أشعة سينية"],
    ["gamma ray", "أشعة جاما"],
    ["microwave", "ميكروويف"],
    ["radio waves", "موجات الراديو"],
    ["nanometer", "نانومتر (10^-9 م)"],
    ["quantum", "كم (أقل كمية طاقة)"],
    ["quanta", "كمّات"],
    ["photon", "فوتون (حزمة ضوء)"],
    ["planck's constant", "ثابت بلانك"],
    ["photoelectric effect", "التأثير الكهروضوئي"],
    ["quantized", "مكمّى (على شكل وحدات منفصلة)"]
  ],

  images: {
    "wave": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%2312355b'/><text x='200' y='45' fill='%23ffffff' font-family='sans-serif' font-size='20' text-anchor='middle'>c = ν × λ</text><line x1='0' y1='150' x2='400' y2='150' stroke='%23ffffff' stroke-opacity='0.4' stroke-dasharray='4 4'/><g><animateTransform attributeName='transform' type='translate' from='0 0' to='-100 0' dur='2.5s' repeatCount='indefinite'/><path d='M -100 150 Q -75 60 -50 150 T 0 150 T 50 150 T 100 150 T 150 150 T 200 150 T 250 150 T 300 150 T 350 150 T 400 150 T 450 150 T 500 150' fill='none' stroke='%2338bdf8' stroke-width='4'/></g><text x='200' y='240' fill='%23ffffff' font-family='sans-serif' font-size='14' text-anchor='middle'>λ = distance between 2 peaks</text><text x='200' y='265' fill='%23fbbf24' font-family='sans-serif' font-size='14' text-anchor='middle'>A = amplitude (height of wave)</text></svg>",
    "spectrum": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><defs><linearGradient id='g'><stop offset='0' stop-color='%23581c87'/><stop offset='0.25' stop-color='%232563eb'/><stop offset='0.5' stop-color='%2316a34a'/><stop offset='0.75' stop-color='%23eab308'/><stop offset='1' stop-color='%23dc2626'/></linearGradient></defs><rect width='100%' height='100%' fill='%2312355b'/><text x='200' y='45' fill='%23ffffff' font-family='sans-serif' font-size='18' text-anchor='middle'>Electromagnetic Spectrum</text><text x='25' y='98' fill='%23fbbf24' font-family='sans-serif' font-size='11'>High energy</text><text x='375' y='98' fill='%2338bdf8' font-family='sans-serif' font-size='11' text-anchor='end'>Low energy</text><rect x='25' y='110' width='50' height='60' fill='%234c1d95'/><rect x='75' y='110' width='50' height='60' fill='%236d28d9'/><rect x='125' y='110' width='50' height='60' fill='%238b5cf6'/><rect x='175' y='110' width='50' height='60' fill='url(%23g)'><animate attributeName='opacity' values='1;0.6;1' dur='3s' repeatCount='indefinite'/></rect><rect x='225' y='110' width='50' height='60' fill='%23dc2626'/><rect x='275' y='110' width='50' height='60' fill='%23f59e0b'/><rect x='325' y='110' width='50' height='60' fill='%230e8a8a'/><g fill='%23ffffff' font-family='sans-serif' font-size='10' text-anchor='middle'><text x='50' y='145'>Gamma</text><text x='100' y='145'>X-ray</text><text x='150' y='145'>UV</text><text x='200' y='145'>Visible</text><text x='250' y='145'>IR</text><text x='300' y='145'>Micro</text><text x='350' y='145'>Radio</text></g><line x1='30' y1='200' x2='365' y2='200' stroke='%23ffffff' stroke-width='2'/><polygon points='365,194 375,200 365,206' fill='%23ffffff'/><text x='200' y='225' fill='%23ffffff' font-family='sans-serif' font-size='12' text-anchor='middle'>wavelength increases</text><text x='200' y='265' fill='%23fbbf24' font-family='sans-serif' font-size='13' text-anchor='middle'>Visible light: 400 - 700 nm</text></svg>",
    "photo": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%230e8a8a'/><text x='200' y='40' fill='%23ffffff' font-family='sans-serif' font-size='18' text-anchor='middle'>Photoelectric Effect</text><rect x='60' y='210' width='280' height='40' rx='4' fill='%23cbd5e1'/><text x='200' y='236' fill='%2312355b' font-family='sans-serif' font-size='14' text-anchor='middle'>Metal surface</text><circle r='8' fill='%23f59e0b'><animate attributeName='cx' values='60;140;140' keyTimes='0;0.5;1' dur='4s' repeatCount='indefinite'/><animate attributeName='cy' values='70;205;205' keyTimes='0;0.5;1' dur='4s' repeatCount='indefinite'/><animate attributeName='opacity' values='1;1;0;0' keyTimes='0;0.48;0.5;1' dur='4s' repeatCount='indefinite'/></circle><circle r='7' fill='%23ffffff'><animate attributeName='cx' values='140;140;310' keyTimes='0;0.5;1' dur='4s' repeatCount='indefinite'/><animate attributeName='cy' values='205;205;90' keyTimes='0;0.5;1' dur='4s' repeatCount='indefinite'/><animate attributeName='opacity' values='0;0;1;0' keyTimes='0;0.5;0.52;1' dur='4s' repeatCount='indefinite'/></circle><text x='60' y='100' fill='%23fbbf24' font-family='sans-serif' font-size='13'>photon (hν)</text><text x='250' y='125' fill='%23ffffff' font-family='sans-serif' font-size='13'>emitted electron</text></svg>"
  }
};
