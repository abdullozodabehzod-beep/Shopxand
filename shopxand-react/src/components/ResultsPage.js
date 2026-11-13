import React from 'react';
import { useLanguage } from '../context/LanguageContext';

// Отдельное окно с товарами выбранной категории, позиции или поиска
function ResultsPage({ title, list, renderCard, onClose }) {
  const { tr } = useLanguage();

  return (
    <div className="res-page">
      <div className="res-page__bar">
        <button type="button" className="cat-page__back" onClick={onClose} aria-label={tr('Назад')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="cat-page__bar-text">
          <h2>{title}</h2>
          <span>{list.length} {tr('товаров')}</span>
        </div>
      </div>

      <div className="res-page__body">
        <div className="container">
          {list.length === 0 ? (
            <div className="products__empty">
              <span>🛍️</span>
              <h3>{tr('Пока нет товаров в этом разделе')}</h3>
              <p>{tr('Скоро здесь появятся новые товары')}</p>
              <button type="button" onClick={onClose}>{tr('Назад')}</button>
            </div>
          ) : (
            <div className="products__grid">{list.map(renderCard)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
