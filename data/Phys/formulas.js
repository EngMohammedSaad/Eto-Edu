/* data/Phys/formulas.js - أداة "قوانين الفيزياء": كل القوانين + بحث + تصنيفات */
(function () {
  const fr = (n, d) => `<span class="frc"><span>${n}</span><span>${d}</span></span>`;
  const sq = x => `<span class="rt"><i>√</i><u>${x}</u></span>`;
  const C = {
    units: { en: "Units", ar: "الوحدات" }, vec: { en: "Vectors", ar: "المتجهات" },
    kin: { en: "Kinematics", ar: "الحركة" }, free: { en: "Free fall", ar: "السقوط الحر" }, force: { en: "Force", ar: "القوة" }
  };
  const F = [
    ["units", "Units of G", "وحدات الثابت G", "[G] = m<sup>3</sup> kg<sup>−1</sup> s<sup>−2</sup>", "From F = GMm/r²", "من قانون الجذب"],
    ["units", "Newton", "النيوتن", "N = kg m s<sup>−2</sup>", "Force", "القوة"],
    ["units", "Pascal", "الباسكال", "Pa = kg m<sup>−1</sup> s<sup>−2</sup> = N m<sup>−2</sup>", "Pressure", "الضغط"],
    ["units", "Joule", "الجول", "J = kg m<sup>2</sup> s<sup>−2</sup> = N m", "Energy, work", "الشغل والطاقة"],
    ["units", "Watt", "الوات", "W = kg m<sup>2</sup> s<sup>−3</sup> = J s<sup>−1</sup>", "Power", "القدرة"],
    ["units", "Dyne", "الداين", "1 dyne = 10<sup>−5</sup> N", "CGS unit of force", "وحدة القوة في CGS"],
    ["units", "Prefixes", "البادئات", "kilo = 10<sup>3</sup> , milli = 10<sup>−3</sup> , micro (µ) = 10<sup>−6</sup> , nano = 10<sup>−9</sup>", "1 mg = 10<sup>3</sup> µg", "١ مللي = ١٠٠٠ ميكرو"],
    ["units", "Dimensional homogeneity", "تجانس الأبعاد", "[LHS] = [RHS]", "Terms added or equated must have the same dimension; sin, cos, exp, ln take pure numbers", "الطرفين لازم نفس الوحدات، ودوال sin و cos و exp و ln بتاخد أرقام من غير وحدة"],
    ["vec", "Vector in components", "المتجه بالمركّبات", "A = A<sub>x</sub> î + A<sub>y</sub> ĵ", "î, ĵ, k̂ are unit vectors (magnitude 1)", "î و ĵ و k̂ متجهات وحدة"],
    ["vec", "Components", "المركّبات", "A<sub>x</sub> = A cosθ , A<sub>y</sub> = A sinθ", "θ measured from +x axis", "θ من محور x الموجب"],
    ["vec", "Magnitude", "المقدار", "A = " + sq("A<sub>x</sub><sup>2</sup> + A<sub>y</sub><sup>2</sup>"), "", ""],
    ["vec", "Direction", "الاتجاه", "θ = tan<sup>−1</sup>( " + fr("A<sub>y</sub>", "A<sub>x</sub>") + " )", "Check the quadrant", "راجع الربع"],
    ["vec", "Resultant", "المحصلة", "R<sub>x</sub> = ΣA<sub>x</sub> , R<sub>y</sub> = ΣA<sub>y</sub>", "Add each column separately", "اجمع كل عمود لوحده"],
    ["vec", "Dot product", "الضرب القياسي", "A · B = AB cosφ", "Result is a scalar", "الناتج كمية قياسية"],
    ["vec", "Dot by components", "الضرب بالمركّبات", "A · B = A<sub>x</sub>B<sub>x</sub> + A<sub>y</sub>B<sub>y</sub> + A<sub>z</sub>B<sub>z</sub>", "î·î = 1 , î·ĵ = 0", ""],
    ["vec", "Angle between vectors", "الزاوية بين متجهين", "cosφ = " + fr("A · B", "A B"), "A · B = 0 means perpendicular", "لو A·B = 0 يبقى متعامدين"],
    ["vec", "Work", "الشغل", "W = F · d", "", ""],
    ["kin", "Displacement", "الإزاحة", "Δx = x<sub>2</sub> − x<sub>1</sub>", "", ""],
    ["kin", "Average velocity", "متوسط السرعة المتجهة", "v<sub>avg</sub> = " + fr("Δx", "Δt"), "Over a full lap = 0", "في لفّة كاملة = صفر"],
    ["kin", "Average speed", "متوسط السرعة العددية", "speed = " + fr("total distance", "Δt"), "", ""],
    ["kin", "Average acceleration", "متوسط العجلة", "a<sub>avg</sub> = " + fr("Δv", "Δt") + " = " + fr("v<sub>2</sub> − v<sub>1</sub>", "t<sub>2</sub> − t<sub>1</sub>"), "", ""],
    ["kin", "Instantaneous", "اللحظية", "v = " + fr("dx", "dt") + " , a = " + fr("dv", "dt"), "Slope of x–t and v–t graphs", "ميل الرسم"],
    ["kin", "Velocity equation", "معادلة السرعة", "v = v<sub>0</sub> + a t", "Constant acceleration", "عجلة ثابتة"],
    ["kin", "Position equation", "معادلة الموضع", "x = x<sub>0</sub> + v<sub>0</sub>t + ½ a t<sup>2</sup>", "Constant acceleration", "عجلة ثابتة"],
    ["kin", "No-time equation", "معادلة من غير زمن", "v<sup>2</sup> = v<sub>0</sub><sup>2</sup> + 2a Δx", "", ""],
    ["kin", "Average-velocity form", "صيغة المتوسط", "Δx = " + fr("v<sub>0</sub> + v", "2") + " t", "", ""],
    ["free", "Gravity", "عجلة الجاذبية", "g = 9.8 m s<sup>−2</sup> (downward)", "Also 9.8 at the top of the path", "وهي كمان 9.8 عند أعلى نقطة"],
    ["free", "Dropped object", "جسم بيسقط", "h = ½ g t<sup>2</sup> , v = g t , v = " + sq("2 g h"), "Start from rest", "بيبدأ من السكون"],
    ["free", "Thrown upward", "جسم مرمي لفوق", "y = v<sub>0</sub>t − ½ g t<sup>2</sup> , v = v<sub>0</sub> − g t", "", ""],
    ["free", "Maximum height", "أقصى ارتفاع", "h<sub>max</sub> = " + fr("v<sub>0</sub><sup>2</sup>", "2 g"), "v = 0 at the top", "السرعة صفر فوق"],
    ["free", "Time to the top", "زمن الوصول لأعلى", "t = " + fr("v<sub>0</sub>", "g"), "", ""],
    ["force", "Newton's 2nd law", "قانون نيوتن الثاني", "ΣF = m a", "a has the direction of the net force", "العجلة في اتجاه القوة المحصلة"],
    ["force", "Net force in components", "القوة المحصلة بالمركّبات", "ΣF = (ΣF<sub>x</sub>) î + (ΣF<sub>y</sub>) ĵ", "", ""],
    ["force", "Acceleration magnitude", "مقدار العجلة", "a = " + fr("|ΣF|", "m") + " = " + fr(sq("F<sub>x</sub><sup>2</sup> + F<sub>y</sub><sup>2</sup>"), "m"), "", ""],
    ["force", "Newton's 1st law", "قانون نيوتن الأول", "ΣF = 0 ⟹ v = constant", "Inertia", "القصور الذاتي"]
  ].map(a => ({ c: a[0], n: { en: a[1], ar: a[2] }, f: a[3], d: { en: a[4], ar: a[5] } }));

  const st = document.createElement("style");
  st.textContent = `
.fm-top{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:10px 0 16px}
.fm-top input{flex:1 1 240px;padding:12px 16px;border-radius:12px;border:1.5px solid rgba(37,99,235,.4);background:rgba(127,127,127,.08);color:inherit;font:inherit}
.fm-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
.fm-chips button{border:1px solid rgba(37,99,235,.4);background:transparent;color:inherit;border-radius:20px;padding:6px 14px;font:inherit;cursor:pointer}
.fm-chips button.on{background:#2563eb;color:#fff;border-color:#2563eb}
.fm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px}
.fm-card{padding:14px 16px;border-radius:16px;background:rgba(127,127,127,.09);border:1px solid rgba(127,127,127,.2);border-top:4px solid #2563eb;transition:transform .2s}
.fm-card:hover{transform:translateY(-3px)}
.fm-card small{opacity:.65}.fm-card h4{margin:2px 0 8px}
.fm-card .fx{display:block;text-align:center;font-size:1.2em;padding:10px;margin:6px 0}
.fm-card .cp{border:0;background:none;color:#2563eb;cursor:pointer;font:inherit;font-size:.8em}
.frc{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 3px;font-size:.92em}
.frc>span:first-child{border-bottom:1.5px solid currentColor;padding:0 4px}.frc>span:last-child{padding:0 4px}
.fm-empty{text-align:center;opacity:.6;padding:30px}`;
  document.head.append(st);

  const plain = h => h.replace(/<[^>]+>/g, "").toLowerCase();
  window.TOOLS = window.TOOLS || {};
  TOOLS.formulas = {
    id: "formulas", icon: "ƒ(x)",
    title: { en: "Physics Formulas", ar: "قوانين الفيزياء" },
    desc: { en: "Every law in the course, with search.", ar: "كل قوانين المنهج مع بحث سريع." },
    render(box) {
      let cat = "all", q = "";
      box.innerHTML = `<div class="pagehead"><h2>${bi(this.title)}</h2><p>${bi(this.desc)}</p></div>
        <div class="fm-top"><input id="fq" placeholder="Search / ابحث: force, نيوتن, v², cos..." autocomplete="off"><span id="fc"></span></div>
        <div class="fm-chips" id="fch"></div><div class="fm-grid" id="fg"></div>`;
      const draw = () => {
        const ql = q.trim().toLowerCase();
        const list = F.filter(x => (cat === "all" || x.c === cat) && (!ql || [x.n.en, x.n.ar, x.d.en, x.d.ar, plain(x.f), C[x.c].en, C[x.c].ar].join(" ").toLowerCase().includes(ql)));
        $("#fc").textContent = list.length + " / " + F.length;
        $("#fg").innerHTML = list.length ? list.map(x => `<div class="fm-card"><small>${bi(C[x.c])}</small><h4>${bi(x.n)}</h4>
          <span class="fx">${x.f}</span>${x.d.en ? `<div>${bi(x.d)}</div>` : ""}<button class="cp" data-t="${plain(x.f).replace(/"/g, "")}">Copy</button></div>`).join("")
          : `<div class="fm-empty">${bi({ en: "No results", ar: "مفيش نتايج" })}</div>`;
        $$(".cp", box).forEach(b => b.onclick = () => { navigator.clipboard && navigator.clipboard.writeText(b.dataset.t); b.textContent = "Copied ✓"; });
      };
      $("#fch").innerHTML = [["all", { en: "All", ar: "الكل" }], ...Object.entries(C)].map(([k, v]) => `<button data-k="${k}" class="${k === "all" ? "on" : ""}">${bi(v)}</button>`).join("");
      $$("#fch button").forEach(b => b.onclick = () => { cat = b.dataset.k; $$("#fch button").forEach(x => x.classList.toggle("on", x === b)); draw(); });
      $("#fq").oninput = e => { q = e.target.value; draw(); };
      draw();
    }
  };
})();
