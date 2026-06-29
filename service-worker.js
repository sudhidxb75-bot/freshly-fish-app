const FRESHLY_CACHE = 'freshly-pwa-v1-0-0';
const APP_SHELL = [
  './',
  './index.html',
  './track-order.html',
  './offline.html',
  './assets/styles.css',
  './assets/app.js',
  './assets/config.js',
  './assets/freshly-logo-header.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(FRESHLY_CACHE).then(cache => cache.addAll(APP_SHELL.filter(Boolean))).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => {
      if (key !== FRESHLY_CACHE) return caches.delete(key);
    })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Do not cache Google Apps Script/API calls. Always use network for live backend data.
  if (url.hostname.includes('script.google.com') || url.hostname.includes('googleusercontent.com')) {
    event.respondWith(fetch(request).catch(() => new Response(JSON.stringify({
      ok: false,
      message: 'Freshly backend is offline. Please check your connection.'
    }), { headers: { 'Content-Type': 'application/json' } })));
    return;
  }

  // Network first for HTML pages, fallback to cache/offline.
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(FRESHLY_CACHE).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('./offline.html')))
    );
    return;
  }

  // Cache first for static assets.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const copy = response.clone();
        caches.open(FRESHLY_CACHE).then(cache => cache.put(request, copy));
        return response;
      });
    })
  );
});
