import React from 'react';

function CatalogDropdown({ onClose }) {
  const categories = [
    {
      name: 'Одежда',
      icon: 'fa-tshirt',
      items: ['Рубашки', 'Крассовки', 'Брюки', 'Аксессуары']
    },
    {
      name: 'Электроника',
      icon: 'fa-laptop',
      items: ['Наушники', 'Часы', 'Смартфоны', 'Аксессуары']
    },
    {
      name: 'Дом и сад',
      icon: 'fa-home',
      items: ['Мебель', 'Декор', 'Кухня', 'Садоводство']
    },
    {
      name: 'Компьютеры',
      icon: 'fa-desktop',
      items: ['Ноутбуки', 'ПК', 'Мониторы', 'Клавиатуры', 'Мыши']
    },
    {
      name: 'Косметика',
      icon: 'fa-spa',
      items: ['Уход за лицом', 'Уход за волосами', 'Макияж', 'Парфюмерия']
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
                <a href="#" className="catalog-dropdown__category">
                  <i className={`fas ${cat.icon}`}></i>
                  <span>{cat.name}</span>
                </a>
                <ul className="catalog-dropdown__sub">
                  {cat.items.map((item, i) => (
                    <li key={i}>
                      <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>
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