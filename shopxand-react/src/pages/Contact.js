import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function Contact() {
  const { tr } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !phone) {
      setToastMessage('❌ ' + tr('Заполните имя и телефон'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Формируем сообщение для WhatsApp
    const text = `Здравствуйте! Меня зовут ${name}.%0AТелефон: ${phone}%0AСообщение: ${message || 'Нет сообщения'}`;
    
    // Открываем WhatsApp
    window.open(`https://wa.me/992300003230?text=${text}`, '_blank');
    
    // Показываем уведомление
    setToastMessage('✅ ' + tr('Открываем WhatsApp...'));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    // Очищаем форму
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="page-container">
      {/* Toast уведомление */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#1a1a2e',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '14px',
          zIndex: 99999,
          fontSize: '15px',
          fontWeight: '600',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          animation: 'slideInRight 0.3s ease',
          maxWidth: '350px'
        }}>
          {toastMessage}
        </div>
      )}

      <div className="page-hero" style={{background: 'linear-gradient(135deg, #00c853, #69f0ae)'}}>
        <h1>📞 {tr('Контакты')}</h1>
        <p>{tr('Мы всегда на связи!')}</p>
      </div>

      <div className="page-content">
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-card__icon"><i className="fas fa-phone"></i></div>
            <h3>{tr('Телефон')}</h3>
            <a href="tel:+992300003230">+992 300 003 230</a>
            <span>{tr('Пн-Вс: 9:00 - 21:00')}</span>
          </div>

          <div className="contact-card">
            <div className="contact-card__icon"><i className="fab fa-whatsapp"></i></div>
            <h3>WhatsApp</h3>
            <a href="https://wa.me/992300003230">{tr('Написать в WhatsApp')}</a>
            <span>{tr('Отвечаем в течение 5 минут')}</span>
          </div>

          <div className="contact-card">
            <div className="contact-card__icon"><i className="fab fa-telegram"></i></div>
            <h3>Telegram</h3>
            <a href="https://t.me/shopxand">@shopxand</a>
            <span>{tr('Канал с новинками')}</span>
          </div>

          <div className="contact-card">
            <div className="contact-card__icon"><i className="fas fa-map-marker-alt"></i></div>
            <h3>{tr('Адрес')}</h3>
            <p>{tr('Таджикистан, Душанбе')}</p>
            <span>{tr('Точный адрес уточняется после заказа')}</span>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>📩 {tr('Напишите нам')}</h2>
          <p style={{marginBottom: '15px', color: '#666', fontSize: '14px'}}>
            {tr('Заполните форму и вы будете перенаправлены в WhatsApp с готовым сообщением')}
          </p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder={tr('Ваше имя')} 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input 
              type="tel" 
              placeholder={tr('Телефон')} 
              required 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <textarea 
              placeholder={tr('Ваше сообщение...')} 
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button type="submit">
              <i className="fab fa-whatsapp"></i> {tr('Отправить в WhatsApp')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;