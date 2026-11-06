import React, { useState, useEffect, useRef } from 'react';

function VoiceSearch({ onSearch, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('Нажмите и говорите');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ru-RU';
      recognitionRef.current.interimResults = true;
      recognitionRef.current.continuous = false;

      recognitionRef.current.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const text = result[0].transcript;
        setTranscript(text);
        
        if (result.isFinal) {
          setStatus('✅ Распознано!');
          setTimeout(() => {
            onSearch(text);
            onClose();
          }, 1000);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setStatus('❌ Ошибка: ' + event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (!transcript) setStatus('Нажмите и говорите');
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Голосовой поиск не поддерживается в вашем браузере. Используйте Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatus('Нажмите и говорите');
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      setStatus('🎤 Говорите...');
    }
  };

  const voiceCommands = [
    { text: 'Покажи рубашки', query: 'рубашка' },
    { text: 'Найди кроссовки', query: 'кроссовка' },
    { text: 'Покажи часы', query: 'часы' },
    { text: 'Найди наушники', query: 'наушник' },
    { text: 'Покажи одежду', query: 'Одежда' },
    { text: 'Покажи электронику', query: 'Электроника' },
  ];

  return (
    <div className="voice-search active">
      <div className="voice-search__overlay" onClick={onClose}></div>
      <div className="voice-search__modal">
        <button className="voice-search__close" onClick={onClose}>✕</button>
        
        <div className="voice-search__icon" onClick={toggleListening}>
          <div className={`voice-search__pulse ${isListening ? 'active' : ''}`}></div>
          <i className={`fas fa-microphone${isListening ? '' : '-alt'}`}></i>
        </div>

        <h3>{status}</h3>
        
        {transcript && (
          <div className="voice-search__transcript">
            "{transcript}"
          </div>
        )}

        <p style={{marginTop:'12px',color:'#999',fontSize:'13px'}}>
          {isListening ? 'Говорите...' : 'Нажмите на микрофон и скажите что ищете'}
        </p>

        <div className="voice-search__commands">
          <p>Примеры команд:</p>
          <div className="voice-search__commands-grid">
            {voiceCommands.map((cmd, i) => (
              <button key={i} onClick={() => { onSearch(cmd.query); onClose(); }}>
                🗣 {cmd.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceSearch;