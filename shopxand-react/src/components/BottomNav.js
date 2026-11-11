import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function BottomNav({ onOpenCart, onOpenFavorites, onOpenOrders, cartCount, onOpenMenu, user, setShowAuth, onOpenWishlist }) {
  const { tr } = useLanguage();
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__scroll">
        <button className="bottom-nav__item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="bottom-nav__icon">🏠</div>
          <span>{tr('Главная')}</span>
        </button>
        <button className="bottom-nav__item" onClick={onOpenWishlist}>
          <div className="bottom-nav__icon">🎁</div>
          <span>{tr('Желания')}</span>
        </button>
        <button className="bottom-nav__item" onClick={onOpenCart}>
          <div className="bottom-nav__icon">🛒</div>
          {cartCount > 0 && <span className="bottom-nav__badge">{cartCount}</span>}
          <span>{tr('Корзина')}</span>
        </button>
        <button className="bottom-nav__item" onClick={onOpenOrders}>
          <div className="bottom-nav__icon">📦</div>
          <span>{tr('Заказы')}</span>
        </button>
        <button className="bottom-nav__item" onClick={onOpenMenu}>
          <div className="bottom-nav__icon">👤</div>
          <span>{user ? tr('Профиль') : tr('Войти')}</span>
        </button>
      </div>
    </nav>
  );
}

export default BottomNav;