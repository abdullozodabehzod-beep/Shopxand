import React, { useState } from 'react';

function StockNotify({ product, user, onClose }) {
  const [phone, setPhone] = useState(user?.phone || '');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!phone || phone.length < 9) {
      alert('Введите корректный номер телефона');
      return;
    }
    
    // Сохраняем подписку в localStorage
    const subscriptions = JSON.parse(localStorage.getItem('stock_notifications') || '[]');
    subscriptions.push({
      productId: product._id,
      productName: product.name,
      phone: phone,
      date: new Date().toISOString()
    });
    localStorage.setItem('stock_notifications', JSON.stringify(subscriptions));
    
    setSubscribed(true);
    
    // Отправляем уведомление в Telegram
    fetch('/api/telegram/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `🔔 Запрос на уведомление\n📦 ${product.name}\n📞 ${phone}\n💰 ${product.price} с.`
      })
    });
  };

  if (subscribed) {
    return (
      <div className="stock-notify">
        <div className="stock-notify__success">
          <span>✅</span>
          <p>Вы подписались на уведомление!</p>
          <p style={{fontSize:'12px',color:'#999'}}>Мы сообщим когда товар появится</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-notify">
      <div className="stock-notify__icon">📦</div>
      <h4>Товара нет в наличии</h4>
      <p>Оставьте телефон, мы сообщим когда товар появится</p>
      <div className="stock-notify__form">
        <input 
          type="tel" 
          placeholder="+992 XXX XXX XXX" 
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <button onClick={handleSubscribe}>
          <i className="fas fa-bell"></i> Уведомить
        </button>
      </div>
      <button className="stock-notify__close" onClick={onClose}>Закрыть</button>
    </div>
  );
}

export default StockNotify;