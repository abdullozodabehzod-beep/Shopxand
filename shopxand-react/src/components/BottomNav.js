import React from 'react';

function BottomNav({ onOpenCart, onOpenFavorites, onOpenOrders, onOpenMenu, cartCount, user, setShowAuth }) {  return (
    <nav className="bottom-nav">
      <button className="bottom-nav__item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fas fa-home"></i>
        <span>Главная</span>
      </button>
      <button className="bottom-nav__item" onClick={() => {
      if (!user) { setShowAuth(true); return; }
      onOpenFavorites(true);
    }}>
      <i className="fas fa-heart"></i>
      <span>Избранное</span>
    </button>
    <button className="bottom-nav__item" onClick={onOpenCart}>
        <i className="fas fa-shopping-cart"></i>
        {cartCount > 0 && <span className="bottom-nav__badge">{cartCount}</span>}
        <span>Корзина</span>
      </button>
      <button className="bottom-nav__item" onClick={onOpenOrders}>
        <i className="fas fa-box"></i>
        <span>Заказы</span>
      </button>
       
    </nav>
  );
}

export default BottomNav;