/* js/exam.js - امتحانات مقسمة، أسئلة ثنائية اللغة، سؤال في كل صفحة */
const examPair = (value, arValue) => {
  if (value && typeof value === "object") {
    return { en: value.en ?? "", ar: value.ar ?? value.en ?? "" };
  }
  const en = String(value ?? "");
  return { en, ar: arValue || en };
};

const examText = value => {
  const t = examPair(value);
  return `<div class="exam-bi"><div class="en">${t.en}</div><i aria-hidden="true"></i><div class="ar">${t.ar}</div></div>`;
};

const examPlain = value => examPair(value).en;

const Exam = {
  lec: null, Q: [], A: [], i: 0, cb: null, examIndex: null,

  shuffle(a) { a = a.slice(); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a; },
  count() { return this.A.filter(x => x !== null).length; },

  start(lec, onClose, examIndex = null) {
    const all = (window.QUESTIONS || {})[lec.id];
    if (!all || !all.length) { alert("لا توجد أسئلة لهذه المحاضرة حتى الآن."); return; }

    this.lec = lec; this.cb = onClose;
    this.examIndex = Number.isInteger(examIndex) && all.length >= 100 ? examIndex : null;

    let raw = all;
    if (this.examIndex !== null) {
      const base = Math.floor(all.length / 3), rem = all.length % 3;
      const start = this.examIndex * base + Math.min(this.examIndex, rem);
      const size = base + (this.examIndex < rem ? 1 : 0);
      raw = all.slice(start, start + size);
    }

    this.Q = this.shuffle(raw).map(x => {
      const correct = examPair(x.a, x.aAr);
      const wrong = (x.w || []).map((value, k) => examPair(value, (x.wAr || [])[k]));
      return { q: examPair(x.q, x.qAr), c: correct, o: this.shuffle([correct, ...wrong]) };
    });
    this.A = Array(this.Q.length).fill(null); this.i = 0;
    $("#ex").style.display = "block"; document.body.style.overflow = "hidden"; $("#ex").scrollTop = 0;
    this.draw();
  },

  close() { $("#ex").style.display = "none"; document.body.style.overflow = ""; if (this.cb) this.cb(); },

  draw() {
    const box = $("#exb"), x = this.Q[this.i], N = this.Q.length, i = this.i;
    const labels = document.body.dataset.l === "ar" ? ["أ", "ب", "ج", "د"] : ["A", "B", "C", "D"];
    const questionLabel = { en: `Question ${i + 1} / ${N}`, ar: `السؤال ${i + 1} / ${N}` };
    const answeredLabel = { en: `Answered ${this.count()} / ${N}`, ar: `تمت الإجابة على ${this.count()} من ${N}` };
    const examLabel = this.examIndex === null ? { en: "Practice exam", ar: "امتحان تدريبي" } : { en: `Exam ${this.examIndex + 1}`, ar: `الامتحان ${this.examIndex + 1}` };

    box.innerHTML = `<div class="exh"><span>${bi(examLabel)} · ${bi(questionLabel)}</span><small id="an">${bi(answeredLabel)}</small><button class="btn" id="x">${bi({ en: "Close", ar: "إغلاق" })}</button></div>
      <div class="prog"><i style="width:${(i + 1) / N * 100}%"></i></div><div class="q">${examText(x.q)}</div>` +
      x.o.map((o, k) => `<button class="opt${this.A[i] === k ? " s" : ""}" data-k="${k}"><span class="opt-letter">${labels[k]}.</span>${examText(o)}</button>`).join("") +
      `<div class="nav"><button class="btn" id="pv" ${i ? "" : "disabled"}>${bi({ en: "← Previous", ar: "السابق ←" })}</button><button class="btn main" id="nx">${bi(i == N - 1 ? { en: "Finish", ar: "إنهاء" } : { en: "Next →", ar: "التالي →" })}</button></div>`;

    $("#x").onclick = () => this.close();
    $$(".opt", box).forEach(b => b.onclick = () => {
      this.A[i] = +b.dataset.k; $$(".opt", box).forEach(o => o.classList.toggle("s", o === b));
      $("#an").innerHTML = bi({ en: `Answered ${this.count()} / ${N}`, ar: `تمت الإجابة على ${this.count()} من ${N}` });
    });
    $("#pv").onclick = () => { this.i--; this.draw(); };
    $("#nx").onclick = () => {
      if (i == N - 1) {
        if (this.A.includes(null) && !confirm("فيه أسئلة من غير إجابة. هل تريد إنهاء الامتحان؟ / Some questions are unanswered. Finish anyway?")) return;
        this.result();
      } else { this.i++; this.draw(); }
    };
    $("#ex").scrollTop = 0; Tr.wrap(box);
  },

  result() {
    const box = $("#exb"), N = this.Q.length, wrong = [];
    let s = 0;
    this.Q.forEach((x, k) => {
      if (this.A[k] !== null && examPlain(x.o[this.A[k]]) === examPlain(x.c)) s++;
      else wrong.push(k);
    });
    const p = Math.round(s / N * 100);
    const key = this.examIndex === null ? "best:" + this.lec.id : `best:${this.lec.id}:exam${this.examIndex + 1}`;
    const b = Store.get(key, null);
    if (b == null || p > b) Store.set(key, p);
    const overallKey = "best:" + this.lec.id, overall = Store.get(overallKey, null);
    if (overall == null || p > overall) Store.set(overallKey, p);
    const m = p == 100 ? { en: "Perfect score! Masha'Allah!", ar: "درجة كاملة، ما شاء الله!" }
      : p > 85 ? { en: "Great work. Review the questions below.", ar: "ممتاز! راجع الأسئلة الموجودة بالأسفل." }
      : p > 70 ? { en: "Good. Review the lecture once more.", ar: "كويس، راجع المحاضرة مرة كمان." }
      : p >= 50 ? { en: "Review the lecture and try again.", ar: "راجع المحاضرة وحاول مرة تانية." }
      : { en: "Study the lecture again, then retry.", ar: "ذاكر المحاضرة تاني وبعدها جرّب الامتحان." };

    box.innerHTML = `<div class="score">0%</div><div class="msg">${bi({ en: `${s} / ${N} correct`, ar: `${s} من ${N} إجابة صحيحة` })}<div>${bi(m)}</div></div>
      <div class="nav"><button class="btn" id="rt">${bi({ en: "Retry this exam", ar: "إعادة الامتحان" })}</button><button class="btn main" id="cl">${bi({ en: "Back to lecture", ar: "العودة للمحاضرة" })}</button></div>` +
      (wrong.length ? `<h3>${bi({ en: `Review (${wrong.length} incorrect)`, ar: `مراجعة الإجابات الخاطئة (${wrong.length})` })}</h3>` + wrong.map(k => {
        const chosen = this.A[k] === null ? { en: "—", ar: "—" } : this.Q[k].o[this.A[k]];
        return `<div class="rv"><b>${k + 1}. ${examText(this.Q[k].q)}</b>
          <div class="no"><span>${bi({ en: "Your answer:", ar: "إجابتك:" })}</span>${examText(chosen)}</div>
          <div class="ok"><span>${bi({ en: "Correct answer:", ar: "الإجابة الصحيحة:" })}</span>${examText(this.Q[k].c)}</div></div>`;
      }).join("") : "");
    $("#cl").onclick = () => this.close();
    $("#rt").onclick = () => this.start(this.lec, this.cb, this.examIndex);
    $("#ex").scrollTop = 0; Tr.wrap(box);
    let n = 0; const el = $(".score", box);
    const t = setInterval(() => { n += Math.max(1, Math.ceil(p / 35)); if (n >= p) { n = p; clearInterval(t); } el.textContent = n + "%"; }, 30);
  },

  init() {
    document.addEventListener("keydown", e => {
      if ($("#ex").style.display !== "block") return;
      const b = e.key == "ArrowRight" ? $("#nx") : e.key == "ArrowLeft" ? $("#pv") : null;
      if (b && !b.disabled) b.click();
    });
  }
};
