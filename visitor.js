// ==========================
// UNIVERSAL VISITOR + ANIMASI ANGKA + AUTO-HIDE
// ==========================
const visitorBar = document.getElementById('visitorBar');

let lastScroll = 0;
let lastToday = 0;
let lastTotal = 0;

// fetch visitor
function fetchVisitor() {
  fetch(`https://visitor-counter.kokopujiyanto.workers.dev/?page=${location.pathname}`)
    .then(r => r.json())
    .then(d => {
      if (!d) return;

      const today = d.today || 0;
      const total = d.total || 0;

      // animasi angka naik
      animateNumberText(visitorBar, lastToday, today, lastTotal, total, 800);

      lastToday = today;
      lastTotal = total;
    })
    .catch(console.warn);
}

// animasi angka naik dengan format "0 hari ini - 0 total"
function animateNumberText(el, startToday, endToday, startTotal, endTotal, duration) {
  if (startToday === endToday && startTotal === endTotal) return;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);

    const currentToday = Math.floor(startToday + (endToday - startToday) * progress);
    const currentTotal = Math.floor(startTotal + (endTotal - startTotal) * progress);

    el.textContent = `${currentToday} hari ini - ${currentTotal} total`;

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// auto hide saat scroll
window.addEventListener('scroll', () => {
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

// jalankan
fetchVisitor();

// opsional: update setiap 30 detik
setInterval(fetchVisitor, 30000);
