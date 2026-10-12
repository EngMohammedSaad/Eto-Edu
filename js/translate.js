/* js/translate.js - الترجمة بالضغطة المطوّلة على الكلمات الإنجليزي (من glossary المحاضرة) */
const Tr = {
  map: {}, rx: null, timer: 0, lp: false,

  /* glossary = [ ["term","المعنى"], ... ] */
  set(glossary) {
    this.map = {};
    glossary.forEach(([k, v]) => this.map[k.toLowerCase()] = v);
    const keys = Object.keys(this.map).sort((a, b) => b.length - a.length)
      .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    this.rx = new RegExp("\\b(" + keys.join("|") + ")(?:es|s)?\\b", "gi");
  },

  /* يلف الكلمات المعروفة جوه root بـ <span class="t"> */
  wrap(root) {
    const rx = this.rx; if (!rx) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (!n.nodeValue.trim() || n.parentElement.closest(".t,.ar,script,style,button.done,.toc,.back,.crumb"))
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n => {
      const s = n.nodeValue; rx.lastIndex = 0; if (!rx.test(s)) return; rx.lastIndex = 0;
      const f = document.createDocumentFragment(); let i = 0, m;
      while ((m = rx.exec(s))) {
        f.append(s.slice(i, m.index));
        const e = document.createElement("span");
        e.className = "t"; e.textContent = m[0]; e.dataset.ar = this.map[m[1].toLowerCase()];
        f.append(e); i = m.index + m[0].length;
      }
      f.append(s.slice(i)); n.replaceWith(f);
    });
  },

  hide() { $("#tipx").style.display = "none"; },
  show(t) {
    const tip = $("#tipx"), r = t.getBoundingClientRect();
    tip.innerHTML = "<b></b><span></span>";
    tip.firstChild.textContent = t.textContent; tip.lastChild.textContent = t.dataset.ar;
    tip.style.display = "block";
    const w = tip.offsetWidth;
    const x = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8);
    let y = r.top - tip.offsetHeight - 10; if (y < 8) y = r.bottom + 10;
    tip.style.left = x + "px"; tip.style.top = y + "px";
    clearTimeout(tip._t); tip._t = setTimeout(() => this.hide(), 4500);
  },

  init() {
    document.addEventListener("pointerdown", e => {
      this.hide();
      const t = e.target.closest && e.target.closest(".t"); if (!t) return;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => { this.show(t); this.lp = true; }, 450);
    });
    ["pointerup", "pointercancel", "scroll"].forEach(ev => document.addEventListener(ev, () => {
      clearTimeout(this.timer); setTimeout(() => this.lp = false, 350);
    }, true));
    document.addEventListener("contextmenu", e => { if (e.target.closest && e.target.closest(".t")) e.preventDefault(); });
    /* لو الضغطة كانت مطوّلة، منعمل كليك (عشان ما يتختارش اختيار بالغلط) */
    document.addEventListener("click", e => { if (this.lp) { e.stopPropagation(); e.preventDefault(); this.lp = false; } }, true);
  }
};
