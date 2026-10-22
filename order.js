document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       0. ЦЕНЫ
    ============================================================ */
    const PRICES = {
        skin: 250,
        skinFemale: 300,
        render: 150,
        revision: 45
    };

    const service = document.body.dataset.service;
    const isSkin = service === 'skin';
    const isRender = service === 'render';

    const BASE_PRICES = { skin: PRICES.skin, render: PRICES.render };
    const basePrice = BASE_PRICES[service] || 0;

    const authors = [
        { name: 'Тимошка из Москвы', discord: 'https://discord.com/users/1146355058880040970' }
    ];

    /* ============================================================
       1. ПАРАМЕТРЫ URL
    ============================================================ */
    const params = new URLSearchParams(window.location.search);
    const initial = {
        executor: params.get('executor') || '',
        revisions: Math.max(0, parseInt(params.get('revisions')) || 0),
        urgencyMult: parseFloat(params.get('urgency')) || 1,
        gender: params.get('gender') === 'female' ? 'female' : 'male'
    };

    /* ============================================================
       2. ШАГИ
    ============================================================ */
    const steps = {
        data: document.getElementById('stepData'),
        details: document.getElementById('stepDetails'),
        contact: document.getElementById('stepContact'),
        result: document.getElementById('stepResult')
    };
    const stepIndicators = document.querySelectorAll('.order-step');

    function setStep(n) {
        Object.values(steps).forEach(el => { if (el) el.hidden = true; });
        if (steps.data) steps.data.hidden = n !== 1;
        if (steps.details) steps.details.hidden = n !== 2;
        if (steps.contact) steps.contact.hidden = n !== 3;
        if (steps.result) steps.result.hidden = n !== 4;

        stepIndicators.forEach((el, i) => {
            const stepNum = i + 1;
            el.classList.toggle('active', stepNum === n);
            el.classList.toggle('done', stepNum < n);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ============================================================
       3. PREFILL
    ============================================================ */
    if (isSkin) {
        const maleRadio = document.querySelector('input[name="skinGender"][value="Мужской"]');
        const femaleRadio = document.querySelector('input[name="skinGender"][value="Женский"]');
        if (initial.gender === 'female' && femaleRadio) femaleRadio.checked = true;
        else if (maleRadio) maleRadio.checked = true;
    }

    const orderRevisions = document.getElementById('orderRevisions');
    if (orderRevisions && initial.revisions > 0) {
        orderRevisions.value = Math.min(initial.revisions, 10);
    }

    if (initial.urgencyMult !== 1) {
        const urgencyBtns = document.querySelectorAll('#orderUrgency .calc-opt');
        urgencyBtns.forEach(b => b.classList.remove('active'));
        const target = Array.from(urgencyBtns).find(b => parseFloat(b.dataset.mult) === initial.urgencyMult);
        if (target) target.classList.add('active');
    }

    const orderExecutor = document.getElementById('orderExecutor');
    if (orderExecutor && initial.executor) {
        const opt = Array.from(orderExecutor.options).find(o => o.value === initial.executor);
        if (opt) orderExecutor.value = initial.executor;
    }

    /* ============================================================
       4. СОСТОЯНИЕ
    ============================================================ */
    let orderState = {
        gender: initial.gender,
        revisions: initial.revisions,
        revisionsPrice: PRICES.revision,
        urgencyMult: initial.urgencyMult,
        urgencyLabel: initial.urgencyMult === 1 ? 'Стандартно'
            : initial.urgencyMult === 1.5 ? 'Быстрее (×1.5)'
            : 'Срочно (×2)',
        executorName: initial.executor || null,
        executorDiscord: (authors.find(a => a.name === initial.executor) || {}).discord || null
    };

    function getBaseForService() {
        if (isSkin && orderState.gender === 'female') return PRICES.skinFemale;
        return basePrice;
    }

    function calcTotal() {
        const total = (getBaseForService() + orderState.revisions * orderState.revisionsPrice) * orderState.urgencyMult;
        return Math.round(total);
    }

    function updatePriceBanner() {
        const valueEl = document.getElementById('orderPriceValue');
        const pricing = document.getElementById('orderPricingBanner');
        if (valueEl) valueEl.textContent = `${calcTotal()} ₽`;
        if (pricing) pricing.classList.toggle('female-theme', isSkin && orderState.gender === 'female');
    }

    /* ============================================================
       5. ШАГ 1
    ============================================================ */
    const orderName = document.getElementById('orderName');
    if (orderName) {
        const saved = sessionStorage.getItem('tstudios_name');
        if (saved) orderName.value = saved;
    }

    const orderRevisionsValue = document.getElementById('orderRevisionsValue');
    if (orderRevisions) {
        orderRevisions.addEventListener('input', function () {
            orderState.revisions = parseInt(this.value) || 0;
            if (orderRevisionsValue) {
                orderRevisionsValue.innerHTML = `${orderState.revisions} правок × <span data-price="revision">${PRICES.revision}</span> ₽`;
            }
            updatePriceBanner();
        });
        if (orderRevisionsValue) {
            orderRevisionsValue.innerHTML = `${orderState.revisions} правок × <span data-price="revision">${PRICES.revision}</span> ₽`;
        }
    }

    if (isSkin) {
        document.querySelectorAll('input[name="skinGender"]').forEach(radio => {
            radio.addEventListener('change', function () {
                orderState.gender = this.value === 'Женский' ? 'female' : 'male';
                updatePriceBanner();
            });
        });
    }

    const orderUrgency = document.getElementById('orderUrgency');
    if (orderUrgency) {
        orderUrgency.querySelectorAll('.calc-opt').forEach(btn => {
            btn.addEventListener('click', function () {
                orderUrgency.querySelectorAll('.calc-opt').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                orderState.urgencyMult = parseFloat(this.dataset.mult);
                orderState.urgencyLabel = this.textContent.trim();
                updatePriceBanner();
            });
        });
        const active = Array.from(orderUrgency.querySelectorAll('.calc-opt'))
            .find(b => parseFloat(b.dataset.mult) === orderState.urgencyMult);
        if (active) {
            orderUrgency.querySelectorAll('.calc-opt').forEach(b => b.classList.remove('active'));
            active.classList.add('active');
        }
    }

    if (orderExecutor) {
        orderExecutor.addEventListener('change', function () {
            const author = authors.find(a => a.name === this.value);
            orderState.executorName = author ? author.name : null;
            orderState.executorDiscord = author ? author.discord : null;
        });
    }

    /* ============================================================
       6. ШАГ 2 — ЧИПСЫ ПОЗЫ + ОСТАЛЬНОЕ
    ============================================================ */
    const poseChips = document.querySelectorAll('.pose-chip');
    const customPoseWrap = document.getElementById('customPoseWrap');
    const customPoseInput = document.getElementById('customPoseInput');
    const skinTheme = document.getElementById('skinTheme');
    const skinColors = document.getElementById('skinColors');
    const skinRefs = document.getElementById('skinRefs');
    const renderBg = document.getElementById('renderBg');
    const renderMood = document.getElementById('renderMood');

    let selectedPose = '';
    let customPose = '';

    poseChips.forEach(chip => {
        chip.addEventListener('click', () => {
            poseChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const val = chip.dataset.pose;

            if (val === '__custom') {
                if (customPoseWrap) customPoseWrap.hidden = false;
                if (customPoseInput) customPoseInput.focus();
                selectedPose = '__custom';
            } else {
                if (customPoseWrap) customPoseWrap.hidden = true;
                selectedPose = val;
            }
        });
    });

    if (customPoseInput) {
        customPoseInput.addEventListener('input', () => {
            customPose = customPoseInput.value.trim();
        });
    }

    /* ============================================================
       7. ШАГ 3 — ОПИСАНИЕ
    ============================================================ */
    const orderDesc = document.getElementById('orderDesc');
    const orderExtra = document.getElementById('orderExtra');
    const descCounter = document.getElementById('descCounter');
    const extraCounter = document.getElementById('extraCounter');

    if (orderDesc) {
        orderDesc.addEventListener('input', function () {
            const len = this.value.length;
            if (descCounter) {
                descCounter.textContent = `${len} / 500`;
                descCounter.classList.toggle('warn', len > 400 && len <= 480);
                descCounter.classList.toggle('danger', len > 480);
            }
        });
    }

    if (orderExtra) {
        orderExtra.addEventListener('input', function () {
            if (extraCounter) extraCounter.textContent = `${this.value.length} / 300`;
        });
    }

    /* ============================================================
       8. ВАЛИДАЦИЯ
    ============================================================ */
    function validateStep1() {
        if (!orderName || !orderName.value.trim()) {
            showToast('Укажи имя или ник', 'error');
            if (orderName) orderName.focus();
            return false;
        }
        return true;
    }

    function validateStep2() {
        if (isSkin) {
            if (!skinTheme || !skinTheme.value.trim()) {
                showToast('Укажи тему скина', 'error');
                if (skinTheme) skinTheme.focus();
                return false;
            }
        } else if (isRender) {
            if (!selectedPose) {
                showToast('Выбери позу или добавь свою', 'error');
                return false;
            }
            if (selectedPose === '__custom' && !customPose) {
                showToast('Опиши свою позу', 'error');
                if (customPoseInput) customPoseInput.focus();
                return false;
            }
        }
        return true;
    }

    function validateStep3() {
        if (!orderDesc || !orderDesc.value.trim()) {
            showToast('Опиши заказ словами', 'error');
            if (orderDesc) orderDesc.focus();
            return false;
        }
        return true;
    }

    /* ============================================================
       9. НАВИГАЦИЯ
    ============================================================ */
    const nextBtn1 = document.getElementById('nextBtn1');
    const nextBtn2 = document.getElementById('nextBtn2');
    const backBtn2 = document.getElementById('backBtn2');
    const backBtn3 = document.getElementById('backBtn3');
    const submitBtn = document.getElementById('submitOrderBtn');

    if (nextBtn1) {
        nextBtn1.addEventListener('click', () => {
            if (!validateStep1()) return;
            sessionStorage.setItem('tstudios_name', orderName.value.trim());
            setStep(2);
        });
    }

    if (nextBtn2) {
        nextBtn2.addEventListener('click', () => {
            if (!validateStep2()) return;
            setStep(3);
        });
    }

    if (backBtn2) backBtn2.addEventListener('click', () => setStep(1));
    if (backBtn3) backBtn3.addEventListener('click', () => setStep(2));

    /* ============================================================
       10. ГЕНЕРАЦИЯ ТЕКСТА
    ============================================================ */
    function generateOrderText() {
        const name = orderName ? orderName.value.trim() : '';
        const desc = orderDesc ? orderDesc.value.trim() : '';
        const extra = orderExtra ? orderExtra.value.trim() : '';

        let text = '';
        text += `Заказ в TStudios\n`;
        text += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        text += `Услуга: ${isSkin ? 'Скин' : 'Рендер'}\n`;
        text += `Имя: ${name}\n`;
        if (orderState.executorName) text += `Исполнитель: ${orderState.executorName}\n`;

        if (isSkin) {
            const gender = document.querySelector('input[name="skinGender"]:checked');
            if (gender) text += `Пол скина: ${gender.value}\n`;
            if (skinTheme && skinTheme.value.trim()) text += `Тема / стиль: ${skinTheme.value.trim()}\n`;
            if (skinColors && skinColors.value.trim()) text += `Цвета: ${skinColors.value.trim()}\n`;
            if (skinRefs && skinRefs.value.trim()) text += `Референсы: ${skinRefs.value.trim()}\n`;
        } else if (isRender) {
            const renderType = document.querySelector('input[name="renderType"]:checked');
            if (renderType) text += `Тип рендера: ${renderType.value}\n`;
            if (selectedPose === '__custom') text += `Поза / ракурс: ${customPose}\n`;
            else if (selectedPose) text += `Поза / ракурс: ${selectedPose}\n`;
            if (renderBg && renderBg.value.trim()) text += `Фон: ${renderBg.value.trim()}\n`;
            if (renderMood && renderMood.value.trim()) text += `Атмосфера: ${renderMood.value.trim()}\n`;
        }

        if (orderState.revisions > 0) text += `Доп. правки: ${orderState.revisions} × ${orderState.revisionsPrice} ₽\n`;
        text += `Срочность: ${orderState.urgencyLabel}\n`;
        text += `Предварительная стоимость: ${calcTotal()} ₽\n`;
        text += `\nОписание:\n${desc}\n`;
        if (extra) text += `\nДополнительно:\n${extra}\n`;
        text += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        text += `Отправлено через сайт TStudios`;
        return text;
    }

    /* ============================================================
       11. TOAST + CLIPBOARD
    ============================================================ */
    function showToast(msg, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) { alert(msg); return; }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-check-circle'
            : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    function copyToClipboard(text, successMsg) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => showToast(successMsg, 'success'))
                .catch(() => fallbackCopy(text, successMsg));
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
       12. SUBMIT
    ============================================================ */
    const resultText = document.getElementById('resultText');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const resultDiscordLink = document.getElementById('resultDiscordLink');

    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!validateStep1()) { setStep(1); return; }
            if (!validateStep2()) { setStep(2); return; }
            if (!validateStep3()) { setStep(3); return; }

            if (resultText) resultText.value = generateOrderText();
            if (resultDiscordLink) {
                resultDiscordLink.href = orderState.executorDiscord || 'https://discord.com/users/1146355058880040970';
            }
            setStep(4);
        });
    }

    if (copyResultBtn && resultText) {
        copyResultBtn.addEventListener('click', function () {
            copyToClipboard(resultText.value, 'Текст скопирован!');
            copyResultBtn.classList.add('copied');
            const span = copyResultBtn.querySelector('span');
            if (span) {
                const original = span.textContent;
                span.textContent = 'Скопировано!';
                setTimeout(() => {
                    copyResultBtn.classList.remove('copied');
                    span.textContent = original;
                }, 2000);
            }
        });
    }

    /* ============================================================
       13. SHARE СТРАНИЦЫ
    ============================================================ */
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const text = isSkin
                ? 'Закажи уникальный скин по Minecraft в TStudios — от 250 ₽, срок 1-2 дня, сначала результат, потом оплата.'
                : 'Закажи 3D-рендер по Minecraft в TStudios — от 150 ₽, готов за сутки, сначала результат, потом оплата.';
            const url = window.location.href;
            if (navigator.share) {
                try { await navigator.share({ title: 'TStudios', text, url }); return; } catch (err) {}
            }
            copyToClipboard(`${text}\n${url}`, 'Скопировано!');
        });
    }

    /* ============================================================
       14. МОБИЛЬНОЕ МЕНЮ + СКРОЛЛ ХЕДЕРА
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

    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    /* ============================================================
       15. СТАРТ
    ============================================================ */
    updatePriceBanner();
    setStep(1);

});