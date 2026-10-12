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
  const display = raw => {
    const text = String(raw ?? '');
    if (window.MathsTutor && typeof window.MathsTutor.formatMath === 'function') {
      return window.MathsTutor.formatMath(text);
    }
    return examEscape(text);
  };
  const hasSeparateArabic = Boolean(t.ar && t.ar !== t.en);
  return `<div class="exam-bi"><div class="en">${display(t.en)}</div>${hasSeparateArabic ? `<i aria-hidden="true"></i><div class="ar">${display(t.ar)}</div>` : ""}</div>`;
};

const examPlain = value => examPair(value).en;
const examEscape = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
}[ch]));

function examMath(value) {
  const text = String(value ?? "");
  if (window.MathsTutor && typeof window.MathsTutor.formatMath === "function") {
    return window.MathsTutor.formatMath(text);
  }
  return examEscape(text);
}

function ensureGuidedReviewStyles() {
  if (document.getElementById("math-guided-review-styles")) return;
  const style = document.createElement("style");
  style.id = "math-guided-review-styles";
  style.textContent = `
    .math-guided-review{display:grid;gap:14px;margin:20px 0 28px}
    .math-review-intro{padding:14px 16px;border-bottom:1px solid var(--border,#d9dce5)}
    .math-review-intro h3{margin:0 0 6px;font-size:18px}
    .math-review-intro p{margin:0;line-height:1.7;opacity:.78;font-size:13px}
    .math-review-card{border:1px solid var(--border,#d9dce5);border-radius:14px;padding:15px;margin:0;background:var(--surface,#fff);box-shadow:0 5px 17px rgba(25,32,56,.045)}
    .math-review-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;font-weight:800;margin-bottom:10px}
    .math-review-card-head small{font-size:11px;opacity:.65;white-space:nowrap}
    .math-review-question{font-size:17px;line-height:1.85;padding:10px 12px;border-radius:10px;background:var(--surface-secondary,#f5f6fa);overflow-x:auto;margin-bottom:10px}
    .math-review-your-answer{display:grid;grid-template-columns:minmax(78px,auto) 1fr;gap:10px;align-items:start;font-size:12px;margin:9px 0 12px;line-height:1.7}
    .math-review-your-answer>div{white-space:pre-wrap;overflow-wrap:anywhere;opacity:.85}
    .math-review-toggle{white-space:normal;line-height:1.45}
    .math-review-no-solution{font-size:12px;opacity:.7}
    .math-guided-stepper{margin-top:13px;border:1px solid #ddd5fb;border-radius:13px;overflow:hidden;background:#fff;color:#222944;animation:math-review-in .25s ease-out}
    .math-guided-step-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;background:#f3f0ff;border-bottom:1px solid #e4defb;font-weight:800;font-size:12px}
    .math-guided-progress{display:flex;gap:4px;padding:0 14px 12px;background:#f3f0ff}
    .math-guided-progress i{height:4px;flex:1;background:#dedbed;border-radius:6px}
    .math-guided-progress i.active{background:#7655db}
    .math-guided-step-explanation{padding:15px;display:flex;align-items:flex-start;gap:10px;line-height:1.8;font-size:14px}
    .math-guided-step-number{flex:0 0 30px;width:30px;height:30px;border-radius:9px;background:#ebe5ff;color:#5936c5;display:grid;place-items:center;font-weight:900}
    .math-guided-equation{padding:15px;background:#f8f7fd;border-top:1px solid #e9e5f5;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;font-size:20px;line-height:1.8;overflow-x:auto}
    .math-guided-before{opacity:.65;max-width:42%;overflow-x:auto}
    .math-guided-after{border:1px solid #dcd4fb;background:#fff;border-radius:9px;padding:2px 10px;animation:math-review-eq-in .35s ease-out;max-width:48%;overflow-x:auto}
    .math-guided-arrow{color:#7551dc;font-size:27px;font-weight:900;animation:math-review-arrow 1.1s ease-in-out infinite}
    .math-guided-step-nav{display:flex;justify-content:space-between;gap:10px;padding:12px 14px;border-top:1px solid #e8e5f1}
    .math-guided-step-nav button{min-width:130px}
    .math-guided-answer{background:#edf9f1;border-top:1px solid #cdebd6;color:#145c37;padding:13px 15px;line-height:1.8}
    .math-guided-answer b{display:block;font-size:11px;margin-bottom:5px}
    @keyframes math-review-in{from{opacity:.45;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    @keyframes math-review-eq-in{from{opacity:.3;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
    @keyframes math-review-arrow{0%,100%{transform:translateX(-2px);opacity:.7}50%{transform:translateX(3px);opacity:1}}
    @media(max-width:540px){.math-review-card{padding:11px}.math-guided-equation{font-size:16px;gap:7px}.math-guided-before,.math-guided-after{max-width:100%}.math-guided-step-nav button{min-width:0;flex:1}}
    @media(prefers-reduced-motion:reduce){.math-guided-stepper *{animation:none!important}}
  `;
  document.head.appendChild(style);
}

function renderWrittenGuidedStep(solution, rawStep) {
  const steps = Array.isArray(solution.steps) ? solution.steps : [];
  if (!steps.length) return "";
  const index = Math.max(0, Math.min(steps.length - 1, Number(rawStep) || 0));
  const step = steps[index];
  const before = index === 0 ? solution.q : steps[index - 1].math;
  const final = index === steps.length - 1;
  const explanation = { en: step.en || "", ar: step.ar || step.en || "" };
  return `<div class="math-guided-stepper" aria-live="polite">
    <div class="math-guided-step-head"><span>${bi({ en: `Step ${index + 1} of ${steps.length}`, ar: `الخطوة ${index + 1} من ${steps.length}` })}</span><span>${Math.round((index + 1) / steps.length * 100)}%</span></div>
    <div class="math-guided-progress">${steps.map((_, i) => `<i class="${i <= index ? "active" : ""}"></i>`).join("")}</div>
    <div class="math-guided-step-explanation"><span class="math-guided-step-number">${String(index + 1).padStart(2, "0")}</span><div>${bi(explanation)}</div></div>
    <div class="math-guided-equation"><div class="math-guided-before">${examMath(before)}</div><span class="math-guided-arrow" aria-hidden="true">⟶</span><div class="math-guided-after">${examMath(step.math || "")}</div></div>
    ${final ? `<div class="math-guided-answer"><b>${bi({ en: "Final answer", ar: "الإجابة النهائية" })}</b>${examMath(solution.answer)}${solution.note ? `<p>${examEscape(solution.note)}</p>` : ""}</div>` : ""}
    <div class="math-guided-step-nav"><button class="btn" type="button" data-review-step="${index - 1}" data-review-step-id="${examEscape(solution.id)}" ${index === 0 ? "disabled" : ""}>${bi({ en: "← Previous step", ar: "← الخطوة السابقة" })}</button><button class="btn main" type="button" data-review-step="${index + 1}" data-review-step-id="${examEscape(solution.id)}" ${final ? "disabled" : ""}>${bi({ en: "Next step →", ar: "الخطوة التالية →" })}</button></div>
  </div>`;
}

const Exam = {
  lec: null, Q: [], A: [], i: 0, cb: null, examIndex: null,
  mode: "mcq", writtenExamId: null, writtenExam: null, writtenAnswers: [],
  reviewSolutionId: null, reviewStep: 0,
  stateKey: "etoedu-exam-session-v1",

  saveState(screen = "question") {
    if (!this.lec || (!this.Q.length && this.mode !== "pdf")) return;

    try {
      localStorage.setItem(this.stateKey, JSON.stringify({
        lecId: this.lec.id,
        examIndex: this.examIndex,
        mode: this.mode,
        writtenExamId: this.writtenExamId,
        writtenAnswers: this.writtenAnswers,
        reviewSolutionId: this.reviewSolutionId,
        reviewStep: this.reviewStep,
        Q: this.Q,
        A: this.A,
        i: this.i,
        screen,
        savedAt: Date.now()
      }));
    } catch (_) {}
  },

  restore(lec, onClose = () => {}) {
    let state;
    try {
      state = JSON.parse(localStorage.getItem(this.stateKey) || "null");
    } catch (_) {
      return false;
    }

    if (!state || state.lecId !== lec.id) return false;
    const mode = state.mode || "mcq"; // Existing saved sessions remain compatible.
    if (!["mcq", "written", "pdf"].includes(mode)) return false;

    if (mode === "mcq") {
      if (!Array.isArray(state.Q) || !state.Q.length || !Array.isArray(state.A) ||
          !state.Q.every(q => q && q.q && q.c && Array.isArray(q.o))) return false;
    } else {
      const exam = (window.EXAMS || {})[state.writtenExamId];
      if (!exam || (mode === "written" && (!Array.isArray(exam.questions) || !exam.questions.length)) ||
          (mode === "pdf" && !exam.pdf)) return false;
    }

    this.lec = lec;
    this.cb = onClose;
    this.mode = mode;
    this.examIndex = Number.isInteger(state.examIndex) ? state.examIndex : null;
    this.reviewSolutionId = typeof state.reviewSolutionId === "string" ? state.reviewSolutionId : null;
    this.reviewStep = Number.isInteger(state.reviewStep) ? Math.max(0, state.reviewStep) : 0;

    if (mode === "mcq") {
      this.writtenExamId = null;
      this.writtenExam = null;
      this.writtenAnswers = [];
      this.reviewSolutionId = null;
      this.reviewStep = 0;
      this.Q = state.Q;
      this.A = this.Q.map((_, index) => {
        const answer = state.A[index];
        return Number.isInteger(answer) && answer >= 0 && answer < this.Q[index].o.length
          ? answer : null;
      });
    } else {
      this.writtenExamId = state.writtenExamId;
      this.writtenExam = (window.EXAMS || {})[this.writtenExamId];
      this.Q = mode === "written" ? (this.writtenExam.questions || []).map(item => ({ ...item })) : [];
      this.A = Array.isArray(state.A) ? state.A : [];
      this.writtenAnswers = Array.isArray(state.writtenAnswers) ? state.writtenAnswers : [];
      if (mode === "written") {
        this.writtenAnswers = this.Q.map((_, index) => String(this.writtenAnswers[index] || ""));
      }
    }

    this.i = this.Q.length
      ? Math.min(this.Q.length - 1, Math.max(0, Number(state.i) || 0))
      : 0;

    $("#ex").style.display = "block";
    document.body.style.overflow = "hidden";

    if (state.screen === "result") this.result();
    else this.draw();
    return true;
  },

  shuffle(a) { a = a.slice(); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a; },
  count() { return this.A.filter(x => x !== null).length; },

  start(lec, onClose, examIndex = null) {
    // Explicit worksheet IDs are supported: Exam.start(lec, onClose, "math-sheet-2").
    if (typeof examIndex === "string" && (window.EXAMS || {})[examIndex]) {
      return this.startWritten(lec, onClose, examIndex);
    }

    // For the Mathematics subject, indices 0..2 select its three separate worksheets.
    // Existing large MCQ banks in other subjects keep their original 3-way split.
    const isMath = lec && (lec.subject === "math" || /^math(?:-|$)/.test(lec.id || ""));
    if (isMath && Number.isInteger(examIndex) && examIndex >= 0 && examIndex < 3) {
      const sheetId = `math-sheet-${examIndex + 1}`;
      if ((window.EXAMS || {})[sheetId]) return this.startWritten(lec, onClose, sheetId);
    }

    const all = (window.QUESTIONS || {})[lec.id];
    if (!all || !all.length) { alert("لا توجد أسئلة لهذه المحاضرة حتى الآن."); return; }

    this.lec = lec;
    this.cb = onClose;
    this.mode = "mcq";
    this.reviewSolutionId = null;
    this.reviewStep = 0;
    this.writtenExamId = null;
    this.writtenExam = null;
    this.writtenAnswers = [];
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
    this.A = Array(this.Q.length).fill(null);
    this.i = 0;
    $("#ex").style.display = "block";
    document.body.style.overflow = "hidden";
    $("#ex").scrollTop = 0;
    this.draw();
  },

  // Return worksheets configured for a subject so the lecture/subject page can create cards.
  listWritten(lecOrSubject = "math") {
    const subjectId = typeof lecOrSubject === "string"
      ? lecOrSubject
      : (lecOrSubject && (lecOrSubject.subject || (lecOrSubject.id || "").split("-")[0]));
    return Object.values(window.EXAMS || {}).filter(exam => exam && exam.subject === subjectId);
  },

  startWritten(lec, onClose, examId) {
    const exam = (window.EXAMS || {})[examId];
    if (!exam) { alert("الامتحان المطلوب غير موجود."); return; }

    this.lec = lec;
    this.cb = onClose;
    this.examIndex = null;
    this.writtenExamId = examId;
    this.writtenExam = exam;
    this.mode = Array.isArray(exam.questions) && exam.questions.length ? "written" : "pdf";
    this.Q = this.mode === "written" ? exam.questions.map(item => ({ ...item })) : [];
    this.A = [];
    this.writtenAnswers = this.Q.map(() => "");
    this.reviewSolutionId = null;
    this.reviewStep = 0;
    this.i = 0;

    $("#ex").style.display = "block";
    document.body.style.overflow = "hidden";
    $("#ex").scrollTop = 0;
    this.draw();
  },

  close() {
    $("#ex").style.display = "none";
    document.body.style.overflow = "";

    try {
      localStorage.removeItem(this.stateKey);
    } catch (_) {}

    if (this.cb) this.cb();
  },

  draw() {
    if (this.mode === "written") return this.drawWritten();
    if (this.mode === "pdf") return this.drawPdf();

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
      this.A[i] = +b.dataset.k;
      $$(".opt", box).forEach(o => o.classList.toggle("s", o === b));
      $("#an").innerHTML = bi({ en: `Answered ${this.count()} / ${N}`, ar: `تمت الإجابة على ${this.count()} من ${N}` });
      this.saveState("question");
    });
    $("#pv").onclick = () => { this.i--; this.draw(); };
    $("#nx").onclick = () => {
      if (i == N - 1) {
        if (this.A.includes(null) && !confirm("فيه أسئلة من غير إجابة. هل تريد إنهاء الامتحان؟ / Some questions are unanswered. Finish anyway?")) return;
        this.result();
      } else { this.i++; this.draw(); }
    };
    $("#ex").scrollTop = 0;
    Tr.wrap(box);
    this.saveState("question");
  },

  drawWritten() {
    const box = $("#exb"), x = this.Q[this.i], N = this.Q.length, i = this.i;
    const title = this.writtenExam.title || { en: "Written exam", ar: "امتحان تحريري" };
    const questionLabel = { en: `Question ${i + 1} / ${N}`, ar: `السؤال ${i + 1} / ${N}` };
    const answered = this.writtenAnswers.filter(value => String(value || "").trim()).length;
    const answeredLabel = { en: `Answered ${answered} / ${N}`, ar: `تمت الإجابة على ${answered} من ${N}` };
    const currentAnswer = examEscape(this.writtenAnswers[i] || "");

    box.innerHTML = `<div class="exh"><span>${bi(title)} · ${bi(questionLabel)}</span><small id="an">${bi(answeredLabel)}</small><button class="btn" id="x">${bi({ en: "Close", ar: "إغلاق" })}</button></div>
      <div class="prog"><i style="width:${(i + 1) / N * 100}%"></i></div>
      <div class="q">${examText(x.q)}</div>
      <label for="writtenAnswer" class="written-label">${bi({ en: "Your written answer", ar: "اكتب إجابتك وخطوات الحل" })}</label>
      <textarea id="writtenAnswer" class="ex-answer" rows="7" placeholder="${examEscape("Write your answer here… / اكتب إجابتك هنا…")}" style="width:100%;min-height:160px;resize:vertical;box-sizing:border-box;padding:12px;border:1px solid var(--border,#d1d5db);border-radius:12px;font:inherit;line-height:1.6;background:var(--surface,#fff);color:inherit">${currentAnswer}</textarea>
      <div class="nav"><button class="btn" id="pv" ${i ? "" : "disabled"}>${bi({ en: "← Previous", ar: "السابق ←" })}</button><button class="btn main" id="nx">${bi(i === N - 1 ? { en: "Finish", ar: "إنهاء" } : { en: "Next →", ar: "التالي →" })}</button></div>`;

    $("#x").onclick = () => this.close();
    $("#writtenAnswer").addEventListener("input", event => {
      this.writtenAnswers[i] = event.target.value;
      const n = this.writtenAnswers.filter(value => String(value || "").trim()).length;
      $("#an").innerHTML = bi({ en: `Answered ${n} / ${N}`, ar: `تمت الإجابة على ${n} من ${N}` });
      this.saveState("question");
    });
    $("#pv").onclick = () => { this.writtenAnswers[i] = $("#writtenAnswer").value; this.i--; this.draw(); };
    $("#nx").onclick = () => {
      this.writtenAnswers[i] = $("#writtenAnswer").value;
      if (i === N - 1) {
        const missing = this.writtenAnswers.filter(value => !String(value || "").trim()).length;
        if (missing && !confirm(`There are ${missing} unanswered questions. Finish anyway? / يوجد ${missing} سؤالًا بلا إجابة. هل تريد الإنهاء؟`)) return;
        this.result();
      } else {
        this.i++;
        this.draw();
      }
    };
    $("#ex").scrollTop = 0;
    if (typeof Tr !== "undefined" && Tr.wrap) Tr.wrap(box);
    this.saveState("question");
  },

  drawPdf() {
    const box = $("#exb"), exam = this.writtenExam;
    const title = exam.title || { en: "Worksheet", ar: "الشيت" };
    const pdf = examEscape(exam.pdf || "");
    const description = exam.description || { en: "Original worksheet PDF", ar: "ملف الشيت الأصلي PDF" };
    box.innerHTML = `<div class="exh"><span>${bi(title)}</span><button class="btn" id="x">${bi({ en: "Close", ar: "إغلاق" })}</button></div>
      <div class="msg">${bi(description)}<p>${bi({ en: `${exam.questionCount || ""} questions. Answer on paper; this original PDF is not auto-graded.`, ar: `${exam.questionCount || ""} سؤالًا. حل على ورقة خارجية؛ ملف الـPDF الأصلي لا يتم تصحيحه تلقائيًا.` })}</p>
      <a class="btn main" href="${pdf}" target="_blank" rel="noopener">${bi({ en: "Open PDF in a new tab", ar: "فتح ملف PDF في نافذة جديدة" })}</a></div>
      <iframe title="${examEscape(exam.title && exam.title.en || "Worksheet PDF")}" src="${pdf}#toolbar=1&navpanes=0" style="width:100%;height:min(72vh,900px);border:1px solid var(--border,#ddd);border-radius:12px;background:#fff"></iframe>`;
    $("#x").onclick = () => this.close();
    $("#ex").scrollTop = 0;
    if (typeof Tr !== "undefined" && Tr.wrap) Tr.wrap(box);
    this.saveState("pdf");
  },

  writtenResult(preserveScroll = false) {
    ensureGuidedReviewStyles();
    const box = $("#exb"), N = this.Q.length;
    const answered = this.writtenAnswers.filter(value => String(value || "").trim()).length;
    const title = this.writtenExam.title || { en: "Written exam", ar: "امتحان تحريري" };
    const message = {
      en: `${answered} of ${N} written responses saved. Your typed answers are not auto-graded; use the guided solution under each question to compare your work.`,
      ar: `تم حفظ إجابات ${answered} من ${N}. إجابتك المكتوبة لا تُصحَّح تلقائيًا؛ افتح الحل أسفل كل سؤال وقارن خطواتك بالحل النموذجي.`
    };
    const oldScroll = preserveScroll ? $("#ex").scrollTop : 0;
    const sheetId = this.writtenExamId;
    const hasGuidedMathSolutions = /^math-sheet-[123]$/.test(sheetId || "");
    const bankQuestions = hasGuidedMathSolutions && window.MATHS_SHEETS && Array.isArray(window.MATHS_SHEETS.questions)
      ? window.MATHS_SHEETS.questions.filter(q => q.sheet === sheetId)
      : [];

    const reviewCards = this.Q.map((item, index) => {
      const solution = bankQuestions.find(q => q.id === item.solutionId || q.label === item.n);
      const id = solution ? solution.id : "";
      const isOpen = Boolean(solution && this.reviewSolutionId === id);
      const answer = String(this.writtenAnswers[index] || "").trim();
      const solutionPanel = isOpen ? renderWrittenGuidedStep(solution, this.reviewStep) : "";
      const solutionButton = solution
        ? `<button class="btn ${isOpen ? "" : "main"} math-review-toggle" type="button" data-review-open="${examEscape(id)}">${bi(isOpen ? { en: "Hide guided solution", ar: "إخفاء شرح الحل" } : { en: "Explain this question step by step", ar: "اشرح السؤال ده خطوة بخطوة" })}</button>`
        : `<p class="math-review-no-solution">${bi({ en: "A worked solution is not available for this question yet.", ar: "الحل التفصيلي للسؤال ده غير متاح حاليًا." })}</p>`;
      return `<article class="math-review-card" id="review-${index + 1}">
        <div class="math-review-card-head"><span>${bi({ en: `Question ${index + 1}`, ar: `السؤال ${index + 1}` })}${item.n ? ` · ${examEscape(item.n)}` : ""}</span>${solution ? `<small>${solution.steps.length} ${bi({ en: "steps", ar: "خطوات" })}</small>` : ""}</div>
        <div class="math-review-question">${examText(item.q)}</div>
        <div class="math-review-your-answer"><b>${bi({ en: "Your answer", ar: "إجابتك" })}</b><div>${answer ? examEscape(answer) : bi({ en: "No answer entered", ar: "لم تكتب إجابة" })}</div></div>
        ${solutionButton}${solutionPanel}
      </article>`;
    }).join("");

    box.innerHTML = `<div class="score">${answered}/${N}</div><div class="msg">${bi(title)}<div>${bi(message)}</div></div>
      <div class="nav"><button class="btn" id="rt">${bi({ en: "Back to exam questions", ar: "الرجوع لأسئلة الامتحان" })}</button><button class="btn" id="retryWritten">${bi({ en: "Retry exam", ar: "إعادة الامتحان" })}</button><button class="btn main" id="cl">${bi({ en: "Back to lecture", ar: "العودة للمحاضرة" })}</button></div>
      ${hasGuidedMathSolutions ? `<section class="math-guided-review"><div class="math-review-intro"><h3>${bi({ en: "Review every question with a guided solution", ar: "راجع كل سؤال وشوف حله خطوة بخطوة" })}</h3><p>${bi({ en: "Open a question, then use Previous step and Next step. Each click explains why the algebra changes and animates the expression.", ar: "افتح أي سؤال، وبعدها استخدم زر الخطوة السابقة والتالية. كل ضغطة بتشرح سبب التغيير وبتعرض المعادلة قبل وبعد الحركة." })}</p></div>${reviewCards}</section>` : ""}`;

    $("#cl").onclick = () => this.close();
    $("#rt").onclick = () => { this.reviewSolutionId = null; this.reviewStep = 0; this.i = 0; this.draw(); };
    $("#retryWritten").onclick = () => this.startWritten(this.lec, this.cb, this.writtenExamId);

    $$("[data-review-open]", box).forEach(button => {
      button.onclick = () => {
        const id = button.dataset.reviewOpen;
        if (this.reviewSolutionId === id) {
          this.reviewSolutionId = null;
          this.reviewStep = 0;
        } else {
          this.reviewSolutionId = id;
          this.reviewStep = 0;
        }
        this.writtenResult(true);
      };
    });
    $$("[data-review-step]", box).forEach(button => {
      button.onclick = () => {
        const id = button.dataset.reviewStepId;
        const solution = bankQuestions.find(q => q.id === id);
        if (!solution) return;
        const current = Number(button.dataset.reviewStep);
        this.reviewSolutionId = id;
        this.reviewStep = Math.max(0, Math.min(solution.steps.length - 1, current));
        this.writtenResult(true);
      };
    });

    $("#ex").scrollTop = preserveScroll ? oldScroll : 0;
    if (typeof Tr !== "undefined" && Tr.wrap) Tr.wrap(box);
    this.saveState("result");
  },

  result() {
    if (this.mode === "written") return this.writtenResult();
    if (this.mode === "pdf") return this.drawPdf();

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
    $("#ex").scrollTop = 0;
    Tr.wrap(box);
    this.saveState("result");

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
