self.addEventListener('fetch', event => {
  const req = event.request;

  // Navigasi halaman (HTML)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { redirect: 'follow' })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Asset statis
  event.respondWith(
    caches.match(req).then(res => {
      return res || fetch(req, { redirect: 'follow' });
    })
  );
});
