import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

function PriceAlert({ product, onClose }) {
  const { tr } = useLanguage();
  const { formatPrice } = useCurrency();
  const [targetPrice, setTargetPrice] = useState(product.price);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
       if (!targetPrice || targetPrice >= product.price) {
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#ff4757;color:#fff;padding:12px 24px;border-radius:10px;z-index:9999;font-weight:600;animation:fadeInOut 3s forwards;';
      toast.textContent = '❌ ' + tr('Укажите цену ниже текущей');
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      return;
    }

    const alerts = JSON.parse(localStorage.getItem('shopxand_price_alerts') || '[]');
    alerts.push({
      productId: product._id,
      productName: product.name,
      currentPrice: product.price,
      targetPrice: targetPrice,
      email: email,
      date: new Date().toISOString()
    });
    localStorage.setItem('shopxand_price_alerts', JSON.stringify(alerts));
    setSubscribed(true);
  };

  const checkPriceDrop = () => {
    const alerts = JSON.parse(localStorage.getItem('shopxand_price_alerts') || '[]');
    const productAlerts = alerts.filter(a => a.productId === product._id);
    
    if (productAlerts.length > 0 && product.price <= productAlerts[0].targetPrice) {
      // Отправляем уведомление
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('💰 ' + tr('Цена снизилась!'), {
          body: `${product.name} ${tr('теперь стоит')} ${formatPrice(product.price)}!`,
          icon: '/img/icons/icon-192x192.png'
        });
      }
      
      // Удаляем отработанные алерты
      const updated = alerts.filter(a => a.productId !== product._id);
      localStorage.setItem('shopxand_price_alerts', JSON.stringify(updated));
      return true;
    }
    return false;
  };

  // Проверяем при открытии
  React.useEffect(() => {
    checkPriceDrop();
  }, []);

  if (subscribed) {
    return (
      <div className="price-alert active">
        <div className="price-alert__overlay" onClick={onClose}></div>
        <div className="price-alert__modal">
          <div className="price-alert__success">
            <span>✅</span>
            <h3>{tr('Уведомление создано!')}</h3>
            <p>{tr('Мы сообщим когда цена на')} "{product.name}" {tr('снизится до')} {targetPrice.toLocaleString()} {tr('сомони')}</p>
            <button onClick={onClose}>OK</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="price-alert active">
      <div className="price-alert__overlay" onClick={onClose}></div>
      <div className="price-alert__modal">
        <button className="price-alert__close" onClick={onClose}>✕</button>
        <h3>💰 {tr('Узнать о снижении цены')}</h3>
        <p>{tr('Текущая цена:')} <strong>{formatPrice(product.price)}</strong></p>
        
        <div className="price-alert__form">
          <label>{tr('Желаемая цена (сомони):')}</label>
          <input 
            type="number" 
            value={targetPrice}
            onChange={e => setTargetPrice(Number(e.target.value))}
            placeholder={tr('Например: 100')}
          />
          <button onClick={handleSubscribe}>
            🔔 {tr('Уведомить о снижении')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PriceAlert;