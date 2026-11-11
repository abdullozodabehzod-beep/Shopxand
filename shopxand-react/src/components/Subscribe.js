import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

function Subscribe({ product, onClose }) {
  const { tr } = useLanguage();
  const { formatPrice } = useCurrency();
  const [frequency, setFrequency] = useState('monthly');
  const [quantity, setQuantity] = useState(1);

  const frequencies = [
    { value: 'weekly', label: tr('Каждую неделю'), discount: 5, delivery: tr('каждые 7 дней') },
    { value: 'biweekly', label: tr('Каждые 2 недели'), discount: 7, delivery: tr('каждые 14 дней') },
    { value: 'monthly', label: tr('Каждый месяц'), discount: 10, delivery: tr('каждый месяц') },
    { value: 'quarterly', label: tr('Каждые 3 месяца'), discount: 15, delivery: tr('каждые 3 месяца') },
  ];

  const selected = frequencies.find(f => f.value === frequency);
  const originalPrice = product.price * quantity;
  const discountAmount = Math.round(originalPrice * selected.discount / 100);
  const finalPrice = originalPrice - discountAmount;

  const handleSubscribe = () => {
    try {
      const subscription = {
        productId: product._id,
        productName: product.name,
        frequency: frequency,
        frequencyLabel: selected.label,
        quantity: quantity,
        price: finalPrice,
        discount: selected.discount,
        nextDelivery: new Date(Date.now() + getDaysFromFrequency(frequency) * 24 * 60 * 60 * 1000).toISOString(),
        startDate: new Date().toISOString()
      };

      // Сохраняем подписку
      const subs = JSON.parse(localStorage.getItem('shopxand_subscriptions') || '[]');
      subs.push(subscription);
      localStorage.setItem('shopxand_subscriptions', JSON.stringify(subs));

      // Toast
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#1a1a2e;color:#fff;padding:14px 24px;border-radius:12px;z-index:9999;font-weight:600;';
      toast.textContent = '✅ ' + tr('Подписка оформлена! Скидка') + ' ' + selected.discount + '%';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      
      onClose();
    } catch (err) {
      // Если localStorage недоступен — показываем ошибку
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#ff4757;color:#fff;padding:14px 24px;border-radius:12px;z-index:9999;font-weight:600;';
      toast.textContent = '❌ ' + tr('Не удалось сохранить подписку');
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  const getDaysFromFrequency = (freq) => {
    switch(freq) {
      case 'weekly': return 7;
      case 'biweekly': return 14;
      case 'monthly': return 30;
      case 'quarterly': return 90;
      default: return 30;
    }
  };

  return (
    <div className="subscribe-modal active">
      <div className="subscribe-modal__overlay" onClick={onClose}></div>
      <div className="subscribe-modal__content">
        <button className="subscribe-modal__close" onClick={onClose}>✕</button>
        
        <div className="subscribe-modal__header">
          <span className="subscribe-modal__badge">📦 Subscribe & Save</span>
          <h2>{tr('Подписка на')} {product.name}</h2>
          <p>{tr('Регулярная доставка со скидкой до 15%')}</p>
        </div>

        <div className="subscribe-modal__frequencies">
          {frequencies.map(f => (
            <label 
              key={f.value}
              className={`subscribe-option ${frequency === f.value ? 'active' : ''}`}
              onClick={() => setFrequency(f.value)}
            >
              <input type="radio" name="frequency" checked={frequency === f.value} onChange={() => {}} />
              <div className="subscribe-option__info">
                <strong>{f.label}</strong>
                <span>{tr('Доставка')} {f.delivery}</span>
              </div>
              <div className="subscribe-option__discount">-{f.discount}%</div>
            </label>
          ))}
        </div>

        <div className="subscribe-modal__quantity">
          <span>{tr('Количество:')}</span>
          <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>−</button>
          <span className="subscribe-modal__qty">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        <div className="subscribe-modal__summary">
          <div className="subscribe-modal__row">
            <span>{tr('Цена без подписки:')}</span>
            <span>{formatPrice(originalPrice)}</span>
          </div>
          <div className="subscribe-modal__row">
            <span>{tr('Скидка')} ({selected.discount}%):</span>
            <span style={{color:'#00c853'}}>-{formatPrice(discountAmount)}</span>
          </div>
          <div className="subscribe-modal__row subscribe-modal__row--total">
            <span>{tr('Итого:')}</span>
            <span>{formatPrice(finalPrice)}</span>
          </div>
          <div className="subscribe-modal__row" style={{fontSize:'12px',color:'#999'}}>
            <span>{tr('Следующая доставка:')}</span>
            <span>{new Date(Date.now() + getDaysFromFrequency(frequency) * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>

        <button className="subscribe-modal__btn" onClick={handleSubscribe}>
          📦 {tr('Оформить подписку')} — {formatPrice(finalPrice)}
        </button>
      </div>
    </div>
  );
}

export default Subscribe;