import React, { useState } from 'react';

function CategoriesBar({ onSelectCategory }) {
  const [showSub, setShowSub] = useState(null);

  const categories = [
    { 
      name: 'Одежда', icon: '👗', cat: 'Одежда',
      sub: ['Рубашки', 'Крассовки', 'Брюки', 'Тапочки']
    },
    { 
      name: 'Электроника', icon: '📱', cat: 'Электроника',
      sub: ['Наушники', 'Часы', 'Аксессуары']
    },
    { 
      name: 'Дом и сад', icon: '🏠', cat: 'Дом и сад',
      sub: ['Мебель', 'Декор', 'Садоводство']
    },
    { 
      name: 'Компьютеры', icon: '💻', cat: 'Компьютеры',
      sub: ['Ноутбуки', 'ПК', 'Мониторы']
    },
    { 
      name: 'Косметика', icon: '💄', cat: 'Косметика',
      sub: ['Уход за лицом', 'Макияж', 'Парфюмерия']
    },
    { 
      name: 'Акции', icon: '🔥', cat: 'Акции',
      sub: ['Скидки', 'Распродажа']
    },
  ];

  return (
    <section className="categories-bar">
      <h3>Личные категории</h3>
      <div className="container">
        <div className="categories-bar__grid">
          {categories.map((cat, i) => (
            <div key={i} style={{position:'relative'}}>
              <a 
                href="#" 
                className="category-btn"
                onClick={(e) => { 
                  e.preventDefault(); 
                  console.log('Клик по категории:', i, 'showSub:', showSub);
                  setShowSub(showSub === i ? null : i); 
                }}
                onDoubleClick={(e) => { 
                  e.preventDefault(); 
                  onSelectCategory(cat.cat); 
                }}
              >
                <div className="category-btn__icon">{cat.icon}</div>
                <span>{cat.name}</span>
              </a>
              
              {showSub === i && (
                <div className="category-btn-dropdown">
                  {cat.sub.map((sub, j) => (
                    <a 
                      key={j}
                      href="#" 
                      style={{display:'block',padding:'8px 12px',fontSize:13,color:'#333',textDecoration:'none',borderRadius:6}}
                      onClick={(e) => { 
                        e.preventDefault(); 
                        onSelectCategory(cat.cat);
                        setShowSub(null);
                      }}
                    >
                      {sub}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesBar;