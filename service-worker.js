const FRESHLY_CACHE='freshly-desktop-mobile-v3-7-0-banner-loader';
const APP_SHELL=[
  './',
  './index.html',
  './track-order.html',
  './customer-portal.html',
  './offline.html',
  './assets/styles.css',
  './assets/app.js',
  './assets/config.js',
  './assets/freshly-desktop-mobile-v3-7-0-banner-loader',
  './assets/freshly-desktop-mobile-v3-7-0-banner-loader',
  './assets/freshly-desktop-mobile-v3-7-0-banner-loader',
  './assets/freshly-desktop-mobile-v3-7-0-banner-loader',
  './assets/freshly-install-app.js',
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/freshly-logo-header.png',
  './assets/images/banner-hub-partner-earnings.png',
  './assets/images/banner-hub-partner.png',
  './assets/images/banner-supplier.png'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(FRESHLY_CACHE).then(c=>c.addAll(APP_SHELL).catch(()=>null)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k===FRESHLY_CACHE?null:caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.hostname.includes('script.google.com')||u.hostname.includes('googleusercontent.com')){
    e.respondWith(fetch(r).catch(()=>new Response(JSON.stringify({ok:false,message:'Freshly backend is offline.'}),{headers:{'Content-Type':'application/json'}})));
    return;
  }
  if(r.headers.get('accept')&&r.headers.get('accept').includes('text/html')){
    e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(FRESHLY_CACHE).then(c=>c.put(r,copy));return res;}).catch(()=>caches.match(r).then(c=>c||caches.match('./offline.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{const copy=res.clone();caches.open(FRESHLY_CACHE).then(cache=>cache.put(r,copy));return res;})));
});
