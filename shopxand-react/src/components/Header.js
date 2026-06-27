import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageModal from './LanguageModal';
import CityModal from './CityModal';
import Search from './Search';
import MobileMenu from './MobileMenu';
import VoiceSearch from './VoiceSearch';
import { useTheme } from '../context/ThemeContext';
import CurrencySwitcher from './CurrencySwitcher';
import { useCurrency } from '../context/CurrencyContext';


function Header({ user, onOpenAuth, onOpenCart, onSearchSelect, onSearch, products, onOpenFavorites, onOpenOrders, setShowPhotoSearch, onSelectCategory, setShowLogout, onOpenWishlist }) {
  const { currency, changeCurrency, rates } = useCurrency();
  const { lang, t } = useLanguage();
  const [showLangModal, setShowLangModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [currentCity, setCurrentCity] = useState(localStorage.getItem('shopxand_city') || 'Душанбе');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const langCodes = { ru: 'RU', tg: 'TJ', en: 'EN' };

  return (
    <>
      <header className="header">
        <div className="header__top">
            <div className="header__currency" onClick={() => {
            const next = currency === 'TJS' ? 'RUB' : currency === 'RUB' ? 'USD' : 'TJS';
            changeCurrency(next);
          }}>
            <span>{rates[currency].symbol}</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="container">
            <div className="header__top-inner">
              <div className="header__location" onClick={() => setShowCityModal(true)}>
                <i className="fas fa-map-marker-alt"></i>
                <span className="header__city">{currentCity}</span>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="header__lang" onClick={() => setShowLangModal(true)}>
                <span className="header__lang-current">{langCodes[lang]}</span>
                <i className="fas fa-chevron-down"></i>
              </div>
              <CurrencySwitcher />
               <button className="theme-toggle" onClick={toggleTheme}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            </div>
          </div>
        </div>

        <div className="header__main">
          <div className="container">
            <div className="header__main-inner">
              <button className="header__burger" onClick={() => setShowMobileMenu(true)}>
                <span></span><span></span><span></span>
              </button>

              <a href="/" className="header__logo">
                <span className="header__logo-icon">
                  <svg viewBox="0 0 500 500" width="40" height="40">
                    <defs><clipPath id="xclip2"><rect x="320" y="0" width="250" height="500"/></clipPath></defs>
                    <text x="320" y="410" fontFamily="Arial Black" fontWeight="900" fontSize="400" fill="#1a6df0" textAnchor="middle" clipPath="url(#xclip2)">X</text>
                    <text x="170" y="410" fontFamily="Arial Black" fontWeight="900" fontSize="400" fill="#111" textAnchor="middle">S</text>
                  </svg>
                </span>
                <span className="header__logo-text">Shop<span className="header__logo-accent">Xand</span></span>
              </a>

              <button className="header__catalog-btn" onClick={() => setShowCatalog(!showCatalog)}>
                <i className="fas fa-bars"></i>
                <span>{t('catalog')}</span>
              </button>

              <div className="header__search header__search--desktop">
                <Search products={products} onSearchSelect={onSearchSelect} onSearch={onSearch} />
                <button className="header__voice-btn" onClick={() => setShowVoice(true)}>
                <i className="fas fa-microphone"></i>
              </button>
              </div>

              <div className="header__actions header__actions--desktop">
                <a href="#" className="header__action" onClick={(e) => { e.preventDefault(); user ? setShowLogout(true) : onOpenAuth(); }}>
                  <i className={`fas ${user ? 'fa-user-check' : 'fa-user'}`}></i>
                  <span>{user ? user.name : t('login')}</span>
                </a>
                <a href="#" className="header__action" onClick={(e) => { e.preventDefault(); onOpenOrders(); }}>
                  <i className="fas fa-box"></i>
                  <span>{t('orders')}</span>
                </a>
                <a href="#" className="header__action" onClick={(e) => { e.preventDefault(); if (!user) { onOpenAuth(); return; } onOpenFavorites(); }}>
                  <i className="fas fa-heart"></i>
                  <span>{t('favorites')}</span>
                </a>
                <a href="#" className="header__action header__action--cart" onClick={(e) => { e.preventDefault(); onOpenCart(); }}>
                  <i className="fas fa-shopping-cart"></i>
                  <span>{t('cart')}</span>
                </a>
                <a href="#" className="header__action" onClick={(e) => { e.preventDefault(); onOpenWishlist(); }}>
                <i className="fas fa-gift"></i>
                <span>Желания</span>
              </a>
              </div>

              <button className="header__search-toggle" onClick={() => setShowMobileSearch(!showMobileSearch)}>
                <i className="fas fa-search"></i>
              </button>

             {/* Кнопка входа на мобильном */}
            <a href="#" className="header__action header__login--mobile" onClick={(e) => { 
              e.preventDefault(); 
              user ? setShowLogout(true) : onOpenAuth(); 
            }}>
              <i className={`fas ${user ? 'fa-user-check' : 'fa-user'}`}></i>
            </a>
            </div>
          </div>
        </div>

        {showMobileSearch && (
          <div className="header__search--mobile active">
            <div className="container">
              <Search products={products} onSearchSelect={onSearchSelect} onSearch={onSearch} />
            </div>
          </div>
        )}

        <nav className="header__nav">
          <div className="container">
            <ul className="header__nav-list">
              <li><a href="#" className="header__nav-link" onClick={(e) => { e.preventDefault(); onSelectCategory('Одежда'); }}>{t('clothing')}</a></li>
              <li><a href="#" className="header__nav-link" onClick={(e) => { e.preventDefault(); onSelectCategory('Электроника'); }}>{t('electronics')}</a></li>
              <li><a href="#" className="header__nav-link" onClick={(e) => { e.preventDefault(); onSelectCategory('Дом и сад'); }}>{t('home')}</a></li>
              <li><a href="#" className="header__nav-link" onClick={(e) => { e.preventDefault(); onSelectCategory('Компьютеры'); }}>{t('computers')}</a></li>
              <li><a href="#" className="header__nav-link" onClick={(e) => { e.preventDefault(); onSelectCategory('Косметика'); }}>{t('cosmetics')}</a></li>
              <li><a href="#" className="header__nav-link" onClick={(e) => { e.preventDefault(); onSelectCategory('Обувь'); }}>Обувь</a></li>
              <li><a href="#" className="header__nav-link" onClick={(e) => { e.preventDefault(); onSelectCategory('Акции'); }}>{t('sales')}</a></li>
            </ul>
          </div>
        </nav>

        <div className={`catalog-dropdown ${showCatalog ? 'active' : ''}`}>
          <div className="container">
            <div className="catalog-dropdown__grid">
              
              <div className="catalog-dropdown__col">
                <a href="#" className="catalog-dropdown__category" onClick={(e) => { e.preventDefault(); onSelectCategory('Одежда'); setShowCatalog(false); }}>
                  <i className="fas fa-tshirt"></i><span>Одежда</span>
                </a>
                <ul className="catalog-dropdown__sub">
                  <li><a href="#" onClick={(e) => { e.preventDefault(); onSearch('обувь'); setShowCatalog(false); }}>Обувь</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); onSearch('рубашка'); setShowCatalog(false); }}>Рубашки</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); onSearch('кроссовка'); setShowCatalog(false); }}>Крассовки</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); onSearch('брюки'); setShowCatalog(false); }}>Брюки</a></li>
                </ul>
              </div>
              
              <div className="catalog-dropdown__col">
                <a href="#" className="catalog-dropdown__category" onClick={(e) => { e.preventDefault(); onSelectCategory('Электроника'); setShowCatalog(false); }}>
                  <i className="fas fa-laptop"></i><span>Электроника</span>
                </a>
                <ul className="catalog-dropdown__sub">
                  <li><a href="#" onClick={(e) => { e.preventDefault(); onSearch('наушник'); setShowCatalog(false); }}>Наушники</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); onSearch('часы'); setShowCatalog(false); }}>Часы</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); onSearch('аксессуар'); setShowCatalog(false); }}>Аксессуары</a></li>
                </ul>
              </div>
              
              <div className="catalog-dropdown__col">
                <a href="#" className="catalog-dropdown__category" onClick={(e) => { e.preventDefault(); onSelectCategory('Дом и сад'); setShowCatalog(false); }}>
                  <i className="fas fa-home"></i><span>Дом и сад</span>
                </a>
                <ul className="catalog-dropdown__sub">
                  <li><a href="#" onClick={(e) => { e.preventDefault(); onSearch('мебель'); setShowCatalog(false); }}>Мебель</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); onSearch('декор'); setShowCatalog(false); }}>Декор</a></li>
                </ul>
              </div>

            </div>
          </div>
        </div>
        {showCatalog && <div className="catalog-overlay active" onClick={() => setShowCatalog(false)}></div>}
      </header>

      {showLangModal && <LanguageModal onClose={() => setShowLangModal(false)} />}
      {showCityModal && <CityModal onClose={() => setShowCityModal(false)} currentCity={currentCity} onSelectCity={(city) => { setCurrentCity(city); localStorage.setItem('shopxand_city', city); }} />}
      {showMobileMenu && <MobileMenu onClose={() => setShowMobileMenu(false)} onOpenAuth={onOpenAuth} onOpenCart={onOpenCart} onOpenFavorites={onOpenFavorites} onOpenOrders={onOpenOrders} user={user} onOpenCityModal={() => setShowCityModal(true)} onOpenLangModal={() => setShowLangModal(true)} />}
        {showVoice && <VoiceSearch onSearch={onSearch} onClose={() => setShowVoice(false)} />}
    </>
  );
}

export default Header;