const CACHE_NAME = 'kokosima-clean-v1';

const STATIC_ASSETS = [
  '/style.css',
  '/data.js',
  '/manifest.json'
];

/* INSTALL */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        STATIC_ASSETS.map(url =>
          cache.add(new Request(url, { redirect: 'follow' }))
        )
      );
    })
  );
  self.skipWaiting();
});

/* ACTIVATE */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* FETCH */
self.addEventListener('fetch', event => {
  const req = event.request;

  // ⚠️ JANGAN PERNAH CACHE / INTERCEPT NAVIGASI HTML
  if (req.destination === 'document') {
    event.respondWith(fetch(req));
    return;
  }

  // Asset statis saja
  event.respondWith(
    caches.match(req).then(res => {
      return res || fetch(req, { redirect: 'follow' });
    })
  );
});
