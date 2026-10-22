(() => {
  'use strict';

  const installButton = document.getElementById('installApp');
  const stateKey = 'etoedu-pwa-session-state-v1';
  const iosHintKey = 'etoedu-ios-hint-closed-v1';
  let installPrompt = null;
  if (installButton) installButton.hidden = true;
  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  function saveSessionState() {
    try {
      const fontSize = getComputedStyle(document.documentElement)
        .getPropertyValue('--fs').trim();

      localStorage.setItem(stateKey, JSON.stringify({
        language: document.body.dataset.l || 'ar',
        fontSize: fontSize || '18px',
        savedAt: Date.now()
      }));
    } catch (_) {
      // Storage restrictions must not break the site.
    }
  }

  function restoreSessionState() {
    let state;

    try {
      state = JSON.parse(localStorage.getItem(stateKey) || 'null');
    } catch (_) {
      return;
    }

    if (!state) return;

    if (state.language && ['ar', 'en', 'both'].includes(state.language)) {
      const langButton = document.querySelector(
        `#lg [data-l="${state.language}"]`
      );

      if (langButton) {
        langButton.click();
      } else {
        document.body.dataset.l = state.language;
      }
    }

    if (state.fontSize) {
      document.documentElement.style.setProperty('--fs', state.fontSize);
    }
  }

  /* ---------- iPhone / iPad install guide ---------- */
  const lang = () => document.body.dataset.l || 'ar';
  const ua = navigator.userAgent;
  const isIOSDevice =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isInAppBrowser = /instagram|fban|fbav|fb_iab|line\/|twitter|snapchat|tiktok|musical_ly|telegram/i.test(ua);
  const isIOS = isIOSDevice && !isStandalone();

  const SHARE_ICON =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 15V3M8 7l4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';

  const GUIDE = {
    ar: {
      title: 'تثبيت ETO.Edu على الايفون',
      steps: [
        'افتح الموقع في Safari',
        'اضغط زر المشاركة ' + SHARE_ICON + ' اللي في شريط المتصفح',
        'انزل لتحت واختار "إضافة إلى الشاشة الرئيسية"',
        'اضغط "إضافة" فوق على اليمين'
      ],
      inapp: 'انت فاتح الموقع من جوه تطبيق تاني. اضغط على النقط الثلاث واختار "فتح في Safari" الأول.',
      ok: 'تمام'
    },
    en: {
      title: 'Install ETO.Edu on iPhone',
      steps: [
        'Open the site in Safari',
        'Tap the Share button ' + SHARE_ICON + ' in the browser bar',
        'Scroll down and choose "Add to Home Screen"',
        'Tap "Add" at the top'
      ],
      inapp: 'You are inside another app. Open the menu and choose "Open in Safari" first.',
      ok: 'Got it'
    }
  };

  function injectSheetStyle() {
    if (document.getElementById('etoIosStyle')) return;
    const st = document.createElement('style');
    st.id = 'etoIosStyle';
    st.textContent = `
#etoIosSheet{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:9999;max-width:520px;margin:0 auto;background:#12355b;color:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 10px 32px rgba(0,0,0,.35);font:15px/1.7 Cairo,Inter,system-ui,sans-serif;animation:etoIosUp .3s ease both}
#etoIosSheet .ei-t{font-weight:700;font-size:1.05em;margin-bottom:8px}
#etoIosSheet .ei-b{margin-bottom:12px}
#etoIosSheet ol{margin:0;padding-inline-start:22px}
#etoIosSheet li{margin:4px 0}
#etoIosSheet svg{vertical-align:middle;margin:0 2px}
#etoIosSheet .ei-w{background:rgba(245,158,11,.18);border:1px solid rgba(245,158,11,.5);border-radius:10px;padding:8px 10px;margin-bottom:10px}
#etoIosSheet button{width:100%;min-height:44px;border:0;border-radius:12px;background:#fff;color:#12355b;font:inherit;font-weight:700;cursor:pointer}
@keyframes etoIosUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`;
    document.head.appendChild(st);
  }

  function closeIOSGuide(remember) {
    const el = document.getElementById('etoIosSheet');
    if (el) el.remove();
    if (remember) {
      try { localStorage.setItem(iosHintKey, '1'); } catch (_) {}
    }
  }

  function showIOSGuide() {
    if (document.getElementById('etoIosSheet')) return;
    injectSheetStyle();

    const l = lang();
    const parts = l === 'both' ? ['ar', 'en'] : [l === 'en' ? 'en' : 'ar'];
    const sheet = document.createElement('div');
    sheet.id = 'etoIosSheet';
    sheet.setAttribute('role', 'dialog');
    sheet.dir = parts[0] === 'ar' ? 'rtl' : 'ltr';

    let html = '';
    parts.forEach((p) => {
      const g = GUIDE[p];
      html += `<div class="ei-b" dir="${p === 'ar' ? 'rtl' : 'ltr'}">` +
        `<div class="ei-t">${g.title}</div>` +
        (isInAppBrowser ? `<div class="ei-w">${g.inapp}</div>` : '') +
        `<ol>${g.steps.map((s) => `<li>${s}</li>`).join('')}</ol></div>`;
    });
    html += `<button type="button" id="etoIosClose">${GUIDE[parts[0]].ok}</button>`;
    sheet.innerHTML = html;
    document.body.appendChild(sheet);

    document.getElementById('etoIosClose').addEventListener('click', () => closeIOSGuide(true));
  }

  if (installButton) {
    const setInstallLabel = () => {
      installButton.textContent = lang() === 'en' ? 'Install app' :
        (lang() === 'both' ? 'تثبيت التطبيق / Install' : 'تثبيت التطبيق');
    };
    setInstallLabel();

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      installPrompt = event;
      if (!isStandalone()) installButton.hidden = false;
    });

    window.addEventListener('appinstalled', () => {
      installPrompt = null;
      installButton.hidden = true;
    });

    if (isIOS) {
      installButton.hidden = false;

      let closedBefore = false;
      try { closedBefore = localStorage.getItem(iosHintKey) === '1'; } catch (_) {}
      if (!closedBefore) {
        window.setTimeout(() => { if (!isStandalone()) showIOSGuide(); }, 3000);
      }
    }
    if (isStandalone()) installButton.hidden = true;

    installButton.addEventListener('click', async () => {
      if (installPrompt) {
        try {
          await installPrompt.prompt();

          const result = await installPrompt.userChoice;

          if (result && result.outcome === 'accepted') {
            installButton.hidden = true;
          }
        } catch (_) {
        } finally {
          installPrompt = null;
        }

        return;
      }

      if (isIOS) {
        showIOSGuide();
        return;
      }

      window.alert(lang() === 'en'
        ? 'Open your browser menu and choose Install app or Add to Home screen.'
        : 'افتح قائمة المتصفح أو مشاركة، واختار تثبيت التطبيق (Install app) أو إضافة إلى الشاشة الرئيسية.');
    });

    document.getElementById('lg')?.addEventListener('click', () => {
      window.setTimeout(setInstallLabel, 0);
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveSessionState();
  });

  window.addEventListener('pagehide', saveSessionState);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) return; // bfcache already kept the original live page.
    restoreSessionState();
  });

  if ('serviceWorker' in navigator &&
      (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js', { scope: './' })
        .catch((error) => console.warn('ETO.Edu offline support could not start:', error));

      // Ask the browser not to evict saved progress (helps on iPhone).
      if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().catch(() => {});
      }
    });
  }
})();
