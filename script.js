/**
 * ShopXand - Mobile Menu & Search
 */

document.addEventListener('DOMContentLoaded', function() {

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
            
            // Для остальных ссылок просто закрываем меню
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
            alert('Пожалуйста, заполните обязательные поля: Имя, Телефон, Адрес');
            goToStep(1);
            return;
        }
        
        // Создаём заказ
        const orderNumber = 'SX-' + Date.now().toString().slice(-8);
        const totalPrice = getTotalPrice() + (delivery === 'pickup' ? 0 : 30);
        
        const order = {
            id: orderNumber,
            date: new Date().toISOString(),
            status: 'processing', // processing, delivery, completed, cancelled
            statusText: 'В обработке',
            customer: {
                name: name + ' ' + (document.getElementById('checkoutSurname')?.value || ''),
                phone: phone,
                email: document.getElementById('checkoutEmail')?.value || '',
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
        
        // Заполняем детали для шага 3
        document.getElementById('orderNumber').textContent = orderNumber;
        document.getElementById('orderName').textContent = name;
        document.getElementById('orderPhone').textContent = phone;
        document.getElementById('orderAddress').textContent = city + ', ' + address;
        document.getElementById('orderTotal').textContent = totalPrice.toLocaleString() + ' сомони';
        
        // Очищаем корзину
        cart = [];
        saveCart();
        updateCartCount();
        
        // Переходим на шаг 3
        goToStep(3);
    }
    
    window.placeOrder = placeOrder;
    
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

        // Удалить заказ
    window.deleteOrder = function(orderId) {
        // Спрашиваем подтверждение
        if (!confirm('Вы уверены, что хотите удалить заказ ' + orderId + '? Это действие нельзя отменить.')) {
            return;
        }
        
        // Удаляем заказ
        orders = orders.filter(o => o.id !== orderId);
        
        // Сохраняем
        localStorage.setItem('shopxand_orders', JSON.stringify(orders));
        
        // Закрываем попап деталей если открыт
        window.closeOrderDetail();
        
        // Обновляем список
        renderOrders();
        
        console.log('Заказ ' + orderId + ' удалён');
    };
    
        // Отменить заказ
    window.cancelOrder = function(orderId) {
        // Спрашиваем подтверждение
        if (!confirm('Вы уверены, что хотите отменить заказ ' + orderId + '?')) {
            return;
        }
        
        // Находим заказ
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;
        
        // Меняем статус
        orders[orderIndex].status = 'cancelled';
        orders[orderIndex].trackSteps = [
            { label: 'Заказ принят', completed: true, current: false },
            { label: 'В обработке', completed: false, current: false },
            { label: 'В пути', completed: false, current: false },
            { label: 'Отменён', completed: false, current: false }
        ];
        
        // Сохраняем
        localStorage.setItem('shopxand_orders', JSON.stringify(orders));
        
        // Закрываем попап деталей
        window.closeOrderDetail();
        
        // Обновляем список
        renderOrders();
        
        console.log('Заказ ' + orderId + ' отменён');
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
    
    // Обновить счётчик
    function updateOrdersCount() {
        if (ordersCount) {
            const word = getOrderWord(orders.length);
            ordersCount.textContent = orders.length + ' ' + word;
        }
    }
    
    function getOrderWord(count) {
        if (count % 10 === 1 && count % 100 !== 11) return 'заказ';
        if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'заказа';
        return 'заказов';
    }
    
    // Статусы
    function getStatusClass(status) {
        switch(status) {
            case 'processing': return 'order-card__status--processing';
            case 'delivery': return 'order-card__status--delivery';
            case 'completed': return 'order-card__status--completed';
            case 'cancelled': return 'order-card__status--cancelled';
            default: return '';
        }
    }
    
    function getStatusText(status) {
        switch(status) {
            case 'processing': return 'В обработке';
            case 'delivery': return 'В пути';
            case 'completed': return 'Доставлен';
            case 'cancelled': return 'Отменён';
            default: return status;
        }
    }
    
        // Отрисовать заказы
    function renderOrders() {
        if (!ordersList) return;
        
        if (orders.length === 0) {
            ordersList.innerHTML = '';
            ordersEmpty.style.display = 'flex';
        } else {
            ordersEmpty.style.display = 'none';
            
            ordersList.innerHTML = orders.map(order => {
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
        
        updateOrdersCount();
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
    
    // Запускаем проверку каждые 30 секунд
    setInterval(function() {
        updateOrderStatusAutomatically();
    }, 30000);
    
    // Проверяем при загрузке
    updateOrderStatusAutomatically();

    

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
            name: 'Вельветовая рубашка с длинными руковами',
            cat: 'Электроника',
            price: 2560,
            oldPrice: 3200,
            discount: '-20%',
            img: 'img/Рубашка.jpeg',
            rating: 4.8,
            reviews: 324,
            desc: 'Отличный смартфон с AMOLED-дисплеем 6.4", камерой 50 МП и аккумулятором на 5000 мАч.',
            specs: [
                ['Дисплей', '6.4" AMOLED'],
                ['Процессор', 'Exynos 1380'],
                ['Память', '128GB / 8GB'],
                ['Камера', '50 МП + 12 МП'],
                ['Аккумулятор', '5000 мАч']
            ],
            thumbs: ['img/Рубашка.jpeg', 'img/Рубашка.jpeg', 'img/Рубашка.jpeg']
        },
        '2': {
            id: '2',
            name: 'Ноутбук Lenovo IdeaPad 3 15.6"',
            cat: 'Электроника',
            price: 4800,
            oldPrice: null,
            discount: null,
            img: 'img/Крассовка.jpeg',
            rating: 4.6,
            reviews: 189,
            desc: 'Мощный ноутбук для работы и учёбы.',
            specs: [
                ['Дисплей', '15.6" IPS'],
                ['Процессор', 'Intel Core i5'],
                ['Память', '512GB SSD / 16GB'],
                ['Видеокарта', 'Intel Iris Xe']
            ],
            thumbs: ['img/Крассовка.jpeg', 'img/Крассовка.jpeg', 'img/Крассовка.jpeg']
        },
        '3': {
            id: '3',
            name: 'Наушники Sony WH-1000XM5 Black',
            cat: 'Электроника',
            price: 1499,
            oldPrice: 1800,
            discount: '-17%',
            img: 'img/Крассовка-2.jpeg',
            rating: 4.9,
            reviews: 512,
            desc: 'Премиальные наушники с шумоподавлением.',
            specs: [
                ['Тип', 'Полноразмерные'],
                ['Подключение', 'Bluetooth 5.2'],
                ['Автономность', '30 часов'],
                ['Шумоподавление', 'Active ANC']
            ],
            thumbs: ['img/Крассовка-2.jpeg', 'img/Крассовка-2.jpeg', 'img/Крассовка-2.jpeg']
        },
        '4': {
            id: '4',
            name: 'Умные часы Apple Watch SE 2 2023',
            cat: 'Электроника',
            price: 2100,
            oldPrice: null,
            discount: null,
            img: 'img/Наушник.jpeg',
            rating: 4.7,
            reviews: 256,
            desc: 'Современные умные часы с широким функционалом.',
            specs: [
                ['Дисплей', 'OLED 1.78"'],
                ['Память', '32GB'],
                ['Водозащита', 'WR50'],
                ['Датчики', 'Пульс, SpO2']
            ],
            thumbs: ['img/Наушник.jpeg', 'img/Наушник.jpeg', 'img/Наушник.jpeg']
        },
        '5': {
            id: '5',
            name: 'Планшет iPad Air 10.9" 256GB Wi-Fi',
            cat: 'Электроника',
            price: 4999,
            oldPrice: 5500,
            discount: '-9%',
            img: 'img/watch.jpeg',
            rating: 4.9,
            reviews: 678,
            desc: 'Мощный планшет с чипом M1.',
            specs: [
                ['Дисплей', '10.9" Liquid Retina'],
                ['Чип', 'Apple M1'],
                ['Память', '256GB'],
                ['Камера', '12 МП']
            ],
            thumbs: ['img/watch.jpeg', 'img/watch.jpeg', 'img/watch.jpeg']
        },
        '6': {
            id: '6',
            name: 'Портативная колонка JBL Flip 6',
            cat: 'Электроника',
            price: 890,
            oldPrice: null,
            discount: null,
            img: 'img/Шилопка-2.jpeg',
            rating: 4.7,
            reviews: 432,
            desc: 'Компактная колонка с мощным звуком.',
            specs: [
                ['Мощность', '20 Вт'],
                ['Защита', 'IP67'],
                ['Автономность', '12 часов'],
                ['Bluetooth', '5.1']
            ],
            thumbs: ['img/Шилопка-2.jpeg', 'img/Шилопка-2.jpeg', 'img/Шилопка-2.jpeg']
        },
        '7': {
            id: '7',
            name: 'Телевизор LG 55" OLED 4K Smart TV',
            cat: 'Электроника',
            price: 7565,
            oldPrice: 8900,
            discount: '-15%',
            img: 'img/Знак Мерса.jpeg',
            rating: 4.8,
            reviews: 156,
            desc: 'OLED-телевизор с идеальным чёрным.',
            specs: [
                ['Дисплей', '55" OLED 4K'],
                ['Smart TV', 'webOS'],
                ['HDR', 'Dolby Vision'],
                ['HDMI', '4 порта']
            ],
            thumbs: ['img/Знак Мерса.jpeg', 'img/Знак Мерса.jpeg', 'img/Знак Мерса.jpeg']
        },
        '8': {
            id: '8',
            name: 'Клавиатура Logitech MX Keys Mini',
            cat: 'Электроника',
            price: 650,
            oldPrice: null,
            discount: null,
            img: 'img/Рубашка-3.jpeg',
            rating: 4.5,
            reviews: 89,
            desc: 'Компактная беспроводная клавиатура.',
            specs: [
                ['Тип', 'Беспроводная'],
                ['Подключение', 'Bluetooth / USB'],
                ['Подсветка', 'Есть'],
                ['Совместимость', 'Windows / Mac']
            ],
            thumbs: ['img/Рубашка-3.jpeg', 'img/Рубашка-3.jpeg', 'img/Рубашка-3.jpeg']
        }
    };

        // Смена главного изображения при клике на миниатюру
    window.changeQvThumb = function(imgSrc, thumbBtn) {
        const mainImg = document.getElementById('quickviewMainImg');
        
        if (imgSrc && (imgSrc.startsWith('http') || imgSrc.startsWith('img/') || 
            imgSrc.endsWith('.png') || imgSrc.endsWith('.jpg') || 
            imgSrc.endsWith('.jpeg') || imgSrc.endsWith('.webp'))) {
            mainImg.innerHTML = `<img src="${imgSrc}" alt="" style="width:100%;height:100%;object-fit:contain;">`;
        } else {
            mainImg.innerHTML = `<span>${imgSrc || '📦'}</span>`;
        }
        
        // Обновляем активный класс
        document.querySelectorAll('.quickview__thumb').forEach(t => t.classList.remove('active'));
        thumbBtn.classList.add('active');
    };
    
    // Открыть быстрый просмотр
    function openQuickview(productId) {
        // Обновляем title страницы при просмотре товара

        const product = productsData[productId];
        if (!product) return;
        
        currentQvProduct = product;
        qvQuantity = 1;
        
        // Заполняем данные
        document.getElementById('quickviewCat').textContent = product.cat;
        document.getElementById('quickviewName').textContent = product.name;
        document.getElementById('quickviewDesc').textContent = product.desc;
        document.getElementById('quickviewPrice').textContent = product.price.toLocaleString() + ' сомони';
        document.getElementById('qvQty').textContent = qvQuantity;
        
       // Главное изображение
        const mainImg = document.getElementById('quickviewMainImg');
        if (product.img && (product.img.startsWith('http') || product.img.startsWith('img/') || product.img.endsWith('.png') || product.img.endsWith('.jpg') || product.img.endsWith('.jpeg') || product.img.endsWith('.webp'))) {
            mainImg.innerHTML = `<img src="${product.img}" alt="${product.name}" style="width:100%;height:100%;object-fit:contain;">`;
        } else {
            mainImg.innerHTML = `<span>${product.img || '📦'}</span>`;
        }
        
        // Миниатюры
        const thumbs = document.getElementById('quickviewThumbs');
        thumbs.innerHTML = product.thumbs.map((thumb, i) => `
            <button class="quickview__thumb ${i === 0 ? 'active' : ''}" onclick="window.changeQvThumb('${thumb}', this)">
                ${thumb && (thumb.startsWith('http') || thumb.startsWith('img/') || thumb.endsWith('.png') || thumb.endsWith('.jpg') || thumb.endsWith('.jpeg') || thumb.endsWith('.webp'))
                    ? `<img src="${thumb}" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:8px;">`
                    : `<span>${thumb || '📦'}</span>`
                }
            </button>
        `).join('');
       
        
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
        const specs = document.querySelector('.quickview__specs');
        specs.innerHTML = product.specs.map(s => `
            <div class="quickview__spec">
                <span>${s[0]}</span>
                <span>${s[1]}</span>
            </div>
        `).join('');
        
        // Рейтинг
        const stars = document.querySelector('.quickview__stars');
        stars.innerHTML = generateStars(product.rating);
        document.querySelector('.quickview__rating-num').textContent = product.rating;
        document.querySelector('.quickview__reviews').textContent = product.reviews + ' отзывов';
        
        // Избранное
        updateQvFavorite();
        
        // Открываем
        quickview.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.title = product.name + ' — купить в ShopXand | Цена ' + product.price + ' сомони';

    }
    
    // Закрыть быстрый просмотр
    function closeQuickview() {
        quickview.classList.remove('active');
        if (!cartPanel.classList.contains('active') &&
            !favPanel.classList.contains('active') &&
            !ordersPanel.classList.contains('active') &&
            !mobileMenu.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }
    
    // Генерация звёзд
    function generateStars(rating) {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        let html = '';
        for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
        if (half) html += '<i class="fas fa-star-half-alt"></i>';
        return html;
    }
    
    // Обновить кнопку избранного
    function updateQvFavorite() {
        if (!currentQvProduct) return;
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
        const card = e.target.closest('.product-card');
        if (!card) return;
        
        // Не открываем если кликнули по кнопкам
        if (e.target.closest('.product-card__cart-btn') ||
            e.target.closest('.product-card__fav')) {
            return;
        }
        
        const cartBtn = card.querySelector('.product-card__cart-btn');
        if (cartBtn) {
            const id = cartBtn.getAttribute('data-id');
            if (id && productsData[id]) {
                openQuickview(id);
            }
        }
    });
    
    // Количество
    if (qvQtyMinus) {
        qvQtyMinus.addEventListener('click', function() {
            if (qvQuantity > 1) {
                qvQuantity--;
                qvQty.textContent = qvQuantity;
            }
        });
    }
    
    if (qvQtyPlus) {
        qvQtyPlus.addEventListener('click', function() {
            qvQuantity++;
            qvQty.textContent = qvQuantity;
        });
    }
    
    // Добавить в корзину из быстрого просмотра
    if (qvAddToCart) {
        qvAddToCart.addEventListener('click', function() {
            if (!currentQvProduct) return;
            
            for (let i = 0; i < qvQuantity; i++) {
                addToCart({
                    id: currentQvProduct.id,
                    name: currentQvProduct.name,
                    price: currentQvProduct.price,
                    img: currentQvProduct.img,
                    cat: currentQvProduct.cat
                });
            }
            
            // Анимация
            this.textContent = '✓ Добавлено (' + qvQuantity + ')';
            this.style.background = '#00c853';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
                this.style.background = '';
            }, 1500);
        });
    }
    
    // Избранное в быстром просмотре
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
    
    // Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && quickview.classList.contains('active')) {
            closeQuickview();
        }
    });
    
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
    
    // Сохранение пользователя
    function saveUser(user) {
        currentUser = user;
        isLoggedIn = true;
        localStorage.setItem('shopxand_user', JSON.stringify(user));
        updateUserUI();
    }
    
    // Выход
    function logout() {
        currentUser = null;
        isLoggedIn = false;
        localStorage.removeItem('shopxand_user');
        updateUserUI();
    }
    
    // Обновление интерфейса
    function updateUserUI() {
        const loginBtn = document.querySelector('.header__action--login, .header__action:first-child');
        const mobileLoginBtn = document.querySelector('.mobile-menu__login-btn');
        
        if (isLoggedIn && currentUser) {
            // Пользователь вошёл
            if (loginBtn) {
                loginBtn.querySelector('i').className = 'fas fa-user-check';
                loginBtn.querySelector('span').textContent = currentUser.name || 'Профиль';
                loginBtn.href = '#';
                loginBtn.onclick = function(e) {
                    e.preventDefault();
                    showUserMenu();
                };
            }
            if (mobileLoginBtn) {
                mobileLoginBtn.textContent = currentUser.name || 'Мой профиль';
            }
        } else {
            // Пользователь не вошёл
            if (loginBtn) {
                loginBtn.querySelector('i').className = 'fas fa-user';
                loginBtn.querySelector('span').textContent = 'Войти';
                loginBtn.href = '#';
                loginBtn.onclick = function(e) {
                    e.preventDefault();
                    openAuth();
                };
            }
            if (mobileLoginBtn) {
                mobileLoginBtn.textContent = 'Войти или зарегистрироваться';
            }
        }
    }
    
    function showUserMenu() {
        // Простое меню пользователя
        if (confirm('Вы хотите выйти из аккаунта?')) {
            logout();
        }
    }
    
    // Открыть окно входа
    function openAuth() {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showLoginForm();
    }
    
    function closeAuth() {
        authModal.classList.remove('active');
        if (!cartPanel.classList.contains('active') &&
            !favPanel.classList.contains('active') &&
            !ordersPanel.classList.contains('active') &&
            !mobileMenu.classList.contains('active') &&
            !quickView.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }
    
    function showLoginForm() {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    }
    
    function showRegisterForm() {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    }
    
    // Кнопка "Войти" в хедере
    const headerLoginBtn = document.querySelector('.header__action--login, .header__action:first-child');
    if (headerLoginBtn) {
        headerLoginBtn.addEventListener('click', function(e) {
            if (!isLoggedIn) {
                e.preventDefault();
                openAuth();
            }
        });
    }
    
    // Кнопка в мобильном меню
    const mobileLoginBtn = document.querySelector('.mobile-menu__login-btn');
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', function(e) {
            if (!isLoggedIn) {
                e.preventDefault();
                closeMenu();
                setTimeout(openAuth, 350);
            }
        });
    }
    
    // Закрытие
    if (authOverlay) authOverlay.addEventListener('click', closeAuth);
    if (authClose) authClose.addEventListener('click', closeAuth);
    
    // Переключение форм
    document.getElementById('showRegister')?.addEventListener('click', function(e) {
        e.preventDefault();
        showRegisterForm();
    });
    
    document.getElementById('showLogin')?.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
    
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
    
    // Вход
    document.getElementById('loginBtn')?.addEventListener('click', function() {
        const phone = document.getElementById('loginPhone').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!phone || !password) {
            alert('Заполните все поля');
            return;
        }
        
        // Демо-вход
        const user = {
            name: phone.includes('@') ? phone.split('@')[0] : 'Пользователь',
            phone: phone,
            email: phone.includes('@') ? phone : '',
            registeredAt: new Date().toISOString()
        };
        
        saveUser(user);
        closeAuth();
        alert('Добро пожаловать, ' + user.name + '!');
    });
    
    // Регистрация
    document.getElementById('registerBtn')?.addEventListener('click', function() {
        const name = document.getElementById('regName').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const passwordConfirm = document.getElementById('regPasswordConfirm').value;
        const agree = document.getElementById('regAgree').checked;
        
        if (!name || !phone) {
            alert('Заполните обязательные поля: Имя и Телефон');
            return;
        }
        
        if (password && password.length < 6) {
            alert('Пароль должен быть минимум 6 символов');
            return;
        }
        
        if (password !== passwordConfirm) {
            alert('Пароли не совпадают');
            return;
        }
        
        if (!agree) {
            alert('Примите условия использования');
            return;
        }
        
        const user = {
            name: name,
            phone: phone,
            email: email,
            registeredAt: new Date().toISOString()
        };
        
        saveUser(user);
        closeAuth();
        alert('Регистрация успешна! Добро пожаловать, ' + name + '!');
    });
    
    // Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && authModal && authModal.classList.contains('active')) {
            closeAuth();
        }
    });
    
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
    // PWA INSTALL
    // ============================================
    
    let deferredPrompt;
    const pwaInstall = document.getElementById('pwaInstall');
    const pwaInstallBtn = document.getElementById('pwaInstallBtn');
    const pwaInstallClose = document.getElementById('pwaInstallClose');
    
    // Слушаем событие beforeinstallprompt
    window.addEventListener('beforeinstallprompt', function(e) {
        // Предотвращаем автоматическое появление
        e.preventDefault();
        // Сохраняем событие
        deferredPrompt = e;
        // Показываем кнопку установки
        if (pwaInstall) {
            pwaInstall.style.display = 'block';
        }
    });
    
    // Кнопка Установить
    if (pwaInstallBtn) {
        pwaInstallBtn.addEventListener('click', function() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function(result) {
                    console.log('PWA:', result.outcome);
                    deferredPrompt = null;
                    if (pwaInstall) pwaInstall.style.display = 'none';
                });
            }
        });
    }
    
    // Закрыть баннер
    if (pwaInstallClose) {
        pwaInstallClose.addEventListener('click', function() {
            if (pwaInstall) pwaInstall.style.display = 'none';
        });
    }
    
    // Скрыть если уже установлено
    window.addEventListener('appinstalled', function() {
        console.log('PWA установлено!');
        if (pwaInstall) pwaInstall.style.display = 'none';
    });