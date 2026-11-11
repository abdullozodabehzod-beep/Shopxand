import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function TelegramButton() {
  const { tr } = useLanguage();
  return (
    <a href="https://t.me/shopxand" target="_blank" className="telegram-btn" title={tr('Написать в Telegram')} rel="noopener noreferrer">
      <i className="fab fa-telegram-plane"></i>
      <span className="telegram-btn__text">{tr('Наш канал')}</span>
    </a>
  );
}

export default TelegramButton;