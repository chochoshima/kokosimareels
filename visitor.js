// ==========================
// VISITOR UNIVERSAL (ANTI NULL)
// ==========================

window.addEventListener('DOMContentLoaded', () => {

  const visitorBar = document.getElementById('visitorBar');
  const visitorTodayEl = document.getElementById('visitorToday');
  const visitorTotalEl = document.getElementById('visitorTotal');

  if (!visitorBar || !visitorTodayEl || !visitorTotalEl) {
    console.warn('Visitor DOM belum siap / tidak ditemukan');
    return;
  }

  let lastScroll = 0;
  let lastToday = 0;
  let lastTotal = 0;

  const PAGE_KEY = 'index';

  function fetchVisitor() {
    fetch(`https://visitor-counter.kokopujiyanto.workers.dev/?page=${PAGE_KEY}&t=${Date.now()}`, {
  credentials: 'include',
  cache: 'no-store'
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;

        const today = Number(d.today) || 0;
        const total = Number(d.total) || 0;

        animate(visitorTodayEl, lastToday, today);
        animate(visitorTotalEl, lastTotal, total);

        lastToday = today;
        lastTotal = total;
      })
      .catch(console.warn);
  }

  function animate(el, from, to, dur = 700) {
    if (from === to) {
      el.textContent = to;
      return;
    }

    let start;
    function step(t) {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.floor(from + (to - from) * p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    visitorBar.style.opacity = (y > lastScroll && y > 100) ? '0' : '1';
    visitorBar.style.transform = (y > lastScroll && y > 100)
      ? 'translateY(80px)'
      : 'translateY(0)';
    lastScroll = y;
  });

  fetchVisitor();
  setInterval(fetchVisitor, 30000);

});

