document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       0. ГЛОБАЛЬНЫЕ ЦЕНЫ
    ============================================================ */
    const PRICES = {
        skin: 250,
        skinFemale: 300,
        render: 150,
        revision: 45
    };

    document.querySelectorAll('[data-price]').forEach(el => {
        const key = el.getAttribute('data-price');
        if (PRICES[key] !== undefined) el.textContent = PRICES[key];
    });

    /* ============================================================
       1. БУРГЕР-МЕНЮ
    ============================================================ */
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.main-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });
        nav.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            })
        );
    }

    /* ============================================================
       2. СКРОЛЛ ХЕДЕРА
    ============================================================ */
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    /* ============================================================
       3. ПЛАВНЫЙ СКРОЛЛ
    ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ============================================================
       4. TOAST
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
       5. АВТОРЫ
    ============================================================ */
    const authors = [
        {
            name: 'Тимошка из Москвы',
            avatar: 'autors/tim.png',
            youtube: 'https://www.youtube.com/@Timosha_MoscowOF',
            discord: 'https://discord.com/users/1146355058880040970',
            telegram: 'https://t.me/MinecraftWithTimosha'
        }
    ];

    function getAuthorByName(name) {
        return authors.find(a => a.name === name) || authors[0];
    }

    /* ============================================================
       6. ПОРТФОЛИО
    ============================================================ */
    const skinsData = [
        { name: 'Тимоша Музыка', price: 0, image: 'skins/tmusic.png', author: 'Тимошка из Москвы' },
        { name: 'beatlewind', price: 0, image: 'skins/beatlewind.png', author: 'Тимошка из Москвы' },
        { name: 'FIREFOX', price: 0, image: 'skins/firefox.png', author: 'Тимошка из Москвы' },
        { name: 'Рыцарь', price: 0, image: 'skins/knight.png', author: 'Тимошка из Москвы' },
        { name: 'Toxinator', price: 50, image: 'skins/toxinator.png', author: 'Тимошка из Москвы' },
        { name: 'арсик', price: 0, image: 'skins/zakazMAJORrender.png', author: 'Тимошка из Москвы' },
        { name: 'Дашка', price: 0, image: 'skins/dasha.png', author: 'Тимошка из Москвы' },
        { name: 'Тима-тян', price: 0, image: 'skins/timgirl.png', author: 'Тимошка из Москвы' },
        { name: 'Тима-тян 2', price: 0, image: 'skins/v2timgirl.png', author: 'Тимошка из Москвы' }
    ];

    const rendersData = [
        { name: 'NPOT', price: 50, image: 'renders/npot.png', author: 'Тимошка из Москвы' },
        { name: 'Sword', price: 50, image: 'renders/sword.png', author: 'Тимошка из Москвы' },
        { name: 'OP', price: 50, image: 'renders/OP.png', author: 'Тимошка из Москвы' },
        { name: 'Наблюдение', price: 50, image: 'renders/peeks.png', author: 'Тимошка из Москвы' },
        { name: 'Думает', price: 50, image: 'renders/question.png', author: 'Тимошка из Москвы' }
    ];

    function formatPrice(price) {
        if (price === 0 || price === '0' || price === '0 ₽') {
            return '<i class="fas fa-gift"></i> Подарок';
        }
        return `${price} ₽`;
    }

    /* ============================================================
       7. КАРУСЕЛИ
    ============================================================ */
    const CAROUSEL_SPEED = 0.6;

    const carousels = {
        skins: {
            viewport: document.getElementById('carouselSkins'),
            track: document.getElementById('carouselSkinsTrack'),
            data: skinsData,
            direction: 'left',
            offset: 0,
            paused: false,
            dragging: false,
            dragStartX: 0,
            dragStartOffset: 0
        },
        renders: {
            viewport: document.getElementById('carouselRenders'),
            track: document.getElementById('carouselRendersTrack'),
            data: rendersData,
            direction: 'right',
            offset: 0,
            paused: false,
            dragging: false,
            dragStartX: 0,
            dragStartOffset: 0
        }
    };

    const carouselDragMoved = { skins: false, renders: false };

    function createCarouselCard(item, index, carouselKey) {
        const author = getAuthorByName(item.author);
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.dataset.index = index;
        card.dataset.carousel = carouselKey;

        card.innerHTML = `
            <div class="carousel-img-wrapper">
                <div class="skeleton"></div>
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="carousel-info">
                <h4>${item.name}</h4>
                <span class="price">${formatPrice(item.price)}</span>
            </div>
            <div class="carousel-author">
                <img src="${author.avatar}" alt="${author.name}" onerror="this.style.display='none'">
                <span>${author.name}</span>
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

        card.addEventListener('click', () => {
            if (carouselDragMoved[carouselKey]) return;
            openLightbox(carouselKey, parseInt(card.dataset.index));
        });

        return card;
    }

    function initCarousel(key) {
        const c = carousels[key];
        if (!c.viewport || !c.track) return;
        c.track.innerHTML = '';

        const items = [...c.data, ...c.data, ...c.data];
        items.forEach((item, i) => {
            const originalIndex = i % c.data.length;
            c.track.appendChild(createCarouselCard(item, originalIndex, key));
        });

        requestAnimationFrame(() => {
            const singleSetWidth = c.track.scrollWidth / 3;
            c.offset = c.direction === 'left' ? 0 : singleSetWidth;
        });

        c.viewport.addEventListener('mouseenter', () => { c.paused = true; });
        c.viewport.addEventListener('mouseleave', () => { c.paused = false; });

        c.viewport.addEventListener('mousedown', (e) => {
            c.dragging = true;
            c.dragStartX = e.clientX;
            c.dragStartOffset = c.offset;
            carouselDragMoved[key] = false;
            c.viewport.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!c.dragging) return;
            const dx = e.clientX - c.dragStartX;
            if (Math.abs(dx) > 3) carouselDragMoved[key] = true;
            c.offset = c.dragStartOffset - dx;
        });

        window.addEventListener('mouseup', () => {
            if (c.dragging) {
                c.dragging = false;
                c.viewport.style.cursor = 'grab';
                setTimeout(() => { carouselDragMoved[key] = false; }, 50);
            }
        });

        c.viewport.addEventListener('touchstart', (e) => {
            c.dragging = true;
            c.dragStartX = e.touches[0].clientX;
            c.dragStartOffset = c.offset;
            carouselDragMoved[key] = false;
        }, { passive: true });

        c.viewport.addEventListener('touchmove', (e) => {
            if (!c.dragging) return;
            const dx = e.touches[0].clientX - c.dragStartX;
            if (Math.abs(dx) > 3) carouselDragMoved[key] = true;
            c.offset = c.dragStartOffset - dx;
        }, { passive: true });

        c.viewport.addEventListener('touchend', () => {
            c.dragging = false;
            setTimeout(() => { carouselDragMoved[key] = false; }, 50);
        });
    }

    function animateCarousels() {
        Object.keys(carousels).forEach(key => {
            const c = carousels[key];
            if (!c.track) return;
            const singleSetWidth = c.track.scrollWidth / 3;
            if (singleSetWidth <= 0) return;

            if (!c.paused && !c.dragging) {
                if (c.direction === 'left') {
                    c.offset += CAROUSEL_SPEED;
                    if (c.offset >= singleSetWidth) c.offset -= singleSetWidth;
                } else {
                    c.offset -= CAROUSEL_SPEED;
                    if (c.offset <= 0) c.offset += singleSetWidth;
                }
            }

            if (c.offset < 0) c.offset += singleSetWidth;
            if (c.offset >= singleSetWidth * 2) c.offset -= singleSetWidth;

            c.track.style.transform = `translate3d(${-c.offset}px, 0, 0)`;
        });
        requestAnimationFrame(animateCarousels);
    }

    initCarousel('skins');
    initCarousel('renders');
    requestAnimationFrame(animateCarousels);

    /* ============================================================
       8. LIGHTBOX
    ============================================================ */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxPrice = document.getElementById('lightboxPrice');
    const lightboxType = document.getElementById('lightboxType');
    const lightboxSkeleton = document.getElementById('lightboxSkeleton');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxOrderBtn = document.getElementById('lightboxOrderBtn');
    const lightboxShareBtn = document.getElementById('lightboxShareBtn');
    const lightboxAuthorAvatar = document.getElementById('lightboxAuthorAvatar');
    const lightboxAuthorName = document.getElementById('lightboxAuthorName');
    const lightboxAuthorSocials = document.getElementById('lightboxAuthorSocials');

    let lightboxItems = [];
    let lightboxIndex = 0;
    let lightboxCurrentType = 'skins';

    function openLightbox(type, index) {
        lightboxCurrentType = type;
        lightboxItems = carousels[type].data;
        lightboxIndex = index;

        const item = lightboxItems[index];
        if (!item) return;

        const author = getAuthorByName(item.author);

        lightboxType.textContent = type === 'skins' ? 'Скин' : 'Рендер';
        lightboxTitle.textContent = item.name;
        lightboxPrice.innerHTML = formatPrice(item.price);

        lightboxAuthorAvatar.src = author.avatar;
        lightboxAuthorAvatar.alt = author.name;
        lightboxAuthorName.textContent = author.name;

        lightboxAuthorSocials.innerHTML = '';
        if (author.youtube) {
            lightboxAuthorSocials.innerHTML += `<a href="${author.youtube}" target="_blank" rel="noopener" class="yt"><i class="fab fa-youtube"></i> YouTube</a>`;
        }
        if (author.discord) {
            lightboxAuthorSocials.innerHTML += `<a href="${author.discord}" target="_blank" rel="noopener" class="ds"><i class="fab fa-discord"></i> Discord</a>`;
        }
        if (author.telegram) {
            lightboxAuthorSocials.innerHTML += `<a href="${author.telegram}" target="_blank" rel="noopener" class="tg"><i class="fab fa-telegram"></i> ТГК</a>`;
        }

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
        document.body.classList.remove('modal-open');
    }

    function navigateLightbox(dir) {
        if (!lightboxItems.length) return;
        lightboxIndex = (lightboxIndex + dir + lightboxItems.length) % lightboxItems.length;
        openLightbox(lightboxCurrentType, lightboxIndex);
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
            const type = lightboxCurrentType;
            const item = lightboxItems[lightboxIndex];
            const executor = item ? item.author : '';
            const page = type === 'renders' ? 'order-render.html' : 'order-skin.html';
            const url = executor
                ? `${page}?executor=${encodeURIComponent(executor)}`
                : page;
            window.location.href = url;
        });
    }

    if (lightboxShareBtn) {
        lightboxShareBtn.addEventListener('click', () => {
            const item = lightboxItems[lightboxIndex];
            if (!item) return;
            const page = lightboxCurrentType === 'renders' ? 'order-render.html' : 'order-skin.html';
            const url = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}${page}`;
            const text = `${item.name} — работа в TStudios (${lightboxCurrentType === 'renders' ? 'рендер' : 'скин'} по Minecraft)`;
            shareText(text, url);
        });
    }

    /* ============================================================
       9. ПОДЕЛИТЬСЯ
    ============================================================ */
    function getBaseUrl() {
        return window.location.origin + window.location.pathname;
    }

    async function shareText(text, url) {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'TStudios', text, url });
                return;
            } catch (err) { /* отменил */ }
        }
        copyToClipboard(`${text}\n${url}`, 'Скопировано!');
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

    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const text = 'TStudios — скины, рендеры и многое другое по Minecraft на заказ. Честные цены, срок 1-2 дня.';
            shareText(text, getBaseUrl());
        });
    }

    const shareSkinBtn = document.getElementById('shareSkinBtn');
    if (shareSkinBtn) {
        shareSkinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}order-skin.html`;
            const text = 'Закажи уникальный скин по Minecraft в TStudios — от 250 ₽, срок 1-2 дня, сначала результат, потом оплата.';
            shareText(text, url);
        });
    }

    const shareRenderBtn = document.getElementById('shareRenderBtn');
    if (shareRenderBtn) {
        shareRenderBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}order-render.html`;
            const text = 'Закажи 3D-рендер по Minecraft в TStudios — от 150 ₽, готов за сутки, сначала результат, потом оплата.';
            shareText(text, url);
        });
    }

    const shareJoinBtn = document.getElementById('shareJoinBtn');
    if (shareJoinBtn) {
        shareJoinBtn.addEventListener('click', () => {
            const text = 'TStudios ищет в команду художников скинов, 3D-моделлеров, монтажёров и строителей. 14+, оплата за заказы остаётся тебе.';
            shareText(text, `${getBaseUrl()}#join`);
        });
    }

    const shareFooterBtn = document.getElementById('shareFooterBtn');
    if (shareFooterBtn) {
        shareFooterBtn.addEventListener('click', () => {
            const text = 'TStudios — студия Тимошки из Москвы. Скины, рендеры Minecraft на заказ. Честные цены, быстрые сроки.';
            shareText(text, getBaseUrl());
        });
    }

    /* ============================================================
       10. FAQ
    ============================================================ */
    const faqData = [
        { q: 'Как оплатить?', a: 'Сначала показываем готовое — платишь, только если всё нравится. Переводом (СБП или карта).' },
        { q: 'Сколько ждать готовую работу?', a: 'Скин — 1-2 дня, рендер — до 24 часов. Нужно быстрее — есть ускорение за доплату.' },
        { q: 'А если мне не понравится?', a: 'Бесплатно можно попросить правки: до 3 раз для скина, до 2 для рендера. Не зашло совсем — вернём деньги, пока не начали правки.' },
        { q: 'Можно срочно?', a: 'Да! Есть срочный режим (×1.5 от цены) и экспресс (×2 от цены).' },
        { q: 'Как заказать скин?', a: 'Нажми «Скин» в разделе «Что можно заказать» — откроется страница заказа. Заполни шаги и отправь заявку в Discord. От 250 ₽.' },
        { q: 'Как заказать рендер?', a: 'Нажми «Рендер» в разделе «Что можно заказать» — откроется страница заказа. Заполни шаги и отправь заявку в Discord. От 150 ₽.' }
    ];

    const faqList = document.getElementById('faqList');
    if (faqList) {
        faqData.forEach((item, i) => {
            const el = document.createElement('div');
            el.className = 'faq-item';
            if (i === 0) el.classList.add('open');
            el.innerHTML = `
                <button type="button" class="faq-question" aria-expanded="${i === 0 ? 'true' : 'false'}">
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
       11. ОТЗЫВЫ
    ============================================================ */
    const reviewsData = [
        { name: 'FIREFOX', rating: 5, text: 'Очень хорошее качество и очень не плохое качество рук и буква моего канала.', service: 'Скин' },
        { name: 'Beatlewind', rating: 4, text: 'Хорошо подобран стиль, но не хватает уникальности и изюминки в скине.', service: 'Скин' },
        { name: 'Тимоша Музыка', rating: 5, text: 'Классный Скин!', service: 'Скин' },
        { name: 'арсик', rating: 5, text: 'автор красава, все четко сделал:)', service: 'Скин' },
        { name: 'Vakulko', rating: 5, text: 'да круто вышло, спасибо', service: 'Рендер' },
        { name: 'Дашка', rating: 4, text: 'хороший.', service: 'Скин' }
    ];

    const serviceIcons = { 'Скин': 'fa-paint-brush', 'Рендер': 'fa-cube' };
    const reviewsSlider = document.getElementById('reviewsSlider');
    const reviewDots = document.getElementById('reviewDots');
    let currentReview = 0;

    function renderReviews() {
        reviewsSlider.innerHTML = '';
        reviewsData.forEach((review, index) => {
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            const icon = serviceIcons[review.service] || 'fa-tag';
            const card = document.createElement('div');
            card.className = 'review-card' + (index === 0 ? ' active' : '');
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
        const cards = document.querySelectorAll('.review-card');
        const dots = document.querySelectorAll('.slider-dot');
        cards.forEach((el, i) => el.classList.toggle('active', i === index));
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
       12. КАЛЬКУЛЯТОР
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
        basePrice: PRICES.skin,
        genderExtra: 0,
        revisions: 0,
        revisionsPrice: PRICES.revision,
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
                    if (calcGender) {
                        calcGender.querySelectorAll('.calc-opt').forEach(b => b.classList.remove('active'));
                        const maleBtn = calcGender.querySelector('.calc-opt[data-gender="male"]');
                        if (maleBtn) maleBtn.classList.add('active');
                    }
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
            calcRevisionsValue.innerHTML = `${calcState.revisions} правок × <span data-price="revision">${PRICES.revision}</span> ₽`;
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
            const page = calcState.service === 'Рендер' ? 'order-render.html' : 'order-skin.html';
            const params = new URLSearchParams();
            if (calcState.revisions > 0) params.set('revisions', calcState.revisions);
            if (calcState.urgencyMult !== 1) params.set('urgency', calcState.urgencyMult);
            if (calcState.service === 'Скин' && calcState.genderExtra === 50) params.set('gender', 'female');
            const qs = params.toString();
            window.location.href = `${page}${qs ? '?' + qs : ''}`;
        });
    }

    /* ============================================================
       13. МОДАЛКА «В КОМАНДУ»
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
    const teamFieldsBuilder = document.getElementById('teamFieldsBuilder');

    function hideAllTeamFields() {
        [teamFieldsSkin, teamFields3D, teamFieldsMontage, teamFieldsBuilder]
            .forEach(f => { if (f) f.hidden = true; });
    }

    function showTeamFieldByRole(role) {
        hideAllTeamFields();
        if (role === 'Художник скинов' && teamFieldsSkin) teamFieldsSkin.hidden = false;
        else if (role === '3D моделлер' && teamFields3D) teamFields3D.hidden = false;
        else if (role === 'Монтажер' && teamFieldsMontage) teamFieldsMontage.hidden = false;
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
            }, 250);
        });
    }

    function closeTeamModal() {
        teamModal.classList.remove('active');
        teamModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
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
        const passport = document.querySelector('input[name="teamPassport"]:checked');
        const bankCard = document.querySelector('input[name="teamBankCard"]:checked');

        let text = '';
        text += `Заявка в команду TStudios\n`;
        text += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        text += `Имя / ник: ${name}\n`;
        text += `Возраст: ${age} лет\n`;
        text += `Адекватность: ${adequacy} / 10\n`;
        text += `Грамотность: ${literacy} / 10\n`;
        if (passport) text += `Паспорт: ${passport.value}\n`;
        if (bankCard) text += `Банк. карта РФ: ${bankCard.value}\n`;
        text += `Роль: ${role}\n`;

        if (role === 'Художник скинов') {
            const skills = document.getElementById('teamSkinSkills').value.trim();
            if (skills) text += `\nНавыки:\n${skills}\n`;
        } else if (role === '3D моделлер') {
            const skills = document.getElementById('team3DSkills').value.trim();
            if (skills) text += `\nНавыки:\n${skills}\n`;
        } else if (role === 'Монтажер') {
            const skills = document.getElementById('teamMontageSkills').value.trim();
            if (skills) text += `\nНавыки:\n${skills}\n`;
        } else if (role === 'Строитель') {
            const skills = document.getElementById('teamBuilderSkills').value.trim();
            if (skills) text += `\nНавыки:\n${skills}\n`;
        }

        text += `\nYouTube канал: ${channel}\n`;
        text += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        text += `Отправлено через сайт TStudios`;
        return text;
    }

    function validateTeamForm() {
        const name = document.getElementById('teamName').value.trim();
        const age = parseInt(document.getElementById('teamAge').value);
        const adequacy = parseInt(document.getElementById('teamAdequacy').value);
        const literacy = parseInt(document.getElementById('teamLiteracy').value);
        const role = document.getElementById('teamRole').value;
        const channel = document.getElementById('teamChannel').value.trim();
        const passport = document.querySelector('input[name="teamPassport"]:checked');
        const bankCard = document.querySelector('input[name="teamBankCard"]:checked');

        if (!name) { showToast('Укажи имя', 'error'); return false; }
        if (!age || age < 14) { showToast('Возраст должен быть от 14 лет', 'error'); return false; }
        if (!adequacy || adequacy < 5) { showToast('Адекватность не ниже 5', 'error'); return false; }
        if (!literacy || literacy < 6) { showToast('Грамотность не ниже 6', 'error'); return false; }
        if (!passport) { showToast('Укажи наличие паспорта', 'error'); return false; }
        if (passport.value === 'Нет паспорта') { showToast('Без паспорта заявка не принимается', 'error'); return false; }
        if (!bankCard) { showToast('Укажи наличие карты РФ', 'error'); return false; }
        if (bankCard.value === 'Нет карты российского банка') { showToast('Без карты российского банка заявка не принимается', 'error'); return false; }
        if (!role) { showToast('Выбери роль', 'error'); return false; }
        if (!channel) { showToast('Укажи YouTube канал', 'error'); return false; }

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
       14. ЮРИДИЧЕСКИЕ МОДАЛКИ
    ============================================================ */
    const privacyModal = document.getElementById('privacyModal');
    const privacyModalClose = document.getElementById('privacyModalClose');
    const openPrivacyModalBtn = document.getElementById('openPrivacyModal');

    const termsModal = document.getElementById('termsModal');
    const termsModalClose = document.getElementById('termsModalClose');
    const openTermsModalBtn = document.getElementById('openTermsModal');

    function openLegalModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        const content = modal.querySelector('.legal-modal-content');
        if (content) content.scrollTop = 0;
    }

    function closeLegalModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        if (!teamModal.classList.contains('active')) {
            document.body.classList.remove('modal-open');
        }
    }

    if (openPrivacyModalBtn) openPrivacyModalBtn.addEventListener('click', () => openLegalModal(privacyModal));
    if (privacyModalClose) privacyModalClose.addEventListener('click', () => closeLegalModal(privacyModal));
    if (privacyModal) {
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) closeLegalModal(privacyModal);
        });
    }

    if (openTermsModalBtn) openTermsModalBtn.addEventListener('click', () => openLegalModal(termsModal));
    if (termsModalClose) termsModalClose.addEventListener('click', () => closeLegalModal(termsModal));
    if (termsModal) {
        termsModal.addEventListener('click', (e) => {
            if (e.target === termsModal) closeLegalModal(termsModal);
        });
    }

    /* ============================================================
       15. ESCAPE
    ============================================================ */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox && lightbox.classList.contains('active')) closeLightbox();
            else if (teamModal && teamModal.classList.contains('active')) closeTeamModal();
            else if (privacyModal && privacyModal.classList.contains('active')) closeLegalModal(privacyModal);
            else if (termsModal && termsModal.classList.contains('active')) closeLegalModal(termsModal);
        }
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });

});