import React, { useState } from 'react';

function Checkout({ cart, user, onPlaceOrder, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: 'Душанбе',
    address: ''
  });
  const [delivery, setDelivery] = useState('courier');
  const [payment, setPayment] = useState('dc');
  const [orderId, setOrderId] = useState('');

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0) + (delivery === 'courier' ? 30 : 0);

  const handleSubmit = () => {
  if (!form.name || !form.phone || !form.address) {
    alert('Заполните все поля');
    return;
  }
  const newOrderId = 'SX-' + Date.now().toString().slice(-8);
  setOrderId(newOrderId);
  onPlaceOrder(form);
  setStep(3);
  
  // Окно в правом верхнем углу
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#1a1a2e;color:#fff;padding:16px 24px;border-radius:14px;z-index:99999;font-size:15px;font-weight:600;box-shadow:0 10px 40px rgba(0,0,0,0.3);animation:slideInRight 0.4s ease forwards,slideOutRight 0.4s ease 2s forwards;';
  toast.textContent = '✅ Заказ ' + newOrderId + ' подтверждён!';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
};

  return (
    <div className="checkout-modal active">
      <div className="checkout-modal__overlay" onClick={onClose}></div>
      <div className="checkout-modal__container">
        <div className="checkout-modal__header">
          <h2>Оформление заказа</h2>
          <button className="checkout-modal__close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="checkout-modal__steps">
          <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
            <span className="checkout-step__num">1</span>
            <span className="checkout-step__label">Доставка</span>
          </div>
          <div className="checkout-step__line"></div>
          <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
            <span className="checkout-step__num">2</span>
            <span className="checkout-step__label">Оплата</span>
          </div>
          <div className="checkout-step__line"></div>
          <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
            <span className="checkout-step__num">3</span>
            <span className="checkout-step__label">Готово</span>
          </div>
        </div>

        <div className="checkout-modal__body">
          {step === 1 && (
            <div className="checkout-step-content active">
              <h3 className="checkout-section__title">Контактные данные</h3>
              <div className="checkout-form__group">
                <label>Имя *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="checkout-form__group">
                <label>Телефон *</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="checkout-form__group">
                <label>Адрес *</label>
                <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              <div className="checkout-form__group">
                <label>Город</label>
                <select value={form.city} onChange={e => setForm({...form, city: e.target.value})}>
                  <option>Душанбе</option>
                  <option>Худжанд</option>
                  <option>Куляб</option>
                </select>
              </div>
              <button className="checkout-btn" onClick={() => setStep(2)}>
                Далее: Оплата <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-step-content active">
              <h3 className="checkout-section__title">Ваш заказ</h3>
              <div className="checkout-order__items">
                {cart.map(item => (
                  <div key={item._id} className="checkout-order__item">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      style={{width:40,height:40,objectFit:'contain',borderRadius:6}}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="checkout-order__item-name">{item.name}</span>
                    <span className="checkout-order__item-qty">×{item.quantity}</span>
                    <span className="checkout-order__item-price">{(item.price * item.quantity).toLocaleString()} с.</span>
                  </div>
                ))}
              </div>
              <div className="checkout-order__summary">
                <div className="checkout-order__row">
                  <span>Товары</span>
                  <span>{cart.reduce((s,i) => s + i.price * i.quantity, 0).toLocaleString()} с.</span>
                </div>
                <div className="checkout-order__row">
                  <span>Доставка</span>
                  <span>{delivery === 'courier' ? '30 с.' : 'Бесплатно'}</span>
                </div>
                <div className="checkout-order__row checkout-order__row--total">
                  <span>Итого</span>
                  <span>{total.toLocaleString()} с.</span>
                </div>
              </div>

                            <h3 className="checkout-section__title">Способ оплаты</h3>
              <div className="checkout-payment__options">
                <label className={`checkout-payment__option ${payment === 'dc' ? 'active' : ''}`}>
                  <input type="radio" name="payment" checked={payment === 'dc'} onChange={() => setPayment('dc')} />
                  <div className="checkout-payment__info">
                    <span className="checkout-payment__name">
                      <i className="fas fa-mobile-alt"></i> D/C (Душанбе Сити)
                    </span>
                    <span className="checkout-payment__desc">Оплата через D/C</span>
                  </div>
                </label>
                <label className={`checkout-payment__option ${payment === 'cash' ? 'active' : ''}`}>
                  <input type="radio" name="payment" checked={payment === 'cash'} onChange={() => setPayment('cash')} />
                  <div className="checkout-payment__info">
                    <span className="checkout-payment__name">
                      <i className="fas fa-money-bill-wave"></i> Наличные
                    </span>
                    <span className="checkout-payment__desc">Оплата при получении</span>
                  </div>
                </label>
                <label className={`checkout-payment__option ${payment === 'card' ? 'active' : ''}`}>
                  <input type="radio" name="payment" checked={payment === 'card'} onChange={() => setPayment('card')} />
                  <div className="checkout-payment__info">
                    <span className="checkout-payment__name">
                      <i className="fas fa-credit-card"></i> Карта
                    </span>
                    <span className="checkout-payment__desc">Visa, Mastercard</span>
                  </div>
                </label>
              </div>

              {payment === 'dc' && (
                <div className="checkout-dc-block" style={{marginBottom:16}}>
                  <div className="checkout-dc-number">
                    <span>Номер D/C:</span>
                    <strong>+992300003230</strong>
                    <button onClick={() => { navigator.clipboard.writeText('+992300003230'); alert('Номер скопирован!'); }}>
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                  <p style={{fontSize:12,color:'#999',margin:'8px 0'}}>Переведите сумму на этот номер и нажмите "Подтвердить заказ"</p>
                </div>
              )}

              <div style={{display: 'flex', gap: 10}}>
                <button className="checkout-btn checkout-btn--outline" onClick={() => setStep(1)}>
                  Назад
                </button>
                <button className="checkout-btn checkout-btn--success" onClick={handleSubmit}>
                  Подтвердить заказ <i className="fas fa-check"></i>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="checkout-step-content active">
              <div className="checkout-success">
                <div className="checkout-success__icon"><i className="fas fa-check-circle"></i></div>
                <h2>Заказ оформлен!</h2>
                <p>Номер заказа: <strong>{orderId}</strong></p>
                <div className="checkout-success__details">
                  <div className="checkout-success__row"><span>Имя:</span><span>{form.name}</span></div>
                  <div className="checkout-success__row"><span>Телефон:</span><span>{form.phone}</span></div>
                  <div className="checkout-success__row"><span>Адрес:</span><span>{form.address}</span></div>
                  <div className="checkout-success__row"><span>Сумма:</span><span>{total.toLocaleString()} с.</span></div>
                </div>
                <button className="checkout-btn" onClick={onClose}>Вернуться в магазин</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;