// ==========================
// UNIVERSAL VISITOR + ANIMASI ANGKA + AUTO-HIDE
// ==========================
const visitorBar = document.getElementById('visitorBar');
const visitorTodayEl = document.getElementById('visitorToday');
const visitorTotalEl = document.getElementById('visitorTotal');

let lastScroll = 0;
let lastToday = 0;
let lastTotal = 0;

// ==========================
// FETCH VISITOR
// ==========================
function fetchVisitor() {
  if (!visitorBar) return; // safety jika tidak ada visitorBar

  // page key, pakai pathname tanpa slash awal
  const pageKey = location.pathname.replace(/^\/+/, '') || 'index';

  fetch(`https://visitor-counter.kokopujiyanto.workers.dev/?page=${pageKey}`)
    .then(r => r.json())
    .then(d => {
      if (!d) return;

      const today = d.today || 0;
      const total = d.total || 0;

      // animasi angka naik
      animateNumber(visitorTodayEl, lastToday, today, 800);
      animateNumber(visitorTotalEl, lastTotal, total, 800);

      lastToday = today;
      lastTotal = total;
    })
    .catch(console.warn);
}

// ==========================
// ANIMASI ANGKA NAIK
// ==========================
function animateNumber(el, start, end, duration) {
  if (!el || start === end) return;

  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    el.textContent = Math.floor(start + (end - start) * progress);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ==========================
// AUTO-HIDE SAAT SCROLL
// ==========================
window.addEventListener('scroll', () => {
  if (!visitorBar) return;

  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 100) {
    // scroll ke bawah → sembunyi
    visitorBar.style.transform = 'translateY(80px)';
    visitorBar.style.opacity = '0';
  } else {
    // scroll ke atas → muncul
    visitorBar.style.transform = 'translateY(0)';
    visitorBar.style.opacity = '1';
  }
  lastScroll = currentScroll;
});

// ==========================
// JALANKAN FETCH + UPDATE SETIAP 30 DETIK
// ==========================
fetchVisitor();
setInterval(fetchVisitor, 30000);
