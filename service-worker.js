const CACHE='meu-album-copa-v1-7-5-colinha-compacta-detalhada';
const APP_SHELL=[
  './',
  './index.html',
  './styles.css',
  './data.js',
  './app.js',
  './manifest.webmanifest',
  './brand-logo.png',
  './brand-logo-header.png',
  './brand-logo-full.png',
  './icon.svg'
];

self.addEventListener('install', event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(APP_SHELL).catch(()=>{}))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

function isNavigation(request){
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', event=>{
  const req = event.request;
  if(req.method !== 'GET') return;

  const url = new URL(req.url);

  // Firebase/CDN/external: network first, no hard failure
  if(url.origin !== self.location.origin){
    event.respondWith(fetch(req).catch(()=>caches.match(req)));
    return;
  }

  if(isNavigation(req)){
    event.respondWith(
      fetch(req)
        .then(res=>{
          const copy=res.clone();
          caches.open(CACHE).then(cache=>cache.put('./index.html', copy)).catch(()=>{});
          return res;
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached=>{
      const fetchPromise = fetch(req).then(res=>{
        if(res && res.status === 200){
          const copy = res.clone();
          caches.open(CACHE).then(cache=>cache.put(req, copy)).catch(()=>{});
        }
        return res;
      }).catch(()=>cached);
      return cached || fetchPromise;
    })
  );
});
