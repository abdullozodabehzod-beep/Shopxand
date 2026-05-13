/**
 * ShopXand - Mobile Menu & Search
 */

document.addEventListener('DOMContentLoaded', function() {


     function showToast(title, message, type) {
        var toast = document.getElementById('toast');
        if (!toast) return;
        document.getElementById('toastTitle').textContent = title;
        document.getElementById('toastMessage').textContent = message;
        var icon = document.getElementById('toastIcon');
        if (type === 'success') {
            icon.innerHTML = '<i class="fas fa-check-circle"></i>';
            icon.className = 'toast__icon';
        } else if (type === 'error') {
            icon.innerHTML = '<i class="fas fa-times-circle"></i>';
            icon.className = 'toast__icon error';
        }
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(function() { toast.classList.remove('show'); }, 3000);

    }
    
        // ============================================
    // IMAGE HELPER - Проверка типа картинки
    // ============================================
    
    function getImageHtml(img, alt, size) {
        const style = size ? `style="width:${size};height:${size};object-fit:contain;"` : '';
        
        if (img && (img.startsWith('http') || img.startsWith('img/') || 
            img.endsWith('.png') || img.endsWith('.jpg') || 
            img.endsWith('.jpeg') || img.endsWith('.webp'))) {
            return `<img src="${img}" alt="${alt || ''}" ${style}>`;
        } else {
            return `<span>${img || '📦'}</span>`;
        }
    }
        // Проверка что все элементы существуют перед использованием
    function safeQuery(selector) {
        return document.querySelector(selector) || document.getElementById(selector.replace('#', ''));
    }
    
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuContent = document.getElementById('menuContent');
    const searchToggle = document.getElementById('searchToggle');
    const searchBlock = document.getElementById('searchBlock');
    const searchInput = document.getElementById('searchInput');
    
    // ============================================
    // МЕНЮ: Открытие / Закрытие
    // ============================================
    
    function openMenu() {
        mobileMenu.classList.add('active');
        burgerBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    
    
          function closeMenu() {
        mobileMenu.classList.remove('active');
        burgerBtn.classList.remove('active');
          window.closeMenu = closeMenu;
        
        // Не убираем overflow hidden если открыта другая панель
        if (!langModal.classList.contains('active') && 
            !cityModal.classList.contains('active') &&
            !cartPanel.classList.contains('active') &&
            !favPanel.classList.contains('active')) {
            document.body.style.overflow = '';
        }
        
        // Сбрасываем transform после закрытия
        setTimeout(function() {
            if (menuContent) {
                menuContent.style.transform = '';
                menuContent.style.transition = '';
            }
        }, 350);
    }
    
    burgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Закрытие по оверлею
    menuOverlay.addEventListener('click', closeMenu);
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
            searchBlock.classList.remove('active');
        }
    });
    
    // Свайп влево для закрытия
        // Свайп влево для закрытия (исправленный, без дёрганий)
    let touchStartX = 0;
    let touchCurrentX = 0;
    let isDragging = false;
    
    menuContent.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchCurrentX = touchStartX;
        isDragging = true;
        menuContent.style.transition = 'none';
        menuContent.style.transform = 'translateX(0)';
    }, { passive: true });
    
    menuContent.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        touchCurrentX = e.touches[0].clientX;
        const diff = touchCurrentX - touchStartX;
        if (diff < 0) {
            menuContent.style.transform = `translateX(${diff}px)`;
        }
    }, { passive: true });
    
    menuContent.addEventListener('touchend', function() {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = touchCurrentX - touchStartX;
        
        if (diff < -80) {
            // Закрываем меню
            menuContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            menuContent.style.transform = 'translateX(-100%)';
            
            // Ждём конец анимации и убираем класс
            setTimeout(function() {
                closeMenu();
                menuContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                menuContent.style.transform = '';
            }, 300);
        } else {
            // Возвращаем на место
            menuContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            menuContent.style.transform = 'translateX(0)';
            
            // Очищаем стили после анимации
            setTimeout(function() {
                menuContent.style.transform = '';
                menuContent.style.transition = '';
            }, 300);
        }
    });
    
        // Закрытие при клике на ссылку меню
    const menuLinks = menuContent.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const text = this.textContent.trim();

    
    // Войти
    if (text.includes('Войти') || text.includes('Ворид') || text.includes('Sign In')) {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        setTimeout(function() {
            openAuth();
        }, 400);
        return;
    }
            
            // Мои заказы
            if (text.includes('Мои заказы') || text.includes('Заказы') || text.includes('Фармоиш') || text.includes('Orders')) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
                setTimeout(function() {
                    openOrders();
                }, 400);
                return;
            }
            
            // Корзина
            if (text.includes('Корзина') || text.includes('Сабад') || text.includes('Cart')) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
                setTimeout(function() {
                    openCart();
                }, 400);
                return;
            }
            
            // Избранное
            if (text.includes('Избранное') || text.includes('Интихобшуда') || text.includes('Favorites')) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
                setTimeout(function() {
                    openFavorites();
                }, 400);
                return;
            }

             // Для остальных ссылок проверяем категории
    var category = text.replace(/[^а-яА-Яa-zA-Z]/g, '').trim().toLowerCase();
    if (['одежда', 'электроника', 'домисад', 'детскиетовары'].some(function(c) { return category.includes(c); })) {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        setTimeout(function() {
            filterByCategory(text.trim());
        }, 400);
        return;
    }
    
    setTimeout(closeMenu, 200);
            
            
        });
    });


        // Отдельные обработчики для мобильного меню
    const mobileOrdersAction = document.querySelector('.mobile-menu__action i.fa-box')?.parentElement;
    if (mobileOrdersAction) {
        mobileOrdersAction.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            setTimeout(function() {
                openOrders();
            }, 400);
        });
    }
    // ============================================
    // ПОИСК: Показать / Скрыть
    // ============================================
    
       searchToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (searchBlock.classList.contains('active')) {
            // Закрываем с анимацией
            searchBlock.classList.remove('active');
            setTimeout(function() {
                searchBlock.style.display = 'none';
            }, 250);
        } else {
            // Открываем с анимацией
            searchBlock.style.display = 'flex';
            setTimeout(function() {
                searchBlock.classList.add('active');
                searchInput.focus();
            }, 10);
        }
    });
    
     // Закрыть поиск при клике вне
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!searchBlock.contains(e.target) && 
                !searchToggle.contains(e.target) &&
                searchBlock.classList.contains('active')) {
                searchBlock.classList.remove('active');
                setTimeout(function() {
                    searchBlock.style.display = 'none';
                }, 250);

            }
        }
    }
)

    // ============================================
    // ГОРОДА ТАДЖИКИСТАНА
    // ============================================
    
    const citySelector = document.getElementById('citySelector');
    const mobileCitySelector = document.getElementById('mobileCitySelector');
    const cityModal = document.getElementById('cityModal');
    const cityOverlay = document.getElementById('cityOverlay');
    const cityModalClose = document.getElementById('cityModalClose');
    const citySearchInput = document.getElementById('citySearchInput');
    const cityList = document.getElementById('cityList');
    const cityEmpty = document.getElementById('cityEmpty');
    
    let currentCity = 'Душанбе';
    
    function updateCityDisplay(cityName) {
        currentCity = cityName;
        
        // Обновляем в хедере
        const headerCity = document.querySelector('.header__city');
        if (headerCity) {
            headerCity.textContent = cityName;
        }
        
        // Обновляем в мобильном меню
        const mobileCitySpan = document.querySelector('#mobileCitySelector span');
        if (mobileCitySpan) {
            mobileCitySpan.textContent = cityName;
        }
        
        // Обновляем в модалке
        document.querySelectorAll('.city-modal__item').forEach(function(item) {
            item.classList.remove('active');
            if (item.getAttribute('data-city') === cityName) {
                item.classList.add('active');
            }
        });
        
        // Сохраняем в localStorage
        localStorage.setItem('shopxand_city', cityName);
    }
    
    function openCityModal() {
        cityModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Сброс поиска
        if (citySearchInput) {
            citySearchInput.value = '';
        }
        showAllCities();
        
        // Фокус на поиск через небольшую задержку
        setTimeout(function() {
            if (citySearchInput) {
                citySearchInput.focus();
            }
        }, 400);
    }
    
        function closeCityModal() {
        cityModal.classList.remove('active');
        // Не убираем overflow hidden если открыта модалка языка
        if (!langModal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }
    
    function showAllCities() {
        const items = cityList.querySelectorAll('.city-modal__item');
        const groups = cityList.querySelectorAll('.city-modal__group');
        
        items.forEach(function(item) {
            item.style.display = 'flex';
            item.classList.remove('highlight');
        });
        
        groups.forEach(function(group) {
            group.style.display = 'block';
        });
        
        if (cityEmpty) {
            cityEmpty.classList.remove('show');
        }
        if (cityList) {
            cityList.style.display = 'block';
        }
    }
    
    function searchCities(query) {
        const items = cityList.querySelectorAll('.city-modal__item');
        const groups = cityList.querySelectorAll('.city-modal__group');
        let found = false;
        
        query = query.toLowerCase().trim();
        
        groups.forEach(function(group) {
            let groupHasVisible = false;
            const groupItems = group.querySelectorAll('.city-modal__item');
            
            groupItems.forEach(function(item) {
                const cityName = item.getAttribute('data-city').toLowerCase();
                if (cityName.includes(query) || query === '') {
                    item.style.display = 'flex';
                    groupHasVisible = true;
                    found = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            group.style.display = groupHasVisible ? 'block' : 'none';
        });
        
        if (!found && query !== '') {
            cityList.style.display = 'none';
            cityEmpty.classList.add('show');
        } else {
            cityList.style.display = 'block';
            cityEmpty.classList.remove('show');
        }
    }
    
    // Открытие модалки
    if (citySelector) {
        citySelector.addEventListener('click', function(e) {
            e.stopPropagation();
            openCityModal();
        });
    }
    
    if (mobileCitySelector) {
        mobileCitySelector.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Закрываем мобильное меню
            closeMenu();
            // Открываем модалку городов
            setTimeout(openCityModal, 350);
        });
    }
    
    // Закрытие модалки
    if (cityOverlay) {
        cityOverlay.addEventListener('click', closeCityModal);
    }
    
    if (cityModalClose) {
        cityModalClose.addEventListener('click', closeCityModal);
    }
    
    // Выбор города из списка
    if (cityList) {
        cityList.addEventListener('click', function(e) {
            const item = e.target.closest('.city-modal__item');
            if (item) {
                const cityName = item.getAttribute('data-city');
                
                // Анимация выбора
                item.classList.add('highlight');
                
                setTimeout(function() {
                    updateCityDisplay(cityName);
                    closeCityModal();
                }, 200);
            }
        });
    }
    
    // Поиск города
    if (citySearchInput) {
        citySearchInput.addEventListener('input', function() {
            searchCities(this.value);
        });
    }
    
    // Escape для закрытия
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cityModal.classList.contains('active')) {
            closeCityModal();
        }
    });
    
    // Свайп вниз для закрытия на мобильном
    const cityModalContent = document.querySelector('.city-modal__content');
    let cityTouchStartY = 0;
    let cityTouchCurrentY = 0;
    
    if (cityModalContent) {
        cityModalContent.addEventListener('touchstart', function(e) {
            cityTouchStartY = e.touches[0].clientY;
            cityModalContent.style.transition = 'none';
        }, { passive: true });
        
        cityModalContent.addEventListener('touchmove', function(e) {
            cityTouchCurrentY = e.touches[0].clientY;
            const diff = cityTouchCurrentY - cityTouchStartY;
            if (diff > 0 && cityModal.classList.contains('active')) {
                cityModalContent.style.transform = `translateY(${diff}px)`;
            }
        }, { passive: true });
        
        cityModalContent.addEventListener('touchend', function() {
            const diff = cityTouchCurrentY - cityTouchStartY;
            cityModalContent.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            if (diff > 100) {
                closeCityModal();
                setTimeout(function() {
                    cityModalContent.style.transform = '';
                }, 400);
            } else {
                cityModalContent.style.transform = '';
            }
        });
    }
    
    // Загрузка сохранённого города
    const savedCity = localStorage.getItem('shopxand_city');
    if (savedCity) {
        updateCityDisplay(savedCity);
    }



});


    const BOT_ORDER = '8265957442:AAFWnqXyl8TJJzZXsv3vxXRCuWwWd_aY9mE';
    const CHAT_ID = '5282056467';
    const CHANNEL_ID = '-1002854630161';

    // ФУНКЦИЯ TOAST
function showToast(title, message, type) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    if (type === 'success') {
        toastIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        toastIcon.className = 'toast__icon';
    } else if (type === 'error') {
        toastIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
        toastIcon.className = 'toast__icon error';
    }
    
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);


}



    // ============================================
    // ВЫБОР ЯЗЫКА - ИСПРАВЛЕННАЯ ВЕРСИЯ
    // ============================================
    
    const langSelector = document.getElementById('langSelector');
    const mobileLangSelector = document.getElementById('mobileLangSelector');
    const langModal = document.getElementById('langModal');
    const langOverlay = document.getElementById('langOverlay');
    const langModalClose = document.getElementById('langModalClose');
    
    // Текущий язык (по умолчанию русский)
    let currentLang = 'ru';
    
    // Коды языков для отображения в хедере
    const langCodes = {
        ru: 'RU',
        tg: 'TJ',
        en: 'EN'
    };
    
    // Названия языков для мобильного меню
    const langNames = {
        ru: 'Русский (RU)',
        tg: 'Тоҷикӣ (TJ)',
        en: 'English (EN)'
    };
    
    // Переводы
    const translations = {
        ru: {
            catalog: 'Каталог',
            search: 'Я ищу...',
            login: 'Войти',
            orders: 'Заказы',
            favorites: 'Избранное',
            cart: 'Корзина',
            clothing: 'Одежда',
            electronics: 'Электроника',
            home: 'Дом и сад',
            kids: 'Детские товары',
            beauty: 'Красота и здоровье',
            sport: 'Спорт и отдых',
            food: 'Продукты',
            sales: 'Акции',
            menuTitle: 'Каталог',
            myOrders: 'Мои заказы',
            myFavorites: 'Избранное',
            myCart: 'Корзина',
            loginReg: 'Войти или зарегистрироваться',
            langName: 'Русский (RU)',
            hot: 'Hot'
        },
        tg: {
            catalog: 'Каталог',
            search: 'Ҷустуҷӯ...',
            login: 'Ворид',
            orders: 'Фармоишҳо',
            favorites: 'Интихобшуда',
            cart: 'Сабад',
            clothing: 'Либос',
            electronics: 'Электроника',
            home: 'Хона ва боғ',
            kids: 'Молҳои кӯдакона',
            beauty: 'Зебоӣ ва саломатӣ',
            sport: 'Варзиш ва истироҳат',
            food: 'Маҳсулот',
            sales: 'Тафхҳо',
            menuTitle: 'Каталог',
            myOrders: 'Фармоишҳои ман',
            myFavorites: 'Интихобшуда',
            myCart: 'Сабади ман',
            loginReg: 'Ворид шудан ё ба қайд гирифтан',
            langName: 'Тоҷикӣ (TJ)',
            hot: 'Hot'
        },
        en: {
            catalog: 'Catalog',
            search: 'Search...',
            login: 'Sign In',
            orders: 'Orders',
            favorites: 'Favorites',
            cart: 'Cart',
            clothing: 'Clothing',
            electronics: 'Electronics',
            home: 'Home & Garden',
            kids: 'Kids',
            beauty: 'Beauty & Health',
            sport: 'Sports & Leisure',
            food: 'Groceries',
            sales: 'Sales',
            menuTitle: 'Catalog',
            myOrders: 'My Orders',
            myFavorites: 'Favorites',
            myCart: 'Cart',
            loginReg: 'Sign in or register',
            langName: 'English (EN)',
            hot: 'Hot'
        }
    };
    
    // Функция обновления отображения языка
    function updateLanguageDisplay(lang) {
        currentLang = lang;
        
        // 1. Обновляем код в хедере (RU, TJ, EN)
        const langCodeElement = document.querySelector('.header__lang-current');
        if (langCodeElement) {
            langCodeElement.textContent = langCodes[lang];
            console.log('Код языка в хедере обновлён на:', langCodes[lang]);
        }
        
        // 2. Обновляем текст в мобильном меню
        if (mobileLangSelector) {
            const mobileLangSpan = mobileLangSelector.querySelector('span');
            if (mobileLangSpan) {
                mobileLangSpan.textContent = langNames[lang];
                console.log('Язык в мобильном меню обновлён на:', langNames[lang]);
            }
        }
        
        // 3. Обновляем активный элемент в модалке
        document.querySelectorAll('.lang-modal__item').forEach(function(item) {
            item.classList.remove('active');
            if (item.getAttribute('data-lang') === lang) {
                item.classList.add('active');
            }
        });
        
        // 4. Обновляем переводы интерфейса
        updateInterfaceTranslations(lang);
        
        // 5. Сохраняем в localStorage
        localStorage.setItem('shopxand_lang', lang);
    }
    
    function updateInterfaceTranslations(lang) {
        const t = translations[lang];
        if (!t) return;
        
        // Поиск
        const searchInput = document.querySelector('.header__search-input');
        if (searchInput) {
            searchInput.placeholder = t.search;
        }
        
        // Кнопка каталога
        const catalogBtn = document.querySelector('.header__catalog-btn span');
        if (catalogBtn) {
            catalogBtn.textContent = t.catalog;
        }
        
        // Кнопки действий (Войти, Заказы, Избранное, Корзина)
        const actions = document.querySelectorAll('.header__action span');
        const actionTexts = [t.login, t.orders, t.favorites, t.cart];
        actions.forEach(function(span, index) {
            if (actionTexts[index]) {
                span.textContent = actionTexts[index];
            }
        });
        
        // Навигация (Одежда, Электроника...)
        const navLinks = document.querySelectorAll('.header__nav-link');
        const navTexts = [t.clothing, t.electronics, t.home, t.kids, t.beauty, t.sport, t.food, t.sales];
        navLinks.forEach(function(link, index) {
            if (navTexts[index]) {
                link.textContent = navTexts[index];
            }
        });
        
        // Мобильное меню - категории
        const mobileNavLinks = document.querySelectorAll('.mobile-menu__nav a span');
        const mobileNavTexts = [t.clothing, t.electronics, t.home, t.kids, t.beauty, t.sport, t.food, t.sales];
        mobileNavLinks.forEach(function(span, index) {
            if (mobileNavTexts[index]) {
                span.textContent = mobileNavTexts[index];
            }
        });
        
        // Заголовок "Каталог" в мобильном меню
        const menuSectionTitle = document.querySelector('.mobile-menu__section-title');
        if (menuSectionTitle) {
            menuSectionTitle.textContent = t.menuTitle;
        }
        
        // Кнопка "Войти или зарегистрироваться"
        const loginBtn = document.querySelector('.mobile-menu__login-btn');
        if (loginBtn) {
            loginBtn.textContent = t.loginReg;
        }
        
        // Вторичные ссылки в меню (Мои заказы, Избранное, Корзина)
        const secondaryLinks = document.querySelectorAll('.mobile-menu__secondary-list a span');
        const secondaryTexts = [t.myOrders, t.myFavorites, t.myCart];
        secondaryLinks.forEach(function(span, index) {
            if (secondaryTexts[index]) {
                span.textContent = secondaryTexts[index];
            }
        });
    }
    
    // Открытие модалки языка
        function openLangModal() {
        console.log('Открываем модалку языка');
        // Проверяем существует ли модалка
        if (!langModal) {
            console.error('Модалка языка не найдена!');
            return;
        }
        langModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Закрытие модалки языка
       function closeLangModal() {
        console.log('Закрываем модалку языка');
        if (!langModal) return;
        langModal.classList.remove('active');
        // Не убираем overflow hidden если открыто мобильное меню
        if (!mobileMenu.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }
    
    // Клик по селектору языка в хедере
    if (langSelector) {
        langSelector.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Клик по селектору языка в хедере');
            openLangModal();
        });
    }
    
    // Клик по языку в мобильном меню
       // Клик по языку в мобильном меню (исправлено)
    if (mobileLangSelector) {
        mobileLangSelector.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Клик по языку в мобильном меню');
            
            // Сначала открываем модалку
            openLangModal();
            
            // Потом закрываем мобильное меню с небольшой задержкой
            setTimeout(function() {
                closeMenu();
            }, 100);
        });
    }
    
    // Закрытие по оверлею
    if (langOverlay) {
        langOverlay.addEventListener('click', function(e) {
            e.stopPropagation();
            closeLangModal();
        });
    }
    
    // Закрытие по кнопке X
    if (langModalClose) {
        langModalClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeLangModal();
        });
    }
    
    // Выбор языка из списка
    const langItems = document.querySelectorAll('.lang-modal__item');
    langItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const lang = this.getAttribute('data-lang');
            console.log('Выбран язык:', lang);
            
            // Анимация выбора
            this.classList.add('picked');
            
            // Обновляем язык и закрываем модалку
            setTimeout(function() {
                updateLanguageDisplay(lang);
                closeLangModal();
                item.classList.remove('picked');
            }, 250);
        });
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && langModal && langModal.classList.contains('active')) {
            closeLangModal();
        }
    });
    
    // Свайп вниз для закрытия модалки языка
    const langModalContent = document.querySelector('.lang-modal__content');
    let langTouchStartY = 0;
    let langTouchCurrentY = 0;
    
    if (langModalContent) {
        langModalContent.addEventListener('touchstart', function(e) {
            langTouchStartY = e.touches[0].clientY;
            langTouchCurrentY = langTouchStartY;
            langModalContent.style.transition = 'none';
        }, { passive: true });
        
        langModalContent.addEventListener('touchmove', function(e) {
            langTouchCurrentY = e.touches[0].clientY;
            const diff = langTouchCurrentY - langTouchStartY;
            if (diff > 0 && langModal.classList.contains('active')) {
                langModalContent.style.transform = `translateY(${diff}px)`;
            }
        }, { passive: true });
        
        langModalContent.addEventListener('touchend', function() {
            const diff = langTouchCurrentY - langTouchStartY;
            langModalContent.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            if (diff > 100) {
                closeLangModal();
                setTimeout(function() {
                    langModalContent.style.transform = '';
                }, 400);
            } else {
                langModalContent.style.transform = '';
            }
        });
    }
    
    // Загрузка сохранённого языка при старте
    const savedLang = localStorage.getItem('shopxand_lang');
    if (savedLang && (savedLang === 'ru' || savedLang === 'tg' || savedLang === 'en')) {
        console.log('Загружен сохранённый язык:', savedLang);
        updateLanguageDisplay(savedLang);
    } else {
        // По умолчанию русский
        updateLanguageDisplay('ru');
    }
    
    console.log('Модуль языков загружен. Текущий язык:', currentLang);



        // ============================================
    // ВЫПАДАЮЩИЙ КАТАЛОГ
    // ============================================
    
    const catalogBtn = document.querySelector('.header__catalog-btn');
    const catalogDropdown = document.getElementById('catalogDropdown');
    const catalogOverlay = document.getElementById('catalogOverlay');
    
    let isCatalogOpen = false;
    
       function openCatalog() {
        if (!catalogDropdown || !catalogOverlay) return;
        
        isCatalogOpen = true;
        catalogDropdown.classList.add('active');
        catalogOverlay.classList.add('active');
        catalogBtn.classList.add('active-btn');
        
        // Прокручиваем каталог в начало при открытии
        catalogDropdown.scrollTop = 0;
        
        // Блокируем скролл страницы
        document.body.style.overflow = 'hidden';
        
        console.log('Каталог открыт');
    }
    
    function closeCatalog() {
        if (!catalogDropdown || !catalogOverlay) return;
        
        isCatalogOpen = false;
        catalogDropdown.classList.remove('active');
        catalogOverlay.classList.remove('active');
        catalogBtn.classList.remove('active-btn');
        
        // Возвращаем скролл только если нет других открытых модалок
        if (!mobileMenu.classList.contains('active') && 
            !langModal.classList.contains('active') && 
            !cityModal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
        
        console.log('Каталог закрыт');
    }
    
    function toggleCatalog() {
        if (isCatalogOpen) {
            closeCatalog();
        } else {
            openCatalog();
        }
    }
    
    // Клик по кнопке каталога
    if (catalogBtn) {
        catalogBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleCatalog();
        });
    }
    
    // Закрытие по оверлею
    if (catalogOverlay) {
        catalogOverlay.addEventListener('click', function(e) {
            e.stopPropagation();
            closeCatalog();
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isCatalogOpen) {
            closeCatalog();
        }
    });
    
    // Закрытие при клике вне каталога
    document.addEventListener('click', function(e) {
        if (isCatalogOpen && 
            !catalogDropdown.contains(e.target) && 
            !catalogBtn.contains(e.target)) {
            closeCatalog();
        }
    });
    
    // Не закрывать при клике внутри каталога
    if (catalogDropdown) {
        catalogDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    console.log('Модуль каталога загружен');



        // ============================================
    // HERO SLIDER - Simple
    // ============================================
    
    const slides = document.querySelectorAll('.hero__slide');
    const dots = document.getElementById('heroDots');
    let currentIndex = 0;
    let autoSlideTimer;
    
    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.hero__dot').forEach(d => d.classList.remove('active'));
        
        slides[index].classList.add('active');
        if (dots) {
            dots.children[index].classList.add('active');
        }
        currentIndex = index;
    }
    
    function nextSlide() {
        const next = (currentIndex + 1) % slides.length;
        showSlide(next);
    }
    
    // Точки
    if (dots) {
        dots.addEventListener('click', function(e) {
            if (e.target.classList.contains('hero__dot')) {
                const index = parseInt(e.target.dataset.index);
                showSlide(index);
                resetTimer();
            }
        });
    }
    
    // Авто
    function startTimer() {
        autoSlideTimer = setInterval(nextSlide, 4000);
    }
    
    function resetTimer() {
        clearInterval(autoSlideTimer);
        startTimer();
    }
    
    if (slides.length > 1) startTimer();
    
    // Пауза при наведении
    const slider = document.getElementById('heroSlider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
        slider.addEventListener('mouseleave', startTimer);
    }


          // ============================================
    // FAVORITES - Избранное
    // ============================================
    
    const favPanel = document.getElementById('favPanel');
    const favOverlay = document.getElementById('favOverlay');
    const favClose = document.getElementById('favClose');
    const favItemsContainer = document.getElementById('favItems');
    const favEmpty = document.getElementById('favEmpty');
    const favCountElement = document.querySelector('.fav-panel__count');
    
    // Массив избранного
    let favorites = [];
    
    // Загрузка из localStorage
    function loadFavorites() {
        const savedFavs = localStorage.getItem('shopxand_favorites');
        if (savedFavs) {
            favorites = JSON.parse(savedFavs);
        }
    }
    
    // Сохранение
    function saveFavorites() {
        localStorage.setItem('shopxand_favorites', JSON.stringify(favorites));
    }
    
    // Проверка в избранном
    function isInFavorites(productId) {
        return favorites.some(item => item.id === productId);
    }
    
    // Добавить в избранное
    function addToFavorites(product) {
        if (!isInFavorites(product.id)) {
            favorites.push({
                id: product.id,
                name: product.name,
                price: parseInt(product.price),
                img: product.img,
                cat: product.cat
            });
            saveFavorites();
            updateFavCount();
            updateAllHeartIcons();
        }
    }
    
    // Удалить из избранного
    function removeFromFavorites(productId) {
        favorites = favorites.filter(item => item.id !== productId);
        saveFavorites();
        updateFavCount();
        updateAllHeartIcons();
        renderFavorites();
    }
    
    // Переключить избранное
    function toggleFavorite(product) {
        if (isInFavorites(product.id)) {
            removeFromFavorites(product.id);
            return false; // теперь не в избранном
        } else {
            addToFavorites(product);
            return true; // теперь в избранном
        }
    }
    
    // Обновить все иконки сердечек
    function updateAllHeartIcons() {
        document.querySelectorAll('.product-card__fav').forEach(function(btn) {
            const id = btn.getAttribute('data-id');
            if (isInFavorites(id)) {
                btn.classList.add('active');
                btn.querySelector('i').className = 'fas fa-heart';
            } else {
                btn.classList.remove('active');
                btn.querySelector('i').className = 'far fa-heart';
            }
        });
    }
    
    // Обновить счётчик
    function updateFavCount() {
        if (favCountElement) {
            const word = getFavWord(favorites.length);
            favCountElement.textContent = favorites.length + ' ' + word;
        }
    }
    
    function getFavWord(count) {
        if (count % 10 === 1 && count % 100 !== 11) return 'товар';
        if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'товара';
        return 'товаров';
    }
    
    // Отрисовать избранное в панели
    function renderFavorites() {
        if (!favItemsContainer) return;
        
        if (favorites.length === 0) {
            favItemsContainer.innerHTML = '';
            favEmpty.style.display = 'flex';
        } else {
            favEmpty.style.display = 'none';
            
            favItemsContainer.innerHTML = favorites.map(item => `
                <div class="fav-item" data-id="${item.id}">
              <div class="fav-item__img">
                ${item.img && (item.img.endsWith('.png') || item.img.endsWith('.jpg') || item.img.endsWith('.jpeg') || item.img.endsWith('.webp')) 
                    ? `<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:contain;border-radius:10px;">`
                    : `<span>${item.img || '📦'}</span>`
                }
            </div>
                    <div class="fav-item__info">
<h4 class="fav-item__name">${item.name}</h4>
<div class="fav-item__price">${item.price.toLocaleString()} сомони</div>
                    </div>
                    <div class="fav-item__actions">
<button class="fav-item__cart-btn" onclick="window.addFavToCart('${item.id}')">
    <i class="fas fa-shopping-cart"></i> В корзину
</button>
<button class="fav-item__remove" onclick="window.removeFav('${item.id}')">
    <i class="fas fa-trash-alt"></i>
</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Глобальные функции
    window.addFavToCart = function(id) {
        const item = favorites.find(i => i.id === id);
        if (item) {
            addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                img: item.img,
                cat: item.cat
            });
        }
    };
    
    window.removeFav = function(id) {
        removeFromFavorites(id);
    };
    
    // ============================================
    // Клик по сердечку на карточке товара
    // ============================================
    
    document.querySelectorAll('.product-card__fav').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const product = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                price: this.getAttribute('data-price'),
                img: this.getAttribute('data-img'),
                cat: this.getAttribute('data-cat')
            };
            
            const isNowFav = toggleFavorite(product);
            
            // Анимация сердечка
            if (isNowFav) {
                this.style.transform = 'scale(1.3)';
                setTimeout(() => { this.style.transform = ''; }, 300);
            }
        });
    });
    
    // ============================================
    // Открытие/закрытие панели избранного
    // ============================================
    
    function openFavorites() {
        favPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderFavorites();
        updateFavCount();
    }
    
    function closeFavorites() {
        favPanel.classList.remove('active');
        if (!cartPanel.classList.contains('active') &&
            !mobileMenu.classList.contains('active') && 
            !langModal.classList.contains('active') && 
            !cityModal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }
    
    // Кнопка избранного в хедере
    const headerFavBtn = document.querySelector('.header__action--favorites, .header__action:nth-child(3)');
    if (headerFavBtn) {
        headerFavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openFavorites();
        });
    }
    
    // Избранное в мобильном меню
    const mobileFavLink = document.querySelector('.mobile-menu__secondary-list a[href="#"]:nth-child(2)');
    if (mobileFavLink) {
        mobileFavLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
            setTimeout(openFavorites, 350);
        });
    }
    
    // Закрытие
    if (favOverlay) favOverlay.addEventListener('click', closeFavorites);
    if (favClose) favClose.addEventListener('click', closeFavorites);
    
    // Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && favPanel && favPanel.classList.contains('active')) {
            closeFavorites();
        }
    });
    
    // Кнопка "Перейти в каталог"
    const favEmptyBtn = document.getElementById('favEmptyBtn');
    if (favEmptyBtn) {
        favEmptyBtn.addEventListener('click', function() {
            closeFavorites();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Загрузка при старте
    loadFavorites();
    updateAllHeartIcons();
    updateFavCount();
    
    console.log('Модуль избранного загружен. Товаров:', favorites.length);


         // ============================================
    // CART PANEL - Полная корзина
    // ============================================
    
    const cartPanel = document.getElementById('cartPanel');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    const cartCountElement = document.querySelector('.cart-panel__count');
    const headerCartCount = document.querySelector('.header__cart-count');
    
    // Корзина (массив товаров)
    let cart = [];
    
    // Загружаем корзину из localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('shopxand_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }
    
    // Сохраняем корзину
    function saveCart() {
        localStorage.setItem('shopxand_cart', JSON.stringify(cart));
    }
    
    // Открыть корзину
    function openCart() {
        cartPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCart();
    }
    
    // Закрыть корзину
    function closeCart() {
        cartPanel.classList.remove('active');
        if (!mobileMenu.classList.contains('active') && 
            !langModal.classList.contains('active') && 
            !cityModal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }
    
    // Добавить товар в корзину
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: parseInt(product.price),
                img: product.img,
                cat: product.cat,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartCount();
        
        // Анимация добавления
        showAddToCartFeedback();
    }
    
    // Удалить товар
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCount();
        renderCart();
    }
    
    // Изменить количество
    function updateQuantity(productId, newQuantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
                return;
            }
            item.quantity = newQuantity;
            saveCart();
            renderCart();
        }
    }
    
    // Посчитать общую сумму
    function getTotalPrice() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    // Обновить счётчик товаров
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (headerCartCount) {
            headerCartCount.textContent = totalItems;
            headerCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        if (cartCountElement) {
            const word = getItemWord(totalItems);
            cartCountElement.textContent = totalItems + ' ' + word;
        }
    }
    
    // Склонение слова "товар"
    function getItemWord(count) {
        if (count % 10 === 1 && count % 100 !== 11) return 'товар';
        if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'товара';
        return 'товаров';
    }
    
    // Отрисовать корзину
    function renderCart() {
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            // Пустая корзина
            cartItemsContainer.innerHTML = '';
            cartEmpty.style.display = 'flex';
            cartFooter.style.display = 'none';
        } else {
            // Есть товары
            cartEmpty.style.display = 'none';
            cartFooter.style.display = 'block';
            
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item__img">
    ${item.img && (item.img.endsWith('.png') || item.img.endsWith('.jpg') || item.img.endsWith('.jpeg') || item.img.endsWith('.webp')) 
        ? `<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:contain;border-radius:10px;">`
        : `<span>${item.img || '📦'}</span>`
    }
</div>
                    <div class="cart-item__info">
<h4 class="cart-item__name">${item.name}</h4>
<span class="cart-item__price">${item.price.toLocaleString()} сомони</span>
                    </div>
                    <div class="cart-item__quantity">
<button class="cart-item__qty-btn" onclick="window.cartDecrease('${item.id}')">−</button>
<span class="cart-item__qty-num">${item.quantity}</span>
<button class="cart-item__qty-btn" onclick="window.cartIncrease('${item.id}')">+</button>
                    </div>
                    <button class="cart-item__remove" onclick="window.cartRemove('${item.id}')">
<i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `).join('');
            
            // Обновить сумму
            cartTotal.textContent = getTotalPrice().toLocaleString() + ' сомони';
        }
        
        updateCartCount();
    }
    
    // Глобальные функции для кнопок
    window.cartIncrease = function(id) {
        const item = cart.find(i => i.id === id);
        if (item) updateQuantity(id, item.quantity + 1);
    };
    
    window.cartDecrease = function(id) {
        const item = cart.find(i => i.id === id);
        if (item && item.quantity > 1) {
            updateQuantity(id, item.quantity - 1);
        } else {
            removeFromCart(id);
        }
    };
    
    window.cartRemove = function(id) {
        removeFromCart(id);
    };
    
    // Обратная связь при добавлении
    function showAddToCartFeedback() {
        // Можно добавить всплывашку "Товар добавлен!"
        console.log('✅ Товар добавлен в корзину!');
    }
    
    // ============================================
    // Кнопки "В корзину" на карточках товаров
    // ============================================
    
    document.querySelectorAll('.product-card__cart-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const product = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                price: this.getAttribute('data-price'),
                img: this.getAttribute('data-img'),
                cat: this.getAttribute('data-cat')
            };
            
            addToCart(product);
            
            // Анимация кнопки
            this.textContent = '✓ Добавлено';
            this.style.background = '#00c853';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
                this.style.background = '';
            }, 1500);
        });
    });
    
    // ============================================
    // Открытие/закрытие корзины
    // ============================================
    
    // Открыть по клику на корзину в хедере
    const headerCartBtn = document.querySelector('.header__action--cart');
    if (headerCartBtn) {
        headerCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    // Закрыть
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    
    // Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartPanel && cartPanel.classList.contains('active')) {
            closeCart();
        }
    });
    
    // Кнопка "Перейти в каталог" в пустой корзине
    const cartEmptyBtn = document.getElementById('cartEmptyBtn');
    if (cartEmptyBtn) {
        cartEmptyBtn.addEventListener('click', function() {
            closeCart();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Загружаем корзину при старте
    loadCart();
    updateCartCount();
    
    console.log('Модуль корзины загружен. Товаров:', cart.length);


        // ============================================
    // CHECKOUT - Оформление заказа
    // ============================================
    
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const checkoutClose = document.getElementById('checkoutClose');
    const checkoutBack = document.getElementById('checkoutBack');
    
    let currentCheckoutStep = 1;
    
    function openCheckout() {
        if (!checkoutModal) return;
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        goToStep(1);
        renderCheckoutItems();
        updateCheckoutSummary();
    }
    
    function closeCheckout() {
        if (!checkoutModal) return;
        checkoutModal.classList.remove('active');
        if (!cartPanel.classList.contains('active') &&
            !favPanel.classList.contains('active') &&
            !mobileMenu.classList.contains('active')) {
            document.body.style.overflow = '';
        }
        currentCheckoutStep = 1;
    }
    
    window.closeCheckout = closeCheckout;
    
    function goToStep(step) {
        // Скрываем все шаги
        document.querySelectorAll('.checkout-step-content').forEach(s => s.classList.remove('active'));
        // Показываем нужный
        const stepEl = document.getElementById('step' + step);
        if (stepEl) stepEl.classList.add('active');
        
        // Обновляем индикатор шагов
        document.querySelectorAll('.checkout-step').forEach((s, i) => {
            s.classList.remove('active', 'completed');
            if (i + 1 < step) s.classList.add('completed');
            if (i + 1 === step) s.classList.add('active');
        });
        
        // Обновляем линии
        document.querySelectorAll('.checkout-step__line').forEach((line, i) => {
            if (i + 1 < step) line.classList.add('completed');
            else line.classList.remove('completed');
        });
        
        currentCheckoutStep = step;
        
        // Показать/скрыть кнопку Назад
        if (checkoutBack) {
            checkoutBack.style.display = step > 1 ? 'flex' : 'none';
        }
        
        // Обновить сумму если шаг 2
        if (step === 2) updateCheckoutSummary();
    }
    
    window.goToStep = goToStep;
    
    function renderCheckoutItems() {
        const container = document.getElementById('checkoutOrderItems');
        if (!container || cart.length === 0) return;
        
        container.innerHTML = cart.map(item => `
            <div class="checkout-order__item">
                <span>${item.img}</span>
                <span class="checkout-order__item-name">${item.name}</span>
                <span class="checkout-order__item-qty">×${item.quantity}</span>
                <span class="checkout-order__item-price">${(item.price * item.quantity).toLocaleString()} с.</span>
            </div>
        `).join('');
        
        document.getElementById('checkoutItemCount').textContent = cart.reduce((s, i) => s + i.quantity, 0);
    }
    
    function updateCheckoutSummary() {
        const subtotal = getTotalPrice();
        const deliveryCost = document.querySelector('input[name="delivery"]:checked')?.value === 'pickup' ? 0 : 30;
        
        document.getElementById('checkoutSubtotal').textContent = subtotal.toLocaleString() + ' сомони';
        document.getElementById('checkoutDeliveryCost').textContent = deliveryCost === 0 ? 'Бесплатно' : deliveryCost + ' сомони';
        document.getElementById('checkoutFinalTotal').textContent = (subtotal + deliveryCost).toLocaleString() + ' сомони';
    }
    
        function placeOrder() {
        const name = document.getElementById('checkoutName')?.value.trim();
        const phone = document.getElementById('checkoutPhone')?.value.trim();
        const address = document.getElementById('checkoutAddress')?.value.trim();
        const city = document.getElementById('checkoutCity')?.value || 'Душанбе';
        const comment = document.getElementById('checkoutComment')?.value || '';
        const delivery = document.querySelector('input[name="delivery"]:checked')?.value || 'courier';
        const payment = document.querySelector('input[name="payment"]:checked')?.value || 'card';
        
        if (!name || !phone || !address) {
            showToast('Ошибка', 'Заполните обязательные поля: Имя, Телефон, Адрес', 'error');
            goToStep(1);
            return;
        }
        
        const orderNumber = 'SX-' + Date.now().toString().slice(-8);
        const totalPrice = getTotalPrice() + (delivery === 'pickup' ? 0 : 30);
        
        const order = {
            id: orderNumber,
            date: new Date().toISOString(),
            status: 'processing',
            statusText: 'В обработке',
            userId: currentUser ? currentUser.phone : 'guest',
            customer: {
                name: currentUser ? currentUser.name : name,
                phone: phone,
                city: city,
                address: address,
                comment: comment
            },
            delivery: delivery,
            payment: payment,
            items: [...cart],
            total: totalPrice,
            trackSteps: [
                { label: 'Заказ принят', completed: true, current: false },
                { label: 'В обработке', completed: false, current: true },
                { label: 'В пути', completed: false, current: false },
                { label: 'Доставлен', completed: false, current: false }
            ]
        };
        
        // Сохраняем заказ
        saveOrder(order);
        
        // Отправляем в Telegram
        sendOrderToTelegram(order);
        
        // Заполняем детали для шага 3
        document.getElementById('orderNumber').textContent = orderNumber;
        document.getElementById('orderName').textContent = order.customer.name;
        document.getElementById('orderPhone').textContent = phone;
        document.getElementById('orderAddress').textContent = city + ', ' + address;
        document.getElementById('orderTotal').textContent = totalPrice.toLocaleString() + ' сомони';
        
        // Очищаем корзину
        cart = [];
        saveCart();
        updateCartCount();
        
        // Показываем уведомление о доставке
        showOrderNotification();
        
        goToStep(3);
    }
    
    window.placeOrder = placeOrder;
    

           // Отправка заказа в Telegram
    function sendOrderToTelegram(order) {
        const BOT_TOKEN = '8265957442:AAFWnqXyl8TJJzZXsv3vxXRCuWwWd_aY9mE';
        const CHAT_ID = '5282056467';
        const CHANNEL_ID = '-1002854630161';
        
        const itemsList = order.items.map(function(item, i) {
            return (i + 1) + '. ' + item.name + ' ×' + item.quantity + ' — ' + (item.price * item.quantity).toLocaleString() + ' с.';
        }).join('\n');
        
        const message = 
            '🛍 НОВЫЙ ЗАКАЗ!\n\n' +
            '📦 Заказ: ' + order.id + '\n' +
            '📅 Дата: ' + new Date(order.date).toLocaleString('ru-RU') + '\n\n' +
            '👤 Клиент: ' + order.customer.name + '\n' +
            '📞 Телефон: ' + order.customer.phone + '\n' +
            '📍 Город: ' + order.customer.city + '\n' +
            '🏠 Адрес: ' + order.customer.address + '\n\n' +
            '📋 Товары:\n' + itemsList + '\n\n' +
            '💰 Итого: ' + order.total.toLocaleString() + ' сомони';
        
        // Кнопки
        var inlineKeyboard = {
            inline_keyboard: [[
                { text: '✅ Доставлен', callback_data: 'delivered_' + order.id },
                { text: '❌ Отменить', callback_data: 'cancel_' + order.id }
            ]]
        };
        
        // Отправляем тебе в ЛС с кнопками
        fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                reply_markup: JSON.stringify(inlineKeyboard)
            })
        }).then(function(r) { return r.json(); })
          .then(function(d) { console.log('📩 Заказ тебе:', d.ok ? '✅' : '❌'); });
        
        // Через 15 секунд отправляем в канал
        setTimeout(function() {
            var channelMsg = 
                '🛍 *Принять заказ:*\n\n' +
                '📦 Заказ: ' + order.id + '\n' +
                '👤 *Имя:* ' + order.customer.name + '\n' +
                '📞 *Телефон:* ' + order.customer.phone + '\n' +
                '📋 *Товары:*\n' + itemsList + '\n\n' +
                '💰 *Итого:* ' + order.total.toLocaleString() + ' с.\n\n' +
                '✅ *Ваш заказ принят!*\n' +
                '🚚 Заказ доставляется из Китая в Душанбе\n' +
                '📦 Срок доставки: 12-18 дней\n' +
                '🙏 Спасибо за заказ!';
            
            fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: channelMsg
                })
            }).then(function(r) { return r.json(); })
              .then(function(d) { console.log('📢 В канал:', d.ok ? '✅' : '❌'); });
        }, 15000);
    }
    
    // Уведомление о доставке
    function showOrderNotification() {
        const notify = document.getElementById('orderNotify');
        if (!notify) return;
        notify.classList.add('show');
        setTimeout(function() {
            notify.classList.remove('show');
        }, 8000);
    }
    
            // ============================================
    // ПРОВЕРКА КНОПОК TELEGRAM
    // ============================================
    var lastUpdateId = 0;
    
    function checkTelegramUpdates() {
        var url = 'https://api.telegram.org/bot' + BOT_ORDER + '/getUpdates?timeout=5&limit=5';
        if (lastUpdateId > 0) {
            url += '&offset=' + (lastUpdateId + 1);
        }
        
        fetch(url)
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.ok && data.result && data.result.length > 0) {
                    data.result.forEach(function(update) {
                        lastUpdateId = update.update_id;
                        
                        if (update.callback_query) {
                            var cb = update.callback_query;
                            var data_text = cb.data;
                            var chatId = cb.message.chat.id;
                            var messageId = cb.message.message_id;
                            var callbackId = cb.id;
                            
                            console.log('🔘 Кнопка нажата:', data_text);
                            
                            // Удаляем сообщение с кнопками
                            fetch('https://api.telegram.org/bot' + BOT_ORDER + '/deleteMessage', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ chat_id: chatId, message_id: messageId })
                            });
                            
                            // ✅ Доставлен
                            if (data_text.startsWith('delivered_')) {
                                var orderId = data_text.replace('delivered_', '');
                                
                                var order = orders.find(function(o) { return o.id === orderId; });
                                if (order) {
                                    order.status = 'completed';
                                    order.trackSteps = [
                                        { label: 'Заказ принят', completed: true, current: false },
                                        { label: 'В обработке', completed: true, current: false },
                                        { label: 'В пути', completed: true, current: false },
                                        { label: 'Доставлен', completed: true, current: false }
                                    ];
                                    localStorage.setItem('shopxand_orders', JSON.stringify(orders));
                                }
                                
                                fetch('https://api.telegram.org/bot' + BOT_ORDER + '/sendMessage', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        chat_id: CHANNEL_ID,
                                        text: '✅ ЗАКАЗ ДОСТАВЛЕН!\n📦 ' + orderId
                                    })
                                });
                                
                                fetch('https://api.telegram.org/bot' + BOT_ORDER + '/answerCallbackQuery', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ callback_query_id: callbackId, text: '✅ Доставка подтверждена!' })
                                });
                            }
                            
                            // ❌ Отменить
                            if (data_text.startsWith('cancel_')) {
                                var orderId = data_text.replace('cancel_', '');
                                
                                orders = orders.filter(function(o) { return o.id !== orderId; });
                                localStorage.setItem('shopxand_orders', JSON.stringify(orders));
                                
                                fetch('https://api.telegram.org/bot' + BOT_ORDER + '/sendMessage', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        chat_id: CHANNEL_ID,
                                        text: '❌ ЗАКАЗ ОТМЕНЁН!\n📦 ' + orderId
                                    })
                                });
                                
                                fetch('https://api.telegram.org/bot' + BOT_ORDER + '/answerCallbackQuery', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ callback_query_id: callbackId, text: '❌ Заказ отменён!' })
                                });
                            }
                            
                            // ✅ Да, отменить (запрос от клиента)
                            if (data_text.startsWith('approve_cancel_')) {
                                var orderId = data_text.replace('approve_cancel_', '');
                                
                                orders = orders.filter(function(o) { return o.id !== orderId; });
                                localStorage.setItem('shopxand_orders', JSON.stringify(orders));
                                
                                fetch('https://api.telegram.org/bot' + BOT_ORDER + '/sendMessage', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        chat_id: CHANNEL_ID,
                                        text: '❌ ЗАКАЗ ОТМЕНЁН!\n📦 ' + orderId
                                    })
                                });
                                
                                fetch('https://api.telegram.org/bot' + BOT_ORDER + '/answerCallbackQuery', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ callback_query_id: callbackId, text: '✅ Заказ отменён!' })
                                });
                            }
                            
                            // ❌ Нет, оставить
                            if (data_text.startsWith('reject_cancel_')) {
                                var orderId = data_text.replace('reject_cancel_', '');
                                
                                var order = orders.find(function(o) { return o.id === orderId; });
                                if (order) {
                                    order.status = 'processing';
                                    order.trackSteps = [
                                        { label: 'Заказ принят', completed: true, current: false },
                                        { label: 'В обработке', completed: false, current: true },
                                        { label: 'В пути', completed: false, current: false },
                                        { label: 'Доставлен', completed: false, current: false }
                                    ];
                                    localStorage.setItem('shopxand_orders', JSON.stringify(orders));
                                }
                                
                                fetch('https://api.telegram.org/bot' + BOT_ORDER + '/answerCallbackQuery', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ callback_query_id: callbackId, text: '❌ Отмена отклонена' })
                                });
                            }
                        }
                    });
                    
                    // Продолжаем проверку сразу
                    setTimeout(checkTelegramUpdates, 500);
                } else {
                    // Проверяем снова через 2 секунды
                    setTimeout(checkTelegramUpdates, 2000);
                }
            })
            .catch(function(err) {
                console.log('Ошибка:', err);
                setTimeout(checkTelegramUpdates, 3000);
            });
    }
    
    // Запускаем проверку
    checkTelegramUpdates();

        // ============================================
    // SUPPORT WIDGET
    // ============================================
    
    const supportWidget = document.getElementById('supportWidget');
    const supportOverlay = document.getElementById('supportOverlay');
    const supportClose = document.getElementById('supportClose');
    
    function openSupport() {
        supportWidget.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeSupport() {
        supportWidget.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (supportOverlay) supportOverlay.addEventListener('click', closeSupport);
    if (supportClose) supportClose.addEventListener('click', closeSupport);
    
    // Долгий клик на кнопку Telegram открывает виджет
    const telegramBtn = document.getElementById('telegramBtn');
    let pressTimer;
    
    if (telegramBtn) {
        telegramBtn.addEventListener('click', function(e) {
            // Короткий клик — открывает Telegram
            // Длинный клик (>1 сек) — открывает виджет
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
                return;
            }
        });
        
        telegramBtn.addEventListener('mousedown', function() {
            pressTimer = setTimeout(function() {
                openSupport();
                pressTimer = null;
            }, 1000);
        });
        
        telegramBtn.addEventListener('mouseup', function() {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        });
    }
    
    // Отправка формы поддержки
    document.getElementById('supportForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('supportName').value.trim();
        const phone = document.getElementById('supportPhone').value.trim();
        const message = document.getElementById('supportMessage').value.trim();
        
        if (!name || !phone) {
            showToast('Ошибка', 'Заполните имя и телефон', 'error');
            return;
        }
        
        const BOT_TOKEN = '8265957442:AAFWnqXyl8TJJzZXsv3vxXRCuWwWd_aY9mE'; // ← ЗАМЕНИ
        const CHAT_ID = '5282056467';     // ← ЗАМЕНИ
        
        const text = '📩 *Сообщение от клиента*\n\n' +
            '👤 *Имя:* ' + name + '\n' +
            '📞 *Телефон:* ' + phone + '\n' +
            '💬 *Вопрос:* ' + (message || '—');
        
        fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, })
        });
        
        closeSupport();
        showToast('Отправлено!', 'Менеджер свяжется с вами', 'success');
        this.reset();
    });
    
    // Закрытие уведомления
    document.getElementById('notifyClose')?.addEventListener('click', function() {
        document.getElementById('orderNotify')?.classList.remove('show');
    });
    
    // Кнопка "Оформить заказ" в корзине
    const checkoutBtn = document.querySelector('.cart-panel__checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            closeCart();
            setTimeout(openCheckout, 400);
        });
    }
    
    // Кнопка Назад
    if (checkoutBack) {
        checkoutBack.addEventListener('click', function() {
            if (currentCheckoutStep > 1) {
                goToStep(currentCheckoutStep - 1);
            }
        });
    }
    
    // Закрытие
    if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);
    if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);
    
    // Обновление суммы при смене доставки
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateCheckoutSummary();
            // Обновляем активный класс
            document.querySelectorAll('.checkout-delivery__option').forEach(opt => opt.classList.remove('active'));
            this.closest('.checkout-delivery__option').classList.add('active');
        });
    });
    
    // Обновление активного класса при выборе оплаты
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.checkout-payment__option').forEach(opt => opt.classList.remove('active'));
            this.closest('.checkout-payment__option').classList.add('active');
        });
    });
    
    console.log('Модуль оформления заказа загружен');



    // ============================================
    // ORDERS - Мои заказы
    // ============================================
    
    const ordersPanel = document.getElementById('ordersPanel');
    const ordersOverlay = document.getElementById('ordersOverlay');
    const ordersClose = document.getElementById('ordersClose');
    const ordersList = document.getElementById('ordersList');
    const ordersEmpty = document.getElementById('ordersEmpty');
    const ordersCount = document.getElementById('ordersCount');
    
    let orders = [];

        window.deleteOrder = function(orderId) {
        showConfirm('Удалить заказ?', 'Заказ ' + orderId + ' будет удалён навсегда', function() {
            orders = orders.filter(o => o.id !== orderId);
            localStorage.setItem('shopxand_orders', JSON.stringify(orders));
            window.closeOrderDetail();
            renderOrders();
        });
    };

    const confirmModal = document.getElementById('confirmModal');
    const confirmOverlay = document.getElementById('confirmOverlay');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmOk = document.getElementById('confirmOk');
    let confirmCallback = null;

    function showConfirm(title, message, callback) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        confirmCallback = callback;
        confirmModal.classList.add('active');
    }
    function hideConfirm() { confirmModal.classList.remove('active'); confirmCallback = null; }
    confirmCancel?.addEventListener('click', hideConfirm);
    confirmOverlay?.addEventListener('click', hideConfirm);
    confirmOk?.addEventListener('click', function() {
        if (confirmCallback) confirmCallback();
        hideConfirm();
    });

    
              window.cancelOrder = function(orderId) {
        showConfirm(
            'Отменить заказ?',
            'Запрос на отмену будет отправлен. Ожидайте подтверждения.',
            function() {
                // Находим заказ
                var order = orders.find(function(o) { return o.id === orderId; });
                if (!order) return;
                
                // Меняем статус на ожидание отмены
                order.status = 'pending_cancel';
                order.trackSteps = [
                    { label: 'Заказ принят', completed: true, current: false },
                    { label: 'В обработке', completed: true, current: false },
                    { label: 'Ожидает отмены', completed: false, current: true },
                    { label: 'Отменён', completed: false, current: false }
                ];
                localStorage.setItem('shopxand_orders', JSON.stringify(orders));
                
                // Отправляем запрос на отмену тебе в Telegram с кнопками
                var cancelMsg = 
                    '⚠️ *ЗАПРОС НА ОТМЕНУ!*\n\n' +
                    '📦 *Заказ:* ' + order.id + '\n' +
                    '👤 *Клиент:* ' + order.customer.name + '\n' +
                    '📞 *Телефон:* ' + order.customer.phone + '\n' +
                    '📍 *Адрес:* ' + order.customer.city + ', ' + order.customer.address + '\n' +
                    '💰 *Сумма:* ' + order.total.toLocaleString() + ' с.\n\n' +
                    'Клиент хочет отменить заказ.';
                
                var inlineKeyboard = {
                    inline_keyboard: [[
{ text: '✅ Да, отменить', callback_data: 'approve_cancel_' + order.id },
{ text: '❌ Нет, оставить', callback_data: 'reject_cancel_' + order.id }
                    ]]
                };
                
                fetch('https://api.telegram.org/bot' + BOT_ORDER + '/sendMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
chat_id: CHAT_ID,
text: cancelMsg,
reply_markup: JSON.stringify(inlineKeyboard)
                    })
                }).then(function(r) { return r.json(); })
                  .then(function(d) {
                    if (d.ok) {
// Сохраняем message_id для удаления потом
var cancelRequests = JSON.parse(localStorage.getItem('shopxand_cancel_requests') || '{}');
cancelRequests[order.id] = d.result.message_id;
localStorage.setItem('shopxand_cancel_requests', JSON.stringify(cancelRequests));

showToast('Запрос отправлен', 'Ожидайте подтверждения от менеджера', 'success');
                    }
                });
                
                renderOrders();
            }
        );
    };

    // Загрузка заказов
    function loadOrders() {
        const savedOrders = localStorage.getItem('shopxand_orders');
        if (savedOrders) {
            orders = JSON.parse(savedOrders);
        }
    }
    
    // Сохранение заказа
    function saveOrder(order) {
        orders.unshift(order); // Добавляем в начало
        localStorage.setItem('shopxand_orders', JSON.stringify(orders));
        updateOrdersCount();
    }
    
        function updateOrdersCount(count) {
        var total = count !== undefined ? count : orders.length;
        if (ordersCount) {
            var word = getOrderWord(total);
            ordersCount.textContent = total + ' ' + word;
        }
    }
    function getOrderWord(count) {
        if (count % 10 === 1 && count % 100 !== 11) return 'заказ';
        if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'заказа';
        return 'заказов';
    }
    
        function getStatusClass(status) {
        switch(status) {
            case 'processing': return 'order-card__status--processing';
            case 'delivery': return 'order-card__status--delivery';
            case 'completed': return 'order-card__status--completed';
            case 'cancelled': return 'order-card__status--cancelled';
            case 'pending_cancel': return 'order-card__status--cancelled';
            default: return '';
        }
    }
    
    function getStatusText(status) {
        switch(status) {
            case 'processing': return 'В обработке';
            case 'delivery': return 'В пути';
            case 'completed': return 'Доставлен';
            case 'cancelled': return 'Отменён';
            case 'pending_cancel': return 'Ожидает отмены';
            default: return status;
        }
    }
    
    
        // Отрисовать заказы
    function renderOrders() {
        if (!ordersList) return;
        
         // Фильтруем заказы: показываем только заказы текущего пользователя
        var filteredOrders = orders;
        if (currentUser) {
            filteredOrders = orders.filter(function(order) {
                return order.userId === currentUser.phone || order.customer.phone === currentUser.phone;
            });
        }
        
        if (filteredOrders.length === 0) {
            ordersList.innerHTML = '';
            ordersEmpty.style.display = 'flex';
        } else {
            ordersEmpty.style.display = 'none';
            
            ordersList.innerHTML = filteredOrders.map(order => {
                const date = new Date(order.date);
                const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
                
                // Расчёт времени доставки
                let deliveryInfo = '';
                if (order.status === 'processing') {
                    deliveryInfo = 'Доставка через 1-3 дня';
                } else if (order.status === 'delivery') {
                    deliveryInfo = 'Доставка сегодня-завтра';
                } else if (order.status === 'completed') {
                    deliveryInfo = 'Заказ доставлен';
                }
                
                return `
                <div class="order-card">
                    <div class="order-card__header">
<div>
    <div class="order-card__number">${order.id}</div>
    <div class="order-card__date">${dateStr}</div>
    <div class="order-card__customer">👤 ${order.customer.name}</div> <!-- ← добавить -->

</div>
<span class="order-card__status ${getStatusClass(order.status)}">${getStatusText(order.status)}</span>
                    </div>
                    
                    <!-- Отслеживание -->
                    <div class="order-track">
${(order.trackSteps || []).map((step, i, arr) => `
    <div class="order-track__step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}">
        <div class="order-track__dot"></div>
        ${i < arr.length - 1 ? '<div class="order-track__line"></div>' : ''}
        <div class="order-track__label">${step.label}</div>
    </div>
`).join('')}
                    </div>
                    
                    <!-- Информация о доставке -->
                    <div class="order-card__delivery-info">
<i class="fas fa-truck"></i>
<span>${deliveryInfo}</span>
                    </div>
                    
                    <!-- Товары -->
                    <div class="order-card__items">
${order.items.map(item => `
    <div class="order-card__item">
    <span class="order-card__item-icon">
    ${item.img && (item.img.endsWith('.png') || item.img.endsWith('.jpg') || item.img.endsWith('.jpeg') || item.img.endsWith('.webp'))
        ? `<img src="${item.img}" alt="${item.name}" style="width:24px;height:24px;object-fit:contain;vertical-align:middle;">`
        : item.img || '📦'
    }
</span>
        <span class="order-card__item-name">${item.name}</span>
        <span class="order-card__item-qty">×${item.quantity}</span>
    </div>
`).join('')}
                    </div>
                    
                     <div class="order-card__footer">
        <span class="order-card__total">${order.total.toLocaleString()} сомони</span>
        <div style="display: flex; gap: 6px;">
            ${order.status !== 'cancelled' && order.status !== 'completed' ? `
                <button class="order-card__cancel-btn" onclick="window.cancelOrder('${order.id}')">
                    <i class="fas fa-times"></i> Отменить
                </button>
            ` : ''}
            <button class="order-card__delete-btn" onclick="window.deleteOrder('${order.id}')">
                <i class="fas fa-trash-alt"></i> Удалить
            </button>
            <button class="order-card__details-btn" onclick="window.showOrderDetail('${order.id}')">
                Детали
            </button>
        </div>
    </div>
                    
                `;
            }).join('');
        }
        
        updateOrdersCount(filteredOrders.length);
    }

    
    // Показать детали заказа
    function showOrderDetail(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        
        // Удаляем старый popup если есть
        const oldPopup = document.querySelector('.order-detail-popup');
        const oldOverlay = document.querySelector('.order-detail-popup__overlay');
        if (oldPopup) oldPopup.remove();
        if (oldOverlay) oldOverlay.remove();
        
        const date = new Date(order.date);
        const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const deliveryText = order.delivery === 'pickup' ? 'Самовывоз' : 'Курьерская доставка';
        const paymentText = order.payment === 'card' ? 'Банковская карта' : 'Наличные при получении';
        
        const overlay = document.createElement('div');
        overlay.className = 'order-detail-popup__overlay';
        document.body.appendChild(overlay);
        
        const popup = document.createElement('div');
        popup.className = 'order-detail-popup';
       
        document.body.appendChild(popup);
            popup.innerHTML = `
        <button class="order-detail-popup__close" onclick="window.closeOrderDetail()">
            <i class="fas fa-times"></i>
        </button>
        <h4>Заказ ${order.id}</h4>
        <div class="order-detail-popup__info">
            <div class="order-detail-popup__row">
                <span>Дата</span>
                <span>${dateStr}</span>
            </div>
            <div class="order-detail-popup__row">
                <span>Статус</span>
                <span>${getStatusText(order.status)}</span>
            </div>
            <div class="order-detail-popup__row">
                <span>Имя</span>
                <span>${order.customer.name}</span>
            </div>
            <div class="order-detail-popup__row">
                <span>Телефон</span>
                <span>${order.customer.phone}</span>
            </div>
            <div class="order-detail-popup__row">
                <span>Город</span>
                <span>${order.customer.city}</span>
            </div>
            <div class="order-detail-popup__row">
                <span>Адрес</span>
                <span>${order.customer.address}</span>
            </div>
            <div class="order-detail-popup__row">
                <span>Доставка</span>
                <span>${deliveryText}</span>
            </div>
            <div class="order-detail-popup__row">
                <span>Оплата</span>
                <span>${paymentText}</span>
            </div>
            <div class="order-detail-popup__row">
                <span>Сумма</span>
                <span>${order.total.toLocaleString()} сомони</span>
            </div>
        </div>
        ${order.status !== 'cancelled' && order.status !== 'completed' ? `
            <button class="order-cancel-btn" onclick="window.cancelOrder('${order.id}')">
                <i class="fas fa-times-circle"></i> Отменить заказ
            </button>
        ` : ''}
        ${order.status === 'cancelled' ? `
            <div class="order-cancelled-badge">
                <i class="fas fa-ban"></i> Заказ отменён
            </div>
        ` : ''}
    <button class="order-delete-btn" onclick="window.deleteOrder('${order.id}'); window.closeOrderDetail();">
        <i class="fas fa-trash-alt"></i> Удалить заказ
    </button>

    `;
        setTimeout(() => {
            overlay.classList.add('active');
            popup.classList.add('active');
        }, 10);
    }
    
    window.showOrderDetail = showOrderDetail;
    
    window.closeOrderDetail = function() {
        const popup = document.querySelector('.order-detail-popup');
        const overlay = document.querySelector('.order-detail-popup__overlay');
        if (popup) {
            popup.classList.remove('active');
            overlay.classList.remove('active');
            setTimeout(() => {
                popup.remove();
                overlay.remove();
            }, 300);
        }
    };
    
    // Открытие/закрытие панели заказов
    function openOrders() {
        ordersPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderOrders();
    }
    
    function closeOrders() {
        ordersPanel.classList.remove('active');
        if (!cartPanel.classList.contains('active') &&
            !favPanel.classList.contains('active') &&
            !mobileMenu.classList.contains('active') &&
            !checkoutModal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }
    
    // Кнопка "Заказы" в хедере
    const headerOrdersBtn = document.querySelector('.header__action--orders, .header__action:nth-child(2)');
    if (headerOrdersBtn) {
        headerOrdersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openOrders();
        });
    }
    
    // Заказы в мобильном меню
    const mobileOrdersLink = document.querySelector('.mobile-menu__action i.fa-box')?.parentElement;
    if (mobileOrdersLink) {
        mobileOrdersLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            setTimeout(openOrders, 400);
        });
    }
    
    // Закрытие
    if (ordersOverlay) ordersOverlay.addEventListener('click', closeOrders);
    if (ordersClose) ordersClose.addEventListener('click', closeOrders);
    
    // Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && ordersPanel && ordersPanel.classList.contains('active')) {
            closeOrders();
        }
    });
    
    // Кнопка "Перейти в каталог"
    const ordersEmptyBtn = document.getElementById('ordersEmptyBtn');
    if (ordersEmptyBtn) {
        ordersEmptyBtn.addEventListener('click', function() {
            closeOrders();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Загрузка при старте
    loadOrders();
    updateOrdersCount();
    
    console.log('Модуль заказов загружен. Заказов:', orders.length);


        // ============================================
    // AUTO TRACKING - Авто-обновление статусов
    // ============================================
    
    function updateOrderStatusAutomatically() {
        const now = new Date();
        let hasChanges = false;
        
        orders.forEach(function(order) {
            const orderDate = new Date(order.date);
            const minutesPassed = (now - orderDate) / 1000 / 60;
            
            // Обновляем статус в зависимости от времени
            if (order.status !== 'cancelled') {
                let newStatus = order.status;
                let trackSteps = order.trackSteps || [];
                
                if (minutesPassed >= 60 && order.status === 'processing') {
                    // Через 1 час - в пути
                    newStatus = 'delivery';
                    trackSteps = [
{ label: 'Заказ принят', completed: true, current: false },
{ label: 'В обработке', completed: true, current: false },
{ label: 'В пути', completed: false, current: true },
{ label: 'Доставлен', completed: false, current: false }
                    ];
                    hasChanges = true;
                }
                
                if (minutesPassed >= 180 && order.status === 'delivery') {
                    // Через 3 часа - доставлен
                    newStatus = 'completed';
                    trackSteps = [
{ label: 'Заказ принят', completed: true, current: false },
{ label: 'В обработке', completed: true, current: false },
{ label: 'В пути', completed: true, current: false },
{ label: 'Доставлен', completed: true, current: false }
                    ];
                    hasChanges = true;
                }
                
                if (newStatus !== order.status) {
                    order.status = newStatus;
                    order.trackSteps = trackSteps;
                }
            }
        });
        
        if (hasChanges) {
            localStorage.setItem('shopxand_orders', JSON.stringify(orders));
        }
    }
    
    

        // ============================================
    // TELEGRAM NOTIFY — Уведомление через 18 дней
    // ============================================
    
    function checkDeliveryNotifications() {
        const now = new Date();
        const BOT_TOKEN = '8265957442:AAFWnqXyl8TJJzZXsv3vxXRCuWwWd_aY9mE';
        const CHAT_ID = '-1002854630161';
        
        orders.forEach(function(order) {
            if (order.status === 'completed' || order.status === 'cancelled') return;
            
            const orderDate = new Date(order.date);
            const daysPassed = (now - orderDate) / (1000 * 60 * 60 * 24);
            
            // Через 18 дней — уведомление
            if (daysPassed >= 18 && !order.notified18days) {
                order.notified18days = true;
                order.status = 'completed';
                order.trackSteps = [
                    { label: 'Заказ принят', completed: true, current: false },
                    { label: 'В обработке', completed: true, current: false },
                    { label: 'В пути', completed: true, current: false },
                    { label: 'Доставлен', completed: true, current: false }
                ];
                
                // Сохраняем
                localStorage.setItem('shopxand_orders', JSON.stringify(orders));
                
                // Отправляем в Telegram
                var message = 
                    '✅ ЗАКАЗ ДОСТАВЛЕН!\n\n' +
                    '📦 Заказ: ' + order.id + '\n' +
                    '👤 Клиент: ' + order.customer.name + '\n' +
                    '📞 Телефон: ' + order.customer.phone + '\n' +
                    '📍 Адрес: ' + order.customer.city + ', ' + order.customer.address + '\n' +
                    '💰 Сумма: ' + order.total.toLocaleString() + ' с.\n\n' +
                    'Прошло 18 дней с момента заказа.';
                
                fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
chat_id: CHAT_ID,
text: message
                    })
                });
                
                console.log('✅ Уведомление о доставке заказа ' + order.id);
            }
        });
    }
    

    // ✅ ОДИН БЛОК ВМЕСТО ДВУХ
setInterval(function() {
    updateOrderStatusAutomatically();
    checkDeliveryNotifications();
}, 60000); // каждую минуту

// Проверяем при загрузке
updateOrderStatusAutomatically();
checkDeliveryNotifications();
    

        // ============================================
    // SEARCH - Поиск товаров
    // ============================================
    
    const searchInput = document.getElementById('searchInput');
    const searchBlock = document.getElementById('searchBlock');
   const productGrid = document.getElementById('productsGrid') || document.querySelector('.products__grid');
    // Собираем все товары со страницы
    function getAllProducts() {
        const products = [];
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach(function(card) {
            const name = card.querySelector('.product-card__name')?.textContent || '';
            const cat = card.querySelector('.product-card__cat')?.textContent || '';
            const cartBtn = card.querySelector('.product-card__cart-btn');
            
            products.push({
                card: card,
                name: name.toLowerCase(),
                cat: cat.toLowerCase(),
                id: cartBtn?.getAttribute('data-id') || '',
                price: cartBtn?.getAttribute('data-price') || '0',
                img: cartBtn?.getAttribute('data-img') || '📦'
            });
        });
        
        return products;
    }
    
    // Поиск
    function searchProducts(query) {
        const products = getAllProducts();
        query = query.toLowerCase().trim();
        
        let foundCount = 0;
        
        products.forEach(function(product) {
            const card = product.card;
            
            if (query === '') {
                // Показать все
                card.style.display = '';
                card.style.animation = '';
                foundCount++;
            } else if (product.name.includes(query) || product.cat.includes(query)) {
                // Показать совпадения
                card.style.display = '';
                card.style.animation = 'fadeInCard 0.3s ease';
                foundCount++;
            } else {
                // Скрыть несовпадения
                card.style.display = 'none';
            }
        });
        
        // Показать/скрыть сообщение "Ничего не найдено"
        showSearchResult(foundCount, query);
        
        return foundCount;
    }
    
    // Результаты поиска
    function showSearchResult(count, query) {
        // Удаляем старый результат
        const oldResult = document.querySelector('.search-results-info');
        if (oldResult) oldResult.remove();
        
        if (query && count === 0) {
            const noResult = document.createElement('div');
            noResult.className = 'search-results-info';
            noResult.innerHTML = `
                <div class="search-empty">
                    <span>🔍</span>
                    <h3>Ничего не найдено</h3>
                    <p>По запросу "<strong>${query}</strong>" товаров нет</p>
                    <button onclick="window.clearSearch()">Показать все товары</button>
                </div>
            `;
            if (productGrid) {
                productGrid.parentElement.appendChild(noResult);
            }
        } else if (query && count > 0) {
            const resultInfo = document.createElement('div');
            resultInfo.className = 'search-results-info search-results-found';
            resultInfo.innerHTML = `
                <span>Найдено: <strong>${count}</strong> товаров по запросу "<strong>${query}</strong>"</span>
                <button onclick="window.clearSearch()">✕ Сбросить</button>
            `;
            if (productGrid) {
                productGrid.parentElement.insertBefore(resultInfo, productGrid);
            }
        }
    }
    
    // Очистить поиск
    window.clearSearch = function() {
        if (searchInput) {
            searchInput.value = '';
        }
        searchProducts('');
        
        // Скрыть мобильный поиск
        if (searchBlock) {
            searchBlock.classList.remove('active');
        }
    };
    
    // Обработчик ввода
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value;
            searchProducts(query);
        });
        
        // Поиск при нажатии Enter
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                searchProducts(query);
                
                // Прокрутить к товарам
                if (productGrid) {
                    productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
    
    // Поиск по кнопке
    const searchBtn = document.querySelector('.header__search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput?.value.trim() || '';
            searchProducts(query);
            
            if (productGrid) {
                productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    console.log('Модуль поиска загружен');

          // ============================================
    // QUICKVIEW - Быстрый просмотр
    // ============================================
    
    const quickview = document.getElementById('quickview');
    const quickviewOverlay = document.getElementById('quickviewOverlay');
    const quickviewClose = document.getElementById('quickviewClose');
    const qvAddToCart = document.getElementById('qvAddToCart');
    const qvFavorite = document.getElementById('qvFavorite');
    const qvQtyMinus = document.getElementById('qvQtyMinus');
    const qvQtyPlus = document.getElementById('qvQtyPlus');
    const qvQty = document.getElementById('qvQty');
    
    let currentQvProduct = null;
    let qvQuantity = 1;
    
    // Данные товаров для быстрого просмотра
    const productsData = {
        '1': {
            id: '1',
            name: 'Вельветовая рубашка с длинными рукавами',
            cat: 'Одежда',
            price: 120,
            oldPrice: 180,
            discount: '-33%',
            img: 'img/Рубашка.jpeg',
            rating: 4.8,
            reviews: 324,
            desc: 'Стильная вельветовая рубашка. Мягкая ткань, удобный крой.',
            sizes: ['X', 'XL', '2XL', '3XL'],
            specs: [
                ['Материал', 'Вельвет 100%'],
                ['Размеры', 'X, XL, 2XL, 3XL'],
                ['Качество', 'Премиум'],
                ['Сезон', 'Весна-Осень'],
                ['Цвет', 'Чёрный']
            ],
            thumbs: ['img/Рубашка.jpeg', 'img/Рубашка.jpeg', 'img/Рубашка.jpeg']
        },
        '2': {
            id: '2',
            name: 'Крассовка AF1 Air Force 1',
            cat: 'Одежда',
            price: 110,
            oldPrice: null,
            discount: null,
            img: 'img/Крассовка.jpeg',
            rating: 4.6,
            reviews: 189,
            desc: 'Крассовка AF1 Air Force 1, лучшая модель белая',
            shoeSizes: ['38', '39', '40', '41', '42', '43', '44'],
            specs: [
                ['Материал', 'Кожа'],
                ['Размер', '38-44'],
                ['Стиль', 'Повседневный'],
                ['Сезон', 'Все сезоны']
            ],
            thumbs: ['img/Крассовка.jpeg', 'img/Крассовка.jpeg', 'img/Крассовка.jpeg']
        },
        '3': {
            id: '3',
            name: 'Крассовка в британском стиле',
            cat: 'Одежда',
            price: 140,
            oldPrice: 250,
            discount: '-44%',
            img: 'img/Крассовка-2.jpeg',
            rating: 4.9,
            reviews: 512,
            desc: 'Крассовка в британском стиле, премиум качество',
            shoeSizes: ['38', '39', '40', '41', '42', '43', '44'],
            specs: [
                ['Материал', 'Премиум'],
                ['Размер', '38-44'],
                ['Стиль', 'Повседневный'],
                ['Сезон', 'Весна-осень']
            ],
            thumbs: ['img/Крассовка-2.jpeg', 'img/Крассовка-2.jpeg', 'img/Крассовка-2.jpeg']
        },
        '4': {
            id: '4',
            name: 'Проводной наушник',
            cat: 'Электроника',
            price: 2100,
            oldPrice: null,
            discount: null,
            img: 'img/Наушник.jpeg',
            rating: 4.7,
            reviews: 256,
            desc: 'Качественный проводной наушник с микрофоном',
            specs: [
                ['Коннект', 'Проводные'],
                ['Коннектор', '3.5мм'],
                ['Длина кабеля', '1.2м'],
                ['Микрофон', 'Есть']
            ],
            thumbs: ['img/Наушник.jpeg', 'img/Наушник.jpeg', 'img/Наушник.jpeg']
        },
        '5': {
            id: '5',
            name: 'Часы "CHENXI"',
            cat: 'Электроника',
            price: 230,
            oldPrice: 300,
            discount: '-23%',
            img: 'img/watch.jpeg',
            rating: 4.9,
            reviews: 678,
            desc: 'Стильные кварцевые часы CHENXI',
            specs: [
                ['Бренд', 'CHENXI'],
                ['Тип', 'Кварцевые'],
                ['Ремешок', 'Нержавеющая сталь'],
                ['Водозащита', '3ATM']
            ],
            thumbs: ['img/watch.jpeg', 'img/watch.jpeg', 'img/watch.jpeg']
        },
        '6': {
            id: '6',
            name: 'Кожаные тапочки',
            cat: 'Одежда',
            price: 100,
            oldPrice: null,
            discount: null,
            img: 'img/Шилопка-2.jpeg',
            rating: 4.7,
            reviews: 432,
            desc: 'Кожаные тапочки, натуральная кожа',
            shoeSizes: ['38', '39', '40', '41', '42', '43', '44'],
            specs: [
                ['Материал', 'Натуральная кожа'],
                ['Подошва', 'Резиновая'],
                ['Тип', 'Домашние тапочки'],
                ['Цвет', 'Черный']
            ],
            thumbs: ['img/Шилопка-2.jpeg', 'img/Шилопка-2.jpeg', 'img/Шилопка-2.jpeg']
        },
        '7': {
            id: '7',
            name: 'Знак Mercedes Benz',
            cat: 'Электроника',
            price: 80,
            oldPrice: 90,
            discount: '-11%',
            img: 'img/Знак Мерса.jpeg',
            rating: 4.8,
            reviews: 156,
            desc: 'Металлический знак Mercedes-Benz',
            specs: [
                ['Бренд', 'Mercedes-Benz'],
                ['Материал', 'Металл'],
                ['Цвет', 'Серебристый'],
                ['Размер', '8см']
            ],
            thumbs: ['img/Знак Мерса.jpeg', 'img/Знак Мерса.jpeg', 'img/Знак Мерса.jpeg']
        },
        '8': {
            id: '8',
            name: 'Качественная рубашка с длинными рукавами',
            cat: 'Одежда',
            price: 120,
            oldPrice: null,
            discount: null,
            img: 'img/Рубашка-3.jpeg',
            rating: 4.5,
            reviews: 89,
            desc: 'Качественная рубашка с длинными рукавами',
            sizes: ['X', 'XL', '2XL', '3XL'],
            specs: [
                ['Материал', 'Хлопок + Полиэстер'],
                ['Тип', 'Рубашка с длинными рукавами'],
                ['Цвет', 'Белый'],
                ['Стиль', 'Casual / Classic']
            ],
            thumbs: ['img/Рубашка-3.jpeg', 'img/Рубашка-3.jpeg', 'img/Рубашка-3.jpeg']
        }
    };
    
    // Смена главного изображения
    window.changeQvThumb = function(imgSrc, thumbBtn) {
        const mainImg = document.getElementById('quickviewMainImg');
        if (imgSrc && (imgSrc.startsWith('http') || imgSrc.startsWith('img/') || 
            imgSrc.endsWith('.png') || imgSrc.endsWith('.jpg') || 
            imgSrc.endsWith('.jpeg') || imgSrc.endsWith('.webp'))) {
            mainImg.innerHTML = '<img src="' + imgSrc + '" alt="" style="width:100%;height:100%;object-fit:contain;">';
        } else {
            mainImg.innerHTML = '<span>' + (imgSrc || '📦') + '</span>';
        }
        document.querySelectorAll('.quickview__thumb').forEach(function(t) { t.classList.remove('active'); });
        thumbBtn.classList.add('active');
    };
    
    // Открыть быстрый просмотр
    function openQuickview(productId) {
        const product = productsData[productId];
        if (!product) return;
        
        // Сброс размеров
        var sizeBlock = document.getElementById('quickviewSizeBlock');
        if (sizeBlock) {
            sizeBlock.style.display = 'none';
            var sizesContainer = document.getElementById('quickviewSizes');
            if (sizesContainer) sizesContainer.innerHTML = '';
        }
        
        currentQvProduct = product;
        qvQuantity = 1;
        
        document.getElementById('quickviewCat').textContent = product.cat;
        document.getElementById('quickviewName').textContent = product.name;
        document.getElementById('quickviewDesc').textContent = product.desc;
        document.getElementById('quickviewPrice').textContent = product.price.toLocaleString() + ' сомони';
        document.getElementById('qvQty').textContent = qvQuantity;
        
        // Главное изображение
        const mainImg = document.getElementById('quickviewMainImg');
        if (product.img && (product.img.startsWith('http') || product.img.startsWith('img/') || 
            product.img.endsWith('.png') || product.img.endsWith('.jpg') || 
            product.img.endsWith('.jpeg') || product.img.endsWith('.webp'))) {
            mainImg.innerHTML = '<img src="' + product.img + '" alt="' + product.name + '" style="width:100%;height:100%;object-fit:contain;">';
        } else {
            mainImg.innerHTML = '<span>' + (product.img || '📦') + '</span>';
        }
        
        // Миниатюры
        const thumbs = document.getElementById('quickviewThumbs');
        thumbs.innerHTML = product.thumbs.map(function(thumb, i) {
            var isActive = i === 0 ? ' active' : '';
            var content = (thumb && (thumb.startsWith('http') || thumb.startsWith('img/') || 
                thumb.endsWith('.png') || thumb.endsWith('.jpg') || thumb.endsWith('.jpeg') || thumb.endsWith('.webp')))
                ? '<img src="' + thumb + '" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:8px;">'
                : '<span>' + (thumb || '📦') + '</span>';
            return '<button class="quickview__thumb' + isActive + '" onclick="window.changeQvThumb(\'' + thumb + '\', this)">' + content + '</button>';
        }).join('');
        
        // Цена
        if (product.oldPrice) {
            document.getElementById('quickviewPriceOld').textContent = product.oldPrice.toLocaleString() + ' сомони';
            document.getElementById('quickviewPriceOld').style.display = '';
            document.getElementById('quickviewDiscount').textContent = product.discount;
            document.getElementById('quickviewDiscount').style.display = '';
        } else {
            document.getElementById('quickviewPriceOld').style.display = 'none';
            document.getElementById('quickviewDiscount').style.display = 'none';
        }
        
        // Характеристики
        var specsEl = document.querySelector('.quickview__specs');
        specsEl.innerHTML = product.specs.map(function(s) {
            return '<div class="quickview__spec"><span>' + s[0] + '</span><span>' + s[1] + '</span></div>';
        }).join('');
        
        // Рейтинг
        var starsEl = document.querySelector('.quickview__stars');
        starsEl.innerHTML = generateStars(product.rating);
        document.querySelector('.quickview__rating-num').textContent = product.rating;
        document.querySelector('.quickview__reviews').textContent = product.reviews + ' отзывов';
        
        // Избранное
        updateQvFavorite();
        
        // Размеры
        if (sizeBlock) {
            var sizesContainer = document.getElementById('quickviewSizes');
            if (product.cat === 'Одежда') {
                if (product.shoeSizes && product.shoeSizes.length > 0) {
                    sizeBlock.style.display = 'flex';
                    sizeBlock.querySelector('span').textContent = 'Размер обуви:';
                    sizesContainer.innerHTML = '';
                    product.shoeSizes.forEach(function(size, i) {
                        var btn = document.createElement('button');
                        btn.className = 'quickview__size-btn' + (i === 0 ? ' active' : '');
                        btn.setAttribute('data-size', size);
                        btn.textContent = size;
                        btn.onclick = function() {
                            sizesContainer.querySelectorAll('.quickview__size-btn').forEach(function(b) { b.classList.remove('active'); });
                            this.classList.add('active');
                        };
                        sizesContainer.appendChild(btn);
                    });
                } else if (product.sizes && product.sizes.length > 0) {
                    sizeBlock.style.display = 'flex';
                    sizeBlock.querySelector('span').textContent = 'Размер:';
                    sizesContainer.innerHTML = '';
                    product.sizes.forEach(function(size, i) {
                        var btn = document.createElement('button');
                        btn.className = 'quickview__size-btn' + (i === 0 ? ' active' : '');
                        btn.setAttribute('data-size', size);
                        btn.textContent = size;
                        btn.onclick = function() {
                            sizesContainer.querySelectorAll('.quickview__size-btn').forEach(function(b) { b.classList.remove('active'); });
                            this.classList.add('active');
                        };
                        sizesContainer.appendChild(btn);
                    });
                } else {
                    sizeBlock.style.display = 'none';
                }
            } else {
                sizeBlock.style.display = 'none';
            }
        }
        
        // Похожие товары
        renderRelatedProducts(product);
        
        // Открываем
        quickview.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.title = product.name + ' — купить в ShopXand | Цена ' + product.price + ' сомони';
    }
    
    window.openQuickview = openQuickview;
    
    // Закрыть
    function closeQuickview() {
        quickview.classList.remove('active');
        if (!cartPanel.classList.contains('active') &&
            !favPanel.classList.contains('active') &&
            !ordersPanel.classList.contains('active') &&
            !mobileMenu.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }
    
    window.closeQuickview = closeQuickview;
    
    // Звёзды
    function generateStars(rating) {
        var full = Math.floor(rating);
        var half = rating - full >= 0.5;
        var html = '';
        for (var i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
        if (half) html += '<i class="fas fa-star-half-alt"></i>';
        return html;
    }
    
    // Избранное
    function updateQvFavorite() {
        if (!currentQvProduct || !qvFavorite) return;
        if (isInFavorites(currentQvProduct.id)) {
            qvFavorite.classList.add('active');
            qvFavorite.querySelector('i').className = 'fas fa-heart';
        } else {
            qvFavorite.classList.remove('active');
            qvFavorite.querySelector('i').className = 'far fa-heart';
        }
    }
    
    // Клик по карточке товара
    document.addEventListener('click', function(e) {
        var card = e.target.closest('.product-card');
        if (!card) return;
        if (e.target.closest('.product-card__cart-btn') || e.target.closest('.product-card__fav')) return;
        var cartBtn = card.querySelector('.product-card__cart-btn');
        if (cartBtn) {
            var id = cartBtn.getAttribute('data-id');
            if (id && productsData[id]) openQuickview(id);
        }
    });
    
    // Количество
    if (qvQtyMinus) {
        qvQtyMinus.addEventListener('click', function() {
            if (qvQuantity > 1) { qvQuantity--; qvQty.textContent = qvQuantity; }
        });
    }
    if (qvQtyPlus) {
        qvQtyPlus.addEventListener('click', function() {
            qvQuantity++; qvQty.textContent = qvQuantity;
        });
    }
    
    // Кнопка "В корзину"
    if (qvAddToCart) {
        qvAddToCart.addEventListener('click', function() {
            if (!currentQvProduct) return;
            
            var selectedSize = '';
            var activeSizeBtn = document.querySelector('.quickview__size-btn.active');
            if (activeSizeBtn) {
                selectedSize = ' (' + activeSizeBtn.getAttribute('data-size') + ')';
            }
            
            for (var i = 0; i < qvQuantity; i++) {
                addToCart({
                    id: currentQvProduct.id,
                    name: currentQvProduct.name + selectedSize,
                    price: currentQvProduct.price,
                    img: currentQvProduct.img,
                    cat: currentQvProduct.cat
                });
            }
            
            this.textContent = '✓ Добавлено';
            this.style.background = '#00c853';
            var btn = this;
            setTimeout(function() {
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
                btn.style.background = '';
            }, 1500);
        });
    }
    
    // Кнопка "Избранное"
    if (qvFavorite) {
        qvFavorite.addEventListener('click', function() {
            if (!currentQvProduct) return;
            toggleFavorite(currentQvProduct);
            updateQvFavorite();
        });
    }
    
    // Закрытие
    if (quickviewOverlay) quickviewOverlay.addEventListener('click', closeQuickview);
    if (quickviewClose) quickviewClose.addEventListener('click', closeQuickview);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && quickview.classList.contains('active')) closeQuickview();
    });
    
    // Похожие товары
    function renderRelatedProducts(currentProduct) {
        var relatedContainer = document.getElementById('quickviewRelated');
        if (!relatedContainer) return;
        
        var related = [];
        for (var key in productsData) {
            var p = productsData[key];
            if (p.cat === currentProduct.cat && p.id !== currentProduct.id) related.push(p);
        }
        if (related.length < 4) {
            for (var key2 in productsData) {
                var p2 = productsData[key2];
                if (p2.id !== currentProduct.id && !related.find(function(r) { return r.id === p2.id; })) {
                    related.push(p2);
                }
                if (related.length >= 4) break;
            }
        }
        related = related.slice(0, 4);
        
        relatedContainer.innerHTML = related.map(function(item) {
            var imgContent = (item.img && (item.img.startsWith('http') || item.img.startsWith('img/') || 
                item.img.endsWith('.png') || item.img.endsWith('.jpg') || item.img.endsWith('.jpeg')))
                ? '<img src="' + item.img + '" alt="' + item.name + '">'
                : '<span>' + (item.img || '📦') + '</span>';
            return '<div class="related-card" onclick="window.openQuickview(\'' + item.id + '\')">' +
                '<div class="related-card__img">' + imgContent + '</div>' +
                '<div class="related-card__name">' + item.name + '</div>' +
                '<div class="related-card__price">' + item.price.toLocaleString() + ' с.</div>' +
                '</div>';
        }).join('');
    }
    
    console.log('Модуль быстрого просмотра загружен');
    
        // ============================================
    // AUTH - Вход / Регистрация
    // ============================================
    
    
    const authModal = document.getElementById('authModal');
    const authOverlay = document.getElementById('authOverlay');
    const authClose = document.getElementById('authClose');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    let isLoggedIn = false;
    let currentUser = null;
    
    // Загрузка пользователя
    function loadUser() {
        const savedUser = localStorage.getItem('shopxand_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            isLoggedIn = true;
            updateUserUI();
        }
    }
    
       function saveUser(user) {
        currentUser = user;
        isLoggedIn = true;
        localStorage.setItem('shopxand_user', JSON.stringify(user));
        // Сохраняем ID пользователя для привязки заказов
        localStorage.setItem('shopxand_current_user_phone', user.phone);
        updateUserUI();
    }
    
    // Выход
    function logout() {
        currentUser = null;
        isLoggedIn = false;
        localStorage.removeItem('shopxand_user');
        localStorage.removeItem('shopxand_current_user_phone');
        updateUserUI();
        renderOrders();
    }
    
    // Проверка авторизации
    function requireAuth(callback) {
        if (isLoggedIn) {
            callback();
        } else {
            openAuth();
        }
    }
    
    // Обновление интерфейса
    function updateUserUI() {
        const loginBtn = document.querySelector('.header__action--login, .header__action:first-of-type');
        const mobileLoginBtn = document.querySelector('.mobile-menu__login-btn');
        
        if (isLoggedIn && currentUser) {
            if (loginBtn) {
                loginBtn.querySelector('i').className = 'fas fa-user-check';
                loginBtn.querySelector('span').textContent = currentUser.name || 'Профиль';
            }
            if (mobileLoginBtn) {
                mobileLoginBtn.textContent = currentUser.name || 'Мой профиль';
            }
        } else {
            if (loginBtn) {
                loginBtn.querySelector('i').className = 'fas fa-user';
                loginBtn.querySelector('span').textContent = 'Войти';
            }
            if (mobileLoginBtn) {
                mobileLoginBtn.textContent = 'Войти или зарегистрироваться';
            }
        }
    }
    
        function openAuth() {
        console.log('openAuth вызван');
        console.log('authModal:', authModal);
        
        if (!authModal) {
            console.error('authModal не найден!');
            return;
        }
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showLoginForm();
    }
    
    function openAuth() {
    // Проверка localStorage
    try {
        localStorage.setItem('test', '1');
        localStorage.removeItem('test');
    } catch(e) {
        showToast('Ошибка', 'Включите Cookie и хранилище в настройках браузера', 'error');
        return;
    }

        function closeAuth() {
        if (!authModal) return;
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    window.closeAuth = closeAuth; // ← ДОБАВЬ ЭТУ СТРОКУ
    
    if (!authModal) return;
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    showLoginForm();
}
    
    function showLoginForm() {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    }
    
    function showRegisterForm() {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    }
    
        const headerLoginBtn = document.querySelector('.header__action--login, .header__action:first-of-type');
    if (headerLoginBtn) {
        headerLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (isLoggedIn) {
                logoutModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                openAuth();
            }
        });
    }

        const mobileLoginBtn = document.querySelector('.mobile-menu__login-btn');
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (isLoggedIn) {
                window.closeMenu();
                setTimeout(function() {
                    logoutModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }, 350);
            } else {
                closeMenu();
                setTimeout(function() {
                    openAuth();
                }, 400);
            }
        });
    }
   
    
    // Закрытие
    if (authOverlay) authOverlay.addEventListener('click', function() {
    closeAuth();
});
if (authClose) authClose.addEventListener('click', function() {
    window.closeAuth();
});   
    
       // Переключение форм
    document.getElementById('showRegister')?.addEventListener('click', function(e) {
        e.preventDefault();
        showRegisterForm();
    });
    
    document.getElementById('showLogin')?.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
    
    // Забыли пароль
    document.querySelector('.auth-form__forgot')?.addEventListener('click', function(e) {
        e.preventDefault();
        showForgotForm();
    });
    
    document.getElementById('showLoginFromForgot')?.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
    
    function showLoginForm() {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        document.getElementById('forgotForm').classList.remove('active');
    }
    
    function showRegisterForm() {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        document.getElementById('forgotForm').classList.remove('active');
    }
    
    function showForgotForm() {
        loginForm.classList.remove('active');
        registerForm.classList.remove('active');
        document.getElementById('forgotForm').classList.add('active');
        document.getElementById('codeBlock').style.display = 'none';
    }
    
    // Показать/скрыть пароль
    document.querySelectorAll('.auth-form__toggle-password').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
    
    // ============================================
    // РЕАЛЬНЫЙ ВХОД
    // ============================================
    
    // Загружаем всех пользователей
    function getAllUsers() {
        const users = localStorage.getItem('shopxand_users');
        return users ? JSON.parse(users) : [];
    }
    
    // Сохраняем пользователя в общую базу
    function saveUserToBase(user) {
        const users = getAllUsers();
        const existingIndex = users.findIndex(function(u) {
            return u.phone === user.phone || u.email === user.email;
        });
        
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        
        localStorage.setItem('shopxand_users', JSON.stringify(users));
    }
    
    // Найти пользователя
    function findUser(phoneOrEmail, password) {
        const users = getAllUsers();
        return users.find(function(u) {
            return (u.phone === phoneOrEmail || u.email === phoneOrEmail) && u.password === password;
        });
    }
    
          document.getElementById('loginBtn')?.addEventListener('click', function() {
        const phone = document.getElementById('loginPhone').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        console.log('=== ВХОД ===');
        console.log('Телефон:', phone);
        console.log('Пароль:', password);
        
        if (!phone) {
            showToast('Ошибка', 'Введите телефон или email', 'error');
            return;
        }
        
        if (!password) {
            showToast('Ошибка', 'Введите пароль', 'error');
            return;
        }
        
        // Ищем пользователя
        const users = getAllUsers();
        console.log('Все пользователи:', users);
        
        const user = users.find(function(u) {
            return (u.phone === phone || u.email === phone) && u.password === password;
        });
        
        console.log('Найден пользователь:', user);
        
        if (user) {
            saveUser(user);
            closeAuth();
            showToast('С возвращением!', user.name + ', вы вошли в аккаунт', 'success');
        } else {
            showToast('Ошибка входа', 'Неверный телефон или пароль. Зарегистрируйтесь.', 'error');
        }
    });

        // ============================================
    // РЕГИСТРАЦИЯ
    // ============================================
    document.getElementById('registerBtn')?.addEventListener('click', function() {
        var name = document.getElementById('regName').value.trim();
        var phone = document.getElementById('regPhone').value.trim();
        var email = document.getElementById('regEmail').value.trim();
        var password = document.getElementById('regPassword').value;
        var passwordConfirm = document.getElementById('regPasswordConfirm').value;
        var agree = document.getElementById('regAgree')?.checked;
        
        if (!name || !phone) {
            showToast('Ошибка', 'Заполните имя и телефон', 'error');
            return;
        }
        if (!password || password.length < 6) {
            showToast('Ошибка', 'Пароль минимум 6 символов', 'error');
            return;
        }
        if (password !== passwordConfirm) {
            showToast('Ошибка', 'Пароли не совпадают', 'error');
            return;
        }
        if (!agree) {
            showToast('Ошибка', 'Примите условия', 'error');
            return;
        }
        
        var cleanPhone = phone.replace(/[\+\s\-\(\)]/g, '');
        var users = JSON.parse(localStorage.getItem('shopxand_users') || '[]');
        
        // Проверка уникальности телефона
        var phoneExists = users.find(function(u) {
            var uPhone = (u.phone || '').replace(/[\+\s\-\(\)]/g, '');
            return uPhone === cleanPhone;
        });
        
        if (phoneExists) {
            showToast('Ошибка', 'Номер ' + phone + ' уже зарегистрирован', 'error');
            document.getElementById('regPhone').style.borderColor = '#ff4757';
            setTimeout(function() { document.getElementById('regPhone').style.borderColor = ''; }, 2000);
            return;
        }
        
        // Проверка уникальности email
        if (email) {
            var emailExists = users.find(function(u) { return u.email === email; });
            if (emailExists) {
                showToast('Ошибка', 'Email ' + email + ' уже используется', 'error');
                document.getElementById('regEmail').style.borderColor = '#ff4757';
                setTimeout(function() { document.getElementById('regEmail').style.borderColor = ''; }, 2000);
                return;
            }
        }
        
        var user = {
            name: name,
            phone: cleanPhone,
            email: email,
            password: password,
            registeredAt: new Date().toISOString()
        };
        
        users.push(user);
        localStorage.setItem('shopxand_users', JSON.stringify(users));
        
        currentUser = user;
        isLoggedIn = true;
        localStorage.setItem('shopxand_user', JSON.stringify(user));
        
        updateUserUI();
        closeAuth();
        showToast('Регистрация успешна!', 'Добро пожаловать, ' + name + '!', 'success');
    });

    // ============================================
    // ВХОД
    // ============================================
    document.getElementById('loginBtn')?.addEventListener('click', function() {
        var phone = document.getElementById('loginPhone').value.trim();
        var password = document.getElementById('loginPassword').value;
        
        if (!phone) {
            showToast('Ошибка', 'Введите телефон или email', 'error');
            return;
        }
        if (!password) {
            showToast('Ошибка', 'Введите пароль', 'error');
            return;
        }
        
        var cleanPhone = phone.replace(/[\+\s\-\(\)]/g, '');
        var users = JSON.parse(localStorage.getItem('shopxand_users') || '[]');
        
        var user = users.find(function(u) {
            var uPhone = (u.phone || '').replace(/[\+\s\-\(\)]/g, '');
            return (uPhone === cleanPhone || u.email === phone) && u.password === password;
        });
        
        if (user) {
            currentUser = user;
            isLoggedIn = true;
            localStorage.setItem('shopxand_user', JSON.stringify(user));
            updateUserUI();
            closeAuth();
            showToast('С возвращением!', user.name + ', вы вошли в аккаунт', 'success');
        } else {
            showToast('Ошибка входа', 'Неверный телефон или пароль', 'error');
        }
    });

    // ============================================
    // ЗАБЫЛИ ПАРОЛЬ
    // ============================================
    document.getElementById('forgotBtn')?.addEventListener('click', function() {
        var phone = document.getElementById('forgotPhone').value.trim();
        if (!phone) {
            showToast('Ошибка', 'Введите номер телефона', 'error');
            return;
        }
        
        var cleanPhone = phone.replace(/[\+\s\-\(\)]/g, '');
        var users = JSON.parse(localStorage.getItem('shopxand_users') || '[]');
        var user = users.find(function(u) {
            return (u.phone || '').replace(/[\+\s\-\(\)]/g, '') === cleanPhone;
        });
        
        if (!user) {
            showToast('Не найдено', 'Пользователь с номером ' + phone + ' не зарегистрирован', 'error');
            return;
        }
        
        localStorage.setItem('shopxand_reset_phone', cleanPhone);
        document.getElementById('codeBlock').style.display = 'block';
        this.textContent = 'Телефон подтверждён';
        this.disabled = true;
        showToast('Телефон найден', 'Введите новый пароль', 'success');
    });

    document.getElementById('resetPasswordBtn')?.addEventListener('click', function() {
        var newPassword = document.getElementById('newPassword').value;
        var phone = localStorage.getItem('shopxand_reset_phone');
        
        if (!newPassword || newPassword.length < 6) {
            showToast('Ошибка', 'Пароль минимум 6 символов', 'error');
            return;
        }
        
        var users = JSON.parse(localStorage.getItem('shopxand_users') || '[]');
        var userIndex = users.findIndex(function(u) {
            return (u.phone || '').replace(/[\+\s\-\(\)]/g, '') === phone;
        });
        
        if (userIndex >= 0) {
            users[userIndex].password = newPassword;
            localStorage.setItem('shopxand_users', JSON.stringify(users));
            localStorage.removeItem('shopxand_reset_phone');
            
            document.getElementById('codeBlock').style.display = 'none';
            document.getElementById('forgotBtn').textContent = 'Проверить';
            document.getElementById('forgotBtn').disabled = false;
            document.getElementById('forgotPhone').value = '';
            document.getElementById('newPassword').value = '';
            
            showToast('Пароль изменён!', 'Теперь войдите с новым паролем', 'success');
            showLoginForm();
        }
    });
     

    // Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && authModal && authModal.classList.contains('active')) {
            closeAuth();
        }
    });
    
   
        // ============================================
    // ОКНО ВЫХОДА
    // ============================================
    
    const logoutModal = document.getElementById('logoutModal');
    const logoutOverlay = document.getElementById('logoutOverlay');
    const logoutCancel = document.getElementById('logoutCancel');
    const logoutConfirm = document.getElementById('logoutConfirm');
    
    function openLogoutConfirm() {
        if (!logoutModal) return;
        logoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLogoutConfirm() {
        if (!logoutModal) return;
        logoutModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Отмена
    if (logoutCancel) {
        logoutCancel.addEventListener('click', closeLogoutConfirm);
    }
    
    // Подтверждение выхода
    if (logoutConfirm) {
        logoutConfirm.addEventListener('click', function() {
            logout();
            closeLogoutConfirm();
            showToast('Вы вышли', 'До новых встреч!', 'success');
        });
    }
    
    // Оверлей
    if (logoutOverlay) {
        logoutOverlay.addEventListener('click', closeLogoutConfirm);
    }
    
    // Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && logoutModal && logoutModal.classList.contains('active')) {
            closeLogoutConfirm();
        }
    });
    
    // ============================================
    // ЗАЩИТА ДЕЙСТВИЙ
    // ============================================
    
    const originalOpenCart = openCart;
    openCart = function() {
        if (!isLoggedIn) { openAuth(); return; }
        originalOpenCart();
    };
    
    const originalOpenFavorites = openFavorites;
    openFavorites = function() {
        if (!isLoggedIn) { openAuth(); return; }
        originalOpenFavorites();
    };
    
    const originalOpenOrders = openOrders;
    openOrders = function() {
        if (!isLoggedIn) { openAuth(); return; }
        originalOpenOrders();
    };
    
    const originalAddToCart = addToCart;
    addToCart = function(product) {
        if (!isLoggedIn) { openAuth(); return; }
        originalAddToCart(product);
    };
    
    const originalToggleFavorite = toggleFavorite;
    toggleFavorite = function(product) {
        if (!isLoggedIn) { openAuth(); return false; }
        return originalToggleFavorite(product);
    };
    
    // Загрузка
    loadUser();

    
    
    console.log('Модуль авторизации загружен');

    

    // ============================================
    // CATEGORY FILTER - Фильтр по категориям
    // ============================================
    
    let activeCategory = null;
    
    // Ссылки навигации в хедере
    const navLinks = document.querySelectorAll('.header__nav-link');
    
    // Функция фильтрации товаров по категории
    function filterByCategory(category) {
        const allCards = document.querySelectorAll('.product-card');
        let foundCount = 0;
        
        // Убираем старые сообщения
        const oldMsg = document.querySelector('.category-message');
        if (oldMsg) oldMsg.remove();
        
        if (category === null || category === 'all') {
            // Показать все товары
            allCards.forEach(function(card) {
                card.style.display = '';
                card.style.animation = 'fadeInCard 0.3s ease';
            });
            activeCategory = null;
            
            // Обновляем заголовок
            document.querySelector('.products__title').textContent = 'Популярные товары';
        } else {
            // Фильтруем
            allCards.forEach(function(card) {
                const cat = card.getAttribute('data-cat');
                if (cat === category) {
                    card.style.display = '';
                    card.style.animation = 'fadeInCard 0.3s ease';
                    foundCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            activeCategory = category;
            
            // Обновляем заголовок
            document.querySelector('.products__title').textContent = category;
            
            // Добавляем сообщение
            const message = document.createElement('div');
            message.className = 'category-message';
            message.innerHTML = `
                <span>Показано <strong>${foundCount}</strong> товаров в категории "<strong>${category}</strong>"</span>
                <button onclick="window.resetCategoryFilter()">✕ Показать все</button>
            `;
            const productsHeader = document.querySelector('.products__header');
            if (productsHeader) {
                productsHeader.after(message);
            }
        }
        
        // Скрываем мобильное меню если открыто
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        }
        
        // Прокручиваем к товарам
        if (productGrid) {
            setTimeout(function() {
                productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
    
    // Сброс фильтра
    window.resetCategoryFilter = function() {
        filterByCategory(null);
        
        // Убираем активный класс со всех ссылок
        navLinks.forEach(function(link) {
            link.classList.remove('active');
        });
    };
    
    // Обработчики кликов по ссылкам навигации
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const category = this.textContent.trim();
            
            // Убираем активный класс у всех
            navLinks.forEach(function(l) {
                l.classList.remove('active');
            });
            
            // Добавляем активный класс текущей
            this.classList.add('active');
            
            // Фильтруем
            filterByCategory(category);
        });
    });
    
    console.log('Модуль фильтрации загружен');
    

      // ============================================
    // PWA - Кнопка установки
    // ============================================
    
    let deferredPrompt;
    const pwaInstallBtn = document.getElementById('pwaInstallBtn');
    const pwaInstallAction = document.getElementById('pwaInstallAction');
    const pwaInstallDismiss = document.getElementById('pwaInstallDismiss');
    
    // Ждём событие установки
    window.addEventListener('beforeinstallprompt', function(e) {
        console.log('PWA: можно установить!');
        
        // Отменяем автоматический баннер браузера
        e.preventDefault();
        
        // Сохраняем событие
        deferredPrompt = e;
        
        // Показываем нашу кнопку
        if (pwaInstallBtn) {
            pwaInstallBtn.style.display = 'block';
        }
    });
    
    // Нажатие на кнопку "Установить"
    if (pwaInstallAction) {
        pwaInstallAction.addEventListener('click', function() {
            if (!deferredPrompt) {
                alert('Установка пока недоступна. Попробуйте открыть сайт в браузере Chrome.');
                return;
            }
            
            // Запускаем установку
            deferredPrompt.prompt();
            
            // Ждём ответ
            deferredPrompt.userChoice.then(function(result) {
                console.log('PWA результат:', result.outcome);
                
                if (result.outcome === 'accepted') {
                    // Установлено!
                    if (pwaInstallBtn) {
pwaInstallBtn.innerHTML = '<div class="pwa-install-btn__content" style="background:#e8f5e9;border-color:#00c853;"><span style="font-size:24px;">✅</span><div class="pwa-install-btn__text"><strong>Приложение установлено!</strong><span>ShopXand на вашем устройстве</span></div></div>';
setTimeout(function() {
    pwaInstallBtn.style.display = 'none';
}, 3000);
                    }
                }
                
                deferredPrompt = null;
            });
        });
    }
    
    // Закрыть баннер
    if (pwaInstallDismiss) {
        pwaInstallDismiss.addEventListener('click', function() {
            if (pwaInstallBtn) {
                pwaInstallBtn.style.display = 'none';
            }
        });
    }
    
    // Скрыть если уже установлено
    window.addEventListener('appinstalled', function() {
        console.log('PWA: установлено!');
        if (pwaInstallBtn) {
            pwaInstallBtn.innerHTML = '<div class="pwa-install-btn__content" style="background:#e8f5e9;border-color:#00c853;"><span style="font-size:24px;">✅</span><div class="pwa-install-btn__text"><strong>Приложение установлено!</strong><span>Спасибо что выбрали ShopXand</span></div></div>';
            setTimeout(function() {
                pwaInstallBtn.style.display = 'none';
            }, 3000);
        }
    });
    
    // Проверяем, не установлено ли уже
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('PWA: уже запущено как приложение');
        if (pwaInstallBtn) pwaInstallBtn.style.display = 'none';
    }
    

