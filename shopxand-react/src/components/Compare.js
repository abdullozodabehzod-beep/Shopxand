import React from 'react';

function Compare({ compareList, onRemove, onClear }) {
  if (!compareList || compareList.length === 0) return null;

  const allSpecs = [];
  compareList.forEach(p => {
    if (p.material) allSpecs.push(['Материал', p.material]);
    if (p.season) allSpecs.push(['Сезон', p.season]);
    if (p.style) allSpecs.push(['Стиль', p.style]);
    if (p.sizes?.length > 0) allSpecs.push(['Размеры', p.sizes.join(', ')]);
    if (p.colors?.length > 0) allSpecs.push(['Цвета', p.colors.join(', ')]);
  });

  // Убираем дубликаты характеристик
  const uniqueSpecs = allSpecs.filter((spec, i, arr) => 
    arr.findIndex(s => s[0] === spec[0]) === i
  );

  return (
    <div className="compare-panel active">
      <div className="compare-panel__header">
        <h3>📊 Сравнение товаров ({compareList.length})</h3>
        <button onClick={onClear}>✕ Закрыть</button>
      </div>
      <div className="compare-panel__table">
        <table>
          <thead>
            <tr>
              <th>Характеристика</th>
              {compareList.map(p => (
                <th key={p._id}>
                  <img src={p.img} alt={p.name} />
                  <p>{p.name}</p>
                  <button onClick={() => onRemove(p._id)}>✕</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Цена</td>
              {compareList.map(p => (
                <td key={p._id} className="price">{p.price.toLocaleString()} с.</td>
              ))}
            </tr>
            <tr>
              <td>Категория</td>
              {compareList.map(p => <td key={p._id}>{p.cat}</td>)}
            </tr>
            <tr>
              <td>Рейтинг</td>
              {compareList.map(p => (
                <td key={p._id}>⭐ {p.rating || '0'} ({p.reviews || 0})</td>
              ))}
            </tr>
            {uniqueSpecs.map((spec, i) => (
              <tr key={i}>
                <td>{spec[0]}</td>
                {compareList.map(p => (
                  <td key={p._id}>
                    {p.material === spec[1] ? spec[1] :
                     p.season === spec[1] ? spec[1] :
                     p.style === spec[1] ? spec[1] :
                     p.sizes?.join(', ') === spec[1] ? spec[1] :
                     p.colors?.join(', ') === spec[1] ? spec[1] : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Compare;