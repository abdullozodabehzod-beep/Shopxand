import React from 'react';

function About() {
  return (
    <div className="page-container">
      <div className="page-hero" style={{background: 'linear-gradient(135deg, #1a1a2e, #333)'}}>
        <h1>ℹ️ О компании ShopXand</h1>
        <p>Ваш надёжный интернет-магазин в Таджикистане</p>
      </div>

      <div className="page-content">
        <div className="about-intro">
          <h2>Кто мы?</h2>
          <p><strong>ShopXand</strong> — это современный интернет-магазин, который доставляет товары напрямую из Китая в Таджикистан. Мы работаем с 2024 года и уже помогли сотням клиентов получить качественные товары по доступным ценам.</p>
        </div>

        <h2>Почему выбирают нас?</h2>
        
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">💰</span>
            <h3>Цены без наценок</h3>
            <p>Прямые поставки из Китая позволяют нам держать цены ниже рыночных на 20-40%</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✅</span>
            <h3>Гарантия качества</h3>
            <p>Мы проверяем каждый товар перед отправкой клиенту</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚚</span>
            <h3>Доставка по всей стране</h3>
            <p>Доставляем в Душанбе, Худжанд, Куляб и другие города Таджикистана</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <h3>Оплата при получении</h3>
            <p>Вы платите только когда видите товар — никаких рисков</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💬</span>
            <h3>Поддержка 24/7</h3>
            <p>Отвечаем в Telegram, WhatsApp и по телефону</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <h3>Лёгкий возврат</h3>
            <p>Возврат в течение 7 дней, если товар не подошёл</p>
          </div>
        </div>

        <h2>Как мы работаем?</h2>
        
        <div className="workflow">
          <div className="workflow__step">
            <div className="workflow__num">1</div>
            <div>
              <h3>Вы заказываете</h3>
              <p>Выбираете товар на сайте и оформляете заказ</p>
            </div>
          </div>
          <div className="workflow__arrow">→</div>
          <div className="workflow__step">
            <div className="workflow__num">2</div>
            <div>
              <h3>Мы заказываем</h3>
              <p>Заказываем товар у производителей в Китае</p>
            </div>
          </div>
          <div className="workflow__arrow">→</div>
          <div className="workflow__step">
            <div className="workflow__num">3</div>
            <div>
              <h3>Доставляем</h3>
              <p>Товар arrives в Душанбе за 12-18 дней</p>
            </div>
          </div>
          <div className="workflow__arrow">→</div>
          <div className="workflow__step">
            <div className="workflow__num">4</div>
            <div>
              <h3>Вы получаете</h3>
              <p>Курьер доставляет заказ, вы проверяете и платите</p>
            </div>
          </div>
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-num">500+</span>
            <span>Довольных клиентов</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">1000+</span>
            <span>Доставленных заказов</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">12-18</span>
            <span>Дней доставка</span>
          </div>
        </div>

        <div className="page-cta">
          <a href="/" className="cta-btn">🛍️ Начать покупки</a>
          <a href="/contact" className="cta-btn cta-btn--outline">📞 Связаться с нами</a>
        </div>
      </div>
    </div>
  );
}

export default About;