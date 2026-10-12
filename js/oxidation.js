/* js/oxidation.js */
window.TOOLS = window.TOOLS || {};
(() => {
  const TRANSITION_ELEMENTS = [
    { z: 21, sym: "Sc", name: { en: "Scandium", ar: "سكانديوم" }, config: "[Ar] 4s² 3d¹", states: [3], common: [3], group: "3B", mag: { en: "Diamagnetic", ar: "دايا مغناطيسية" }, cat: { en: "Not typically used as catalyst", ar: "لا يُستخدم عادةً كعامل حفاز" }, desc: { en: "Only exhibits +3 oxidation state due to empty d-orbitals after losing 4s and 3d electrons.", ar: "يظهر حالة تأكسد +3 فقط لاستقرار أوربيتالات d الفارغة بعد فقد إلكترونات 4s و 3d." } },
    { z: 22, sym: "Ti", name: { en: "Titanium", ar: "تيتانيوم" }, config: "[Ar] 4s² 3d²", states: [2, 3, 4], common: [4], group: "4B", mag: { en: "Paramagnetic", ar: "بارامغناطيسية" }, cat: { en: "TiO2 is used in photocatalysis", ar: "يُستخدم في الحفز الضوئي والطلاءات" }, desc: { en: "Most stable and common oxidation state is +4. Forms strong dioxide compounds like TiO2.", ar: "حالة التأكسد الأكثر استقراراً وشيوعاً هي +4. يكون مركبات ثنائي أكسيد قوية مثل TiO2." } },
    { z: 23, sym: "V", name: { en: "Vanadium", ar: "فاناديوم" }, config: "[Ar] 4s² 3d³", states: [2, 3, 4, 5], common: [5], group: "5B", mag: { en: "Strongly Paramagnetic", ar: "بارامغناطيسية قوية" }, cat: { en: "V2O5 used in contact process", ar: "يُستخدم كعامل حفاز في تحضير حمض الكبريتيك" }, desc: { en: "Exhibits multiple states from +2 to +5, with +5 being the highest and most common in oxides like V2O5.", ar: "يظهر حالات متعددة من +2 إلى +5، وتعتبر +5 الأعلى والأكثر شيوعاً في الأكاسيد مثل V2O5." } },
    { z: 24, sym: "Cr", name: { en: "Chromium", ar: "كروم" }, config: "[Ar] 4s¹ 3d⁵", states: [2, 3, 6], common: [3, 6], group: "6B", mag: { en: "Paramagnetic", ar: "بارامغناطيسية عالية" }, cat: { en: "Cr2O3 used in green pigments", ar: "يُستخدم في دباغة الجلود والصبغات" }, desc: { en: "Common states are +3 (most stable) and +6 (strong oxidizing agent like dichromates).", ar: "الحالات الشائعة هي +3 (الأكثر استقراراً) و +6 (عامل مؤكسد قوي مثل الديكرومات)." } },
    { z: 25, sym: "Mn", name: { en: "Manganese", ar: "منجنيز" }, config: "[Ar] 4s² 3d⁵", states: [2, 3, 4, 6, 7], common: [2, 7], group: "7B", mag: { en: "High Paramagnetism", ar: "بارامغناطيسية عالية جداً" }, cat: { en: "MnO2 catalyst for H2O2", ar: "يُستخدم كعامل حفاز في انحلال فوق هيدروجين الماء" }, desc: { en: "Reaches the maximum oxidation state of +7 in permanganate (MnO4-), matching group number.", ar: "يصل لأقصى عدد تأكسد +7 في البيرمنجنات (MnO4-)، وهو ما يطابق رقم المجموعة." } },
    { z: 26, sym: "Fe", name: { en: "Iron", ar: "حديد" }, config: "[Ar] 4s² 3d⁶", states: [2, 3, 6], common: [2, 3], group: "8", mag: { en: "Ferromagnetic", ar: "فيرومغناطيسية (تنجذب للمغناطيس)" }, cat: { en: "Haber-Bosch process for Ammonia", ar: "يُستخدم في تحضير النشادر بطريقة هابر-بوش" }, desc: { en: "Iron(II) and Iron(III) are most common. Fe(II) easily oxidizes to stable Fe(III) (half-filled 3d5).", ar: "الحديد الثنائي والثلاثي هما الأكثر شيوعاً. الثنائي يتأكسد بسهولة للثلاثي المستقر (3d5 نص ممتلئ)." } },
    { z: 27, sym: "Co", name: { en: "Cobalt", ar: "كوبالت" }, config: "[Ar] 4s² 3d⁷", states: [2, 3, 4], common: [2, 3], group: "8", mag: { en: "Ferromagnetic", ar: "فيرومغناطيسية" }, cat: { en: "Fischer-Tropsch process", ar: "يُستخدم في صناعة البطاريات والوقود المخلق" }, desc: { en: "Co(II) is stable in salts, while Co(III) acts as a strong oxidizing agent in complexes.", ar: "الكوبالت الثنائي مستقر في الأملاح، بينما يعمل الثلاثي كعامل مؤكسد قوي في المتراكبات." } },
    { z: 28, sym: "Ni", name: { en: "Nickel", ar: "نيكل" }, config: "[Ar] 4s² 3d⁸", states: [2, 3, 4], common: [2], group: "8", mag: { en: "Ferromagnetic", ar: "فيرومغناطيسية" }, cat: { en: "Hydrogenation of oils", ar: "يُستخدم في هدرجة الزيوت النباتية" }, desc: { en: "+2 is the dominant and most stable oxidation state for nickel across most compounds.", ar: "حالة +2 هي المسيطرة والأكثر استقراراً للنيكل في معظم المركبات." } },
    { z: 29, sym: "Cu", name: { en: "Copper", ar: "نحاس" }, config: "[Ar] 4s¹ 3d¹⁰", states: [1, 2], common: [2], group: "1B", mag: { en: "Diamagnetic", ar: "دايا مغناطيسية" }, cat: { en: "Organic synthesis catalysts", ar: "يُستخدم في صناعة الكابلات والعمليات الحفزية" }, desc: { en: "Forms +1 (cuprous, less stable in water due to hydration energy) and +2 (cupric, most common).", ar: "يكون +1 (أقل استقراراً في الماء بسبب طاقة الإماهة) و +2 (الأكثر شيوعاً وثباتاً)." } },
    { z: 30, sym: "Zn", name: { en: "Zinc", ar: "خارصين" }, config: "[Ar] 4s² 3d¹⁰", states: [2], common: [2], group: "2B", mag: { en: "Diamagnetic", ar: "دايا مغناطيسية (مستوى d ممتلئ)" }, cat: { en: "Not a transition catalyst", ar: "لا يعتبر فلز انتقالي حقيقي في السلوك الحفزي" }, desc: { en: "Exhibits exclusively +2 oxidation state because 3d10 is completely filled and stable.", ar: "يظهر حالة تأكسد +2 فقط لأن المستوى 3d10 ممتلئ تماماً ومستقر." } }
  ];

  const CSS = `
@keyframes oxFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes oxPop {
  0% { transform: scale(0.96); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

#toolbox {
  overflow: hidden !important;
  max-height: calc(100vh - 100px);
}

.ox-wrap { max-width: 1300px; margin: 10px auto; padding: 0 16px; font-family: Inter, Cairo, sans-serif; animation: oxFadeIn 0.5s ease both; }
.ox-top-bar { display: flex; justify-content: flex-start; align-items: center; margin-bottom: 14px; }
.ox-search { padding: 10px 16px; border-radius: 12px; border: 1.5px solid #cbd5e1; width: 100%; max-width: 320px; font-size: 0.9rem; outline: none; background: #fff; transition: all 0.25s ease; }
.ox-search:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); transform: translateY(-1px); }

.ox-layout { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 20px; align-items: stretch; }
@media(max-width: 950px) { .ox-layout { grid-template-columns: 1fr; } #toolbox { overflow: auto !important; max-height: none; } }

.ox-table-wrapper { position: relative; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,.05); overflow: hidden; display: flex; flex-direction: column; height: 440px; animation: oxFadeIn 0.6s ease both; }
.ox-table-container { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9; }
.ox-table { width: 100%; border-collapse: collapse; }

body[data-l="ar"] .ox-table { text-align: right; }
body:not([data-l="ar"]) .ox-table { text-align: left; }

.ox-table th { background: #f8fafc; color: #475569; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; padding: 12px 14px; border-bottom: 2px solid #e2e8f0; position: sticky; top: 0; z-index: 2; }
.ox-table td { padding: 11px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; font-size: 0.9rem; }
.ox-row { cursor: pointer; transition: all 0.2s ease; }
.ox-row:hover { background: #f1f5f9; transform: translateX(2px); }
body[data-l="ar"] .ox-row:hover { transform: translateX(-2px); }
.ox-row.active { background: #eff6ff; font-weight: 600; }
body[data-l="ar"] .ox-row.active { box-shadow: inset -4px 0 0 #2563eb; }
body:not([data-l="ar"]) .ox-row.active { box-shadow: inset 4px 0 0 #2563eb; }

.ox-el-cell { display: flex; align-items: center; gap: 10px; }
body[data-l="ar"] .ox-el-cell { flex-direction: row-reverse; }

.ox-mini-sym { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, #2563eb, #1e1b4b); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; flex-shrink: 0; box-shadow: 0 3px 8px rgba(37,99,235,0.3); }
.ox-el-info h4 { margin: 0; font-size: 0.9rem; color: #0b2545; }
.ox-el-info span { font-size: 0.75rem; color: #64748b; }

.ox-badges-wrap { display: flex; gap: 4px; flex-wrap: wrap; }
body[data-l="ar"] .ox-badges-wrap { justify-content: flex-end; }

.ox-badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; transition: transform 0.2s; }
.ox-badge:hover { transform: scale(1.05); }
.ox-badge.common { background: #2563eb; color: #fff; border-color: #1d4e89; box-shadow: 0 2px 5px rgba(37,99,235,0.25); }

.ox-scroll-hint { position: absolute; bottom: 0; left: 0; right: 0; height: 38px; background: linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0)); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 6px; pointer-events: none; transition: opacity 0.3s ease; z-index: 3; }
.ox-scroll-arrow { font-size: 0.8rem; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; padding: 2px 10px; border-radius: 99px; font-weight: 700; animation: oxBounce 1.8s infinite; display: flex; align-items: center; gap: 4px; }
@keyframes oxBounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(4px); } }

.ox-preview-card { background: #fff; color: #1e293b; border: 1.5px solid #e2e8f0; border-radius: 18px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,.05); height: 440px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; animation: oxPop 0.4s ease both; overflow-y: auto; }
.ox-preview-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; flex-shrink: 0; }
body[data-l="ar"] .ox-preview-header { flex-direction: row-reverse; text-align: right; }

.ox-big-sym { width: 100%; height: 95px; border-radius: 12px; background: linear-gradient(135deg, #0b2545, #2563eb); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 3.2rem; font-weight: 800; box-shadow: 0 4px 12px rgba(37,99,235,.25); flex-shrink: 0; margin-bottom: 8px; overflow: hidden; animation: oxPop 0.3s ease both; }
.ox-big-sym img { width: 100%; height: 100%; object-fit: contain; border-radius: 12px; }
.ox-preview-header { flex-direction: column; text-align: center; }
.ox-preview-header h3 { margin: 0 0 2px; font-size: 1.15rem; color: #0b2545; }
.ox-preview-header span { color: #64748b; font-size: 0.78rem; display: block; text-align: center; }
.ox-preview-header span .ar { text-align: center; direction: rtl; }
.ox-preview-header span .en { text-align: center; direction: ltr; }

.ox-preview-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 10px; border-radius: 10px; font-size: 0.82rem; flex-shrink: 0; }
body[data-l="ar"] .ox-preview-meta { text-align: right; }
.ox-preview-meta div span { color: #64748b; display: block; font-size: 0.72rem; margin-bottom: 1px; }
.ox-preview-meta div strong { color: #0b2545; }

.ox-extra-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 10px; margin-bottom: 8px; font-size: 0.82rem; flex-shrink: 0; }
body[data-l="ar"] .ox-extra-box { text-align: right; }
.ox-extra-box b { color: #2563eb; display: block; margin-bottom: 1px; font-size: 0.75rem; }
.ox-extra-box span { color: #334155; }

.ox-preview-desc { font-size: 0.85rem; line-height: 1.5; color: #475569; margin: 0; flex-shrink: 0; }
body[data-l="ar"] .ox-preview-desc { text-align: right; }
`;

  const T = {
    id: "oxidation",
    icon: '<img src="js/img/oxidation numbers.png" style="width:100%;height:100%;object-fit:cover;" alt="Chemistry Icon">',
    title: { en: "Oxidation States Map", ar: "خريطة حالات التأكسد" },
    desc: { en: "Explore oxidation states, electronic configurations, and catalytic properties for the first transition series.", ar: "استكشف حالات التأكسد، والتوزيع الإلكتروني، والخواص الحفزية والمغناطيسية للسلسلة الانتقالية الأولى." }
  };

  function render(box, subject) {
    if (!document.getElementById("oxcss")) {
      const s = document.createElement("style");
      s.id = "oxcss";
      s.textContent = CSS;
      document.head.append(s);
    }

    let activeZ = 21;
    let searchQuery = "";

    const updateView = () => {
      const el = TRANSITION_ELEMENTS.find(x => x.z === activeZ) || TRANSITION_ELEMENTS[0];
      const previewBox = box.querySelector("#ox-preview-box");

      box.querySelectorAll(".ox-row").forEach(r => {
        r.classList.toggle("active", +r.dataset.z === activeZ);
      });

      previewBox.innerHTML = `
        <div class="ox-preview-header">
          <div class="ox-big-sym">${el.sym}</div>
          <div>
            <h3>${bi(el.name)}</h3>
            <span>
              <span class="en">Group: ${el.group} | Atomic No: ${el.z}</span>
              <span class="ar">المجموعة: ${el.group} | العدد الذري: ${el.z}</span>
            </span>
          </div>
        </div>
        <div class="ox-preview-meta">
          <div><span>${bi({en: "Electron Config", ar: "التوزيع الإلكتروني"})}</span><strong>${el.config}</strong></div>
          <div><span>${bi({en: "Common States", ar: "الحالات الشائعة"})}</span><strong>${el.common.map(c=>c>0?`+${c}`:c).join(', ')}</strong></div>
        </div>
        <div class="ox-extra-box">
          <b>${bi({ en: "Magnetic Property", ar: "الخاصية المغناطيسية" })}</b>
          <span>${bi(el.mag)}</span>
        </div>
        <div class="ox-extra-box">
          <b>${bi({ en: "Catalytic Use", ar: "الاستخدام الحفزي" })}</b>
          <span>${bi(el.cat)}</span>
        </div>
        <p class="ox-preview-desc">${bi(el.desc)}</p>
      `;
    };

    const renderTableRows = () => {
      const filtered = TRANSITION_ELEMENTS.filter(e => {
        const q = searchQuery.toLowerCase();
        return e.sym.toLowerCase().includes(q) || e.name.en.toLowerCase().includes(q) || e.name.ar.includes(q) || e.z.toString().includes(q);
      });

      if (filtered.length === 0) {
        return `<tr><td colspan="4" style="text-align:center; padding:20px; color:#64748b;">${bi({ en: "No elements found", ar: "لا توجد نتائج مطابقة للبحث" })}</td></tr>`;
      }

      return filtered.map(e => {
        return `
          <tr class="ox-row ${e.z === activeZ ? 'active' : ''}" data-z="${e.z}">
            <td>
              <div class="ox-el-cell">
                <div class="ox-mini-sym">${e.sym}</div>
                <div class="ox-el-info">
                  <h4>${bi(e.name)}</h4>
                  <span>${e.group}</span>
                </div>
              </div>
            </td>
            <td><strong>${e.z}</strong></td>
            <td>
              <div class="ox-badges-wrap">
                ${e.states.map(st => `<span class="ox-badge">${st > 0 ? '+' + st : st}</span>`).join("")}
              </div>
            </td>
            <td>
              <div class="ox-badges-wrap">
                ${e.common.map(st => `<span class="ox-badge common">${st > 0 ? '+' + st : st}</span>`).join("")}
              </div>
            </td>
          </tr>
        `;
      }).join("");
    };

    box.innerHTML = `
      <div class="ox-wrap">
        <div class="ox-top-bar">
          <input type="text" class="ox-search" id="oxSearchInput" placeholder="${document.body.getAttribute('data-l') === 'ar' ? 'ابحث عن عنصر (مثل: حديد، Ti)...' : 'Search element (e.g. Iron, Sc)...'}" value="${searchQuery}">
        </div>
        <div class="ox-layout">
          <div class="ox-table-wrapper">
            <div class="ox-table-container" id="oxTableContainer">
              <table class="ox-table">
                <thead>
                  <tr>
                    <th>${bi({ en: "Element", ar: "العنصر" })}</th>
                    <th>${bi({ en: "Z", ar: "العدد" })}</th>
                    <th>${bi({ en: "All States", ar: "كل الحالات" })}</th>
                    <th>${bi({ en: "Common", ar: "الشائعة" })}</th>
                  </tr>
                </thead>
                <tbody id="oxTbody">
                  ${renderTableRows()}
                </tbody>
              </table>
            </div>
            <div class="ox-scroll-hint" id="oxScrollHint">
              <div class="ox-scroll-arrow">⬇ ${bi({ en: "Scroll for more", ar: "اسحب لرؤية الباقي" })}</div>
            </div>
          </div>
          <div id="ox-preview-box" class="ox-preview-card"></div>
        </div>
      </div>
    `;

    const container = box.querySelector("#oxTableContainer");
    const hint = box.querySelector("#oxScrollHint");
    const searchInput = box.querySelector("#oxSearchInput");
    const tbody = box.querySelector("#oxTbody");

    container.onscroll = () => {
      hint.style.opacity = container.scrollTop > 30 ? "0" : "1";
    };

    searchInput.oninput = (e) => {
      searchQuery = e.target.value;
      tbody.innerHTML = renderTableRows();
      bindRowClicks();
    };

    function bindRowClicks() {
      box.querySelectorAll(".ox-row").forEach(row => {
        row.onclick = () => {
          activeZ = +row.dataset.z;
          updateView();
          box.querySelectorAll(".ox-row").forEach(r => r.classList.toggle("active", +r.dataset.z === activeZ));
        };
      });
    }

    bindRowClicks();
    updateView();
  }

  T.render = render;
  TOOLS.oxidation = T;
})();