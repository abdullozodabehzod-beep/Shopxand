import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col">
            <h4>ShopXand</h4>
            <p>Интернет-магазин с доставкой из Китая в Таджикистан</p>
          </div>
          <div className="footer__col">
            <h4>Информация</h4>
            <a href="/delivery">🚚 Доставка и оплата</a>
            <a href="/about">ℹ️ О нас</a>
            <a href="/contact">📞 Контакты</a>
          </div>
          <div className="footer__col">
            <h4>Контакты</h4>
            <a href="tel:+992300003230">📱 +992 300 003 230</a>
            <a href="https://wa.me/992300003230">💬 WhatsApp</a>
            <a href="https://t.me/shopxand">📧 Telegram</a>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© 2024 ShopXand. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;