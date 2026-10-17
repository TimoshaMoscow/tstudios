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
        hamburger.addEventListener('click', () => nav.classList.toggle('open'));
        nav.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', () => nav.classList.remove('open'))
        );
    }

    /* ============================================================
       2. СКРОЛЛ ХЕДЕРА
    ============================================================ */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    /* ============================================================
       3. СЧЁТЧИКИ
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
       4. ПАРАЛЛАКС + ЗВЁЗДЫ
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
       5. SPOTLIGHT
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
       6. ПРОГРЕСС-БАР
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
       8. TOAST
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
                skinPrice.textContent = PRICES.skin;
                skinNote.textContent = 'Индивидуальный дизайн';
                maleBtn.classList.add('active');
                maleBtn.setAttribute('aria-pressed', 'true');
                femaleBtn.classList.remove('active');
                femaleBtn.setAttribute('aria-pressed', 'false');
                skinCard.classList.remove('female-theme');
            } else {
                skinPrice.textContent = PRICES.skinFemale;
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
       ВАЖНО: services НЕ указываем — система сама их определит
       по работам в портфолио (см. getAuthorServices)
    ============================================================ */
    const authors = [
        {
            name: 'Тимошка из Москвы',
            avatar: 'autors/tim.png',
            youtube: 'https://www.youtube.com/@Timosha_MoscowOF',
            discord: 'https://discord.com/users/1146355058880040970',
            telegram: 'https://t.me/MinecraftWithTimosha'
        }
        // Чтобы добавить нового автора — просто добавь объект сюда.
        // Услуги система определит сама по его работам в skinsData / rendersData .
    ];

    function getAuthorByName(name) {
        return authors.find(a => a.name === name) || authors[0];
    }

    /* ============================================================
       11. ДАННЫЕ ПОРТФОЛИО
    ============================================================ */
    const skinsData = [
        { name: 'Тимоша Музыка', price: 0, image: 'skins/tmusic.png', author: 'Тимошка из Москвы' },
        { name: 'beatlewind', price: 0, image: 'skins/beatlewind.png', author: 'Тимошка из Москвы' },
        { name: 'FIREFOX', price: 0, image: 'skins/firefox.png', author: 'Тимошка из Москвы' },
        { name: 'Рыцарь', price: 0, image: 'skins/knight.png', author: 'Тимошка из Москвы' },
        { name: 'Toxinator', price: 50, image: 'skins/toxinator.png', author: 'Тимошка из Москвы' },
        { name: 'арсик', price: 0, image: 'skins/zakazMAJORrender.png', author: 'Тимошка из Москвы' }
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
       ★ Определение услуг автора по его работам
       Возвращает массив сервис-ключей: ['skins', 'renders', ']
    ============================================================ */
    function getAuthorServices(authorName) {
        const services = [];
        if (skinsData.some(item => item.author === authorName)) services.push('skins');
        if (rendersData.some(item => item.author === authorName)) services.push('renders');
        return services;
    }

    // Сопоставление: ключ сервиса → название услуги в модалке
    const SERVICE_TO_KEY = {
        'Скин': 'skins',
        'Рендер': 'renders'
    };

    /* ============================================================
       12. КАРУСЕЛИ
    ============================================================ */
    const CAROUSEL_SPEED = 0.6; // px per frame

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

        card.addEventListener('click', (e) => {
            // Не открывать лайтбокс, если это было перетаскивание
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

        // Дублируем элементы 3 раза для бесконечности
        const items = [...c.data, ...c.data, ...c.data];

        items.forEach((item, i) => {
            // Для каждой копии передаём индекс из оригинального массива
            const originalIndex = i % c.data.length;
            const card = createCarouselCard(item, originalIndex, key);
            c.track.appendChild(card);
        });

        // Стартовый offset: одна треть (начало второй копии)
        requestAnimationFrame(() => {
            const singleSetWidth = c.track.scrollWidth / 3;
            c.offset = c.direction === 'left' ? 0 : singleSetWidth;
        });

        // Пауза при наведении
        c.viewport.addEventListener('mouseenter', () => { c.paused = true; });
        c.viewport.addEventListener('mouseleave', () => { c.paused = false; });

        // Drag-скролл
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

        // Touch
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

            // Плавно возвращаем в диапазон
            if (c.offset < 0) c.offset += singleSetWidth;
            if (c.offset >= singleSetWidth * 2) c.offset -= singleSetWidth;

            c.track.style.transform = `translate3d(${-c.offset}px, 0, 0)`;
        });
        requestAnimationFrame(animateCarousels);
    }

    // Кнопки-стрелки
    document.querySelectorAll('.carousel-arrow').forEach(btn => {
        btn.addEventListener('click', function () {
            const key = this.dataset.carousel;
            const dir = parseInt(this.dataset.dir);
            const c = carousels[key];
            if (!c) return;
            c.offset -= dir * 260;
        });
    });

    initCarousel('skins');
    initCarousel('renders');
    requestAnimationFrame(animateCarousels);

    /* ============================================================
       13. LIGHTBOX
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

        // Соцсети автора
        lightboxAuthorSocials.innerHTML = '';
        if (author.youtube) {
            lightboxAuthorSocials.innerHTML += `<a href="${author.youtube}" target="_blank" rel="noopener" class="yt"><i class="fab fa-youtube"></i> YouTube</a>`;
        }
        if (author.discord) {
            lightboxAuthorSocials.innerHTML += `<a href="${author.discord}" target="_blank" rel="noopener" class="ds"><i class="fab fa-discord"></i> Discord</a>`;
        }
        if (author.telegram) {
            lightboxAuthorSocials.innerHTML += `<a href="${author.telegram}" target="_blank" rel="noopener" class="tg"><i class="fab fa-telegram"></i> Telegram</a>`;
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
            // Автоматически подставляем автора этой работы как исполнителя
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
       14. ПОДЕЛИТЬСЯ
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
       15. FAQ
    ============================================================ */
    const faqData = [
        {
            q: 'Сколько ждать заказ?',
            a: 'Скин — 1-2 дня, рендер — до 24 часов. Есть срочный режим (×1.5 от цены, срок ~12 часов) и экспресс (×2 от цены, срок ~4-6 часов).'
        },
        {
            q: 'Какие способы оплаты?',
            a: 'Принимаем оплату переводом. Оплата после согласования финального результата — сначала вы видите работу, потом оплачиваете.'
        },
        {
            q: 'Что если не понравится?',
            a: 'В цену входят правки (до 3-х для скинов, до 2-х для рендеров). Если результат совсем не подошёл — вернём деньги до начала правок. Мы дорожим репутацией.'
        },
        {
            q: 'Можно ли заказать срочно?',
            a: 'Да! Есть срочный режим (×1.5 от цены) и экспресс (×2 от цены). Срочные заказы берём по возможности — уточняйте в Discord.'
        },
        {
            q: 'Как заказать рендер Minecraft?',
            a: 'Нажмите «Заказать рендер» в тарифе «Рендеры» — откроется форма. Заполните детали (поза, фон, атмосфера) и отправьте заявку в Discord. Цена от 50₽.'
        },
        {
            q: 'Как заказать скин Minecraft?',
            a: 'Выберите пол скина (мужской/женский), укажите тему и цвета — мы сделаем индивидуальный дизайн. От 100₽, срок 1-2 дня.'
        }
    ];

    const faqList = document.getElementById('faqList');
    if (faqList) {
        faqData.forEach((item) => {
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
       16. ОТЗЫВЫ
    ============================================================ */
    const reviewsData = [
        { name: 'FIREFOX', rating: 5, text: 'Очень хорошее качество и очень не плохое качество рук и буква моего канала.', service: 'Скин' },
        { name: 'Beatlewind', rating: 4, text: 'Хорошо подобран стиль, но не хватает уникальности и изюминки в скине.', service: 'Скин' },
        { name: 'Тимоша Музыка', rating: 5, text: 'Классный Скин!', service: 'Скин' },
        { name: 'арсик', rating: 5, text: 'автор красава, все четко сделал:)', service: 'Скин' },
        { name: 'Vakulko', rating: 5, text: 'да круто вышло, спасибо', service: 'Рендер' }
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
       17. КАЛЬКУЛЯТОР
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
                urgencyLabel: calcState.urgencyMult === 1 ? 'Обычная'
                    : calcState.urgencyMult === 1.5 ? 'Быстро (×1.5)'
                    : 'Экспресс (×2)',
                genderExtra: calcState.genderExtra
            });
        });
    }

    /* ============================================================
       18. МОДАЛКА ЗАКАЗА
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
        urgencyLabel: 'Обычная',
        executorName: null,
        executorDiscord: null
    };

    const BASE_PRICES = {
        'Скин': PRICES.skin,
        'Рендер': PRICES.render
    };

    function updateOrderTotal() {
        if (!orderTotal) return;
        let total = (orderState.basePrice + orderState.genderExtra + orderState.revisions * orderState.revisionsPrice) * orderState.urgencyMult;
        total = Math.round(total);
        orderTotal.textContent = `${total} ₽`;
        return total;
    }

    /* Заполнить селект исполнителей для конкретной услуги */
    function populateExecutors(service, prefillName) {
        if (!orderExecutor) return;

        const serviceKey = SERVICE_TO_KEY[service];
        orderExecutor.innerHTML = '<option value="">— Выберите исполнителя —</option>';

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

        // Если был prefill (например, из lightbox) — выбрать его
        if (prefillName) {
            const exists = Array.from(orderExecutor.options).some(o => o.value === prefillName);
            if (exists) orderExecutor.value = prefillName;
        }

        // Подсказка
        if (executorNote) {
            if (count === 0) {
                executorNote.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i> <span>Пока нет исполнителей по этой услуге</span>';
            } else {
                executorNote.innerHTML = '<i class="fas fa-info-circle"></i> <span>Показаны только те мастера, которые выполняют выбранный тип услуги.</span>';
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
            genderHintText.innerHTML = '<strong>Кнопка заблокирована.</strong> Вы выбрали <strong>мужской скин</strong>, но в описании есть женские детали. Переключите пол на <strong>«Женский»</strong> (' + PRICES.skinFemale + ' ₽) или уберите женские детали.';
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
            genderHintText.innerHTML = '<strong>Внимание!</strong> Вы выбрали <strong>женский скин</strong>, но в описании есть мужские детали. Проверьте, пожалуйста, пол.';
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

    document.querySelectorAll('input[name="skinGender"]').forEach(radio => {
        radio.addEventListener('change', function () {
            if (currentService === 'Скин') {
                orderState.genderExtra = this.value === 'Женский' ? 50 : 0;
                updateOrderTotal();
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

    document.querySelectorAll('.btn-pricing').forEach(btn => {
        btn.addEventListener('click', function () {
            const service = this.getAttribute('data-service') || 'Скин';
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

        if (service === 'Скин') fieldsSkin.hidden = false;
        else if (service === 'Рендер') fieldsRender.hidden = false;

        orderState.basePrice = BASE_PRICES[service] || PRICES.skin;
        orderState.genderExtra = prefill.genderExtra || 0;
        orderState.revisions = prefill.revisions || 0;
        orderState.urgencyMult = prefill.urgencyMult || 1;
        orderState.urgencyLabel = prefill.urgencyLabel || 'Обычная';
        orderState.executorName = null;
        orderState.executorDiscord = null;

        orderForm.reset();
        descCounter.textContent = '0 / 500';
        extraCounter.textContent = '0 / 300';

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

        // Заполняем исполнителей для этой услуги
        populateExecutors(service, prefill.prefillExecutor);

        // Если prefill по имени есть — проставим и state
        if (prefill.prefillExecutor && orderExecutor.value === prefill.prefillExecutor) {
            const author = getAuthorByName(prefill.prefillExecutor);
            orderState.executorName = author.name;
            orderState.executorDiscord = author.discord;
        }

        if (service === 'Скин' && orderState.genderExtra === 50) {
            const femaleRadio = document.querySelector('input[name="skinGender"][value="Женский"]');
            if (femaleRadio) femaleRadio.checked = true;
        }

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
            showToast('Укажите имя или ник', 'error');
            document.getElementById('orderName').focus();
            return false;
        }
        if (!orderExecutor.value) {
            showToast('Выберите исполнителя', 'error');
            orderExecutor.focus();
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
        }
        return true;
    }

    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (submitOrderBtn && submitOrderBtn.disabled) return;
            if (!validateForm()) return;

            // Ссылка на Discord исполнителя
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
       19. МОДАЛКА ЗАЯВКИ В КОМАНДУ
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
            }, 300);
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

        if (!name) { showToast('Укажите имя', 'error'); return false; }
        if (!age || age < 14) { showToast('Возраст должен быть от 14 лет', 'error'); return false; }
        if (!adequacy || adequacy < 5) { showToast('Адекватность должна быть не ниже 5', 'error'); return false; }
        if (!literacy || literacy < 6) { showToast('Грамотность должна быть не ниже 6', 'error'); return false; }
        if (!passport) { showToast('Укажите наличие паспорта', 'error'); return false; }
        if (passport.value === 'Нет паспорта') { showToast('Без паспорта заявка не принимается', 'error'); return false; }
        if (!bankCard) { showToast('Укажите наличие карты РФ', 'error'); return false; }
        if (bankCard.value === 'Нет карты российского банка') { showToast('Без карты российского банка заявка не принимается', 'error'); return false; }
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
       20. ЮРИДИЧЕСКИЕ МОДАЛКИ
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
       21. ESCAPE
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

    /* ============================================================
       22. ИНИЦИАЛИЗАЦИЯ
    ============================================================ */
    // Осталось только переопределить openModal — уже сделано

});