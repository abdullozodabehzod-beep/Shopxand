import React from 'react';

function Delivery() {
  return (
    <div className="page-container">
      <div className="page-hero" style={{background: 'linear-gradient(135deg, #0066ff, #4d94ff)'}}>
        <h1>🚚 Доставка и оплата</h1>
        <p>Удобные способы получения вашего заказа</p>
      </div>

      <div className="page-content">
        <h2>📦 Как мы доставляем</h2>
        
        <div className="info-cards">
          <div className="info-card">
            <div className="info-card__icon">🇨🇳</div>
            <h3>Заказ из Китая</h3>
            <p>Мы заказываем товар напрямую от производителей в Китае</p>
            <span className="info-card__time">1-3 дня</span>
          </div>
          
          <div className="info-card">
            <div className="info-card__icon">✈️</div>
            <h3>Международная доставка</h3>
            <p>Товар отправляется в Таджикистан авиа или наземным транспортом</p>
            <span className="info-card__time">7-10 дней</span>
          </div>
          
          <div className="info-card">
            <div className="info-card__icon">📦</div>
            <h3>Прибытие в Душанбе</h3>
            <p>Товар проходит таможню и arrives на наш склад</p>
            <span className="info-card__time">2-3 дня</span>
          </div>
          
          <div className="info-card">
            <div className="info-card__icon">🏠</div>
            <h3>Доставка вам</h3>
            <p>Курьер доставляет заказ прямо к вашей двери</p>
            <span className="info-card__time">1-2 дня</span>
          </div>
        </div>

        <h2>🚗 Способы доставки по Душанбе</h2>
        
        <div className="delivery-options">
          <div className="delivery-option">
            <div className="delivery-option__header">
              <i className="fas fa-truck"></i>
              <div>
                <h3>Курьерская доставка</h3>
                <span>Доставка на дом или в офис</span>
              </div>
              <span className="delivery-option__price">30 сомони</span>
            </div>
            <ul>
              <li>✅ Доставка в удобное время</li>
              <li>✅ Предварительный звонок курьера</li>
              <li>✅ Возможность проверки товара</li>
            </ul>
          </div>

          <div className="delivery-option">
            <div className="delivery-option__header">
              <i className="fas fa-shipping-fast"></i>
              <div>
                <h3>Экспресс доставка</h3>
                <span>В течение 2-4 часов после прибытия</span>
              </div>
              <span className="delivery-option__price">50 сомони</span>
            </div>
            <ul>
              <li>✅ Самая быстрая доставка</li>
              <li>✅ Приоритетная обработка</li>
              <li>✅ Доставка день-в-день</li>
            </ul>
          </div>

          <div className="delivery-option">
            <div className="delivery-option__header">
              <i className="fas fa-store"></i>
              <div>
                <h3>Самовывоз</h3>
                <span>Заберите заказ самостоятельно</span>
              </div>
              <span className="delivery-option__price delivery-option__price--free">Бесплатно</span>
            </div>
            <ul>
              <li>✅ Адрес уточняется после заказа</li>
              <li>✅ Экономия на доставке</li>
              <li>✅ Гибкое время получения</li>
            </ul>
          </div>
        </div>

        <h2>💳 Способы оплаты</h2>
        
        <div className="payment-methods">
          <div className="payment-method">
            <i className="fas fa-money-bill-wave"></i>
            <div>
              <h3>Наличные при получении</h3>
              <p>Оплата курьеру при доставке заказа</p>
            </div>
          </div>
          
          <div className="payment-method">
            <i className="fas fa-mobile-alt"></i>
            <div>
              <h3>D/C (Душанбе Сити)</h3>
              <p>Перевод на номер <strong>300003230</strong></p>
            </div>
          </div>
          
          <div className="payment-method payment-method--coming">
            <i className="fas fa-credit-card"></i>
            <div>
              <h3>Банковская карта</h3>
              <p>Онлайн оплата (скоро)</p>
            </div>
          </div>
        </div>

        <div className="page-faq">
          <h2>❓ Частые вопросы</h2>
          
          <details className="faq-item">
            <summary>Сколько ждать заказ?</summary>
            <p>Общий срок доставки из Китая в Душанбе составляет 12-18 дней. Это включает заказ у производителя, международную доставку, таможню и доставку до вас.</p>
          </details>
          
          <details className="faq-item">
            <summary>Можно ли отменить заказ?</summary>
            <p>Да, вы можете отменить заказ в течение 24 часов после оформления. Для этого зайдите в раздел "Мои заказы" и нажмите "Отменить".</p>
          </details>
          
          <details className="faq-item">
            <summary>Что если товар не подошёл?</summary>
            <p>Вы можете вернуть товар в течение 7 дней после получения, если он не был в использовании и сохранены все ярлыки.</p>
          </details>
        </div>

        <div className="page-cta">
          <a href="/" className="cta-btn">🛍️ Перейти к покупкам</a>
        </div>
      </div>
    </div>
  );
}

export default Delivery;