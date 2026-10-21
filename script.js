document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       0. ГЛОБАЛЬНЫЕ ЦЕНЫ
    ============================================================ */
    const PRICES = {
        skin: 100,
        skinFemale: 150,
        render: 50,
        revision: 30
    };

    document.querySelectorAll('[data-price]').forEach(el => {
        const key = el.getAttribute('data-price');
        if (PRICES[key] !== undefined) {
            el.textContent = PRICES[key];
        }
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
       5. МАССИВ АВТОРОВ
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
       6. КЛИК ПО КАРТОЧКЕ УСЛУГИ
    ============================================================ */
    document.querySelectorAll('.service-card[data-service]').forEach(card => {
        const service = card.getAttribute('data-service');

        card.addEventListener('click', () => openModal(service, {}));

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(service, {});
            }
        });
    });

    /* ============================================================
       7. ДАННЫЕ ПОРТФОЛИО
    ============================================================ */
    const skinsData = [
        { name: 'Тимоша Музыка', price: 0, image: 'skins/tmusic.png', author: 'Тимошка из Москвы' },
        { name: 'beatlewind', price: 0, image: 'skins/beatlewind.png', author: 'Тимошка из Москвы' },
        { name: 'FIREFOX', price: 0, image: 'skins/firefox.png', author: 'Тимошка из Москвы' },
        { name: 'Рыцарь', price: 0, image: 'skins/knight.png', author: 'Тимошка из Москвы' },
        { name: 'Toxinator', price: 50, image: 'skins/toxinator.png', author: 'Тимошка из Москвы' },
        { name: 'арсик', price: 0, image: 'skins/zakazMAJORrender.png', author: 'Тимошка из Москвы' },
        { name: 'Дашка', price: 0, image: 'skins/dasha.png', author: 'Тимошка из Москвы' }
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

    function getAuthorServices(authorName) {
        const services = [];
        if (skinsData.some(item => item.author === authorName)) services.push('skins');
        if (rendersData.some(item => item.author === authorName)) services.push('renders');
        return services;
    }

    const SERVICE_TO_KEY = {
        'Скин': 'skins',
        'Рендер': 'renders'
    };

    /* ============================================================
       8. КАРУСЕЛИ
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

    const carouselDragMoved = { skins: false, renders: false };

    function initCarousel(key) {
        const c = carousels[key];
        if (!c.viewport || !c.track) return;

        c.track.innerHTML = '';

        const items = [...c.data, ...c.data, ...c.data];

        items.forEach((item, i) => {
            const originalIndex = i % c.data.length;
            const card = createCarouselCard(item, originalIndex, key);
            c.track.appendChild(card);
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
       9. LIGHTBOX
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
        if (!orderModal.classList.contains('active')
            && !teamModal.classList.contains('active')
            && (!privacyModal || !privacyModal.classList.contains('active'))
            && (!termsModal || !termsModal.classList.contains('active'))) {
            document.body.classList.remove('modal-open');
        }
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
            let service = 'Скин';
            if (lightboxCurrentType === 'renders') service = 'Рендер';
            const item = lightboxItems[lightboxIndex];
            const authorName = item ? item.author : null;

            closeLightbox();
            openModal(service, { prefillExecutor: authorName });
        });
    }

    if (lightboxShareBtn) {
        lightboxShareBtn.addEventListener('click', () => {
            const item = lightboxItems[lightboxIndex];
            if (item) shareItem(item);
        });
    }

    /* ============================================================
       10. ПОДЕЛИТЬСЯ
    ============================================================ */
    async function shareItem(item) {
        const url = window.location.origin + window.location.pathname + `#gallery`;
        const text = `${item.name} — работа в TStudios Minecraft`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'TStudios', text, url });
                return;
            } catch (err) {}
        }
        copyToClipboard(url, 'Ссылка скопирована!');
    }

    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const url = window.location.href;
            const text = 'TStudios — Скины, рендеры и многое другое по Minecraft на заказ!';
            if (navigator.share) {
                try {
                    await navigator.share({ title: 'TStudios', text, url });
                    return;
                } catch (err) {}
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
       11. FAQ — ключевые вопросы наверх
    ============================================================ */
    const faqData = [
        {
            q: 'Как оплатить?',
            a: 'Сначала показываем готовое — платишь, только если всё нравится. Переводом (СБП или карта).'
        },
        {
            q: 'Сколько ждать готовую работу?',
            a: 'Скин — 1-2 дня, рендер — до 24 часов. Нужно быстрее — есть ускорение за доплату.'
        },
        {
            q: 'А если мне не понравится?',
            a: 'Бесплатно можно попросить правки: до 3 раз для скина, до 2 для рендера. Не зашло совсем — вернём деньги, пока не начали правки. Мы дорожим репутацией.'
        },
        {
            q: 'Можно срочно?',
            a: 'Да! Есть срочный режим (×1.5 от цены) и экспресс (×2 от цены). Срочные заказы берём по возможности — уточняй в Discord.'
        },
        {
            q: 'Как заказать скин?',
            a: 'Выбери пол скина (для парня / для девушки), укажи тему и цвета — мы сделаем уникальный дизайн. От 100₽, срок 1-2 дня.'
        },
        {
            q: 'Как заказать рендер?',
            a: 'Нажми «Рендер» в разделе «Что можно заказать» — откроется форма. Заполни детали (поза, фон, атмосфера) и отправь заявку в Discord. Цена от 50₽.'
        }
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
       12. ОТЗЫВЫ
    ============================================================ */
    const reviewsData = [
        { name: 'FIREFOX', rating: 5, text: 'Очень хорошее качество и очень не плохое качество рук и буква моего канала.', service: 'Скин' },
        { name: 'Beatlewind', rating: 4, text: 'Хорошо подобран стиль, но не хватает уникальности и изюминки в скине.', service: 'Скин' },
        { name: 'Тимоша Музыка', rating: 5, text: 'Классный Скин!', service: 'Скин' },
        { name: 'арсик', rating: 5, text: 'автор красава, все четко сделал:)', service: 'Скин' },
        { name: 'Vakulko', rating: 5, text: 'да круто вышло, спасибо', service: 'Рендер' },
        { name: 'Дашка', rating: 4, text: 'хороший.', service: 'Скин' }
    ];

    const serviceIcons = {
        'Скин': 'fa-paint-brush',
        'Рендер': 'fa-cube'
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
       13. КАЛЬКУЛЯТОР
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

                    // Сбрасываем визуальный выбор пола — возвращаем «Для парня»
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
            openModal(calcState.service, {
                revisions: calcState.revisions,
                urgencyMult: calcState.urgencyMult,
                urgencyLabel: calcState.urgencyMult === 1 ? 'Стандартно'
                    : calcState.urgencyMult === 1.5 ? 'Быстрее (×1.5)'
                    : 'Срочно (×2)',
                genderExtra: calcState.genderExtra
            });
        });
    }

    /* ============================================================
       14. МОДАЛКА ЗАКАЗА
    ============================================================ */
    const orderModal = document.getElementById('orderModal');
    const modalClose = document.getElementById('modalClose');
    const modalServiceName = document.getElementById('modalServiceName');
    const modalPricing = document.getElementById('modalPricing');
    const modalPriceAmount = document.getElementById('modalPriceAmount');
    const modalPriceNote = document.getElementById('modalPriceNote');
    const modalFeatures = document.getElementById('modalFeatures');
    const modalPopularBadge = document.getElementById('modalPopularBadge');
    const modalStepForm = document.getElementById('modalStepForm');
    const modalStepResult = document.getElementById('modalStepResult');
    const orderForm = document.getElementById('orderForm');
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');
    const cancelOrder = document.getElementById('cancelOrder');
    const backToForm = document.getElementById('backToForm');
    const descCounter = document.getElementById('descCounter');
    const extraCounter = document.getElementById('extraCounter');
    const resultDiscordLink = document.getElementById('resultDiscordLink');

    const orderExecutor = document.getElementById('orderExecutor');
    const executorNote = document.getElementById('executorNote');

    const fieldsSkin = document.getElementById('fieldsSkin');
    const fieldsRender = document.getElementById('fieldsRender');
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
        basePrice: PRICES.skin,
        genderExtra: 0,
        revisions: 0,
        revisionsPrice: PRICES.revision,
        urgencyMult: 1,
        urgencyLabel: 'Стандартно',
        executorName: null,
        executorDiscord: null
    };

    const BASE_PRICES = {
        'Скин': PRICES.skin,
        'Рендер': PRICES.render
    };

    const MODAL_TARIFFS = {
        'Скин': {
            note: 'Уникальный скин под твой запрос',
            price: PRICES.skin,
            femaleNote: 'Женский скин — дороже на 50 ₽',
            femalePrice: PRICES.skinFemale,
            features: [
                { icon: 'fa-check', text: 'Только твой дизайн' },
                { icon: 'fa-check', text: '3D-рендер в подарок', gift: true },
                { icon: 'fa-check', text: 'До 3 правок бесплатно' },
                { icon: 'fa-check', text: 'Готово за 1-2 дня' }
            ]
        },
        'Рендер': {
            note: 'Цена за 1 рендер',
            price: PRICES.render,
            features: [
                { icon: 'fa-check', text: 'Рендер в HD' },
                { icon: 'fa-check', text: 'Любой фон на выбор' },
                { icon: 'fa-check', text: 'До 2 правок бесплатно' },
                { icon: 'fa-check', text: 'Готово за сутки' }
            ]
        }
    };

    function updateOrderTotal() {
        if (!orderTotal) return;
        let total = (orderState.basePrice + orderState.genderExtra + orderState.revisions * orderState.revisionsPrice) * orderState.urgencyMult;
        total = Math.round(total);
        orderTotal.textContent = `${total} ₽`;
        return total;
    }

    function populateExecutors(service, prefillName) {
        if (!orderExecutor) return;

        const serviceKey = SERVICE_TO_KEY[service];
        orderExecutor.innerHTML = '<option value="">— Выбери —</option>';

        let count = 0;
        authors.forEach(author => {
            const services = getAuthorServices(author.name);
            if (services.includes(serviceKey)) {
                const opt = document.createElement('option');
                opt.value = author.name;
                opt.textContent = author.name;
                orderExecutor.appendChild(opt);
                count++;
            }
        });

        if (prefillName) {
            const exists = Array.from(orderExecutor.options).some(o => o.value === prefillName);
            if (exists) orderExecutor.value = prefillName;
        }

        if (executorNote) {
            if (count === 0) {
                executorNote.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i> <span>Пока нет исполнителей по этой услуге</span>';
            } else {
                executorNote.innerHTML = '<i class="fas fa-info-circle"></i> <span>Здесь только те, кто делает выбранный тип работы.</span>';
            }
        }
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
            if (submitOrderBtn) submitOrderBtn.disabled = false;
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
            genderHintText.innerHTML = '<strong>Кнопка заблокирована.</strong> Ты выбрал <strong>скин для парня</strong>, но в описании есть женские детали. Переключи на <strong>«Для девушки»</strong> (' + PRICES.skinFemale + ' ₽) или убери женские детали.';
            if (orderDesc) orderDesc.classList.add('conflict');
            if (submitOrderBtn) submitOrderBtn.disabled = true;
            return;
        }

        if (femaleSelected && hasMale) {
            genderHint.hidden = false;
            genderHint.classList.remove('danger');
            genderHintText.innerHTML = '<strong>Внимание!</strong> Ты выбрал <strong>скин для девушки</strong>, но в описании есть мужские детали. Проверь, пожалуйста, пол.';
            if (orderDesc) orderDesc.classList.remove('conflict');
            if (submitOrderBtn) submitOrderBtn.disabled = false;
            return;
        }

        genderHint.hidden = true;
        if (orderDesc) orderDesc.classList.remove('conflict');
        if (submitOrderBtn) submitOrderBtn.disabled = false;
    }

    if (orderDesc) {
        orderDesc.addEventListener('input', function () {
            const len = this.value.length;
            descCounter.textContent = `${len} / 500`;
            descCounter.classList.toggle('warn', len > 400 && len <= 480);
            descCounter.classList.toggle('danger', len > 480);
            updateGenderHint();
        });
    }

    if (orderExtra) {
        orderExtra.addEventListener('input', function () {
            extraCounter.textContent = `${this.value.length} / 300`;
            updateGenderHint();
        });
    }

    document.querySelectorAll('input[name="skinGender"]').forEach(radio => {
        radio.addEventListener('change', function () {
            if (currentService === 'Скин') {
                orderState.genderExtra = this.value === 'Женский' ? 50 : 0;
                updateOrderTotal();
                renderModalTariff('Скин', orderState.genderExtra === 50);
            }
            updateGenderHint();
        });
    });

    if (orderRevisions) {
        orderRevisions.addEventListener('input', function () {
            orderState.revisions = parseInt(this.value);
            orderRevisionsValue.innerHTML = `${orderState.revisions} правок × <span data-price="revision">${PRICES.revision}</span> ₽`;
            updateOrderTotal();
        });
    }

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

    if (orderExecutor) {
        orderExecutor.addEventListener('change', function () {
            const author = getAuthorByName(this.value);
            orderState.executorName = author ? author.name : null;
            orderState.executorDiscord = author ? author.discord : null;
        });
    }

    function renderModalTariff(service, isFemale = false) {
        const tariff = MODAL_TARIFFS[service];
        if (!tariff || !modalPricing) return;

        const price = isFemale && tariff.femalePrice ? tariff.femalePrice : tariff.price;
        const note = isFemale && tariff.femaleNote ? tariff.femaleNote : tariff.note;

        if (modalPriceAmount) modalPriceAmount.textContent = price;
        if (modalPriceNote) modalPriceNote.textContent = note;

        if (modalPopularBadge) {
            modalPopularBadge.style.display = service === 'Скин' ? '' : 'none';
        }

        if (modalFeatures) {
            modalFeatures.innerHTML = tariff.features.map(f => `
                <li${f.gift ? ' class="is-gift"' : ''}>
                    <i class="fas ${f.icon}"></i>
                    <span>${f.text}</span>
                </li>
            `).join('');
        }

        modalPricing.classList.toggle('female-theme', isFemale && service === 'Скин');
    }

    function openModal(service, prefill = {}) {
        currentService = service;
        modalServiceName.textContent = `Услуга: ${service}`;

        fieldsSkin.hidden = true;
        fieldsRender.hidden = true;

        if (service === 'Скин') fieldsSkin.hidden = false;
        else if (service === 'Рендер') fieldsRender.hidden = false;

        orderState.basePrice = BASE_PRICES[service] || PRICES.skin;
        orderState.genderExtra = prefill.genderExtra || 0;
        orderState.revisions = prefill.revisions || 0;
        orderState.urgencyMult = prefill.urgencyMult || 1;
        orderState.urgencyLabel = prefill.urgencyLabel || 'Стандартно';
        orderState.executorName = null;
        orderState.executorDiscord = null;

        orderForm.reset();
        descCounter.textContent = '0 / 500';
        extraCounter.textContent = '0 / 300';
        descCounter.classList.remove('warn', 'danger');

        if (orderRevisions) {
            orderRevisions.value = orderState.revisions;
            orderRevisionsValue.innerHTML = `${orderState.revisions} правок × <span data-price="revision">${PRICES.revision}</span> ₽`;
        }

        if (orderUrgency) {
            orderUrgency.querySelectorAll('.calc-opt').forEach(b => b.classList.remove('active'));
            const target = Array.from(orderUrgency.querySelectorAll('.calc-opt'))
                .find(b => parseFloat(b.dataset.mult) === orderState.urgencyMult);
            if (target) target.classList.add('active');
        }

        populateExecutors(service, prefill.prefillExecutor);

        if (prefill.prefillExecutor && orderExecutor.value === prefill.prefillExecutor) {
            const author = getAuthorByName(prefill.prefillExecutor);
            orderState.executorName = author.name;
            orderState.executorDiscord = author.discord;
        }

        if (service === 'Скин' && orderState.genderExtra === 50) {
            const femaleRadio = document.querySelector('input[name="skinGender"][value="Женский"]');
            if (femaleRadio) femaleRadio.checked = true;
        }

        renderModalTariff(service, orderState.genderExtra === 50);
        updateOrderTotal();

        modalStepForm.hidden = false;
        modalStepResult.hidden = true;

        if (genderHint) {
            genderHint.hidden = true;
            genderHint.classList.remove('danger');
        }
        if (orderDesc) orderDesc.classList.remove('conflict');
        if (submitOrderBtn) submitOrderBtn.disabled = false;

        orderModal.classList.add('active');
        orderModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        setTimeout(() => {
            const firstInput = orderForm.querySelector('input[type="text"]');
            if (firstInput) firstInput.focus();
        }, 250);
    }

    function closeModal() {
        orderModal.classList.remove('active');
        orderModal.setAttribute('aria-hidden', 'true');
        if (!teamModal.classList.contains('active')
            && (!privacyModal || !privacyModal.classList.contains('active'))
            && (!termsModal || !termsModal.classList.contains('active'))) {
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
        text += `Заказ в TStudios\n`;
        text += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        text += `Услуга: ${currentService}\n`;
        text += `Имя: ${name}\n`;
        if (orderState.executorName) {
            text += `Исполнитель: ${orderState.executorName}\n`;
        }

        if (currentService === 'Скин') {
            const gender = document.querySelector('input[name="skinGender"]:checked');
            const theme = document.getElementById('skinTheme').value.trim();
            const colors = document.getElementById('skinColors').value.trim();
            const refs = document.getElementById('skinRefs').value.trim();
            if (gender) text += `Пол скина: ${gender.value}\n`;
            if (theme) text += `Тема / стиль: ${theme}\n`;
            if (colors) text += `Цвета: ${colors}\n`;
            if (refs) text += `Референсы: ${refs}\n`;
        } else if (currentService === 'Рендер') {
            const renderType = document.querySelector('input[name="renderType"]:checked');
            const pose = document.getElementById('renderPose').value;
            const bg = document.getElementById('renderBg').value.trim();
            const mood = document.getElementById('renderMood').value.trim();
            if (renderType) text += `Тип рендера: ${renderType.value}\n`;
            if (pose) text += `Поза / ракурс: ${pose}\n`;
            if (bg) text += `Фон: ${bg}\n`;
            if (mood) text += `Атмосфера: ${mood}\n`;
        }

        if (orderState.revisions > 0) {
            text += `Доп. правки: ${orderState.revisions} × ${orderState.revisionsPrice} ₽\n`;
        }
        text += `Срочность: ${orderState.urgencyLabel}\n`;

        const total = Math.round(
            (orderState.basePrice + orderState.genderExtra + orderState.revisions * orderState.revisionsPrice) * orderState.urgencyMult
        );
        text += `Предварительная стоимость: ${total} ₽\n`;

        text += `\nОписание:\n${desc}\n`;
        if (extra) text += `\nДополнительно:\n${extra}\n`;
        text += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        text += `Отправлено через сайт TStudios`;
        return text;
    }

    function validateForm() {
        const name = document.getElementById('orderName').value.trim();
        const desc = orderDesc.value.trim();

        if (!name) {
            showToast('Укажи имя или ник', 'error');
            document.getElementById('orderName').focus();
            return false;
        }
        if (!orderExecutor.value) {
            showToast('Выбери, кому отправить заявку', 'error');
            orderExecutor.focus();
            return false;
        }
        if (!desc) {
            showToast('Заполни описание заказа', 'error');
            orderDesc.focus();
            return false;
        }
        if (currentService === 'Скин') {
            const theme = document.getElementById('skinTheme').value.trim();
            if (!theme) {
                showToast('Укажи тему скина', 'error');
                document.getElementById('skinTheme').focus();
                return false;
            }
        } else if (currentService === 'Рендер') {
            const pose = document.getElementById('renderPose').value;
            if (!pose) {
                showToast('Выбери позу персонажа', 'error');
                document.getElementById('renderPose').focus();
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

            if (resultDiscordLink) {
                resultDiscordLink.href = orderState.executorDiscord || 'https://discord.com/users/1146355058880040970';
            }

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
       15. МОДАЛКА ЗАЯВКИ В КОМАНДУ
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
        if (!orderModal.classList.contains('active')
            && (!privacyModal || !privacyModal.classList.contains('active'))
            && (!termsModal || !termsModal.classList.contains('active'))) {
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
        if (!adequacy || adequacy < 5) { showToast('Адекватность должна быть не ниже 5', 'error'); return false; }
        if (!literacy || literacy < 6) { showToast('Грамотность должна быть не ниже 6', 'error'); return false; }
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
       16. ЮРИДИЧЕСКИЕ МОДАЛКИ
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
        if (!orderModal.classList.contains('active')
            && !teamModal.classList.contains('active')
            && (!privacyModal || !privacyModal.classList.contains('active'))
            && (!termsModal || !termsModal.classList.contains('active'))) {
            document.body.classList.remove('modal-open');
        }
    }

    if (openPrivacyModalBtn) {
        openPrivacyModalBtn.addEventListener('click', () => openLegalModal(privacyModal));
    }
    if (privacyModalClose) {
        privacyModalClose.addEventListener('click', () => closeLegalModal(privacyModal));
    }
    if (privacyModal) {
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) closeLegalModal(privacyModal);
        });
    }

    if (openTermsModalBtn) {
        openTermsModalBtn.addEventListener('click', () => openLegalModal(termsModal));
    }
    if (termsModalClose) {
        termsModalClose.addEventListener('click', () => closeLegalModal(termsModal));
    }
    if (termsModal) {
        termsModal.addEventListener('click', (e) => {
            if (e.target === termsModal) closeLegalModal(termsModal);
        });
    }

    /* ============================================================
       17. ESCAPE + СТРЕЛКИ
    ============================================================ */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox && lightbox.classList.contains('active')) closeLightbox();
            else if (orderModal && orderModal.classList.contains('active')) closeModal();
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