import React, { useState } from 'react';

function QuickOrder({ product, onClose }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone || phone.length < 9) {
      alert('Введите корректный номер телефона');
      return;
    }

    setLoading(true);

    // Отправляем заказ в Telegram
    const BOT_TOKEN = '8265957442:AAFWnqXyl8TJJzZXsv3vxXRCuWwWd_aY9mE';
    const CHAT_ID = '5282056467';
    
    const message = `📞 *БЫСТРЫЙ ЗАКАЗ!*\n\n` +
      `👤 *Имя:* ${name || 'Не указано'}\n` +
      `📱 *Телефон:* ${phone}\n` +
      `🛍 *Товар:* ${product?.name || 'Не указан'}\n` +
      `💰 *Цена:* ${product?.price?.toLocaleString() || '0'} с.\n` +
      `📏 *Размер:* ${size || 'Не выбран'}\n` +
      `🎨 *Цвет:* ${color || 'Не выбран'}\n\n` +
      `📞 *Нужно перезвонить клиенту!*`;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      setSubmitted(true);
    } catch (err) {
      alert('Ошибка. Позвоните нам: +992 300 003 230');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="quick-order active">
        <div className="quick-order__overlay" onClick={onClose}></div>
        <div className="quick-order__modal">
          <div className="quick-order__success">
            <span>✅</span>
            <h3>Заказ принят!</h3>
            <p>Мы перезвоним вам в течение 15 минут</p>
            <button onClick={onClose}>Закрыть</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-order active">
      <div className="quick-order__overlay" onClick={onClose}></div>
      <div className="quick-order__modal">
        <button className="quick-order__close" onClick={onClose}>✕</button>
        <h3>📞 Быстрый заказ</h3>
        <p>Оставьте номер — мы перезвоним и оформим заказ</p>

        {product && (
          <div className="quick-order__product">
            <img src={product.img} alt={product.name} />
            <div>
              <strong>{product.name}</strong>
              <span>{product.price?.toLocaleString()} с.</span>
            </div>
          </div>
        )}

        <input 
          type="text" 
          placeholder="Ваше имя" 
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input 
          type="tel" 
          placeholder="+992 XXX XXX XXX *" 
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        
        {product?.sizes?.length > 0 && (
          <select value={size} onChange={e => setSize(e.target.value)}>
            <option value="">Размер</option>
            {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        
        {product?.colors?.length > 0 && (
          <select value={color} onChange={e => setColor(e.target.value)}>
            <option value="">Цвет</option>
            {product.colors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}

        <button 
          className="quick-order__btn" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '⏳ Отправка...' : '📞 Заказать звонок'}
        </button>
        <p style={{fontSize:'11px',color:'#999',textAlign:'center',marginTop:'8px'}}>
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных
        </p>
      </div>
    </div>
  );
}

export default QuickOrder;