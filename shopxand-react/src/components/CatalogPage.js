import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BLOCKS, pick } from '../data/categories';

// Каталог на весь экран: список разделов, внутри раздела раскрываются 10 позиций
function CatalogPage({ onClose, onPickBlock, onPickItem }) {
  const { lang, tr } = useLanguage();
  const [openKey, setOpenKey] = useState(null);
  const refs = useRef({});

  useEffect(() => {
    if (!openKey) return undefined;
    const timer = setTimeout(() => {
      const el = refs.current[openKey];
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
    return () => clearTimeout(timer);
  }, [openKey]);

  return (
    <div className="cat-page">
      <div className="cat-page__bar">
        <button type="button" className="cat-page__back" onClick={onClose} aria-label={tr('Назад')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="cat-page__bar-text">
          <h2>{tr('Каталог')}</h2>
          <span>{tr('Выберите категорию')}</span>
        </div>
      </div>

      <div className="cat-page__body">
        <div className="cat-page__list">
          {BLOCKS.map(block => {
            const open = openKey === block.key;
            return (
              <section
                key={block.key}
                ref={el => { refs.current[block.key] = el; }}
                className={`cat-card ${open ? 'is-open' : ''}`}
                style={{ '--c1': block.color, '--c2': block.color2 }}
              >
                <button type="button" className="cat-card__head" aria-expanded={open} onClick={() => setOpenKey(open ? null : block.key)}>
                  <span className="cat-card__icon">{block.icon}</span>
                  <span className="cat-card__title">{pick(block.title, lang)}</span>
                  <i className="fas fa-chevron-down cat-card__chev"></i>
                </button>

                <div className="cat-card__panel" aria-hidden={!open}>
                  <div className="cat-card__inner">
                    <ul className="cat-card__items">
                      {block.items.map((item, i) => (
                        <li key={i}>
                          <button type="button" className="cat-card__item" tabIndex={open ? 0 : -1} onClick={() => onPickItem(block, item)}>
                            <span className="cat-card__num">{i + 1}</span>
                            <span className="cat-card__name">{pick(item, lang)}</span>
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button type="button" className="cat-card__all" tabIndex={open ? 0 : -1} onClick={() => onPickBlock(block)}>
                      {tr('Смотреть все товары')} <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CatalogPage;
