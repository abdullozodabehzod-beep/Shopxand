import React from 'react';

function BottomNav({ onOpenCart, onOpenFavorites, onOpenOrders, cartCount, onOpenMenu, user, setShowAuth, onOpenWishlist }) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__scroll">
        <button className="bottom-nav__item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="bottom-nav__icon">🏠</div>
          <span>Главная</span>
        </button>
        <button className="bottom-nav__item" onClick={onOpenWishlist}>
          <div className="bottom-nav__icon">🎁</div>
          <span>Желания</span>
        </button>
        <button className="bottom-nav__item" onClick={onOpenCart}>
          <div className="bottom-nav__icon">🛒</div>
          {cartCount > 0 && <span className="bottom-nav__badge">{cartCount}</span>}
          <span>Корзина</span>
        </button>
        <button className="bottom-nav__item" onClick={onOpenOrders}>
          <div className="bottom-nav__icon">📦</div>
          <span>Заказы</span>
        </button>
        <button className="bottom-nav__item" onClick={onOpenMenu}>
          <div className="bottom-nav__icon">👤</div>
          <span>{user ? 'Профиль' : 'Войти'}</span>
        </button>
      </div>
    </nav>
  );
}

export default BottomNav;