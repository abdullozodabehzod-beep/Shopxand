import React from 'react';

function Delivery() {
  return (
    <div className="container" style={{padding: '40px 20px', maxWidth: '800px', margin: '0 auto'}}>
      <h1>🚚 Доставка и оплата</h1>
      
      <h2>Способы доставки</h2>
      <div style={{background: '#f8f9fb', padding: '20px', borderRadius: '12px', margin: '15px 0'}}>
        <h3>🚗 Курьерская доставка по Душанбе</h3>
        <p>Стоимость: <strong>30 сомони</strong></p>
        <p>Срок: <strong>1-3 дня</strong> после прибытия товара</p>
      </div>

      <div style={{background: '#f8f9fb', padding: '20px', borderRadius: '12px', margin: '15px 0'}}>
        <h3>⚡ Экспресс доставка</h3>
        <p>Стоимость: <strong>50 сомони</strong></p>
        <p>Срок: <strong>2-4 часа</strong> после прибытия товара</p>
      </div>

      <div style={{background: '#f8f9fb', padding: '20px', borderRadius: '12px', margin: '15px 0'}}>
        <h3>🏪 Самовывоз</h3>
        <p>Стоимость: <strong>Бесплатно</strong></p>
        <p>Адрес: Душанбе, уточняется после заказа</p>
      </div>

      <h2>📦 Доставка из Китая</h2>
      <p>Все товары доставляются из Китая. Срок доставки: <strong>12-18 дней</strong>.</p>

      <h2>💳 Способы оплаты</h2>
      <ul>
        <li>Наличные при получении</li>
        <li>D/C (Душанбе Сити) — перевод на номер <strong>300003230</strong></li>
        <li>Банковская карта (временно недоступна)</li>
      </ul>
    </div>
  );
}

export default Delivery;