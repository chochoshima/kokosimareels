const CACHE_NAME = 'kokosima-v3'; // Naikkan versi lagi agar browser mengupdate SW
const assets = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './manifest.json',
  './images/icon-192.png'
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
  // Hanya tangani request GET
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cachedRes) => {
      if (cachedRes) return cachedRes;

      // Kunci perbaikan error "redirect mode":
      // Kita buat request baru berdasarkan request asli tapi dengan redirect mode 'follow'
      const fetchRequest = e.request.clone();

      return fetch(fetchRequest, {
        redirect: 'follow' // Memaksa fetch mengikuti redirect sebelum sampai ke SW
      }).then((networkRes) => {
        // Cek jika respon valid untuk disimpan ke cache (optional)
        if (!networkRes || networkRes.status !== 200) {
          return networkRes;
        }
        return networkRes;
      }).catch(() => {
        // Fallback jika offline total
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
