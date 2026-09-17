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
                        el.textContent = current + '+';
                    }, 40);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => observer.observe(el));
    }

    // === Массив отзывов ===
    const reviewsData = [
        {
            name: 'FIREFOX',
            rating: 5,
            text: 'Очень хорошее качество и очень не плохое качество рук и буква моего канала.'
        },
        {
            name: 'Beatlewind',
            rating: 4,
            text: 'Хорошо подобран стиль, но не хватает уникальности и изюминки в скине.'
        },
        {
            name: 'Тимоша Музыка',
            rating: 5,
            text: 'Классный Скин!'
        },
        {
            name: 'арсик',
            rating: 5,
            text: 'автор красава, все четко сделал:)'
        }
    ];

    // === Рендер отзывов ===
    const reviewsSlider = document.getElementById('reviewsSlider');
    const reviewDots = document.getElementById('reviewDots');
    let currentReview = 0;

    function renderReviews() {
        reviewsSlider.innerHTML = '';
        reviewsData.forEach((review, index) => {
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            const card = document.createElement('div');
            card.className = 'review-card glass' + (index === 0 ? ' active' : '');
            card.setAttribute('itemprop', 'review');
            card.setAttribute('itemscope', '');
            card.setAttribute('itemtype', 'https://schema.org/Review');
            card.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name" itemprop="author">${review.name}</span>
                    <div class="stars" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
                        <meta itemprop="ratingValue" content="${review.rating}">
                        <meta itemprop="bestRating" content="5">
                        ${stars}
                    </div>
                </div>
                <p class="review-text" itemprop="reviewBody">"${review.text}"</p>
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
        reviewCards.forEach((el, i) => {
            el.classList.toggle('active', i === index);
        });
        dots.forEach((el, i) => {
            el.classList.toggle('active', i === index);
        });
    }

    if (reviewsSlider) {
        renderReviews();
    }

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

    // === Пагинация галереи скинов ===
    const skinData = [
        { name: 'Тимоша Музыка', price: '0 ₽', image: 'skins/tmusic.png' },
        { name: 'beatlewind', price: '0 ₽', image: 'skins/beatlewind.png' },
        { name: 'FIREFOX', price: '0 ₽', image: 'skins/firefox.png' },
        { name: 'Рыцарь', price: '0 ₽', image: 'skins/knight.png' },
        { name: 'Toxinator', price: '50 ₽', image: 'skins/toxinator.png' },
        { name: 'арсик', price: '0 ₽', image: 'skins/zakazMAJORrender.png' }
    ];

    const itemsPerPage = 4;
    let currentPage = 0;
    const galleryGrid = document.getElementById('galleryGrid');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginationDots = document.getElementById('paginationDots');

    function renderGallery(page) {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = skinData.slice(start, end);

        galleryGrid.innerHTML = '';

        pageItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'gallery-item glass';
            card.setAttribute('data-price', item.price.replace(' ₽', ''));
            card.innerHTML = `
                <img src="${item.image}" alt="Скин ${item.name} — пример рендера Minecraft" loading="lazy">
                <div class="gallery-info">
                    <h4>${item.name}</h4>
                    <span class="price">${item.price}</span>
                </div>
                <p class="render-note">Также является примером рендера</p>
            `;
            galleryGrid.appendChild(card);
        });

        prevPageBtn.disabled = page === 0;
        nextPageBtn.disabled = end >= skinData.length;

        updateDots(page);
    }

    function updateDots(activeIndex) {
        const totalPages = Math.ceil(skinData.length / itemsPerPage);
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
                renderGallery(currentPage);
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            paginationDots.appendChild(dot);
        }
    }

    if (prevPageBtn && nextPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 0) {
                currentPage--;
                renderGallery(currentPage);
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        nextPageBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(skinData.length / itemsPerPage);
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderGallery(currentPage);
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    renderGallery(0);

    // === МОДАЛЬНОЕ ОКНО ЗАКАЗА ===
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

    // Группы полей услуг
    const fieldsSkin = document.getElementById('fieldsSkin');
    const fieldsRender = document.getElementById('fieldsRender');
    const fieldsClip = document.getElementById('fieldsClip');

    let currentService = 'Скин';

    // Открытие модального окна
    document.querySelectorAll('.btn-pricing').forEach(btn => {
        btn.addEventListener('click', function() {
            currentService = this.getAttribute('data-service') || 'Скин';
            openModal(currentService);
        });
    });

    function openModal(service) {
        currentService = service;
        modalServiceName.textContent = `Услуга: ${service}`;

        // Скрываем все группы полей
        fieldsSkin.hidden = true;
        fieldsRender.hidden = true;
        fieldsClip.hidden = true;

        // Показываем нужную группу
        if (service === 'Скин') {
            fieldsSkin.hidden = false;
        } else if (service === 'Рендер') {
            fieldsRender.hidden = false;
        } else if (service === 'Клип') {
            fieldsClip.hidden = false;
        }

        // Сброс формы
        orderForm.reset();
        descCounter.textContent = '0 / 500';
        extraCounter.textContent = '0 / 300';
        modalStepForm.hidden = false;
        modalStepResult.hidden = true;

        // Показываем модалку
        orderModal.classList.add('active');
        orderModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        // Фокус на первое поле
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

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (cancelOrder) {
        cancelOrder.addEventListener('click', closeModal);
    }
    if (orderModal) {
        orderModal.addEventListener('click', function(e) {
            if (e.target === orderModal) closeModal();
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && orderModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Счётчики символов
    const orderDesc = document.getElementById('orderDesc');
    const orderExtra = document.getElementById('orderExtra');

    if (orderDesc) {
        orderDesc.addEventListener('input', function() {
            descCounter.textContent = `${this.value.length} / 500`;
        });
    }
    if (orderExtra) {
        orderExtra.addEventListener('input', function() {
            extraCounter.textContent = `${this.value.length} / 300`;
        });
    }

    // === Генерация текста обращения ===
    function generateOrderText() {
        const name = document.getElementById('orderName').value.trim();
        const desc = orderDesc.value.trim();
        const extra = orderExtra.value.trim();

        let text = '';
        text += `🎨 Заказ в TStudios\n`;
        text += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        text += `📌 Услуга: ${currentService}\n`;
        text += `👤 Имя: ${name}\n`;

        // Уникальные поля для каждой услуги
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

    // === Валидация ===
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

        // Проверка уникальных полей
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

    // Отправка формы
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!validateForm()) return;

            resultText.value = generateOrderText();

            modalStepForm.hidden = true;
            modalStepResult.hidden = false;
        });
    }

    // Копирование текста
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

    // Кнопка "Изменить" — назад к форме
    if (backToForm) {
        backToForm.addEventListener('click', function() {
            modalStepForm.hidden = false;
            modalStepResult.hidden = true;
        });
    }
});