// === Бургер-меню ===
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.main-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('open');
        });
        // Закрываем при клике на ссылку
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => nav.classList.remove('open'));
        });
    }

    // === Слайдер отзывов ===
    const reviews = document.querySelectorAll('.review-card');
    let currentReview = 0;
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');

    function showReview(index) {
        reviews.forEach((el, i) => {
            el.classList.toggle('active', i === index);
        });
    }

    if (prevBtn && nextBtn && reviews.length) {
        prevBtn.addEventListener('click', () => {
            currentReview = (currentReview - 1 + reviews.length) % reviews.length;
            showReview(currentReview);
        });
        nextBtn.addEventListener('click', () => {
            currentReview = (currentReview + 1) % reviews.length;
            showReview(currentReview);
        });
    }

    // === Автопрокрутка отзывов (каждые 7 сек) ===
    if (reviews.length > 1) {
        setInterval(() => {
            currentReview = (currentReview + 1) % reviews.length;
            showReview(currentReview);
        }, 7000);
    }

    // === Плавный скролл для якорей ===
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

    // === Переключатель пола для скинов (внутри карточки) ===
    const maleBtn = document.getElementById('maleBtn');
    const femaleBtn = document.getElementById('femaleBtn');
    const skinPrice = document.getElementById('skinPrice');
    const skinNote = document.getElementById('skinNote');

    if (maleBtn && femaleBtn && skinPrice && skinNote) {
        function updateSkinPrice(gender) {
            if (gender === 'male') {
                skinPrice.textContent = '99';
                skinNote.textContent = 'Индивидуальный дизайн';
                maleBtn.classList.add('active');
                femaleBtn.classList.remove('active');
            } else {
                skinPrice.textContent = '149';
                skinNote.textContent = 'С учётом женских особенностей';
                femaleBtn.classList.add('active');
                maleBtn.classList.remove('active');
            }
        }

        maleBtn.addEventListener('click', function() {
            updateSkinPrice('male');
        });

        femaleBtn.addEventListener('click', function() {
            updateSkinPrice('female');
        });
    }

    // === Пагинация галереи скинов ===
    // Данные скинов (массив объектов)
    const skinData = [
        { name: 'FIREFOX', price: '0 ₽', image: 'skins/firefox.png' },
        { name: 'Тимоша Музыка', price: '0 ₽', image: 'skins/tmusic.png' },
        { name: 'beatlewind', price: '0 ₽', image: 'skins/beatlewind.png' },
        { name: 'Toxinator', price: '50 ₽', image: 'skins/toxinator.png' }
    ];

    const itemsPerPage = 4;
    let currentPage = 0;
    const galleryGrid = document.getElementById('galleryGrid');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginationDots = document.getElementById('paginationDots');

    // Функция для рендеринга карточек на текущей странице
    function renderGallery(page) {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = skinData.slice(start, end);

        // Очищаем сетку
        galleryGrid.innerHTML = '';

        // Добавляем карточки
        pageItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'gallery-item glass';
            card.setAttribute('data-price', item.price.replace(' ₽', ''));
            card.innerHTML = `
                <img src="${item.image}" alt="Скин ${item.name}">
                <div class="gallery-info">
                    <h4>${item.name}</h4>
                    <span class="price">${item.price}</span>
                </div>
            `;
            galleryGrid.appendChild(card);
        });

        // Обновляем состояние кнопок
        prevPageBtn.disabled = page === 0;
        nextPageBtn.disabled = end >= skinData.length;

        // Обновляем точки пагинации
        updateDots(page);
    }

    // Функция для обновления точек пагинации
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
                // Прокручиваем к галерее
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            paginationDots.appendChild(dot);
        }
    }

    // Обработчики кнопок "Назад" и "Вперёд"
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

    // Инициализация галереи
    renderGallery(0);
});