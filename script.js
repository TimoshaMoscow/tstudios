document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       1. БУРГЕР-МЕНЮ
    ============================================================ */
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.main-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => nav.classList.toggle('open'));
        nav.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', () => nav.classList.remove('open'))
        );
    }

    /* ============================================================
       2. ЭФФЕКТ СКРОЛЛА ХЕДЕРА
    ============================================================ */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    /* ============================================================
       3. АНИМИРОВАННЫЕ СЧЁТЧИКИ
       (теперь работает только для элементов с data-count,
       у «10+ работ» его нет — там статичный текст)
    ============================================================ */
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (statNumbers.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    let current = 0;
                    const step = Math.max(1, Math.floor(target / 30));
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = current;
                    }, 40);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => observer.observe(el));
    }

    /* ============================================================
       4. ПАРАЛЛАКС ФОНА + ЗВЁЗДЫ
    ============================================================ */
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    let ticking = false;

    function updateParallax() {
        const scrolled = window.scrollY;
        parallaxLayers.forEach(layer => {
            const depth = parseFloat(layer.dataset.depth) || 0.5;
            layer.style.transform = `translate3d(0, ${scrolled * depth * -0.3}px, 0)`;
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    // Генерация звёзд
    const bgStars = document.getElementById('bgStars');
    if (bgStars) {
        const starCount = 60;
        let html = '';
        for (let i = 0; i < starCount; i++) {
            const size = Math.random() * 2 + 1;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const delay = Math.random() * 3;
            const dur = 2 + Math.random() * 3;
            html += `<div class="bg-star" style="width:${size}px;height:${size}px;top:${top}%;left:${left}%;animation-delay:${delay}s;animation-duration:${dur}s;"></div>`;
        }
        bgStars.innerHTML = html;
    }

    /* ============================================================
       5. SPOTLIGHT-КУРСОР
    ============================================================ */
    const spotlight = document.getElementById('cursorSpotlight');
    if (spotlight && window.matchMedia('(hover: hover)').matches) {
        let sx = window.innerWidth / 2;
        let sy = window.innerHeight / 2;
        let tx = sx, ty = sy;

        document.addEventListener('mousemove', (e) => {
            tx = e.clientX;
            ty = e.clientY;
        });

        function animateSpotlight() {
            sx += (tx - sx) * 0.15;
            sy += (ty - sy) * 0.15;
            spotlight.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateSpotlight);
        }
        animateSpotlight();
    }

    /* ============================================================
       6. ПРОГРЕСС-БАР ЧТЕНИЯ
    ============================================================ */
    const readingProgress = document.getElementById('readingProgress');
    function updateReadingProgress() {
        if (!readingProgress) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        readingProgress.style.width = `${Math.min(percent, 100)}%`;
    }
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress);
    updateReadingProgress();

    /* ============================================================
       7. ПЛАВНЫЙ СКРОЛЛ
    ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ============================================================
       8. TOAST-УВЕДОМЛЕНИЯ
    ============================================================ */
    const toastContainer = document.getElementById('toastContainer');
    function showToast(message, type = 'info') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-check-circle'
            : type === 'error' ? 'fa-exclamation-circle'
            : 'fa-info-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    /* ============================================================
       9. ПЕРЕКЛЮЧАТЕЛЬ ПОЛА (тарифы)
    ============================================================ */
    const maleBtn = document.getElementById('maleBtn');
    const femaleBtn = document.getElementById('femaleBtn');
    const skinPrice = document.getElementById('skinPrice');
    const skinNote = document.getElementById('skinNote');
    const skinCard = document.getElementById('skinCard');

    if (maleBtn && femaleBtn && skinPrice && skinCard) {
        function updateSkinPrice(gender) {
            if (gender === 'male') {
                skinPrice.textContent = '99';
                skinNote.textContent = 'Индивидуальный дизайн';
                maleBtn.classList.add('active');
                maleBtn.setAttribute('aria-pressed', 'true');
                femaleBtn.classList.remove('active');
                femaleBtn.setAttribute('aria-pressed', 'false');
                skinCard.classList.remove('female-theme');
            } else {
                skinPrice.textContent = '149';
                skinNote.textContent = 'С учётом женских особенностей';
                femaleBtn.classList.add('active');
                femaleBtn.setAttribute('aria-pressed', 'true');
                maleBtn.classList.remove('active');
                maleBtn.setAttribute('aria-pressed', 'false');
                skinCard.classList.add('female-theme');
            }
        }
        maleBtn.addEventListener('click', () => updateSkinPrice('male'));
        femaleBtn.addEventListener('click', () => updateSkinPrice('female'));
    }

    /* ============================================================
       10. МАССИВ АВТОРОВ
    ============================================================ */
    const authors = [
        {
            name: 'Тимошка из Москвы',
            avatar: 'tim.png',
            youtube: 'https://www.youtube.com/@Timosha_MoscowOF',
            discord: 'https://discord.com/users/1146355058880040970',
            telegram: 'https://t.me/MinecraftWithTimosha'
        }
    ];

    function getAuthorByName(name) {
        return authors.find(a => a.name === name) || authors[0];
    }

    /* ============================================================
       11. ДАННЫЕ ПОРТФОЛИО
    ============================================================ */
    const skinsData = [
        { name: 'Тимоша Музыка', price: '0 ₽', image: 'skins/tmusic.png', author: 'Тимошка из Москвы', isRender: true },
        { name: 'beatlewind', price: '0 ₽', image: 'skins/beatlewind.png', author: 'Тимошка из Москвы', isRender: true },
        { name: 'FIREFOX', price: '0 ₽', image: 'skins/firefox.png', author: 'Тимошка из Москвы', isRender: true },
        { name: 'Рыцарь', price: '0 ₽', image: 'skins/knight.png', author: 'Тимошка из Москвы', isRender: true },
        { name: 'Toxinator', price: '50 ₽', image: 'skins/toxinator.png', author: 'Тимошка из Москвы', isRender: true },
        { name: 'арсик', price: '0 ₽', image: 'skins/zakazMAJORrender.png', author: 'Тимошка из Москвы', isRender: true }
    ];

    const rendersData = [
        { name: 'NPOT', price: '50 ₽', image: 'renders/npot.png', author: 'Тимошка из Москвы' },
        { name: 'Sword', price: '50 ₽', image: 'renders/sword.png', author: 'Тимошка из Москвы' },
        { name: 'OP', price: '50 ₽', image: 'renders/OP.png', author: 'Тимошка из Москвы' },
        { name: 'Наблюдение', price: '50 ₽', image: 'renders/peeks.png', author: 'Тимошка из Москвы' },
        { name: 'Думает', price: '50 ₽', image: 'renders/question.png', author: 'Тимошка из Москвы' }
    ];

    const previewsData = [
        { name: 'Мусор дроп', price: '0 ₽', image: 'previews/upgrader.png', author: 'Тимошка из Москвы' },
        { name: 'Marlow не читер', price: '0 ₽', image: 'previews/marlow.png', author: 'Тимошка из Москвы' },
        { name: 'Лесорубы', price: '0 ₽', image: 'previews/lecoruby.png', author: 'Тимошка из Москвы' },
        { name: 'Шахтеры', price: '0 ₽', image: 'previews/miners.png', author: 'Тимошка из Москвы' },
        { name: 'Майнкрафт без прыжка', price: '0 ₽', image: 'previews/nojump.png', author: 'Тимошка из Москвы' }
    ];

    let currentAuthor = authors[0].name;
    let currentType = 'skins';
    const itemsPerPage = 4;
    let currentPage = 0;
    let currentGalleryItems = [];

    const galleryGrid = document.getElementById('galleryGrid');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginationDots = document.getElementById('paginationDots');
    const authorTabs = document.getElementById('authorTabs');
    const typeTabs = document.querySelectorAll('.type-tab');

    /* ============================================================
       12. АВТОРСКИЕ ТАБЫ
    ============================================================ */
    function initAuthorTabs() {
        if (!authorTabs) return;
        authorTabs.innerHTML = '';

        if (authors.length <= 1) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'author-tab active';
            btn.disabled = true;
            btn.style.cursor = 'default';
            btn.innerHTML = `<i class="fas fa-user"></i> ${authors[0].name}`;
            authorTabs.appendChild(btn);
            return;
        }

        authors.forEach((author, index) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'author-tab' + (index === 0 ? ' active' : '');
            btn.dataset.author = author.name;
            btn.innerHTML = `<i class="fas fa-user"></i> ${author.name}`;
            btn.addEventListener('click', function () {
                currentAuthor = this.dataset.author;
                currentPage = 0;
                authorTabs.querySelectorAll('.author-tab').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                renderGallery();
            });
            authorTabs.appendChild(btn);
        });
    }

    /* ============================================================
       13. ФИЛЬТР ТИПА
    ============================================================ */
    typeTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            currentType = this.dataset.type;
            currentPage = 0;
            typeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderGallery();
        });
    });

    function getRendersForTab() {
        const skinsAsRenders = skinsData
            .filter(item => item.isRender === true)
            .map(item => ({ ...item, fromSkin: true }));
        return [...rendersData, ...skinsAsRenders];
    }

    function getSourceByType() {
        if (currentType === 'skins') return skinsData;
        if (currentType === 'renders') return getRendersForTab();
        return previewsData;
    }

    function getFilteredData() {
        return getSourceByType().filter(item => item.author === currentAuthor);
    }

    function getItemClass() {
        if (currentType === 'previews') return ' preview-item';
        if (currentType === 'renders') return ' render-item';
        return '';
    }

    function getTypeLabel() {
        if (currentType === 'skins') return 'Скин';
        if (currentType === 'renders') return 'Рендер';
        return 'Превью';
    }

    /* ============================================================
       14. РЕНДЕР ГАЛЕРЕИ
    ============================================================ */
    function renderGallery() {
        const filtered = getFilteredData();
        currentGalleryItems = filtered;

        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = filtered.slice(start, end);

        galleryGrid.innerHTML = '';

        if (pageItems.length === 0) {
            galleryGrid.innerHTML = `
                <div class="gallery-empty">
                    <i class="fas fa-inbox"></i>
                    <p>Пока что здесь пусто</p>
                </div>`;
            prevPageBtn.disabled = true;
            nextPageBtn.disabled = true;
            updateDots(0, 0);
            return;
        }

        pageItems.forEach((item, localIndex) => {
            const globalIndex = start + localIndex;
            const author = getAuthorByName(item.author);
            const showRenderNote = currentType === 'skins' && item.isRender === true;

            const card = document.createElement('div');
            card.className = 'gallery-item glass' + getItemClass();
            card.dataset.index = globalIndex;

            const renderNote = showRenderNote
                ? '<p class="render-note">Также пример рендера</p>'
                : '';

            const socialsHtml = `
                <div class="author-socials">
                    ${author.youtube ? `<a class="author-social-link yt" href="${author.youtube}" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube"><i class="fab fa-youtube"></i></a>` : ''}
                    ${author.discord ? `<a class="author-social-link ds" href="${author.discord}" target="_blank" rel="noopener" aria-label="Discord" title="Discord"><i class="fab fa-discord"></i></a>` : ''}
                    ${author.telegram ? `<a class="author-social-link tg" href="${author.telegram}" target="_blank" rel="noopener" aria-label="Telegram" title="Telegram"><i class="fab fa-telegram"></i></a>` : ''}
                </div>`;

            card.innerHTML = `
                <div class="gallery-img-wrapper">
                    <div class="skeleton"></div>
                    <img src="${item.image}" alt="${getTypeLabel()} ${item.name}" loading="lazy">
                </div>
                <div class="gallery-info">
                    <h4>${item.name}</h4>
                    <span class="price">${item.price}</span>
                </div>
                ${renderNote}
                <div class="gallery-author" onclick="event.stopPropagation()">
                    <div class="author-info">
                        <img src="${author.avatar}" alt="${author.name}" onerror="this.style.display='none'">
                        <span>${author.name}</span>
                    </div>
                    ${socialsHtml}
                </div>
            `;

            const img = card.querySelector('img');
            const skeleton = card.querySelector('.skeleton');
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                skeleton.classList.add('hidden');
            });
            img.addEventListener('error', () => {
                skeleton.classList.add('hidden');
                img.classList.add('loaded');
                img.style.opacity = '0.3';
            });

            card.addEventListener('click', () => openLightbox(globalIndex));

            const compareKey = item.image;
            if (compareSelected.some(c => c.image === compareKey)) {
                card.classList.add('selected-for-compare');
            }

            galleryGrid.appendChild(card);
        });

        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        prevPageBtn.disabled = currentPage === 0;
        nextPageBtn.disabled = currentPage >= totalPages - 1;
        updateDots(currentPage, totalPages);
    }

    function updateDots(activeIndex, totalPages) {
        if (!paginationDots) return;
        paginationDots.innerHTML = '';

        if (totalPages <= 1) {
            paginationDots.style.display = 'none';
            return;
        }
        paginationDots.style.display = 'flex';

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'pagination-dot' + (i === activeIndex ? ' active' : '');
            dot.setAttribute('data-page', i);
            dot.setAttribute('aria-label', `Страница ${i + 1}`);
            dot.addEventListener('click', function () {
                currentPage = parseInt(this.getAttribute('data-page'));
                renderGallery();
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            paginationDots.appendChild(dot);
        }
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                renderGallery();
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const filtered = getFilteredData();
            const totalPages = Math.ceil(filtered.length / itemsPerPage);
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderGallery();
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    /* ============================================================
       15. LIGHTBOX
    ============================================================ */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxPrice = document.getElementById('lightboxPrice');
    const lightboxAuthor = document.getElementById('lightboxAuthor');
    const lightboxType = document.getElementById('lightboxType');
    const lightboxSkeleton = document.getElementById('lightboxSkeleton');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxOrderBtn = document.getElementById('lightboxOrderBtn');
    const lightboxShareBtn = document.getElementById('lightboxShareBtn');
    const lightboxCompareBtn = document.getElementById('lightboxCompareBtn');

    let lightboxIndex = 0;

    function openLightbox(index) {
        if (!currentGalleryItems.length) return;
        lightboxIndex = index;
        const item = currentGalleryItems[index];
        if (!item) return;

        const author = getAuthorByName(item.author);

        lightboxType.textContent = getTypeLabel();
        lightboxTitle.textContent = item.name;
        lightboxPrice.textContent = item.price;
        lightboxAuthor.innerHTML = `<img src="${author.avatar}" alt="${author.name}" onerror="this.style.display='none'"> <span>Автор: ${author.name}</span>`;

        lightboxImg.classList.remove('loaded');
        lightboxSkeleton.classList.remove('hidden');

        lightboxImg.onload = () => {
            lightboxImg.classList.add('loaded');
            lightboxSkeleton.classList.add('hidden');
        };
        lightboxImg.onerror = () => {
            lightboxSkeleton.classList.add('hidden');
            lightboxImg.classList.add('loaded');
        };
        lightboxImg.src = item.image;
        lightboxImg.alt = item.name;

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        if (!orderModal.classList.contains('active') && !teamModal.classList.contains('active') && !compareModal.classList.contains('active')) {
            document.body.classList.remove('modal-open');
        }
    }

    function navigateLightbox(dir) {
        if (!currentGalleryItems.length) return;
        lightboxIndex = (lightboxIndex + dir + currentGalleryItems.length) % currentGalleryItems.length;
        openLightbox(lightboxIndex);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    if (lightboxOrderBtn) {
        lightboxOrderBtn.addEventListener('click', () => {
            let service = 'Скин';
            if (currentType === 'renders') service = 'Рендер';
            else if (currentType === 'previews') service = 'Превью';

            closeLightbox();
            openModal(service);
        });
    }

    if (lightboxShareBtn) {
        lightboxShareBtn.addEventListener('click', () => {
            const item = currentGalleryItems[lightboxIndex];
            shareItem(item);
        });
    }

    if (lightboxCompareBtn) {
        lightboxCompareBtn.addEventListener('click', () => {
            const item = currentGalleryItems[lightboxIndex];
            addToCompare(item);
            closeLightbox();
        });
    }

    /* ============================================================
       16. КНОПКА «ПОДЕЛИТЬСЯ»
    ============================================================ */
    async function shareItem(item) {
        const url = window.location.origin + window.location.pathname + `#gallery`;
        const text = `${item.name} — работа в TStudios Minecraft`;

        if (navigator.share) {
            try {
                await navigator.share({ title: 'TStudios', text, url });
                return;
            } catch (err) { /* отменено */ }
        }
        copyToClipboard(url, 'Ссылка скопирована!');
    }

    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const url = window.location.href;
            const text = 'TStudios — Скины, рендеры и превью Minecraft на заказ!';
            if (navigator.share) {
                try {
                    await navigator.share({ title: 'TStudios', text, url });
                    return;
                } catch (err) { /* отменено */ }
            }
            copyToClipboard(url, 'Ссылка на сайт скопирована!');
        });
    }

    function copyToClipboard(text, successMsg) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMsg, 'success');
            }).catch(() => fallbackCopy(text, successMsg));
        } else {
            fallbackCopy(text, successMsg);
        }
    }

    function fallbackCopy(text, successMsg) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showToast(successMsg, 'success');
        } catch (e) {
            showToast('Не удалось скопировать', 'error');
        }
        document.body.removeChild(ta);
    }

    /* ============================================================
       17. СРАВНЕНИЕ РАБОТ
    ============================================================ */
    const compareBar = document.getElementById('compareBar');
    const compareCount = document.getElementById('compareCount');
    const compareClear = document.getElementById('compareClear');
    const compareOpen = document.getElementById('compareOpen');
    const compareModal = document.getElementById('compareModal');
    const compareModalClose = document.getElementById('compareModalClose');
    const compareView = document.getElementById('compareView');

    let compareSelected = [];

    function addToCompare(item) {
        const existingIdx = compareSelected.findIndex(c => c.image === item.image);
        if (existingIdx !== -1) {
            compareSelected.splice(existingIdx, 1);
            showToast('Убрано из сравнения', 'info');
        } else {
            if (compareSelected.length >= 2) {
                compareSelected.shift();
            }
            compareSelected.push(item);
            showToast('Добавлено в сравнение', 'success');
        }
        updateCompareBar();
        renderGallery();
    }

    function updateCompareBar() {
        if (!compareBar) return;
        if (compareSelected.length > 0) {
            compareBar.hidden = false;
            compareCount.textContent = compareSelected.length;
            compareOpen.disabled = compareSelected.length < 2;
        } else {
            compareBar.hidden = true;
        }
    }

    if (compareClear) {
        compareClear.addEventListener('click', () => {
            compareSelected = [];
            updateCompareBar();
            renderGallery();
            showToast('Сравнение сброшено', 'info');
        });
    }

    if (compareOpen) {
        compareOpen.addEventListener('click', () => {
            if (compareSelected.length < 2) return;
            openCompareModal();
        });
    }

    function openCompareModal() {
        if (compareSelected.length < 2) return;

        compareView.innerHTML = compareSelected.map(item => {
            const author = getAuthorByName(item.author);
            return `
                <div class="compare-card">
                    <div class="compare-card-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <h4>${item.name}</h4>
                    <span class="price">${item.price}</span>
                    <p class="compare-card-author">
                        <i class="fas fa-user"></i> ${author.name}
                    </p>
                    <button type="button" class="btn btn-primary compare-order-btn" data-name="${item.name}">
                        <i class="fas fa-paper-plane"></i> Заказать
                    </button>
                </div>
            `;
        }).join('');

        compareView.querySelectorAll('.compare-order-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                closeCompareModal();
                let service = 'Скин';
                if (currentType === 'renders') service = 'Рендер';
                else if (currentType === 'previews') service = 'Превью';
                openModal(service);
            });
        });

        compareModal.classList.add('active');
        compareModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeCompareModal() {
        compareModal.classList.remove('active');
        compareModal.setAttribute('aria-hidden', 'true');
        if (!orderModal.classList.contains('active') && !teamModal.classList.contains('active') && !lightbox.classList.contains('active')) {
            document.body.classList.remove('modal-open');
        }
    }

    if (compareModalClose) compareModalClose.addEventListener('click', closeCompareModal);
    if (compareModal) {
        compareModal.addEventListener('click', (e) => {
            if (e.target === compareModal) closeCompareModal();
        });
    }

    /* ============================================================
       18. FAQ
    ============================================================ */
    const faqData = [
        {
            q: 'Сколько ждать заказ?',
            a: 'Скин — 1-2 дня, рендер — до 24 часов, превью — 2-3 дня, клип — от 3 дней. Есть срочный режим (×1.5 от цены, срок ~12 часов) и экспресс (×2 от цены, срок ~4-6 часов).'
        },
        {
            q: 'Какие способы оплаты?',
            a: 'Принимаем: СБП и банковская карта РФ. Оплата после согласования финального результата — сначала вы видите работу, потом оплачиваете.'
        },
        {
            q: 'Что если не понравится?',
            a: 'В цену входят правки (до 3-х для скинов, до 2-х для рендеров и превью). Если результат совсем не подошёл — вернём деньги до начала правок. Мы дорожим репутацией.'
        },
        {
            q: 'Можно ли заказать срочно?',
            a: 'Да! Есть срочный режим (×1.5 от цены) и экспресс (×2 от цены). Срочные заказы берём по возможности — уточняйте в Discord.'
        }
    ];

    const faqList = document.getElementById('faqList');
    if (faqList) {
        faqData.forEach((item, i) => {
            const el = document.createElement('div');
            el.className = 'faq-item glass';
            el.innerHTML = `
                <button type="button" class="faq-question" aria-expanded="false">
                    <span>${item.q}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="faq-answer"><p>${item.a}</p></div>
            `;
            faqList.appendChild(el);

            const btn = el.querySelector('.faq-question');
            btn.addEventListener('click', () => {
                const isOpen = el.classList.contains('open');
                faqList.querySelectorAll('.faq-item').forEach(other => {
                    other.classList.remove('open');
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });
                if (!isOpen) {
                    el.classList.add('open');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    /* ============================================================
       19. ОТЗЫВЫ
    ============================================================ */
    const reviewsData = [
        { name: 'FIREFOX', rating: 5, text: 'Очень хорошее качество и очень не плохое качество рук и буква моего канала.', service: 'Скин' },
        { name: 'Beatlewind', rating: 4, text: 'Хорошо подобран стиль, но не хватает уникальности и изюминки в скине.', service: 'Скин' },
        { name: 'Тимоша Музыка', rating: 5, text: 'Классный Скин!', service: 'Скин' },
        { name: 'арсик', rating: 5, text: 'автор красава, все четко сделал:)', service: 'Скин' },
        { name: 'Спящий бизнесмен', rating: 5, text: 'да круто вышло, спасибо', service: 'Рендер' }
    ];

    const serviceIcons = {
        'Скин': 'fa-paint-brush',
        'Рендер': 'fa-cube',
        'Превью': 'fa-image',
        'Клип': 'fa-music'
    };

    const reviewsSlider = document.getElementById('reviewsSlider');
    const reviewDots = document.getElementById('reviewDots');
    let currentReview = 0;

    function renderReviews() {
        reviewsSlider.innerHTML = '';
        reviewsData.forEach((review, index) => {
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            const icon = serviceIcons[review.service] || 'fa-tag';
            const card = document.createElement('div');
            card.className = 'review-card glass' + (index === 0 ? ' active' : '');
            card.innerHTML = `
                <div class="review-header">
                    <div class="review-header-left">
                        <span class="reviewer-name">${review.name}</span>
                        <span class="review-service" data-service="${review.service}">
                            <i class="fas ${icon}"></i> ${review.service}
                        </span>
                    </div>
                    <div class="stars">${stars}</div>
                </div>
                <p class="review-text">"${review.text}"</p>
            `;
            reviewsSlider.appendChild(card);
        });

        reviewDots.innerHTML = '';
        reviewsData.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Отзыв ${index + 1}`);
            dot.addEventListener('click', () => {
                currentReview = index;
                showReview(currentReview);
            });
            reviewDots.appendChild(dot);
        });
    }

    function showReview(index) {
        const reviewCards = document.querySelectorAll('.review-card');
        const dots = document.querySelectorAll('.slider-dot');
        reviewCards.forEach((el, i) => el.classList.toggle('active', i === index));
        dots.forEach((el, i) => el.classList.toggle('active', i === index));
    }

    if (reviewsSlider) renderReviews();

    const prevReview = document.getElementById('prevReview');
    const nextReview = document.getElementById('nextReview');

    if (prevReview && nextReview && reviewsData.length) {
        prevReview.addEventListener('click', () => {
            currentReview = (currentReview - 1 + reviewsData.length) % reviewsData.length;
            showReview(currentReview);
        });
        nextReview.addEventListener('click', () => {
            currentReview = (currentReview + 1) % reviewsData.length;
            showReview(currentReview);
        });
    }

    if (reviewsData.length > 1) {
        setInterval(() => {
            currentReview = (currentReview + 1) % reviewsData.length;
            showReview(currentReview);
        }, 7000);
    }

    /* ============================================================
       20. КАЛЬКУЛЯТОР
    ============================================================ */
    const calcService = document.getElementById('calcService');
    const calcGenderRow = document.getElementById('calcGenderRow');
    const calcGender = document.getElementById('calcGender');
    const calcRevisions = document.getElementById('calcRevisions');
    const calcRevisionsValue = document.getElementById('calcRevisionsValue');
    const calcUrgency = document.getElementById('calcUrgency');
    const calcTotal = document.getElementById('calcTotal');
    const calcOrderBtn = document.getElementById('calcOrderBtn');

    let calcState = {
        service: 'Скин',
        basePrice: 99,
        genderExtra: 0,
        revisions: 0,
        revisionsPrice: 30,
        urgencyMult: 1
    };

    function updateCalcTotal() {
        let total = (calcState.basePrice + calcState.genderExtra + calcState.revisions * calcState.revisionsPrice) * calcState.urgencyMult;
        total = Math.round(total);
        calcTotal.textContent = `${total} ₽`;
        return total;
    }

    if (calcService) {
        calcService.querySelectorAll('.calc-opt').forEach(btn => {
            btn.addEventListener('click', function () {
                calcService.querySelectorAll('.calc-opt').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                calcState.service = this.dataset.service;
                calcState.basePrice = parseInt(this.dataset.price);

                if (calcState.service === 'Скин') {
                    calcGenderRow.hidden = false;
                } else {
                    calcGenderRow.hidden = true;
                    calcState.genderExtra = 0;
                }
                updateCalcTotal();
            });
        });
    }

    if (calcGender) {
        calcGender.querySelectorAll('.calc-opt').forEach(btn => {
            btn.addEventListener('click', function () {
                calcGender.querySelectorAll('.calc-opt').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                calcState.genderExtra = parseInt(this.dataset.extra);
                updateCalcTotal();
            });
        });
    }

    if (calcRevisions) {
        calcRevisions.addEventListener('input', function () {
            calcState.revisions = parseInt(this.value);
            calcRevisionsValue.textContent = `${calcState.revisions} правок × ${calcState.revisionsPrice} ₽`;
            updateCalcTotal();
        });
    }

    if (calcUrgency) {
        calcUrgency.querySelectorAll('.calc-opt').forEach(btn => {
            btn.addEventListener('click', function () {
                calcUrgency.querySelectorAll('.calc-opt').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                calcState.urgencyMult = parseFloat(this.dataset.mult);
                updateCalcTotal();
            });
        });
    }

    if (calcOrderBtn) {
        calcOrderBtn.addEventListener('click', () => {
            // Передаём состояние калькулятора в модалку
            openModal(calcState.service, {
                revisions: calcState.revisions,
                urgencyMult: calcState.urgencyMult,
                urgencyLabel: calcState.urgencyMult === 1 ? 'Обычная'
                    : calcState.urgencyMult === 1.5 ? 'Быстро (×1.5)'
                    : 'Экспресс (×2)',
                genderExtra: calcState.genderExtra
            });
        });
    }

    /* ============================================================
       21. МОДАЛКА ЗАКАЗА
    ============================================================ */
    const orderModal = document.getElementById('orderModal');
    const modalClose = document.getElementById('modalClose');
    const modalServiceName = document.getElementById('modalServiceName');
    const modalStepForm = document.getElementById('modalStepForm');
    const modalStepResult = document.getElementById('modalStepResult');
    const orderForm = document.getElementById('orderForm');
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');
    const cancelOrder = document.getElementById('cancelOrder');
    const backToForm = document.getElementById('backToForm');
    const descCounter = document.getElementById('descCounter');
    const extraCounter = document.getElementById('extraCounter');

    const fieldsSkin = document.getElementById('fieldsSkin');
    const fieldsRender = document.getElementById('fieldsRender');
    const fieldsPreview = document.getElementById('fieldsPreview');
    const fieldsClip = document.getElementById('fieldsClip');
    const fieldsExtras = document.getElementById('fieldsExtras');

    const orderRevisions = document.getElementById('orderRevisions');
    const orderRevisionsValue = document.getElementById('orderRevisionsValue');
    const orderUrgency = document.getElementById('orderUrgency');
    const orderTotal = document.getElementById('orderTotal');

    const genderHint = document.getElementById('genderHint');
    const genderHintText = document.getElementById('genderHintText');

    const orderDesc = document.getElementById('orderDesc');
    const orderExtra = document.getElementById('orderExtra');
    const submitOrderBtn = document.getElementById('submitOrder');

    let currentService = 'Скин';
    let orderState = {
        basePrice: 99,
        genderExtra: 0,
        revisions: 0,
        revisionsPrice: 30,
        urgencyMult: 1,
        urgencyLabel: 'Обычная'
    };

    // Базовые цены по услугам
    const BASE_PRICES = {
        'Скин': 99,
        'Рендер': 49,
        'Превью': 99,
        'Клип': 499
    };

    function updateOrderTotal() {
        if (!orderTotal) return;
        let total = (orderState.basePrice + orderState.genderExtra + orderState.revisions * orderState.revisionsPrice) * orderState.urgencyMult;
        total = Math.round(total);
        orderTotal.textContent = `${total} ₽`;
        return total;
    }

    const FEMALE_TRIGGERS = [
        'женск', 'женщин', 'девушк', 'девочк', 'девчон', 'леди', 'дама',
        'female', 'girl', 'woman', 'lady',
        'платье', 'юбка', 'юбк', 'бант', 'косичк', 'макияж', 'губ',
        'туфли', 'каблук', 'сумочк', 'маникюр', 'прическ'
    ];

    const MALE_TRIGGERS = [
        'мужск', 'мужчин', 'мужик', 'парн', 'парен', 'мальчик', 'пацан',
        'male', 'boy', 'man',
        'борода', 'усы', 'бород', 'качок', 'мускул', 'качалк',
        'шорты'
    ];

    function hasFemaleTriggers(text) {
        const lower = text.toLowerCase();
        return FEMALE_TRIGGERS.some(t => lower.includes(t));
    }
    function hasMaleTriggers(text) {
        const lower = text.toLowerCase();
        return MALE_TRIGGERS.some(t => lower.includes(t));
    }

    function isMaleSkinSelected() {
        if (currentService !== 'Скин') return false;
        const g = document.querySelector('input[name="skinGender"]:checked');
        return g && g.value === 'Мужской';
    }
    function isFemaleSkinSelected() {
        if (currentService !== 'Скин') return false;
        const g = document.querySelector('input[name="skinGender"]:checked');
        return g && g.value === 'Женский';
    }

    function updateGenderHint() {
        if (!genderHint || !genderHintText) return;

        if (currentService !== 'Скин') {
            genderHint.hidden = true;
            if (orderDesc) orderDesc.classList.remove('conflict');
            if (submitOrderBtn) {
                submitOrderBtn.disabled = false;
                submitOrderBtn.classList.remove('disabled');
            }
            return;
        }

        const desc = orderDesc ? orderDesc.value.trim() : '';
        const extra = orderExtra ? orderExtra.value.trim() : '';
        const allText = (desc + ' ' + extra).toLowerCase();
        const maleSelected = isMaleSkinSelected();
        const femaleSelected = isFemaleSkinSelected();
        const hasFemale = hasFemaleTriggers(allText);
        const hasMale = hasMaleTriggers(allText);

        if (maleSelected && hasFemale) {
            genderHint.hidden = false;
            genderHint.classList.add('danger');
            genderHintText.innerHTML = '🚫 <strong>Кнопка заблокирована.</strong> Вы выбрали <strong>мужской скин</strong>, но в описании есть женские детали. Переключите пол на <strong>«Женский»</strong> (149 ₽) или уберите женские детали.';
            if (orderDesc) orderDesc.classList.add('conflict');
            if (submitOrderBtn) {
                submitOrderBtn.disabled = true;
                submitOrderBtn.classList.add('disabled');
            }
            return;
        }

        if (femaleSelected && hasMale) {
            genderHint.hidden = false;
            genderHint.classList.remove('danger');
            genderHint.style.background = 'rgba(245, 158, 11, 0.1)';
            genderHint.style.borderColor = 'rgba(245, 158, 11, 0.4)';
            genderHint.style.color = 'var(--warning)';
            genderHintText.innerHTML = '⚠️ <strong>Внимание!</strong> Вы выбрали <strong>женский скин</strong>, но в описании есть мужские детали. Проверьте, пожалуйста, пол.';
            if (orderDesc) orderDesc.classList.remove('conflict');
            if (submitOrderBtn) {
                submitOrderBtn.disabled = false;
                submitOrderBtn.classList.remove('disabled');
            }
            return;
        }

        genderHint.hidden = true;
        if (orderDesc) orderDesc.classList.remove('conflict');
        if (submitOrderBtn) {
            submitOrderBtn.disabled = false;
            submitOrderBtn.classList.remove('disabled');
        }
    }

    if (orderDesc) {
        orderDesc.addEventListener('input', function () {
            descCounter.textContent = `${this.value.length} / 500`;
            updateGenderHint();
        });
    }

    if (orderExtra) {
        orderExtra.addEventListener('input', function () {
            extraCounter.textContent = `${this.value.length} / 300`;
            updateGenderHint();
        });
    }

    // При смене пола скина в модалке — пересчитываем цену + переключаем подсказку
    document.querySelectorAll('input[name="skinGender"]').forEach(radio => {
        radio.addEventListener('change', function () {
            if (currentService === 'Скин') {
                orderState.genderExtra = this.value === 'Женский' ? 50 : 0;
                updateOrderTotal();
            }
            updateGenderHint();
        });
    });

    // Слайдер правок в модалке
    if (orderRevisions) {
        orderRevisions.addEventListener('input', function () {
            orderState.revisions = parseInt(this.value);
            orderRevisionsValue.textContent = `${orderState.revisions} правок × ${orderState.revisionsPrice} ₽`;
            updateOrderTotal();
        });
    }

    // Срочность в модалке
    if (orderUrgency) {
        orderUrgency.querySelectorAll('.calc-opt').forEach(btn => {
            btn.addEventListener('click', function () {
                orderUrgency.querySelectorAll('.calc-opt').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                orderState.urgencyMult = parseFloat(this.dataset.mult);
                orderState.urgencyLabel = this.textContent.trim();
                updateOrderTotal();
            });
        });
    }

    document.querySelectorAll('.btn-pricing').forEach(btn => {
        btn.addEventListener('click', function () {
            const service = this.getAttribute('data-service') || 'Скин';
            // Если открывают карточку скина — учитываем выбранный пол
            let genderExtra = 0;
            if (service === 'Скин' && femaleBtn && femaleBtn.classList.contains('active')) {
                genderExtra = 50;
            }
            openModal(service, { genderExtra });
        });
    });

    function openModal(service, prefill = {}) {
        currentService = service;
        modalServiceName.textContent = `Услуга: ${service}`;

        fieldsSkin.hidden = true;
        fieldsRender.hidden = true;
        fieldsPreview.hidden = true;
        fieldsClip.hidden = true;

        if (service === 'Скин') fieldsSkin.hidden = false;
        else if (service === 'Рендер') fieldsRender.hidden = false;
        else if (service === 'Превью') fieldsPreview.hidden = false;
        else if (service === 'Клип') fieldsClip.hidden = false;

        // Сброс состояния заказа
        orderState.basePrice = BASE_PRICES[service] || 99;
        orderState.genderExtra = prefill.genderExtra || 0;
        orderState.revisions = prefill.revisions || 0;
        orderState.urgencyMult = prefill.urgencyMult || 1;
        orderState.urgencyLabel = prefill.urgencyLabel || 'Обычная';

        // Сброс полей формы
        orderForm.reset();
        descCounter.textContent = '0 / 500';
        extraCounter.textContent = '0 / 300';

        // Сброс слайдера правок
        if (orderRevisions) {
            orderRevisions.value = orderState.revisions;
            orderRevisionsValue.textContent = `${orderState.revisions} правок × ${orderState.revisionsPrice} ₽`;
        }

        // Сброс срочности
        if (orderUrgency) {
            orderUrgency.querySelectorAll('.calc-opt').forEach(b => b.classList.remove('active'));
            const target = Array.from(orderUrgency.querySelectorAll('.calc-opt'))
                .find(b => parseFloat(b.dataset.mult) === orderState.urgencyMult);
            if (target) target.classList.add('active');
        }

        // Установить пол скина, если пришло из карточки "Женский"
        if (service === 'Скин' && orderState.genderExtra === 50) {
            const femaleRadio = document.querySelector('input[name="skinGender"][value="Женский"]');
            if (femaleRadio) femaleRadio.checked = true;
        }

        // Пересчёт итоговой цены
        updateOrderTotal();

        modalStepForm.hidden = false;
        modalStepResult.hidden = true;

        if (genderHint) {
            genderHint.hidden = true;
            genderHint.classList.remove('danger');
        }
        if (orderDesc) orderDesc.classList.remove('conflict');
        if (submitOrderBtn) {
            submitOrderBtn.disabled = false;
            submitOrderBtn.classList.remove('disabled');
        }

        orderModal.classList.add('active');
        orderModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        setTimeout(() => {
            const firstInput = orderForm.querySelector('input[type="text"]');
            if (firstInput) firstInput.focus();
        }, 300);
    }

    function closeModal() {
        orderModal.classList.remove('active');
        orderModal.setAttribute('aria-hidden', 'true');
        if (!teamModal.classList.contains('active') && !compareModal.classList.contains('active') && !lightbox.classList.contains('active')) {
            document.body.classList.remove('modal-open');
        }
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (cancelOrder) cancelOrder.addEventListener('click', closeModal);
    if (orderModal) {
        orderModal.addEventListener('click', (e) => {
            if (e.target === orderModal) closeModal();
        });
    }

    function generateOrderText() {
        const name = document.getElementById('orderName').value.trim();
        const desc = orderDesc.value.trim();
        const extra = orderExtra.value.trim();

        let text = '';
        text += `🎨 Заказ в TStudios\n`;
        text += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        text += `📌 Услуга: ${currentService}\n`;
        text += `👤 Имя: ${name}\n`;

        if (currentService === 'Скин') {
            const gender = document.querySelector('input[name="skinGender"]:checked');
            const theme = document.getElementById('skinTheme').value.trim();
            const colors = document.getElementById('skinColors').value.trim();
            const refs = document.getElementById('skinRefs').value.trim();
            if (gender) text += `⚧ Пол скина: ${gender.value}\n`;
            if (theme) text += `🎭 Тема / стиль: ${theme}\n`;
            if (colors) text += `🎨 Цвета: ${colors}\n`;
            if (refs) text += `🔗 Референсы: ${refs}\n`;
        } else if (currentService === 'Рендер') {
            const renderType = document.querySelector('input[name="renderType"]:checked');
            const pose = document.getElementById('renderPose').value;
            const bg = document.getElementById('renderBg').value.trim();
            const mood = document.getElementById('renderMood').value.trim();
            if (renderType) text += `🖼️ Тип рендера: ${renderType.value}\n`;
            if (pose) text += `🧍 Поза / ракурс: ${pose}\n`;
            if (bg) text += `🌄 Фон: ${bg}\n`;
            if (mood) text += `✨ Атмосфера: ${mood}\n`;
        } else if (currentService === 'Превью') {
            const title = document.getElementById('previewTitle').value.trim();
            const style = document.querySelector('input[name="previewStyle"]:checked');
            const refs = document.getElementById('previewRefs').value.trim();
            if (title) text += `📺 Тема видео: ${title}\n`;
            if (style) text += `🎨 Стиль превью: ${style.value}\n`;
            if (refs) text += `🔗 Референсы: ${refs}\n`;
        } else if (currentService === 'Клип') {
            const genre = document.getElementById('clipGenre').value;
            const duration = document.getElementById('clipDuration').value;
            const track = document.getElementById('clipTrack').value.trim();
            if (genre) text += `🎵 Жанр: ${genre}\n`;
            if (duration) text += `⏱️ Длительность: ${duration}\n`;
            if (track) text += `🎧 Трек: ${track}\n`;
        }

        // Доп. правки и срочность
        if (orderState.revisions > 0) {
            text += `✏️ Доп. правки: ${orderState.revisions} × ${orderState.revisionsPrice} ₽\n`;
        }
        text += `⚡ Срочность: ${orderState.urgencyLabel}\n`;

        // Итоговая цена
        const total = Math.round(
            (orderState.basePrice + orderState.genderExtra + orderState.revisions * orderState.revisionsPrice) * orderState.urgencyMult
        );
        text += `💰 Предварительная стоимость: ${total} ₽\n`;

        text += `\n📝 Описание:\n${desc}\n`;
        if (extra) text += `\n💬 Дополнительно:\n${extra}\n`;
        text += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        text += `✅ Отправлено через сайт TStudios`;
        return text;
    }

    function validateForm() {
        const name = document.getElementById('orderName').value.trim();
        const desc = orderDesc.value.trim();
        if (!name) {
            showToast('Укажите имя или ник', 'error');
            document.getElementById('orderName').focus();
            return false;
        }
        if (!desc) {
            showToast('Заполните описание заказа', 'error');
            orderDesc.focus();
            return false;
        }
        if (currentService === 'Скин') {
            const theme = document.getElementById('skinTheme').value.trim();
            if (!theme) {
                showToast('Укажите тему скина', 'error');
                document.getElementById('skinTheme').focus();
                return false;
            }
        } else if (currentService === 'Рендер') {
            const pose = document.getElementById('renderPose').value;
            if (!pose) {
                showToast('Выберите позу', 'error');
                document.getElementById('renderPose').focus();
                return false;
            }
        } else if (currentService === 'Превью') {
            const title = document.getElementById('previewTitle').value.trim();
            if (!title) {
                showToast('Укажите тему видео', 'error');
                document.getElementById('previewTitle').focus();
                return false;
            }
        } else if (currentService === 'Клип') {
            const genre = document.getElementById('clipGenre').value;
            const duration = document.getElementById('clipDuration').value;
            if (!genre) {
                showToast('Выберите жанр', 'error');
                document.getElementById('clipGenre').focus();
                return false;
            }
            if (!duration) {
                showToast('Выберите длительность', 'error');
                document.getElementById('clipDuration').focus();
                return false;
            }
        }
        return true;
    }

    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (submitOrderBtn && submitOrderBtn.disabled) return;
            if (!validateForm()) return;

            resultText.value = generateOrderText();
            modalStepForm.hidden = true;
            modalStepResult.hidden = false;
        });
    }

    if (copyBtn && resultText) {
        copyBtn.addEventListener('click', function () {
            copyToClipboard(resultText.value, 'Текст скопирован!');
            copyBtn.classList.add('copied');
            const span = copyBtn.querySelector('span');
            if (span) {
                const original = span.textContent;
                span.textContent = 'Скопировано!';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    span.textContent = original;
                }, 2000);
            }
        });
    }

    if (backToForm) {
        backToForm.addEventListener('click', () => {
            modalStepForm.hidden = false;
            modalStepResult.hidden = true;
        });
    }

    /* ============================================================
       22. МОДАЛКА ЗАЯВКИ В КОМАНДУ
    ============================================================ */
    const teamModal = document.getElementById('teamModal');
    const teamModalClose = document.getElementById('teamModalClose');
    const openTeamModalBtn = document.getElementById('openTeamModal');
    const teamStepForm = document.getElementById('teamStepForm');
    const teamStepResult = document.getElementById('teamStepResult');
    const teamForm = document.getElementById('teamForm');
    const teamResultText = document.getElementById('teamResultText');
    const teamCopyBtn = document.getElementById('teamCopyBtn');
    const teamCancel = document.getElementById('teamCancel');
    const teamBackToForm = document.getElementById('teamBackToForm');
    const teamRoleSelect = document.getElementById('teamRole');

    const teamFieldsSkin = document.getElementById('teamFieldsSkin');
    const teamFields3D = document.getElementById('teamFields3D');
    const teamFieldsMontage = document.getElementById('teamFieldsMontage');
    const teamFieldsPreview = document.getElementById('teamFieldsPreview');
    const teamFieldsBuilder = document.getElementById('teamFieldsBuilder');

    function hideAllTeamFields() {
        [teamFieldsSkin, teamFields3D, teamFieldsMontage, teamFieldsPreview, teamFieldsBuilder]
            .forEach(f => { if (f) f.hidden = true; });
    }

    function showTeamFieldByRole(role) {
        hideAllTeamFields();
        if (role === 'Художник скинов' && teamFieldsSkin) teamFieldsSkin.hidden = false;
        else if (role === '3D моделлер' && teamFields3D) teamFields3D.hidden = false;
        else if (role === 'Монтажер' && teamFieldsMontage) teamFieldsMontage.hidden = false;
        else if (role === 'Художник превью' && teamFieldsPreview) teamFieldsPreview.hidden = false;
        else if (role === 'Строитель' && teamFieldsBuilder) teamFieldsBuilder.hidden = false;
    }

    if (teamRoleSelect) {
        teamRoleSelect.addEventListener('change', function () {
            showTeamFieldByRole(this.value);
        });
    }

    if (openTeamModalBtn) {
        openTeamModalBtn.addEventListener('click', () => {
            teamForm.reset();
            hideAllTeamFields();
            teamStepForm.hidden = false;
            teamStepResult.hidden = true;
            teamModal.classList.add('active');
            teamModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            setTimeout(() => {
                const firstInput = teamForm.querySelector('input[type="text"]');
                if (firstInput) firstInput.focus();
            }, 300);
        });
    }

    function closeTeamModal() {
        teamModal.classList.remove('active');
        teamModal.setAttribute('aria-hidden', 'true');
        if (!orderModal.classList.contains('active') && !compareModal.classList.contains('active') && !lightbox.classList.contains('active')) {
            document.body.classList.remove('modal-open');
        }
    }

    if (teamModalClose) teamModalClose.addEventListener('click', closeTeamModal);
    if (teamCancel) teamCancel.addEventListener('click', closeTeamModal);
    if (teamModal) {
        teamModal.addEventListener('click', (e) => {
            if (e.target === teamModal) closeTeamModal();
        });
    }

    function generateTeamText() {
        const name = document.getElementById('teamName').value.trim();
        const age = document.getElementById('teamAge').value.trim();
        const adequacy = document.getElementById('teamAdequacy').value;
        const literacy = document.getElementById('teamLiteracy').value;
        const role = document.getElementById('teamRole').value;
        const channel = document.getElementById('teamChannel').value.trim();

        let text = '';
        text += `👥 Заявка в команду TStudios\n`;
        text += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        text += `👤 Имя / ник: ${name}\n`;
        text += `🎂 Возраст: ${age} лет\n`;
        text += `🧠 Адекватность: ${adequacy} / 10\n`;
        text += `📚 Грамотность: ${literacy} / 10\n`;
        text += `🎯 Роль: ${role}\n`;

        if (role === 'Художник скинов') {
            const skills = document.getElementById('teamSkinSkills').value.trim();
            if (skills) text += `\n🎨 Навыки:\n${skills}\n`;
        } else if (role === '3D моделлер') {
            const skills = document.getElementById('team3DSkills').value.trim();
            if (skills) text += `\n🧊 Навыки:\n${skills}\n`;
        } else if (role === 'Монтажер') {
            const skills = document.getElementById('teamMontageSkills').value.trim();
            if (skills) text += `\n🎬 Навыки:\n${skills}\n`;
        } else if (role === 'Художник превью') {
            const skills = document.getElementById('teamPreviewSkills').value.trim();
            if (skills) text += `\n🖼️ Навыки:\n${skills}\n`;
        } else if (role === 'Строитель') {
            const skills = document.getElementById('teamBuilderSkills').value.trim();
            if (skills) text += `\n🏗️ Навыки:\n${skills}\n`;
        }

        text += `\n📺 YouTube канал: ${channel}\n`;
        text += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        text += `✅ Отправлено через сайт TStudios`;
        return text;
    }

    function validateTeamForm() {
        const name = document.getElementById('teamName').value.trim();
        const age = parseInt(document.getElementById('teamAge').value);
        const adequacy = document.getElementById('teamAdequacy').value;
        const literacy = document.getElementById('teamLiteracy').value;
        const role = document.getElementById('teamRole').value;
        const channel = document.getElementById('teamChannel').value.trim();

        if (!name) { showToast('Укажите имя', 'error'); return false; }
        if (!age || age < 12) { showToast('Возраст от 12 лет', 'error'); return false; }
        if (!adequacy) { showToast('Выберите адекватность', 'error'); return false; }
        if (!literacy) { showToast('Выберите грамотность', 'error'); return false; }
        if (!role) { showToast('Выберите роль', 'error'); return false; }
        if (!channel) { showToast('Укажите YouTube канал', 'error'); return false; }

        return true;
    }

    if (teamForm) {
        teamForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateTeamForm()) return;
            teamResultText.value = generateTeamText();
            teamStepForm.hidden = true;
            teamStepResult.hidden = false;
        });
    }

    if (teamCopyBtn && teamResultText) {
        teamCopyBtn.addEventListener('click', function () {
            copyToClipboard(teamResultText.value, 'Текст скопирован!');
            teamCopyBtn.classList.add('copied');
            const span = teamCopyBtn.querySelector('span');
            if (span) {
                const original = span.textContent;
                span.textContent = 'Скопировано!';
                setTimeout(() => {
                    teamCopyBtn.classList.remove('copied');
                    span.textContent = original;
                }, 2000);
            }
        });
    }

    if (teamBackToForm) {
        teamBackToForm.addEventListener('click', () => {
            teamStepForm.hidden = false;
            teamStepResult.hidden = true;
        });
    }

    /* ============================================================
       23. ESCAPE ЗАКРЫВАЕТ ВСЁ
    ============================================================ */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox && lightbox.classList.contains('active')) closeLightbox();
            else if (compareModal && compareModal.classList.contains('active')) closeCompareModal();
            else if (orderModal && orderModal.classList.contains('active')) closeModal();
            else if (teamModal && teamModal.classList.contains('active')) closeTeamModal();
        }
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });

    /* ============================================================
       24. ИНИЦИАЛИЗАЦИЯ
    ============================================================ */
    initAuthorTabs();
    renderGallery();
    updateCompareBar();

});