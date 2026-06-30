const FRESHLY_CACHE = 'freshly-v3-7-6-full-mobile-fix';
const OFFLINE_URL = './offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(FRESHLY_CACHE).then(cache => cache.addAll([OFFLINE_URL]).catch(() => null))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => /freshly/i.test(key) && key !== FRESHLY_CACHE).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

function isFreshlyBackend(url){
  return url.hostname.includes('script.google.com') ||
         url.hostname.includes('googleusercontent.com') ||
         url.hostname.includes('googleapis.com');
}

function isStaticAsset(request, url){
  const accept = request.headers.get('accept') || '';
  return /\.(css|js|json|webmanifest|png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf)$/i.test(url.pathname) ||
         accept.includes('text/css') ||
         accept.includes('javascript') ||
         accept.includes('image/');
}

async function networkFirst(request){
  const cache = await caches.open(FRESHLY_CACHE);
  try{
    const response = await fetch(request, {cache: 'no-store'});
    if(response && response.ok) cache.put(request, response.clone()).catch(() => null);
    return response;
  }catch(err){
    const cached = await cache.match(request);
    if(cached) return cached;
    throw err;
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if(request.method !== 'GET') return;

  const url = new URL(request.url);

  if(isFreshlyBackend(url)){
    event.respondWith(fetch(request, {cache:'no-store'}).catch(() =>
      new Response(JSON.stringify({ok:false,message:'Freshly backend is offline.'}), {
        headers:{'Content-Type':'application/json'}
      })
    ));
    return;
  }

  if(request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')){
    event.respondWith(
      networkFirst(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  if(url.origin === self.location.origin && isStaticAsset(request, url)){
    event.respondWith(networkFirst(request).catch(() => caches.match(request)));
    return;
  }

  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
