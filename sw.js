const CACHE_NAME = 'kokosima-v2'; // Naikkan versi ke v2
const assets = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './manifest.json',
  './images/icon-192.png' // Pastikan path benar
];

// Install & Caching
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Aktivasi & Hapus Cache Lama
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch dengan penanganan Redirect
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;

      // Perbaikan utama: menangani request yang berpotensi redirect
      return fetch(e.request).then((networkRes) => {
        // Jangan simpan ke cache jika respon redirect (opsional, demi keamanan)
        if (!networkRes || networkRes.status !== 200 || networkRes.type === 'opaque') {
          return networkRes;
        }
        return networkRes;
      }).catch(() => {
        // Jika benar-benar offline dan tidak ada di cache
        return caches.match('./index.html');
      });
    })
  );
});
