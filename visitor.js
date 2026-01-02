// ==========================================
// VISITOR COUNTER FINAL (AUTO PER-PAGE)
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    const visitorBar = document.getElementById('visitorBar');
    const visitorTodayEl = document.getElementById('visitorToday');
    const visitorTotalEl = document.getElementById('visitorTotal');

    if (!visitorBar || !visitorTodayEl || !visitorTotalEl) {
        console.error('[Visitor] Elemen DOM tidak ditemukan.');
        return;
    }

    let lastToday = 0;
    let lastTotal = 0;
    let lastScroll = 0;

    /* 1. DINAMIS PAGE KEY
       Mengambil nama halaman dari URL secara otomatis.
       - /              => 'index'
       - /about.html    => 'about'
       - /gallery       => 'gallery'
    */
    const path = window.location.pathname;
    const PAGE_KEY = path === '/' || path.includes('index') 
        ? 'index' 
        : path.split('/').pop().replace('.html', '') || 'index';

    // 2. Fungsi Ambil Data
    function fetchVisitor() {
        // Hapus custom headers agar tidak bentrok dengan CORS Worker yang baru
        const workerUrl = `https://visitor-counter.kokopujiyanto.workers.dev/?page=${PAGE_KEY}&t=${Date.now()}`;

        fetch(workerUrl, {
            method: 'GET',
            credentials: 'include' // Wajib untuk Cookie Anti-Double Hit
        })
        .then(response => response.ok ? response.json() : null)
        .then(data => {
            if (!data || data.error) return;

            const today = Number(data.today) || 0;
            const total = Number(data.total) || 0;

            animateValue(visitorTodayEl, lastToday, today);
            animateValue(visitorTotalEl, lastTotal, total);

            lastToday = today;
            lastTotal = total;
        })
        .catch(err => console.warn('[Visitor] Error:', err));
    }

    // 3. Fungsi Animasi
    function animateValue(el, from, to, duration = 1000) {
        if (from === to) {
            el.textContent = to.toLocaleString();
            return;
        }
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = Math.floor(progress * (to - from) + from);
            el.textContent = currentVal.toLocaleString();
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    // 4. Efek Scroll
    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        if (currentY > lastScroll && currentY > 150) {
            visitorBar.style.transform = 'translateY(100%)';
            visitorBar.style.opacity = '0';
        } else {
            visitorBar.style.transform = 'translateY(0)';
            visitorBar.style.opacity = '1';
        }
        lastScroll = currentY;
    }, { passive: true });

    fetchVisitor();
    setInterval(fetchVisitor, 60000);
});
