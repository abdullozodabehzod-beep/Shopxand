import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function About() {
  const { tr } = useLanguage();
  return (
    <div className="page-container">
      <div className="page-hero" style={{background: 'linear-gradient(135deg, #1a1a2e, #333)'}}>
        <h1>ℹ️ {tr('О компании ShopXand')}</h1>
        <p>{tr('Ваш надёжный интернет-магазин в Таджикистане')}</p>
      </div>

      <div className="page-content">
        <div className="about-intro">
          <h2>{tr('Кто мы?')}</h2>
          <p><strong>ShopXand</strong> — {tr('это современный интернет-магазин, который доставляет товары напрямую из Китая в Таджикистан. Мы работаем с 2024 года и уже помогли сотням клиентов получить качественные товары по доступным ценам.')}</p>
        </div>

        <h2>{tr('Почему выбирают нас?')}</h2>
        
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">💰</span>
            <h3>{tr('Цены без наценок')}</h3>
            <p>{tr('Прямые поставки из Китая позволяют нам держать цены ниже рыночных на 20-40%')}</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✅</span>
            <h3>{tr('Гарантия качества')}</h3>
            <p>{tr('Мы проверяем каждый товар перед отправкой клиенту')}</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚚</span>
            <h3>{tr('Доставка по всей стране')}</h3>
            <p>{tr('Доставляем в Душанбе, Худжанд, Куляб и другие города Таджикистана')}</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <h3>{tr('Оплата при получении')}</h3>
            <p>{tr('Вы платите только когда видите товар — никаких рисков')}</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💬</span>
            <h3>{tr('Поддержка 24/7')}</h3>
            <p>{tr('Отвечаем в Telegram, WhatsApp и по телефону')}</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <h3>{tr('Лёгкий возврат')}</h3>
            <p>{tr('Возврат в течение 7 дней, если товар не подошёл')}</p>
          </div>
        </div>

        <h2>{tr('Как мы работаем?')}</h2>
        
        <div className="workflow">
          <div className="workflow__step">
            <div className="workflow__num">1</div>
            <div>
              <h3>{tr('Вы заказываете')}</h3>
              <p>{tr('Выбираете товар на сайте и оформляете заказ')}</p>
            </div>
          </div>
          <div className="workflow__arrow">→</div>
          <div className="workflow__step">
            <div className="workflow__num">2</div>
            <div>
              <h3>{tr('Мы заказываем')}</h3>
              <p>{tr('Заказываем товар у производителей в Китае')}</p>
            </div>
          </div>
          <div className="workflow__arrow">→</div>
          <div className="workflow__step">
            <div className="workflow__num">3</div>
            <div>
              <h3>{tr('Доставляем')}</h3>
              <p>{tr('Товар прибывает в Душанбе за 12-18 дней')}</p>
            </div>
          </div>
          <div className="workflow__arrow">→</div>
          <div className="workflow__step">
            <div className="workflow__num">4</div>
            <div>
              <h3>{tr('Вы получаете')}</h3>
              <p>{tr('Курьер доставляет заказ, вы проверяете и платите')}</p>
            </div>
          </div>
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-num">500+</span>
            <span>{tr('Довольных клиентов')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">1000+</span>
            <span>{tr('Доставленных заказов')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">12-18</span>
            <span>{tr('Дней доставка')}</span>
          </div>
        </div>

        <div className="page-cta">
          <a href="/" className="cta-btn">🛍️ {tr('Начать покупки')}</a>
          <a href="/contact" className="cta-btn cta-btn--outline">📞 {tr('Связаться с нами')}</a>
        </div>
      </div>
    </div>
  );
}

export default About;