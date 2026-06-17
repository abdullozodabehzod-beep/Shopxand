import React from 'react';

function TelegramButton() {
  return (
    <a href="https://t.me/shopxand" target="_blank" className="telegram-btn" title="Написать в Telegram">
      <i className="fab fa-telegram-plane"></i>
      <span className="telegram-btn__text">Наш канал</span>
    </a>
  );
}

export default TelegramButton;