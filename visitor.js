// ==========================
// VISITOR UNIVERSAL (FINAL)
// ==========================

const visitorBar = document.getElementById('visitorBar');
const visitorTodayEl = document.getElementById('visitorToday');
const visitorTotalEl = document.getElementById('visitorTotal');

if (!visitorBar || !visitorTodayEl || !visitorTotalEl) {
  console.warn('Visitor element tidak ditemukan');
} else {

  let lastScroll = 0;
  let lastToday = 0;
  let lastTotal = 0;

  // 🔒 KEY HARUS SAMA DENGAN YANG DI WORKER
  const PAGE_KEY = 'index';

  function fetchVisitor() {
    fetch(`https://visitor-counter.kokopujiyanto.workers.dev/?page=${PAGE_KEY}`, {
      credentials: 'include',
      cache: 'no-store'
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;

        const today = Number(d.today) || 0;
        const total = Number(d.total) || 0;

        animateNumber(visitorTodayEl, lastToday, today, 700);
        animateNumber(visitorTotalEl, lastTotal, total, 700);

        lastToday = today;
        lastTotal = total;
      })
      .catch(err => console.warn('Visitor error:', err));
  }

  function animateNumber(el, start, end, duration) {
    if (start === end) return;

    let startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      el.textContent = Math.floor(start + (end - start) * p);
      if (p < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // AUTO HIDE SAAT SCROLL
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastScroll && y > 100) {
      visitorBar.style.transform = 'translateY(80px)';
      visitorBar.style.opacity = '0';
    } else {
      visitorBar.style.transform = 'translateY(0)';
      visitorBar.style.opacity = '1';
    }
    lastScroll = y;
  });

  // INIT
  fetchVisitor();
  setInterval(fetchVisitor, 30000);
}
