import React from 'react';

function Contact() {
  return (
    <div className="container" style={{padding: '40px 20px', maxWidth: '800px', margin: '0 auto'}}>
      <h1>📞 Контакты</h1>
      
      <div style={{background: '#f8f9fb', padding: '20px', borderRadius: '12px', margin: '15px 0'}}>
        <h3>📱 Телефон</h3>
        <p><a href="tel:+992300003230">+992 300 003 230</a></p>
      </div>

      <div style={{background: '#f8f9fb', padding: '20px', borderRadius: '12px', margin: '15px 0'}}>
        <h3>💬 WhatsApp</h3>
        <p><a href="https://wa.me/992300003230">Написать в WhatsApp</a></p>
      </div>

      <div style={{background: '#f8f9fb', padding: '20px', borderRadius: '12px', margin: '15px 0'}}>
        <h3>📧 Telegram</h3>
        <p><a href="https://t.me/shopxand">@shopxand</a></p>
      </div>

      <div style={{background: '#f8f9fb', padding: '20px', borderRadius: '12px', margin: '15px 0'}}>
        <h3>📍 Адрес</h3>
        <p>Таджикистан, Душанбе</p>
      </div>

      <div style={{background: '#f8f9fb', padding: '20px', borderRadius: '12px', margin: '15px 0'}}>
        <h3>🕐 Режим работы</h3>
        <p>Пн-Вс: 9:00 - 21:00</p>
      </div>
    </div>
  );
}

export default Contact;