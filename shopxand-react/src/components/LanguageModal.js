import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function LanguageModal({ onClose }) {
  const { lang, switchLanguage } = useLanguage();

  const languages = [
    { code: 'ru', name: 'Русский', native: 'Russian', flag: '🇷🇺' },
    { code: 'tg', name: 'Тоҷикӣ', native: 'Tajik', flag: '🇹🇯' },
    { code: 'en', name: 'English', native: 'Английский', flag: '🇺🇸' }
  ];

  return (
    <div className="lang-modal active">
      <div className="lang-modal__overlay" onClick={onClose}></div>
      <div className="lang-modal__content">
        <div className="lang-modal__handle"></div>
        <div className="lang-modal__header">
          <h2>Выберите язык / Забонро интихоб кунед / Select language</h2>
          <button className="lang-modal__close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="lang-modal__list">
          {languages.map(l => (
            <div 
              key={l.code}
              className={`lang-modal__item ${lang === l.code ? 'active' : ''}`}
              onClick={() => { switchLanguage(l.code); onClose(); }}
            >
              <div className="lang-modal__flag">{l.flag}</div>
              <div className="lang-modal__info">
                <div className="lang-modal__name">{l.name}</div>
                <div className="lang-modal__native">{l.native}</div>
              </div>
              <i className="fas fa-check-circle"></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LanguageModal;