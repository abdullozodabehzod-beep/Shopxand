import React, { useState, useEffect } from 'react';
import Reviews from './Reviews';
import Recommendations from './Recommendations';
import PriceAlert from './PriceAlert';
import { useCurrency } from '../context/CurrencyContext';
import Subscribe from './Subscribe';
import StockNotify from './StockNotify';

function Quickview({ product, onClose, onAddToCart, onUpdateProduct, products, user }) {
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
  const [reviewsCount, setReviewsCount] = useState(product.reviews || 0);
  const [avgRating, setAvgRating] = useState(product.rating || 0);
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [reviewPhoto, setReviewPhoto] = useState(null);
  const { formatPrice } = useCurrency();
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showStockNotify, setShowStockNotify] = useState(false);
  

  const showToast = (msg) => {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#1a1a2e;color:#fff;padding:12px 24px;border-radius:10px;z-index:9999;font-weight:600;animation:fadeInOut 3s forwards;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  };

  useEffect(() => {
    if (!product?._id) return;
    fetch('http://localhost:3000/api/reviews')
      .then(r => r.json())
      .then(data => {
        const productReviews = data.reviews?.[product._id] || [];
        setReviews(productReviews);
        setReviewsCount(productReviews.length);
        if (productReviews.length > 0) {
          const total = productReviews.reduce((s, r) => s + r.rating, 0);
          setAvgRating((total / productReviews.length).toFixed(1));
        }
      });
  }, [product?._id]);

     const handleSubmitReview = () => {
    if (reviewRating === 0) { showToast('Поставьте оценку'); return; }
    if (!reviewText.trim()) { showToast('Напишите отзыв'); return; }

    const newReview = { 
      name: 'Клиент', 
      rating: reviewRating, 
      text: reviewText, 
      photo: reviewPhoto,
      date: new Date().toISOString() 
    };

    // Сразу показываем отзыв
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    setReviewsCount(updatedReviews.length);
    const total = updatedReviews.reduce((s, r) => s + r.rating, 0);
    setAvgRating(parseFloat((total / updatedReviews.length).toFixed(1)));
    
    // Очищаем форму
    setShowReviewForm(false);
    setReviewText('');
    setReviewRating(0);
    setReviewPhoto(null);

    // Отправляем на сервер
    fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product._id,
        review: newReview
      })
    })
    .then(r => r.json())
    .then(data => {
      if (!data.success) {
        showToast('Ошибка сохранения');
      }
    })
    .catch(() => showToast('Ошибка сервера'));
  };

  const compressImage = (base64, callback) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Уменьшаем до 300px максимум
      const maxSize = 300;
      let w = img.width, h = img.height;
      if (w > h && w > maxSize) { h = (h / w) * maxSize; w = maxSize; }
      else if (h > maxSize) { w = (w / h) * maxSize; h = maxSize; }
      
      canvas.width = w; canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      
      // Сжимаем до 80% качества
      callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = base64;
  };

  const sendReview = (reviewData) => {
    fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product._id,
        review: reviewData
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        const newReview = { ...reviewData };
        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        setReviewsCount(updatedReviews.length);
        const total = updatedReviews.reduce((s, r) => s + r.rating, 0);
        setAvgRating(parseFloat((total / updatedReviews.length).toFixed(1)));
        setShowReviewForm(false);
        setReviewText('');
        setReviewRating(0);
        setReviewPhoto(null);
        showToast('Отзыв отправлен!');
      }
    })
    .catch(() => showToast('Ошибка'));
  };

  if (!product) return null;

  return (
    <div className="quickview active">
      <div className="quickview__overlay" onClick={onClose}></div>
      <div className="quickview__modal">
        <button className="quickview__back" onClick={onClose}><i className="fas fa-arrow-left"></i></button>
        <div className="quickview__content">
          <div className="quickview__gallery">
            <div className="quickview__main-img">
              <img src={mainImg || product.img} alt={product.name} onError={(e) => { e.target.src = '/img/placeholder.png'; }} />
            </div>
<div className="quickview__thumbs">
  {[product.img, ...(product.thumbs || [])].map((thumb, i) => (
    <button key={i} className={`quickview__thumb ${mainImg === thumb ? 'active' : ''}`}
      onClick={() => {
        setMainImg(thumb); setSelectedThumb(thumb);
        if (i > 0 && product.thumbPrices?.[i - 1]) setCurrentPrice(product.thumbPrices[i - 1]);
        else setCurrentPrice(product.price);
      }}><img src={thumb} alt="" /></button>
  ))}
</div>
</div>

<div className="quickview__info">
<span className="quickview__cat">{product.cat}</span>
<h2 className="quickview__name">{product.name}</h2>

<div className="quickview__rating">
  <div className="quickview__stars">
    {[1,2,3,4,5].map(i => (<i key={i} className={`${i <= Math.round(avgRating) ? 'fas' : 'far'} fa-star`}></i>))}
  </div>
  <span className="quickview__rating-num">{avgRating}</span>
  <span className="quickview__reviews">({reviewsCount} отзывов)</span>
</div>

<div className="quickview__prices">
  {product.oldPrice && <span className="quickview__price-old">{formatPrice(currentPrice)}</span>}
  <span className="quickview__price-current">{formatPrice(currentPrice)}</span>
  {product.oldPrice && <span className="quickview__discount">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
</div>

<p className="quickview__desc">{product.desc || 'Нет описания'}</p>

<div className="quickview__reviews-section">
  <div className="quickview__reviews-header">
    <h4>Отзывы о товаре</h4>
    <button className="quickview__add-review-btn" onClick={() => setShowReviewForm(!showReviewForm)}><i className="fas fa-pen"></i> Написать отзыв</button>
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
  
  {/* Загрузка фото */}
  <div className="quickview__review-photo">
    <label htmlFor="reviewPhotoInput">
      <i className="fas fa-camera"></i> Добавить фото
    </label>
    <input 
      type="file" 
      id="reviewPhotoInput" 
      accept="image/*" 
      style={{display:'none'}}
      onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Проверяем размер
      if (file.size > 500 * 1024) { // больше 500KB
        showToast('Фото слишком большое. Максимум 500KB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => setReviewPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }}
                                        />
        {reviewPhoto && (
          <div className="quickview__review-photo-preview">
            <img src={reviewPhoto} alt="Preview" />
            <button onClick={() => setReviewPhoto(null)}>✕</button>
          </div>
        )}
      </div>

      <textarea placeholder="Напишите ваш отзыв..." rows="3" value={reviewText} onChange={e => setReviewText(e.target.value)} />
      <div className="quickview__review-actions">
        <button className="quickview__review-cancel" onClick={() => { setShowReviewForm(false); setReviewPhoto(null); }}>Отмена</button>
        <button className="quickview__review-submit" onClick={handleSubmitReview}>Отправить отзыв</button>
      </div>
    </div>
  )}
</div>

    <Reviews productId={product._id} reviews={reviews} />

    <div className="quickview__specs">
      {product.material && <div className="quickview__spec"><span>Материал</span><span>{product.material}</span></div>}
      {product.season && <div className="quickview__spec"><span>Сезон</span><span>{product.season}</span></div>}
      {product.style && <div className="quickview__spec"><span>Стиль</span><span>{product.style}</span></div>}
      {product.specs && product.specs.map((spec, i) => (<div key={i} className="quickview__spec"><span>{spec[0]}</span><span>{spec[1]}</span></div>))}
    </div>

    {product.sizes && product.sizes.length > 0 && (
      <div className="quickview__size"><span>Размер:</span><div className="quickview__size-options">{product.sizes.map(size => (<button key={size} className={`quickview__size-btn ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>))}</div></div>
    )}
    {product.shoeSizes && product.shoeSizes.length > 0 && (
      <div className="quickview__size"><span>Размер обуви:</span><div className="quickview__size-options">{product.shoeSizes.map(size => (<button key={size} className={`quickview__size-btn ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>))}</div></div>
    )}
    {product.colors && product.colors.length > 0 && (
      <div className="quickview__colors"><span>Цвет:</span><div className="quickview__color-options">{product.colors.map((color, i) => (<button key={i} className={`quickview__color-btn ${selectedColor === color ? 'active' : ''}`} onClick={() => { setSelectedColor(color); setCurrentPrice(product.thumbPrices?.[i] || product.price); if (product.thumbs?.[i]) setMainImg(product.thumbs[i]); }}>{color}</button>))}</div></div>
    )}

    <div className="quickview__quantity">
      <span>Количество:</span>
      <div className="quickview__qty-controls">
        <button className="quickview__qty-btn" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>−</button>
        <span className="quickview__qty-num">{quantity}</span>
        <button className="quickview__qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
    </div>

    <div className="quickview__actions">
      <button className="quickview__cart-btn" onClick={() => { onAddToCart({...product, img: selectedThumb || mainImg || product.img, price: currentPrice, selectedSize, selectedColor, material: product.material, season: product.season, style: product.style}); onClose(); }}><i className="fas fa-shopping-cart"></i> В корзину</button>
      <button className="quickview__fav-btn" onClick={() => {
        const favs = JSON.parse(localStorage.getItem('shopxand_favorites') || '[]');
        const exists = favs.find(f => f._id === product._id);
        if (exists) localStorage.setItem('shopxand_favorites', JSON.stringify(favs.filter(f => f._id !== product._id)));
        else { favs.push(product); localStorage.setItem('shopxand_favorites', JSON.stringify(favs)); }
        showToast(exists ? 'Удалено из избранного' : 'Добавлено в избранное');
      }}><i className="far fa-heart"></i></button>
      <button className="quickview__share-btn" onClick={() => { if (navigator.share) navigator.share({ title: product.name, text: product.price + ' сомони', url: window.location.href }); }}><i className="fas fa-share-alt"></i></button>
      <button className="quickview__price-alert-btn" onClick={() => setShowPriceAlert(true)}>
      🔔 Узнать о снижении цены
    </button>
     <button className="quickview__subscribe-btn" onClick={() => setShowSubscribe(true)}>
        📦 Подписка
      </button>
      
    </div>
    
      {!product.inStock && (
              <StockNotify 
                product={product} 
                user={user} 
                onClose={() => setShowStockNotify(false)} 
              />
            )}
    <div className="quickview__delivery">
      <div className="quickview__delivery-item"><i className="fas fa-truck"></i><div><strong>Курьерская доставка</strong><span>от 1 до 3 дней, 30 сомони</span></div></div>
      <div className="quickview__delivery-item"><i className="fas fa-store"></i><div><strong>Самовывоз</strong><span>сегодня, бесплатно</span></div></div>
    </div>
    <a href={`https://wa.me/992300003230?text=Здравствуйте! Интересует товар: ${product.name} — ${product.price} сомони`} target="_blank" className="quickview__whatsapp-btn" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i><span>Написать в WhatsApp</span></a>

    <div className="quickview__related">
      <h3 className="quickview__related-title">Похожие товары</h3>
      <div className="quickview__related-grid">
        {products && products.filter(p => p.cat === product.cat && p._id !== product._id).slice(0, 4).map(p => (
          <div key={p._id} className="related-card" onClick={() => window.location.reload()}><div className="related-card__img"><img src={p.img} alt={p.name} /></div><div className="related-card__name">{p.name}</div><div className="related-card__price">{p.price} с.</div></div>
        ))}
      </div>
    </div>
  </div>
          <Recommendations 
        currentProduct={product} 
        products={products} 
        onAddToCart={onAddToCart}
        onSelect={(p) => window.location.reload()}
      />
        </div>
      </div>
       {showPriceAlert && <PriceAlert product={product} onClose={() => setShowPriceAlert(false)} />}
        {showSubscribe && <Subscribe product={product} onClose={() => setShowSubscribe(false)} />}
    </div>

  );
}

export default Quickview;