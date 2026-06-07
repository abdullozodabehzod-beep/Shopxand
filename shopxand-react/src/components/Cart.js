import React from 'react';

function Cart({ cart, onRemove, onCheckout, onClose }) {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="cart-panel active">
      <div className="cart-panel__overlay" onClick={onClose}></div>
      <div className="cart-panel__content">
        <div className="cart-panel__header">
          <h3 className="cart-panel__title">
            <i className="fas fa-shopping-cart"></i> Корзина
            <span className="cart-panel__count">{cart.length} товаров</span>
          </h3>
          <button className="cart-panel__close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-panel__items">
          {cart.length === 0 ? (
            <div className="cart-panel__empty">
              <span className="cart-panel__empty-icon">🛒</span>
              <h4>Корзина пуста</h4>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item__img"><span>{item.img || '📦'}</span></div>
                <div className="cart-item__info">
                  <h4 className="cart-item__name">{item.name}</h4>
                  <span className="cart-item__price">{item.price} с.</span>
                </div>
                <div className="cart-item__quantity">
                  <button className="cart-item__qty-btn">−</button>
                  <span className="cart-item__qty-num">{item.quantity}</span>
                  <button className="cart-item__qty-btn">+</button>
                </div>
                <button className="cart-item__remove" onClick={() => onRemove(item._id)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-panel__footer">
          <div className="cart-panel__total">
            <span>Итого:</span>
            <span className="cart-panel__total-price">{total.toLocaleString()} с.</span>
          </div>
          <button className="cart-panel__checkout-btn" onClick={onCheckout} disabled={cart.length === 0}>
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;