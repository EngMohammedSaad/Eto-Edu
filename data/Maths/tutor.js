/* MAT 101 math formatter/data. Legacy Maths Lab launcher is forcibly disabled. */
(function () {
  'use strict';

  // Clean up the previous version BEFORE checking the install flag. The old
  // version set __MATHS_TUTOR_INSTALLED__ and added the floating button, so
  // checking the flag first caused the cleanup below to be skipped.
  function removeLegacyMathsLab() {
    const launcher = document.getElementById('maths-tutor-launcher');
    if (launcher) launcher.remove();

    const legacyPanel = document.getElementById('maths-study-lab');
    if (legacyPanel) {
      legacyPanel.remove();
      const examIsOpen = document.getElementById('ex')?.style.display === 'block';
      if (!examIsOpen && document.body?.style.overflow === 'hidden') {
        document.body.style.overflow = '';
      }
    }

    // Keep the equation formatter, but disable APIs which opened the old modal.
    const oldTutor = window.MathsTutor;
    if (oldTutor) {
      Reflect.deleteProperty(oldTutor, 'open');
      Reflect.deleteProperty(oldTutor, 'close');
      Reflect.deleteProperty(oldTutor, 'render');
      Reflect.deleteProperty(oldTutor, 'openWorksheets');
    }
  }

  removeLegacyMathsLab();

  // Failsafe: hide the old launcher and modal even if a stale/cached copy of
  // tutor.js tries to add them again. Guided review remains inside exam.js.
  if (!document.getElementById('maths-no-floating-lab-guard')) {
    const guardStyle = document.createElement('style');
    guardStyle.id = 'maths-no-floating-lab-guard';
    guardStyle.textContent = '#maths-tutor-launcher{display:none!important;visibility:hidden!important;pointer-events:none!important}#maths-study-lab{display:none!important;visibility:hidden!important;pointer-events:none!important}';
    (document.head || document.documentElement).appendChild(guardStyle);
  }

  if (!window.__MATHS_LEGACY_LAUNCHER_GUARD__) {
    window.__MATHS_LEGACY_LAUNCHER_GUARD__ = true;
    const observer = new MutationObserver(removeLegacyMathsLab);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    // The CSS failsafe remains permanent; the observer only removes stale nodes.
    window.setTimeout(() => observer.disconnect(), 30000);
  }

  if (window.__MATHS_TUTOR_INSTALLED__) return;
  window.__MATHS_TUTOR_INSTALLED__ = true;

  const SHEETS = () => window.MATHS_SHEETS || { meta: {}, questions: [] };
  const state = { lang: document.documentElement.lang === 'en' ? 'en' : 'ar', tab: 'lessons', sheet: 'math-sheet-1', selected: null, step: -1, query: '', section: 'all', graph: 'x2', answerAttempt: '', showSolution: false };
  const rootId = 'maths-study-lab';
  const doneKey = 'etoedu-maths-tutor-done-v1';
  const savedAttemptKey = 'etoedu-maths-tutor-attempts-v1';
  const done = readStore(doneKey, {});
  const attempts = readStore(savedAttemptKey, {});

  function readStore(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; } catch (_) { return fallback; } }
  function saveStore(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function getText(v) { return v && typeof v === 'object' ? (v[state.lang] || v.en || v.ar || '') : String(v || ''); }

  // Small offline TeX formatter. Fractions render vertically; powers/subscripts/root indices are real typography.
  function readGroup(s, start) {
    if (s[start] !== '{') return { value: s[start] || '', end: start + 1 };
    let depth = 1, i = start + 1;
    for (; i < s.length && depth; i++) { if (s[i] === '{') depth++; else if (s[i] === '}') depth--; }
    return { value: s.slice(start + 1, Math.max(start + 1, i - 1)), end: i };
  }
  function math(src) {
    const s = String(src == null ? '' : src);
    let out = '';
    for (let i = 0; i < s.length;) {
      if (s[i] === '\\') {
        const rest = s.slice(i);
        // TeX spacing commands use punctuation, not alphabetic command names.
        if ([';', ',', '!', ' '].includes(s[i + 1])) { out += s[i + 1] === '!' ? '' : ' '; i += 2; continue; }
        const cmdMatch = rest.match(/^\\([a-zA-Z]+)/);
        if (!cmdMatch) { out += esc(s[i + 1] || ''); i += 2; continue; }
        const cmd = cmdMatch[1]; i += cmdMatch[0].length;
        if (cmd === 'left' || cmd === 'right') continue;
        if (cmd === 'not') {
          const next = s.slice(i).match(/^\\([a-zA-Z]+)/);
          const negated = next ? ({ge:'≱',geq:'≱',gt:'≯',le:'≰',leq:'≰',lt:'≮',in:'∉'}[next[1]]) : null;
          if (next && negated) { out += negated; i += next[0].length; }
          else out += '¬';
          continue;
        }
        if (cmd === 'quad' || cmd === 'qquad' || cmd === 'enspace' || cmd === ';' || cmd === ',') { out += ' '; continue; }
        if (cmd === 'frac' || cmd === 'dfrac' || cmd === 'tfrac') {
          const a = readGroup(s, i); i = a.end; const b = readGroup(s, i); i = b.end;
          out += '<span class="mfrac" style="display:inline-grid;grid-template-rows:auto auto;vertical-align:middle;text-align:center;line-height:1.2;font-size:.92em;margin:0 .1em;white-space:nowrap"><span style="border-bottom:1.2px solid currentColor;padding:0 .2em .07em">' + math(a.value) + '</span><span style="padding:.05em .2em 0">' + math(b.value) + '</span></span>'; continue;
        }
        if (cmd === 'sqrt') {
          let index = '';
          if (s[i] === '[') { const close = s.indexOf(']', i + 1); if (close >= 0) { index = s.slice(i + 1, close); i = close + 1; } }
          const a = readGroup(s, i); i = a.end;
          out += '<span class="msqrt" style="display:inline-flex;align-items:stretch;vertical-align:middle;padding-left:.04em">' + (index ? '<sup class="root-index" style="font-size:.48em;align-self:flex-start;margin-right:-.12em;line-height:1">' + math(index) + '</sup>' : '') + '<span class="root-sign" style="font-size:1.22em;line-height:1;align-self:center">√</span><span class="radicand" style="border-top:1px solid currentColor;padding:0 .08em 0 .04em;line-height:1.25">' + math(a.value) + '</span></span>'; continue;
        }
        if (cmd === 'text' || cmd === 'mathrm' || cmd === 'operatorname') { const a = readGroup(s, i); i = a.end; out += '<span class="mtext">' + math(a.value) + '</span>'; continue; }
        const map = {cdot:'·',times:'×',div:'÷',pm:'±',le:'≤',leq:'≤',ge:'≥',geq:'≥',ne:'≠',neq:'≠',infty:'∞',cup:'∪',cap:'∩',Rightarrow:'⇒',rightarrow:'→',leftarrow:'←',forall:'∀',in:'∈',notin:'∉',varnothing:'∅',emptyset:'∅',mathbb:'',deg:'°',approx:'≈',therefore:'∴'};
        if (cmd === 'mathbb') {
          let ch = '';
          while (s[i] && /\s/.test(s[i])) i++;
          if (s[i] === '{') { const a = readGroup(s, i); ch = a.value; i = a.end; }
          else { ch = s[i] || ''; i += ch ? 1 : 0; }
          out += ch === 'R' ? 'ℝ' : esc(ch); continue;
        }
        out += map[cmd] != null ? map[cmd] : esc('\\' + cmd); continue;
      }
      if (s[i] === '^' || s[i] === '_') {
        const type = s[i++], a = readGroup(s, i); i = a.end;
        out += type === '^' ? '<sup>' + math(a.value) + '</sup>' : '<sub>' + math(a.value) + '</sub>';
        continue;
      }
      if (s[i] === '/') { out += ' ÷ '; i++; continue; }
      if (s[i] === '{' || s[i] === '}') { i++; continue; }
      out += esc(s[i++]);
    }
    return out;
  }

  const copy = {
    ar: {
      button: 'شرح الرياضيات', title: 'شرح الرياضيات · MAT 101', subtitle: 'افهم القاعدة، شوف الجراف، وبعدها حل السؤال خطوة بخطوة',
      lessons: 'شرح المحاضرات', graphs: 'معمل الجرافات', worksheets: 'الشيتات والحلول', language: 'English', close: 'إغلاق',
      learn: 'ابدأ من هنا', source: 'من ملفات المحاضرات المرفوعة', focus: 'ركز في الامتحان', key: 'الخلاصة',
      chooseGraph: 'اختار الدالة', graphInsight: 'اقرأ الرسم', x2: 'y = x² · قطع مكافئ', x3: 'y = x³ · تكعيبية', x: 'y = x · خط الهوية', recip: 'y = 1 على x', recip2: 'y = 1 على x²', sqrt: 'y = جذر x', negx2: 'y = −x² · انعكاس', shift: 'y = (x − 2)² + 1 · إزاحة',
      sheet: 'اختار الشيت', search: 'دور برقم السؤال أو جزء من المسألة…', allSections: 'كل أجزاء الشيت', questions: 'المسائل', progress: 'تقدمك', completed: 'اتحلّت', try: 'جرّب تحلها الأول (اختياري)', attempt: 'اكتب محاولتك هنا…', show: 'ورّيني الحل خطوة بخطوة', hide: 'إخفاء الحل', step: 'الخطوة', of: 'من', previous: 'الخطوة السابقة', next: 'الخطوة التالية', allSteps: 'اعرض كل الخطوات', restart: 'ابدأ من الأول', mark: 'علّم السؤال كمحلول', marked: 'تم تسجيل السؤال كمحلول ✓', prevQ: 'السؤال السابق', nextQ: 'السؤال التالي', answer: 'الإجابة النهائية', original: 'نص المسألة', topic: 'الفكرة', none: 'مفيش سؤال مطابق للبحث.', note: 'تنبيه', pdf: 'افتح الشيت الأصلي PDF', examples: 'مثال بالأنيميشن: نقل الحد للطرف الآخر', exampleDesc: 'إضافة 1 للطرفين لا تغيّر المساواة؛ وبعدها نقسم الطرفين على 2.', add1: 'أضفنا 1 للطرفين؛ −1 اختفت من الشمال وظهر +1 في اليمين.', divide2: 'قسمنا الطرفين على 2؛ لذلك معامل x اختفى وبقي x وحدها.', graphLabel: 'الرسم بيتولد رياضيًا هنا، مش صورة من الشيت.', noLectures: 'محتوى المحاضرات لم يتحمّل بعد. اقفل النافذة وافتح مادة Mathematics مرة تانية.',
      graphDomain: 'المجال', graphRange: 'المدى', graphShape: 'شكل الرسم', graphCheck: 'إيه اللي تلاحظه؟', noSolution: 'لا يوجد حل', finishSheet: 'وصلت لآخر الشيت؛ اختار أي سؤال من القائمة أو ارجع للأسئلة اللي محتاجة مراجعة.'
    },
    en: {
      button: 'Maths explanations', title: 'MAT 101 · Guided explanations', subtitle: 'Understand the rule, inspect the graph, then solve each question step by step',
      lessons: 'Lecture notes', graphs: 'Graph lab', worksheets: 'Worksheets & solutions', language: 'العربية', close: 'Close',
      learn: 'Start here', source: 'Based on your uploaded lecture PDFs', focus: 'Exam focus', key: 'Key idea',
      chooseGraph: 'Choose a function', graphInsight: 'Read the graph', x2: 'y = x² · Parabola', x3: 'y = x³ · Cubic', x: 'y = x · Identity', recip: 'y = 1/x', recip2: 'y = 1/x²', sqrt: 'y = √x', negx2: 'y = −x² · Reflection', shift: 'y = (x − 2)² + 1 · Shift',
      sheet: 'Choose worksheet', search: 'Search by question number or expression…', allSections: 'All worksheet sections', questions: 'Questions', progress: 'Your progress', completed: 'solved', try: 'Try it yourself first (optional)', attempt: 'Write your attempt here…', show: 'Show guided solution', hide: 'Hide solution', step: 'Step', of: 'of', previous: 'Previous step', next: 'Next step', allSteps: 'Show all steps', restart: 'Restart steps', mark: 'Mark as solved', marked: 'Marked as solved ✓', prevQ: 'Previous question', nextQ: 'Next question', answer: 'Final answer', original: 'Problem', topic: 'Topic', none: 'No matching questions.', note: 'Note', pdf: 'Open original worksheet PDF', examples: 'Animated example: move a term to the other side', exampleDesc: 'Add 1 to both sides to keep the equation balanced; then divide both sides by 2.', add1: 'Add 1 to both sides: −1 disappears from the left and +1 appears on the right.', divide2: 'Divide both sides by 2: the coefficient of x becomes 1, leaving x by itself.', graphLabel: 'This graph is generated mathematically; it is not a screenshot from the worksheet.', noLectures: 'Lecture data has not loaded yet. Close this panel and reopen Mathematics.',
      graphDomain: 'Domain', graphRange: 'Range', graphShape: 'Graph shape', graphCheck: 'What should you notice?', noSolution: 'No solution', finishSheet: 'You reached the end of this worksheet. Choose any question or revisit the ones you marked for review.'
    }
  };
  const t = k => copy[state.lang][k] || k;
  const currentQuestions = () => SHEETS().questions.filter(q => q.sheet === state.sheet);
  const currentQuestion = () => currentQuestions().find(q => q.id === state.selected) || currentQuestions()[0] || null;
  const solvedCount = sheet => SHEETS().questions.filter(q => q.sheet === sheet && done[q.id]).length;
  function persistAttempt(q) { if (!q) return; attempts[q.id] = state.answerAttempt; saveStore(savedAttemptKey, attempts); }
  function setSelected(q) {
    const old = SHEETS().questions.find(x => x.id === state.selected); if (old) persistAttempt(old);
    state.selected = q ? q.id : null; state.step = -1; state.showSolution = false; state.answerAttempt = q ? (attempts[q.id] || '') : '';
    render();
  }
  function open() {
    const q = currentQuestion(); if (!state.selected && q) { state.selected = q.id; state.answerAttempt = attempts[q.id] || ''; }
    let panel = document.getElementById(rootId);
    if (!panel) { panel = document.createElement('div'); panel.id = rootId; document.body.appendChild(panel); }
    panel.innerHTML = shell(); panel.classList.add('open'); document.body.style.overflow = 'hidden';
    // Event delegation is attached once; reopening the lab must not duplicate clicks.
    if (panel.dataset.mlBound !== 'true') { bindShell(); panel.dataset.mlBound = 'true'; }
    render();
  }
  function close() { const panel = document.getElementById(rootId); if (panel) panel.classList.remove('open'); document.body.style.overflow = ''; }
  function openWorksheets(sheetId) {
    const old = SHEETS().questions.find(x => x.id === state.selected);
    if (old) persistAttempt(old);
    const target = SHEETS().meta[sheetId] ? sheetId : 'math-sheet-1';
    state.sheet = target;
    state.tab = 'worksheets';
    state.section = 'all';
    state.query = '';
    const q = SHEETS().questions.find(x => x.sheet === target);
    state.selected = q ? q.id : null;
    state.step = -1;
    state.showSolution = false;
    state.answerAttempt = q ? (attempts[q.id] || '') : '';
    open();
  }
  function shell() {
    return `<style>${css}</style><div class="ml-backdrop" data-close="true"></div><section class="ml-window" role="dialog" aria-modal="true" aria-label="Maths Study Lab"><header class="ml-header"><div class="ml-brand"><span class="ml-mark">∑</span><div><h1>${t('title')}</h1><p>${t('subtitle')}</p></div></div><div class="ml-head-actions"><button class="ml-btn ml-ghost" data-action="lang">${t('language')}</button><button class="ml-btn ml-close" data-action="close" aria-label="${t('close')}">×</button></div></header><nav class="ml-tabs"><button data-tab="lessons">${t('lessons')}</button><button data-tab="graphs">${t('graphs')}</button><button data-tab="worksheets">${t('worksheets')}</button></nav><main class="ml-content" id="ml-content"></main></section>`;
  }
  function bindShell() {
    const panel = document.getElementById(rootId); if (!panel) return;
    panel.addEventListener('click', e => {
      if (e.target.closest('[data-close="true"]')) return close();
      const act = e.target.closest('[data-action]');
      if (act) {
        const a = act.dataset.action;
        if (a === 'close') return close();
        if (a === 'lang') {
          const q = currentQuestion(); if (q) persistAttempt(q);
          state.lang = state.lang === 'ar' ? 'en' : 'ar';
          render();
          return;
        }
      }
      const tab = e.target.closest('[data-tab]'); if (tab) { state.tab = tab.dataset.tab; render(); return; }
      const qbtn = e.target.closest('[data-qid]'); if (qbtn) { const q = SHEETS().questions.find(x => x.id === qbtn.dataset.qid); if (q) setSelected(q); return; }
      const sheetbtn = e.target.closest('[data-sheet]'); if (sheetbtn) { state.sheet = sheetbtn.dataset.sheet; state.section = 'all'; state.query=''; setSelected(currentQuestions()[0]); return; }
      const graphbtn = e.target.closest('[data-graph]'); if (graphbtn) { state.graph = graphbtn.dataset.graph; render(); return; }
      const stepbtn = e.target.closest('[data-step-action]'); if (stepbtn) {
        const q = currentQuestion(); if (!q) return; const a = stepbtn.dataset.stepAction;
        if (a === 'show') { state.showSolution = true; state.step = 0; render(); }
        if (a === 'hide') { state.showSolution = false; state.step = -1; render(); }
        if (a === 'next') { state.showSolution = true; state.step = Math.min(q.steps.length-1, Math.max(0,state.step+1)); if (state.step === q.steps.length-1) { done[q.id] = true; saveStore(doneKey,done); } render(); }
        if (a === 'prev') { state.step = Math.max(0,state.step-1); render(); }
        if (a === 'all') { state.showSolution = true; state.step = q.steps.length-1; done[q.id] = true; saveStore(doneKey,done); render(true); }
        if (a === 'restart') { state.showSolution = true; state.step = 0; render(); }
        if (a === 'mark') { done[q.id] = !done[q.id]; saveStore(doneKey,done); render(); }
        if (a === 'prevq') { moveQuestion(-1); }
        if (a === 'nextq') { moveQuestion(1); }
      }
    });
    panel.addEventListener('input', e => {
      if (e.target.id === 'ml-search') { state.query = e.target.value; renderQuestionsOnly(); }
      if (e.target.id === 'ml-attempt') { state.answerAttempt = e.target.value; const q = currentQuestion(); if (q) persistAttempt(q); }
    });
    panel.addEventListener('change', e => {
      if (e.target.id === 'ml-sheet') { state.sheet = e.target.value; state.section = 'all'; state.query=''; setSelected(currentQuestions()[0]); }
      if (e.target.id === 'ml-section') { state.section = e.target.value; renderQuestionsOnly(); }
    });
    bindHeaderOnly();
  }
  // Header controls and tabs are handled by the single delegated listener above.
  function bindHeaderOnly() {}
  function render(allSteps) {
    const panel = document.getElementById(rootId); if (!panel || !panel.classList.contains('open')) return;
    panel.querySelector('.ml-header')?.remove();
    const headHtml = shell().match(/<header class="ml-header">[\s\S]*?<\/header>/)?.[0] || '';
    panel.querySelector('.ml-window')?.insertAdjacentHTML('afterbegin', headHtml);
    const windowEl=panel.querySelector('.ml-window'); if(windowEl) windowEl.setAttribute('dir',state.lang==='ar'?'rtl':'ltr');
    panel.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===state.tab));
    const content=panel.querySelector('#ml-content'); if(!content)return;
    if(state.tab==='lessons') content.innerHTML=renderLessons();
    else if(state.tab==='graphs') content.innerHTML=renderGraphs();
    else content.innerHTML=renderWorksheets(allSteps);
    bindHeaderOnly();
  }
  function renderLessons() {
    const lectures=Object.values(window.LECTURES||{}).filter(l=>/^math-\d/.test(l.id||'')).sort((a,b)=>a.number-b.number);
    let html=`<div class="ml-section-intro"><span class="ml-eyebrow">${t('learn')}</span><h2>${state.lang==='ar'?'ملخص أول 3 محاضرات':'Summaries of the first 3 lectures'}</h2><p>${t('source')}</p></div>`;
    if(!lectures.length) return html+`<div class="ml-empty">${t('noLectures')}</div>`;
    html += `<div class="ml-lesson-list">`+lectures.map((lec,i)=>{
      const title=getText(lec.title), desc=getText(lec.description);
      return `<article class="ml-lesson"><div class="ml-lesson-head"><span class="ml-number">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(title)}</h3><p>${esc(desc)}</p></div></div><div class="ml-lesson-sections">${(lec.sections||[]).map(sec=>`<details class="ml-lesson-section" ${i===0&&sec.id==='s1'?'open':''}><summary>${esc(getText(sec.title))}</summary><div class="ml-points">${(sec.points||[]).map(p=>`<div class="ml-point">${trustedInline(getText(p))}</div>`).join('')} ${(sec.key&&getText(sec.key))?`<div class="ml-key"><b>${t('key')}:</b> ${trustedInline(getText(sec.key))}</div>`:''} ${(sec.examFocus&&sec.examFocus.length)?`<div class="ml-focus"><b>${t('focus')}</b><ul>${sec.examFocus.map(f=>`<li>${trustedInline(getText(f))}</li>`).join('')}</ul></div>`:''}</div></details>`).join('')}</div></article>`;
    }).join('')+`</div>`;
    html += `<article class="ml-demo"><span class="ml-eyebrow">${t('examples')}</span><h3>${math('2x-1=0')}</h3><div class="ml-demo-split"><div class="ml-demo-step"><span>01</span><b>${state.lang==='ar'?'أضف 1 للطرفين':'Add 1 to both sides'}</b><div class="ml-sign-change"><span class="ml-sign-old">−1</span><span class="ml-arrow">⟶</span><span class="ml-sign-new">+1</span></div><div class="ml-equation">${math('2x-1=0')} <span class="ml-arrow">⟶</span> ${math('2x=1')}</div><p>${t('add1')}</p></div><div class="ml-demo-step"><span>02</span><b>${state.lang==='ar'?'اقسم الطرفين على 2':'Divide both sides by 2'}</b><div class="ml-equation">${math('2x=1')} <span class="ml-arrow">⟶</span> ${math('x=\\frac12')}</div><p>${t('divide2')}</p></div></div><p class="ml-hint">${state.lang==='ar'?'قاعدة مهمة: ما بننقلش الحد بطريقة سحرية؛ بنعمل نفس العملية للطرفين، وعشان كده الإشارة بتتغير عند إضافة/طرح الحد من الطرفين.':'Key idea: a term does not magically move. We perform the same operation on both sides, which explains the sign change.'}</p></article>`;
    return html;
  }
  function trustedInline(s) {
    // Local lecture notes contain a few intentional <b> tags; escape all other markup.
    return String(s||'').replace(/<\/?(b|i|sup|sub)>/g,'@@$&@@').split('@@').map((part,i)=>i%2?part:esc(part)).join('');
  }
  const graphInfo = {
    x2:{label:'x2',en:'Parabola opening upward. Vertex at (0, 0), symmetric about the y-axis. Domain: all real numbers. Range: y ≥ 0.',ar:'قطع مكافئ مفتوح لفوق، ورأسه (0، 0)، ومتماثل حول محور y. المجال كل الأعداد الحقيقية، والمدى y ≥ 0.'},
    x3:{label:'x3',en:'An increasing cubic through (0, 0). It is one-to-one, so it passes the horizontal-line test.',ar:'دالة تكعيبية متزايدة بتمر بنقطة الأصل (0، 0). هي واحد لواحد، فبتنجح في اختبار الخط الأفقي.'},
    x:{label:'x',en:'The identity line y = x. Every point has equal x and y coordinates; slope = 1.',ar:'خط الهوية y = x. كل نقطة فيه إحداثياها متساويان، وميله يساوي 1.'},
    recip:{label:'1/x',en:'Two branches in quadrants I and III. x = 0 is not in the domain, and y = 0 is not in the range.',ar:'فرعان في الربعين الأول والثالث. x = 0 خارج المجال، وy = 0 خارج المدى.'},
    recip2:{label:'1/x²',en:'Always positive except undefined at x = 0; symmetric about the y-axis. Range: y > 0.',ar:'موجبة دائمًا ما عدا عند x = 0 غير المعرّف؛ متماثلة حول محور y. المدى y > 0.'},
    sqrt:{label:'sqrt',en:'Starts at (0, 0), only exists for x ≥ 0 over the real numbers, and outputs y ≥ 0.',ar:'تبدأ من (0، 0)، وموجودة على الأعداد الحقيقية فقط عندما x ≥ 0، ومخرجاتها y ≥ 0.'},
    negx2:{label:'-x2',en:'Reflection of y = x² across the x-axis. The parabola opens downward.',ar:'انعكاس y = x² حول محور x. القطع المكافئ هنا مفتوح لتحت.'},
    shift:{label:'shift',en:'Compared with y = x², this graph shifts 2 units right and 1 unit up. The vertex becomes (2, 1).',ar:'مقارنةً بـ y = x²، الرسم اتحرك وحدتين يمين ووحدة لفوق. الرأس بقى (2، 1).'}
  };
  function fnGraph(id,x) {
    switch(id){case'x2':return x*x;case'x3':return x*x*x;case'x':return x;case'recip':return Math.abs(x)<0.06?NaN:1/x;case'recip2':return Math.abs(x)<0.06?NaN:1/(x*x);case'sqrt':return x<0?NaN:Math.sqrt(x);case'negx2':return -x*x;case'shift':return (x-2)*(x-2)+1;default:return x*x;}
  }
  function graphSVG(id) {
    const W=800,H=440,xmin=-5,xmax=5,ymin=-4,ymax=8;
    const X=x=>((x-xmin)/(xmax-xmin))*W, Y=y=>H-((y-ymin)/(ymax-ymin))*H;
    let lines='';
    for(let x=Math.ceil(xmin);x<=xmax;x++) lines+=`<line x1="${X(x)}" y1="0" x2="${X(x)}" y2="${H}" class="gridline"/>`;
    for(let y=Math.ceil(ymin);y<=ymax;y++) lines+=`<line x1="0" y1="${Y(y)}" x2="${W}" y2="${Y(y)}" class="gridline"/>`;
    let labels='';
    for(let x=Math.ceil(xmin);x<=xmax;x++) if(x!==0) labels+=`<text x="${X(x)}" y="${Y(0)+20}" class="tick" text-anchor="middle">${x}</text>`;
    for(let y=Math.ceil(ymin);y<=ymax;y++) if(y!==0) labels+=`<text x="${X(0)-12}" y="${Y(y)+4}" class="tick" text-anchor="end">${y}</text>`;
    let d='',open=false;
    for(let px=0;px<=W;px+=2){const x=xmin+px/W*(xmax-xmin), y=fnGraph(id,x); if(!Number.isFinite(y)||y<ymin-2||y>ymax+2){open=false;continue;} const coord=`${px.toFixed(2)},${Y(y).toFixed(2)}`; d+=(open?' L ':' M ')+coord;open=true;}
    return `<svg class="ml-graph" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(graphInfo[id][state.lang])}"><defs><clipPath id="ml-graph-clip"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath></defs>${lines}<line x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}" class="axis"/><line x1="${X(0)}" y1="0" x2="${X(0)}" y2="${H}" class="axis"/><path d="${d}" class="curve" clip-path="url(#ml-graph-clip)"/><path d="M ${W-15} ${Y(0)-5} L ${W-4} ${Y(0)} L ${W-15} ${Y(0)+5}" class="axis-arrow"/><path d="M ${X(0)-5} 15 L ${X(0)} 4 L ${X(0)+5} 15" class="axis-arrow"/>${labels}<text x="${W-16}" y="${Y(0)-12}" class="axis-label">x</text><text x="${X(0)+10}" y="18" class="axis-label">y</text></svg>`;
  }
  function renderGraphs() {
    const options=[['x2','x2'],['x3','x3'],['x','x'],['recip','recip'],['recip2','recip2'],['sqrt','sqrt'],['negx2','negx2'],['shift','shift']];
    const selected=graphInfo[state.graph]||graphInfo.x2;
    return `<div class="ml-section-intro"><span class="ml-eyebrow">${t('graphs')}</span><h2>${state.lang==='ar'?'الجراف افهمه من شكله وسلوكه':'Learn a function by its shape and behaviour'}</h2><p>${t('graphLabel')}</p></div><div class="ml-graph-layout"><aside class="ml-graph-picker"><label>${t('chooseGraph')}</label>${options.map(([id,label])=>`<button data-graph="${id}" class="ml-graph-option ${state.graph===id?'active':''}">${t(label)}</button>`).join('')}</aside><div class="ml-graph-main"><div class="ml-graph-title"><b>${math(graphInfo[state.graph].label==='x2'?'y=x^2':graphInfo[state.graph].label==='x3'?'y=x^3':graphInfo[state.graph].label==='x'?'y=x':graphInfo[state.graph].label==='1/x'?'y=\\frac1x':graphInfo[state.graph].label==='1/x²'?'y=\\frac1{x^2}':graphInfo[state.graph].label==='sqrt'?'y=\\sqrt{x}':graphInfo[state.graph].label==='-x2'?'y=-x^2':'y=(x-2)^2+1')}</b><small>f(x)</small></div>${graphSVG(state.graph)}<div class="ml-graph-reading"><h3>${t('graphInsight')}</h3><p>${esc(selected[state.lang])}</p><div class="ml-graph-terms"><span><b>${t('graphDomain')}:</b> ${state.graph==='sqrt'?'x ≥ 0':(state.graph==='recip'||state.graph==='recip2')?'ℝ except 0':'ℝ'}</span><span><b>${t('graphRange')}:</b> ${state.graph==='x2'?'y ≥ 0':state.graph==='recip2'?'y > 0':state.graph==='sqrt'?'y ≥ 0':state.graph==='shift'?'y ≥ 1':state.graph==='negx2'?'y ≤ 0':state.graph==='recip'?'ℝ except 0':'ℝ'}</span></div></div></div></div>`;
  }
  function renderWorksheets(allSteps) {
    const meta=SHEETS().meta, current= currentQuestions(), q=currentQuestion();
    const sheetOptions=Object.keys(meta).map(id=>`<option value="${id}" ${state.sheet===id?'selected':''}>${esc(getText(meta[id].title))} · ${meta[id].count}</option>`).join('');
    const sectionSet=[...new Set(current.map(x=>x.section))];
    const sectionOptions=[['all',t('allSections')],...sectionSet.map(s=>[s,s])].map(([v,label])=>`<option value="${esc(v)}" ${state.section===v?'selected':''}>${esc(label)}</option>`).join('');
    return `<div class="ml-section-intro"><span class="ml-eyebrow">${t('worksheets')}</span><h2>${esc(getText(meta[state.sheet]?.title))}</h2><p>${esc(getText(meta[state.sheet]?.subtitle))}</p></div><div class="ml-sheet-controls"><label><span>${t('sheet')}</span><select id="ml-sheet">${sheetOptions}</select></label><label class="ml-search-wrap"><span>${t('search')}</span><input id="ml-search" type="search" value="${esc(state.query)}" placeholder="${esc(t('search'))}" /></label></div><div class="ml-progress"><div><b>${t('progress')}</b><span>${solvedCount(state.sheet)} / ${meta[state.sheet]?.count||0} ${t('completed')}</span></div><div class="ml-progress-track"><i style="width:${Math.round((solvedCount(state.sheet)/(meta[state.sheet]?.count||1))*100)}%"></i></div></div><div class="ml-worksheet-layout"><aside class="ml-question-nav"><div class="ml-qnav-top"><b>${t('questions')}</b><span>${current.length}</span></div><label class="ml-filter-label"><span>${t('allSections')}</span><select id="ml-section">${sectionOptions}</select></label><div id="ml-q-list">${questionList()}</div></aside><section class="ml-question-panel" id="ml-current">${renderQuestion(q,allSteps)}</section></div>`;
  }
  function questionList() {
    let qs=currentQuestions();
    if(state.section!=='all') qs=qs.filter(q=>q.section===state.section);
    if(state.query.trim()) {const z=state.query.toLowerCase();qs=qs.filter(q=>(q.q+' '+q.number+' '+q.section+' '+q.topic).toLowerCase().includes(z));}
    return qs.length?qs.map(q=>`<button class="ml-q-item ${q.id===state.selected?'active':''} ${done[q.id]?'done':''}" data-qid="${q.id}"><span class="ml-q-num">${q.section}.${q.number}</span><span class="ml-q-text">${math(q.q)}</span>${done[q.id]?'<span class="ml-q-check">✓</span>':''}</button>`).join(''):`<p class="ml-none">${t('none')}</p>`;
  }
  function renderQuestionsOnly(){
    const el=document.getElementById('ml-q-list');if(el)el.innerHTML=questionList();
    const prog=document.querySelector('#'+rootId+' .ml-progress');if(prog){const meta=SHEETS().meta[state.sheet];prog.innerHTML=`<div><b>${t('progress')}</b><span>${solvedCount(state.sheet)} / ${meta.count} ${t('completed')}</span></div><div class="ml-progress-track"><i style="width:${Math.round(solvedCount(state.sheet)/meta.count*100)}%"></i></div>`;}
  }
  function renderQuestion(q,allSteps) {
    if(!q)return `<div class="ml-empty">${t('finishSheet')}</div>`;
    const total=q.steps.length,shown=state.showSolution?Math.max(0,state.step+1):0;
    const step=q.steps[Math.max(0,state.step)];
    let solHtml='';
    if(state.showSolution && step && allSteps) {
      const cards=q.steps.map((s,i)=>{
        const before=i===0?q.q:q.steps[i-1].math;
        return `<div class="ml-step-card ${s.kind==='answer'?'final':''}"><div class="ml-step-explain"><span class="ml-step-count">${String(i+1).padStart(2,'0')}</span><p>${esc(s[state.lang]||s.en)}</p></div><div class="ml-math-move"><div class="ml-math-before">${math(before)}</div><span class="ml-animated-arrow" aria-hidden="true">⟶</span><div class="ml-math-after">${math(s.math)}</div></div>${s.kind==='answer'?`<div class="ml-answer-tag">✓ ${t('answer')}</div>`:''}</div>`;
      }).join('');
      solHtml=`<div class="ml-solution-head"><div><span class="ml-eyebrow">${total} ${state.lang==='ar'?'خطوات الحل':'solution steps'}</span><b>${state.lang==='ar'?'الحل كاملًا بالترتيب':'Full worked solution'}</b></div><div class="ml-step-dots">${q.steps.map(()=>'<i class="on"></i>').join('')}</div></div>${cards}<div class="ml-step-controls"><button class="ml-btn ml-primary" data-step-action="hide">${t('hide')}</button><button class="ml-btn ml-ghost" data-step-action="restart">↺ ${t('restart')}</button></div><div class="ml-final-answer"><b>${t('answer')}</b><div>${math(q.answer)}</div>${q.note?`<p>${esc(q.note)}</p>`:''}</div>`;
    } else if(state.showSolution && step) {
      const oldMath=state.step===0?q.q:q.steps[state.step-1].math;
      solHtml=`<div class="ml-solution-head"><div><span class="ml-eyebrow">${t('step')} ${state.step+1} ${t('of')} ${total}</span><b>${state.lang==='ar'?'تابع التحويل الرياضي':'Follow the algebraic transformation'}</b></div><div class="ml-step-dots">${q.steps.map((_,i)=>`<i class="${i<=state.step?'on':''}"></i>`).join('')}</div></div><div class="ml-step-card ${step.kind==='answer'?'final':''}"><div class="ml-step-explain"><span class="ml-step-count">${String(state.step+1).padStart(2,'0')}</span><p>${esc(step[state.lang]||step.en)}</p></div><div class="ml-math-move"><div class="ml-math-before">${math(oldMath)}</div><span class="ml-animated-arrow" aria-hidden="true">⟶</span><div class="ml-math-after">${math(step.math)}</div></div>${step.kind==='answer'?`<div class="ml-answer-tag">✓ ${t('answer')}</div>`:''}</div><div class="ml-step-controls"><button class="ml-btn ml-secondary" data-step-action="prev" ${state.step===0?'disabled':''}>← ${t('previous')}</button><button class="ml-btn ml-primary" data-step-action="next" ${state.step>=total-1?'disabled':''}>${t('next')} →</button><button class="ml-btn ml-ghost" data-step-action="all">${t('allSteps')}</button><button class="ml-btn ml-ghost" data-step-action="restart">↺ ${t('restart')}</button></div>`;
      if(state.step===total-1) solHtml+=`<div class="ml-final-answer"><b>${t('answer')}</b><div>${math(q.answer)}</div>${q.note?`<p>${esc(q.note)}</p>`:''}</div>`;
    } else {
      solHtml=`<div class="ml-solution-locked"><div class="ml-lock-icon">✦</div><h3>${state.lang==='ar'?'مش عارف تكمل؟ خلينا نفكها واحدة واحدة':'Stuck? Let’s break it down'}</h3><p>${state.lang==='ar'?'كل ضغطة هتظهر خطوة واحدة مع سببها بالعربي والإنجليزي، مش مجرد الإجابة النهائية.':'Each click reveals one step and explains why it works, in Arabic and English.'}</p><button class="ml-btn ml-primary" data-step-action="show">${t('show')}</button></div>`;
    }
    const attempt=attempts[q.id]||state.answerAttempt||'';
    const doneBtn=done[q.id]?`<button class="ml-btn ml-done" data-step-action="mark">${t('marked')}</button>`:`<button class="ml-btn ml-ghost" data-step-action="mark">${t('mark')}</button>`;
    return `<div class="ml-question-head"><div><span class="ml-eyebrow">${esc(q.section)} · ${t('questions')} ${q.number}</span><h2>${esc(q.topic)}</h2></div><span class="ml-question-status ${done[q.id]?'is-done':''}">${done[q.id]?'✓':q.steps.length+' '+(state.lang==='ar'?'خطوات':'steps')}</span></div><article class="ml-problem"><div class="ml-problem-label">${t('original')}</div><div class="ml-formula-large">${math(q.q)}</div></article><div class="ml-attempt"><label for="ml-attempt">${t('try')}</label><textarea id="ml-attempt" rows="2" placeholder="${esc(t('attempt'))}">${esc(attempt)}</textarea><small>${state.lang==='ar'?'محاولتك بتتحفظ على نفس الجهاز؛ الحل مش بيتفتح إلا لما تدوس الزر.':'Your attempt is saved locally on this device; the solution stays hidden until you open it.'}</small></div>${solHtml}<div class="ml-q-bottom"><button class="ml-btn ml-secondary" data-step-action="prevq">← ${t('prevQ')}</button>${doneBtn}<button class="ml-btn ml-secondary" data-step-action="nextq">${t('nextQ')} →</button></div>`;
  }
  function moveQuestion(delta) {
    const all=currentQuestions();let ix=all.findIndex(q=>q.id===state.selected);ix=Math.min(all.length-1,Math.max(0,ix+delta));if(all[ix])setSelected(all[ix]);
  }

  const css = `
  #${rootId}{position:fixed;inset:0;z-index:2147483000;display:none;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Tahoma,Arial,sans-serif;color:#172033}#${rootId}.open{display:block}#${rootId} *{box-sizing:border-box}#${rootId} .ml-backdrop{position:absolute;inset:0;background:rgba(8,12,30,.72);backdrop-filter:blur(7px)}#${rootId} .ml-window{position:absolute;inset:2.5vh 2vw;display:flex;flex-direction:column;background:#f6f7fb;border:1px solid rgba(255,255,255,.35);border-radius:22px;overflow:hidden;box-shadow:0 28px 100px rgba(0,0,0,.4)}#${rootId} .ml-header{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 24px;background:#151735;color:#fff}#${rootId} .ml-brand{display:flex;align-items:center;gap:14px;min-width:0}#${rootId} .ml-mark{width:48px;height:48px;display:grid;place-items:center;border-radius:15px;background:linear-gradient(145deg,#9e68ff,#5b44e5);font-size:27px;font-weight:800;color:#fff;box-shadow:0 8px 24px #8055f45c}#${rootId} .ml-header h1{font-size:clamp(17px,2vw,23px);margin:0 0 4px;font-weight:800;letter-spacing:-.02em}#${rootId} .ml-header p{font-size:12px;color:#c7c9e6;margin:0;line-height:1.5}#${rootId} .ml-head-actions{display:flex;align-items:center;gap:8px;flex:0 0 auto}#${rootId} .ml-tabs{display:flex;gap:6px;padding:10px 22px;background:#fff;border-bottom:1px solid #e4e7f0;flex:0 0 auto}#${rootId} .ml-tabs button{border:0;background:transparent;color:#66708a;padding:11px 17px;border-radius:10px;font-weight:750;cursor:pointer;font-size:13px}#${rootId} .ml-tabs button.active{background:#ede7ff;color:#5426c9}#${rootId} .ml-content{flex:1;overflow:auto;padding:22px 24px 30px}#${rootId} .ml-btn{font:inherit;font-size:12px;font-weight:750;border:1px solid #e1e5ef;border-radius:10px;padding:10px 13px;cursor:pointer;transition:transform .15s,background .2s,border .2s}#${rootId} .ml-btn:hover:not(:disabled){transform:translateY(-1px)}#${rootId} .ml-btn:disabled{opacity:.4;cursor:not-allowed}#${rootId} .ml-ghost{background:#fff;color:#5141a7}#${rootId} .ml-close{background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.2);width:40px;height:40px;font-size:24px;padding:0}#${rootId} .ml-primary{background:#6138d9;color:#fff;border-color:#6138d9;box-shadow:0 5px 16px #6e50de30}#${rootId} .ml-secondary{background:#fff;color:#414b65}#${rootId} .ml-done{background:#e7f7ed;color:#177548;border-color:#c3ebd1}#${rootId} .ml-section-intro{margin:2px 0 19px}#${rootId} .ml-eyebrow{display:block;text-transform:uppercase;letter-spacing:.1em;color:#7956d9;font-size:10px;font-weight:850;margin-bottom:6px}#${rootId} .ml-section-intro h2{font-size:clamp(21px,2.3vw,30px);margin:0 0 7px;color:#1e2440;letter-spacing:-.03em}#${rootId} .ml-section-intro p{margin:0;color:#748099;font-size:13px;line-height:1.65}#${rootId} .ml-lesson-list{display:grid;gap:14px}#${rootId} .ml-lesson{background:#fff;border:1px solid #e3e6f0;border-radius:16px;overflow:hidden;box-shadow:0 5px 18px #262d5010}#${rootId} .ml-lesson-head{padding:18px 20px;display:flex;align-items:center;gap:13px;background:linear-gradient(100deg,#f1edff,#fff)}#${rootId} .ml-number{width:42px;height:42px;border-radius:13px;background:#6847dc;color:#fff;display:grid;place-items:center;font-weight:850;font-size:13px;flex:0 0 auto}#${rootId} .ml-lesson-head h3{margin:0 0 4px;font-size:16px;color:#252849}#${rootId} .ml-lesson-head p{margin:0;font-size:12px;color:#747b95;line-height:1.5}#${rootId} .ml-lesson-sections{padding:0 17px 14px}#${rootId} .ml-lesson-section{border-top:1px solid #eef0f6;padding:12px 3px}#${rootId} .ml-lesson-section summary{font-weight:800;color:#313653;cursor:pointer;font-size:13px}#${rootId} .ml-points{padding:8px 2px 0;color:#555f79;font-size:13px;line-height:1.8}#${rootId} .ml-point{padding:5px 0}#${rootId} .ml-key{margin-top:9px;background:#f3efff;border-inline-start:3px solid #8766ec;border-radius:8px;padding:10px 12px;color:#342c68}#${rootId} .ml-focus{margin-top:10px;padding:10px 12px;border:1px solid #f1e2bf;border-radius:8px;background:#fffaf0;color:#735623}#${rootId} .ml-focus ul{padding-inline-start:20px;margin:5px 0 0}#${rootId} .ml-demo{margin-top:18px;border:1px solid #ddd7fb;border-radius:17px;padding:20px;background:#fff}#${rootId} .ml-demo h3{font-size:24px;margin:0 0 14px;color:#29234c}#${rootId} .ml-demo-split{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}#${rootId} .ml-demo-step{border:1px solid #ece9fa;border-radius:13px;padding:14px;overflow:hidden}#${rootId} .ml-demo-step>span{display:inline-grid;place-items:center;width:27px;height:27px;border-radius:8px;background:#ede8ff;color:#6439d4;font-size:11px;font-weight:850;margin-bottom:9px}#${rootId} .ml-demo-step>b{display:block;font-size:13px;color:#30324e}#${rootId} .ml-demo-step p{font-size:12px;line-height:1.65;color:#727a93;margin-bottom:0}#${rootId} .ml-equation{margin-top:14px;padding:12px 8px;border-radius:10px;background:#f7f5ff;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;font-size:20px}#${rootId} .ml-arrow{color:#8156ed;display:inline-block;animation:ml-arrow-bob 1.15s ease-in-out infinite;font-size:25px}#${rootId} .ml-sign-change{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:12px;padding:9px;border:1px dashed #ded6ff;border-radius:10px;background:#fcfbff}#${rootId} .ml-sign-old,#${rootId} .ml-sign-new{display:inline-grid;place-items:center;min-width:42px;padding:6px 10px;border-radius:9px;font-weight:900;font-size:17px}#${rootId} .ml-sign-old{background:#ffeded;color:#af3535;animation:ml-sign-fade 1.3s ease-in-out infinite alternate}#${rootId} .ml-sign-new{background:#e7f7ed;color:#137446;animation:ml-sign-appear 1.3s ease-in-out infinite alternate}#${rootId} .ml-hint{margin:16px 0 0;border-top:1px solid #eeeafc;padding-top:13px;color:#5d527c;font-size:12px;line-height:1.75}#${rootId} .ml-graph-layout{display:grid;grid-template-columns:220px minmax(0,1fr);gap:16px;align-items:start}#${rootId} .ml-graph-picker{background:#fff;border:1px solid #e2e6ef;border-radius:15px;padding:14px;display:grid;gap:7px}#${rootId} .ml-graph-picker label{font-weight:850;font-size:12px;color:#4a526b;margin:2px 4px 5px}#${rootId} .ml-graph-option{border:1px solid transparent;border-radius:9px;padding:10px 9px;text-align:start;background:#f7f8fc;color:#505a75;font-size:12px;font-weight:700;cursor:pointer}#${rootId} .ml-graph-option.active{border-color:#d5c9ff;background:#eee8ff;color:#5024be}#${rootId} .ml-graph-main{min-width:0;background:#fff;border:1px solid #e2e6ef;border-radius:15px;padding:16px}#${rootId} .ml-graph-title{display:flex;align-items:center;justify-content:space-between;color:#282c4a;margin:0 2px 10px;font-size:18px}#${rootId} .ml-graph-title small{font-size:11px;color:#8990a6}#${rootId} .ml-graph{display:block;width:100%;background:#fbfcff;border:1px solid #eef0f7;border-radius:12px;overflow:hidden}#${rootId} .gridline{stroke:#e8ebf4;stroke-width:1}#${rootId} .axis{stroke:#6e7790;stroke-width:1.5}#${rootId} .axis-arrow{stroke:#6e7790;stroke-width:1.5;fill:none;stroke-linecap:round;stroke-linejoin:round}#${rootId} .curve{stroke:#7650e7;stroke-width:4;fill:none;stroke-linecap:round;stroke-linejoin:round}#${rootId} .tick{fill:#8a91a6;font-size:11px}#${rootId} .axis-label{fill:#505976;font-size:13px;font-weight:800}#${rootId} .ml-graph-reading{margin-top:14px;padding:15px;border-radius:12px;background:#f5f2ff;border:1px solid #ebe5ff}#${rootId} .ml-graph-reading h3{font-size:14px;margin:0 0 7px;color:#3d2b78}#${rootId} .ml-graph-reading p{font-size:13px;line-height:1.75;margin:0;color:#5f5e7d}#${rootId} .ml-graph-terms{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}#${rootId} .ml-graph-terms span{padding:8px 10px;background:#fff;border:1px solid #e1dbf8;border-radius:8px;font-size:11px;color:#4b4568}#${rootId} .ml-sheet-controls{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(260px,1.1fr);gap:12px;margin-bottom:14px}#${rootId} .ml-sheet-controls label,#${rootId} .ml-filter-label{display:grid;gap:6px;color:#69728b;font-size:11px;font-weight:750}#${rootId} select,#${rootId} input[type=search],#${rootId} textarea{width:100%;font:inherit;font-size:13px;padding:11px 12px;border-radius:10px;border:1px solid #dce1ec;background:#fff;color:#232944;outline:none}#${rootId} select:focus,#${rootId} input:focus,#${rootId} textarea:focus{border-color:#987cf1;box-shadow:0 0 0 3px #9b84f128}#${rootId} .ml-progress{background:#fff;border:1px solid #e3e7f0;border-radius:12px;padding:12px 14px;margin-bottom:14px}#${rootId} .ml-progress>div:first-child{display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#68718b;margin-bottom:8px}#${rootId} .ml-progress b{color:#303651}#${rootId} .ml-progress-track{height:7px;background:#eff0f6;border-radius:50px;overflow:hidden}#${rootId} .ml-progress-track i{display:block;height:100%;background:linear-gradient(90deg,#9266f3,#4e5fe1);border-radius:50px;transition:width .3s}#${rootId} .ml-worksheet-layout{display:grid;grid-template-columns:minmax(235px,300px) minmax(0,1fr);gap:15px;align-items:start}#${rootId} .ml-question-nav{background:#fff;border:1px solid #e2e6ef;border-radius:14px;overflow:hidden;min-width:0}#${rootId} .ml-qnav-top{padding:14px 15px;border-bottom:1px solid #edf0f5;display:flex;align-items:center;justify-content:space-between;color:#303550;font-size:12px}#${rootId} .ml-qnav-top span{padding:3px 8px;border-radius:20px;background:#f0ebff;color:#603bd4}#${rootId} .ml-filter-label{padding:11px 12px;border-bottom:1px solid #edf0f5}#${rootId} .ml-filter-label select{padding:8px;font-size:11px}#${rootId} #ml-q-list{max-height:55vh;overflow:auto;padding:7px}#${rootId} .ml-q-item{position:relative;display:flex;align-items:center;gap:8px;text-align:start;width:100%;border:1px solid transparent;background:#fff;border-radius:8px;padding:9px 8px;cursor:pointer;color:#3f4862;margin-bottom:3px}#${rootId} .ml-q-item:hover{background:#f7f5ff}#${rootId} .ml-q-item.active{border-color:#d9ceff;background:#f0ebff;color:#4927b8}#${rootId} .ml-q-num{font-size:10px;font-weight:850;color:#7755db;white-space:nowrap}#${rootId} .ml-q-text{font-size:12px;line-height:1.5;flex:1;min-width:0;max-height:42px;overflow:hidden}#${rootId} .ml-q-check{font-size:12px;color:#13804d}#${rootId} .ml-question-panel{min-width:0}#${rootId} .ml-question-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}#${rootId} .ml-question-head h2{font-size:17px;color:#252b48;margin:0}#${rootId} .ml-question-status{font-size:11px;padding:7px 9px;border-radius:9px;background:#fff;border:1px solid #e2e6ef;color:#6d7690;white-space:nowrap}#${rootId} .ml-question-status.is-done{color:#167448;background:#e7f7ed;border-color:#c3ead1}#${rootId} .ml-problem{background:#fff;border:1px solid #e1e5ef;border-radius:14px;padding:18px 19px;margin-bottom:12px;box-shadow:0 4px 15px #222a4b09}#${rootId} .ml-problem-label{font-size:10px;font-weight:850;text-transform:uppercase;letter-spacing:.08em;color:#828ba2;margin-bottom:9px}#${rootId} .ml-formula-large{font-size:clamp(20px,2.5vw,30px);line-height:1.7;min-height:42px;display:flex;align-items:center;flex-wrap:wrap;gap:6px;color:#1d2645;overflow-x:auto}#${rootId} .ml-attempt{background:#fff;border:1px solid #e1e5ef;border-radius:13px;padding:13px 14px;margin-bottom:12px;display:grid;gap:7px}#${rootId} .ml-attempt label{font-size:12px;color:#414a65;font-weight:800}#${rootId} .ml-attempt textarea{resize:vertical;min-height:56px}#${rootId} .ml-attempt small{color:#969bb0;font-size:10px;line-height:1.5}#${rootId} .ml-solution-locked{display:flex;flex-direction:column;align-items:center;text-align:center;background:#fff;border:1px dashed #d8d1ef;border-radius:14px;padding:25px 18px;margin-bottom:12px}#${rootId} .ml-lock-icon{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:#eee8ff;color:#6e45db;font-size:21px;margin-bottom:9px}#${rootId} .ml-solution-locked h3{font-size:16px;margin:0 0 6px;color:#333455}#${rootId} .ml-solution-locked p{font-size:12px;line-height:1.75;color:#7a8198;max-width:440px;margin:0 0 15px}#${rootId} .ml-solution-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:14px 0 10px}#${rootId} .ml-solution-head b{font-size:13px;color:#3b4260}#${rootId} .ml-step-dots{display:flex;gap:4px}#${rootId} .ml-step-dots i{width:18px;height:5px;border-radius:5px;background:#e6e8f1}#${rootId} .ml-step-dots i.on{background:#7551e5}#${rootId} .ml-step-card{background:#fff;border:1px solid #ded8f8;border-radius:14px;overflow:hidden;box-shadow:0 7px 24px #3d286c0a;animation:ml-step-in .28s cubic-bezier(.2,.8,.2,1)}#${rootId} .ml-step-explain{display:flex;align-items:flex-start;gap:11px;padding:15px 16px 11px}#${rootId} .ml-step-count{flex:0 0 auto;display:grid;place-items:center;width:28px;height:28px;border-radius:9px;background:#eee9ff;color:#653dcb;font-size:11px;font-weight:900}#${rootId} .ml-step-explain p{margin:2px 0 0;color:#414967;font-size:13px;line-height:1.75}#${rootId} .ml-math-move{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:15px;background:#f7f5ff;border-top:1px solid #eee9ff;color:#202848;min-height:74px}#${rootId} .ml-math-before,#${rootId} .ml-math-after{font-size:clamp(17px,2vw,23px);line-height:1.7;max-width:45%;overflow-x:auto}#${rootId} .ml-math-before{color:#8990a6}#${rootId} .ml-math-after{padding:3px 9px;border-radius:9px;background:#fff;color:#37266f;border:1px solid #e3dcfc;animation:ml-formula-in .35s ease-out}#${rootId} .ml-animated-arrow{font-size:25px;color:#7953e7;animation:ml-arrow-bob 1s ease-in-out infinite;flex:0 0 auto}#${rootId} .ml-step-card.final .ml-math-after{background:#e7f7ed;color:#126540;border-color:#c4ecd4}#${rootId} .ml-answer-tag{padding:10px 16px;color:#167449;background:#f0fbf4;font-size:11px;font-weight:850;border-top:1px solid #d8f2e2}#${rootId} .ml-step-controls{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0 12px}#${rootId} .ml-final-answer{border:1px solid #cbeed9;background:#f0fbf4;padding:14px 16px;border-radius:12px;margin-bottom:12px;color:#215b3d}#${rootId} .ml-final-answer b{display:block;font-size:11px;margin-bottom:7px}#${rootId} .ml-final-answer>div{font-size:22px;line-height:1.7;overflow-x:auto}#${rootId} .ml-final-answer p{font-size:11px;color:#557465;margin-bottom:0}#${rootId} .ml-q-bottom{display:flex;align-items:center;gap:7px;flex-wrap:wrap;justify-content:space-between;margin-top:15px;padding-top:12px;border-top:1px solid #e3e6ef}#${rootId} .ml-q-bottom button{font-size:11px}#${rootId} .ml-empty,#${rootId} .ml-none{padding:22px;text-align:center;color:#7b839b;font-size:13px;line-height:1.7}#${rootId} .mfrac{display:inline-grid;grid-template-rows:auto auto;vertical-align:middle;text-align:center;line-height:1.25;font-size:.92em;margin:0 .1em;white-space:nowrap}#${rootId} .mfrac>span:first-child{border-bottom:1.2px solid currentColor;padding:0 .2em .07em}#${rootId} .mfrac>span:last-child{padding:.05em .2em 0}#${rootId} sup,#${rootId} sub{line-height:0;font-size:.68em}#${rootId} .msqrt{display:inline-flex;align-items:stretch;position:relative;vertical-align:middle;padding-left:.04em}#${rootId} .root-sign{font-size:1.22em;line-height:1;align-self:center}#${rootId} .radicand{border-top:1px solid currentColor;padding:0 .08em 0 .04em;line-height:1.25}#${rootId} .root-index{font-size:.48em;align-self:flex-start;margin-right:-.12em;line-height:1}#${rootId} .mtext{font-size:.8em}#${rootId} .ml-graph-layout .mfrac{font-size:.8em}@keyframes ml-sign-fade{from{transform:translateY(0);opacity:1}to{transform:translateY(-5px);opacity:.45}}@keyframes ml-sign-appear{from{transform:translateY(5px);opacity:.5}to{transform:translateY(0);opacity:1}}@keyframes ml-step-in{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}@keyframes ml-formula-in{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}@keyframes ml-arrow-bob{0%,100%{transform:translateX(-2px);opacity:.72}50%{transform:translateX(4px);opacity:1}}
  @media(max-width:900px){#${rootId} .ml-window{inset:1vh 1vw;border-radius:16px}#${rootId} .ml-content{padding:16px}#${rootId} .ml-worksheet-layout{grid-template-columns:minmax(0,220px) minmax(0,1fr)}#${rootId} .ml-graph-layout{grid-template-columns:180px minmax(0,1fr)}}
  @media(max-width:640px){#${rootId} .ml-window{inset:0;border-radius:0}#${rootId} .ml-header{padding:13px 14px;gap:10px}#${rootId} .ml-mark{width:38px;height:38px;border-radius:12px}#${rootId} .ml-header p{display:none}#${rootId} .ml-tabs{padding:8px;justify-content:space-around}#${rootId} .ml-tabs button{padding:9px 7px;font-size:11px;flex:1}#${rootId} .ml-content{padding:14px 12px 22px}#${rootId} .ml-demo-split,#${rootId} .ml-sheet-controls,#${rootId} .ml-graph-layout,#${rootId} .ml-worksheet-layout{grid-template-columns:1fr}#${rootId} .ml-graph-picker{grid-template-columns:repeat(2,minmax(0,1fr))}#${rootId} .ml-graph-picker label{grid-column:1/-1}#${rootId} #ml-q-list{max-height:220px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px}#${rootId} .ml-q-item{margin:0}#${rootId} .ml-math-before,#${rootId} .ml-math-after{max-width:100%;font-size:17px}#${rootId} .ml-step-controls .ml-btn{flex:1}#${rootId} .ml-q-bottom{justify-content:center}#${rootId} .ml-q-bottom button{flex:1}#${rootId} .ml-lesson-head{padding:14px}#${rootId} .ml-lesson-sections{padding:0 12px 10px}}
  @media(prefers-reduced-motion:reduce){#${rootId} *{animation:none!important;transition:none!important}}
  `;

  // Deliberately no floating launcher. Guided solutions are opened inline from the exam result/review screen.
  // Only share the formatter/data with the main app. No separate modal launcher is exposed.
  window.MathsTutor = { formatMath: math, data: SHEETS };
})();
