(() => {
  'use strict';

  const installButton = document.getElementById('installApp');
  const stateKey = 'etoedu-pwa-session-state-v1';
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

  if (installButton) {
    const lang = () => document.body.dataset.l || 'ar';
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

    const isIOS = (
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    ) && !isStandalone();
    if (isIOS) installButton.hidden = false;
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

      const message = isIOS
        ? 'لتثبيت التطبيق على iPhone أو iPad: اضغط مشاركة (Share)، ثم Add to Home Screen / إضافة إلى الشاشة الرئيسية.'
        : (lang() === 'en'
          ? 'Open your browser menu and choose Install app or Add to Home screen.'
          : 'افتح قائمة المتصفح ⋮ أو مشاركة، واختار تثبيت التطبيق (Install app) أو إضافة إلى الشاشة الرئيسية.');
      window.alert(message);
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
    });
  }
})();
