import React, { useState, useRef, useEffect } from 'react';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: '👋 Здравствуйте! Я чат-бот ShopXand. Задайте мне вопрос!', type: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

    const answers = {
    'доставка': '🚚 Доставка из Китая в Душанбе занимает 12-18 дней. По городу доставляем за 1-3 дня. Экспресс-доставка — 2-4 часа.',
    'сколько': '⏱ Доставка из Китая: 12-18 дней. Курьером по Душанбе: 1-3 дня. Экспресс: 2-4 часа.',
    'оплата': '💳 Способы оплаты: наличные при получении, D/C (Душанбе Сити) на номер 300003230. Карты временно недоступны.',
    'карта': '💳 Онлайн-оплата картой временно недоступна. Доступна оплата наличными и через D/C.',
    'как': '📦 Вы оформляете заказ → мы заказываем из Китая → доставляем в Душанбе → вы получаете!',
    'цена': '💰 Цены указаны на сайте. Они ниже рыночных, так как мы заказываем напрямую из Китая.',
    'размер': '📏 Размеры указаны в карточке товара. При заказе вы можете выбрать нужный размер.',
    'гарантия': '✅ Мы гарантируем качество товаров. Если товар не подошёл — вернём деньги в течение 7 дней.',
    'контакт': '📞 Телефон: +992 300 003 230 | WhatsApp: wa.me/992300003230 | Telegram: @shopxand',
    'телефон': '📞 Наш номер: +992 300 003 230. Звоните с 9:00 до 21:00.',
    'адрес': '📍 Мы находимся в Душанбе. Доставка по всему Таджикистану: Худжанд, Куляб, Бохтар.',
    'возврат': '🔄 Возврат возможен в течение 7 дней после получения. Товар должен быть в оригинальной упаковке.',
    'скидка': '🎉 Следите за акциями на сайте и в нашем Telegram канале @shopxand!',
    'акция': '🎉 Сейчас действуют скидки на категории Одежда и Электроника. Следите за обновлениями!',
    'новинка': '🆕 Новые поступления каждую неделю! Следите за разделом "Популярные товары".',
    'доставка город': '🏙 Доставляем по Душанбе, Худжанду, Кулябу, Бохтару. Стоимость зависит от города.',
    'отзыв': '⭐ Вы можете оставить отзыв в карточке товара. Мы ценим ваше мнение!',
    'жалоба': '😔 Если у вас проблема с заказом, напишите нам в WhatsApp: +992 300 003 230.',
    'помощь': '👋 Я могу ответить на вопросы о доставке, оплате, размерах, возврате. Спросите!',
    'прайс': '💰 Все цены указаны на сайте в карточках товаров. Они актуальны.',
    'скидка промокод': '🏷 Промокоды публикуются в нашем Telegram канале. Подпишитесь: @shopxand',
    'дефолт': '🤔 Я пока не знаю ответа. Напишите нам в WhatsApp: +992 300 003 230 или в Telegram: @shopxand'
  };

  const getAnswer = (question) => {
    const q = question.toLowerCase();
    for (let key in answers) {
      if (q.includes(key)) return answers[key];
    }
    return answers['дефолт'];
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { text: input, type: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg = { text: getAnswer(input), type: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

   const quickQuestions = [
    '🚚 Доставка', '💳 Оплата', '📏 Размеры', '🔄 Возврат',
    '📞 Контакты', '💰 Цена', '🎉 Акция', '🆕 Новинка'
  ];

  return (
    <>
      <button className="chatbot__btn" onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-robot"></i>
      </button>

      {isOpen && (
        <div className="chatbot__window">
          <div className="chatbot__header">
            <span>🤖 Чат-бот ShopXand</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chatbot__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot__msg chatbot__msg--${msg.type}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot__quick">
            {quickQuestions.map((q, i) => (
              <button key={i} onClick={() => { setInput(q); setTimeout(handleSend, 100); }}>
                {q}
              </button>
            ))}
          </div>
          <div className="chatbot__input">
            <input 
              type="text" 
              placeholder="Задайте вопрос..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;