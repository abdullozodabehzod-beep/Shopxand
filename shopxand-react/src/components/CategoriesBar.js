import React from 'react';

function CategoriesBar({ onSelectCategory }) {
  const categories = [
    { name: 'Одежда', icon: '👗', cat: 'Одежда' },
    { name: 'Электроника', icon: '📱', cat: 'Электроника' },
    { name: 'Дом и сад', icon: '🏠', cat: 'Дом и сад' },
    { name: 'Компьютеры', icon: '💻', cat: 'Компьютеры' },
    { name: 'Косметика', icon: '💄', cat: 'Косметика' },
    { name: 'Акции', icon: '🔥', cat: 'Акции' },
  ];

  return (
    <section className="categories-bar">
      <h3>Личные категории</h3>
      <div className="container">
        <div className="categories-bar__grid">
          {categories.map((cat, i) => (
            <a 
              key={i} 
              href="#" 
              className="category-btn"
              onClick={(e) => { e.preventDefault(); onSelectCategory(cat.cat); }}
            >
              <div className="category-btn__icon">{cat.icon}</div>
              <span>{cat.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesBar;