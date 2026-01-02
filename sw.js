const CACHE_NAME = 'kokosima-v3';

const ASSETS = [
  '/',
  '/style.css',
  '/data.js',
  '/manifest.json'
];

/* =========================
   INSTALL
========================= */
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const asset of ASSETS) {
        await cache.add(
          new Request(asset, { redirect: 'follow' })
        );
      }
    })()
  );
  self.skipWaiting();
});

/* =========================
   ACTIVATE
========================= */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* =========================
   FETCH
========================= */
self.addEventListener('fetch', event => {
  const request = event.request;

  // Navigasi halaman HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { redirect: 'follow' })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Asset statis
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request, { redirect: 'follow' });
    })
  );
});
