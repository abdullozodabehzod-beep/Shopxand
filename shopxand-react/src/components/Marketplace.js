import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BLOCKS, pick } from '../data/categories';

// Блоки разделов в стиле маркетплейса: у каждого раздела своя карточка и 10 позиций
function Marketplace({ onSelectBlock, onSelectItem }) {
  const { lang, tr } = useLanguage();

  return (
    <section className="mk" id="categories">
      <div className="container">
        <div className="mk__head">
          <h2 className="mk__title">{tr('Категории')}</h2>
          <p className="mk__subtitle">{tr('Выберите раздел и найдите нужный товар')}</p>
        </div>

        <div className="mk__grid">
          {BLOCKS.map(block => (
            <article key={block.key} className="mk-block" style={{ '--c1': block.color, '--c2': block.color2 }}>
              <header className="mk-block__head" onClick={() => onSelectBlock(block)}>
                <span className="mk-block__icon">{block.icon}</span>
                <div className="mk-block__titles">
                  <h3 className="mk-block__title">{pick(block.title, lang)}</h3>
                  <span className="mk-block__count">{block.items.length} {tr('позиций')}</span>
                </div>
              </header>

              <ul className="mk-block__list">
                {block.items.map((item, i) => (
                  <li key={i}>
                    <button type="button" className="mk-block__item" onClick={() => onSelectItem(block, item)}>
                      <span className="mk-block__num">{i + 1}</span>
                      <span className="mk-block__name">{pick(item, lang)}</span>
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </li>
                ))}
              </ul>

              <button type="button" className="mk-block__all" onClick={() => onSelectBlock(block)}>
                {tr('Смотреть все товары')} <i className="fas fa-arrow-right"></i>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Marketplace;
