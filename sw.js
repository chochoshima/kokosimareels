const CACHE_NAME = 'kokosima-v4';
const assets = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cachedRes) => {
      if (cachedRes) return cachedRes;

      // Membuat request baru dengan redirect: 'follow' untuk menghindari ERR_FAILED
      const fetchRequest = new Request(e.request.url, {
        method: e.request.method,
        headers: e.request.headers,
        mode: e.request.mode,
        credentials: e.request.credentials,
        redirect: 'follow'
      });

      return fetch(fetchRequest).then((networkRes) => {
        return networkRes;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
