/**
 * ShopXand - Mobile Menu & Search
 */

// ============================================
// API CONFIG
// ============================================
var API_URL = 'https://shopxand-3.onrender.com/api';
var API_TOKEN = localStorage.getItem('shopxand_token') || '';

function apiHeaders() {
    var token = localStorage.getItem('shopxand_token');
    return {
   'Content-Type': 'application/json',
   'Authorization': token ? 'Bearer ' + token : ''
    };
}

async function apiRequest(url, options) {
    options = options || {};
    try {
   var response = await fetch(API_URL + url, {
  method: options.method || 'GET',
  headers: Object.assign(apiHeaders(), options.headers || {}),
  body: options.body || undefined
   });
   var data = await response.json();
   console.log('API ответ:', response.status, data); // ← ДОБАВЬ ЭТУ СТРОКУ
   if (!response.ok) throw new Error(data.error || 'Ошибка сервера');
   return data;
    } catch (error) {
   console.error('API Error:', error);
   throw error;
    }
}

 async function checkAuth() {
   var token = localStorage.getItem('shopxand_token');
   if (!token) return;
   
   try {
  var data = await apiRequest('/auth/me');
  currentUser = data.user;
  isLoggedIn = true;
  API_TOKEN = token;
  updateUserUI();
   } catch (err) {
  // Токен недействителен — очищаем
  localStorage.removeItem('shopxand_token');
  API_TOKEN = '';
   }
    }
// Глобальные переменные
var isLoggedIn = false;
var currentUser = null;
var cart = [];
var orders = [];
var favorites = [];
var productsData = {};

// API
var API_URL = 'https://shopxand-3.onrender.com/api';
var API_TOKEN = localStorage.getItem('shopxand_token') || '';

function showToast(title, message, type) {
    var toast = document.getElementById('toast');
    if (!toast) { alert(title + ': ' + message); return; }
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;
    var icon = document.getElementById('toastIcon');
    icon.innerHTML = type === 'error' ? '<i class="fas fa-times-circle"></i>' : '<i class="fas fa-check-circle"></i>';
    icon.className = type === 'error' ? 'toast__icon error' : 'toast__icon';
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

document.addEventListener('DOMContentLoaded', async function()  {
    await checkAuth();
    await loadProducts();
    if (isLoggedIn) await loadOrders();
    
    // Сначала сервер
    var serverLoaded = false;
    try {
   await loadProducts();
   serverLoaded = true;
    } catch (err) {
   console.log('Сервер недоступен');
    }
    
    // Если сервер не ответил — локально
    if (!serverLoaded) {
   loadLocalProducts();
    }
    
    if (isLoggedIn) await loadOrders();
 // ============================================
    // ГЛОБАЛЬНЫЕ ФУНКЦИИ
    // ============================================
   window.showConfirm = function(title, message, callback) {
   var modal = document.getElementById('confirmModal');
   if (!modal) {
  if (confirm(title + '\n' + message)) callback();
  return;
   }
   
   // Сброс иконки и кнопки
   var icon = modal.querySelector('.confirm-modal__icon i');
   if (icon) {
  icon.className = 'fas fa-question-circle';
  icon.style.color = '#ff9100';
   }
   var okBtn = document.getElementById('confirmOk');
   if (okBtn) okBtn.textContent = 'Да';
   
   document.getElementById('confirmTitle').textContent = title;
   document.getElementById('confirmMessage').textContent = message;
   
   var newOkBtn = okBtn.cloneNode(true);
   okBtn.parentNode.replaceChild(newOkBtn, okBtn);
   
   newOkBtn.addEventListener('click', function() {
  callback();
  modal.classList.remove('active');
  document.body.style.overflow = '';
   });
   
   modal.classList.add('active');
   document.body.style.overflow = 'hidden';
    };
    
    window.closeConfirm = function() {
   var modal = document.getElementById('confirmModal');
   if (modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
   }
    };

    // Закрытие по кнопкам
    document.getElementById('confirmCancel')?.addEventListener('click', window.closeConfirm);
    document.getElementById('confirmOverlay')?.addEventListener('click', window.closeConfirm);
    
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

    const langSelector = document.getElementById('langSelector');
    const mobileLangSelector = document.getElementById('mobileLangSelector');
    const langModal = document.getElementById('langModal');
    const langOverlay = document.getElementById('langOverlay');
    const langModalClose = document.getElementById('langModalClose');
    
    // ============================================
    // МЕНЮ: Открытие / Закрытие
    // ============================================
    
    function openMenu() {
   mobileMenu.classList.add('active');
   burgerBtn.classList.add('active');
   document.body.style.overflow = 'hidden';
   document.body.classList.add('menu-open');

   var bottomNav = document.getElementById('bottomNav');
   if (bottomNav) {
  bottomNav.style.display = 'none';
   }
    }
    
  function closeMenu() {
    mobileMenu.classList.remove('active');
    burgerBtn.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
    
    // Показываем нижнюю панель обратно
    var bottomNav = document.getElementById('bottomNav');
    if (bottomNav && window.innerWidth <= 768) {
   bottomNav.style.display = 'flex';
    }
    
    setTimeout(function() {
   if (menuContent) {
  menuContent.style.transform = '';
  menuContent.style.transition = '';
   }
    }, 350);
}  
    

window.closeMenu = closeMenu;
    
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
  var text = this.textContent.trim();
  var href = this.getAttribute('href');
  
  // Город (по id)
  if (this.id === 'mobileCitySelector') {
 e.preventDefault();
 e.stopPropagation();
 closeMenu();
 setTimeout(openCityModal, 350);
 return;
  }
  
  // Язык (по id)
  if (this.id === 'mobileLangSelector') {
 e.preventDefault();
 e.stopPropagation();
 closeMenu();
 setTimeout(openLangModal, 350);
 return;
  }
  
  // Мои заказы
  if (text.includes('Мои заказы') || text.includes('Фармоиш')) {
 e.preventDefault();
 e.stopPropagation();
 closeMenu();
 setTimeout(function() { openOrders(); }, 400);
 return;
  }
  
  // Избранное
  if (text.includes('Избранное') || text.includes('Интихобшуда')) {
 e.preventDefault();
 e.stopPropagation();
 closeMenu();
 setTimeout(function() { openFavorites(); }, 400);
 return;
  }
  
  // Корзина
  if (text.includes('Корзина') || text.includes('Сабад')) {
 e.preventDefault();
 e.stopPropagation();
 closeMenu();
 setTimeout(function() { openCart(); }, 400);
 return;
  }
  
  // Войти
  if (text.includes('Войти') || text.includes('Ворид')) {
 e.preventDefault();
 e.stopPropagation();
 closeMenu();
 setTimeout(function() { openAuth(); }, 400);
 return;
  }
  
  // Категории
  var category = text.replace(/[^а-яА-Яa-zA-Z]/g, '').trim().toLowerCase();
  if (['одежда', 'электроника', 'домисад'].some(function(c) { return category.includes(c); })) {
 e.preventDefault();
 e.stopPropagation();
 var categoryText = text.trim();
 closeMenu();
 setTimeout(function() {
filterByCategory(categoryText);
var grid = document.querySelector('.products__grid');
if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

   var bottomNav = document.getElementById('bottomNav');
   if (bottomNav) bottomNav.style.display = 'none'
   
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

   var bottomNav = document.getElementById('bottomNav');
   if (bottomNav && window.innerWidth <= 768) bottomNav.style.display = "flex";

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



    // ============================================
    // ВЫБОР ЯЗЫКА - ИСПРАВЛЕННАЯ ВЕРСИЯ
    // ============================================
    
    
    
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
   
  // Обновляем только непервые два (город и язык пропускаем)
   var secondaryLinks = document.querySelectorAll('.mobile-menu__secondary-list a span');
   // Первые два — город и язык, их не трогаем
   // Остальные — мои заказы, избранное, корзина
   var secondaryTexts = [t.myOrders, t.myFavorites, t.myCart];
   secondaryLinks.forEach(function(span, index) {
  // Пропускаем первые два элемента (город и язык)
  if (index >= 2 && secondaryTexts[index - 2]) {
 span.textContent = secondaryTexts[index - 2];
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
    // MULTI-LANGUAGE — Автоперевод
    // ============================================
    
    var translationsCache = {};
    
    // Загружаем переводы с сервера
    async function loadTranslations(lang) {
   if (translationsCache[lang]) return translationsCache[lang];
   
   try {
  var data = await apiRequest('/translations/' + lang);
  translationsCache[lang] = data;
  return data;
   } catch (err) {
  console.log('Переводы загружены локально');
  return getLocalTranslations(lang);
   }
    }
    
    function getLocalTranslations(lang) {
   var translations = {
  ru: {
 catalog: 'Каталог', search: 'Я ищу...', login: 'Войти',
 orders: 'Заказы', favorites: 'Избранное', cart: 'Корзина',
 clothing: 'Одежда', electronics: 'Электроника', home: 'Дом и сад',
 kids: 'Детские товары', beauty: 'Красота и здоровье', sport: 'Спорт и отдых',
 food: 'Продукты', sales: 'Акции', menuTitle: 'Каталог',
 myOrders: 'Мои заказы', myFavorites: 'Избранное', myCart: 'Корзина',
 loginReg: 'Войти или зарегистрироваться', allProducts: 'Все товары',
 popularProducts: 'Популярные товары', viewAll: 'Смотреть все',
 addToCart: 'В корзину', addedToCart: '✓ Добавлено',
 price: 'Цена', oldPrice: 'Старая цена', rating: 'Рейтинг',
 reviews: 'отзывов', description: 'Описание', specs: 'Характеристики',
 size: 'Размер', shoeSize: 'Размер обуви', quantity: 'Количество',
 delivery: 'Доставка', pickup: 'Самовывоз', courier: 'Курьерская доставка',
 free: 'Бесплатно', days: 'дней', somoni: 'сомони',
 orderAccepted: 'Ваш заказ принят!', deliveryTime: 'Срок доставки: 12-18 дней',
 thankYou: 'Спасибо за заказ!', fromChina: 'Заказ доставляется из Китая в Душанбе'
  },
  tg: {
 catalog: 'Каталог', search: 'Ҷустуҷӯ...', login: 'Ворид',
 orders: 'Фармоишҳо', favorites: 'Интихобшуда', cart: 'Сабад',
 clothing: 'Либос', electronics: 'Электроника', home: 'Хона ва боғ',
 kids: 'Молҳои кӯдакона', beauty: 'Зебоӣ ва саломатӣ', sport: 'Варзиш',
 food: 'Маҳсулот', sales: 'Тафхҳо', menuTitle: 'Каталог',
 myOrders: 'Фармоишҳои ман', myFavorites: 'Интихобшуда', myCart: 'Сабади ман',
 loginReg: 'Ворид шудан ё ба қайд гирифтан', allProducts: 'Ҳамаи молҳо',
 popularProducts: 'Молҳои машҳур', viewAll: 'Ҳамаашро дидан',
 addToCart: 'Ба сабад', addedToCart: '✓ Илова шуд',
 price: 'Нарх', oldPrice: 'Нархи пешина', rating: 'Рейтинг',
 reviews: 'тафсир', description: 'Тавсиф', specs: 'Хусусиятҳо',
 size: 'Андоза', shoeSize: 'Андозаи пойафзол', quantity: 'Миқдор',
 delivery: 'Расонидан', pickup: 'Худгир', courier: 'Курьер',
 free: 'Ройгон', days: 'рӯз', somoni: 'сомонӣ',
 orderAccepted: 'Фармоиши шумо қабул шуд!', deliveryTime: 'Муҳлати расонидан: 12-18 рӯз',
 thankYou: 'Ташаккур барои фармоиш!', fromChina: 'Фармоиш аз Хитой ба Душанбе меояд'
  },
  en: {
 catalog: 'Catalog', search: 'Search...', login: 'Sign In',
 orders: 'Orders', favorites: 'Favorites', cart: 'Cart',
 clothing: 'Clothing', electronics: 'Electronics', home: 'Home & Garden',
 kids: 'Kids', beauty: 'Beauty', sport: 'Sports',
 food: 'Groceries', sales: 'Sales', menuTitle: 'Catalog',
 myOrders: 'My Orders', myFavorites: 'Favorites', myCart: 'Cart',
 loginReg: 'Sign in or register', allProducts: 'All Products',
 popularProducts: 'Popular Products', viewAll: 'View All',
 addToCart: 'Add to Cart', addedToCart: '✓ Added',
 price: 'Price', oldPrice: 'Old Price', rating: 'Rating',
 reviews: 'reviews', description: 'Description', specs: 'Specifications',
 size: 'Size', shoeSize: 'Shoe Size', quantity: 'Quantity',
 delivery: 'Delivery', pickup: 'Pickup', courier: 'Courier',
 free: 'Free', days: 'days', somoni: 'somoni',
 orderAccepted: 'Order Accepted!', deliveryTime: 'Delivery: 12-18 days',
 thankYou: 'Thank you for your order!', fromChina: 'Shipping from China to Dushanbe'
  }
   };
   return translations[lang] || translations['ru'];
    }
    
    // Переключение языка
    async function switchLanguage(lang) {
   currentLang = lang;
   var t = await loadTranslations(lang);
   
   // Обновляем все элементы с data-translate
   document.querySelectorAll('[data-translate]').forEach(function(el) {
  var key = el.getAttribute('data-translate');
  if (t[key]) el.textContent = t[key];
   });
   
   // Обновляем placeholder
   document.querySelectorAll('[data-translate-placeholder]').forEach(function(el) {
  var key = el.getAttribute('data-translate-placeholder');
  if (t[key]) el.placeholder = t[key];
   });
   
   // Сохраняем
   localStorage.setItem('shopxand_lang', lang);
   updateLanguageDisplay(lang);
    }


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
   updateDeliveryDisplay();
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
   if (step === 2)
     updateCheckoutSummary(); 
     updateDeliveryDisplay();
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
  var subtotal = getTotalPrice();
  var deliveryCost = calculateDeliveryCost();
        
        document.getElementById('checkoutSubtotal').textContent = subtotal.toLocaleString() + ' сомони';
        document.getElementById('checkoutDeliveryCost').textContent = deliveryCost === 0 ? 'Бесплатно' : deliveryCost + ' сомони';
        document.getElementById('checkoutFinalTotal').textContent = (subtotal + deliveryCost).toLocaleString() + ' сомони';
    }
    
 function placeOrder() {
    var name = document.getElementById('checkoutName')?.value.trim();
        var phone = document.getElementById('checkoutPhone')?.value.trim();
        var address = document.getElementById('checkoutAddress')?.value.trim();
        var city = document.getElementById('checkoutCity')?.value || 'Душанбе';
        var comment = document.getElementById('checkoutComment')?.value || '';
        var payment = document.querySelector('input[name="payment"]:checked')?.value || 'alif';
        var delivery = document.querySelector('input[name="delivery"]:checked')?.value || 'courier';
        var deliveryCost = calculateDeliveryCost();   
        var totalPrice = getTotalPrice() + deliveryCost;  
   
   if (!name || !phone || !address) {
  showToast('Ошибка', 'Заполните обязательные поля', 'error');
  goToStep(1);
  return;
   }
   
     var orderNumber = 'SX-' + Date.now().toString().slice(-8);
        var deliveryCost = calculateDeliveryCost();
        var totalPrice = getTotalPrice() + deliveryCost;
   
    var order = {
    id: orderNumber,
    date: new Date().toISOString(),
    status: 'processing',
    userId: currentUser ? currentUser.phone : 'guest',
    customer: { name, phone, city, address, comment },
    delivery: delivery,
    payment: payment,
    paymentStatus: 'pending',
    items: [...cart],
    total: totalPrice,
     trackNumber: 'SX' + Date.now().toString().slice(-6), // ← ДОБАВЬ ЭТУ СТРОКУ
    trackingHistory: [ // ← ДОБАВЬ ИСТОРИЮ
        { status: 'Заказ оформлен', date: new Date().toISOString(), location: 'Система ShopXand' }
    ],
    trackSteps: [
    { label: 'Заказ принят', completed: true, current: false },
    { label: 'В обработке', completed: false, current: true },
    { label: 'В пути', completed: false, current: false },
    { label: 'Доставлен', completed: false, current: false }
    ]
    };
   
   // Сохраняем заказ
   saveOrder(order);

           // Отправляем Email-уведомление
        if (currentUser && currentUser.email) {
            fetch(API_URL + '/email/order-confirmation', {
                method: 'POST',
                headers: apiHeaders(),
                body: JSON.stringify({ email: currentUser.email, order: order })
            }).catch(function() {});
        }
   
   // Отправляем в Telegram
   sendOrderToTelegram(order);
   
   // === ПЛАТЕЖИ ===
   if (payment === 'alif') {
  processAlifPayment(order);
  return;
   } else if (payment === 'elsom') {
  processElsomPayment(order);
  return;
   } else if (payment === 'card') {
  processCardPayment(order);
  return;
   } else {
  // Наличные — сразу завершаем
  completeOrder(order);
   }
    }
    
    // ============================================
    // ALIF PAY
    // ============================================
    function processAlifPayment(order) {
   var amount = order.total;
   var orderId = order.id;
   var returnUrl = window.location.origin + '/payment-result.html?order=' + orderId;
   
   // Alif Pay API (демо)
   var alifUrl = 'https://alif.tj/pay?' +
  'amount=' + amount +
  '&orderId=' + orderId +
  '&description=Заказ ' + orderId +
  '&returnUrl=' + encodeURIComponent(returnUrl);
   
   // Сохраняем заказ в localStorage для возврата
   localStorage.setItem('pending_order', JSON.stringify(order));
   
   // Открываем Alif
   showToast('Alif Pay', 'Перенаправляем на оплату...', 'success');
   setTimeout(function() {
  window.open(alifUrl, '_blank');
   }, 1000);
    }
    
    // ============================================
    // ЭЛСОМ
    // ============================================
    function processElsomPayment(order) {
   // Номер кошелька Элсом магазина
   var SHOP_WALLET = '992XXXXXXXXX'; // ← ЗАМЕНИ НА СВОЙ
   
   showToast('Элсом', 'Переведите ' + order.total + ' с. на кошелёк ' + SHOP_WALLET, 'success');
   
   // Сохраняем заказ
   localStorage.setItem('pending_order', JSON.stringify(order));
   
   // После оплаты клиент нажимает кнопку
   showConfirm(
  'Оплата через Элсом',
  'Переведите ' + order.total.toLocaleString() + ' сомони на номер ' + SHOP_WALLET + ' и нажмите "Я оплатил"',
  function() {
 completeOrder(order);
  }
   );
    }
    
    // ============================================
    // VISA / MASTERCARD
    // ============================================
    function processCardPayment(order) {
   // Здесь интеграция с платёжным шлюзом (Stripe, Paybox и т.д.)
   // Пока используем Alif как основной
   showToast('Карта', 'Оплата картой через Alif Pay', 'success');
   processAlifPayment(order);
    }
    
    // ============================================
    // ЗАВЕРШЕНИЕ ЗАКАЗА
    // ============================================
    function completeOrder(order) {
   // Обновляем статус оплаты
   order.paymentStatus = 'paid';
   
   // Обновляем в базе
   var orders = JSON.parse(localStorage.getItem('shopxand_orders') || '[]');
   var idx = orders.findIndex(function(o) { return o.id === order.id; });
   if (idx >= 0) orders[idx] = order;
   else orders.unshift(order);
   localStorage.setItem('shopxand_orders', JSON.stringify(orders));
   
   // Заполняем детали для шага 3
   document.getElementById('orderNumber').textContent = order.id;
   document.getElementById('orderName').textContent = order.customer.name;
   document.getElementById('orderPhone').textContent = order.customer.phone;
   document.getElementById('orderAddress').textContent = order.customer.city + ', ' + order.customer.address;
   document.getElementById('orderTotal').textContent = order.total.toLocaleString() + ' сомони';
   
   // Очищаем корзину
   cart = [];
   saveCart();
   updateCartCount();
   
   // Уведомление
   showOrderNotification();
   goToStep(3);
   
   // Удаляем pending
   localStorage.removeItem('pending_order');
    }
    
    // Переключение информации о платеже
    document.querySelectorAll('input[name="payment"]').forEach(function(radio) {
   radio.addEventListener('change', function() {
  var details = document.getElementById('paymentDetails');
  if (!details) return;
  
  var infoBox = details.querySelector('.checkout-payment__info-box span');
  
  switch(this.value) {
 case 'alif':
infoBox.textContent = 'Вы будете перенаправлены на страницу оплаты Alif Pay';
break;
 case 'elsom':
infoBox.textContent = 'Переведите сумму на кошелёк Элсом и подтвердите оплату';
break;
 case 'card':
infoBox.textContent = 'Оплата банковской картой через защищённое соединение';
break;
 case 'cash':
infoBox.textContent = 'Оплата наличными при получении заказа';
break;
  }
  
  // Активный класс
  document.querySelectorAll('.checkout-payment__option').forEach(function(opt) {
 opt.classList.remove('active');
  });
  this.closest('.checkout-payment__option').classList.add('active');
   });
    });
    
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
   const CHAT_ID = '5282056467';// ← ЗАМЕНИ
   
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
    
  

    // ============================================
    // УДАЛИТЬ ЗАКАЗ
    // ============================================
  window.deleteOrder = function(orderId) {
   var order = orders.find(function(o) { return o.id === orderId; });
   
   showConfirm('Удалить заказ?', 'Заказ ' + orderId + ' будет удалён', function() {
  orders = orders.filter(function(o) { return o.id !== orderId; });
  localStorage.setItem('shopxand_orders', JSON.stringify(orders));
  
  if (order) {
 var msg = '🗑 КЛИЕНТ УДАЛИЛ ЗАКАЗ\n📦 ' + order.id + '\n👤 ' + order.customer.name;
 fetch('https://api.telegram.org/bot' + BOT_ORDER + '/sendMessage', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
 });
  }
  
  window.closeOrderDetail();
  renderOrders();
  showToast('Удалено', 'Заказ удалён', 'success');
   });
    };

    // ============================================
    // ОТМЕНИТЬ ЗАКАЗ
    // ============================================
   
   window.cancelOrder = function(orderId) {
   var order = orders.find(function(o) { return o.id === orderId; });
   if (!order) return;
   
   var orderDate = new Date(order.date);
   var now = new Date();
   var hoursPassed = (now - orderDate) / (1000 * 60 * 60);
   
   // Если прошло 24 часа — показываем окно и выходим
   if (hoursPassed >= 24) {
  showConfirm(
 '⛔ Отмена невозможна',
 'Прошло более 24 часов с момента заказа. Отмена недоступна.',
 function() {
// просто закрываем окно, ничего не делаем
 }
  );
  // Меняем текст кнопки "Да" на "Понятно"
  var okBtn = document.getElementById('confirmOk');
  if (okBtn) okBtn.textContent = 'Понятно';
  
  // Меняем иконку на красную
  var icon = document.querySelector('.confirm-modal__icon i');
  if (icon) {
 icon.className = 'fas fa-clock';
 icon.style.color = '#ff4757';
  }
  
  return;
   }
   
   // Если меньше 24 часов — отправляем запрос
   showConfirm(
  'Отменить заказ?',
  'Заказ будет отменён. Ожидайте подтверждения менеджера.',
  function() {
 order.status = 'pending_cancel';
 order.trackSteps = [
{ label: 'Заказ принят', completed: true, current: false },
{ label: 'В обработке', completed: true, current: false },
{ label: 'Ожидает отмены', completed: false, current: true },
{ label: 'Отменён', completed: false, current: false }
 ];
 localStorage.setItem('shopxand_orders', JSON.stringify(orders));
 
 var cancelMsg = 
'⚠️ ЗАПРОС НА ОТМЕНУ!\n\n' +
'📦 Заказ: ' + order.id + '\n' +
'👤 Клиент: ' + order.customer.name + '\n' +
'📞 Телефон: ' + order.customer.phone + '\n' +
'📍 Адрес: ' + order.customer.city + ', ' + order.customer.address + '\n' +
'💰 Сумма: ' + order.total.toLocaleString() + ' с.\n\n' +
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
 });
 
 renderOrders();
 showToast('Запрос отправлен', 'Ожидайте подтверждения', 'success');
  }
   );
    };
    

    // ============================================
    // ЗАГРУЗКА И СОХРАНЕНИЕ
    // ============================================
   async function loadOrders() {
   if (!isLoggedIn || !API_TOKEN) {
  var saved = localStorage.getItem('shopxand_orders');
  if (saved) orders = JSON.parse(saved);
  return;
   }
   
   try {
  var data = await apiRequest('/orders');
  orders = data.orders;
  console.log('📦 Заказы загружены с сервера:', orders.length);
   } catch (err) {
  console.log('Загружаем локально');
  var saved = localStorage.getItem('shopxand_orders');
  if (saved) orders = JSON.parse(saved);
   }
    }
    
   async function saveOrder(order) {
   orders.unshift(order);
   updateOrdersCount();
   
   if (isLoggedIn && API_TOKEN) {
  try {
 await apiRequest('/orders', {
method: 'POST',
body: JSON.stringify(order)
 });
 console.log('✅ Заказ сохранён на сервере');
  } catch (err) {
 console.log('Сохраняем локально');
 localStorage.setItem('shopxand_orders', JSON.stringify(orders));
  }
   } else {
  localStorage.setItem('shopxand_orders', JSON.stringify(orders));
   }
    }
    
    function updateOrdersCount(count) {
   var total = count !== undefined ? count : orders.length;
   if (ordersCount) {
  ordersCount.textContent = total + ' ' + getOrderWord(total);
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
    
    // ============================================
    // ОТРИСОВКА ЗАКАЗОВ
    // ============================================
    function renderOrders() {
   if (!ordersList) return;
   
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
  
  ordersList.innerHTML = filteredOrders.map(function(order) {
 var date = new Date(order.date);
 var dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
 
 var deliveryInfo = '';
 if (order.status === 'processing') deliveryInfo = 'Доставка через 12-18 дней - отминить заказ после 24 часа невозможен';
 else if (order.status === 'delivery') deliveryInfo = '📦 Доставка сегодня-завтра';
 else if (order.status === 'completed') deliveryInfo = '✅ Заказ доставлен';
 else if (order.status === 'pending_cancel') deliveryInfo = '⏳ Ожидает подтверждения отмены';
 else if (order.status === 'cancelled') deliveryInfo = '❌ Заказ отменён';
 
 var orderDate2 = new Date(order.date);
 var hoursPassed2 = (new Date() - orderDate2) / (1000 * 60 * 60);
 var cantCancel = hoursPassed2 >= 24 && order.status === 'processing';
 
 return '<div class="order-card">' +
'<div class="order-card__header">' +
    '<div>' +
   '<div class="order-card__number">' + order.id + '</div>' +
   '<div class="order-card__date">' + dateStr + '</div>' +
   '<div class="order-card__customer">👤 ' + order.customer.name + '</div>' +
    '</div>' +
    '<span class="order-card__status ' + getStatusClass(order.status) + '">' + getStatusText(order.status) + '</span>' +
'</div>' +
'<div class="order-track">' +
    (order.trackSteps || []).map(function(step, i, arr) {
   return '<div class="order-track__step ' + (step.completed ? 'completed' : '') + ' ' + (step.current ? 'current' : '') + '">' +
  '<div class="order-track__dot"></div>' +
  (i < arr.length - 1 ? '<div class="order-track__line"></div>' : '') +
  '<div class="order-track__label">' + step.label + '</div>' +
   '</div>';
    }).join('') +
'</div>' +
'<div class="order-card__delivery-info"><i class="fas fa-truck"></i><span>' + deliveryInfo + '</span></div>' +
'<div class="order-card__items">' +
    order.items.map(function(item) {
   var imgContent = (item.img && (item.img.endsWith('.png') || item.img.endsWith('.jpg') || item.img.endsWith('.jpeg') || item.img.endsWith('.webp')))
  ? '<img src="' + item.img + '" alt="' + item.name + '" style="width:24px;height:24px;object-fit:contain;vertical-align:middle;">'
  : (item.img || '📦');
   return '<div class="order-card__item">' +
  '<span class="order-card__item-icon">' + imgContent + '</span>' +
  '<span class="order-card__item-name">' + item.name + '</span>' +
  '<span class="order-card__item-qty">×' + item.quantity + '</span>' +
   '</div>';
    }).join('') +
'</div>' +
'<div class="order-card__footer">' +
    '<span class="order-card__total">' + order.total.toLocaleString() + ' сомони</span>' +
    '<div style="display: flex; gap: 6px;">' +
   (order.status !== 'cancelled' && order.status !== 'completed' && order.status !== 'pending_cancel' ? 
  (function() {
 if (hoursPassed2 < 24) {
return '<button class="order-card__cancel-btn" onclick="window.cancelOrder(\'' + order.id + '\')"><i class="fas fa-times"></i> Отменить</button>';
 }
 return '';
  })() 
   : '') +
   '<button class="order-card__delete-btn" onclick="window.deleteOrder(\'' + order.id + '\')"><i class="fas fa-trash-alt"></i> Удалить</button>' +
   '<button class="order-card__details-btn" onclick="window.showOrderDetail(\'' + order.id + '\')">Детали</button>' +
    '</div>' +
    (cantCancel ? '<div style="font-size:11px;color:#ff4757;margin-top:6px;">⛔ Отмена невозможна (прошло 24 часа)</div>' : '') +
'</div>' +
 '<button class="order-card__track-btn" onclick="window.showTracking(\'' + order.id + '\')">📍 Отследить</button>' +
 '</div>';
  }).join('');
   }
   
   updateOrdersCount(filteredOrders.length);
    }
    
    // ============================================
    // ДЕТАЛИ ЗАКАЗА
    // ============================================
    function showOrderDetail(orderId) {
   var order = orders.find(function(o) { return o.id === orderId; });
   if (!order) return;
   
   var oldPopup = document.querySelector('.order-detail-popup');
   var oldOverlay = document.querySelector('.order-detail-popup__overlay');
   if (oldPopup) oldPopup.remove();
   if (oldOverlay) oldOverlay.remove();
   
   var date = new Date(order.date);
   var dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
   var deliveryText = order.delivery === 'pickup' ? 'Самовывоз' : 'Курьерская доставка';
   var paymentText = order.payment === 'card' ? 'Банковская карта' : 'Наличные при получении';
   
   var overlay = document.createElement('div');
   overlay.className = 'order-detail-popup__overlay';
   overlay.onclick = window.closeOrderDetail;
   document.body.appendChild(overlay);
   
   var popup = document.createElement('div');
   popup.className = 'order-detail-popup';
   popup.innerHTML = 
  '<button class="order-detail-popup__close" onclick="window.closeOrderDetail()"><i class="fas fa-times"></i></button>' +
  '<h4>Заказ ' + order.id + '</h4>' +
  '<div class="order-detail-popup__info">' +
 '<div class="order-detail-popup__row"><span>Дата</span><span>' + dateStr + '</span></div>' +
 '<div class="order-detail-popup__row"><span>Статус</span><span>' + getStatusText(order.status) + '</span></div>' +
 '<div class="order-detail-popup__row"><span>Имя</span><span>' + order.customer.name + '</span></div>' +
 '<div class="order-detail-popup__row"><span>Телефон</span><span>' + order.customer.phone + '</span></div>' +
 '<div class="order-detail-popup__row"><span>Город</span><span>' + order.customer.city + '</span></div>' +
 '<div class="order-detail-popup__row"><span>Адрес</span><span>' + order.customer.address + '</span></div>' +
 '<div class="order-detail-popup__row"><span>Доставка</span><span>' + deliveryText + '</span></div>' +
 '<div class="order-detail-popup__row"><span>Оплата</span><span>' + paymentText + '</span></div>' +
 '<div class="order-detail-popup__row"><span>Сумма</span><span>' + order.total.toLocaleString() + ' сомони</span></div>' +
  '</div>' +
  (order.status !== 'cancelled' && order.status !== 'completed' ?
 '<button class="order-cancel-btn" onclick="window.cancelOrder(\'' + order.id + '\')"><i class="fas fa-times-circle"></i> Отменить заказ</button>' : '') +
  (order.status === 'cancelled' ?
 '<div class="order-cancelled-badge"><i class="fas fa-ban"></i> Заказ отменён</div>' : '') +
  '<button class="order-delete-btn" onclick="window.deleteOrder(\'' + order.id + '\'); window.closeOrderDetail();"><i class="fas fa-trash-alt"></i> Удалить заказ</button>';
   
   document.body.appendChild(popup);
   
   setTimeout(function() {
  overlay.classList.add('active');
  popup.classList.add('active');
   }, 10);
    }
    
    window.showOrderDetail = showOrderDetail;
    
    window.closeOrderDetail = function() {
   var popup = document.querySelector('.order-detail-popup');
   var overlay = document.querySelector('.order-detail-popup__overlay');
   if (popup) { popup.classList.remove('active'); overlay.classList.remove('active'); }
   setTimeout(function() { if (popup) popup.remove(); if (overlay) overlay.remove(); }, 300);
    };
    
    // ============================================
    // ОТКРЫТИЕ / ЗАКРЫТИЕ
    // ============================================
    function openOrders() {
   ordersPanel.classList.add('active');
   document.body.style.overflow = 'hidden';
   renderOrders();
    }
    
    function closeOrders() {
   ordersPanel.classList.remove('active');
   if (!cartPanel.classList.contains('active') && !favPanel.classList.contains('active') &&
  !mobileMenu.classList.contains('active') && !checkoutModal.classList.contains('active')) {
  document.body.style.overflow = '';
   }
    }
    window.closeOrders = closeOrders;
    
    var headerOrdersBtn = document.querySelector('.header__action--orders, .header__action:nth-child(2)');
    if (headerOrdersBtn) {
   headerOrdersBtn.addEventListener('click', function(e) { e.preventDefault(); openOrders(); });
    }
    
    var mobileOrdersAction = document.querySelector('.mobile-menu__action i.fa-box')?.parentElement;
    if (mobileOrdersAction) {
   mobileOrdersAction.addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation();
  window.closeMenu();
  setTimeout(openOrders, 400);
   });
    }
    
    if (ordersOverlay) ordersOverlay.addEventListener('click', closeOrders);
    if (ordersClose) ordersClose.addEventListener('click', closeOrders);
    
    document.addEventListener('keydown', function(e) {
   if (e.key === 'Escape' && ordersPanel && ordersPanel.classList.contains('active')) closeOrders();
    });
    
    var ordersEmptyBtn = document.getElementById('ordersEmptyBtn');
    if (ordersEmptyBtn) {
   ordersEmptyBtn.addEventListener('click', function() {
  closeOrders();
  window.scrollTo({ top: 0, behavior: 'smooth' });
   });
    }
    
    loadOrders();
    updateOrdersCount();
    
    console.log('📦 Модуль заказов загружен. Заказов:', orders.length);
    


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
    // SMART SEARCH — Умный поиск
    // ============================================
    
    var searchInput = document.getElementById('searchInput');
    var searchBlock = document.getElementById('searchBlock');
    var searchSuggestions = document.getElementById('searchSuggestions');
    var productGrid = document.getElementById('productsGrid') || document.querySelector('.products__grid');
    var selectedSuggestionIndex = -1;
    var searchTimeout;
    
    // Собираем все товары
    function getAllProducts() {
   var products = [];
   var cards = document.querySelectorAll('.product-card');
   cards.forEach(function(card) {
  var name = card.querySelector('.product-card__name')?.textContent || '';
  var cat = card.querySelector('.product-card__cat')?.textContent || '';
  var price = card.querySelector('.product-card__price-current')?.textContent || '';
  var cartBtn = card.querySelector('.product-card__cart-btn');
  products.push({
 card: card,
 name: name,
 cat: cat,
 price: price,
 id: cartBtn?.getAttribute('data-id') || '',
 img: cartBtn?.getAttribute('data-img') || '📦'
  });
   });
   return products;
    }
    
    // Исправление опечаток (базовые правила)
    function fixTypos(query) {
   var fixes = {
  'телеыон': 'телефон',
  'ноутбуук': 'ноутбук',
  'рубащка': 'рубашка',
  'красовка': 'кроссовка',
  'электроник': 'электроника',
  'наушьник': 'наушник',
  'одежда': 'одежда',
  'шоп': 'shop',
  'смартвон': 'смартфон',
  'платье': 'платье',
  'тапочьки': 'тапочки'
   };
   var words = query.toLowerCase().split(' ');
   var fixed = words.map(function(w) { return fixes[w] || w; }).join(' ');
   return fixed;
    }
    
    // Подсветка совпадения
    function highlightMatch(text, query) {
   if (!query) return text;
   var regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
   return text.replace(regex, '<span>$1</span>');
    }
    
    // Показать подсказки
    function showSuggestions(query) {
   if (!searchSuggestions) return;
   
   if (!query || query.length < 1) {
  searchSuggestions.classList.remove('active');
  selectedSuggestionIndex = -1;
  return;
   }
   
   var products = getAllProducts();
   var fixedQuery = fixTypos(query);
   var lowerQuery = query.toLowerCase();
   var lowerFixed = fixedQuery.toLowerCase();
   
   // Ищем совпадения
   var results = [];
   products.forEach(function(p) {
  var score = 0;
  var nameLower = p.name.toLowerCase();
  var catLower = p.cat.toLowerCase();
  
  // Точное совпадение в названии
  if (nameLower.indexOf(lowerQuery) >= 0) score = 100;
  // Совпадение с исправлением
  else if (lowerFixed !== lowerQuery && nameLower.indexOf(lowerFixed) >= 0) score = 80;
  // Частичное совпадение (слова)
  else if (lowerQuery.split(' ').some(function(w) { return w.length > 2 && nameLower.indexOf(w) >= 0; })) score = 60;
  // Совпадение в категории
  else if (catLower.indexOf(lowerQuery) >= 0) score = 40;
  // Начинается с запроса
  else if (nameLower.startsWith(lowerQuery)) score = 90;
  
  if (score > 0) {
 results.push({ product: p, score: score });
  }
   });
   
   // Сортируем по релевантности
   results.sort(function(a, b) { return b.score - a.score; });
   results = results.slice(0, 8); // максимум 8 подсказок
   
   if (results.length === 0) {
  searchSuggestions.classList.remove('active');
  return;
   }
   
   // Группируем
   var topResults = results.slice(0, 5);
   var catResults = [];
   var cats = {};
   results.forEach(function(r) {
  if (!cats[r.product.cat] && Object.keys(cats).length < 3) {
 cats[r.product.cat] = true;
 catResults.push(r.product.cat);
  }
   });
   
   // Строим HTML
   var html = '';
   
   if (topResults.length > 0) {
  html += '<div class="search-suggestions__group">';
  html += '<div class="search-suggestions__group-title">Товары</div>';
  topResults.forEach(function(r, i) {
 var name = highlightMatch(r.product.name, query);
 html += '<div class="search-suggestions__item' + (i === 0 ? ' search-suggestions__item--active' : '') + '" data-id="' + r.product.id + '" onclick="window.selectSearchSuggestion(\'' + r.product.id + '\')">';
 html += '<div class="search-suggestions__item-img">' + (r.product.img.startsWith('/') || r.product.img.startsWith('img/') ? '<img src="' + r.product.img + '" alt="">' : '<span>' + r.product.img + '</span>') + '</div>';
 html += '<div class="search-suggestions__item-info">';
 html += '<div class="search-suggestions__item-name">' + name + '</div>';
 html += '<div class="search-suggestions__item-cat">' + r.product.cat + '</div>';
 html += '</div>';
 html += '<div class="search-suggestions__item-price">' + r.product.price + '</div>';
 html += '</div>';
  });
  html += '</div>';
   }
   
   if (catResults.length > 0) {
  html += '<div class="search-suggestions__group">';
  html += '<div class="search-suggestions__group-title">Категории</div>';
  catResults.forEach(function(cat) {
 html += '<div class="search-suggestions__item" onclick="window.filterByCategory(\'' + cat + '\')">';
 html += '<div class="search-suggestions__item-img">🔍</div>';
 html += '<div class="search-suggestions__item-name">' + cat + '</div>';
 html += '</div>';
  });
  html += '</div>';
   }
   
   html += '<div class="search-suggestions__footer"><button onclick="window.searchAll(\'' + query + '\')">Показать все результаты</button></div>';
   
   searchSuggestions.innerHTML = html;
   searchSuggestions.classList.add('active');
   selectedSuggestionIndex = 0;
    }
    
    // Выбрать подсказку
    window.selectSearchSuggestion = function(productId) {
   searchSuggestions.classList.remove('active');
   if (searchInput) searchInput.value = '';
   // Открываем быстрый просмотр
   if (typeof openQuickview === 'function') {
  openQuickview(productId);
   }
    };
    
    // Показать все результаты
    window.searchAll = function(query) {
   searchSuggestions.classList.remove('active');
   if (searchInput) searchInput.value = query;
   searchProducts(query);
   if (productGrid) {
  productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
   }
    };
    
    // Навигация клавишами
    if (searchInput) {
   searchInput.addEventListener('keydown', function(e) {
  if (!searchSuggestions.classList.contains('active')) return;
  
  var items = searchSuggestions.querySelectorAll('.search-suggestions__item');
  
  if (e.key === 'ArrowDown') {
 e.preventDefault();
 selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, items.length - 1);
 updateSuggestionHighlight(items);
  } else if (e.key === 'ArrowUp') {
 e.preventDefault();
 selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, 0);
 updateSuggestionHighlight(items);
  } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
 e.preventDefault();
 items[selectedSuggestionIndex].click();
  } else if (e.key === 'Escape') {
 searchSuggestions.classList.remove('active');
  }
   });
   
   // Ввод с задержкой
   searchInput.addEventListener('input', function() {
  clearTimeout(searchTimeout);
  var query = this.value.trim();
  searchTimeout = setTimeout(function() {
 showSuggestions(query);
  }, 200);
   });
   
   // Клик вне — закрыть
   document.addEventListener('click', function(e) {
  if (!searchBlock.contains(e.target)) {
 searchSuggestions.classList.remove('active');
  }
   });
    }
    
    function updateSuggestionHighlight(items) {
   items.forEach(function(item, i) {
  if (i === selectedSuggestionIndex) {
 item.classList.add('search-suggestions__item--active');
  } else {
 item.classList.remove('search-suggestions__item--active');
  }
   });
    }
   

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
    
    
   // ============================================
    // PRODUCTS - Загрузка с сервера или локально
    // ============================================
     async function loadProducts() {
        try {
            var data = await apiRequest('/products');
            if (data && data.products && data.products.length > 0) {
                productsData = {};
                data.products.forEach(function(p) {
                    // Исправляем путь к картинке
                    if (p.img && !p.img.startsWith('http') && !p.img.startsWith('/')) {
                        p.img = '/' + p.img;
                    }
                    if (p.thumbs) {
                        p.thumbs = p.thumbs.map(function(t) {
                            return (!t.startsWith('http') && !t.startsWith('/')) ? '/' + t : t;
                        });
                    }
                    productsData[p.id] = p;
                });
                renderProductCards();
            }
        } catch (err) {
            loadLocalProducts();
            renderProductCards();
        }
    }
    
    function loadLocalProducts() {
   productsData = {
  '1': { id: '1', name: 'Вельветовая рубашка', cat: 'Одежда', price: 120, oldPrice: 180, discount: '-33%', img: 'img/Рубашка.jpeg', rating: 4.8, reviews: 0, desc: 'Стильная вельветовая рубашка.', sizes: ['X', 'XL', '2XL', '3XL'], specs: [['Материал', 'Вельвет 100%'], ['Размеры', 'X-3XL']], thumbs: ['img/Рубашка.jpeg', 'img/Рубашка.jpeg', 'img/Рубашка.jpeg'] },
  '2': { id: '2', name: 'Крассовка AF1', cat: 'Одежда', price: 110, img: 'img/Крассовка.jpeg', rating: 4.6, reviews: 0, desc: 'Лучшая модель', shoeSizes: ['38','39','40','41','42','43','44'], specs: [['Материал', 'Кожа']], thumbs: ['img/Крассовка.jpeg', 'img/Крассовка.jpeg', 'img/Крассовка.jpeg'] },
  '3': { id: '3', name: 'Крассовка британская', cat: 'Одежда', price: 140, oldPrice: 250, img: 'img/Крассовка-2.jpeg', rating: 4.9, reviews: 0, desc: 'Британский стиль', shoeSizes: ['38','39','40','41','42','43','44'], specs: [['Материал', 'Премиум']], thumbs: ['img/Крассовка-2.jpeg', 'img/Крассовка-2.jpeg', 'img/Крассовка-2.jpeg'] },
  '4': { id: '4', name: 'Проводной наушник', cat: 'Электроника', price: 30, img: 'img/Наушник.jpeg', rating: 4.7, reviews: 0, desc: 'Качественный звук', specs: [['Тип', 'Проводные']], thumbs: ['img/Наушник.jpeg', 'img/Наушник.jpeg', 'img/Наушник.jpeg'] },
  '5': { id: '5', name: 'Часы CHENXI', cat: 'Электроника', price: 230, oldPrice: 300, img: 'img/watch.jpeg', rating: 4.9, reviews: 0, desc: 'Стильные часы', specs: [['Бренд', 'CHENXI']], thumbs: ['img/watch.jpeg', 'img/watch.jpeg', 'img/watch.jpeg'] },
  '6': { id: '6', name: 'Кожаные тапочки', cat: 'Одежда', price: 100, img: 'img/Шилопка-2.jpeg', rating: 4.7, reviews: 0, desc: 'Натуральная кожа', shoeSizes: ['38','39','40','41','42','43','44'], specs: [['Материал', 'Кожа']], thumbs: ['img/Шилопка-2.jpeg', 'img/Шилопка-2.jpeg', 'img/Шилопка-2.jpeg'] },
  '7': { id: '7', name: 'Знак Mercedes', cat: 'Электроника', price: 80, oldPrice: 90, img: 'img/Знак Мерса.jpeg', rating: 4.8, reviews: 0, desc: 'Металлический знак', specs: [['Бренд', 'Mercedes']], thumbs: ['img/Знак Мерса.jpeg', 'img/Знак Мерса.jpeg', 'img/Знак Мерса.jpeg'] },
  '8': { id: '8', name: 'Рубашка белая', cat: 'Одежда', price: 120, img: 'img/Рубашка-3.jpeg', rating: 4.5, reviews: 0, desc: 'Качественная рубашка', sizes: ['X','XL','2XL','3XL'], specs: [['Материал', 'Хлопок']], thumbs: ['img/Рубашка-3.jpeg', 'img/Рубашка-3.jpeg', 'img/Рубашка-3.jpeg'] }
   };
   productsLoaded = true;
    }
    
    function getProductById(id) {
   return productsData[id] || null;
    }
    
    function getAllProductsData() {
   return Object.values(productsData);
    }
    
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
    var product = getProductById(productId);
    if (!product || !product.thumbs || !product.specs) {
   showToast('Ошибка', 'Товар не найден', 'error');
   return;
    }
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
    // AUTH — Полная авторизация
    // ============================================
    
    var authModal = document.getElementById('authModal');
    var authOverlay = document.getElementById('authOverlay');
    var authClose = document.getElementById('authClose');
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    var forgotForm = document.getElementById('forgotForm');
    
    // ============================================
    // ПРОВЕРКА СЕССИИ ПРИ ЗАГРУЗКЕ
    // ============================================
    async function checkAuth() {
    // Временно используем localStorage
    var user = JSON.parse(localStorage.getItem('shopxand_user') || 'null');
    if (user) {
   currentUser = user;
   isLoggedIn = true;
   updateUserUI();
   console.log('✅ Сессия из localStorage:', currentUser.name);
    }
}
    
    // ============================================
    // СОХРАНЕНИЕ СЕССИИ
    // ============================================
    function saveSession(user, token) {
   currentUser = user;
   isLoggedIn = true;
   API_TOKEN = token;
   localStorage.setItem('shopxand_token', token);
   localStorage.setItem('shopxand_user', JSON.stringify(user));
   updateUserUI();
    }
    
    function logout() {
   currentUser = null;
   isLoggedIn = false;
   API_TOKEN = '';
   localStorage.removeItem('shopxand_token');
   localStorage.removeItem('shopxand_user');
   updateUserUI();
   renderOrders();
    }
    
    // ============================================
    // UI
    // ============================================
    function updateUserUI() {
   var loginBtn = document.querySelector('.header__action--login, .header__action:first-of-type');
   var mobileLoginBtn = document.querySelector('.mobile-menu__login-btn');
   
   if (isLoggedIn && currentUser) {
  if (loginBtn) {
 loginBtn.querySelector('i').className = 'fas fa-user-check';
 loginBtn.querySelector('span').textContent = currentUser.name;
  }
  if (mobileLoginBtn) mobileLoginBtn.textContent = currentUser.name;
   } else {
  if (loginBtn) {
 loginBtn.querySelector('i').className = 'fas fa-user';
 loginBtn.querySelector('span').textContent = 'Войти';
  }
  if (mobileLoginBtn) mobileLoginBtn.textContent = 'Войти или зарегистрироваться';
   }
    }
    
    // ============================================
    // МОДАЛЬНЫЕ ОКНА
    // ============================================
    function openAuth() {
   if (!authModal) return;
   authModal.classList.add('active');
   document.body.style.overflow = 'hidden';
   showLoginForm();
    }
    
    function closeAuth() {
   if (!authModal) return;
   authModal.classList.remove('active');
   document.body.style.overflow = '';
    }
    window.closeAuth = closeAuth;
    
    function showLoginForm() {
   loginForm.classList.add('active');
   registerForm.classList.remove('active');
   if (forgotForm) forgotForm.classList.remove('active');
    }
    
    function showRegisterForm() {
   loginForm.classList.remove('active');
   registerForm.classList.add('active');
   if (forgotForm) forgotForm.classList.remove('active');
    }
    
    function showForgotForm() {
   loginForm.classList.remove('active');
   registerForm.classList.remove('active');
   if (forgotForm) forgotForm.classList.add('active');
   var codeBlock = document.getElementById('codeBlock');
   if (codeBlock) codeBlock.style.display = 'none';
    }
    
    // ============================================
    // КНОПКИ ОТКРЫТИЯ
    // ============================================
    var headerLoginBtn = document.querySelector('.header__action--login, .header__action:first-of-type');
    if (headerLoginBtn) {
   headerLoginBtn.addEventListener('click', function(e) {
  e.preventDefault();
  if (isLoggedIn) {
 document.getElementById('logoutModal').classList.add('active');
 document.body.style.overflow = 'hidden';
  } else {
 openAuth();
  }
   });
    }
    
    var mobileLoginBtn = document.querySelector('.mobile-menu__login-btn');
    if (mobileLoginBtn) {
   mobileLoginBtn.addEventListener('click', function(e) {
  e.preventDefault();
  window.closeMenu();
  setTimeout(function() {
 if (isLoggedIn) {
document.getElementById('logoutModal').classList.add('active');
 } else {
openAuth();
 }
  }, 400);
   });
    }
    
    if (authOverlay) authOverlay.addEventListener('click', closeAuth);
    if (authClose) authClose.addEventListener('click', closeAuth);
    
    // Переключение форм
    document.getElementById('showRegister')?.addEventListener('click', function(e) { e.preventDefault(); showRegisterForm(); });
    document.getElementById('showLogin')?.addEventListener('click', function(e) { e.preventDefault(); showLoginForm(); });
    document.getElementById('showLoginFromForgot')?.addEventListener('click', function(e) { e.preventDefault(); showLoginForm(); });
    document.querySelector('.auth-form__forgot')?.addEventListener('click', function(e) { e.preventDefault(); showForgotForm(); });
    
    // Пароль
    document.querySelectorAll('.auth-form__toggle-password').forEach(function(btn) {
   btn.addEventListener('click', function() {
  var input = this.parentElement.querySelector('input');
  var icon = this.querySelector('i');
  if (input.type === 'password') { input.type = 'text'; icon.className = 'fas fa-eye-slash'; }
  else { input.type = 'password'; icon.className = 'fas fa-eye'; }
   });
    });
    
    // ============================================
    // РЕГИСТРАЦИЯ
    // ============================================
    document.getElementById('registerBtn')?.addEventListener('click', async function() {
   var name = document.getElementById('regName').value.trim();
   var phone = document.getElementById('regPhone').value.trim();
   var email = document.getElementById('regEmail').value.trim();
   var password = document.getElementById('regPassword').value;
   var passwordConfirm = document.getElementById('regPasswordConfirm').value;
   var agree = document.getElementById('regAgree')?.checked;
   
   if (!name || name.length < 2) { showToast('Ошибка', 'Имя минимум 2 символа', 'error'); return; }
   var cleanPhone = phone.replace(/[\+\s\-\(\)]/g, '');
   if (!cleanPhone.startsWith('992') || cleanPhone.length !== 12) { showToast('Ошибка', 'Номер: 992XXXXXXXXX', 'error'); return; }
   if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Ошибка', 'Неверный email', 'error'); return; }
   if (!password || password.length < 6) { showToast('Ошибка', 'Пароль минимум 6 символов', 'error'); return; }
   if (password !== passwordConfirm) { showToast('Ошибка', 'Пароли не совпадают', 'error'); return; }
   if (!agree) { showToast('Ошибка', 'Примите условия', 'error'); return; }
   
   try {
  var data = await apiRequest('/auth/register', {
 method: 'POST',
 body: JSON.stringify({ name: name, phone: cleanPhone, email: email, password: password })
  });
  saveSession(data.user, data.token);
  closeAuth();
  showToast('Регистрация успешна!', 'Добро пожаловать, ' + name + '!', 'success');
   } catch (err) {
  showToast('Ошибка', err.message, 'error');
   }
    });
    
    // ============================================
    // ВХОД — БЕЗ ПОДТВЕРЖДЕНИЯ
    // ============================================
   
   document.getElementById('loginBtn')?.addEventListener('click', async function() {
   var phone = document.getElementById('loginPhone').value.trim();
   var password = document.getElementById('loginPassword').value;

phone = phone.replace(/[\+\s\-\(\)]/g, '');
   
   if (!phone || !password) { 
  showToast('Ошибка', 'Введите телефон и пароль', 'error'); 
  return; 
   }
   
   try {
  var data = await apiRequest('/auth/login', {
 method: 'POST',
 body: JSON.stringify({ phone: phone, password: password })
  });
  saveSession(data.user, data.token);
  closeAuth();
  showToast('С возвращением!', data.user.name + ', вы вошли', 'success');
   } catch (err) {
  showToast('Ошибка', err.message, 'error');
   }
    });
    // ============================================
    // ЗАБЫЛИ ПАРОЛЬ
    // ============================================
  document.getElementById('forgotBtn')?.addEventListener('click', function() {
   var phone = document.getElementById('forgotPhone').value.trim();
   if (!phone) { showToast('Ошибка', 'Введите телефон', 'error'); return; }
   
   var cleanPhone = phone.replace(/[\+\s\-\(\)]/g, '');
   
   // Ищем через API
   showToast('В разработке', 'Восстановление пароля временно недоступно', 'error');
   
   // Просто показываем поле
   document.getElementById('codeBlock').style.display = 'block';
   this.textContent = 'Телефон подтверждён';
   this.disabled = true;
    });
    
    document.getElementById('resetPasswordBtn')?.addEventListener('click', function() {
   var newPassword = document.getElementById('newPassword').value;
   var phone = localStorage.getItem('shopxand_reset_phone');
   
   if (!newPassword || newPassword.length < 6) { showToast('Ошибка', 'Пароль минимум 6 символов', 'error'); return; }
   
   var users = JSON.parse(localStorage.getItem('shopxand_users') || '[]');
   var idx = users.findIndex(function(u) { return u.phone === phone; });
   if (idx >= 0) {
  users[idx].password = newPassword;
  localStorage.setItem('shopxand_users', JSON.stringify(users));
  localStorage.removeItem('shopxand_reset_phone');
  
  document.getElementById('codeBlock').style.display = 'none';
  document.getElementById('forgotBtn').textContent = 'Проверить';
  document.getElementById('forgotBtn').disabled = false;
  document.getElementById('forgotPhone').value = '';
  document.getElementById('newPassword').value = '';
  
  showToast('Пароль изменён!', 'Войдите с новым паролем', 'success');
  showLoginForm();
   }
    });
    
    // ============================================
    // ВЫХОД
    // ============================================
    var logoutModal = document.getElementById('logoutModal');
    document.getElementById('logoutCancel')?.addEventListener('click', function() {
   logoutModal.classList.remove('active');
   document.body.style.overflow = '';
    });
    document.getElementById('logoutOverlay')?.addEventListener('click', function() {
   logoutModal.classList.remove('active');
   document.body.style.overflow = '';
    });
    document.getElementById('logoutConfirm')?.addEventListener('click', function() {
   logout();
   logoutModal.classList.remove('active');
   document.body.style.overflow = '';
   showToast('Вы вышли', 'До встречи!', 'success');
    });

    // Синхронизация на сервер
async function syncUserData() {
    if (!isLoggedIn || !API_TOKEN) return;
    try {
   await fetch(API_URL + '/user/sync', {
  method: 'POST',
  headers: { ...apiHeaders() },
  body: JSON.stringify({ cart: cart, favorites: favorites })
   });
    } catch (err) {
   console.error('Ошибка синхронизации:', err);
    }
}

// Загрузка данных с сервера
async function loadUserData() {
    if (!isLoggedIn || !API_TOKEN) return;
    try {
   const response = await fetch(API_URL + '/user/data', {
  headers: apiHeaders()
   });
   if (response.ok) {
  const data = await response.json();
  cart = data.cart || [];
  favorites = data.favorites || [];
  renderCart();
  renderFavorites();
  updateCartCount();
  updateFavCount();
  updateAllHeartIcons();
   }
    } catch (err) {
   console.error('Ошибка загрузки данных:', err);
    }
}

// Авто-синхронизация при изменениях
const origAddToCart = addToCart;
addToCart = function(product) { origAddToCart(product); syncUserData(); };

const origToggleFavorite = toggleFavorite;
toggleFavorite = function(product) { const r = origToggleFavorite(product); syncUserData(); return r; };

    // ============================================
    // СИНХРОНИЗАЦИЯ ДАННЫХ С СЕРВЕРОМ
    // ============================================
    
    async function syncUserData() {
   if (!isLoggedIn || !API_TOKEN) return;
   try {
  await fetch(API_URL + '/user/sync', {
 method: 'POST',
 headers: apiHeaders(),
 body: JSON.stringify({ cart: cart, favorites: favorites })
  });
   } catch (err) {}
    }
    
    async function loadUserData() {
   if (!isLoggedIn || !API_TOKEN) return;
   try {
  var response = await fetch(API_URL + '/user/data', { headers: apiHeaders() });
  if (response.ok) {
 var data = await response.json();
 cart = data.cart || [];
 favorites = data.favorites || [];
 renderCart();
 renderFavorites();
 updateCartCount();
 updateFavCount();
 updateAllHeartIcons();
  }
   } catch (err) {}
    }
    
    var origToggleFav = toggleFavorite;
    toggleFavorite = function(product) { var r = origToggleFav(product); syncUserData(); return r; };
    
    // Загрузка при входе
    var origSaveSession = saveSession;
    saveSession = function(user, token) { origSaveSession(user, token); loadUserData(); };
    
    // ============================================
    // ЗАЩИТА
    // ============================================
    var origOpenCart = openCart;
    openCart = function() { if (!isLoggedIn) { openAuth(); return; } origOpenCart(); };
    var origOpenFav = openFavorites;
    openFavorites = function() { if (!isLoggedIn) { openAuth(); return; } origOpenFav(); };
    var origOpenOrd = openOrders;
    openOrders = function() { if (!isLoggedIn) { openAuth(); return; } origOpenOrd(); };
    // Запуск
    checkAuth();
    console.log('🔐 Auth загружен. Пользователь:', isLoggedIn ? currentUser?.name : 'не вошёл');

   

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

   document.getElementById('resetPasswordBtn')?.addEventListener('click', function() {
   var code = document.getElementById('forgotCode')?.value.trim();
   var newPassword = document.getElementById('newPassword').value;
   var savedCode = localStorage.getItem('shopxand_reset_code');
   var phone = localStorage.getItem('shopxand_reset_phone');
   var expireTime = parseInt(localStorage.getItem('shopxand_reset_expire') || '0');
   
   // Проверка кода
   if (!code) {
  showToast('Ошибка', 'Введите код подтверждения', 'error');
  return;
   }
   if (code !== savedCode) {
  showToast('Неверный код', 'Проверьте код подтверждения', 'error');
  return;
   }
   if (Date.now() > expireTime) {
  showToast('Код истёк', 'Код действителен 5 минут. Запросите новый.', 'error');
  return;
   }
   if (!newPassword || newPassword.length < 6 || !/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
  showToast('Ошибка', 'Пароль: минимум 6 символов, буквы и цифры', 'error');
  return;
   }
   
   // Обновляем пароль
   var users = getAllUsers();
   var userIndex = users.findIndex(function(u) { return u.phone === phone; });
   
   if (userIndex >= 0) {
  users[userIndex].password = newPassword;
  saveAllUsers(users);
  
  // Очищаем временные данные
  localStorage.removeItem('shopxand_reset_code');
  localStorage.removeItem('shopxand_reset_phone');
  localStorage.removeItem('shopxand_reset_expire');
  
  // Сбрасываем форму
  document.getElementById('codeBlock').style.display = 'none';
  document.getElementById('forgotBtn').textContent = 'Проверить';
  document.getElementById('forgotBtn').disabled = false;
  document.getElementById('forgotPhone').value = '';
  document.getElementById('newPassword').value = '';
  var codeInput = document.getElementById('forgotCode');
  if (codeInput) codeInput.value = '';
  
  showToast('Пароль изменён!', 'Теперь войдите с новым паролем', 'success');
  showLoginForm();
   }
    });
    

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
    

    // ============================================
    // CHAT WIDGET - Онлайн чат
    // ============================================
    
    var chatOpenBtn = document.getElementById('chatOpenBtn');
    var chatWindow = document.getElementById('chatWindow');
    var chatCloseBtn = document.getElementById('chatCloseBtn');
    var chatMinimize = document.getElementById('chatMinimize');
    var chatMessages = document.getElementById('chatMessages');
    var chatInput = document.getElementById('chatInput');
    var chatSendBtn = document.getElementById('chatSendBtn');
    var chatBadge = document.getElementById('chatBadge');
    
    var unreadCount = 0;
    
    // Открыть чат
    if (chatOpenBtn) {
   chatOpenBtn.addEventListener('click', function() {
  chatWindow.classList.add('active');
  chatWindow.classList.remove('minimized');
  unreadCount = 0;
  chatBadge.style.display = 'none';
   });
    }

// Обновляем приветствие
  var firstName = document.querySelector('.chat-message--support .chat-message__bubble p');
  if (firstName) {
 var userName = (isLoggedIn && currentUser) ? currentUser.name : 'Гость';
 firstName.textContent = '👋 Здравствуйте, ' + userName + '! Я менеджер ShopXand. Чем могу помочь?';
  }
    
    // Закрыть чат
    if (chatCloseBtn) {
   chatCloseBtn.addEventListener('click', function() {
  chatWindow.classList.remove('active');
   });
    }
    
    // Свернуть чат
    if (chatMinimize) {
   chatMinimize.addEventListener('click', function() {
  chatWindow.classList.toggle('minimized');
   });
    }
    
   function sendChatMessage() {
   var text = chatInput.value.trim();
   if (!text) return;
   
   // Имя и телефон
   var userName, userPhone;
   
   if (isLoggedIn && currentUser) {
  userName = currentUser.name || 'Клиент';
  userPhone = currentUser.phone || 'Не указан';
   } else {
  userName = 'Гость';
  userPhone = 'Не в системе';
   }
   
   // Добавляем сообщение пользователя в чат
   addChatMessage(text, 'user');
   
   // Отправляем в Telegram
   fetch('https://api.telegram.org/bot' + BOT_ORDER + '/sendMessage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
 chat_id: CHAT_ID,
 text: '💬 *Сообщение из чата*\n\n' +
'👤 *Имя:* ' + userName + '\n' +
'📞 *Телефон:* ' + userPhone + '\n\n' +
'💬 *Сообщение:* ' + text,
 parse_mode: 'Markdown'
  })
   });
   
   // Очищаем поле
   chatInput.value = '';
   
   // Авто-ответ
   setTimeout(function() {
  addChatMessage('Спасибо за обращение, ' + userName + '! Менеджер скоро ответит вам. ⏳', 'support');
   }, 1000);
    }
    
    // Добавить сообщение в чат
    function addChatMessage(text, type) {
   var now = new Date();
   var time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
   
   var msgDiv = document.createElement('div');
   msgDiv.className = 'chat-message chat-message--' + type;
   
   msgDiv.innerHTML = 
  '<div class="chat-message__avatar">' +
 (type === 'support' ? '<i class="fas fa-headset"></i>' : '<i class="fas fa-user"></i>') +
  '</div>' +
  '<div class="chat-message__bubble">' +
 '<p>' + text + '</p>' +
 '<span class="chat-message__time">' + time + '</span>' +
  '</div>';
   
   chatMessages.appendChild(msgDiv);
   chatMessages.scrollTop = chatMessages.scrollHeight;
   
   // Если чат не открыт — счётчик
   if (!chatWindow.classList.contains('active')) {
  unreadCount++;
  chatBadge.textContent = unreadCount;
  chatBadge.style.display = 'flex';
   }
    }
    
    // Кнопка отправки
    if (chatSendBtn) {
   chatSendBtn.addEventListener('click', sendChatMessage);
    }
    
    // Enter для отправки
    if (chatInput) {
   chatInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
 sendChatMessage();
  }
   });
    }
    
    console.log('💬 Чат загружен');


 // ============================================
    // REVIEWS API
    // ============================================
    
    var qvAddReviewBtn = document.getElementById('qvAddReviewBtn');
    var qvReviewForm = document.getElementById('qvReviewForm');
    var qvReviewCancel = document.getElementById('qvReviewCancel');
    var qvReviewSubmit = document.getElementById('qvReviewSubmit');
    var qvReviewStars = document.getElementById('qvReviewStars');
    var qvReviewText = document.getElementById('qvReviewText');
    var qvReviewsList = document.getElementById('qvReviewsList');
    
    var selectedRating = 0;
    var reviewsData = {};
    
    async function loadReviews() {
   try {
  var data = await apiRequest('/reviews');
  reviewsData = data.reviews || {};
   } catch (err) {
  reviewsData = JSON.parse(localStorage.getItem('shopxand_reviews') || '{}');
   }
    }
    
    function saveReviewsLocal() {
   localStorage.setItem('shopxand_reviews', JSON.stringify(reviewsData));
    }
    
    // Звёзды
    if (qvReviewStars) {
   qvReviewStars.querySelectorAll('span').forEach(function(star) {
  star.addEventListener('click', function() {
 selectedRating = parseInt(this.getAttribute('data-star'));
 updateReviewStars();
  });
  star.addEventListener('mouseenter', function() {
 highlightStars(parseInt(this.getAttribute('data-star')));
  });
   });
   qvReviewStars.addEventListener('mouseleave', function() {
  highlightStars(selectedRating);
   });
    }
    
    function highlightStars(count) {
   qvReviewStars.querySelectorAll('span').forEach(function(s, i) {
  s.querySelector('i').className = i < count ? 'fas fa-star' : 'far fa-star';
   });
    }
    
    function updateReviewStars() { highlightStars(selectedRating); }
    
    // Открыть форму
    if (qvAddReviewBtn) {
   qvAddReviewBtn.addEventListener('click', function() {
  if (!isLoggedIn) {
 showToast('Войдите', 'Чтобы оставить отзыв, войдите в аккаунт', 'error');
 openAuth();
 return;
  }
  qvReviewForm.style.display = 'block';
  selectedRating = 0;
  updateReviewStars();
  qvReviewText.value = '';
   });
    }
    
    // Отмена
    if (qvReviewCancel) {
   qvReviewCancel.addEventListener('click', function() {
  qvReviewForm.style.display = 'none';
   });
    }
    
    // Отправить отзыв
    if (qvReviewSubmit) {
   qvReviewSubmit.addEventListener('click', async function() {
  var text = qvReviewText.value.trim();
  
  if (selectedRating === 0) { showToast('Ошибка', 'Поставьте оценку', 'error'); return; }
  if (!text) { showToast('Ошибка', 'Напишите отзыв', 'error'); return; }
  
  var productId = currentQvProduct.id;
  var review = {
 name: currentUser.name,
 rating: selectedRating,
 text: text,
 date: new Date().toISOString()
  };
  
  
  console.log('Отправляю отзыв:', { productId, review });
  
  try {
 await apiRequest('/reviews', {
method: 'POST',
body: JSON.stringify({ productId, review })
 });
  } catch (err) {}
  
  qvReviewForm.style.display = 'none';
  selectedRating = 0;
  qvReviewText.value = '';
  
  updateProductRating(productId);
  renderProductReviews(productId);
  showToast('Отзыв отправлен!', 'Он появится после проверки модератором', 'success');
   });
    }
    
    function renderProductReviews(productId) {
   var reviews = reviewsData[productId] || [];
   
   if (reviews.length === 0) {
  qvReviewsList.innerHTML = '<div class="quickview__review-empty"><span>📝</span><p>Отзывов пока нет. Будьте первым!</p></div>';
  return;
   }
   
   qvReviewsList.innerHTML = reviews.map(function(r) {
  var date = new Date(r.date);
  var stars = '';
  for (var i = 1; i <= 5; i++) stars += i <= r.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
  return '<div class="qv-review-item">' +
 '<div class="qv-review-item__header"><span class="qv-review-item__name">' + r.name + '</span><span class="qv-review-item__date">' + date.toLocaleDateString('ru-RU') + '</span></div>' +
 '<div class="qv-review-item__stars">' + stars + '</div>' +
 '<p class="qv-review-item__text">' + r.text + '</p></div>';
   }).join('');
    }
    
    function updateProductRating(productId) {
   var reviews = reviewsData[productId] || [];
   if (reviews.length === 0) return;
   var total = reviews.reduce(function(s, r) { return s + r.rating; }, 0);
   var avg = (total / reviews.length).toFixed(1);
   if (productsData[productId]) {
  productsData[productId].rating = parseFloat(avg);
  productsData[productId].reviews = reviews.length;
   }
   if (currentQvProduct && currentQvProduct.id === productId) {
  document.querySelector('.quickview__rating-num').textContent = avg;
  document.querySelector('.quickview__reviews').textContent = reviews.length + ' отзывов';
   }
    }
    
    var originalOpenQuickview = openQuickview;
    openQuickview = function(productId) {
   originalOpenQuickview(productId);
   renderProductReviews(productId);
   qvReviewForm.style.display = 'none';
    };
    
    loadReviews();

   // ============================================
    // PUSH NOTIFICATIONS
    // ============================================
    
    var pushBanner = document.getElementById('pushBanner');
    var pushYes = document.getElementById('pushYes');
    var pushNo = document.getElementById('pushNo');
    var pushSubscription = null;
    
    // Ключи для VAPID (сгенерируй свои: https://web-push-codelab.glitch.me/)
    var vapidPublicKey = 'BEl62i2YrVqKf5qFh7LxQ8mXkPz9nR3sT6wV0yA1bC4dE5fG6hI7jK8lM9nO0pQrStUvWxYz';
    
    function urlBase64ToUint8Array(base64String) {
   var padding = '='.repeat((4 - base64String.length % 4) % 4);
   var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
   var rawData = window.atob(base64);
   var outputArray = new Uint8Array(rawData.length);
   for (var i = 0; i < rawData.length; ++i) {
  outputArray[i] = rawData.charCodeAt(i);
   }
   return outputArray;
    }
    
    // Показать баннер
function showPushBanner() {
   if (!pushBanner) return;
   if (localStorage.getItem('push_banner_dismissed')) return;
   if (Notification.permission === 'granted') return;
   
   // Если уже запрещено — показываем кнопку "Как включить"
   if (Notification.permission === 'denied') {
  document.getElementById('pushYes').style.display = 'none';
  document.getElementById('pushSettings').style.display = 'block';
   }
   
   setTimeout(function() {
  pushBanner.classList.add('show');
   }, 5000); // через 5 секунд
    }

 // Кнопка "Как включить"
    document.getElementById('pushSettings')?.addEventListener('click', function() {
   showToast(
  'Как включить уведомления',
  '1. Нажмите 🔒 слева от адреса\n2. Найдите "Уведомления"\n3. Выберите "Разрешить"\n4. Обновите страницу',
  'error'
   );
   pushBanner.classList.remove('show');
   localStorage.setItem('push_banner_dismissed', '1');
    });
    
    // Запросить разрешение
  function requestPushPermission() {
   if (!('Notification' in window)) {
  showToast('Не поддерживается', 'Ваш браузер не поддерживает уведомления', 'error');
  pushBanner.classList.remove('show');
  return;
   }
   
   // Если уже разрешено
   if (Notification.permission === 'granted') {
  showToast('Уже включены!', 'Уведомления уже работают 🔔', 'success');
  pushBanner.classList.remove('show');
  localStorage.setItem('push_banner_dismissed', '1');
  return;
   }
   
   // Если запрещено — показываем инструкцию
   if (Notification.permission === 'denied') {
  showToast(
 'Уведомления заблокированы',
 'Нажмите на значок 🔒 слева от адресной строки → Разрешить уведомления',
 'error'
  );
  pushBanner.classList.remove('show');
  localStorage.setItem('push_banner_dismissed', '1');
  return;
   }
   
   // Запрашиваем разрешение
   Notification.requestPermission().then(function(permission) {
  pushBanner.classList.remove('show');
  localStorage.setItem('push_banner_dismissed', '1');
  
  if (permission === 'granted') {
 showToast('Уведомления включены!', 'Вы будете получать уведомления о заказах и акциях 🔔', 'success');
  } else if (permission === 'denied') {
 showToast(
'Заблокировано',
'Нажмите на значок 🔒 слева от адресной строки → Разрешить уведомления',
'error'
 );
  } else {
 showToast(
'Не решено',
'Нажмите на значок 🔒 слева от адресной строки → Разрешить уведомления',
'error'
 );
  }
   });
    }
    
    function subscribeToPush() {
   if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
   
   navigator.serviceWorker.ready.then(function(registration) {
  registration.pushManager.subscribe({
 userVisibleOnly: true,
 applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  }).then(function(subscription) {
 pushSubscription = subscription;
 console.log('Push подписка:', subscription);
 localStorage.setItem('push_subscription', JSON.stringify(subscription));
  }).catch(function(err) {
 console.log('Push ошибка:', err);
  });
   });
    }
    
    // Отправить уведомление
    function sendPushNotification(title, body, icon, url) {
   if (!('Notification' in window)) return;
   
   if (Notification.permission === 'granted') {
  var options = {
 body: body,
 icon: icon || 'img/icons/icon-192x192.png',
 badge: 'img/icons/icon-72x72.png',
 vibrate: [200, 100, 200],
 data: { url: url || '/' },
 requireInteraction: false
  };
  
  var notification = new Notification(title, options);
  
  notification.onclick = function() {
 window.open(url || '/', '_blank');
 notification.close();
  };
  
  // Авто-закрытие через 5 секунд
  setTimeout(function() {
 notification.close();
  }, 5000);
   }
    }
    
    // Кнопки
    if (pushYes) {
   pushYes.addEventListener('click', requestPushPermission);
    }
    if (pushNo) {
   pushNo.addEventListener('click', function() {
  pushBanner.classList.remove('show');
  localStorage.setItem('push_banner_dismissed', '1');
   });
    }
    
    // Уведомление при заказе
    function notifyOrderStatus(order, status) {
   var title, body;
   
   switch(status) {
  case 'processing':
 title = '📦 Заказ ' + order.id;
 body = 'Ваш заказ принят! Доставка 12-18 дней.';
 break;
  case 'delivery':
 title = '🚚 Заказ ' + order.id;
 body = 'Ваш заказ в пути! Ожидайте доставку.';
 break;
  case 'completed':
 title = '✅ Заказ ' + order.id;
 body = 'Заказ доставлен! Спасибо за покупку!';
 break;
  default:
 return;
   }
   
   sendPushNotification(title, body);
    }
    
    // Уведомление об акции
    function notifyPromo(title, body) {
   sendPushNotification(title, body);
    }
    
    // Показываем баннер при загрузке
    showPushBanner();
    
    // Экспорт функций
    window.notifyOrderStatus = notifyOrderStatus;
    window.notifyPromo = notifyPromo;
    
    console.log('🔔 Push-уведомления загружены');


   function renderProductCards() {
   var grid = document.getElementById('productsGrid');
   if (!grid) return;
   
   var allProducts = getAllProductsData();
   
   grid.innerHTML = allProducts.map(function(p) {
  return `
  <div class="product-card" data-cat="${p.cat || ''}">
 <div class="product-card__img">
<img src="${p.img || ''}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.innerHTML='📦'">
<button class="product-card__fav" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img || ''}" data-cat="${p.cat || ''}">
    <i class="far fa-heart"></i>
</button>
${p.oldPrice ? '<span class="product-card__badge">-' + Math.round((1 - p.price/p.oldPrice)*100) + '%</span>' : ''}
 </div>
 <div class="product-card__body">
<span class="product-card__cat">${p.cat || ''}</span>
<h3 class="product-card__name">${p.name}</h3>
<div class="product-card__rating">
    <i class="fas fa-star"></i>
    <span>${p.rating || '0'}</span>
    <span class="product-card__reviews">(${p.reviews || 0} отзывов)</span>
</div>
<div class="product-card__price">
    ${p.oldPrice ? '<span class="product-card__price-old">' + p.oldPrice + ' сомони</span>' : ''}
    <span class="product-card__price-current">${p.price} сомони</span>
</div>
<button class="product-card__cart-btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img || ''}" data-cat="${p.cat || ''}">
    <i class="fas fa-shopping-cart"></i> В корзину
</button>
 </div>
  </div>`;
   }).join('');
   
   // Перепривязываем события
   bindProductEvents();
    }
    
    function bindProductEvents() {
   document.querySelectorAll('.product-card__fav').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
 e.preventDefault();
 e.stopPropagation();
 var product = {
id: this.getAttribute('data-id'),
name: this.getAttribute('data-name'),
price: this.getAttribute('data-price'),
img: this.getAttribute('data-img'),
cat: this.getAttribute('data-cat')
 };
 toggleFavorite(product);
  });
   });
   
   document.querySelectorAll('.product-card__cart-btn').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
 e.preventDefault();
 var product = {
id: this.getAttribute('data-id'),
name: this.getAttribute('data-name'),
price: this.getAttribute('data-price'),
img: this.getAttribute('data-img'),
cat: this.getAttribute('data-cat')
 };
 addToCart(product);
 this.textContent = '✓ Добавлено';
 this.style.background = '#00c853';
 var self = this;
 setTimeout(function() {
self.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
self.style.background = '';
 }, 1500);
  });
   });
    }

    // ============================================
    // ОТПРАВКА ОТЗЫВА — финальная версия
    // ============================================
    document.addEventListener('click', function(e) {
   var target = e.target;
   if (target.id === 'qvReviewSubmit' || target.closest('#qvReviewSubmit')) {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('Кнопка Отправить отзыв нажата');
  
  if (!currentQvProduct) {
 console.log('Нет товара');
 return;
  }
  
  var text = document.getElementById('qvReviewText')?.value?.trim();
  var selected = document.querySelector('#qvReviewStars .fas.fa-star')?.parentElement?.getAttribute('data-star');
  var rating = selected ? parseInt(selected) : 0;
  
  console.log('Текст:', text, 'Рейтинг:', rating);
  
  if (!text) { alert('Напишите отзыв'); return; }
  if (rating === 0) { alert('Поставьте оценку'); return; }
  
  // Отправляем
  fetch(API_URL + '/reviews', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
productId: currentQvProduct.id,
review: {
    name: currentUser ? currentUser.name : 'Гость',
    rating: rating,
    text: text,
    date: new Date().toISOString()
}
 })
  }).then(function(r) { return r.json(); })
    .then(function(data) {
 console.log('Ответ:', data);
 document.getElementById('qvReviewForm').style.display = 'none';
 document.getElementById('qvReviewText').value = '';
 alert('Отзыв отправлен на модерацию!');
  }).catch(function(err) {
 console.error('Ошибка:', err);
 alert('Ошибка отправки');
  });
   }
    });

    


   // ============================================
    // BOTTOM NAVIGATION
    // ============================================
    
    var bnHome = document.getElementById('bnHome');
    var bnFavorites = document.getElementById('bnFavorites');
    var bnCart = document.getElementById('bnCart');
    var bnOrders = document.getElementById('bnOrders');
    var bnMenu = document.getElementById('bnMenu');
    var bnCartBadge = document.getElementById('bnCartBadge');
    
    // Главная
    if (bnHome) {
   bnHome.addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
   });
    }
    
    // Избранное
    if (bnFavorites) {
   bnFavorites.addEventListener('click', function(e) {
  e.preventDefault();
  if (!isLoggedIn) { openAuth(); return; }
  openFavorites();
   });
    }
    
    // Корзина
    if (bnCart) {
   bnCart.addEventListener('click', function(e) {
  e.preventDefault();
  if (!isLoggedIn) { openAuth(); return; }
  openCart();
   });
    }
    
    // Заказы
    if (bnOrders) {
   bnOrders.addEventListener('click', function(e) {
  e.preventDefault();
  if (!isLoggedIn) { openAuth(); return; }
  openOrders();
   });
    }
    
    // Меню (бургер)
    if (bnMenu) {
   bnMenu.addEventListener('click', function(e) {
  e.preventDefault();
  if (mobileMenu.classList.contains('active')) {
 closeMenu();
  } else {
 openMenu();
  }
   });
    }
    
    // Обновление счётчика корзины
    function updateBottomNavCart(count) {
   if (bnCartBadge) {
  bnCartBadge.textContent = count;
  bnCartBadge.style.display = count > 0 ? 'flex' : 'none';
   }
    }
    
    // Вызывай при обновлении корзины
    var origUpdateCartCount = updateCartCount;
    updateCartCount = function() {
   origUpdateCartCount();
   var total = cart.reduce(function(s, i) { return s + i.quantity; }, 0);
   updateBottomNavCart(total);
    };


        // ============================================
    // ТАРИФЫ ДОСТАВКИ
    // ============================================
    var deliveryPrices = {
        'Душанбе': { courier: 25, express: 45, freeFrom: 300 },
        'Худжанд': { courier: 35, express: 60, freeFrom: 500 },
        'Куляб': { courier: 40, express: 70, freeFrom: 500 },
        'Бохтар': { courier: 35, express: 60, freeFrom: 400 },
        'Хорог': { courier: 50, express: 90, freeFrom: 700 },
        'default': { courier: 30, express: 50, freeFrom: 400 }
    };
    
    var productWeights = {
        '1': 0.3, '2': 0.8, '3': 0.8, '4': 0.1,
        '5': 0.2, '6': 0.5, '7': 0.15, '8': 0.4
    };
    
    function getCityDeliveryPrice(city, type) {
        var cityRates = deliveryPrices[city] || deliveryPrices['default'];
        return cityRates[type] || 30;
    }
    
    function getTotalWeight() {
        var totalWeight = 0;
        cart.forEach(function(item) {
            var weight = productWeights[item.id] || 0.3;
            totalWeight += weight * item.quantity;
        });
        return totalWeight;
    }
    
    function calculateDeliveryCost() {
        var city = document.getElementById('checkoutCity')?.value || 'Душанбе';
        var deliveryType = document.querySelector('input[name="delivery"]:checked')?.value || 'courier';
        var totalPrice = getTotalPrice();
        var totalWeight = getTotalWeight();
        
        // Базовая цена
        var basePrice = getCityDeliveryPrice(city, deliveryType);
        
        // Добавка за вес (каждый кг +5 сомони)
        var weightExtra = Math.floor(totalWeight) * 5;
        
        // Бесплатная доставка при сумме заказа больше X
        var cityRates = deliveryPrices[city] || deliveryPrices['default'];
        var freeFrom = cityRates.freeFrom || 400;
        
        if (totalPrice >= freeFrom && deliveryType === 'courier') {
            return 0;
        }
        
        return basePrice + weightExtra;
    }
    
    function updateDeliveryDisplay() {
        var city = document.getElementById('checkoutCity')?.value || 'Душанбе';
        var totalWeight = getTotalWeight();
        var courierPrice = getCityDeliveryPrice(city, 'courier');
        var expressPrice = getCityDeliveryPrice(city, 'express');
        
        document.getElementById('courierPrice').textContent = courierPrice + ' сомони';
        document.getElementById('expressPrice').textContent = expressPrice + ' сомони';
        document.getElementById('deliveryCityName').textContent = city;
        document.getElementById('deliveryWeight').textContent = 'Вес заказа: ' + totalWeight.toFixed(1) + ' кг';
        
        var totalPrice = getTotalPrice();
        var cityRates = deliveryPrices[city] || deliveryPrices['default'];
        if (totalPrice >= cityRates.freeFrom) {
            document.getElementById('deliveryCalcInfo').textContent = '🎉 Бесплатная доставка! (заказ от ' + cityRates.freeFrom + ' с.)';
            document.getElementById('courierPrice').textContent = 'Бесплатно';
            document.getElementById('courierPrice').style.color = '#00c853';
        } else {
            document.getElementById('deliveryCalcInfo').textContent = 'Стоимость доставки рассчитана для вашего города';
            document.getElementById('courierPrice').style.color = '';
        }
    }
    
    // Обновляем при смене города
    document.getElementById('checkoutCity')?.addEventListener('change', function() {
        updateDeliveryDisplay();
        updateCheckoutSummary();
    });



        // ============================================
    // TRACKING
    // ============================================
    
    window.showTracking = function(orderId) {
        var order = orders.find(function(o) { return o.id === orderId; });
        if (!order) return;
        
        document.getElementById('trackNumberDisplay').textContent = order.trackNumber || '—';
        
        var timeline = document.getElementById('trackingTimeline');
        var history = order.trackingHistory || [];
        
        timeline.innerHTML = (order.trackSteps || []).map(function(step, i) {
            var hist = history[i] || {};
            var isCompleted = step.completed;
            var isCurrent = step.current;
            var className = 'tracking-step';
            if (isCompleted) className += ' completed';
            if (isCurrent) className += ' current';
            
            return '<div class="' + className + '">' +
                '<div class="tracking-step__dot"></div>' +
                '<div class="tracking-step__label">' + step.label + '</div>' +
                (hist.date ? '<div class="tracking-step__date">' + new Date(hist.date).toLocaleString('ru-RU') + '</div>' : '') +
                (hist.location ? '<div class="tracking-step__location">📍 ' + hist.location + '</div>' : '') +
            '</div>';
        }).join('');
        
        document.getElementById('trackingModal').classList.add('active');
    };
    
    document.getElementById('trackingOverlay')?.addEventListener('click', function() {
        document.getElementById('trackingModal').classList.remove('active');
    });
    
    document.getElementById('trackingClose')?.addEventListener('click', function() {
        document.getElementById('trackingModal').classList.remove('active');
    });


        // ============================================
    // SEARCH BY PHOTO — Поиск по фото
    // ============================================
    
    var photoSearchBtn = document.getElementById('searchByPhotoBtn');
    var photoSearchInput = document.getElementById('photoSearchInput');
    var photoSearchModal = document.getElementById('photoSearchModal');
    
    if (photoSearchBtn) {
        photoSearchBtn.addEventListener('click', function() {
            photoSearchModal.classList.add('active');
            // Сбрасываем окно
            document.getElementById('photoSearchUpload').style.display = 'block';
            document.getElementById('photoSearchLoading').style.display = 'none';
            document.getElementById('photoSearchResults').innerHTML = '';
            // Сбрасываем input чтобы можно было выбрать тот же файл
            photoSearchInput.value = '';
        });
    }
    
    document.getElementById('photoSearchOverlay')?.addEventListener('click', function() {
        photoSearchModal.classList.remove('active');
    });
    
    document.getElementById('photoSearchClose')?.addEventListener('click', function() {
        photoSearchModal.classList.remove('active');
    });
    
    document.getElementById('photoSearchSelectBtn')?.addEventListener('click', function() {
        photoSearchInput.value = ''; // Сбрасываем перед выбором
        photoSearchInput.click();
    });
    
    // Клик по области загрузки тоже открывает выбор
    document.getElementById('photoSearchUpload')?.addEventListener('click', function(e) {
        if (e.target.tagName !== 'BUTTON') {
            photoSearchInput.value = '';
            photoSearchInput.click();
        }
    });
    
    if (photoSearchInput) {
        photoSearchInput.addEventListener('change', function() {
            var file = this.files[0];
            if (!file) return;
            
            // Показываем загрузку
            document.getElementById('photoSearchUpload').style.display = 'none';
            document.getElementById('photoSearchLoading').style.display = 'block';
            document.getElementById('photoSearchResults').innerHTML = '';
            
            // Читаем файл
            var reader = new FileReader();
            reader.onload = function(e) {
                analyzeImage(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }
    
    function analyzeImage(imageData) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);
            
            var imageData = ctx.getImageData(0, 0, 100, 100);
            var pixels = imageData.data;
            
            // Анализируем цвета более точно
            var colors = analyzeColors(pixels);
            
            // Ищем похожие товары по цветам
            searchSimilarProducts(colors);
        };
        img.src = imageData;
    }
    
    function analyzeColors(pixels) {
        var totalR = 0, totalG = 0, totalB = 0, count = 0;
        
        // Берём каждый 4-й пиксель для скорости
        for (var i = 0; i < pixels.length; i += 16) {
            totalR += pixels[i];
            totalG += pixels[i + 1];
            totalB += pixels[i + 2];
            count++;
        }
        
        return {
            r: Math.floor(totalR / count),
            g: Math.floor(totalG / count),
            b: Math.floor(totalB / count)
        };
    }
    
    function colorDistance(c1, c2) {
        return Math.sqrt(
            Math.pow(c1.r - c2.r, 2) +
            Math.pow(c1.g - c2.g, 2) +
            Math.pow(c1.b - c2.b, 2)
        );
    }
    
    function getProductColors(product) {
        // Предопределённые цвета для товаров (можно расширить)
        var colorMap = {
            '1': { r: 50, g: 30, b: 30 },    // Вельветовая рубашка (тёмная)
            '2': { r: 240, g: 240, b: 240 },  // Кроссовка AF1 (белая)
            '3': { r: 180, g: 140, b: 100 },  // Кроссовка британская (коричневая)
            '4': { r: 30, g: 30, b: 30 },     // Наушник (чёрный)
            '5': { r: 200, g: 180, b: 150 },  // Часы (золотые)
            '6': { r: 40, g: 30, b: 25 },     // Тапочки (тёмно-коричневые)
            '7': { r: 200, g: 200, b: 200 },  // Знак Mercedes (серебристый)
            '8': { r: 240, g: 240, b: 240 }   // Рубашка белая
        };
        return colorMap[product.id] || { r: 128, g: 128, b: 128 };
    }
    
    function searchSimilarProducts(targetColor) {
        var allProducts = getAllProductsData();
        
        // Считаем "похожесть" для каждого товара
        var scored = allProducts.map(function(p) {
            var productColor = getProductColors(p);
            var distance = colorDistance(targetColor, productColor);
            return { product: p, score: distance };
        });
        
        // Сортируем: чем меньше расстояние — тем похожее
        scored.sort(function(a, b) { return a.score - b.score; });
        
        // Берём топ-6 самых похожих
        var results = scored.slice(0, 6).map(function(s) { return s.product; });
        
        showPhotoSearchResults(results);
    }
    
    function showPhotoSearchResults(products) {
        document.getElementById('photoSearchLoading').style.display = 'none';
        var container = document.getElementById('photoSearchResults');
        
        if (products.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#999;">Ничего не найдено</p>';
            return;
        }
        
        container.innerHTML = products.map(function(p) {
            return '<div class="related-card" onclick="window.openQuickview(\'' + p.id + '\'); document.getElementById(\'photoSearchModal\').classList.remove(\'active\');">' +
                '<div class="related-card__img">' +
                    (p.img ? '<img src="' + p.img + '" alt="' + p.name + '">' : '<span>📦</span>') +
                '</div>' +
                '<div class="related-card__name">' + p.name + '</div>' +
                '<div class="related-card__price">' + p.price.toLocaleString() + ' с.</div>' +
            '</div>';
        }).join('');
    }