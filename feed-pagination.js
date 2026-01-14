// Desktop only
if (window.innerWidth >= 1024) {
    const feed = document.querySelector('.feed');
    const nextBtn = document.querySelector('.nav-btn.next');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const pagination = document.querySelector('.pagination');
    let currentIndex = 0;

    function visibleCount() {
        const item = feed.querySelector('.item');
        return item ? Math.floor(feed.offsetWidth / (item.offsetWidth + 20)) : 1; // 20 = gap
    }

    function totalItems() {
        return feed.children.length;
    }

    function renderPagination() {
        pagination.innerHTML = '';
        const pages = Math.ceil(totalItems() / visibleCount());
        for (let i = 0; i < pages; i++) {
            const span = document.createElement('span');
            span.textContent = i + 1;
            if (i === 0) span.classList.add('active');
            span.addEventListener('click', () => {
                currentIndex = i * visibleCount();
                feed.scrollTo({ left: currentIndex * (feed.querySelector('.item').offsetWidth + 20), behavior: 'smooth' });
                updatePagination(i);
            });
            pagination.appendChild(span);
        }
    }

    function updatePagination(activeIndex) {
        pagination.querySelectorAll('span').forEach((s, i) => {
            s.classList.toggle('active', i === activeIndex);
        });
    }

    nextBtn.addEventListener('click', () => {
        currentIndex += visibleCount();
        if (currentIndex > totalItems() - visibleCount()) currentIndex = totalItems() - visibleCount();
        feed.scrollTo({ left: currentIndex * (feed.querySelector('.item').offsetWidth + 20), behavior: 'smooth' });
        updatePagination(Math.floor(currentIndex / visibleCount()));
    });

    prevBtn.addEventListener('click', () => {
        currentIndex -= visibleCount();
        if (currentIndex < 0) currentIndex = 0;
        feed.scrollTo({ left: currentIndex * (feed.querySelector('.item').offsetWidth + 20), behavior: 'smooth' });
        updatePagination(Math.floor(currentIndex / visibleCount()));
    });

    // Render awal pagination setelah feed di-generate
    function initPagination() {
        currentIndex = 0;
        feed.scrollTo({ left: 0, behavior: 'smooth' });
        renderPagination();
    }

    // Jalankan sekali setelah feed di-generate
    setTimeout(initPagination, 1000); // delay kecil supaya feed sudah ter-render

    // Update pagination saat resize desktop
    window.addEventListener('resize', () => {
        initPagination();
    });
}
