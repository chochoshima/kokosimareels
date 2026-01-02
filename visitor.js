// ==========================
// VISITOR UNIVERSAL (FIXED)
// ==========================
const visitorBar = document.getElementById('visitorBar');
const visitorTodayEl = document.getElementById('visitorToday');
const visitorTotalEl = document.getElementById('visitorTotal');

let lastScroll = 0;
let lastToday = 0;
let lastTotal = 0;

const PAGE_KEY = 'index'; // 🔒 KUNCI KEY

function fetchVisitor() {
  fetch(`https://visitor-counter.kokopujiyanto.workers.dev/?page=${PAGE_KEY}`, {
    credentials: 'include'
  })
    .then(r => r.json())
    .then(d => {
      if (!d) return;

      const today = d.today || 0;
      const total = d.total || 0;

      animateNumber(visitorTodayEl, lastToday, today, 800);
      animateNumber(visitorTotalEl, lastTotal, total, 800);

      lastToday = today;
      lastTotal = total;
    })
    .catch(console.warn);
}

function animateNumber(el, start, end, duration) {
  if (!el || start === end) return;
  let startTime = null;

  function step(ts) {
    if (!startTime) startTime = ts;
    const p = Math.min((ts - startTime) / duration, 1);
    el.textContent = Math.floor(start + (end - start) * p);
    if (p < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// auto hide
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

fetchVisitor();
setInterval(fetchVisitor, 30000);
