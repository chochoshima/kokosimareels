const CACHE_NAME = 'kokosima-v5';
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

      // SOLUSI: Jangan buat 'new Request' jika mode-nya adalah 'navigate'
      if (e.request.mode === 'navigate') {
        return fetch(e.request, { redirect: 'follow' });
      }

      // Untuk aset lain (images, css, js), gunakan fetch normal dengan proteksi redirect
      return fetch(e.request, { redirect: 'follow' }).then((networkRes) => {
        return networkRes;
      }).catch(() => {
        // Fallback jika gambar/aset hilang dan offline
        return new Response('Offline', { status: 404 });
      });
    })
  );
});
