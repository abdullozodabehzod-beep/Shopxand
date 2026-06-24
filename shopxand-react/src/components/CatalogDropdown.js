import React from 'react';

function CatalogDropdown({ onClose, onSearch }) {
  const categories = [
    {
      name: 'Одежда',
      icon: 'fa-tshirt',
      items: ['Обувь', 'Рубашки', 'Крассовки', 'Брюки', 'Обувь', 'Аксессуары']
    },
    {
      name: 'Электроника',
      icon: 'fa-laptop',
      items: ['Наушники', 'Часы', 'Смартфоны']
    },
    {
      name: 'Дом и сад',
      icon: 'fa-home',
      items: ['Мебель', 'Декор', 'Кухня']
    },
    {
      name: 'Компьютеры',
      icon: 'fa-desktop',
      items: ['Ноутбуки', 'Мониторы', 'Клавиатуры']
    },
    {
      name: 'Косметика',
      icon: 'fa-spa',
      items: ['Уход за лицом', 'Макияж', 'Парфюмерия']
    },
    {
      name: 'Акции',
      icon: 'fa-percent',
      items: ['Скидки', 'Распродажа', 'Новинки']
    }
  ];

  return (
    <>
      <div className="catalog-dropdown active">
        <div className="container">
          <div className="catalog-dropdown__grid">
            {categories.map((cat, index) => (
              <div key={index} className="catalog-dropdown__col">
                <a href="#" className="catalog-dropdown__category" onClick={(e) => { e.preventDefault(); onSearch(cat.name); onClose(); }}>
                  <i className={`fas ${cat.icon}`}></i>
                  <span>{cat.name}</span>
                </a>
                <ul className="catalog-dropdown__sub">
                  {cat.items.map((item, i) => (
                    <li key={i}>
                      <a href="#" onClick={(e) => { e.preventDefault(); onSearch(item); onClose(); }}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="catalog-overlay active" onClick={onClose}></div>
    </>
  );
}

export default CatalogDropdown;