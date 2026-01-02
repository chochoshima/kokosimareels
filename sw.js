const CACHE_NAME = 'kokosima-v3';

const ASSETS = [
  '/',              // root saja, JANGAN index.html
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
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* =========================
   FETCH
========================= */
self.addEventListener('fetch', event => {
  const req = event.request;

  // Navigasi halaman (HTML, termasuk prompt.html?id=...)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { redirect: 'follow' })
        .catch(() => caches.
