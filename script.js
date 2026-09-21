// === Бургер-меню ===
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.main-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('open');
        });
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => nav.classList.remove('open'));
        });
    }

    // === Эффект скролла хедера ===
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // === Анимированные счётчики ===
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

    // === Массив отзывов ===
    const reviewsData = [
        { name: 'FIREFOX', rating: 5, text: 'Очень хорошее качество и очень не плохое качество рук и буква моего канала.' },
        { name: 'Beatlewind', rating: 4, text: 'Хорошо подобран стиль, но не хватает уникальности и изюминки в скине.' },
        { name: 'Тимоша Музыка', rating: 5, text: 'Классный Скин!' },
        { name: 'арсик', rating: 5, text: 'автор красава, все четко сделал:)' }
    ];

    const reviewsSlider = document.getElementById('reviewsSlider');
    const reviewDots = document.getElementById('reviewDots');
    let currentReview = 0;

    function renderReviews() {
        reviewsSlider.innerHTML = '';
        reviewsData.forEach((review, index) => {
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            const card = document.createElement('div');
            card.className = 'review-card glass' + (index === 0 ? ' active' : '');
            card.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
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

    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');

    if (prevBtn && nextBtn && reviewsData.length) {
        prevBtn.addEventListener('click', () => {
            currentReview = (currentReview - 1 + reviewsData.length) % reviewsData.length;
            showReview(currentReview);
        });
        nextBtn.addEventListener('click', () => {
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

    // === Плавный скролл ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // === Переключатель пола + розовая тема ===
    const maleBtn = document.getElementById('maleBtn');
    const femaleBtn = document.getElementById('femaleBtn');
    const skinPrice = document.getElementById('skinPrice');
    const skinNote = document.getElementById('skinNote');
    const skinCard = document.getElementById('skinCard');

    if (maleBtn && femaleBtn && skinPrice && skinNote && skinCard) {
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

    // ============================================================
    // === ПОРТФОЛИО: скины + превью, фильтр по автору и типу ===
    // ============================================================

    // --- ДАННЫЕ ---
    // Скины (авторы указаны для каждого элемента)
    const skinsData = [
        { name: 'Тимоша Музыка', price: '0 ₽', image: 'skins/tmusic.png', author: 'Тимошка из Москвы' },
        { name: 'beatlewind', price: '0 ₽', image: 'skins/beatlewind.png', author: 'Тимошка из Москвы' },
        { name: 'FIREFOX', price: '0 ₽', image: 'skins/firefox.png', author: 'Тимошка из Москвы' },
        { name: 'Рыцарь', price: '0 ₽', image: 'skins/knight.png', author: 'Тимошка из Москвы' },
        { name: 'Toxinator', price: '50 ₽', image: 'skins/toxinator.png', author: 'Тимошка из Москвы' },
        { name: 'арсик', price: '0 ₽', image: 'skins/zakazMAJORrender.png', author: 'Тимошка из Москвы' }
    ];

    // Превью (пока что все от Тимошки)
    const previewsData = [
        { name: 'Мусор дроп', price: '0 ₽', image: 'previews/upgrader.png', author: 'Тимошка из Москвы' },
        { name: 'Marlow не читер', price: '0 ₽', image: 'previews/marlow.png', author: 'Тимошка из Москвы' },
        { name: 'Лесорубы', price: '0 ₽', image: 'previews/lecoruby.png', author: 'Тимошка из Москвы' },
        { name: 'Шахтеры', price: '0 ₽', image: 'previews/miners.png', author: 'Тимошка из Москвы' },
        { name: 'Майнкрафт без прыжка', price: '0 ₽', image: 'previews/nojump.png', author: 'Тимошка из Москвы' }
    ];

    // --- СОСТОЯНИЕ ---
    let currentAuthor = 'Тимошка из Москвы';
    let currentType = 'skins';
    const itemsPerPage = 4;
    let currentPage = 0;

    const galleryGrid = document.getElementById('galleryGrid');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginationDots = document.getElementById('paginationDots');
    const authorTabs = document.getElementById('authorTabs');
    const authorNote = document.getElementById('authorNote');
    const typeTabs = document.querySelectorAll('.type-tab');

    // Собираем всех уникальных авторов
    function getAllAuthors() {
        const all = [...skinsData, ...previewsData].map(i => i.author);
        return [...new Set(all)];
    }

    // Инициализация вкладок авторов
    function initAuthorTabs() {
        const authors = getAllAuthors();

        // Если автор только один — блокируем переключатель и показываем заметку
        if (authors.length <= 1) {
            authorTabs.querySelectorAll('.author-tab').forEach(btn => {
                btn.disabled = true;
                btn.style.cursor = 'default';
            });
            if (authorNote) authorNote.hidden = false;
            return;
        }

        // Если авторов несколько — генерируем кнопки
        authorTabs.innerHTML = '';
        authors.forEach((author, index) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'author-tab' + (index === 0 ? ' active' : '');
            btn.dataset.author = author;
            btn.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
            btn.innerHTML = `<i class="fas fa-user" aria-hidden="true"></i> ${author}`;
            btn.addEventListener('click', function() {
                if (this.disabled) return;
                currentAuthor = this.dataset.author;
                currentPage = 0;
                authorTabs.querySelectorAll('.author-tab').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                renderGallery();
            });
            authorTabs.appendChild(btn);
        });
    }

    // Переключение типа работ
    typeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            currentType = this.dataset.type;
            currentPage = 0;
            typeTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            renderGallery();
        });
    });

    // Получаем список работ по фильтрам
    function getFilteredData() {
        const source = currentType === 'skins' ? skinsData : previewsData;
        return source.filter(item => item.author === currentAuthor);
    }

    // Рендер галереи
    function renderGallery() {
        const filtered = getFilteredData();
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = filtered.slice(start, end);

        galleryGrid.innerHTML = '';

        if (pageItems.length === 0) {
            galleryGrid.innerHTML = `
                <div class="gallery-empty" style="grid-column: 1/-1; text-align:center; padding: 60px 20px; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 3rem; opacity: 0.4; margin-bottom: 16px; display:block;"></i>
                    <p>Пока что здесь пусто</p>
                </div>
            `;
            if (prevPageBtn) prevPageBtn.disabled = true;
            if (nextPageBtn) nextPageBtn.disabled = true;
            updateDots(0, 0);
            return;
        }

        pageItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'gallery-item glass' + (currentType === 'previews' ? ' preview-item' : '');

            // Сноска только для скинов
            const renderNote = currentType === 'skins'
                ? '<p class="render-note">Также является примером рендера</p>'
                : '';

            card.innerHTML = `
                <img src="${item.image}" alt="${currentType === 'skins' ? 'Скин' : 'Превью'} ${item.name}" loading="lazy">
                <div class="gallery-info">
                    <h4>${item.name}</h4>
                    <span class="price">${item.price}</span>
                </div>
                ${renderNote}
                <p class="gallery-author">
                    <i class="fas fa-user" aria-hidden="true"></i> Автор: ${item.author}
                </p>
            `;
            galleryGrid.appendChild(card);
        });

        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (prevPageBtn) prevPageBtn.disabled = currentPage === 0;
        if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages - 1;

        updateDots(currentPage, totalPages);
    }

    // Обновление точек пагинации
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
            dot.addEventListener('click', function() {
                currentPage = parseInt(this.getAttribute('data-page'));
                renderGallery();
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            paginationDots.appendChild(dot);
        }
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 0) {
                currentPage--;
                renderGallery();
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            const filtered = getFilteredData();
            const totalPages = Math.ceil(filtered.length / itemsPerPage);
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderGallery();
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Инициализация портфолио
    initAuthorTabs();
    renderGallery();

    // ============================================================
    // === МОДАЛЬНОЕ ОКНО ЗАКАЗА ===
    // ============================================================

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

    const genderHint = document.getElementById('genderHint');
    const genderHintText = document.getElementById('genderHintText');

    const orderDesc = document.getElementById('orderDesc');
    const orderExtra = document.getElementById('orderExtra');
    const submitOrderBtn = document.getElementById('submitOrder');

    let currentService = 'Скин';

    const FEMALE_TRIGGERS = [
        'женск', 'женщин', 'девушк', 'девочк', 'девчон', 'леди', 'дама',
        'female', 'girl', 'woman', 'lady',
        'платье', 'юбка', 'юбк', 'бант', 'косичк', 'макияж', 'губ',
        'туфли', 'каблук', 'сумочк', 'маникюр', 'прическ',
        'она ', ' её ', ' её', ' неё ', 'неё'
    ];

    const MALE_TRIGGERS = [
        'мужск', 'мужчин', 'мужик', 'парн', 'парен', 'мальчик', 'пацан',
        'male', 'boy', 'man',
        'борода', 'усы', 'бород', 'качок', 'мускул', 'качалк',
        'он ', ' его ', ' ему ', ' ним ', ' нём ', 'нем ',
        'шорты', 'штаны мужск'
    ];

    function hasFemaleTriggers(text) {
        const lower = text.toLowerCase();
        return FEMALE_TRIGGERS.some(trigger => lower.includes(trigger));
    }

    function hasMaleTriggers(text) {
        const lower = text.toLowerCase();
        return MALE_TRIGGERS.some(trigger => lower.includes(trigger));
    }

    function isMaleSkinSelected() {
        if (currentService !== 'Скин') return false;
        const gender = document.querySelector('input[name="skinGender"]:checked');
        return gender && gender.value === 'Мужской';
    }

    function isFemaleSkinSelected() {
        if (currentService !== 'Скин') return false;
        const gender = document.querySelector('input[name="skinGender"]:checked');
        return gender && gender.value === 'Женский';
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
            genderHint.style.background = '';
            genderHint.style.borderColor = '';
            genderHint.style.color = '';
            genderHintText.innerHTML = '🚫 <strong>Кнопка заблокирована.</strong> Вы выбрали <strong>мужской скин</strong>, но в описании есть женские детали. Пожалуйста, переключите пол на <strong>«Женский»</strong> (149 ₽) или уберите женские детали.';
            if (orderDesc) orderDesc.classList.add('conflict');
            if (submitOrderBtn) {
                submitOrderBtn.disabled = true;
                submitOrderBtn.classList.add('disabled');
                submitOrderBtn.setAttribute('title', 'Уберите женские детали или переключите пол на «Женский»');
            }
            return;
        }

        if (femaleSelected && hasMale) {
            genderHint.hidden = false;
            genderHint.classList.remove('danger');
            genderHint.style.background = 'rgba(255, 193, 7, 0.1)';
            genderHint.style.borderColor = 'rgba(255, 193, 7, 0.4)';
            genderHint.style.color = 'var(--warning)';
            genderHintText.innerHTML = '⚠️ <strong>Внимание!</strong> Вы выбрали <strong>женский скин</strong>, но в описании есть мужские детали. Проверьте, пожалуйста, правильно ли выбран пол.';
            if (orderDesc) orderDesc.classList.remove('conflict');
            if (submitOrderBtn) {
                submitOrderBtn.disabled = false;
                submitOrderBtn.classList.remove('disabled');
                submitOrderBtn.removeAttribute('title');
            }
            return;
        }

        if (maleSelected && desc.length > 10 && !hasFemale) {
            genderHint.hidden = false;
            genderHint.classList.remove('danger');
            genderHint.style.background = '';
            genderHint.style.borderColor = '';
            genderHint.style.color = '';
            genderHintText.innerHTML = 'Если хотите дизайн с женскими особенностями — переключите пол на <strong>«Женский»</strong> (149 ₽).';
            if (orderDesc) orderDesc.classList.remove('conflict');
            if (submitOrderBtn) {
                submitOrderBtn.disabled = false;
                submitOrderBtn.classList.remove('disabled');
                submitOrderBtn.removeAttribute('title');
            }
            return;
        }

        genderHint.hidden = true;
        if (orderDesc) orderDesc.classList.remove('conflict');
        if (submitOrderBtn) {
            submitOrderBtn.disabled = false;
            submitOrderBtn.classList.remove('disabled');
            submitOrderBtn.removeAttribute('title');
        }
    }

    if (orderDesc) {
        orderDesc.addEventListener('input', function() {
            descCounter.textContent = `${this.value.length} / 500`;
            updateGenderHint();
        });
    }

    if (orderExtra) {
        orderExtra.addEventListener('input', function() {
            extraCounter.textContent = `${this.value.length} / 300`;
            updateGenderHint();
        });
    }

    document.querySelectorAll('input[name="skinGender"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (genderHint) {
                genderHint.style.background = '';
                genderHint.style.borderColor = '';
                genderHint.style.color = '';
            }
            updateGenderHint();
        });
    });

    document.querySelectorAll('.btn-pricing').forEach(btn => {
        btn.addEventListener('click', function() {
            currentService = this.getAttribute('data-service') || 'Скин';
            openModal(currentService);
        });
    });

    function openModal(service) {
        currentService = service;
        modalServiceName.textContent = `Услуга: ${service}`;

        fieldsSkin.hidden = true;
        fieldsRender.hidden = true;
        fieldsPreview.hidden = true;
        fieldsClip.hidden = true;

        if (service === 'Скин') {
            fieldsSkin.hidden = false;
        } else if (service === 'Рендер') {
            fieldsRender.hidden = false;
        } else if (service === 'Превью') {
            fieldsPreview.hidden = false;
        } else if (service === 'Клип') {
            fieldsClip.hidden = false;
        }

        orderForm.reset();
        descCounter.textContent = '0 / 500';
        extraCounter.textContent = '0 / 300';
        modalStepForm.hidden = false;
        modalStepResult.hidden = true;

        if (genderHint) {
            genderHint.hidden = true;
            genderHint.classList.remove('danger');
            genderHint.style.background = '';
            genderHint.style.borderColor = '';
            genderHint.style.color = '';
        }
        if (orderDesc) orderDesc.classList.remove('conflict');

        if (submitOrderBtn) {
            submitOrderBtn.disabled = false;
            submitOrderBtn.classList.remove('disabled');
            submitOrderBtn.removeAttribute('title');
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
        document.body.classList.remove('modal-open');
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (cancelOrder) cancelOrder.addEventListener('click', closeModal);
    if (orderModal) {
        orderModal.addEventListener('click', function(e) {
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
            const refs = document.getElementById('clipRefs').value.trim();
            const extrasChecked = Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(c => c.value);

            if (genre) text += `🎵 Жанр: ${genre}\n`;
            if (duration) text += `⏱️ Длительность: ${duration}\n`;
            if (track) text += `🎧 Трек: ${track}\n`;
            if (refs) text += `🔗 Референсы: ${refs}\n`;
            if (extrasChecked.length) text += `➕ Доп. услуги: ${extrasChecked.join(', ')}\n`;
        }

        text += `\n📝 Описание:\n${desc}\n`;

        if (extra) {
            text += `\n💬 Дополнительно:\n${extra}\n`;
        }

        text += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        text += `✅ Отправлено через сайт TStudios`;

        return text;
    }

    function validateForm() {
        const name = document.getElementById('orderName').value.trim();
        const desc = orderDesc.value.trim();

        if (!name) {
            alert('Пожалуйста, укажите ваше имя или никнейм.');
            document.getElementById('orderName').focus();
            return false;
        }
        if (!desc) {
            alert('Пожалуйста, заполните подробное описание заказа.');
            orderDesc.focus();
            return false;
        }

        if (currentService === 'Скин') {
            const theme = document.getElementById('skinTheme').value.trim();
            if (!theme) {
                alert('Пожалуйста, укажите тему или стиль скина.');
                document.getElementById('skinTheme').focus();
                return false;
            }
        } else if (currentService === 'Рендер') {
            const pose = document.getElementById('renderPose').value;
            if (!pose) {
                alert('Пожалуйста, выберите позу или ракурс для рендера.');
                document.getElementById('renderPose').focus();
                return false;
            }
        } else if (currentService === 'Превью') {
            const title = document.getElementById('previewTitle').value.trim();
            if (!title) {
                alert('Пожалуйста, укажите тему или название видео.');
                document.getElementById('previewTitle').focus();
                return false;
            }
        } else if (currentService === 'Клип') {
            const genre = document.getElementById('clipGenre').value;
            const duration = document.getElementById('clipDuration').value;
            if (!genre) {
                alert('Пожалуйста, выберите жанр музыки.');
                document.getElementById('clipGenre').focus();
                return false;
            }
            if (!duration) {
                alert('Пожалуйста, выберите длительность клипа.');
                document.getElementById('clipDuration').focus();
                return false;
            }
        }

        return true;
    }

    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (submitOrderBtn && submitOrderBtn.disabled) return;
            if (!validateForm()) return;

            resultText.value = generateOrderText();
            modalStepForm.hidden = true;
            modalStepResult.hidden = false;
        });
    }

    if (copyBtn && resultText) {
        copyBtn.addEventListener('click', function() {
            resultText.select();
            resultText.setSelectionRange(0, 99999);

            navigator.clipboard.writeText(resultText.value).then(() => {
                copyBtn.classList.add('copied');
                const span = copyBtn.querySelector('span');
                const originalText = span ? span.textContent : '';
                if (span) span.textContent = 'Скопировано!';

                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    if (span) span.textContent = originalText;
                }, 2000);
            }).catch(() => {
                document.execCommand('copy');
                copyBtn.classList.add('copied');
                const span = copyBtn.querySelector('span');
                if (span) span.textContent = 'Скопировано!';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    if (span) span.textContent = 'Скопировать';
                }, 2000);
            });
        });
    }

    if (backToForm) {
        backToForm.addEventListener('click', function() {
            modalStepForm.hidden = false;
            modalStepResult.hidden = true;
        });
    }

    // ============================================================
    // === МОДАЛЬНОЕ ОКНО ЗАЯВКИ В КОМАНДУ ===
    // ============================================================

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
        if (teamFieldsSkin) teamFieldsSkin.hidden = true;
        if (teamFields3D) teamFields3D.hidden = true;
        if (teamFieldsMontage) teamFieldsMontage.hidden = true;
        if (teamFieldsPreview) teamFieldsPreview.hidden = true;
        if (teamFieldsBuilder) teamFieldsBuilder.hidden = true;
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
        teamRoleSelect.addEventListener('change', function() {
            showTeamFieldByRole(this.value);
        });
    }

    if (openTeamModalBtn) {
        openTeamModalBtn.addEventListener('click', function() {
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
        document.body.classList.remove('modal-open');
    }

    if (teamModalClose) teamModalClose.addEventListener('click', closeTeamModal);
    if (teamCancel) teamCancel.addEventListener('click', closeTeamModal);
    if (teamModal) {
        teamModal.addEventListener('click', function(e) {
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
            if (skills) text += `\n🎨 Навыки (скины + Blockbench + Mine imator):\n${skills}\n`;
        } else if (role === '3D моделлер') {
            const skills = document.getElementById('team3DSkills').value.trim();
            if (skills) text += `\n🧊 Навыки (Blockbench + Mine imator):\n${skills}\n`;
        } else if (role === 'Монтажер') {
            const skills = document.getElementById('teamMontageSkills').value.trim();
            if (skills) text += `\n🎬 Навыки (Premiere Pro + CapCut):\n${skills}\n`;
        } else if (role === 'Художник превью') {
            const skills = document.getElementById('teamPreviewSkills').value.trim();
            if (skills) text += `\n🖼️ Навыки (Photoshop + Blockbench + Mine imator):\n${skills}\n`;
        } else if (role === 'Строитель') {
            const skills = document.getElementById('teamBuilderSkills').value.trim();
            if (skills) text += `\n🏗️ Навыки (Axiom + World Edit):\n${skills}\n`;
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

        if (!name) {
            alert('Пожалуйста, укажите имя или ник.');
            document.getElementById('teamName').focus();
            return false;
        }
        if (!age || age < 12) {
            alert('Возраст должен быть не менее 12 лет.');
            document.getElementById('teamAge').focus();
            return false;
        }
        if (!adequacy) {
            alert('Пожалуйста, укажите адекватность от 1 до 10.');
            document.getElementById('teamAdequacy').focus();
            return false;
        }
        if (!literacy) {
            alert('Пожалуйста, укажите грамотность от 1 до 10.');
            document.getElementById('teamLiteracy').focus();
            return false;
        }
        if (!role) {
            alert('Пожалуйста, выберите роль в команде.');
            document.getElementById('teamRole').focus();
            return false;
        }
        if (!channel) {
            alert('Пожалуйста, укажите ссылку на ваш YouTube канал.');
            document.getElementById('teamChannel').focus();
            return false;
        }

        if (role === 'Художник скинов') {
            const skills = document.getElementById('teamSkinSkills').value.trim();
            if (!skills) {
                alert('Пожалуйста, опишите свои навыки для роли «Художник скинов».');
                document.getElementById('teamSkinSkills').focus();
                return false;
            }
        } else if (role === '3D моделлер') {
            const skills = document.getElementById('team3DSkills').value.trim();
            if (!skills) {
                alert('Пожалуйста, опишите свои навыки для роли «3D моделлер».');
                document.getElementById('team3DSkills').focus();
                return false;
            }
        } else if (role === 'Монтажер') {
            const skills = document.getElementById('teamMontageSkills').value.trim();
            if (!skills) {
                alert('Пожалуйста, опишите свои навыки для роли «Монтажер».');
                document.getElementById('teamMontageSkills').focus();
                return false;
            }
        } else if (role === 'Художник превью') {
            const skills = document.getElementById('teamPreviewSkills').value.trim();
            if (!skills) {
                alert('Пожалуйста, опишите свои навыки для роли «Художник превью».');
                document.getElementById('teamPreviewSkills').focus();
                return false;
            }
        } else if (role === 'Строитель') {
            const skills = document.getElementById('teamBuilderSkills').value.trim();
            if (!skills) {
                alert('Пожалуйста, опишите свои навыки для роли «Строитель».');
                document.getElementById('teamBuilderSkills').focus();
                return false;
            }
        }

        return true;
    }

    if (teamForm) {
        teamForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validateTeamForm()) return;

            teamResultText.value = generateTeamText();
            teamStepForm.hidden = true;
            teamStepResult.hidden = false;
        });
    }

    if (teamCopyBtn && teamResultText) {
        teamCopyBtn.addEventListener('click', function() {
            teamResultText.select();
            teamResultText.setSelectionRange(0, 99999);

            navigator.clipboard.writeText(teamResultText.value).then(() => {
                teamCopyBtn.classList.add('copied');
                const span = teamCopyBtn.querySelector('span');
                const originalText = span ? span.textContent : '';
                if (span) span.textContent = 'Скопировано!';

                setTimeout(() => {
                    teamCopyBtn.classList.remove('copied');
                    if (span) span.textContent = originalText;
                }, 2000);
            }).catch(() => {
                document.execCommand('copy');
                teamCopyBtn.classList.add('copied');
                const span = teamCopyBtn.querySelector('span');
                if (span) span.textContent = 'Скопировано!';
                setTimeout(() => {
                    teamCopyBtn.classList.remove('copied');
                    if (span) span.textContent = 'Скопировать';
                }, 2000);
            });
        });
    }

    if (teamBackToForm) {
        teamBackToForm.addEventListener('click', function() {
            teamStepForm.hidden = false;
            teamStepResult.hidden = true;
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (orderModal && orderModal.classList.contains('active')) closeModal();
            if (teamModal && teamModal.classList.contains('active')) closeTeamModal();
        }
    });
});