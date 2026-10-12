const CACHE_NAME = 'etoedu-shell-v4';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './data/subjects.js',
  './js/utils.js',
  './js/translate.js',
  './js/exam.js',
  './js/periodic.js',
  './js/app.js',
  './js/pwa.js',
  './data/cons.doaa.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache each existing local file independently; one optional/missing file
    // must not prevent the whole PWA from being installed.
    await Promise.all(APP_SHELL.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) await cache.put(url, response);
      } catch (_) {
        // The file can be cached during a later successful visit.
      }
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

  // Serve local static resources quickly from cache, refreshing them in the
  // background for the next visit. This worker never reloads an open page.
  if (url.pathname.match(/\.(?:css|js|png|jpg|jpeg|webp|svg|json|woff2?)$/i)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      const update = fetch(request).then(async (response) => {
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
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
