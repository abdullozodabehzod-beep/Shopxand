import React from 'react';

function Reviews({ productId, reviews = [] }) {
  // Фильтруем undefined элементы
  const validReviews = Array.isArray(reviews) ? reviews.filter(r => r) : [];

  return (
    <div className="quickview__reviews-list">
      {validReviews.length === 0 ? (
        <div className="quickview__review-empty">
          <span>📝</span>
          <p>Отзывов пока нет. Будьте первым!</p>
        </div>
      ) : (
        validReviews.map((r, i) => (
          <div key={r.id || i} className="qv-review-item">
            <div className="qv-review-item__header">
              <span className="qv-review-item__name">{r.name || 'Гость'}</span>
              <span className="qv-review-item__date">
                {r.date ? new Date(r.date).toLocaleDateString('ru-RU') : ''}
              </span>
            </div>
            <div className="qv-review-item__stars">
              {[1,2,3,4,5].map(s => (
                <i key={s} className={`${s <= (r.rating || 0) ? 'fas' : 'far'} fa-star`}></i>
              ))}
            </div>
            <p className="qv-review-item__text">{r.text || ''}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Reviews;