const FRESHLY_CACHE='freshly-v3-8-7-fth-inspired';
const APP_SHELL=[
  './',
  './index.html',
  './track-order.html',
  './customer-portal.html',
  './offline.html',
  './assets/config.js',
  './assets/styles.css',
  './assets/app.js',
  './assets/freshly-v3-8-7-fth-inspired',
  './assets/freshly-v3-8-7-fth-inspired',
  './assets/freshly-install-app.js',
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/freshly-logo-header.png',
  './assets/images/banner-hub-partner-earnings.png',
  './assets/images/banner-hub-partner.png',
  './assets/images/banner-supplier.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(FRESHLY_CACHE).then(cache => cache.addAll(APP_SHELL).catch(() => null)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k === FRESHLY_CACHE ? null : caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;

  const url = new URL(req.url);
  if(url.hostname.includes('script.google.com') || url.hostname.includes('googleusercontent.com')){
    event.respondWith(fetch(req).catch(() => new Response(JSON.stringify({ok:false,message:'Freshly backend is offline.'}), {headers:{'Content-Type':'application/json'}})));
    return;
  }

  if(req.headers.get('accept') && req.headers.get('accept').includes('text/html')){
    event.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(FRESHLY_CACHE).then(cache => cache.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then(cached => cached || caches.match('./offline.html'))));
    return;
  }

  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    const copy = res.clone();
    caches.open(FRESHLY_CACHE).then(cache => cache.put(req, copy));
    return res;
  })));
});
