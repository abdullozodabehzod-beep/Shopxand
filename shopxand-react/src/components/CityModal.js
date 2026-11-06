import React, { useState } from 'react';

const cities = [
  { name: 'Душанбе', region: 'Крупные города' },
  { name: 'Худжанд', region: 'Крупные города' },
  { name: 'Куляб', region: 'Крупные города' },
  { name: 'Бохтар', region: 'Крупные города' },
  { name: 'Хорог', region: 'Крупные города' },
  { name: 'Истаравшан', region: 'Согдийская область' },
  { name: 'Пенджикент', region: 'Согдийская область' },
  { name: 'Исфара', region: 'Согдийская область' },
  { name: 'Канибадам', region: 'Согдийская область' },
  { name: 'Бустон', region: 'Согдийская область' },
  { name: 'Дангара', region: 'Хатлонская область' },
  { name: 'Нурек', region: 'Хатлонская область' },
  { name: 'Яван', region: 'Хатлонская область' },
  { name: 'Вахдат', region: 'Хатлонская область' },
  { name: 'Турсунзаде', region: 'Хатлонская область' },
];

function CityModal({ onClose, currentCity, onSelectCity }) {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(currentCity || 'Душанбе');

  const filteredCities = search 
    ? cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : cities;

  // Группировка по регионам
  const grouped = {};
  filteredCities.forEach(city => {
    if (!grouped[city.region]) grouped[city.region] = [];
    grouped[city.region].push(city);
  });

  const handleSelect = (cityName) => {
    setSelectedCity(cityName);
    onSelectCity(cityName);
    setTimeout(onClose, 200);
  };

  return (
    <div className="city-modal active">
      <div className="city-modal__overlay" onClick={onClose}></div>
      <div className="city-modal__content">
        <div className="city-modal__header">
          <h2>Выберите город</h2>
          <button className="city-modal__close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="city-modal__search">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Поиск города..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="city-modal__list">
          {Object.keys(grouped).map(region => (
            <div key={region} className="city-modal__group">
              <div className="city-modal__group-title">{region}</div>
              {grouped[region].map(city => (
                <div 
                  key={city.name}
                  className={`city-modal__item ${selectedCity === city.name ? 'active' : ''}`}
                  onClick={() => handleSelect(city.name)}
                >
                  <span>{city.name}</span>
                  {selectedCity === city.name && <i className="fas fa-check"></i>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CityModal;