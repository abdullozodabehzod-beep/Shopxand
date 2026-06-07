import React from 'react';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-card__img">
        <img src={product.img} alt={product.name} />
        <button className="product-card__fav">
          <i className="far fa-heart"></i>
        </button>
        {product.oldPrice && (
          <span className="product-card__badge">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
      </div>
      <div className="product-card__body">
        <span className="product-card__cat">{product.cat}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__rating">
          <i className="fas fa-star"></i>
          <span>{product.rating || '0'}</span>
          <span className="product-card__reviews">({product.reviews || 0} отзывов)</span>
        </div>
        <div className="product-card__price">
          {product.oldPrice && <span className="product-card__price-old">{product.oldPrice} с.</span>}
          <span className="product-card__price-current">{product.price} с.</span>
        </div>
        <button className="product-card__cart-btn" onClick={() => onAddToCart(product)}>
          <i className="fas fa-shopping-cart"></i> В корзину
        </button>
      </div>
    </div>
  );
}

export default ProductCard;