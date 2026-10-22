const CACHE_NAME = 'etoedu-shell-v17';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/polish.css',
  './css/dark.css',
  './data/subjects.js',
  './js/utils.js',
  './js/translate.js',
  './js/exam.js',
  './js/periodic.js',
  './js/oxidation.js',
  './js/nminus.js',
  './js/ssp.js',
  './js/features_1.js',
  './js/features_2.js',
  './js/mytools.js',
  './js/app.js',
  './js/accounts.js',
  './js/pdfreader.js',
  './js/pwa.js',
  './data/cons.doaa.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com']; // fonts + PDF.js
const PDFJS_URLS = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) await cache.put(url, response);
      } catch (_) {
        // The file can be cached during a later successful visit.
      }
    }));
    await Promise.all(PDFJS_URLS.map(async (url) => {
      try { if (!(await cache.match(url))) await cache.add(url); } catch (_) { /* cached on first use */ }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      if (key.startsWith('etoedu-') && key !== CACHE_NAME) return caches.delete(key);
      return Promise.resolve(false);
    }));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Google Fonts: cache-first so Arabic/English fonts work offline (iPhone too).
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response && (response.ok || response.type === 'opaque')) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch (_) {
        return Response.error();
      }
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('./index.html', response.clone());
        }
        return response;
      } catch (_) {
        return (await caches.match(request)) ||
          (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }
  if (url.pathname.match(/\.(?:css|js|png|jpg|jpeg|webp|svg|json|pdf|woff2?)$/i)) {
    event.respondWith((async () => {
      const cached = (await caches.match(request)) || (await caches.match(request, { ignoreSearch: true }));
      const update = fetch(request).then(async (response) => {
        if (response && response.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      });
      if (cached) {
        event.waitUntil(update.catch(() => undefined));
        return cached;
      }
      try {
        return await update;
      } catch (_) {
        return Response.error();
      }
    })());
  }
});
