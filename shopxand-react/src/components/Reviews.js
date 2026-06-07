import React, { useState } from 'react';

function Reviews({ productId, reviews = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [localReviews, setLocalReviews] = useState(reviews);

  const handleSubmit = () => {
    if (rating === 0) { alert('Поставьте оценку'); return; }
    if (!text.trim()) { alert('Напишите отзыв'); return; }

    const newReview = {
      name: 'Вы',
      rating,
      text,
      date: new Date().toISOString()
    };

    setLocalReviews([newReview, ...localReviews]);
    setText('');
    setRating(0);
    setShowForm(false);
    alert('Отзыв отправлен на модерацию!');
  };

  return (
    <div className="quickview__reviews-section">
      <div className="quickview__reviews-header">
        <h4>Отзывы о товаре</h4>
        <button className="quickview__add-review-btn" onClick={() => setShowForm(!showForm)}>
          <i className="fas fa-pen"></i> Написать отзыв
        </button>
      </div>

      {showForm && (
        <div className="quickview__review-form">
          <div className="quickview__review-stars">
            {[1,2,3,4,5].map(star => (
              <span key={star} onClick={() => setRating(star)}>
                <i className={`${star <= rating ? 'fas' : 'far'} fa-star`}></i>
              </span>
            ))}
          </div>
          <textarea 
            placeholder="Напишите ваш отзыв..." 
            rows="3" 
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="quickview__review-actions">
            <button className="quickview__review-cancel" onClick={() => setShowForm(false)}>Отмена</button>
            <button className="quickview__review-submit" onClick={handleSubmit}>Отправить отзыв</button>
          </div>
        </div>
      )}

      <div className="quickview__reviews-list">
        {localReviews.length === 0 ? (
          <div className="quickview__review-empty">
            <span>📝</span>
            <p>Отзывов пока нет. Будьте первым!</p>
          </div>
        ) : (
          localReviews.map((r, i) => (
            <div key={i} className="qv-review-item">
              <div className="qv-review-item__header">
                <span className="qv-review-item__name">{r.name}</span>
                <span className="qv-review-item__date">
                  {new Date(r.date).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="qv-review-item__stars">
                {[1,2,3,4,5].map(s => (
                  <i key={s} className={`${s <= r.rating ? 'fas' : 'far'} fa-star`}></i>
                ))}
              </div>
              <p className="qv-review-item__text">{r.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Reviews;