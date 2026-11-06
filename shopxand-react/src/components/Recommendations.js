import React from 'react';

function Recommendations({ currentProduct, products, onAddToCart, onSelect }) {
  if (!currentProduct || !products) return null;

  // 1. Похожие товары (та же категория)
  const sameCategory = products.filter(p => 
    p.cat === currentProduct.cat && p._id !== currentProduct._id
  ).slice(0, 4);

  // 2. Товары в том же ценовом диапазоне
  const similarPrice = products.filter(p => 
    p._id !== currentProduct._id &&
    Math.abs(p.price - currentProduct.price) < currentProduct.price * 0.3
  ).slice(0, 4);

  // 3. Популярные товары (по рейтингу)
  const popular = products
    .filter(p => p._id !== currentProduct._id)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  // 4. Товары которые часто покупают вместе
  const frequentlyBought = products.filter(p => 
    p._id !== currentProduct._id &&
    (p.colors?.some(c => currentProduct.colors?.includes(c)) ||
     p.material === currentProduct.material)
  ).slice(0, 4);

  const renderSection = (title, items, icon) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="recommendations__section">
        <h4 className="recommendations__title">{icon} {title}</h4>
        <div className="recommendations__grid">
          {items.map(p => (
            <div key={p._id} className="recommendations__card" onClick={() => onSelect(p)}>
              {p.oldPrice && (
                <span className="recommendations__card-badge">
                  -{Math.round((1 - p.price / p.oldPrice) * 100)}%
                </span>
              )}
              <div className="recommendations__card-img">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="recommendations__card-rating">
                <i className="fas fa-star"></i>
                <span>{p.rating || '0'}</span>
              </div>
              <div className="recommendations__card-name">{p.name}</div>
              <div className="recommendations__card-price">
                {p.price.toLocaleString()} с.
                {p.oldPrice && <span className="recommendations__card-price-old">{p.oldPrice} с.</span>}
              </div>
              <button className="recommendations__card-btn" onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}>
                <i className="fas fa-shopping-cart"></i> В корзину
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="recommendations">
      {renderSection('Похожие товары', sameCategory, '📦')}
      {renderSection('В том же бюджете', similarPrice, '💰')}
      {renderSection('Популярные', popular, '⭐')}
      {renderSection('Часто покупают вместе', frequentlyBought, '🎯')}
    </div>
  );
}

export default Recommendations;