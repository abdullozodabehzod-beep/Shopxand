import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

function Favorites({ favorites, onRemove, onAddToCart, onClose }) {
  const { formatPrice } = useCurrency();
  const { tr } = useLanguage();
  return (
    <div className="fav-panel active">
      <div className="fav-panel__overlay" onClick={onClose}></div>
      <div className="fav-panel__content">
        <div className="fav-panel__header">
          <h3 className="fav-panel__title">
            <i className="fas fa-heart"></i>
            {tr('Избранное')}
            <span className="fav-panel__count">{favorites.length} {tr('товаров')}</span>
          </h3>
          <button className="fav-panel__close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="fav-panel__items">
          {favorites.length === 0 ? (
            <div className="fav-panel__empty">
              <span className="fav-panel__empty-icon">💖</span>
              <h4>{tr('В избранном пусто')}</h4>
              <p>{tr('Добавляйте товары, нажимая на сердечко')}</p>
            </div>
          ) : (
            favorites.map(item => (
              <div key={item._id} className="fav-item">
                <div className="fav-item__img">
                  <img src={item.img} alt={item.name} style={{width:'100%',height:'100%',objectFit:'contain',borderRadius:10}} />
                </div>
                <div className="fav-item__info">
                  <h4 className="fav-item__name">{item.name}</h4>
                  <div className="fav-item__price">{formatPrice(item.price)}</div>
                </div>
                <div className="fav-item__actions">
                  <button className="fav-item__cart-btn" onClick={() => onAddToCart(item)}>
                    <i className="fas fa-shopping-cart"></i> {tr('В корзину')}
                  </button>
                  <button className="fav-item__remove" onClick={() => onRemove(item._id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Favorites;