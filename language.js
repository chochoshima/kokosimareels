// 1. Konfigurasi Terjemahan
const translations = {
    'id': {
        'back': '← KEMBALI',
        'search': 'Cari prompt...',
        'copy': 'Salin Prompt',
        'day': 'hari ini',
        'total': 'total'
    },
    'en': {
        'back': '← BACK',
        'search': 'Search prompts...',
        'copy': 'Copy Prompt',
        'day': 'today',
        'total': 'total'
    }
};

// 2. Fungsi Utama Ganti Bahasa
function setLanguage(lang) {
    // Update status tombol UI (Active/Inactive)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase() === lang) btn.classList.add('active');
    });

    // Simpan pilihan ke LocalStorage
    localStorage.setItem('preferredLang', lang);

    const t = translations[lang];

    // Terjemahkan Tombol Back
    const backBtn = document.querySelector('.btn-back');
    if(backBtn) backBtn.innerText = t.back;

    // Terjemahkan Placeholder Search
    const searchInput = document.getElementById('searchInput');
    if(searchInput) searchInput.placeholder = t.search;

    // Terjemahkan Tombol Copy (di halaman prompt)
    const copyBtn = document.querySelector('.btn-primary');
    // Cek apakah ini tombol copy (bukan tombol lain)
    if(copyBtn && (copyBtn.innerText.includes('Prompt') || copyBtn.innerText.includes('Salin'))) {
        copyBtn.innerText = t.copy;
    }

    // Terjemahkan Label Visitor (Tanpa merusak angka)
    const visitorTodayLabel = document.getElementById('visitorBar');
    if (visitorTodayLabel) {
        // Mengganti teks statis tanpa mengganggu elemen <span> atau <strong> yang berisi angka
        const labels = visitorTodayLabel.childNodes;
        labels.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.includes('hari ini') || node.textContent.includes('today')) {
                    node.textContent = ` ${t.day} • `;
                }
                if (node.textContent.includes('total')) {
                    node.textContent = ` ${t.total}`;
                }
            }
        });
    }
}

// 3. LOGIKA AUTO LOAD: Berjalan setiap kali halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'id';
    setLanguage(savedLang);
});