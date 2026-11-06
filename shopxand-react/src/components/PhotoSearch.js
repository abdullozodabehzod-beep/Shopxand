import React, { useState } from 'react';

function PhotoSearch({ products, onProductSelect, onClose }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showUpload, setShowUpload] = useState(true);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setShowUpload(false);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      // Простой анализ по цветам
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);
        
        const imageData = ctx.getImageData(0, 0, 50, 50);
        const pixels = imageData.data;
        
        let r = 0, g = 0, b = 0;
        for (let i = 0; i < pixels.length; i += 16) {
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
        }
        const count = pixels.length / 16;
        const avgR = Math.floor(r / count);
        const avgG = Math.floor(g / count);
        const avgB = Math.floor(b / count);

        // Ищем похожие по яркости
        const brightness = (avgR + avgG + avgB) / 3;
        const scored = products.map(p => ({
          product: p,
          score: Math.abs((p.brightness || 128) - brightness)
        }));
        scored.sort((a, b) => a.score - b.score);

        setResults(scored.slice(0, 6).map(s => s.product));
        setLoading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="photo-search-modal active">
      <div className="photo-search-modal__overlay" onClick={onClose}></div>
      <div className="photo-search-modal__content">
        <div className="photo-search-modal__header">
          <h3>📸 Поиск по фото</h3>
          <button className="photo-search-modal__close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="photo-search-modal__body">
          {showUpload && (
            <div className="photo-search-upload">
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Загрузите фото товара</p>
              <button onClick={() => document.getElementById('photoInput').click()}>Выбрать фото</button>
              <input type="file" id="photoInput" accept="image/*" style={{display:'none'}} onChange={handleFileSelect} />
            </div>
          )}

          {loading && (
            <div className="photo-search-loading">
              <div className="photo-search-spinner"></div>
              <p>Ищем похожие товары...</p>
            </div>
          )}

          {!showUpload && !loading && (
            <div className="photo-search-results">
              {results.length === 0 ? (
                <p>Ничего не найдено</p>
              ) : (
                results.map(p => (
                  <div key={p._id} className="related-card" onClick={() => { onProductSelect(p); onClose(); }}>
                    <div className="related-card__img">
                      <img src={p.img} alt={p.name} />
                    </div>
                    <div className="related-card__name">{p.name}</div>
                    <div className="related-card__price">{p.price} с.</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhotoSearch;