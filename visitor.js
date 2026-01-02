// ==========================================
// VISITOR COUNTER FINAL (ANTI-CACHE & CORS)
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil elemen DOM
    const visitorBar = document.getElementById('visitorBar');
    const visitorTodayEl = document.getElementById('visitorToday');
    const visitorTotalEl = document.getElementById('visitorTotal');

    // Cek apakah elemen ada di HTML
    if (!visitorBar || !visitorTodayEl || !visitorTotalEl) {
        console.error('Visitor DOM tidak ditemukan! Pastikan ID visitorToday & visitorTotal sudah ada.');
        return;
    }

    let lastToday = 0;
    let lastTotal = 0;
    let lastScroll = 0;
    const PAGE_KEY = 'index'; // Ubah sesuai halaman jika perlu

    // 2. Fungsi Ambil Data dari Worker
    function fetchVisitor() {
        // Tambahkan timestamp (t) agar tidak terkena cache (Status 304)
        const workerUrl = `https://visitor-counter.kokopujiyanto.workers.dev/?page=${PAGE_KEY}&t=${Date.now()}`;

        fetch(workerUrl, {
            method: 'GET',
            credentials: 'include', // Penting untuk mengirim/menerima Cookie
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        })
        .then(response => {
            console.log(`[Visitor] Status: ${response.status}`);
            return response.ok ? response.json() : null;
        })
        .then(data => {
            if (!data || data.error) {
                console.error('[Visitor] Data Error:', data ? data.error : 'Response null');
                return;
            }

            console.log('[Visitor] Data Diterima:', data);

            const today = Number(data.today) || 0;
            const total = Number(data.total) || 0;

            // Jalankan animasi angka
            animateValue(visitorTodayEl, lastToday, today);
            animateValue(visitorTotalEl, lastTotal, total);

            // Simpan nilai terakhir untuk referensi animasi berikutnya
            lastToday = today;
            lastTotal = total;
        })
        .catch(err => console.warn('[Visitor] Fetch Gagal:', err));
    }

    // 3. Fungsi Animasi Angka
    function animateValue(el, from, to, duration = 1000) {
        if (from === to) {
            el.textContent = to;
            return;
        }

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = Math.floor(progress * (to - from) + from);
            el.textContent = currentVal.toLocaleString(); // Format angka (contoh: 1,000)
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // 4. Efek Scroll (Hide/Show Visitor Bar)
    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        if (currentY > lastScroll && currentY > 150) {
            // Scroll ke bawah: Sembunyikan
            visitorBar.style.transform = 'translateY(100%)';
            visitorBar.style.opacity = '0';
        } else {
            // Scroll ke atas: Tampilkan
            visitorBar.style.transform = 'translateY(0)';
            visitorBar.style.opacity = '1';
        }
        lastScroll = currentY;
    }, { passive: true });

    // 5. Jalankan Fungsi
    fetchVisitor();

    // Auto-update setiap 60 detik
    setInterval(fetchVisitor, 60000);
});
