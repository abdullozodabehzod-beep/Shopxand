import React, { useState } from 'react';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: '👋 Здравствуйте! Я менеджер ShopXand. Чем могу помочь?', type: 'support', time: 'Только что' }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMsg = { text: message, type: 'user', time: new Date().toLocaleTimeString() };
    setMessages([...messages, newMsg]);
    setMessage('');
    
    // Отправка в Telegram
    fetch('/api/telegram/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });
    
    // Авто-ответ
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'Спасибо за обращение! Менеджер скоро ответит. ⏳', type: 'support', time: new Date().toLocaleTimeString() }]);
    }, 1000);
  };

  return (
    <div className="chat-widget">
      <button className="chat-widget__btn" onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-comment-dots"></i>
      </button>

      {isOpen && (
        <div className="chat-widget__window active">
          <div className="chat-widget__header">
            <div className="chat-widget__header-info">
              <div className="chat-widget__avatar"><i className="fas fa-headset"></i></div>
              <div>
                <h4>Поддержка ShopXand</h4>
                <span>Онлайн</span>
              </div>
            </div>
            <button className="chat-widget__close-btn" onClick={() => setIsOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="chat-widget__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message chat-message--${msg.type}`}>
                <div className="chat-message__bubble">
                  <p>{msg.text}</p>
                  <span className="chat-message__time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="chat-widget__form">
            <input 
              type="text" 
              placeholder="Введите сообщение..." 
              value={message} 
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;