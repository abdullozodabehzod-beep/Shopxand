import React, { useState, useEffect } from 'react';
import Reviews from './Reviews';

function Quickview({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [mainImg, setMainImg] = useState(product.img);
  const [selectedThumb, setSelectedThumb] = useState(product.img);
  const [currentPrice, setCurrentPrice] = useState(product.price);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState([]);

useEffect(() => {
  if (!product?._id) return;
  
  fetch('http://localhost:3000/api/reviews')
    .then(r => r.json())
    .then(data => {
      const productReviews = data.reviews?.[product._id] || [];
      setReviews(productReviews);
      // Обновляем счётчик
      const reviewsCountEl = document.querySelector('.quickview__reviews');
      if (reviewsCountEl) {
        reviewsCountEl.textContent = productReviews.length + ' отзывов';
      }
    });
}, [product?._id]);

  if (!product) return null;
 

  return (
    <div className="quickview active">
<div className="quickview__overlay" onClick={onClose}></div>
<div className="quickview__modal">
<button className="quickview__close" onClick={onClose}>
<i className="fas fa-times"></i>
</button>

<div className="quickview__content">
{/* Галерея */}
<div className="quickview__gallery">
<div className="quickview__main-img">
  <img src={mainImg || product.img} alt={product.name} />
</div>
<div className="quickview__thumbs">
  {[product.img, ...(product.thumbs || [])].map((thumb, i) => (
    <button 
      key={i} 
      className={`quickview__thumb ${mainImg === thumb ? 'active' : ''}`}
      onClick={() => {
        setMainImg(thumb);
        setSelectedThumb(thumb);
        const thumbIndex = [product.img, ...(product.thumbs || [])].indexOf(thumb);
        if (thumbIndex > 0 && product.thumbPrices?.[thumbIndex - 1]) {
          setCurrentPrice(product.thumbPrices[thumbIndex - 1]);
        } else {
          setCurrentPrice(product.price);
        }
      }}
    >
      <img src={thumb} alt="" />
    </button>
  ))}
</div>
</div>

{/* Информация */}
<div className="quickview__info">
<span className="quickview__cat">{product.cat}</span>
<h2 className="quickview__name">{product.name}</h2>

{/* Отзывы */}
<div className="quickview__reviews-section">
  <div className="quickview__reviews-header">
    <h4>Отзывы о товаре</h4>
    <button className="quickview__add-review-btn" onClick={() => setShowReviewForm(!showReviewForm)}>
      <i className="fas fa-pen"></i> Написать отзыв
    </button>
  </div>

  {showReviewForm && (
    <div className="quickview__review-form">
      <div className="quickview__review-stars">
        {[1,2,3,4,5].map(star => (
          <span key={star} onClick={() => setReviewRating(star)}>
            <i className={`${star <= reviewRating ? 'fas' : 'far'} fa-star`}></i>
          </span>
        ))}
      </div>
      <textarea 
        placeholder="Напишите ваш отзыв..." 
        rows="3" 
        value={reviewText}
        onChange={e => setReviewText(e.target.value)}
      />
      <div className="quickview__review-actions">
        <button className="quickview__review-cancel" onClick={() => setShowReviewForm(false)}>Отмена</button>
        <button className="quickview__review-submit" onClick={() => {
  if (reviewRating === 0) { alert('Поставьте оценку'); return; }
  if (!reviewText.trim()) { alert('Напишите отзыв'); return; }

  fetch('http://localhost:3000/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: product._id,
      review: { name: 'Клиент', rating: reviewRating, text: reviewText }
    })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      setReviews(prev => [data.review, ...prev]);
      const countE1 = document.querySelector('.quickview__reviews')
      if (countE1) {
        const num = (parseInt(countE1.textContent) || 0) + 1
      }
      setShowReviewForm(false);
      setReviewText('');
      setReviewRating(0);
    }
  })
  .catch(() => alert('Ошибка'));
}}>Отправить отзыв</button>
      </div>
    </div>
  )}
</div>

{/* Рейтинг */}
<div className="quickview__rating">
  <div className="quickview__stars">
    {[1,2,3,4,5].map(i => (
      <i key={i} className={`${i <= Math.round(product.rating || 0) ? 'fas' : 'far'} fa-star`}></i>
    ))}
  </div>
  <span className="quickview__rating-num">{product.rating || '0'}</span>
  <span className="quickview__reviews">{product.reviews || 0} отзыва</span>
</div>

{/* Цена */}
<div className="quickview__prices">
  {product.oldPrice && <span className="quickview__price-old">{product.oldPrice} сомони</span>}
  <span className="quickview__price-current">{currentPrice.toLocaleString()} сомони</span>
  {product.oldPrice && (
    <span className="quickview__discount">
      -{Math.round((1 - product.price / product.oldPrice) * 100)}%
    </span>
  )}
</div>

{/* Описание */}
<p className="quickview__desc">{product.desc || 'Нет описания'}</p>

{/* Отзывы список */}
<Reviews productId={product._id} reviews={reviews} />

{/* Характеристики */}
<div className="quickview__specs">
  {product.material && (
    <div className="quickview__spec"><span>Материал</span><span>{product.material}</span></div>
  )}
  {product.season && (
    <div className="quickview__spec"><span>Сезон</span><span>{product.season}</span></div>
  )}
  {product.style && (
    <div className="quickview__spec"><span>Стиль</span><span>{product.style}</span></div>
  )}
  {product.specs && product.specs.map((spec, i) => (
    <div key={i} className="quickview__spec"><span>{spec[0]}</span><span>{spec[1]}</span></div>
  ))}
</div>

{/* Размеры */}
{product.sizes && product.sizes.length > 0 && (
  <div className="quickview__size">
    <span>Размер:</span>
    <div className="quickview__size-options">
      {product.sizes.map(size => (
        <button key={size} className={`quickview__size-btn ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>
      ))}
    </div>
  </div>
)}

{/* Размеры обуви */}
{product.shoeSizes && product.shoeSizes.length > 0 && (
  <div className="quickview__size">
    <span>Размер обуви:</span>
    <div className="quickview__size-options">
      {product.shoeSizes.map(size => (
        <button key={size} className={`quickview__size-btn ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>
      ))}
    </div>
  </div>
)}

{/* Цвета */}
{product.colors && product.colors.length > 0 && (
  <div className="quickview__colors">
    <span>Цвет:</span>
    <div className="quickview__color-options">
      {product.colors.map((color, i) => (
        <button key={i} className={`quickview__color-btn ${selectedColor === color ? 'active' : ''}`} onClick={() => {
          setSelectedColor(color);
          setCurrentPrice(product.thumbPrices?.[i] || product.price);
          if (product.thumbs?.[i]) setMainImg(product.thumbs[i]);
        }}>{color}</button>
      ))}
    </div>
  </div>
)}

{/* Количество */}
<div className="quickview__quantity">
  <span>Количество:</span>
  <div className="quickview__qty-controls">
    <button className="quickview__qty-btn" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>−</button>
    <span className="quickview__qty-num">{quantity}</span>
    <button className="quickview__qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
  </div>
</div>

{/* Кнопки */}
<div className="quickview__actions">
  <button className="quickview__cart-btn" onClick={() => { 
  onAddToCart({
    ...product,
    img: selectedThumb || mainImg || product.img,
    price: currentPrice,
    selectedSize,
    selectedColor,
    material: product.material,
    season: product.season,
    style: product.style
  }); 
  onClose(); 
}}>
    <i className="fas fa-shopping-cart"></i> В корзину
  </button>
  <button className="quickview__fav-btn"><i className="far fa-heart"></i></button>
  <button className="quickview__share-btn" onClick={() => {
    if (navigator.share) {
      navigator.share({ title: product.name, text: product.price + ' сомони', url: window.location.href });
    }
  }}><i className="fas fa-share-alt"></i></button>
</div>

{/* Доставка */}
<div className="quickview__delivery">
  <div className="quickview__delivery-item">
    <i className="fas fa-truck"></i>
    <div><strong>Курьерская доставка</strong><span>от 1 до 3 дней, 30 сомони</span></div>
  </div>
  <div className="quickview__delivery-item">
    <i className="fas fa-store"></i>
    <div><strong>Самовывоз</strong><span>сегодня, бесплатно</span></div>
  </div>
</div>
</div>
</div>
</div>
</div>
);
}

export default Quickview;