import React, { useState, useEffect } from 'react';

function PwaInstall() {
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowInstall(false);
    });

    // Проверяем не установлено ли уже
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    }
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((result) => {
        if (result.outcome === 'accepted') {
          setShowInstall(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  if (!showInstall) return null;

  return (
    <div className="pwa-install-btn" style={{display: 'block'}}>
      <div className="pwa-install-btn__content">
        <div className="pwa-install-btn__icon">
          <svg width="32" height="32" viewBox="0 0 500 500">
            <rect width="500" height="500" fill="#0066ff" rx="80"/>
            <text x="250" y="380" fontFamily="Arial Black" fontWeight="900" fontSize="350" fill="white" textAnchor="middle">SX</text>
          </svg>
        </div>
        <div className="pwa-install-btn__text">
          <strong>Установить приложение</strong>
          <span>Быстрый доступ на телефоне</span>
        </div>
        <button className="pwa-install-btn__action" onClick={handleInstall}>
          <i className="fas fa-download"></i> Установить
        </button>
        <button className="pwa-install-btn__dismiss" onClick={() => setShowInstall(false)}>✕</button>
      </div>
    </div>
  );
}

export default PwaInstall;