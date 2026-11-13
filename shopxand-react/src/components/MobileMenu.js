import React from "react";

import { useLanguage } from "../context/LanguageContext";

function MobileMenu({ onClose, onOpenAuth, onOpenCart, onOpenFavorites, onOpenOrders, user, onOpenCityModal, onOpenLangModal, onOpenCatalog, onOpenWishlist }) {
  const { lang, t, tr } = useLanguage();

  return (
    <div className="mobile-menu active">
      <div className="mobile-menu__overlay" onClick={onClose}></div>
      <div className="mobile-menu__content">
        {/* Заголовок меню */}
        <div className="mobile-menu__top">
          <div className="mobile-menu__user">
            <div className="mobile-menu__avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="mobile-menu__user-info">
              <a href="#" className="mobile-menu__login-btn" onClick={(e) => { e.preventDefault(); onOpenAuth(); onClose(); }}>
                {user ? user.name : t('loginReg')}
              </a>
            </div>
          </div>
        </div>

        {/* Категории */}
        <div className="mobile-menu__categories">
          <div className="mobile-menu__section-title">{t('menuTitle')}</div>
          <ul className="mobile-menu__nav">
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); onClose(); onOpenCatalog && onOpenCatalog(); }}>
                <i className="fas fa-th-large"></i>
                <span>{tr('Каталог')}</span>
                <i className="fas fa-chevron-right"></i>
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); onClose(); onOpenWishlist && onOpenWishlist(); }}>
                <i className="fas fa-gift"></i>
                <span>{tr('Желания')}</span>
                <i className="fas fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </div>

       <div className="mobile-menu__secondary">
  <ul className="mobile-menu__secondary-list">
    <li>
  <a href="#" onClick={(e) => { e.preventDefault(); onOpenCityModal(); onClose(); }}>
    <i className="fas fa-map-marker-alt"></i>
    <span>{tr('Душанбе')}</span>
  </a>
</li>
<li>
  <a href="#" onClick={(e) => { e.preventDefault(); onOpenLangModal(); onClose(); }}>
    <i className="fas fa-globe"></i>
    <span>{lang === 'ru' ? 'Русский (RU)' : lang === 'tg' ? 'Тоҷикӣ (TJ)' : 'English (EN)'}</span>
  </a>
</li>
  </ul>
</div>
      </div>
    </div>
  );
}

export default MobileMenu;