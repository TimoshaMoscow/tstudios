/* services.js — единый реестр услуг */
window.TSTUDIOS_SERVICES = {
    skin: {
        name: 'Скин',
        price: 250,
        femalePrice: 300,
        icon: 'fa-paint-brush',
        page: 'order-skin.html',
        cardDesc: 'Уникальный скин под твой образ',
        hasGender: true
    },
    render: {
        name: 'Рендер',
        price: 150,
        icon: 'fa-cube',
        page: 'order-render.html',
        cardDesc: '3D-рендер твоего персонажа'
    },
    cape: {
        name: 'Плащ',
        price: 150,
        icon: 'fa-scroll',
        page: 'order-cape.html',
        cardDesc: 'Уникальный плащ под твой скин'
    }
    // новая услуга = одна строка здесь
};